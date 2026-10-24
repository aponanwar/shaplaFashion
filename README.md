# Shapla Fashion

Authentic Bangladeshi Clothes & Homemade Crafts E-Commerce Platform

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB (Mongoose)
- **Images**: Cloudinary
- **Auth**: NextAuth.js
- **Payments**: Stripe, bKash, Nagad, Cash on Delivery
- **Messaging**: WhatsApp Business API, SMS (SSL Wireless)

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.local` and fill in your credentials:
```bash
# MongoDB URI — free tier optimized (maxPoolSize=10)
MONGODB_URI=...

# Cloudinary
CLOUDINARY_API_KEY=...

# Stripe
STRIPE_SECRET_KEY=...

# bKash / Nagad
BKASH_APP_KEY=...

# WhatsApp Business
WHATSAPP_API_TOKEN=...
```

### 3. Seed Database (Demo Products)
```bash
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Dashboard
Visit [http://localhost:3000/admin](http://localhost:3000/admin)

Default credentials (change after first login!):
- Email: `admin@shaplaFashion.com`
- Password: `ChangeMe@123!`

## Security Features
- JWT authentication with account lockout (5 failed attempts → 15 min lock)
- Rate limiting on all API endpoints (100 req/min; 10 req/15min for auth)
- Security headers (CSP, XFRAME, XSS protection)
- Input sanitization
- Admin route protection via middleware
- MongoDB connection pooling (maxPoolSize=10 for free tier)

## MongoDB Free Tier Optimization
The connection string uses `maxPoolSize=10` which keeps total connections low.
For 10K visitors with ISR caching, most page loads won't hit the DB directly.
Static pages (homepage, product listing) are cached at CDN level.

## Deployment
```bash
npm run build
npm run start
```

Recommended: Vercel (zero-config for Next.js) + MongoDB Atlas Free Tier
