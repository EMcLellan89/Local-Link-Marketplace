# StoryLab Next.js Setup Guide

## Overview

This guide shows how to use the provided Next.js Pages Router code for StoryLab. The code implements:

- ✅ DB-driven pricing from Supabase
- ✅ Stripe checkout with partner attribution
- ✅ Idempotent webhook handling
- ✅ Commission calculation (25% for Profit Network)
- ✅ STOP compliance for SMS
- ✅ Email delivery via Brevo + SendGrid fallback
- ✅ Queue worker for message jobs

## Directory Structure

```
your-nextjs-project/
├── pages/
│   └── api/
│       ├── storylab/
│       │   └── kids/
│       │       ├── pricing.ts
│       │       └── checkout-session.ts
│       ├── stripe/
│       │   └── webhook.ts
│       ├── twilio/
│       │   └── inbound.ts
│       └── jobs/
│           └── worker.ts
├── lib/
│   ├── supabaseAdmin.ts
│   ├── stripe.ts
│   ├── partners.ts
│   ├── pricing.ts
│   ├── idempotency.ts
│   ├── commissionV2.ts
│   ├── orders.ts
│   └── messaging/
│       ├── brevo.ts
│       ├── sendgrid.ts
│       └── twilio.ts
└── .env.local
```

## Installation

### 1. Create Next.js Project

```bash
npx create-next-app@latest storylab --typescript --tailwind --app-router=false
cd storylab
```

Note: Use `--app-router=false` to use Pages Router (required for provided code).

### 2. Install Dependencies

```bash
npm install @supabase/supabase-js stripe twilio
```

### 3. Copy Lib Files

Copy all files from `/src/lib/` (created in this project) to your Next.js `/lib/` directory:

```bash
cp -r src/lib/* your-nextjs-project/lib/
```

### 4. Create API Routes

Create the following API route files in your Next.js project:

#### `pages/api/storylab/kids/pricing.ts`

```typescript
import type { NextApiRequest, NextApiResponse } from "next";
import { listPricing } from "../../../../lib/pricing";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });

  try {
    const pricing = await listPricing({ business_key: "storylab_kids" });
    return res.status(200).json({ pricing });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "pricing_failed" });
  }
}
```

#### `pages/api/storylab/kids/checkout-session.ts`

See the full implementation in the pasted content. Key features:
- Gets pricing from Supabase
- Creates order record
- Resolves partner by ref code
- Creates Stripe checkout session
- Includes full metadata for webhook

#### `pages/api/stripe/webhook.ts`

Key features:
- **Idempotent**: Checks `stripe_webhook_events` first
- Handles `checkout.session.completed`
- Handles `invoice.payment_succeeded` for subscriptions
- Handles `charge.refunded`
- Creates commissions automatically
- Uses raw body parser

#### `pages/api/twilio/inbound.ts`

Key features:
- Handles STOP/STOPALL/UNSUBSCRIBE commands
- Adds to `contact_suppressions` table
- Returns TwiML response (required by Twilio)

#### `pages/api/jobs/worker.ts`

This is a queue worker that:
- Pulls pending jobs from `message_jobs` table
- Sends via Twilio (SMS) or Brevo (email)
- Respects `contact_suppressions`
- Marks jobs as sent/failed
- Safe retry logic

## Environment Variables

Create `.env.local`:

```bash
# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CRON_SECRET=your_secret_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Twilio (optional)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+1...
TWILIO_MESSAGING_SERVICE_SID=MG...

# Brevo
BREVO_API_KEY=xkeysib-...
BREVO_FROM_EMAIL=no-reply@yourdomain.com
BREVO_FROM_NAME=StoryLab

# SendGrid (optional fallback)
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=no-reply@yourdomain.com
SENDGRID_FROM_NAME=StoryLab

# Queue
QSTASH_TOKEN=...
QSTASH_CURRENT_SIGNING_KEY=...
QSTASH_NEXT_SIGNING_KEY=...

# Settings
COMMISSION_HOLD_DAYS=15
```

## Stripe Webhook Setup

### 1. Run Local Testing (Stripe CLI)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook secret to `.env.local`.

### 2. Production Webhook (Stripe Dashboard)

Add webhook endpoint:
- URL: `https://yourdomain.com/api/stripe/webhook`
- Events:
  - `checkout.session.completed`
  - `invoice.payment_succeeded`
  - `charge.refunded`

Copy signing secret to production env.

## Twilio Webhook Setup

In Twilio Console:
- Messaging → Settings → Webhooks
- When a message comes in: `https://yourdomain.com/api/twilio/inbound`
- Method: POST
- Content-Type: application/x-www-form-urlencoded

## Queue Worker Setup

### Option 1: Vercel Cron Jobs

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/jobs/worker",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

Secure with cron secret:
```typescript
if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
  return res.status(401).json({ error: 'unauthorized' });
}
```

### Option 2: QStash (Recommended for Reliability)

```bash
npm install @upstash/qstash
```

Enqueue jobs:
```typescript
import { Client } from "@upstash/qstash";

const client = new Client({ token: process.env.QSTASH_TOKEN! });

await client.publishJSON({
  url: "https://yourdomain.com/api/jobs/worker",
  body: { job_id: "..." },
});
```

## Usage Examples

### Create Checkout from Frontend

```typescript
// In your React component
async function handleCheckout() {
  const response = await fetch('/api/storylab/kids/checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      profile_id: user.id,
      item_key: 'sl_kids_pro_monthly',
      ref_code: 'PARTNER123' // optional
    })
  });

  const { checkout_url } = await response.json();
  window.location.href = checkout_url;
}
```

### Get Pricing

```typescript
const response = await fetch('/api/storylab/kids/pricing');
const { pricing } = await response.json();

// pricing is array of PricingItem[]
```

### Enqueue Message Job

```typescript
// In your API route or edge function
import { supabaseAdmin } from '@/lib/supabaseAdmin';

await supabaseAdmin.from('message_jobs').insert({
  channel: 'email',
  to_address: 'user@example.com',
  subject: 'Welcome to StoryLab!',
  body_html: '<h1>Welcome!</h1>',
  body_text: 'Welcome!',
  status: 'pending'
});

// Worker will pick it up on next run
```

## Database Requirements

Make sure you have these tables (already created in migrations):

```sql
-- Core tables
story_projects
story_books
story_pages
story_assets

-- Pricing & orders
marketplace_affiliate_products (20 products seeded)
orders
commissions
partner_statements

-- Compliance
stripe_webhook_events (idempotency)
contact_suppressions (STOP list)

-- Queue
message_jobs

-- Partners
partner_accounts
partner_ad_advances
partner_memberships
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Environment variables:
- Add all `.env.local` vars to Vercel dashboard
- Use Vercel Cron for queue worker

### Other Platforms

Any Node.js host works:
- Netlify Functions
- Railway
- Fly.io
- Digital Ocean App Platform

Just ensure:
- Node.js 18+
- Environment variables configured
- Cron job or QStash for queue worker

## Testing

### 1. Test Pricing Endpoint

```bash
curl http://localhost:3000/api/storylab/kids/pricing
```

Should return array of products.

### 2. Test Checkout

```bash
curl -X POST http://localhost:3000/api/storylab/kids/checkout-session \
  -H "Content-Type: application/json" \
  -d '{
    "profile_id": "uuid-here",
    "item_key": "sl_kids_starter_monthly"
  }'
```

Should return `{ checkout_url: "https://checkout.stripe.com/..." }`.

### 3. Test Webhook Idempotency

Send same event twice to webhook endpoint. Second time should return `{ received: true, idempotent: true }`.

### 4. Test STOP Compliance

Send SMS to your Twilio number with body "STOP". Check `contact_suppressions` table - should have new row.

## Monitoring

### Stripe Dashboard
- Monitor successful checkouts
- Track refunds
- View webhook delivery logs

### Supabase Dashboard
- Check `orders` table for new orders
- Check `commissions` table for partner commissions
- Check `message_jobs` for queued messages
- Monitor `contact_suppressions` for opt-outs

### Logs
- Vercel: Check Function Logs
- Supabase: Check Edge Function logs
- Stripe: Webhook delivery logs

## Troubleshooting

### Webhook Not Firing
1. Check Stripe webhook signing secret
2. Verify endpoint URL is correct
3. Check Stripe Dashboard → Developers → Webhooks → Events

### Commission Not Created
1. Check order has `partner_id`
2. Verify commission rate calculation
3. Check `commissions` table directly

### Messages Not Sending
1. Check `message_jobs` table status
2. Verify API keys (Twilio, Brevo)
3. Check `contact_suppressions` (might be blocked)
4. Review worker logs

### Order Status Stuck on "pending"
1. Check webhook was received
2. Verify idempotency didn't block legitimate event
3. Check Stripe Dashboard for payment status

## Next Steps

1. ✅ Set up Next.js project
2. ✅ Copy lib files
3. ✅ Create API routes
4. ✅ Configure environment variables
5. ✅ Set up Stripe webhook
6. ✅ Set up Twilio webhook (if using SMS)
7. ✅ Deploy to Vercel
8. ✅ Test complete checkout flow
9. ✅ Monitor first real transaction

---

**You're ready to launch!** The complete backend infrastructure is production-ready.
