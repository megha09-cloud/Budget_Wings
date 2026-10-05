import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();
const pub = u => ({ id: u._id, name: u.name, email: u.email });
const ready = (_q, res, next) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: 'Accounts need the database. Set MONGODB_URI and start MongoDB.', code: 'DB_UNAVAILABLE' });
  if (!process.env.JWT_SECRET) return res.status(503).json({ error: 'JWT_SECRET is not set in backend/.env.', code: 'JWT_SECRET_MISSING' });
  next();
};
const token = u => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

r.post('/signup', ready, async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim(), email = String(req.body.email || '').trim().toLowerCase(), password = String(req.body.password || '');
    if (name.length < 2) return res.status(400).json({ error: 'Please enter your name.' });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email.' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    if (await User.findOne({ email })) return res.status(409).json({ error: 'An account with this email already exists.' });
    const u = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 10) });
    res.status(201).json({ token: token(u), user: pub(u) });
  } catch (e) { next(e); }
});
r.post('/login', ready, async (req, res, next) => {
  try {
    const u = await User.findOne({ email: String(req.body.email || '').trim().toLowerCase() });
    if (!u || !(await bcrypt.compare(String(req.body.password || ''), u.passwordHash))) return res.status(401).json({ error: 'Incorrect email or password.' });
    res.json({ token: token(u), user: pub(u) });
  } catch (e) { next(e); }
});
r.get('/me', ready, requireAuth, async (req, res, next) => {
  try { const u = await User.findById(req.userId); u ? res.json(pub(u)) : res.status(401).json({ error: 'Please log in again.' }); } catch (e) { next(e); }
});
export default r;
