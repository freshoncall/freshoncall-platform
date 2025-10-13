import mongoose from 'mongoose';
const OfferSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  discountPct: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  validUntil: { type: Date }
},{ timestamps:true });
export default mongoose.model('Offer', OfferSchema);