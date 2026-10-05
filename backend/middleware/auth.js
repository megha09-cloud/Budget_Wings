import jwt from 'jsonwebtoken';
const read = req => {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return null;
  try { return jwt.verify(h.slice(7), process.env.JWT_SECRET).id; } catch { return null; }
};
export const requireAuth = (req, res, next) => {
  const id = read(req);
  if (!id) return res.status(401).json({ error: 'Please log in to continue.', code: 'UNAUTHORIZED' });
  req.userId = id; next();
};
export const optionalAuth = (req, _res, next) => { req.userId = read(req); next(); };
