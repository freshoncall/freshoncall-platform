import mongoose from 'mongoose';
const OrderSchema = new mongoose.Schema({
  items: [{ name:String, price:Number, qty:Number }],
  total: Number,
  paymentStatus: { type: String, enum:['unpaid','paid','refunded'], default:'unpaid' },
  customer: { name:String, phone:String, address:String, notes:String }
},{ timestamps:true });
export default mongoose.model('Order', OrderSchema);