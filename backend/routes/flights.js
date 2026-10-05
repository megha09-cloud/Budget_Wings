import { Router } from 'express';
import mongoose from 'mongoose';
import { searchAirports, resolveRoute } from '../services/airports.js';
import { searchFlights, CABINS } from '../services/flightApi.js';
import SearchHistory from '../models/SearchHistory.js';
import { optionalAuth } from '../middleware/auth.js';

const r = Router();
// Autocomplete: by city, airport name, country or IATA code
r.get('/airports/search', (req, res) => res.json(searchAirports(req.query.q, Math.min(Number(req.query.limit) || 8, 15))));

r.get('/flights/search', optionalAuth, async (req, res, next) => {
  const date = String(req.query.date || ''), passengers = Number(req.query.passengers || 1);
  const bad = (error, code, field) => res.status(400).json({ error, code, field });
  if (!date) return bad('From, To and Date are required.', 'EMPTY_INPUT', 'date');
  const route = resolveRoute(req.query.from, req.query.to);          // user text -> airports with IATA codes
  if (route.error) return bad(route.error, route.code, route.field);
  const { from, to } = route;
  const cabin = Number(req.query.cabin || 1);
  if (![1, 2, 3, 4].includes(cabin)) return bad('Please choose a valid cabin class.', 'INVALID_CABIN', 'cabin');
  const d = new Date(date + 'T00:00:00'), today = new Date(); today.setHours(0, 0, 0, 0);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(d) || d < today) return bad('Please choose a valid travel date (today or later).', 'INVALID_DATE', 'date');
  if (!Number.isInteger(passengers) || passengers < 1 || passengers > 9) return bad('Passengers must be between 1 and 9.', 'INVALID_PASSENGERS', 'passengers');
  try {
    const flights = await searchFlights({ from: from.code, to: to.code, date, passengers, cabin }); // departure_id / arrival_id
    const cheapest = flights.reduce((m, f) => (!m || f.price < m.price ? f : m), null);       // lowest valid fare
    if (mongoose.connection.readyState === 1)
      SearchHistory.create({ userId: req.userId || null, origin: from.code, destination: to.code, originLabel: from.label, destinationLabel: to.label, travelDate: d, passengers, cabin, resultCount: flights.length }).catch(() => {});
    res.json({ query: { from: from.code, to: to.code, fromLabel: from.label, toLabel: to.label, date, passengers, cabin, cabinName: CABINS[cabin - 1] }, count: flights.length, cheapestId: cheapest?.id ?? null, flights });
  } catch (e) { e.status ? res.status(e.status).json({ error: e.message, code: e.code }) : next(e); }
});
export default r;
