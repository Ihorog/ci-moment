# Ci Moment

> A minimalist SaaS decision tool that captures your unique moment in time.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ihorog/ci-moment)

## 💳 Live Checkout

Ci Moment can be sealed via Gumroad checkout:
https://cimoment.gumroad.com/l/rwffi

## 🗺 User Flow

1. Open app
2. Select context
3. Receive decision signal
4. Click "Seal this moment — $5"
5. Complete checkout on Gumroad

## 🌟 Overview

Ci Moment is a single-page decision tool that helps users check their personal moment status for different life contexts (Career, Love, Timing). Each decision is locked to a specific UTC minute and can be sealed via Gumroad checkout.

**Live Demo**: [https://ci-moment.vercel.app](https://ci-moment.vercel.app)

## ✨ Features

- **Deterministic Decision Engine**: Status changes based on UTC time and context
- **Artifact Generation**: Unique cryptographic artifact codes for each decision
- **Payment Integration**: Fondy payment gateway for sealing decisions
- **Verification System**: SHA-256 based verification for sealed artifacts
- **Serverless Architecture**: Built for Vercel with Next.js 14 App Router
- **Type-Safe Database**: PostgreSQL via Supabase with full TypeScript types

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Payments**: Fondy
- **Deployment**: Vercel
- **Styling**: Inline CSS (minimal approach)

## 📋 Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Supabase account (for database)
- Fondy account (for payments)
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

# Fondy
FONDY_MERCHANT_ID=your_fondy_merchant_id
FONDY_SECRET_KEY=your_fondy_secret_key
```

### 4. Set up the database

Run the schema in your Supabase project:

```bash
# Copy the SQL from db/schema.sql and run it in Supabase SQL Editor
```

See [SUPABASE-SETUP.md](./docs/SUPABASE-SETUP.md) for detailed instructions.

### 5. Configure Fondy

Set up your Fondy merchant account and obtain your credentials from the Fondy portal.

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
│   │   └── seal/         # Payment initiation
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
│   ├── engine.server.ts  # Server-only crypto operations
│   ├── design-system.ts  # Centralized design tokens
│   └── supabase.ts       # Database client
├── db/                    # Database schema
│   └── schema.sql        # PostgreSQL schema
└── docs/                  # Documentation
    ├── DEPLOYMENT.md     # Deployment guide
    └── SUPABASE-SETUP.md # Database setup
```

## 📚 Documentation

### Core Documentation
- **[AGENTS.md](./AGENTS.md)** - Instructions for GitHub Copilot agents to assist with development
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed system architecture and design decisions
- **[DEPLOYMENT-STRATEGY.md](./DEPLOYMENT-STRATEGY.md)** - GitHub-native deployment strategy with scaling patterns

### Setup Guides
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Step-by-step deployment to Vercel
- **[ENVIRONMENT-CONFIG.md](./docs/ENVIRONMENT-CONFIG.md)** - Environment configuration examples for all stages
- **[SUPABASE-SETUP.md](./docs/SUPABASE-SETUP.md)** - Database setup instructions
- **[STRIPE-SETUP.md](./docs/STRIPE-SETUP.md)** - Payment integration setup

### Development Resources
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute to the project
- **[SECURITY.md](./SECURITY.md)** - Security policy and vulnerability reporting
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and release notes

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

- Payment signature verification
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
6. **User can seal decision** via Fondy payment
7. **Payment redirect** confirms payment and updates database
8. **Verification link** provided for sealed artifacts

### Payment Flow

1. User clicks "Seal This Moment"
2. API creates artifact record in database
3. Fondy checkout request created with signature
4. User completes payment on Fondy
5. Fondy redirects to verification page
6. Artifact marked as sealed in database
7. User sees verification page

## 💳 Payments

Ci Moment uses Fondy payment gateway for secure payment processing.

### Setup

1. **Create a Fondy account** at [portal.fondy.eu](https://portal.fondy.eu/)
2. Obtain your **Merchant ID** and **Secret Key**
3. Set environment variables in Vercel:
   - `FONDY_MERCHANT_ID`
   - `FONDY_SECRET_KEY`
4. Redeploy

### Manual Test Checklist

- [ ] Open the site
- [ ] Choose a context (Career / Love / Timing)
- [ ] See the status result (PROCEED / HOLD / NOT NOW)
- [ ] Click "Seal this moment — $5" → Fondy checkout opens
- [ ] Complete payment
- [ ] Fondy redirects to `/verify/[hash]?sealed=true`
- [ ] Artifact is sealed in database

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_URL` | Public URL of the application | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Yes |
| `FONDY_MERCHANT_ID` | Fondy merchant account ID | Yes |
| `FONDY_SECRET_KEY` | Fondy API secret key | Yes |

## 📖 API Documentation

### POST /api/seal

Creates an artifact and initiates Fondy checkout.

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
  "checkoutUrl": "https://pay.fondy.eu/..."
}
```

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

## 🎯 Roadmap

- [ ] Analytics integration
- [ ] Email notifications
- [ ] Multi-currency support
- [ ] Mobile app version
- [ ] API webhooks for third-party integrations

---

**Built with ❤️ using Next.js and Fondy**
