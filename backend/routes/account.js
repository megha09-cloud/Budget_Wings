import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import SearchHistory from '../models/SearchHistory.js';
import SavedFlight from '../models/SavedFlight.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();
// JWT-protected, per route (flight search stays public). Every query is scoped to req.userId.
const guard = [requireAuth, (_q, res, next) => mongoose.connection.readyState === 1 ? next() : res.status(503).json({ error: 'Your account data is temporarily unavailable. Please try again shortly.', code: 'DB_UNAVAILABLE' })];
const wrap = fn => (req, res, next) => fn(req, res).catch(next);

r.get('/search-history', guard, wrap(async (req, res) => res.json(await SearchHistory.find({ userId: req.userId }).sort({ searchedAt: -1 }).limit(50))));
r.get('/saved-flights', guard, wrap(async (req, res) => res.json(await SavedFlight.find({ userId: req.userId }).sort({ savedAt: -1 }))));
r.post('/saved-flights', guard, wrap(async (req, res) => {
  const f = req.body || {}, price = Number(f.price);
  if (!(price > 0) || !f.departure || !Array.isArray(f.flightNumbers)) return res.status(400).json({ error: 'This flight could not be saved.' });
  const key = f.flightNumbers.join('+') + '|' + f.departure;
  const doc = await SavedFlight.findOneAndUpdate({ userId: req.userId, key }, { $set: {
    airline: (f.airlines || []).join(' + '), flightNumber: f.flightNumbers.join(', '), logo: f.logo || null, origin: f.from?.code, destination: f.to?.code,
    departure: f.departure, arrival: f.arrival, durationMin: f.durationMin, stops: f.stops, price, currency: f.currency || 'INR', cabin: f.cabin || '', segments: f.segments || [], layovers: f.layovers || [] } },
    { upsert: true, new: true, setDefaultsOnInsert: true });
  res.status(201).json(doc);
}));
r.delete('/saved-flights/:id', guard, wrap(async (req, res) => { await SavedFlight.deleteOne({ _id: req.params.id, userId: req.userId }); res.json({ ok: true }); }));
r.get('/users/dashboard', guard, wrap(async (req, res) => {
  const uid = req.userId;
  const [u, totalSearches, savedCount, recentSearches, recentSaved] = await Promise.all([User.findById(uid).select('-passwordHash'), SearchHistory.countDocuments({ userId: uid }), SavedFlight.countDocuments({ userId: uid }),
    SearchHistory.find({ userId: uid }).sort({ searchedAt: -1 }).limit(5), SavedFlight.find({ userId: uid }).sort({ savedAt: -1 }).limit(3)]);
  if (!u) return res.status(401).json({ error: 'Please log in again.' });
  res.json({ user: { name: u.name, email: u.email, createdAt: u.createdAt }, totalSearches, savedCount, recentSearches, recentSaved });
}));
export default r;
