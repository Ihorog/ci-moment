# Ci Moment

> A minimalist SaaS decision tool that captures your unique moment in time.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ihorog/ci-moment)

## 🌟 Overview

Ci Moment is a single-page decision tool that helps users check their personal moment status for different life contexts (Career, Love, Timing). Each decision is locked to a specific UTC minute and can be permanently sealed via Stripe payment.

**Live Demo**: [https://ci-moment.vercel.app](https://ci-moment.vercel.app)

## ✨ Features

- **Deterministic Decision Engine**: Status changes based on UTC time and context
- **Artifact Generation**: Unique cryptographic artifact codes for each decision
- **Payment Integration**: Stripe Checkout for sealing decisions
- **Verification System**: SHA-256 based verification for sealed artifacts
- **Serverless Architecture**: Built for Vercel with Next.js 14 App Router
- **Type-Safe Database**: PostgreSQL via Supabase with full TypeScript types

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Deployment**: Vercel
- **Styling**: Inline CSS (minimal approach)

## 📋 Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Supabase account (for database)
- Stripe account (for payments)
- Vercel account (for deployment)

## 🛠️ Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Ihorog/ci-moment.git
cd ci-moment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Configure the following variables in `.env.local`:

```env
# Public URL (set to localhost for development)
NEXT_PUBLIC_URL=http://localhost:3000

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 4. Set up the database

Run the schema in your Supabase project:

```bash
# Copy the SQL from db/schema.sql and run it in Supabase SQL Editor
```

See [SUPABASE-SETUP.md](./docs/SUPABASE-SETUP.md) for detailed instructions.

### 5. Configure Stripe

Set up your Stripe webhook endpoint and configure test mode.

See [STRIPE-SETUP.md](./docs/STRIPE-SETUP.md) for detailed instructions.

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Project Structure

```
ci-moment/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   ├── seal/         # Payment initiation
│   │   └── webhook/      # Stripe webhook handler
│   ├── verify/           # Verification pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main application page
├── components/            # React components
│   ├── Landing.tsx       # Landing screen
│   ├── Threshold.tsx     # Confirmation screen
│   ├── Manifest.tsx      # Loading animation
│   ├── Result.tsx        # Decision result
│   └── SealButton.tsx    # Payment button
├── lib/                   # Shared utilities
│   ├── engine.ts         # Decision engine logic
│   └── supabase.ts       # Database client
├── db/                    # Database schema
│   └── schema.sql        # PostgreSQL schema
└── docs/                  # Documentation
    ├── DEPLOYMENT.md     # Deployment guide
    ├── STRIPE-SETUP.md   # Stripe configuration
    └── SUPABASE-SETUP.md # Database setup
```

## 🧪 Development

### Type checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Building for production

```bash
npm run build
```

### Running production build locally

```bash
npm run build
npm run start
```

## 🚢 Deployment

This project is optimized for deployment on Vercel.

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables
4. Deploy

The project includes:
- Automatic deployment on push to main branch
- Preview deployments for pull requests
- Environment variable validation
- Optimized build settings

## 🔐 Security

- Stripe webhook signature verification
- Server-side environment variable validation
- SQL injection protection via Supabase client
- HTTPS-only in production
- Rate limiting recommendations in deployment guide

## 📊 Architecture

### Decision Flow

1. **User selects context** (Career, Love, or Timing)
2. **Confirmation screen** displays decision threshold
3. **Manifest animation** plays during processing
4. **Engine calculates status** based on current UTC minute
5. **Result displayed** with unique artifact code
6. **User can seal decision** via Stripe payment
7. **Webhook confirms payment** and updates database
8. **Verification link** provided for sealed artifacts

### Payment Flow

1. User clicks "Seal This Moment"
2. API creates artifact record in database
3. Stripe Checkout session created with metadata
4. User completes payment on Stripe
5. Stripe webhook confirms payment
6. Artifact marked as sealed in database
7. User redirected to verification page

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_URL` | Public URL of the application | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key (test or live) | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Yes |

## 📖 API Documentation

### POST /api/seal

Creates an artifact and initiates Stripe checkout.

**Request Body:**
```json
{
  "artifactCode": "ci-ab-cdef1",
  "context": "career",
  "status": "PROCEED",
  "lockedMinute": 28512345
}
```

**Response:**
```json
{
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

### POST /api/webhook

Handles Stripe webhook events (internal use only).

## 🧩 Key Concepts

### Artifact Code

Format: `ci-XX-XXXXX` where X is a hexadecimal character.

Example: `ci-7a-3f2e1`

Generated using cryptographically secure random bytes.

### Locked Minute

The UTC minute when the decision was made. Used as a seed for deterministic status calculation and verification.

### Verification Hash

First 16 characters of SHA-256 hash of `artifactCode-minute-status`.

Used in verification URLs: `/verify/[hash]`

### Status Determination

Status is calculated deterministically:
```
index = (utcMinute + contextId) % 3
status = STATUSES[index]
```

This ensures:
- Same minute + context = same status
- Status changes every minute
- Predictable but not gameable (depends on exact timing)

## 📝 License

Copyright © 2026. All rights reserved.

This project is proprietary software. The source code is available for reference and learning purposes only. Use of this code in production requires explicit permission from the repository owner.

## 🤝 Contributing

This is a personal project. For collaboration inquiries or questions, please open an issue or contact the repository owner.

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Check the documentation in the `/docs` folder
- Review the TESTING.md guide for debugging tips

## 🎯 Roadmap

- [ ] Analytics integration
- [ ] Email notifications
- [ ] Multi-currency support
- [ ] Mobile app version
- [ ] API webhooks for third-party integrations

---

**Built with ❤️ using Next.js and Stripe**
