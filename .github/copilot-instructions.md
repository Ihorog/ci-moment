# Copilot Instructions for cimoment

## Project Overview

Minimal SaaS product built with Next.js 14 App Router — a single-page decision tool with payment integration.

**Stack:**
- Next.js 14 (App Router)
- TypeScript
- React 18
- Supabase (database)
- Fondy (payments)
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
  - `/lib/supabase` - Supabase client initialization
  - `/lib/engine` - Decision engine logic
- `/types` - TypeScript type definitions

### Data Flow
1. **Database**: Supabase PostgreSQL for data persistence
2. **Payments**: Fondy payment gateway for transactions
3. **Server Actions**: Use Next.js Server Actions for mutations (in `app/` or `lib/actions/`)
4. **API Routes**: `/app/api` for payment integration and third-party services

### Supabase Setup
- Use `createClient()` from `@supabase/supabase-js`
- **Server Components**: Direct database access with service role key
- **Client Components**: Use client-safe operations via API routes

### Fondy Integration
- **Checkout**: API creates signed checkout request to Fondy
- **Payment Flow**: User completes payment on Fondy, redirects back to verification page
- **API Route**: `/app/api/seal/route.ts` handles payment initiation

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
SUPABASE_URL=
SUPABASE_SERVICE_KEY=

# Fondy
FONDY_MERCHANT_ID=
FONDY_SECRET_KEY=

# Application
NEXT_PUBLIC_URL=
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

### Payment Security
- Always verify Fondy signatures in payment requests
- Use SHA-1 hash for Fondy signature generation
- Return 200 status for successful API responses

## Vercel Deployment

- Environment variables must be set in Vercel dashboard
- Fondy credentials: `FONDY_MERCHANT_ID` and `FONDY_SECRET_KEY`
- Supabase credentials: `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`
- Application URL: `NEXT_PUBLIC_URL`
- Enable automatic HTTPS and preview deployments
