import express from 'express';
import Offer from '../models/Offer.js';
import { requireAuth } from './auth.js';
const router = express.Router();

router.get('/', async (req,res)=>{
  const offers = await Offer.find({ active:true }).sort({ createdAt:-1 }).limit(5);
  res.json(offers);
});

router.post('/', requireAuth, async (req,res)=>{
  const o = await Offer.create(req.body);
  res.json(o);
});
router.put('/:id', requireAuth, async (req,res)=>{
  const o = await Offer.findByIdAndUpdate(req.params.id, req.body, { new:true });
  res.json(o);
});
router.delete('/:id', requireAuth, async (req,res)=>{
  await Offer.findByIdAndDelete(req.params.id);
  res.json({ ok:true });
});

export default router;