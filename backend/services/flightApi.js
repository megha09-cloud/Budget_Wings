// Only file that talks to the external flight API (SerpApi, Google Flights engine). Swap providers here.
const fail = (status, code, message) => Object.assign(new Error(message), { status, code });

export const CABINS = ['Economy', 'Premium Economy', 'Business', 'First Class']; // SerpApi travel_class 1-4
export async function searchFlights({ from, to, date, passengers, cabin = 1 }) {
  const key = process.env.FLIGHT_API_KEY;
  if (!key) throw fail(503, 'API_KEY_MISSING', 'Flight API key is not configured. Add FLIGHT_API_KEY to backend/.env.');
  const url = new URL('https://serpapi.com/search.json');
  Object.entries({ engine: 'google_flights', departure_id: from, arrival_id: to, outbound_date: date, type: 2, adults: passengers, travel_class: cabin, currency: 'INR', hl: 'en', gl: 'in', api_key: key })
    .forEach(([k, v]) => url.searchParams.set(k, v));
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 20000);
  let res;
  try { res = await fetch(url, { signal: ctl.signal }); }
  catch (e) { throw e.name === 'AbortError' ? fail(504, 'API_TIMEOUT', 'The flight service took too long to respond.') : fail(502, 'NETWORK_ERROR', 'Could not reach the flight service.'); }
  finally { clearTimeout(t); }
  const data = await res.json().catch(() => null);
  if (!data || typeof data !== 'object') throw fail(502, 'INVALID_RESPONSE', 'The flight service returned an invalid response.');
  if (data.error) {
    if (/no results|hasn't returned any results/i.test(data.error)) return [];
    throw fail(502, 'API_FAILURE', `Flight service error: ${data.error}`);
  }
  if (!res.ok) throw fail(502, 'API_FAILURE', `Flight service responded with status ${res.status}.`);
  const groups = [...(data.best_flights || []).map(g => ({ ...g, _best: true })), ...(data.other_flights || [])];
  return groups.map((g, i) => normalize(g, i, cabin)).filter(Boolean);
}

function normalize(g, i, cabin) {
  const segs = Array.isArray(g?.flights) ? g.flights : [];
  const price = Number(g?.price);
  if (!segs.length || !(price > 0)) return null; // skip entries with missing fare / segments
  const a = segs[0], z = segs[segs.length - 1];
  return {
    id: `${a.flight_number || 'F'}-${a.departure_airport?.time}-${i}`.replace(/\s/g, ''),
    airline: a.airline, airlines: [...new Set(segs.map(s => s.airline).filter(Boolean))], logo: g.airline_logo || a.airline_logo || null,
    flightNumbers: segs.map(s => s.flight_number).filter(Boolean),
    from: { code: a.departure_airport?.id, name: a.departure_airport?.name }, to: { code: z.arrival_airport?.id, name: z.arrival_airport?.name },
    departure: a.departure_airport?.time, arrival: z.arrival_airport?.time,
    durationMin: Number(g.total_duration) || segs.reduce((s, x) => s + (x.duration || 0), 0),
    stops: segs.length - 1, price, best: !!g._best, cabin: segs[0].travel_class || CABINS[cabin - 1], cabins: [...new Set(segs.map(s => s.travel_class).filter(Boolean))], currency: 'INR',
    layovers: (g.layovers || []).map(l => ({ airport: l.name, code: l.id, durationMin: l.duration })),
    segments: segs.map(s => ({ airline: s.airline, flightNumber: s.flight_number, from: s.departure_airport?.id, fromName: s.departure_airport?.name, departure: s.departure_airport?.time,
      to: s.arrival_airport?.id, toName: s.arrival_airport?.name, arrival: s.arrival_airport?.time, durationMin: s.duration, aircraft: s.airplane, travelClass: s.travel_class, legroom: s.legroom })),
    carbonGrams: g.carbon_emissions?.this_flight ?? null
  };
}
