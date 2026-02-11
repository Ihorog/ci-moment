# Environment Configuration Examples

This document provides example environment configurations for different deployment stages of Ci Moment.

## Overview

Ci Moment uses environment variables to configure different aspects of the application across development, preview, and production environments.

## Environment Files

### Development (.env.local)

Create this file in your project root for local development:

```env
# Application URL (local development)
NEXT_PUBLIC_URL=http://localhost:3000

# Supabase Configuration (Development Project)
SUPABASE_URL=https://your-dev-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-dev-service-key

# Payment Configuration (Optional for local dev)
# Leave empty to see "Payment not configured" button
NEXT_PUBLIC_PAYMENT_URL=

# Stripe Configuration (Test Mode - for future webhook support)
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_test_webhook_secret
```

**Notes**:
- Use a separate Supabase project for development
- Never use production keys in development
- Payment URL can be omitted for local testing

### Preview (Vercel Environment Variables)

Configure in Vercel Dashboard → Project → Settings → Environment Variables → Preview

```env
# Application URL (Vercel provides this automatically)
NEXT_PUBLIC_URL=https://ci-moment-git-<branch>-<username>.vercel.app

# Supabase Configuration (Test/Preview Project)
SUPABASE_URL=https://your-preview-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-preview-service-key

# Payment Configuration (Test Payment Link)
NEXT_PUBLIC_PAYMENT_URL=https://pay.fondy.eu/merchants/your-test-merchant-id/payment

# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_preview_webhook_secret
```

**Notes**:
- Use test mode for all payment providers
- Can share the same Supabase project as development
- Preview deployments are ephemeral (can be deleted)

### Staging (Future - GitHub Environment)

Configure in GitHub Settings → Environments → staging

```env
# Application URL
NEXT_PUBLIC_URL=https://staging.ci-moment.vercel.app

# Supabase Configuration (Staging Project)
SUPABASE_URL=https://your-staging-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-staging-service-key

# Payment Configuration (Test Payment Link)
NEXT_PUBLIC_PAYMENT_URL=https://pay.fondy.eu/merchants/your-test-merchant-id/payment

# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_staging_webhook_secret
```

**Notes**:
- Staging should mirror production setup
- Use test mode but with production-like data
- Useful for final pre-production testing

### Production (Vercel Environment Variables)

Configure in Vercel Dashboard → Project → Settings → Environment Variables → Production

```env
# Application URL (Your custom domain or Vercel default)
NEXT_PUBLIC_URL=https://ci-moment.vercel.app

# Supabase Configuration (Production Project)
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-prod-service-key

# Payment Configuration (Production Payment Link)
NEXT_PUBLIC_PAYMENT_URL=https://pay.fondy.eu/merchants/your-prod-merchant-id/payment

# Stripe Configuration (Live Mode - for future webhook support)
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
```

**Notes**:
- Use live mode keys only in production
- Separate Supabase project for production data
- Enable all security features and monitoring
- Set up custom domain for better SEO

## GitHub Secrets Configuration

Store sensitive values in GitHub Secrets for use in GitHub Actions workflows.

### How to Add Secrets

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add name and value
5. Click "Add secret"

### Required Secrets

For GitHub Actions workflows to work properly, add these secrets:

```
VERCEL_TOKEN         # Vercel API token (for deployments from Actions)
VERCEL_ORG_ID        # Your Vercel organization ID
VERCEL_PROJECT_ID    # Your Vercel project ID
```

**Optional Secrets** (for enhanced workflows):
```
SENTRY_AUTH_TOKEN    # For error tracking (future)
SLACK_WEBHOOK_URL    # For deployment notifications (future)
```

### How to Get Vercel Credentials

**Vercel Token**:
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Create new token
3. Copy and add to GitHub Secrets as `VERCEL_TOKEN`

**Vercel Organization ID & Project ID**:
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
cd /path/to/ci-moment
vercel link

# Get IDs from .vercel/project.json
cat .vercel/project.json
```

## Environment-Specific Features

### Development
- **Hot reload**: Automatic page refresh on code changes
- **Error overlay**: Detailed error messages in browser
- **Source maps**: Full source maps for debugging
- **Mock data**: Optional mock data for testing without database

### Preview
- **Automatic deployments**: Every PR gets a unique URL
- **Test mode**: All payment providers in test mode
- **Preview comments**: GitHub bot comments with deployment URL
- **Temporary**: Deployments can be deleted after merge

### Production
- **Optimized builds**: Minified, tree-shaken bundles
- **CDN caching**: Static assets cached globally
- **Error tracking**: Errors logged to monitoring service
- **Analytics**: User behavior and performance tracking

## Security Best Practices

### 1. Never Commit Secrets

Add `.env.local` to `.gitignore`:

```gitignore
# Local environment variables
.env.local
.env.*.local
.env.development.local
.env.test.local
.env.production.local
```

### 2. Use Environment-Specific Keys

- Development: Use test keys, separate database
- Preview: Use test keys, can share development database
- Production: Use live keys, separate production database

### 3. Rotate Keys Regularly

- Rotate all API keys quarterly
- Rotate webhook secrets after security incidents
- Use different keys for each environment

### 4. Limit Access

- Production secrets: Repository admins only
- Preview/staging secrets: All contributors
- Development: Each developer has their own `.env.local`

### 5. Audit Secret Usage

- Review which services have access to secrets
- Remove unused environment variables
- Monitor API key usage in provider dashboards

## Vercel Environment Variables UI

### Adding Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (ci-moment)
3. Go to Settings → Environment Variables
4. Click "Add New"
5. Configure:
   - **Name**: `NEXT_PUBLIC_URL`
   - **Value**: `https://ci-moment.vercel.app`
   - **Environments**: Check "Production", "Preview", or "Development"
6. Click "Save"

### Bulk Import

Vercel supports `.env` file upload:

1. Create a file with your variables
2. Go to Settings → Environment Variables
3. Click "Add" → "Import .env file"
4. Upload file and select environments
5. Click "Import"

## Troubleshooting

### Environment Variable Not Found

**Symptom**: Build fails with "Environment variable not found"

**Solution**:
1. Verify variable is set in Vercel Dashboard
2. Check spelling and case (case-sensitive)
3. Ensure variable is set for the correct environment
4. Redeploy after adding variable

### Client-Side Variable Not Updating

**Symptom**: `NEXT_PUBLIC_*` variable not updating in browser

**Solution**:
1. Restart development server (`npm run dev`)
2. Clear browser cache
3. Check variable starts with `NEXT_PUBLIC_` prefix
4. Rebuild application (`npm run build`)

### Wrong Environment Variable Used

**Symptom**: Production using test keys or vice versa

**Solution**:
1. Verify environment selection in Vercel
2. Check GitHub Actions environment configuration
3. Review deployment logs for loaded variables
4. Test with `console.log(process.env.NEXT_PUBLIC_URL)`

## Migration Guide

### From .env to Vercel

If you're migrating from `.env` files to Vercel:

1. **Backup your .env files**:
   ```bash
   cp .env.local .env.backup
   ```

2. **Add variables to Vercel**:
   - Use Vercel Dashboard or Vercel CLI
   - Set correct environment for each variable

3. **Verify deployment**:
   ```bash
   vercel env pull .env.vercel
   # Check that variables match expectations
   ```

4. **Test in preview**:
   - Create a test PR
   - Verify preview deployment works
   - Check all features function correctly

5. **Deploy to production**:
   - Merge PR to main
   - Monitor production deployment
   - Test live site

## Reference

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [DEPLOYMENT.md](../docs/DEPLOYMENT.md) - Deployment guide
- [DEPLOYMENT-STRATEGY.md](../DEPLOYMENT-STRATEGY.md) - Deployment strategy

---

**Last Updated**: 2026-02-11  
**Maintained by**: @Ihorog
