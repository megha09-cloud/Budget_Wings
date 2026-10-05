import mongoose from 'mongoose';
// ER: SearchHistory (userId stays null until user accounts are added)
export default mongoose.model('SearchHistory', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  origin: { type: String, required: true }, destination: { type: String, required: true }, originLabel: String, destinationLabel: String,
  travelDate: { type: Date, required: true }, passengers: { type: Number, default: 1 }, cabin: { type: Number, default: 1 },
  resultCount: Number, searchedAt: { type: Date, default: Date.now }
}));
