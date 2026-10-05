import { RAW, ALIASES, COUNTRY_ALIASES } from '../data/airports.js';

const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

// Build the index once.
export const airports = [];
let country = '';
for (const line of RAW.split('\n')) {
  const l = line.trim(); if (!l) continue;
  if (l.startsWith('#')) { country = l.slice(1).trim(); continue; }
  const [code, city, name, lbl] = l.split('|');
  airports.push({ code, city, name, country, label: `${lbl || city} (${code})`,
    n: { city: norm(city), name: norm(name), country: norm(country), label: norm(lbl || city), alias: (ALIASES[code] || []).map(norm) } });
}
const byCode = new Map(airports.map(a => [a.code, a]));
const pub = a => ({ code: a.code, label: a.label, city: a.city, name: a.name, country: a.country });
const FILLER = /\b(airport|international|intl|airports)\b/g;

function score(a, q) {
  const n = a.n;
  if (a.code.toLowerCase() === q) return 100;
  if (n.alias.includes(q)) return 95;
  if (n.city === q || n.label === q) return 92;
  if (n.city.startsWith(q)) return 80;
  if (n.alias.some(x => x.startsWith(q))) return 78;
  if (n.label.startsWith(q)) return 75;
  if (q.length >= 3 && (n.name.split(' ').some(w => w.startsWith(q)) || n.name.includes(q))) return 60;
  const cq = COUNTRY_ALIASES[q] || q;
  if (n.country === cq) return 50;
  if (q.length >= 3 && n.country.startsWith(cq)) return 45;
  if (q.length >= 3 && n.city.includes(q)) return 40;
  return 0;
}

// Autocomplete: city, airport name, country or IATA code. Ranked best-first.
export function searchAirports(text, limit = 8) {
  const q = norm(text); if (!q) return [];
  return airports.map((a, i) => ({ a, i, s: score(a, q) })).filter(x => x.s > 0)
    .sort((x, y) => y.s - x.s || x.i - y.i).slice(0, limit).map(x => pub(x.a));
}

// Resolve whatever the user typed into one airport (with its IATA code). Returns null if it cannot be resolved.
export function resolveAirport(text) {
  const raw = String(text || '').trim(); if (!raw) return null;
  const paren = raw.match(/\(([A-Za-z]{3})\)\s*$/);               // "London Heathrow (LHR)" from the suggestion list
  if (paren) { const c = paren[1].toUpperCase(); return byCode.has(c) ? pub(byCode.get(c)) : { code: c, label: raw, city: raw, name: '', country: '' }; }
  if (/^[A-Z]{3}$/.test(raw) && byCode.has(raw)) return pub(byCode.get(raw));  // typed IATA code
  let q = norm(raw);
  for (const query of [q, norm(q.replace(FILLER, ' '))]) {
    if (!query) continue;
    const best = airports.map((a, i) => ({ a, i, s: score(a, query) })).filter(x => x.s >= 60).sort((x, y) => y.s - x.s || x.i - y.i)[0];
    if (best) return pub(best.a);
  }
  if (/^[A-Z]{3}$/.test(raw)) return { code: raw, label: raw, city: raw, name: '', country: '' }; // unknown but code-shaped: let the flight API decide
  return null;
}

export const NOT_FOUND = 'We couldn\'t find that airport. Try searching by city, airport name, country, or IATA code.';

// Resolve From + To (identical rules for both fields).
export function resolveRoute(fromText, toText) {
  const f = String(fromText || '').trim(), t = String(toText || '').trim();
  if (!f || !t) return { error: 'From, To and Date are required.', code: 'EMPTY_INPUT', field: f ? 'to' : 'from' };
  const from = resolveAirport(f); if (!from) return { error: `${NOT_FOUND} (From: "${f}")`, code: 'AIRPORT_NOT_FOUND', field: 'from' };
  const to = resolveAirport(t); if (!to) return { error: `${NOT_FOUND} (To: "${t}")`, code: 'AIRPORT_NOT_FOUND', field: 'to' };
  if (from.code === to.code) return { error: 'Departure and destination cannot be the same.', code: 'SAME_AIRPORT', field: 'to' };
  return { from, to };
}
