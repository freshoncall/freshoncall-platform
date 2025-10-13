import express from 'express';
import Order from '../models/Order.js';
import { requireAuth } from './auth.js';
const router = express.Router();

router.get('/', requireAuth, async (req,res)=>{
  const orders = await Order.find().sort({ createdAt:-1 });
  res.json(orders);
});

router.post('/', async (req,res)=>{
  const ord = await Order.create(req.body);
  res.json(ord);
});

export default router;