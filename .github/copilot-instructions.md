# Copilot Instructions for cimoment

## Project Overview

Minimal SaaS product built with Next.js 14 App Router — a single-page decision tool with payment integration.

**Stack:**
- Next.js 14 (App Router)
- TypeScript
- React 18
- Supabase (database & auth)
- Stripe (payments)
- Deploy: Vercel

## Build & Development

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Type checking
npm run type-check  # or npx tsc --noEmit

# Linting
npm run lint

# Run a single test file (if Jest/Vitest configured)
npm test -- path/to/test-file.test.ts
```

## Architecture

### App Router Structure
- `/app` - Next.js 14 App Router pages and layouts
  - `/app/api` - API routes for server-side logic
  - `/app/(auth)` or `/app/(dashboard)` - Route groups for shared layouts
- `/components` - Reusable React components
- `/lib` - Utilities, database clients, and shared logic
  - `/lib/supabase` - Supabase client initialization (client & server)
  - `/lib/stripe` - Stripe SDK configuration
- `/types` - TypeScript type definitions

### Data Flow
1. **Authentication**: Supabase Auth for user management
2. **Database**: Supabase PostgreSQL for data persistence
3. **Payments**: Stripe Checkout/Payment Links for subscriptions
4. **Server Actions**: Use Next.js Server Actions for mutations (in `app/` or `lib/actions/`)
5. **API Routes**: `/app/api` for webhooks (Stripe) and third-party integrations

### Supabase Setup
- Use `createClient()` from `@supabase/ssr` for App Router
- **Server Components**: Create client with cookies from `next/headers`
- **Client Components**: Create client in a context provider or use `useState`
- **Middleware**: Handle auth refresh in `middleware.ts`

### Stripe Integration
- **Checkout**: Redirect to Stripe Checkout for payments
- **Webhooks**: Handle events in `/app/api/webhooks/stripe/route.ts`
  - Verify webhook signature with `stripe.webhooks.constructEvent()`
  - Update user subscription status in Supabase

## Key Conventions

### File Naming
- **Server Components**: Default in `/app`, no special suffix
- **Client Components**: Add `'use client'` directive at top
- **Server Actions**: Add `'use server'` directive, typically in `/lib/actions/` or co-located
- **API Routes**: `route.ts` files in `/app/api/[endpoint]/`

### TypeScript Patterns
- Generate Supabase types: `npx supabase gen types typescript --project-id [ref] > types/supabase.ts`
- Use `Database` type from generated types for type-safe queries
- Prefer explicit return types for Server Actions and API routes

### Environment Variables
Required for local development (`.env.local`):
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Server vs Client Component Guidelines
- **Use Server Components** (default) for:
  - Data fetching from Supabase
  - Accessing environment variables (non-public)
  - Reducing client bundle size
- **Use Client Components** (`'use client'`) for:
  - Interactivity (onClick, onChange, etc.)
  - React hooks (useState, useEffect, etc.)
  - Browser APIs (localStorage, window, etc.)
  - Third-party libraries requiring client-side rendering

### Error Handling
- Server Actions: Return `{ error: string }` or `{ success: true, data: T }`
- API Routes: Use proper HTTP status codes (200, 400, 401, 500)
- Client: Use React Error Boundaries for component-level errors

### Stripe Webhook Security
- Always verify webhook signatures in production
- Use raw body for signature verification (disable body parsing)
- Return 200 status quickly; process events async if needed

## Vercel Deployment

- Environment variables must be set in Vercel dashboard
- Stripe webhook URL: `https://yourdomain.com/api/webhooks/stripe`
- Supabase callback URL: `https://yourdomain.com/auth/callback`
- Enable automatic HTTPS and preview deployments work with Stripe test mode
