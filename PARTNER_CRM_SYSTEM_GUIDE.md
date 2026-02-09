# Partner CRM Subscription System - Complete Implementation

## Overview

The Partner CRM subscription system allows partners to subscribe to a CRM tool to track their customers and deals, while your backend automatically syncs all purchases for commission calculation. Partners can monitor their customers' purchases in real-time and see exactly what commissions they've earned.

## What Was Implemented

### 1. Database Schema

**New Tables:**
- `customer_accounts` - Unified customer records across the platform
- `partner_customer_links` - Attribution source of truth linking partners to customers
- `partner_crm_subscriptions` - Partner CRM subscription status tracking
- `commissions` - Commission ledger for all partner earnings
- `commission_rules` - Configurable commission rates by product type

**Updated Tables:**
- `orders` - Added columns for Stripe webhooks, SKU tracking, and partner attribution

**Default Commission Rates:**
- Courses: 30%
- Marketplace: 20%
- All CRMs: 30%
- Laundry SaaS, Budget Buster, CareCompanion: 25%
- PawConnect town licenses: 20%
- Add-ons: 20%
- Partner CRM: 0% (no commission on their own subscription)

### 2. Edge Functions

**create-checkout-session**
- Creates Stripe Checkout sessions with partner attribution
- Attaches SKU and partner_code metadata to sessions
- Persists partner_code on Stripe Customer for durable attribution
- Supports both one-time payments and subscriptions

**stripe-partner-webhook**
- Processes Stripe webhook events
- Handles checkout.session.completed, invoice.paid, charge.refunded, etc.
- Automatically creates customer accounts and links them to partners
- Calculates and records commissions based on configurable rules
- Syncs Partner CRM subscription status for access control

### 3. Frontend Pages

**Partner CRM Dashboard** (`/partner/crm`)
- Displays key metrics: total customers, orders, revenue, pending commissions
- Lists all attributed customers with business details
- Shows recent orders with status and amounts
- Real-time commission tracking
- Access gated by active Partner CRM subscription

**Partner CRM Upgrade** (`/partner/crm/upgrade`)
- Professional pricing page at $49/month
- Highlights all CRM features
- Secure Stripe checkout integration
- Automatic access provisioning upon subscription

### 4. Access Control

Partners can only access the CRM when they have:
1. An active partner account in `affiliate_partners`
2. An active or trialing subscription in `partner_crm_subscriptions`

If they don't meet these requirements, they're redirected to:
- `/partner/apply` if not a partner
- `/partner/crm/upgrade` if partner but no subscription

## How Attribution Works

### Initial Purchase (via Partner Link)

1. Customer clicks partner's referral link: `https://local-linkmarketplace.com?ref=PARTNERCODE`
2. When customer checks out, the checkout session includes:
   - `metadata.sku` - Product identifier
   - `metadata.partner_code` - Partner's referral code
3. Webhook receives `checkout.session.completed`
4. System:
   - Creates/updates customer_account
   - Finds partner by code
   - Creates partner_customer_links record
   - Stores partner_code on Stripe Customer metadata
   - Creates order record with partner attribution
   - Calculates and records commission

### Recurring Purchases (Automatic)

1. Subscription renews monthly → Stripe fires `invoice.paid`
2. Webhook retrieves Stripe Customer metadata.partner_code
3. System automatically:
   - Attributes order to correct partner
   - Creates new order record
   - Calculates commission at current rates
   - No manual tracking needed

### Manual Attribution

Partners can also manually add customers via the CRM by:
1. Creating customer record
2. Linking customer to their partner account
3. Future purchases from that customer are automatically attributed

## SKU to Order Type Mapping

The webhook uses SKUs to determine product types for commission calculation:

```typescript
"partner-crm" → "partner_crm" (0% commission)
"lca-starter" → "course" (30% commission)
"llm-pro" → "marketplace" (20% commission)
"ll-crm-team" → "local_link_crm" (30% commission)
// ... and so on
```

## Stripe Setup Required

### 1. Create Partner CRM Product in Stripe

```
Product Name: Partner CRM
Price: $49/month
Price ID: price_partner_crm_monthly (or your actual price ID)
```

Update the price_id in `PartnerCRMUpgrade.tsx:72` with your actual Stripe price ID.

### 2. Configure Webhook Endpoint

Add this webhook endpoint in Stripe Dashboard:
```
URL: https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/stripe-partner-webhook
Events:
  - checkout.session.completed
  - invoice.paid
  - customer.subscription.updated
  - customer.subscription.deleted
  - charge.refunded
```

Copy the webhook signing secret to your environment variables.

### 3. Environment Variables

Already configured in Supabase:
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
- `SUPABASE_URL` - Auto-configured
- `SUPABASE_SERVICE_ROLE_KEY` - Auto-configured

## Commission Payout Flow

1. **Order Created** → Commission status: `pending`
2. **Admin Review** → Commission status: `approved`
3. **Payout via Stripe Connect** → Commission status: `paid`
4. **Refund Issued** → Commission status: `reversed`

## Routes Added

- `/partner/crm` - Partner CRM Dashboard (protected)
- `/partner/crm/upgrade` - Subscribe to Partner CRM (protected)

## Database Queries for Admin

### View All Pending Commissions
```sql
SELECT
  ap.code as partner_code,
  SUM(c.commission_cents) / 100.0 as total_pending
FROM commissions c
JOIN affiliate_partners ap ON c.partner_id = ap.id
WHERE c.status = 'pending'
GROUP BY ap.code
ORDER BY total_pending DESC;
```

### View Partner's Attributed Customers
```sql
SELECT
  ap.code as partner_code,
  COUNT(DISTINCT pcl.customer_account_id) as customer_count
FROM affiliate_partners ap
JOIN partner_customer_links pcl ON ap.id = pcl.partner_id
GROUP BY ap.code;
```

### View All Orders with Commission
```sql
SELECT
  o.created_at,
  o.order_type,
  o.amount_cents / 100.0 as revenue,
  c.commission_cents / 100.0 as commission,
  ap.code as partner_code
FROM orders o
LEFT JOIN commissions c ON o.id = c.order_id
LEFT JOIN affiliate_partners ap ON o.partner_id = ap.id
ORDER BY o.created_at DESC
LIMIT 20;
```

## Testing the System

### Test Partner CRM Subscription

1. Create a partner account via `/partners/apply`
2. Navigate to `/partner/crm` (should redirect to upgrade page)
3. Click "Subscribe Now" on upgrade page
4. Complete Stripe checkout
5. Return to `/partner/crm` (should show dashboard)

### Test Customer Attribution

1. Create a partner referral link: `?ref=YOURCODE`
2. Have a test customer use that link
3. Customer purchases any product
4. Check webhook logs in Supabase Edge Functions
5. Verify:
   - customer_accounts has new record
   - partner_customer_links has attribution
   - orders has partner_id populated
   - commissions has pending commission

### Test Recurring Attribution

1. Customer with partner attribution subscribes to a product
2. Wait for first invoice (or use Stripe test clock)
3. Verify `invoice.paid` webhook creates new order
4. Confirm commission calculated correctly
5. Check partner's CRM dashboard shows the order

## Security Features

- Row Level Security (RLS) on all tables
- Partners can only view their own data
- Admins have full access
- Webhook signature verification
- JWT authentication for Edge Functions
- Partner CRM access gated by subscription status

## Next Steps

1. **Set up Stripe Product & Price** - Create the Partner CRM subscription product
2. **Configure Webhook** - Add the webhook endpoint to Stripe
3. **Test End-to-End** - Complete a full test purchase flow
4. **Commission Payout System** - Implement Stripe Connect for automated payouts
5. **Email Notifications** - Add order notification emails to partners
6. **Analytics Dashboard** - Add charts and trends to Partner CRM

## Support

For questions or issues with the Partner CRM system:
- Check Supabase Edge Function logs for webhook errors
- Verify Stripe webhook is receiving events
- Ensure partner has active subscription status
- Check RLS policies if data not showing
