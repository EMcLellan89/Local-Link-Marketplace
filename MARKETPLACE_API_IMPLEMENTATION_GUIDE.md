# Marketplace API & Frontend Implementation Guide

Complete guide for implementing the SamCart-style checkout system with API routes, frontend integration, and automation.

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [API Functions Reference](#api-functions-reference)
3. [Frontend Integration](#frontend-integration)
4. [Cart Recovery Automation](#cart-recovery-automation)
5. [Admin Functions](#admin-functions)
6. [Embedded Checkout](#embedded-checkout)
7. [Testing Guide](#testing-guide)

---

## Environment Setup

### Required Environment Variables

Add these to your Supabase project secrets:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_xxxxx         # or sk_test_xxxxx for testing
STRIPE_WEBHOOK_SECRET=whsec_xxxxx       # From Stripe webhook settings

# Application URLs
APP_BASE_URL=https://yourapp.com        # Your production URL
EMBED_SCRIPT_URL=https://yourapp.com/embed.js

# Admin & Job Security
LOCAL_LINK_ADMIN_KEY=your-secure-admin-key-here
LOCAL_LINK_JOB_KEY=your-secure-job-key-here

# Optional: Email/SMS (for cart recovery)
RESEND_API_KEY=re_xxxxx                 # For email via Resend
TWILIO_ACCOUNT_SID=ACxxxxx              # For SMS via Twilio
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_FROM_NUMBER=+1234567890
```

### Stripe Webhook Setup

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-project.supabase.co/functions/v1/marketplace-stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `charge.refunded`
   - `refund.created`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

---

## API Functions Reference

### 1. Create Checkout Session

**Endpoint:** `/functions/v1/create-marketplace-checkout-session`

**Method:** POST

**Purpose:** Creates a Stripe checkout session with partner attribution and order bumps

**Request Body:**
```typescript
{
  product_slug: string;          // Product identifier
  pricing: "one_time" | "monthly" | "annual";
  bump_selected?: boolean;       // Include order bump
  referral_code?: string;        // Partner referral code
  embedded?: boolean;            // Is this embedded checkout?
  source_domain?: string;        // Origin domain (for embedded)
  customer_email?: string;       // Pre-fill email
}
```

**Response:**
```typescript
{
  checkout_session_id: string;     // Local DB session ID
  stripe_checkout_url: string;     // Redirect user here
}
```

**Frontend Example:**
```typescript
async function createCheckout(productSlug: string, pricing: string) {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-marketplace-checkout-session`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_slug: productSlug,
        pricing,
        referral_code: localStorage.getItem('ll_referral_code'),
        customer_email: email,
      }),
    }
  );

  const data = await response.json();

  // Save session ID for abandonment tracking
  localStorage.setItem('ll_last_checkout_session_id', data.checkout_session_id);

  // Redirect to Stripe
  window.location.href = data.stripe_checkout_url;
}
```

---

### 2. Abandon Checkout

**Endpoint:** `/functions/v1/abandon-checkout`

**Method:** POST

**Purpose:** Marks checkout as abandoned for recovery automation

**Request Body:**
```typescript
{
  checkout_session_id?: string;         // Local session ID
  stripe_checkout_session_id?: string;  // Stripe session ID
  customer_email?: string;              // Update email if captured
}
```

**Response:**
```typescript
{
  ok: boolean;
  ignored?: boolean;    // True if already paid
  reason?: string;
}
```

**Frontend Example (Page Exit Handler):**
```typescript
// Add to checkout page
useEffect(() => {
  const handleBeforeUnload = () => {
    const sessionId = localStorage.getItem('ll_last_checkout_session_id');
    if (sessionId && email) {
      // Use sendBeacon for reliability on page unload
      const blob = new Blob(
        [JSON.stringify({ checkout_session_id: sessionId, customer_email: email })],
        { type: 'application/json' }
      );
      navigator.sendBeacon(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/abandon-checkout`,
        blob
      );
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [email]);
```

---

### 3. Charge Upsell

**Endpoint:** `/functions/v1/charge-upsell`

**Method:** POST

**Purpose:** 1-click upsell after successful order (uses stored payment method)

**Request Body:**
```typescript
{
  order_id: string;    // Original order ID
}
```

**Response:**
```typescript
{
  ok: boolean;
  payment_intent_id: string;    // Stripe payment intent
}
```

**Frontend Example (Upsell Page):**
```typescript
async function acceptUpsell(orderId: string) {
  try {
    setLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/charge-upsell`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      }
    );

    const data = await response.json();

    if (data.ok) {
      // Success - show confirmation
      navigate(`/marketplace/checkout/success?upsell=1&order_id=${orderId}`);
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    alert('Payment failed. Please update your billing information.');
    navigate('/hub/billing');
  } finally {
    setLoading(false);
  }
}
```

---

## Admin Functions

All admin endpoints require the `X-Admin-Key` header.

### 1. List Orders

**Endpoint:** `/functions/v1/admin-list-orders`

**Method:** GET

**Headers:**
```typescript
{
  "X-Admin-Key": "your-admin-key"
}
```

**Query Parameters:**
- `status` - Filter by payment status (paid, refunded, etc.)
- `product_id` - Filter by product
- `partner_id` - Filter by partner
- `from` - Date range start (ISO 8601)
- `to` - Date range end (ISO 8601)
- `limit` - Results per page (max 200, default 50)
- `offset` - Pagination offset

**Response:**
```typescript
{
  ok: boolean;
  count: number;        // Total matching records
  data: Array<{
    id: string;
    created_at: string;
    status: string;
    total_cents: number;
    customer_email: string;
    product: { id, name, slug };
    partner: { id, display_name, referral_code } | null;
  }>;
}
```

---

### 2. List Partners

**Endpoint:** `/functions/v1/admin-list-partners`

**Method:** GET

**Headers:** `X-Admin-Key`

**Query Parameters:**
- `tier` - Filter by tier (starter, pro, enterprise)
- `active` - Filter by membership_active (true/false)
- `limit` - Results per page
- `offset` - Pagination offset

**Response:**
```typescript
{
  ok: boolean;
  count: number;
  data: Array<{
    id: string;
    display_name: string;
    referral_code: string;
    referral_id: string;
    tier: string;
    membership_active: boolean;
    membership_ends_at: string | null;
  }>;
}
```

---

### 3. List Commissions

**Endpoint:** `/functions/v1/admin-list-commissions`

**Method:** GET

**Headers:** `X-Admin-Key`

**Query Parameters:**
- `status` - Filter by status (pending, earned, void, paid)
- `partner_id` - Filter by partner
- `from` / `to` - Date range
- `limit` / `offset` - Pagination

**Response:**
```typescript
{
  ok: boolean;
  count: number;
  data: Array<{
    id: string;
    created_at: string;
    order_id: string;
    partner_id: string;
    commission_rate: number;      // 0.10, 0.15, 0.20
    commission_amount_cents: number;
    status: string;
    earned_at: string | null;
    paid_at: string | null;
    order: { id, total_cents, customer_email };
    partner: { id, display_name, referral_code, tier };
  }>;
}
```

---

## Frontend Integration

### Marketplace Product Page

**Route:** `/marketplace/products/:slug`

**Key Features:**
- Load product and prices from Supabase
- Pricing selector (one-time/monthly/annual)
- Email capture
- Partner referral tracking via `?ref=CODE`
- Order bump preview (optional)

**Implementation:**
```typescript
// Read referral from URL or localStorage
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');

  if (ref) {
    localStorage.setItem('ll_referral_code', ref);
  }
}, []);

// Create checkout session on button click
async function handleCheckout() {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-marketplace-checkout-session`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_slug: slug,
        pricing: selectedPricing,
        referral_code: localStorage.getItem('ll_referral_code'),
        customer_email: email,
        bump_selected: false,
      }),
    }
  );

  const data = await response.json();

  if (data.stripe_checkout_url) {
    localStorage.setItem('ll_last_checkout_session_id', data.checkout_session_id);
    window.location.href = data.stripe_checkout_url;
  }
}
```

---

### Checkout Success Page

**Route:** `/marketplace/checkout/success`

**Query Params:** `session_id={CHECKOUT_SESSION_ID}` (from Stripe)

**Key Features:**
- Load order details
- Check for upsell eligibility
- Show referral link
- Access links

**Implementation:**
```typescript
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');

  if (sessionId) {
    loadOrderByStripeSession(sessionId);
  }
}, []);

async function loadOrderByStripeSession(stripeSessionId: string) {
  // Query marketplace_checkout_sessions
  const { data: session } = await supabase
    .from('marketplace_checkout_sessions')
    .select('*, product:marketplace_products(*)')
    .eq('stripe_checkout_session_id', stripeSessionId)
    .maybeSingle();

  // Check if upsell enabled
  const { data: config } = await supabase
    .from('marketplace_checkout_configs')
    .select('enable_upsell, upsell_product_id')
    .eq('product_id', session.product_id)
    .maybeSingle();

  if (config?.enable_upsell) {
    // Redirect to upsell page
    navigate(`/marketplace/products/${session.product.slug}/upsell?order_id=${orderId}`);
  }
}
```

---

## Cart Recovery Automation

### Setup Cron Job

**Option A: Vercel Cron**

Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/cart-recovery",
    "schedule": "*/5 * * * *"
  }]
}
```

Create `/api/cron/cart-recovery.ts`:
```typescript
export default async function handler(req: any, res: any) {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/functions/v1/cart-recovery-job`,
    {
      method: 'POST',
      headers: {
        'X-Job-Key': process.env.LOCAL_LINK_JOB_KEY!,
      },
    }
  );

  const data = await response.json();
  res.json(data);
}
```

**Option B: External Cron (EasyCron, cron-job.org)**

Set up a job that hits:
```
POST https://your-project.supabase.co/functions/v1/cart-recovery-job
Header: X-Job-Key: your-job-key
Frequency: Every 5 minutes
```

---

### Email/SMS Integration

Edit `/supabase/functions/cart-recovery-job/index.ts` to add your providers:

**Resend Example:**
```typescript
async function sendEmail(to: string, subject: string, html: string) {
  const resendKey = Deno.env.get("RESEND_API_KEY");

  if (resendKey) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "noreply@yourapp.com",
        to: [to],
        subject,
        html,
      }),
    });
  }
}
```

**Twilio SMS Example:**
```typescript
async function sendSms(to: string, body: string) {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const fromNumber = Deno.env.get("TWILIO_FROM_NUMBER");

  if (accountSid && authToken && fromNumber) {
    const auth = btoa(`${accountSid}:${authToken}`);

    await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: to,
          Body: body,
        }),
      }
    );
  }
}
```

---

## Embedded Checkout

### Usage

Add this to any website:

```html
<!-- Include embed script -->
<script src="https://yourapp.com/embed.js"></script>

<!-- Add checkout button -->
<button
  data-locallink-checkout
  data-product="your-product-slug"
  data-referral="PARTNER123"
  data-base-url="https://yourapp.com">
  Buy Now
</button>
```

### How It Works

1. Script listens for clicks on `[data-locallink-checkout]` buttons
2. Stores referral code in localStorage
3. Opens modal with iframe pointing to your checkout page
4. Adds `?embedded=true&ref=CODE&source_domain=example.com`
5. Attribution tracked automatically

---

## Testing Guide

### 1. Test Product Purchase Flow

```bash
# 1. Create test product in database
insert into marketplace_products (slug, name, description, is_active)
values ('test-product', 'Test Product', 'Test description', true);

# 2. Add pricing
insert into marketplace_product_prices (product_id, pricing, amount_cents, stripe_price_id, is_active)
values (
  (select id from marketplace_products where slug = 'test-product'),
  'one_time',
  1000,
  'price_xxxxx',  -- Create in Stripe first
  true
);

# 3. Configure checkout
insert into marketplace_checkout_configs (product_id)
values ((select id from marketplace_products where slug = 'test-product'));
```

### 2. Test With Partner Attribution

```bash
# Create test partner
insert into marketplace_partners (display_name, referral_code, referral_id, tier, membership_active)
values ('Test Partner', 'TEST123', 'P-1001', 'pro', true);
```

Visit: `http://localhost:3000/marketplace/products/test-product?ref=TEST123`

### 3. Test Stripe Webhook Locally

Use Stripe CLI:
```bash
stripe listen --forward-to http://localhost:54321/functions/v1/marketplace-stripe-webhook
stripe trigger checkout.session.completed
```

### 4. Test Cart Recovery

```bash
# Manually trigger cart recovery job
curl -X POST \
  http://localhost:54321/functions/v1/cart-recovery-job \
  -H "X-Job-Key: your-job-key"
```

---

## Troubleshooting

### Checkout session not creating

- Check Stripe price IDs are valid
- Verify product is active (`is_active = true`)
- Check browser console for errors

### Commissions not calculating

- Verify partner `membership_active = true`
- Check partner tier is set correctly
- Confirm webhook received checkout.session.completed

### Cart recovery not sending emails

- Check `customer_email` is captured
- Verify email provider credentials
- Check function logs in Supabase

### Admin endpoints returning 403

- Verify `X-Admin-Key` header is set
- Check `LOCAL_LINK_ADMIN_KEY` environment variable

---

## Production Checklist

- [ ] Set all environment variables in Supabase
- [ ] Configure Stripe webhook in production mode
- [ ] Test complete purchase flow
- [ ] Test refund flow
- [ ] Set up cart recovery cron job
- [ ] Configure email/SMS providers
- [ ] Test admin endpoints with production keys
- [ ] Verify partner commission calculations
- [ ] Test embedded checkout on external site
- [ ] Monitor webhook delivery in Stripe dashboard

---

## Support & Resources

- **Stripe Documentation:** https://stripe.com/docs/api
- **Supabase Edge Functions:** https://supabase.com/docs/guides/functions
- **Commission Calculation Logic:** See `/src/lib/marketplace/commission.ts`
- **Database Schema:** See `/supabase/migrations/add_marketplace_checkout_system_complete.sql`

For issues, check:
1. Supabase function logs
2. Stripe webhook delivery logs
3. Browser console errors
4. Database RLS policies (if queries fail)
