import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import flights from './routes/flights.js';
import auth from './routes/auth.js';
import account from './routes/account.js';

const app = express();
app.use(cors({origin:'https://budget-wings.netlify.app',
  credentials:true
})
app.use(express.json());
app.get('/api/health', (_q, r) => r.json({ ok: true, apiKeyConfigured: !!process.env.FLIGHT_API_KEY, db: mongoose.connection.readyState === 1 }));
app.use('/api/auth', auth);
app.use('/api', flights);   // public: airports + flight search
app.use('/api', account);  // protected per route
app.use((e, _q, r, _n) => { console.error(e); r.status(500).json({ error: 'Unexpected server error', code: 'SERVER_ERROR' }); });

if (process.env.MONGODB_URI)
  mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB connected')).catch(e => console.warn('MongoDB unavailable:', e.message));
app.listen(process.env.PORT || 5000, () => console.log('Budget Wings API running'));
