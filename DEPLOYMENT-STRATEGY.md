# GitHub-Native Deployment Strategy

## Overview

This document outlines the GitHub-native deployment strategy for Ci Moment, designed for burst-safe MVP deployment with Vercel and Cloudflare Workers as fallback infrastructure. The strategy emphasizes minimal operational overhead, native GitHub integration, and scalable patterns.

## Deployment Model

### Primary: Vercel (Edge/Serverless)

**Rationale**:
- Lowest latency with global Edge Network
- Optimal for Next.js 14 App Router
- Built-in Stripe/payment provider integration
- Zero infrastructure management
- Automatic HTTPS and domain management

**Configuration**:
- Deployment trigger: Push to main (production), push to any branch (preview)
- Build command: `npm run build`
- Runtime: Node.js 20.x
- Edge runtime for API routes (low cold start)
- Automatic preview deployments for PRs

### Backup: Cloudflare Workers

**Rationale**:
- Similar cold start performance (~100ms)
- Broader global edge network (275+ locations)
- Fallback infrastructure for traffic bursts
- KV storage for caching
- DDoS protection built-in

**Configuration** (Future):
- Deploy critical endpoints (seal, verify) to Workers
- Use KV for CDN-style caching
- Automatic failover from Vercel to Cloudflare

## Repository Structure

### Current Structure
```
ci-moment/
├── app/                # Next.js 14 App Router
│   ├── api/           # API route handlers
│   └── verify/        # Verification pages
├── components/         # React components
├── lib/               # Shared utilities
├── db/                # Database schema
├── docs/              # Documentation
├── __tests__/         # Test suite
└── .github/           # GitHub Actions workflows
    ├── workflows/
    │   └── ci.yml    # CI pipeline
    └── copilot-instructions.md
```

### Enhanced Structure (Future)
```
ci-moment/
├── app/
├── components/
├── lib/
├── db/
│   └── migrations/   # Database migrations
├── docs/
├── infra/            # Infrastructure configs
│   ├── vercel/      # Vercel settings
│   │   ├── production.json
│   │   └── preview.json
│   └── cloudflare/  # Cloudflare Workers
│       ├── workers/
│       └── kv/
├── __tests__/
└── .github/
    ├── workflows/
    │   ├── ci.yml
    │   ├── deploy-preview.yml
    │   └── deploy-production.yml
    └── environments/  # GitHub Environments config
        ├── preview.yml
        ├── staging.yml
        └── production.yml
```

## GitHub Actions Pipeline

### Current Pipeline (ci.yml)

```yaml
Trigger: Push to main or PR to main
Steps:
  1. Checkout code
  2. Setup Node.js 20
  3. Install dependencies (npm ci)
  4. Lint (npm run lint)
  5. Type check (npm run type-check)
  6. Test (npm test)
  7. Build (npm run build)
```

**Status**: ✅ Working
**Coverage**: Lint, type safety, tests, build validation

### Enhanced Pipeline: Preview Deployment

```yaml
name: Preview Deployment

on:
  pull_request:
    branches: [main]

jobs:
  ci:
    # Run CI checks (lint, test, build)
  
  deploy-preview:
    needs: ci
    runs-on: ubuntu-latest
    environment: preview
    steps:
      - name: Deploy to Vercel Preview
        # Automatic via Vercel GitHub integration
      
      - name: Comment PR with preview URL
        # GitHub API to add comment
```

**Benefits**:
- Preview deployment for every PR
- Manual testing before merge
- Comment with preview URL on PR

### Enhanced Pipeline: Production Deployment

```yaml
name: Production Deployment

on:
  push:
    branches: [main]

jobs:
  ci:
    # Run CI checks (lint, test, build)
  
  security-scan:
    needs: ci
    # Run security scans (CodeQL, dependency check)
  
  deploy-staging:
    needs: security-scan
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to staging
      - name: Run smoke tests
  
  approve-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    # Manual approval gate
  
  deploy-production:
    needs: approve-production
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel Production
      - name: Update deployment status
```

**Benefits**:
- Staging deployment for pre-production testing
- Manual approval gate for production
- Smoke tests before production
- Rollback capability

## GitHub Environments

### Environment Configuration

**Preview**:
- Purpose: Test changes in PR before merge
- Approval: None (automatic)
- Secrets: Test mode keys
- URL: `https://ci-moment-<pr-number>.vercel.app`

**Staging** (Future):
- Purpose: Pre-production testing with production-like data
- Approval: Automatic after CI passes
- Secrets: Production keys (sandboxed)
- URL: `https://staging.ci-moment.vercel.app`

**Production**:
- Purpose: Live environment
- Approval: Manual approval from maintainers
- Secrets: Production keys
- URL: `https://ci-moment.vercel.app`

### Environment Secrets

Stored in GitHub Secrets (Settings → Secrets and variables → Actions):

**Preview Environment**:
```
SUPABASE_URL=<test-project-url>
SUPABASE_SERVICE_KEY=<test-service-key>
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_PAYMENT_URL=<test-payment-link>
```

**Production Environment**:
```
SUPABASE_URL=<prod-project-url>
SUPABASE_SERVICE_KEY=<prod-service-key>
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_PAYMENT_URL=<prod-payment-link>
```

**Access Control**:
- Preview: All contributors
- Production: Repository admins only

## Security Model

### 1. Edge Rate Limiting

**Implementation** (Future):
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Rate limit based on IP
  const ip = request.ip || request.headers.get('x-forwarded-for');
  
  // Check rate limit (KV or in-memory)
  const rateLimit = checkRateLimit(ip);
  
  if (rateLimit.exceeded) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': rateLimit.retryAfter.toString(),
      },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

**Configuration**:
- 10 requests per minute per IP (MVP)
- 100 requests per minute per IP (Growth)
- Configurable via environment variables

### 2. Webhook Verification

**Stripe Webhooks** (Future):
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')!;
  const body = await request.text();
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    // Process event
  } catch (err) {
    return new Response('Webhook signature verification failed', {
      status: 400,
    });
  }
}
```

**Security Measures**:
- Verify signature on all webhook requests
- Validate timestamp (prevent replay attacks)
- Check IP allowlist (optional)
- Log all webhook attempts

### 3. Hash Collision Analysis

**Current Implementation**:
- SHA-256 hash of `artifactCode-minute-status`
- First 16 characters used in URL (64 bits)
- Collision probability: ~1 in 2^64 (~18 quintillion)

**Mitigation**:
- Use full hash internally (256 bits)
- Add salt from environment variable (optional)
- Monitor for duplicate hashes (database constraint)

### 4. Artifact Enumeration Protection

**Measures**:
- Unpredictable artifact codes (cryptographic random)
- Verification hash required (not sequential IDs)
- No listing endpoint (no `/api/artifacts`)
- Rate limiting on verification endpoint

### 5. Anti-Bot Protection

**Current** (None):
- No CAPTCHA or proof-of-work

**Future** (If needed):
- Cloudflare Turnstile on seal endpoint
- Proof-of-work challenge for burst traffic
- Bot detection via Vercel Analytics

## Traffic Handling Patterns

### 1. CDN Caching

**Verification Pages** (`/verify/[hash]`):
```typescript
// app/verify/[hash]/page.tsx
export const revalidate = 60; // Cache for 60 seconds

export async function generateStaticParams() {
  // No pre-generation, all dynamic
  return [];
}
```

**Configuration**:
- Cache verification pages for 60 seconds
- Stale-while-revalidate pattern
- Purge cache on artifact seal (future)

**Benefits**:
- Reduced database load
- Faster page loads
- Lower Vercel function costs

### 2. Edge Runtime for API Routes

**Configuration**:
```typescript
// app/api/seal/route.ts
export const runtime = 'edge';

export async function POST(request: Request) {
  // Fast cold start, global distribution
}
```

**Benefits**:
- Cold start <100ms (vs ~1s for serverless)
- Global distribution (lower latency)
- Higher burst capacity

### 3. Graceful Degradation

**HTTP 429 (Too Many Requests)**:
```typescript
return new Response('Too many requests. Please try again later.', {
  status: 429,
  headers: {
    'Retry-After': '60',
    'Content-Type': 'text/plain',
  },
});
```

**Client-side Retry**:
```typescript
async function sealArtifact(data: ArtifactData) {
  try {
    const response = await fetch('/api/seal', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      // Show user-friendly message with retry time
      return { error: `Rate limited. Retry in ${retryAfter}s` };
    }
    
    return response.json();
  } catch (error) {
    // Fallback behavior
    return { error: 'Service temporarily unavailable' };
  }
}
```

### 4. Heat Triggers (Future)

**Real-time Burst Detection**:
- Monitor request rate via Vercel Analytics
- Trigger alerts at 80% capacity
- Automatically scale or redirect to Cloudflare

**Fallback Infrastructure**:
- Deploy critical endpoints to Cloudflare Workers
- DNS-based failover (manual or automatic)
- Cache warming for verification pages

## Cost Model

### MVP (10k requests/month)

**Infrastructure**:
- Vercel: $0-20/month (Hobby/Pro tier)
- Supabase: $0-10/month (Free tier)
- Domain: $12/year
- CDN: Included (Vercel)

**Total**: $10-30/month

**Assumptions**:
- 10k page views
- 1k API requests
- 100 database writes
- 10GB bandwidth

### Growth (100k requests/month)

**Infrastructure**:
- Vercel Pro: $70-100/month
- Supabase Pro: $25-70/month
- KV Storage: $5-10/month (future)
- CDN: Included
- Monitoring: $10/month (optional)

**Total**: $90-170/month

**Assumptions**:
- 100k page views
- 10k API requests
- 1k database writes
- 100GB bandwidth

### Scale (1M requests/month)

**Infrastructure**:
- Vercel Enterprise: $200+/month
- Supabase Team: $599/month (or PlanetScale $40-120)
- KV Storage: $20-50/month
- Cloudflare Workers: $5-10/month
- Monitoring: $50-100/month

**Total**: $250-350/month (optimized) or $1000+/month (enterprise)

**Assumptions**:
- 1M page views
- 100k API requests
- 10k database writes
- 1TB bandwidth
- Edge caching enabled

## Scaling Plan

### Phase 1: MVP Optimization (Current)

**Focus**: Validate product-market fit
**Infrastructure**: Vercel + Supabase (free/hobby tier)
**Features**: Basic seal, verify, payment link
**Cost**: $10-30/month

### Phase 2: Growth Scaling (100k/month)

**Focus**: Optimize for traffic growth
**Infrastructure**: Vercel Pro + Supabase Pro
**Enhancements**:
- Enable CDN caching for verification pages
- Add webhook-based artifact sealing
- Implement rate limiting
- Add monitoring and alerts
**Cost**: $90-170/month

### Phase 3: Scale Infrastructure (1M/month)

**Focus**: High-availability and performance
**Infrastructure**: Vercel Enterprise + Supabase Team + Cloudflare
**Enhancements**:
- Cloudflare Workers for critical endpoints
- Database read replicas
- Advanced rate limiting (per-user, per-IP)
- DDoS protection
- Multi-region deployment
**Cost**: $250-350/month (optimized)

### Phase 4: Plugin Architecture (Future)

**Focus**: Extensibility and new features
**Patterns**:
- Plugin endpoints: `/api/abilities/[ability]/route.ts`
- Feature flags for gradual rollout
- A/B testing infrastructure
- Analytics and experimentation platform

**Examples**:
- Multi-currency support
- Email notifications
- API for third-party integrations
- Mobile app backend

## Rollback Strategy

### Vercel Rollback

**Method 1: Dashboard**:
1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click three dots → "Promote to Production"

**Method 2: CLI**:
```bash
vercel rollback
```

**Method 3: Git Revert**:
```bash
git revert <commit-hash>
git push origin main
# Automatic deployment triggers
```

### Database Rollback

**Migrations** (Future):
```bash
# Apply migration
npm run migrate:up

# Rollback migration
npm run migrate:down
```

**Backup/Restore** (Supabase):
1. Go to Supabase Dashboard → Database → Backups
2. Select backup point
3. Click "Restore"

### Secrets Rollback

**GitHub Secrets**:
1. Go to Settings → Secrets and variables → Actions
2. Update secret value
3. Redeploy affected environment

**Vercel Environment Variables**:
1. Go to Project Settings → Environment Variables
2. Update variable
3. Redeploy

## Monitoring and Observability

### Vercel Analytics

**Metrics**:
- Page views
- Unique visitors
- Page load time
- API response time
- Error rate

**Access**: Vercel Dashboard → Analytics

### Supabase Monitoring

**Metrics**:
- Database connections
- Query performance
- Storage usage
- API requests

**Access**: Supabase Dashboard → Reports

### GitHub Actions Monitoring

**Metrics**:
- Build success rate
- Build duration
- Deployment frequency
- Failure rate

**Access**: GitHub → Actions → Workflow runs

### Custom Monitoring (Future)

**Tools**:
- Sentry for error tracking
- PostHog for product analytics
- Uptime monitoring (UptimeRobot, Pingdom)
- Status page (Statuspage.io)

## Best Practices

### 1. Environment Separation

- Use separate Supabase projects for preview/production
- Use test mode payment keys in preview
- Never mix test and production data

### 2. Secret Management

- Store all secrets in GitHub Secrets or Vercel
- Never commit secrets to Git
- Rotate secrets regularly (quarterly)
- Use environment-specific secrets

### 3. Deployment Gates

- Always run CI before deployment
- Require PR review for production changes
- Use manual approval for critical deployments
- Test in preview before merging

### 4. Monitoring

- Set up alerts for critical errors
- Monitor API response times
- Track deployment success rate
- Review logs regularly

### 5. Documentation

- Document all environment variables
- Keep architecture diagrams up-to-date
- Maintain runbooks for incidents
- Update deployment guides

## References

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [AGENTS.md](./AGENTS.md) - Copilot agent instructions
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Detailed deployment guide
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-11  
**Maintained by**: @Ihorog
