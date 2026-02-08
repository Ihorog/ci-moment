# Ci Moment — Deploy Status
Generated: 2026-02-09 01:16:26 UTC

## Vercel
- Project: ci-moment
- URL: https://ci-moment.vercel.app
- Status: DEPLOYED ✅

## Pending Manual Steps (for @є1)
- [ ] Create Supabase project → run db/schema.sql
- [ ] Add SUPABASE_URL to Vercel env vars (replace placeholder)
- [ ] Add SUPABASE_SERVICE_KEY to Vercel env vars (replace placeholder)
- [ ] Add STRIPE_SECRET_KEY to Vercel env vars (replace placeholder, test mode)
- [ ] Create Stripe webhook: https://ci-moment.vercel.app/api/webhook → checkout.session.completed
- [ ] Add STRIPE_WEBHOOK_SECRET to Vercel env vars (replace placeholder)
- [ ] Redeploy: vercel --prod
- [ ] Test full flow: Landing → Threshold → Manifest → Result → Seal → Stripe → Verify

## Git
- Repo: github.com/Ihorog/ci-moment
- Branch: master
- Commit: "Ci Moment MVP — full stack assembled"

## Environment Variables (Current Status)
✅ NEXT_PUBLIC_URL: https://ci-moment.vercel.app
⚠️ SUPABASE_URL: placeholder (needs real value)
⚠️ SUPABASE_SERVICE_KEY: placeholder (needs real value)
⚠️ STRIPE_SECRET_KEY: placeholder (needs real value)
⚠️ STRIPE_WEBHOOK_SECRET: placeholder (needs real value)
