import express from 'express';
import Stripe from 'stripe';
const router = express.Router();

router.post('/session', async (req,res)=>{
  try{
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { items, success_url, cancel_url } = req.body;
    if(!items || !Array.isArray(items) || items.length===0) return res.status(400).json({ error:'No items' });
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: items.map(i => ({
        price_data: { currency: 'gbp', product_data: { name: i.name }, unit_amount: Math.round(i.price * 100) },
        quantity: i.qty || 1
      })),
      success_url: success_url || (process.env.FRONTEND_URL + '/success.html'),
      cancel_url: cancel_url || (process.env.FRONTEND_URL + '/cancel.html')
    });
    res.json({ url: session.url });
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});

export default router;