import express from 'express';
import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

const router = express.Router();

router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  const user = await AdminUser.findOne({ email });
  if(!user) return res.status(401).json({ error:'Invalid credentials' });
  const ok = await user.verifyPassword(password);
  if(!ok) return res.status(401).json({ error:'Invalid credentials' });
  const token = jwt.sign({ uid: user._id, email }, process.env.JWT_SECRET || 'devsecret', { expiresIn:'7d' });
  res.json({ token });
});

export function requireAuth(req,res,next){
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if(!token) return res.status(401).json({ error:'No token' });
  try{
    const data = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.user = data;
    next();
  }catch(e){
    res.status(401).json({ error:'Invalid token' });
  }
}

export default router;