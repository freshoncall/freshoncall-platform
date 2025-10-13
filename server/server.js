import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

// Mongo
const MONGODB_URI = process.env.MONGODB_URI;
if(!MONGODB_URI){ console.error('Missing MONGODB_URI'); process.exit(1); }
mongoose.connect(MONGODB_URI).then(()=>console.log('MongoDB connected')).catch(e=>{console.error('MongoDB error', e); process.exit(1);});

// Models
import './models/Item.js';
import './models/Offer.js';
import './models/Order.js';
import AdminUser from './models/AdminUser.js';

// Seed default admin if not exists
(async()=>{
  const count = await AdminUser.countDocuments();
  if(count===0){
    await AdminUser.createDefault();
    console.log('Default admin seeded');
  }
})();

// Routes
import authRouter from './routes/auth.js';
import itemsRouter from './routes/items.js';
import offersRouter from './routes/offers.js';
import ordersRouter from './routes/orders.js';
import checkoutRouter from './routes/checkout.js';

app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);
app.use('/api/offers', offersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/checkout', checkoutRouter);

app.get('/', (req,res)=> res.json({ status:'ok', service:'freshoncall-server' }));

const port = process.env.PORT || 8080;
app.listen(port, ()=> console.log('Server running on', port));