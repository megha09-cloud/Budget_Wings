// Run: npm test  (no database or API key needed; the flight API call is mocked)
import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveAirport, resolveRoute, searchAirports } from '../services/airports.js';
import { searchFlights } from '../services/flightApi.js';

const code = t => resolveAirport(t)?.code;

test('city names resolve (From and To use the same logic)', () => {
  const exp = { Delhi: ['DEL', 'Delhi (DEL)'], Mumbai: ['BOM', 'Mumbai (BOM)'], Dubai: ['DXB', 'Dubai (DXB)'], London: ['LHR', 'London Heathrow (LHR)'],
    Singapore: ['SIN', 'Singapore (SIN)'], 'New York': ['JFK', 'New York JFK (JFK)'], Bangkok: ['BKK', 'Bangkok Suvarnabhumi (BKK)'], Paris: ['CDG', 'Paris Charles de Gaulle (CDG)'] };
  for (const [t, [c, l]] of Object.entries(exp)) { const a = resolveAirport(t); assert.equal(a.code, c, t); assert.equal(a.label, l, t); }
});
test('IATA codes, any case, names, old names, partial typing, suggestion labels', () => {
  assert.equal(code('DEL'), 'DEL'); assert.equal(code('del'), 'DEL'); assert.equal(code('dxb'), 'DXB'); assert.equal(code('LHR'), 'LHR'); assert.equal(code('JFK'), 'JFK');
  assert.equal(code('Heathrow'), 'LHR'); assert.equal(code('Changi'), 'SIN'); assert.equal(code('Schiphol'), 'AMS'); assert.equal(code('Indira Gandhi'), 'DEL');
  assert.equal(code('Bombay'), 'BOM'); assert.equal(code('Bangalore'), 'BLR'); assert.equal(code('new delhi'), 'DEL'); assert.equal(code('  mumbai  '), 'BOM');
  assert.equal(code('new yor'), 'JFK'); assert.equal(code('Delhi airport'), 'DEL'); assert.equal(code('Dubai International Airport'), 'DXB');
  assert.equal(code('London Gatwick (LGW)'), 'LGW'); assert.equal(code('Newark'), 'EWR'); assert.equal(code('goa'), 'GOI');
});
test('unknown airport gives a helpful error; same airport and empty are rejected', () => {
  const r = resolveRoute('Zzzxq', 'Dubai'); assert.equal(r.code, 'AIRPORT_NOT_FOUND'); assert.equal(r.field, 'from'); assert.match(r.error, /couldn't find that airport/);
  assert.equal(resolveRoute('Delhi', 'Qqqwww').field, 'to');
  assert.equal(resolveRoute('Delhi', 'DEL').code, 'SAME_AIRPORT'); assert.equal(resolveRoute('', 'Dubai').code, 'EMPTY_INPUT');
});
test('autocomplete: city, name, country, code', () => {
  assert.equal(searchAirports('lon')[0].code, 'LHR'); assert.ok(searchAirports('london').length >= 4);
  assert.equal(searchAirports('changi')[0].code, 'SIN'); assert.equal(searchAirports('DXB')[0].code, 'DXB');
  const india = searchAirports('India', 8); assert.ok(india.length === 8 && india.every(a => a.country === 'India'));
  assert.ok(searchAirports('uae').every(a => a.country === 'United Arab Emirates'));
});
test('required routes send the right departure_id / arrival_id to the flight API', async () => {
  process.env.FLIGHT_API_KEY = 'test';
  const cases = [['Delhi', 'Mumbai', 'DEL', 'BOM'], ['Mumbai', 'Delhi', 'BOM', 'DEL'], ['Delhi', 'Dubai', 'DEL', 'DXB'], ['Delhi', 'London', 'DEL', 'LHR'], ['Mumbai', 'Singapore', 'BOM', 'SIN'],
    ['Delhi', 'New York', 'DEL', 'JFK'], ['Dubai', 'London', 'DXB', 'LHR'], ['Singapore', 'Bangkok', 'SIN', 'BKK'], ['DEL', 'DXB', 'DEL', 'DXB'], ['Delhi (DEL)', 'London Heathrow (LHR)', 'DEL', 'LHR']];
  for (const [f, t, dep, arr] of cases) {
    const route = resolveRoute(f, t); assert.ok(!route.error, f + ' -> ' + t);
    let seen; globalThis.fetch = async u => { seen = new URL(u); return { ok: true, status: 200, json: async () => ({ best_flights: [{ price: 5000, total_duration: 130, flights: [{ airline: 'X', flight_number: 'X 1', duration: 130, departure_airport: { id: dep, time: '2026-12-01 08:00' }, arrival_airport: { id: arr, time: '2026-12-01 10:10' } }] }] }) }; };
    const out = await searchFlights({ from: route.from.code, to: route.to.code, date: '2026-12-01', passengers: 1 });
    assert.equal(seen.searchParams.get('departure_id'), dep); assert.equal(seen.searchParams.get('arrival_id'), arr); assert.equal(seen.searchParams.get('engine'), 'google_flights'); assert.equal(seen.searchParams.get('travel_class'), '1'); assert.equal(out[0].price, 5000);
  }
});
