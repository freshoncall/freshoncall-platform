import mongoose from 'mongoose';
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  cat: { type: String, enum: ['veg','fruit','rice','spice','household'], required: true },
  inStock: { type: Boolean, default: true },
  image: { type: String, default: '' }
},{ timestamps:true });
export default mongoose.model('Item', ItemSchema);