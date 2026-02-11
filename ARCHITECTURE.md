# Ci Moment Architecture

## Overview

Ci Moment is a minimalist SaaS decision tool built with Next.js 14 (App Router), designed for serverless deployment on Vercel with Supabase as the database backend. This document describes the current architecture, design decisions, and patterns used throughout the application.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Landing    │→ │  Threshold   │→ │   Manifest   │      │
│  │   Screen     │  │   Screen     │  │  Animation   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────┐       │
│  │            Result Screen                         │       │
│  │  ┌────────────┐  ┌──────────────────┐           │       │
│  │  │  Status    │  │  Artifact Code   │           │       │
│  │  │  Display   │  │  Display         │           │       │
│  │  └────────────┘  └──────────────────┘           │       │
│  │  ┌────────────────────────────────────┐         │       │
│  │  │     Seal This Moment Button        │         │       │
│  │  └────────────────────────────────────┘         │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓ (Payment Link)
┌─────────────────────────────────────────────────────────────┐
│                  Payment Provider                            │
│              (Fondy / WayForPay / etc.)                     │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓ (Redirect)
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Edge Runtime                       │
│  ┌────────────────────┐    ┌────────────────────┐          │
│  │  /api/seal         │    │  /api/webhook      │          │
│  │  (Payment Init)    │    │  (Payment Confirm) │          │
│  └────────────────────┘    └────────────────────┘          │
│           │                         │                        │
│           └─────────┬───────────────┘                       │
│                     ↓                                        │
│           ┌──────────────────┐                              │
│           │  /verify/[hash]  │                              │
│           │  (Verification)  │                              │
│           └──────────────────┘                              │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Supabase PostgreSQL                         │
│  ┌─────────────────────────────────────────────┐            │
│  │           artifacts table                   │            │
│  │  - id, artifact_code, context, status      │            │
│  │  - locked_minute, is_sealed, payment_id    │            │
│  │  - created_at, sealed_at                   │            │
│  └─────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Next.js 14**: App Router with Server/Client Components
- **React 18**: UI library with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Inline CSS**: Minimal styling approach using design system tokens

### Backend
- **Next.js Route Handlers**: Serverless API endpoints
- **Edge Runtime**: Fast cold starts, global distribution
- **Node.js Crypto**: Server-side cryptographic operations

### Database
- **Supabase**: Managed PostgreSQL with REST API
- **Row Level Security**: Database-level access control
- **Type Generation**: TypeScript types from schema

### Payments
- **Payment Links**: Redirect-based payment (Fondy, WayForPay)
- **No Server-Side Sessions**: Simplified MVP flow
- **Success Redirects**: POST-payment return URLs

### Deployment
- **Vercel**: Primary hosting platform
- **GitHub Actions**: CI/CD pipeline
- **Environment Variables**: Configuration management

## Core Modules

### 1. Decision Engine (`lib/engine.ts`)

The decision engine calculates status deterministically based on UTC time and context.

**Key Functions**:
- `generateArtifactCode()`: Creates unique cryptographic codes
- `calculateStatus()`: Determines PROCEED/HOLD/NOT NOW status
- `getLockedMinute()`: Returns current UTC minute since epoch

**Algorithm**:
```typescript
// Status calculation
const index = (utcMinute + contextId) % 3;
const status = STATUSES[index]; // ['PROCEED', 'HOLD', 'NOT NOW']
```

**Properties**:
- Deterministic: Same minute + context = same status
- Time-based: Status changes every minute
- Unpredictable: Cannot game the system (requires exact timing)

### 2. Server Engine (`lib/engine.server.ts`)

Server-only cryptographic operations using Node.js crypto.

**Key Functions**:
- `generateVerifyHash()`: Creates SHA-256 hash for verification URLs

**Security**:
- Uses `node:crypto` for server-side operations
- `.server.ts` suffix prevents client-side bundling
- Hash collision probability: negligible (SHA-256)

### 3. Database Client (`lib/supabase.ts`)

Singleton Supabase client with type-safe queries.

**Key Functions**:
- `createClient()`: Initialize Supabase client
- `getArtifactByHash()`: Retrieve artifact by verification hash
- `getArtifactByCode()`: Retrieve artifact by code
- `createArtifact()`: Insert new artifact
- `updateArtifactSealed()`: Mark artifact as sealed

**Patterns**:
- Use `.maybeSingle()` for single-row queries (not `.limit(1)`)
- All queries return `{ data, error }` for error handling
- Type-safe with generated Supabase types

### 4. Design System (`lib/design-system.ts`)

Centralized design tokens for consistent styling.

**Categories**:
- Colors: Primary, secondary, background, text, accent
- Typography: Font families, sizes, weights, line heights
- Spacing: Uniform scale (xs, sm, md, lg, xl, xxl)
- Transitions: Fast, smooth, slow
- Layout: Max widths, breakpoints
- Animations: Durations, timing functions

**Usage**:
```typescript
import { colors, spacing, transitions } from '@/lib/design-system';

style={{
  backgroundColor: colors.primary,
  padding: spacing.md,
  transition: transitions.fast,
}}
```

## Data Flow

### 1. User Decision Flow

```
User selects context
    ↓
Confirm on threshold screen
    ↓
Manifest animation plays
    ↓
Engine calculates status (client-side)
    ↓
Generate artifact code (client-side)
    ↓
Display result + artifact code
    ↓
User clicks "Seal This Moment"
    ↓
Redirect to payment link
    ↓
User completes payment
    ↓
Payment provider redirects to /success
    ↓
User can verify artifact
```

### 2. Artifact Verification Flow

```
User visits /verify/[hash]
    ↓
Server queries database by hash
    ↓
If found: Display artifact details
    - Context, status, timestamp
    - Artifact code
    - Sealed status
    ↓
If not found: Show not found page
```

### 3. Payment Flow (MVP - Simplified)

```
User clicks "Seal This Moment"
    ↓
Client generates artifact data
    ↓
Redirect to payment link (NEXT_PUBLIC_PAYMENT_URL)
    ↓
Payment provider handles payment
    ↓
Success → redirect to /success page
Cancel → redirect to home page
    ↓
User manually verifies artifact (future: auto-seal)
```

**Note**: Current MVP uses payment links without server-side checkout or webhooks. Future versions can add webhook-based sealing.

## Component Architecture

### Server Components (Default)

Located in `app/` directory, run on server by default.

**Use for**:
- Data fetching from Supabase
- Environment variable access
- Server-side rendering
- SEO-friendly pages

**Examples**:
- `app/verify/[hash]/page.tsx`: Verification page (fetches artifact data)
- `app/layout.tsx`: Root layout

### Client Components (`'use client'`)

Located in `components/` directory, marked with `'use client'` directive.

**Use for**:
- Interactive UI (buttons, forms)
- React hooks (useState, useEffect)
- Browser APIs (localStorage, window)
- Animations and transitions

**Examples**:
- `components/Landing.tsx`: Context selection
- `components/Threshold.tsx`: Confirmation screen
- `components/Manifest.tsx`: Loading animation
- `components/Result.tsx`: Status display
- `components/SealButton.tsx`: Payment button

### Component Patterns

1. **Design System First**: Import tokens, not hardcode values
2. **Type Safety**: Explicit prop interfaces
3. **React.memo()**: Only for frequently re-rendering components
4. **useMemo()**: Only for expensive calculations
5. **Inline Styles**: Minimal approach, no CSS files

## API Routes

### POST /api/seal

**Purpose**: Initiate payment flow and optionally create artifact.

**Request**:
```typescript
{
  artifactCode: string;   // e.g., "ci-7a-3f2e1"
  context: string;        // "career" | "love" | "timing"
  status: string;         // "PROCEED" | "HOLD" | "NOT NOW"
  lockedMinute: number;   // UTC minute since epoch
}
```

**Response**:
```typescript
{
  checkoutUrl: string;    // Payment link URL
}
```

**Current Implementation**: Returns static payment link from env var.

**Future Enhancement**: Create artifact in database, generate custom payment URL with metadata.

### POST /api/webhook

**Purpose**: Handle payment provider webhooks (reserved for future).

**Current Status**: Placeholder for webhook-based payment confirmation.

**Future Implementation**:
- Verify webhook signature
- Update artifact as sealed
- Record payment metadata
- Send confirmation email

### GET /verify/[hash]

**Purpose**: Display sealed artifact details.

**Flow**:
1. Extract hash from URL parameter
2. Query database: `getArtifactByHash(hash)`
3. If found: Render artifact details
4. If not found: Show 404 page

**Response** (Server Component):
- Renders artifact details
- Shows context, status, timestamp
- Displays artifact code
- Shows sealed status

## Database Schema

### artifacts Table

```sql
CREATE TABLE artifacts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  artifact_code TEXT NOT NULL UNIQUE,
  context TEXT NOT NULL,
  status TEXT NOT NULL,
  locked_minute BIGINT NOT NULL,
  is_sealed BOOLEAN DEFAULT FALSE,
  payment_id TEXT,
  verify_hash TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sealed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_artifacts_verify_hash ON artifacts(verify_hash);
CREATE INDEX idx_artifacts_artifact_code ON artifacts(artifact_code);
CREATE INDEX idx_artifacts_created_at ON artifacts(created_at);
```

**Columns**:
- `id`: Auto-incrementing primary key
- `artifact_code`: Unique artifact identifier (e.g., "ci-7a-3f2e1")
- `context`: Decision context ("career", "love", "timing")
- `status`: Decision status ("PROCEED", "HOLD", "NOT NOW")
- `locked_minute`: UTC minute when decision was made
- `is_sealed`: Boolean flag for payment status
- `payment_id`: Payment provider transaction ID
- `verify_hash`: SHA-256 hash for verification URLs
- `created_at`: Timestamp of artifact creation
- `sealed_at`: Timestamp when artifact was sealed

## Security Model

### 1. Environment Variables

**Server-side only**:
- `SUPABASE_URL`: Database connection URL
- `SUPABASE_SERVICE_KEY`: Service role key (bypasses RLS)
- `STRIPE_SECRET_KEY`: Payment provider secret key
- `STRIPE_WEBHOOK_SECRET`: Webhook signature verification

**Client-safe**:
- `NEXT_PUBLIC_URL`: Application public URL
- `NEXT_PUBLIC_PAYMENT_URL`: Payment link URL

### 2. Database Security

**Row Level Security (RLS)**:
- Enabled on artifacts table
- Policies for read/write access
- Service role bypasses RLS

**SQL Injection Protection**:
- Supabase client uses parameterized queries
- No raw SQL in application code

### 3. Cryptographic Security

**Artifact Codes**:
- Generated using `crypto.getRandomValues()`
- 7 bytes of entropy (56 bits)
- Format: `ci-XX-XXXXX` (hexadecimal)

**Verification Hashes**:
- SHA-256 hash of `artifactCode-minute-status`
- First 16 characters used in URL
- Collision probability: ~1 in 2^64

### 4. Payment Security

**Current MVP**:
- Redirect-based payment links
- No server-side payment data
- Provider handles PCI compliance

**Future (Webhook-based)**:
- Verify webhook signatures
- Validate payment status
- Record transaction IDs
- Idempotent webhook handling

## Performance Optimization

### 1. Server-Side Rendering (SSR)

- Verification pages use SSR for SEO
- Data fetched on server before render
- No loading spinners for initial data

### 2. Client-Side Optimization

- Direct iteration for byte-to-hex conversion (not `Array.from().map()`)
- `React.memo()` for frequently re-rendering components
- `useMemo()` for expensive calculations (artifact code display)

### 3. Edge Runtime

- Fast cold starts (<100ms)
- Global distribution via Vercel Edge Network
- Minimal latency for API routes

### 4. Database Optimization

- Indexes on frequently queried columns
- `.maybeSingle()` for single-row queries
- Connection pooling via Supabase

## Scaling Strategy

### MVP (10k requests/month)

**Current Setup**:
- Vercel free tier (serverless functions)
- Supabase free tier (500MB database, 2GB bandwidth)
- Static payment links
- No CDN caching

**Cost**: $0-30/month

### Growth (100k requests/month)

**Enhancements**:
- Vercel Pro tier ($20/month)
- Supabase Pro tier ($25/month)
- Add CDN caching for verification pages
- Implement webhook-based payment flow
- Add monitoring and analytics

**Cost**: $90-170/month

### Scale (1M requests/month)

**Enhancements**:
- Vercel Enterprise tier (custom pricing)
- Supabase Team tier ($599/month) or PlanetScale migration
- Cloudflare Workers for hot paths
- Read replicas for database
- Advanced rate limiting
- DDoS protection

**Cost**: $250-350/month (optimized) or $1000+/month (enterprise)

## Deployment Architecture

### GitHub Actions Pipeline

```yaml
Trigger: Push or PR to main
    ↓
Checkout code
    ↓
Install dependencies (npm ci)
    ↓
Lint (npm run lint)
    ↓
Type check (npm run type-check)
    ↓
Test (npm test)
    ↓
Build (npm run build)
    ↓
Deploy to Vercel (automatic)
```

### Vercel Deployment

**Preview Deployments**:
- Automatic for all branches
- Unique URL per deployment
- Test environment variables

**Production Deployment**:
- Automatic on push to main
- Custom domain support
- Production environment variables
- Rollback capability

### Environment Configuration

**Development** (`.env.local`):
```env
NEXT_PUBLIC_URL=http://localhost:3000
SUPABASE_URL=<dev-project-url>
SUPABASE_SERVICE_KEY=<dev-service-key>
```

**Production** (Vercel Dashboard):
```env
NEXT_PUBLIC_URL=https://ci-moment.vercel.app
SUPABASE_URL=<prod-project-url>
SUPABASE_SERVICE_KEY=<prod-service-key>
NEXT_PUBLIC_PAYMENT_URL=<payment-link-url>
```

## Design Decisions

### 1. Monorepo Structure

**Why**: Single repository for frontend, backend, and infrastructure
**Benefits**: Simplified CI/CD, version control, deployment
**Trade-offs**: Larger repo size, single point of failure

### 2. App Router (Next.js 14)

**Why**: Latest Next.js architecture with Server Components
**Benefits**: Improved performance, simplified data fetching, better SEO
**Trade-offs**: Learning curve, newer ecosystem

### 3. Inline CSS (No CSS-in-JS)

**Why**: Minimal approach, no runtime overhead
**Benefits**: Simple, fast, no build dependencies
**Trade-offs**: Limited styling features, repetitive code

### 4. Supabase (PostgreSQL)

**Why**: Managed PostgreSQL with REST API and type generation
**Benefits**: SQL database, RLS, type safety, minimal ops
**Trade-offs**: Vendor lock-in, cost at scale

### 5. Payment Links (MVP)

**Why**: Simplest payment flow, no server-side complexity
**Benefits**: Fast MVP, PCI compliance handled by provider
**Trade-offs**: Limited automation, manual verification

### 6. Vercel Deployment

**Why**: Optimized for Next.js, serverless, global CDN
**Benefits**: Fast deployment, auto-scaling, zero config
**Trade-offs**: Cost at scale, vendor lock-in

## Future Enhancements

### Phase 1: Automation
- Webhook-based artifact sealing
- Email notifications
- Automated testing and deployment gates

### Phase 2: Analytics
- User behavior tracking
- Payment funnel analysis
- Performance monitoring

### Phase 3: Features
- Multi-currency support
- Artifact sharing
- Historical artifact lookup
- API for third-party integrations

### Phase 4: Scale
- Edge runtime optimization
- Database read replicas
- Cloudflare Workers fallback
- Advanced rate limiting and DDoS protection

## References

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Detailed deployment instructions
- [AGENTS.md](./AGENTS.md) - Copilot agent instructions

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-11  
**Maintained by**: @Ihorog
