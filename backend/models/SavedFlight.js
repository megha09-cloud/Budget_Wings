import mongoose from 'mongoose';
// ER: SavedFlight – snapshot of a flight the user saved (fare as it was when saved)
const s = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  key: { type: String, required: true },
  airline: String, cabin: String, flightNumber: String, logo: String,
  origin: String, destination: String, departure: String, arrival: String,
  durationMin: Number, stops: Number, price: { type: Number, required: true }, currency: { type: String, default: 'INR' },
  segments: mongoose.Schema.Types.Mixed, layovers: mongoose.Schema.Types.Mixed,
  savedAt: { type: Date, default: Date.now }
});
s.index({ userId: 1, key: 1 }, { unique: true });
export default mongoose.model('SavedFlight', s);
