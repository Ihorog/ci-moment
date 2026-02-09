# Stripe Setup Guide

This guide covers setting up Stripe payment integration for Ci Moment.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Test Mode Setup](#test-mode-setup)
- [Production Mode Setup](#production-mode-setup)
- [Webhook Configuration](#webhook-configuration)
- [Testing Payments](#testing-payments)
- [Troubleshooting](#troubleshooting)

## Overview

Ci Moment uses Stripe Checkout to process payments for sealing artifacts. The integration includes:

- **Stripe Checkout**: Hosted payment page
- **Webhook Handler**: Processes payment confirmation events
- **Metadata**: Links payments to artifacts via `artifact_code`

## Prerequisites

1. Stripe account (sign up at [stripe.com](https://stripe.com))
2. Deployed application (see [DEPLOYMENT.md](./DEPLOYMENT.md))
3. Database configured (see [SUPABASE-SETUP.md](./SUPABASE-SETUP.md))

## Test Mode Setup

Start with test mode to safely test the payment flow without real money.

### Step 1: Get Test API Keys

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Ensure you're in **Test mode** (toggle in the top right)
3. Navigate to **Developers** → **API keys**
4. Copy the following keys:
   - **Publishable key**: `pk_test_...` (not currently used in this app)
   - **Secret key**: `sk_test_...` (required)

### Step 2: Add Test Keys to Environment

Add to your `.env.local` (local development) or Vercel environment variables:

```env
STRIPE_SECRET_KEY=sk_test_51Abc...xyz
```

### Step 3: Create Test Webhook

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Configure the endpoint:
   - **Endpoint URL**: `http://localhost:3000/api/webhook` (for local testing)
   - **Description**: Ci Moment Test Webhook
   - **Events to send**: Select `checkout.session.completed`
4. Click **Add endpoint**
5. Copy the **Signing secret** (starts with `whsec_`)

### Step 4: Add Webhook Secret

Add to `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_abc123...
```

### Step 5: Restart Development Server

```bash
npm run dev
```

Now your local development environment is configured for Stripe test mode.

## Production Mode Setup

Only switch to production mode after thoroughly testing in test mode.

### Step 1: Get Live API Keys

1. In Stripe Dashboard, toggle to **Live mode**
2. Navigate to **Developers** → **API keys**
3. Copy your **Live** secret key: `sk_live_...`

⚠️ **Warning**: Live keys process real money. Handle with extreme care.

### Step 2: Add Live Keys to Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `STRIPE_SECRET_KEY` with your live key
3. Ensure it's only set for **Production** environment (not Preview/Development)

```env
STRIPE_SECRET_KEY=sk_live_51Xyz...abc
```

### Step 3: Create Production Webhook

1. In Stripe Dashboard (Live mode), go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Configure the endpoint:
   - **Endpoint URL**: `https://your-domain.vercel.app/api/webhook`
   - **Description**: Ci Moment Production Webhook
   - **Events to send**: Select `checkout.session.completed`
4. Click **Add endpoint**
5. Copy the **Signing secret**

### Step 4: Add Production Webhook Secret

Add to Vercel environment variables (Production only):

```env
STRIPE_WEBHOOK_SECRET=whsec_production_secret_here
```

### Step 5: Redeploy

Redeploy your Vercel application to apply the new environment variables:

```bash
vercel --prod
```

## Webhook Configuration

### Endpoint Details

- **URL**: `https://your-domain.com/api/webhook`
- **Method**: POST
- **Events**: `checkout.session.completed`
- **API Version**: Latest (automatically handled by Stripe SDK)

### How It Works

1. User completes payment on Stripe Checkout
2. Stripe sends `checkout.session.completed` event to your webhook
3. Webhook handler:
   - Verifies the signature using `STRIPE_WEBHOOK_SECRET`
   - Extracts `artifact_code` from session metadata
   - Updates the artifact in Supabase to mark it as sealed
   - Returns 200 status to Stripe

### Webhook Security

The webhook handler verifies every request using signature verification:

```typescript
const event = stripe.webhooks.constructEvent(
  body,          // Raw request body
  signature,     // Stripe-Signature header
  webhookSecret  // Your webhook secret
);
```

This ensures:
- Requests come from Stripe (not attackers)
- Request body hasn't been tampered with
- Replay attacks are prevented

### Testing Webhooks Locally

For local development, use Stripe CLI to forward webhooks:

#### Option 1: Stripe CLI (Recommended)

1. Install Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe

# Linux
# Download from https://github.com/stripe/stripe-cli/releases
```

2. Login to Stripe:
```bash
stripe login
```

3. Forward webhooks to localhost:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

4. Copy the webhook signing secret shown (starts with `whsec_`)

5. Update `.env.local` with the CLI webhook secret:
```env
STRIPE_WEBHOOK_SECRET=whsec_cli_secret_here
```

6. Test the webhook:
```bash
stripe trigger checkout.session.completed
```

#### Option 2: Manual Testing

Use `curl` to test the endpoint (without signature verification):

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "id": "evt_test",
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "cs_test_123",
        "metadata": {
          "artifact_code": "ci-7a-3f2e1"
        }
      }
    }
  }'
```

⚠️ Note: This won't work in production as signature verification will fail.

## Testing Payments

### Test Card Numbers

Use these test cards in test mode:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 9995` | Payment declined (insufficient funds) |
| `4000 0025 0000 3155` | Requires authentication (3D Secure 2) |

**Card details for testing:**
- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

More test cards: [Stripe Testing Docs](https://stripe.com/docs/testing)

### Testing Full Payment Flow

1. Start the application (local or deployed)
2. Complete the decision flow (Landing → Threshold → Manifest → Result)
3. Click "Seal This Moment"
4. You'll be redirected to Stripe Checkout
5. Enter test card details: `4242 4242 4242 4242`
6. Complete payment
7. You'll be redirected back with `?sealed=true`
8. Verify the artifact is marked as sealed in Supabase
9. Check verification page: `/verify/{hash}`

### Verifying Webhook Receipt

**In Stripe Dashboard:**
1. Go to **Developers** → **Webhooks**
2. Click on your webhook endpoint
3. View recent events under **Attempts**
4. Check for successful deliveries (200 status)

**In Vercel Logs:**
```bash
vercel logs --follow
```

Look for:
```
Stripe webhook received: checkout.session.completed
Artifact sealed: ci-7a-3f2e1
```

**In Supabase:**
Query the `artifacts` table:
```sql
SELECT * FROM artifacts WHERE artifact_code = 'ci-7a-3f2e1';
```

Check:
- `is_sealed` should be `true`
- `sealed_at_utc` should have a timestamp
- `stripe_session_id` should contain the session ID

## Troubleshooting

### "Webhook signature verification failed"

**Cause**: Webhook secret doesn't match or request isn't from Stripe.

**Solution**:
1. Verify `STRIPE_WEBHOOK_SECRET` is correct
2. Check you're using the right secret for your environment
3. Ensure raw request body is used (no JSON parsing before verification)
4. Test webhook in Stripe Dashboard

### "No such checkout session"

**Cause**: Using test mode API key with live session ID (or vice versa).

**Solution**:
1. Ensure test/live keys match the mode you're testing in
2. Check Stripe Dashboard mode (top right toggle)
3. Use test cards in test mode only

### Webhook not receiving events

**Cause**: Webhook URL incorrect or endpoint not accessible.

**Solution**:
1. Verify webhook URL in Stripe Dashboard
2. Check URL is publicly accessible (for production)
3. Test endpoint with `curl`:
```bash
curl -I https://your-domain.com/api/webhook
```
4. Check Vercel deployment logs for errors

### Payment succeeds but artifact not sealed

**Cause**: Webhook received but database update failed.

**Solution**:
1. Check Vercel logs for errors in webhook handler
2. Verify Supabase connection is working
3. Check artifact exists in database before payment
4. Ensure `artifact_code` is in checkout session metadata
5. Verify database permissions (service role key should have full access)

### Duplicate payment charges

**Cause**: User clicked checkout multiple times or retried payment.

**Solution**:
1. Check `stripe_session_id` in database to detect duplicates
2. Implement idempotency in webhook handler
3. Show loading state during checkout creation
4. Consider adding a "processing" state to artifacts

### Amount doesn't match expected price

**Cause**: Price hardcoded in checkout session creation.

**Solution**:
The price is currently hardcoded to $5.00 (500 cents):
```typescript
unit_amount: 500, // $5.00
```

To change:
1. Edit `/app/api/seal/route.ts`
2. Modify `unit_amount` (in cents)
3. Redeploy

Or create a Stripe Price object and reference it:
```typescript
line_items: [{
  price: 'price_abc123', // Stripe Price ID
  quantity: 1,
}]
```

## Production Checklist

Before going live with real payments:

- [ ] Tested full payment flow in test mode
- [ ] Verified webhook receives and processes events correctly
- [ ] Confirmed artifacts are sealed in database
- [ ] Tested with all test card scenarios
- [ ] Switched to live API keys
- [ ] Created production webhook endpoint
- [ ] Updated webhook secret in Vercel
- [ ] Tested with real card (small amount)
- [ ] Verified production webhook delivery
- [ ] Set up Stripe email receipts
- [ ] Configured business information in Stripe
- [ ] Set up bank account for payouts
- [ ] Enabled two-factor authentication on Stripe account
- [ ] Reviewed Stripe fees and pricing
- [ ] Set up tax collection if required

## Best Practices

1. **Never expose secret keys**: Keep `STRIPE_SECRET_KEY` server-side only
2. **Always verify webhooks**: Don't trust unauthenticated requests
3. **Use webhooks for fulfillment**: Never rely solely on client-side confirmation
4. **Handle idempotency**: Use `stripe_session_id` to prevent duplicate processing
5. **Log everything**: Log webhook events for debugging
6. **Monitor webhook health**: Set up alerts for failed deliveries
7. **Test thoroughly**: Use all test cards before going live
8. **Separate test and live**: Never use test keys in production

## Additional Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Security Best Practices](https://stripe.com/docs/security/guide)
- [Stripe Node.js SDK](https://github.com/stripe/stripe-node)

## Support

For Stripe-related issues:
1. Check [Stripe Status](https://status.stripe.com)
2. Review Stripe Dashboard logs
3. Consult [Stripe Documentation](https://stripe.com/docs)
4. Contact [Stripe Support](https://support.stripe.com)
