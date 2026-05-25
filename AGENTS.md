# Copilot Agent Instructions for Ci Moment

## Project Context

**Ci Moment** is a minimalist SaaS decision tool built with Next.js 14 (App Router), Supabase (PostgreSQL), and payment integration. This document provides instructions for GitHub Copilot agents to assist with development, deployment, and maintenance tasks.

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js Route Handlers (serverless/edge functions)
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Payments**: Fondy/WayForPay (redirect-based payment links)
- **Deployment**: Vercel (primary), Cloudflare Workers (fallback capability)
- **CI/CD**: GitHub Actions

### Repository Structure
```
ci-moment/
├── app/              # Next.js 14 App Router
│   ├── api/         # API route handlers
│   │   ├── seal/    # Payment initiation
│   │   └── webhook/ # Payment webhook handler
│   ├── verify/      # Verification pages
│   └── page.tsx     # Main application
├── components/       # React components (client/server)
├── lib/             # Shared utilities
│   ├── engine.ts    # Decision engine (client-safe)
│   ├── engine.server.ts # Server-only crypto
│   ├── design-system.ts # Centralized design tokens
│   └── supabase.ts  # Database client
├── db/              # Database schema
├── docs/            # Documentation
├── __tests__/       # Jest test suite
└── .github/         # GitHub Actions workflows
```

## Core Principles

### 1. Minimal Changes Philosophy
- Make the smallest possible changes to achieve goals
- Don't refactor working code unless directly related to the task
- Preserve existing patterns and conventions
- Test incrementally, not everything at once

### 2. Design System First
- All UI components import from `lib/design-system.ts`
- Never hardcode colors, spacing, or typography
- Use semantic tokens: `colors.primary`, `spacing.md`, `transitions.fast`

### 3. Client vs Server Components
- **Server Components** (default): Data fetching, database queries, environment variables
- **Client Components** (`'use client'`): Interactivity, React hooks, browser APIs
- **Server-only code**: Use `.server.ts` suffix for server-only modules (e.g., `engine.server.ts`)

### 4. Type Safety
- Database types generated from Supabase schema
- Explicit return types for all API routes and Server Actions
- Use TypeScript strict mode

### 5. Security Model
- No Stripe webhooks or server-side checkout sessions (MVP uses payment links)
- Use `.maybeSingle()` for single-row queries (not `.limit(1)`)
- Direct iteration for performance-critical code (not `Array.from().map()`)
- All environment variables validated at build time

## Agent Capabilities

### Code Review Agent
**When to use**: Before merging PRs, after significant changes

**Instructions**:
1. Check for design system violations (hardcoded values)
2. Verify client/server component boundaries
3. Ensure type safety (no `any`, explicit return types)
4. Review security patterns (SQL injection, XSS, environment variables)
5. Check for performance anti-patterns

**Example prompt**:
```
Review this PR for:
- Design system compliance
- Type safety
- Security best practices
- Performance patterns
```

### Architecture Agent
**When to use**: Planning new features, refactoring, scaling decisions

**Instructions**:
1. Start with current architecture (documented in ARCHITECTURE.md)
2. Propose minimal changes that fit existing patterns
3. Consider Vercel/serverless constraints (stateless, cold start, edge runtime)
4. Document scaling implications and cost model
5. Avoid over-engineering (MVP → Growth path, not enterprise from day 1)

**Example prompt**:
```
How should we add [feature] to Ci Moment?
- Consider current Next.js 14 App Router setup
- Maintain serverless/edge compatibility
- Estimate cost impact
- Provide migration path
```

### Deployment Agent
**When to use**: Setting up environments, troubleshooting deployments, rollbacks

**Instructions**:
1. Reference DEPLOYMENT.md and DEPLOYMENT-STRATEGY.md
2. Use GitHub Environments for preview/production gates
3. Verify environment variables for each stage
4. Test webhook endpoints and payment flows
5. Monitor Vercel logs and Supabase metrics

**Example prompt**:
```
Deploy checklist for [environment]:
- Environment variables configured
- Payment provider webhook URL updated
- Database migrations applied
- Smoke test completed
```

### Testing Agent
**When to use**: Writing tests, debugging failures, CI/CD issues

**Instructions**:
1. Tests use Jest with ts-jest (config in `jest.config.ts`)
2. Test files in `__tests__/` with `.test.ts` extension
3. Performance tests use `performance.now()` for benchmarking
4. Mock Supabase client for unit tests
5. Integration tests use test database or local Supabase instance

**Example prompt**:
```
Write tests for [feature]:
- Unit tests for lib/ functions
- Integration tests for API routes
- Performance benchmarks for critical paths
```

### Security Agent
**When to use**: Code changes, dependency updates, vulnerability reports

**Instructions**:
1. Check GitHub Advisory Database for dependencies
2. Verify webhook signature verification (if applicable)
3. Ensure proper input sanitization (Supabase client handles SQL injection)
4. Review rate limiting and DDoS mitigation
5. Check for secrets in code or logs

**Example prompt**:
```
Security review for [change]:
- Dependency vulnerabilities
- Input validation
- Authentication/authorization
- Secrets management
```

## Common Tasks

### Adding a New API Endpoint

1. **Create route handler** in `app/api/[endpoint]/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const supabase = createClient();
  // Implementation
  return NextResponse.json({ success: true });
}
```

2. **Add types** if needed in `lib/supabase.ts`
3. **Write tests** in `__tests__/api/[endpoint].test.ts`
4. **Update documentation** in relevant docs/ files
5. **Verify**: `npm run type-check && npm run lint && npm test`

### Adding a New Component

1. **Determine component type**: Client or Server?
2. **Import design system**: `import { colors, spacing } from '@/lib/design-system';`
3. **Use semantic tokens**: No hardcoded `#hex` or `16px` values
4. **Add types**: Props interface with explicit types
5. **Optimize**: Use `React.memo()` only if re-renders are frequent

Example:
```typescript
'use client'; // if interactive

import { colors, spacing, transitions } from '@/lib/design-system';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: colors.primary,
        padding: spacing.md,
        transition: transitions.fast,
      }}
    >
      {label}
    </button>
  );
}
```

### Debugging Deployment Issues

1. **Check Vercel logs**: `vercel logs --follow` or Dashboard → Logs
2. **Verify environment variables**: Settings → Environment Variables
3. **Test locally**: `npm run build && npm start`
4. **Check database**: Supabase Dashboard → Database → Logs
5. **Rollback if needed**: Vercel Dashboard → Deployments → Promote to Production

### Running CI/CD Locally

```bash
# Lint
npm run lint

# Type check
npm run type-check

# Test
npm test

# Build (checks env vars)
npm run build

# Full CI simulation
npm ci && npm run lint && npm run type-check && npm test && npm run build
```

## Deployment Patterns

### MVP Flow (Current)
1. **Code changes** → Push to branch
2. **GitHub Actions** → Lint, type-check, test, build
3. **Vercel Preview** → Automatic preview deployment
4. **Manual review** → Test preview deployment
5. **Merge to main** → Automatic production deployment

### Growth Flow (Future)
1. Add GitHub Environments (preview, staging, production)
2. Require manual approval for production
3. Add preview → staging → production gates
4. Implement rollback automation
5. Add monitoring and alerts

## Scaling Guidelines

### Traffic Growth
- **10k/mo**: MVP setup sufficient (Vercel free tier + Supabase free tier)
- **100k/mo**: Add CDN caching for /verify, consider Vercel Pro
- **1M/mo**: Edge runtime for hot paths, Cloudflare Workers fallback, PlanetScale migration

### Cost Model
| Tier | Monthly Requests | Compute Cost | Storage Cost | Total |
|------|-----------------|--------------|--------------|-------|
| MVP | 10k | $0-20 (Vercel) | $0-10 (Supabase) | $10-30 |
| Growth | 100k | $70-100 | $10-70 | $90-170 |
| Scale | 1M | $200+ | $20-120 | $250-350 |

### Feature Extensions
- **Add new endpoints**: Plugin pattern in `app/api/abilities/[ability]/route.ts`
- **Add new database tables**: Migration in `db/migrations/`
- **Add new payment providers**: Abstract payment service in `lib/payments/`
- **Add analytics**: Vercel Analytics or PostHog integration

## Best Practices

### Performance
- Use direct iteration for byte-to-hex conversion (hot path)
- Apply `React.memo()` sparingly (only when needed)
- Use `useMemo()` for expensive calculations (e.g., artifact code display)
- Avoid blocking operations in Server Components

### Error Handling
- Return structured errors: `{ error: string }` from API routes
- Use proper HTTP status codes (200, 400, 401, 500)
- Log errors to Vercel logs (console.error)
- Don't expose internal errors to clients

### Database Queries
- Use `.maybeSingle()` for single-row queries
- Index foreign keys and frequently queried columns
- Use Row Level Security policies in Supabase
- Monitor query performance in Supabase Dashboard

### Environment Variables
- Required vars checked at build time
- Use `NEXT_PUBLIC_*` prefix only for client-side vars
- Never commit secrets to Git
- Document all vars in `.env.example`

## Memory Snippets

Store these patterns when working on Ci Moment:

**Build and test commands**:
```bash
npm run build    # Production build
npm run type-check  # TypeScript validation
npm run lint     # ESLint
npm test         # Jest test suite
```

**Design system usage**:
```typescript
import { colors, typography, spacing, transitions } from '@/lib/design-system';
```

**Supabase queries**:
```typescript
const { data, error } = await supabase
  .from('artifacts')
  .select('*')
  .eq('artifact_code', code)
  .maybeSingle(); // Use this for single-row queries
```

**CI workflow triggers**:
- Push to main → Full CI + deploy
- Pull request to main → Full CI (lint, type-check, test, build)

## Task Checklist

When assigned a task, follow this workflow:

1. **Understand**: Read issue, comments, and related documentation
2. **Explore**: Review relevant code files and tests
3. **Plan**: Create minimal-change plan, report with `report_progress`
4. **Test first**: Write tests for new behavior (if test infra exists)
5. **Implement**: Make minimal, targeted changes
6. **Validate**: Run tests, type-check, lint, build
7. **Document**: Update relevant documentation
8. **Report**: Commit and push with `report_progress`
9. **Review**: Request code review if significant changes
10. **Complete**: Verify CI passes, update issue

## Quick Reference

### File Locations
- Components: `components/`
- API routes: `app/api/`
- Utilities: `lib/`
- Tests: `__tests__/`
- Schema: `db/schema.sql`
- Docs: `docs/`
- Workflows: `.github/workflows/`

### Key Files
- Design system: `lib/design-system.ts`
- Database client: `lib/supabase.ts`
- Engine logic: `lib/engine.ts` (client), `lib/engine.server.ts` (server)
- CI config: `.github/workflows/ci.yml`
- Vercel config: `vercel.json`
- Jest config: `jest.config.ts`

### Documentation
- Architecture: `ARCHITECTURE.md`
- Deployment: `docs/DEPLOYMENT.md`
- Deployment strategy: `DEPLOYMENT-STRATEGY.md`
- Security: `SECURITY.md`
- Contributing: `CONTRIBUTING.md`
- Changelog: `CHANGELOG.md`

## Contact

For questions about these agent instructions or to suggest improvements, open an issue or discussion on GitHub.

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-11  
**Maintained by**: @Ihorog
