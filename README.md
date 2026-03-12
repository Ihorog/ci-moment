# Ci Moment

> A minimalist SaaS decision tool that captures your unique moment in time.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ihorog/ci-moment)

## 💳 Live Checkout

Ci Moment is sealed via Gumroad — no server-side payment secrets required:
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
- **Gumroad Checkout**: Secure payment via Gumroad — no backend secrets required
- **Verification System**: SHA-256 based verification for sealed artifacts
- **Serverless Architecture**: Built for Vercel with Next.js 14 App Router

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Payments**: Gumroad (redirect link)
- **Deployment**: Vercel
- **Styling**: Inline CSS (minimal approach)

## 📋 Prerequisites

- Node.js 20.x or higher
- npm or yarn
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

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

No environment variables are required for the default Gumroad mode.

## 📦 Project Structure

```
ci-moment/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes (dormant in Gumroad mode)
│   │   ├── seal/         # Returns 410 Gone
│   │   └── webhook/      # Returns 410 Gone
│   ├── verify/           # Verification pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main application page
├── components/            # React components
│   ├── Landing.tsx       # Landing screen
│   ├── Threshold.tsx     # Confirmation screen
│   ├── Manifest.tsx      # Loading animation
│   ├── Result.tsx        # Decision result
│   └── SealButton.tsx    # Payment button (Gumroad link)
├── lib/                   # Shared utilities
│   ├── engine.ts         # Decision engine logic
│   ├── engine.server.ts  # Server-only crypto operations
│   ├── design-system.ts  # Centralized design tokens
│   ├── payments.ts       # Payment provider config
│   └── supabase.ts       # Database client (verification only)
├── db/                    # Database schema
│   └── schema.sql        # PostgreSQL schema
└── docs/                  # Documentation
    └── DEPLOYMENT.md     # Deployment guide
```

## 📚 Documentation

### Core Documentation
- **[AGENTS.md](./AGENTS.md)** - Instructions for GitHub Copilot agents
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design decisions
- **[DEPLOYMENT-STRATEGY.md](./DEPLOYMENT-STRATEGY.md)** - Deployment strategy

### Development Resources
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute
- **[SECURITY.md](./SECURITY.md)** - Security policy
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history

## 🧪 Development

### Type checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Tests

```bash
npm test
```

### Building for production

```bash
npm run build
```

## 🚢 Deployment

This project is optimized for deployment on Vercel. **No payment secrets are required.**

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy (no environment variables needed for Gumroad mode)

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_PAYMENT_PROVIDER` | Payment provider: `gumroad` (default) or `disabled` | No |

All other payment secrets (`FONDY_*`, `SUPABASE_*` for payments) are not used in Gumroad mode.

> **Note**: Supabase variables (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`) are only needed
> if you use the `/verify/[hash]` artifact lookup feature.

## 📊 Architecture

### Decision Flow

1. **User selects context** (Career, Love, or Timing)
2. **Confirmation screen** displays decision threshold
3. **Manifest animation** plays during processing
4. **Engine calculates status** based on current UTC minute
5. **Result displayed** with unique artifact code
6. **User can seal decision** via Gumroad checkout link

### Payment Flow (Gumroad canonical)

1. User clicks "Seal This Moment"
2. Browser opens Gumroad checkout in new tab
3. User completes payment on Gumroad
4. User returns to app

### API Routes (dormant)

`/api/seal` and `/api/webhook` return **410 Gone** in Gumroad canonical mode.
They are kept as stubs for future extensibility but require no secrets.

## 🧩 Key Concepts

### Artifact Code

Format: `ci-XX-XXXXX` where X is a hexadecimal character.

Example: `ci-7a-3f2e1`

Generated using cryptographically secure random bytes.

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
- [ ] Mobile app version

---

**Built with ❤️ using Next.js and Gumroad**
