# FreshOnCall Server (Express + MongoDB)

## Local Start
```
cd server
cp .env.example .env
# put your real STRIPE_SECRET_KEY and keep MONGODB_URI as provided
npm install
npm start
```
API on http://localhost:8080

## Endpoints
- POST /api/auth/login
- GET /api/items (public) • CRUD (admin)
- GET /api/offers (public) • CRUD (admin)
- GET /api/orders (admin) • POST /api/orders (public)
- POST /api/checkout/session → returns Stripe Checkout URL

## Deploy on Render
- Push repo to GitHub → Render → New → Blueprint → select repo (uses server/render.yaml)
- Set env vars: MONGODB_URI, STRIPE_SECRET_KEY, FRONTEND_URL, (Render will generate JWT_SECRET)
- Deploy → copy service URL, e.g. https://freshoncall-server.onrender.com