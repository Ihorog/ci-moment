# Testing & Debugging Guide

## Current Status
✅ Site is LIVE: https://ci-moment.vercel.app
✅ GitHub repo: https://github.com/Ihorog/ci-moment
⚠️ Using placeholder environment variables (Supabase, Stripe)

## What Works Now
- Landing page renders correctly
- Basic Next.js routing
- TypeScript compilation passes
- Production build succeeds

## What Needs Real Data to Test
1. **Context selection** → Threshold → Manifest flow
2. **Engine logic** (getStatus function in lib/engine.ts)
3. **Seal API** (requires Stripe keys)
4. **Webhook** (requires Stripe webhook secret)
5. **Verify page** (requires Supabase with artifacts table)

## Quick Local Test
```bash
npm run dev
# Open http://localhost:3000
# Click buttons to test UI flow
```

## Known Issues to Fix

### 1. Missing Components Content
Check if these files exist and have proper exports:
- components/Landing.tsx
- components/Threshold.tsx
- components/Manifest.tsx
- components/Result.tsx
- components/SealButton.tsx

### 2. Missing Engine Implementation
File: `lib/engine.ts`
- Need `getStatus(context: Context)` function that returns:
  ```typescript
  {
    status: Status,
    minute: number,
    artifactCode: string
  }
  ```

### 3. Database Schema
File should exist: `db/schema.sql`
Create Supabase table:
```sql
CREATE TABLE artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artifact_code TEXT UNIQUE NOT NULL,
  context TEXT NOT NULL,
  status TEXT NOT NULL,
  locked_minute_utc INTEGER NOT NULL,
  locked_at_utc TIMESTAMPTZ NOT NULL,
  is_sealed BOOLEAN DEFAULT FALSE,
  sealed_at_utc TIMESTAMPTZ,
  verify_hash TEXT UNIQUE NOT NULL,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_artifacts_verify_hash ON artifacts(verify_hash);
CREATE INDEX idx_artifacts_artifact_code ON artifacts(artifact_code);
```

## Testing Checklist

### Frontend Flow
- [ ] Landing page loads
- [ ] Can select context (career/love/timing)
- [ ] Threshold screen shows
- [ ] Manifest animation plays
- [ ] Result displays status and artifact code
- [ ] Seal button appears after 2s
- [ ] Clicking seal redirects to Stripe (will fail without real keys)

### Backend APIs
- [ ] POST /api/seal validates input
- [ ] POST /api/seal creates Stripe session
- [ ] POST /api/webhook verifies signature
- [ ] POST /api/webhook updates artifact in DB

### Verify Flow
- [ ] /verify/[hash] loads
- [ ] Shows artifact details if sealed
- [ ] Shows "not found" if not sealed

## Debug Commands
```bash
# Type check
npm run type-check

# Build locally
npm run build

# Check logs in Vercel
vercel logs https://ci-moment.vercel.app --follow

# Test API locally
curl -X POST http://localhost:3000/api/seal \
  -H "Content-Type: application/json" \
  -d '{"artifactCode":"ci-12-34567","context":"career","status":"PROCEED","lockedMinute":123456}'
```

## Next Steps
1. Check all component files have proper content
2. Implement missing engine functions
3. Create db/schema.sql
4. Set up real Supabase project
5. Set up Stripe test mode
6. Update Vercel env vars with real values
7. Test full flow end-to-end
