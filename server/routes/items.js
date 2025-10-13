import express from 'express';
import Item from '../models/Item.js';
import { requireAuth } from './auth.js';
const router = express.Router();

router.get('/', async (req,res)=>{
  const items = await Item.find({ inStock: true }).sort({ name:1 });
  res.json(items);
});

router.post('/', requireAuth, async (req,res)=>{
  const it = await Item.create(req.body);
  res.json(it);
});
router.put('/:id', requireAuth, async (req,res)=>{
  const it = await Item.findByIdAndUpdate(req.params.id, req.body, { new:true });
  res.json(it);
});
router.delete('/:id', requireAuth, async (req,res)=>{
  await Item.findByIdAndDelete(req.params.id);
  res.json({ ok:true });
});

export default router;