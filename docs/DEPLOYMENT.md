# Deployment Guide

This guide covers deploying Ci Moment to Vercel (recommended) and other platforms.

## Table of Contents

- [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
- [Environment Variables](#environment-variables)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

## Vercel Deployment (Recommended)

Vercel is the recommended platform for deploying Ci Moment as it's optimized for Next.js applications.

### Prerequisites

1. GitHub account with access to the repository
2. Vercel account (sign up at [vercel.com](https://vercel.com))
3. Supabase project configured (see [SUPABASE-SETUP.md](./SUPABASE-SETUP.md))
4. Stripe account configured (see [STRIPE-SETUP.md](./STRIPE-SETUP.md))

### Step 1: Initial Deployment

#### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
4. Click "Deploy" (initial deployment will fail without env vars - this is expected)

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd /path/to/ci-moment
vercel

# Follow the prompts:
# - Set up and deploy: Yes
# - Link to existing project: No (or Yes if already exists)
# - Project name: ci-moment
# - Directory: ./
```

### Step 2: Configure Environment Variables

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```env
# Application URL
NEXT_PUBLIC_URL=https://your-project.vercel.app

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=eyJ... (from Supabase dashboard)

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_... (or sk_test_... for test mode)
STRIPE_WEBHOOK_SECRET=whsec_... (will be configured after webhook setup)
```

**Important**: 
- Add variables to all environments (Production, Preview, Development)
- Use test mode Stripe keys initially
- Never commit secrets to Git

### Step 3: Configure Stripe Webhook

After deploying, you need to set up the Stripe webhook:

1. Get your deployment URL: `https://your-project.vercel.app`
2. Go to [Stripe Dashboard](https://dashboard.stripe.com) → Developers → Webhooks
3. Click "Add endpoint"
4. Enter webhook URL: `https://your-project.vercel.app/api/webhook`
5. Select events to listen to:
   - `checkout.session.completed`
6. Click "Add endpoint"
7. Copy the **Signing secret** (starts with `whsec_`)
8. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### Step 4: Redeploy

After adding all environment variables:

1. Go to Vercel Dashboard → Deployments
2. Click on the three dots on latest deployment
3. Click "Redeploy"
4. Wait for deployment to complete

Or via CLI:

```bash
vercel --prod
```

### Step 5: Verify Deployment

1. Visit your deployed URL
2. Test the full flow:
   - Select a context (Career/Love/Timing)
   - Confirm on threshold screen
   - Wait for manifest animation
   - View result and artifact code
   - Click "Seal This Moment"
   - Complete test payment in Stripe
   - Verify sealed artifact on verification page

## Environment Variables

### Required Variables

| Variable | Environment | Description | Example |
|----------|-------------|-------------|---------|
| `NEXT_PUBLIC_URL` | All | Public URL of the application | `https://ci-moment.vercel.app` |
| `SUPABASE_URL` | All | Supabase project URL | `https://abc123.supabase.co` |
| `SUPABASE_SERVICE_KEY` | All | Service role key (server-side) | `eyJ...` |
| `STRIPE_SECRET_KEY` | All | Stripe secret key | `sk_test_...` or `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Production | Webhook signing secret | `whsec_...` |

### Environment-Specific Configuration

#### Development
- Use test mode Stripe keys (`sk_test_...`)
- Use development Supabase project (optional)
- `NEXT_PUBLIC_URL=http://localhost:3000`

#### Preview (Vercel)
- Use test mode Stripe keys
- Configure separate webhook endpoint for preview deployments (optional)
- Vercel automatically provides preview URLs

#### Production
- Use live mode Stripe keys (`sk_live_...`)
- Use production Supabase project
- Configure production webhook endpoint

## Post-Deployment Checklist

After successful deployment, verify the following:

### Functional Testing

- [ ] Landing page loads without errors
- [ ] Can select context (Career/Love/Timing)
- [ ] Threshold screen displays correctly
- [ ] Manifest animation plays smoothly
- [ ] Result screen shows status and artifact code
- [ ] Seal button appears after 2 seconds
- [ ] Clicking seal redirects to Stripe Checkout
- [ ] Can complete payment (test mode)
- [ ] Webhook receives payment confirmation
- [ ] Artifact is marked as sealed in database
- [ ] Verification page displays sealed artifact
- [ ] Verification page shows correct status and timestamp

### Performance Testing

- [ ] Lighthouse score > 90 (Performance)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] API responses < 500ms

### Security Testing

- [ ] HTTPS enabled
- [ ] Environment variables not exposed in client
- [ ] Stripe webhook signature verified
- [ ] SQL injection protection working
- [ ] CORS properly configured

### Monitoring Setup

- [ ] Vercel Analytics enabled (optional)
- [ ] Error tracking configured (Sentry, optional)
- [ ] Stripe webhook monitoring enabled
- [ ] Database monitoring in Supabase

## Monitoring and Maintenance

### Vercel Logs

View real-time logs:

```bash
vercel logs --follow
```

Or access logs in Vercel Dashboard → Project → Logs

### Stripe Webhook Monitoring

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook endpoint
3. View:
   - Recent delivery attempts
   - Failed deliveries
   - Response codes

### Database Monitoring

1. Go to Supabase Dashboard → Database → Logs
2. Monitor:
   - Query performance
   - Error logs
   - Connection pool usage

### Key Metrics to Monitor

- **API Response Times**: Should be < 500ms
- **Webhook Success Rate**: Should be > 99%
- **Database Connections**: Monitor for connection leaks
- **Error Rate**: Should be < 1%
- **Payment Success Rate**: Monitor Stripe dashboard

## Troubleshooting

### Deployment Fails

**Build error: Missing environment variables**

```
Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set
```

**Solution**: Add all required environment variables in Vercel Dashboard → Settings → Environment Variables, then redeploy.

**Build error: Type checking failed**

```
Error: Type 'X' is not assignable to type 'Y'
```

**Solution**: Run `npm run type-check` locally to identify and fix type errors, commit, and redeploy.

### Webhook Issues

**Webhook signature verification fails**

```
Webhook Error: Webhook signature verification failed
```

**Solution**: 
1. Verify `STRIPE_WEBHOOK_SECRET` is correctly set in Vercel
2. Ensure webhook secret matches the one in Stripe Dashboard
3. Redeploy after updating the secret

**Webhook endpoint not receiving events**

**Solution**:
1. Check webhook URL in Stripe Dashboard matches deployment URL
2. Ensure `checkout.session.completed` event is selected
3. Test webhook delivery in Stripe Dashboard
4. Check Vercel logs for incoming requests

### Database Connection Issues

**Error: Failed to connect to Supabase**

**Solution**:
1. Verify `SUPABASE_URL` is correct
2. Check `SUPABASE_SERVICE_KEY` has correct permissions
3. Ensure Supabase project is active
4. Check database connection limits

### Payment Issues

**Stripe Checkout not loading**

**Solution**:
1. Verify `STRIPE_SECRET_KEY` is correct
2. Check if using test mode keys in test environment
3. Ensure `NEXT_PUBLIC_URL` is set correctly
4. Check browser console for errors

### Performance Issues

**Slow API responses**

**Solution**:
1. Check Supabase query performance
2. Review database indexes (see `db/schema.sql`)
3. Monitor Vercel Function execution time
4. Consider implementing caching

**High database connection count**

**Solution**:
1. Ensure Supabase client is reused (singleton pattern)
2. Check for connection leaks in code
3. Increase connection pool size in Supabase if needed

## Advanced Configuration

### Custom Domain

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_URL` to your custom domain
5. Update Stripe webhook URL to use custom domain
6. Redeploy

### Rate Limiting

Implement rate limiting for API endpoints:

1. Use Vercel's built-in rate limiting (Pro/Enterprise)
2. Or implement middleware-based rate limiting
3. Add rate limit headers to responses

### Security Headers

Add security headers in `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

### Rollback Strategy

If deployment fails or introduces issues:

1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click three dots → "Promote to Production"
4. Or use CLI: `vercel rollback`

## Going to Production

Before switching to production:

### Checklist

- [ ] Test full flow with test Stripe keys
- [ ] Update to live Stripe keys in Vercel
- [ ] Create production webhook in Stripe
- [ ] Update `STRIPE_WEBHOOK_SECRET` in Vercel
- [ ] Test payment with real card
- [ ] Verify webhook receives production events
- [ ] Monitor logs for any errors
- [ ] Set up alerts for critical errors
- [ ] Document incident response procedures

### Production Best Practices

1. **Always test in preview environment first**
2. **Keep test and production webhooks separate**
3. **Monitor Stripe webhook delivery rates**
4. **Set up database backups in Supabase**
5. **Enable Vercel Analytics for traffic insights**
6. **Configure error tracking (Sentry or similar)**
7. **Set up uptime monitoring**
8. **Document rollback procedures**

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Stripe Webhooks Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)

## Support

For deployment issues:
1. Check Vercel logs
2. Review this guide
3. Check [TESTING.md](../TESTING.md) for debugging tips
4. Open an issue on GitHub
