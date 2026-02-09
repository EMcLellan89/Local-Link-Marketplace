# Local-Link Marketplace Affiliate Commission System - Complete Setup Guide

## Overview

This system enables partners/affiliates to earn **one-time commissions (10-20%)** on every product sale without cutting into your margins. Commissions are paid Net-30 with no recurring payouts.

---

## 🎯 What's Built

### 1. Database Schema
- `marketplace_affiliates` - Partner profiles with unique codes
- `marketplace_affiliate_products` - Product catalog with commission rates & Stripe Price IDs
- `marketplace_affiliate_referrals` - Click tracking & attribution
- `marketplace_affiliate_commissions` - Commission records (pending/approved/paid)
- `marketplace_affiliate_payouts` - Batch payout management
- `marketplace_affiliate_subscription_locks` - Prevents duplicate subscription commissions

### 2. Edge Functions (Supabase)
- `track-marketplace-affiliate-click` - Tracks clicks (public, no auth)
- `attach-marketplace-affiliate-to-signup` - Links referral to new user
- `create-marketplace-affiliate-commission` - Creates commission (internal only)
- `get-marketplace-affiliate-dashboard` - Returns metrics
- `get-marketplace-affiliate-links` - Generates referral links
- `admin-approve-marketplace-commission` - Approve/reject commissions
- `admin-create-marketplace-payout-batch` - Create Net-30 payout batches
- `create-affiliate-checkout-session` - Stripe checkout with attribution
- `stripe-affiliate-webhook` - Handles Stripe events

### 3. Frontend Pages
- `/join` - Partner referral landing page (tracks clicks)
- `/affiliate/dashboard` - Partner overview & metrics
- `/affiliate/products` - Browse products & get links
- `/affiliate/earnings` - Commission history
- `/admin/affiliate-commissions` - Admin approval queue

### 4. Components
- `AttachReferralOnLogin` - Auto-attaches referral after signup/login

---

## 🔧 Configuration Required

### 1. Supabase Environment Variables

Add these to Supabase → Settings → Edge Functions → Secrets:

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_AFFILIATE_WEBHOOK_SECRET=whsec_...
INTERNAL_API_KEY=<generate-random-256bit-string>
APP_BASE_URL=https://locallinkmarketplace.com
```

### 2. Stripe Configuration

#### A) Create Webhook Endpoint

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-affiliate-webhook`
3. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
4. Copy webhook secret → save as `STRIPE_AFFILIATE_WEBHOOK_SECRET`

#### B) Add Stripe Price IDs to Products

For each product in `marketplace_affiliate_products`, you need to add the Stripe Price ID:

```sql
-- Example: Update products with Stripe Price IDs
UPDATE marketplace_affiliate_products
SET stripe_price_id = 'price_1ABC...'
WHERE sku = 'tradehive_solo';

UPDATE marketplace_affiliate_products
SET stripe_price_id = 'price_1DEF...'
WHERE sku = 'marketplace_pro';

-- Repeat for all products
```

**How to find Stripe Price IDs:**
1. Go to Stripe → Products
2. Click on a product
3. Copy the Price ID (starts with `price_`)

---

## 🚀 How It Works (End-to-End)

### Step 1: Partner Signs Up
- User goes to `/affiliate/dashboard`
- Clicks "Become a Partner" → gets unique code (e.g., `ABC123XYZ`)
- Status: `pending` (admin can approve or auto-activate)

### Step 2: Partner Shares Link
Partner gets referral links like:
```
https://yoursite.com/join?ref=ABC123XYZ&product=tradehive_solo
```

### Step 3: Customer Clicks Link
1. `/join` page loads
2. Calls `track-marketplace-affiliate-click` (creates referral record)
3. Stores in localStorage:
   - `ll_referral_id`
   - `ll_partner_code`
   - `ll_product_sku`
4. Redirects to pricing/signup page

### Step 4: Customer Signs Up
- After signup/login, `AttachReferralOnLogin` component runs
- Calls `attach-marketplace-affiliate-to-signup`
- Links referral to user account
- Clears localStorage

### Step 5: Customer Purchases
- Frontend calls `create-affiliate-checkout-session` with:
  ```javascript
  {
    product_sku: "tradehive_solo",
    partner_code: localStorage.getItem("ll_partner_code"),
    referral_id: localStorage.getItem("ll_referral_id")
  }
  ```
- Creates Stripe Checkout Session with metadata
- For subscriptions, metadata is copied to subscription object

### Step 6: Stripe Webhook Fires

**For one-time payments:**
- Event: `checkout.session.completed`
- Creates commission immediately

**For subscriptions:**
- Event: `invoice.payment_succeeded` (first paid invoice)
- Inserts lock in `marketplace_affiliate_subscription_locks`
- Creates commission
- Future invoices: skipped (lock exists)

### Step 7: Admin Approves
1. Admin goes to `/admin/affiliate-commissions`
2. Reviews pending commissions
3. Approves or rejects with notes
4. Status: `pending` → `approved`

### Step 8: Net-30 Payout
1. After 30 days, admin clicks "Create Payout Batch"
2. System filters:
   - Status = `approved`
   - `eligible_at` + 30 days < now
   - Total ≥ $50 minimum
3. Creates payout records
4. Admin processes payouts manually (transfer, PayPal, etc.)
5. Marks payout as `paid`
6. Commissions updated: `approved` → `paid`

---

## 💰 Commission Structure (Seeded)

| Product Type | Commission | Examples |
|-------------|-----------|----------|
| **CRMs** | 10% | TradeHive, AdSuite, PetConnect |
| **Marketplace** | 10% | Basic, Pro, Premium tiers |
| **Courses** | 20% | All 13 courses |
| **Services** | 15% | Setup fees, design, swipe files |
| **Bundles** | 10-15% | Starter packs, complete platform |

---

## 🧪 Testing Guide

### Test Flow (Local)

1. **Create a test affiliate:**
   ```sql
   INSERT INTO marketplace_affiliates (user_id, affiliate_code, status)
   VALUES ('YOUR_USER_ID', 'TEST123', 'active');
   ```

2. **Visit referral link:**
   ```
   http://localhost:5173/join?ref=TEST123&product=course_lca
   ```

3. **Check localStorage:**
   - Open DevTools → Application → Local Storage
   - Should see: `ll_referral_id`, `ll_partner_code`, `ll_product_sku`

4. **Sign up / log in:**
   - Component should auto-attach referral
   - Check `marketplace_affiliate_referrals` table for `referred_user_id`

5. **Test checkout:**
   ```javascript
   // In any component
   const startCheckout = async () => {
     const res = await fetch(`${SUPABASE_URL}/functions/v1/create-affiliate-checkout-session`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         product_sku: 'course_lca',
         partner_code: localStorage.getItem('ll_partner_code'),
       }),
     });
     const data = await res.json();
     window.location.href = data.url;
   };
   ```

6. **Use Stripe test mode:**
   - Card: `4242 4242 4242 4242`
   - Complete checkout
   - Webhook fires → commission created

7. **Check commission:**
   ```sql
   SELECT * FROM marketplace_affiliate_commissions
   WHERE marketplace_affiliate_id = (
     SELECT id FROM marketplace_affiliates WHERE affiliate_code = 'TEST123'
   );
   ```

---

## 📊 Admin Workflows

### Daily: Review Pending Commissions
1. Go to `/admin/affiliate-commissions`
2. Filter: `pending`
3. Review each commission:
   - Valid referral?
   - Correct amount?
   - No fraud?
4. Approve or reject

### Weekly: Create Payout Batch
1. Go to `/admin/affiliate-commissions`
2. Click "Create Payout Batch"
3. System creates batch for eligible commissions
4. Export CSV or process payouts
5. Mark batch as `paid`

### Monthly: Analyze Performance
```sql
-- Top affiliates
SELECT
  a.affiliate_code,
  a.display_name,
  COUNT(*) as total_sales,
  SUM(c.commission_amount_cents) / 100.0 as total_earned
FROM marketplace_affiliate_commissions c
JOIN marketplace_affiliates a ON a.id = c.marketplace_affiliate_id
WHERE c.status = 'paid'
GROUP BY a.id
ORDER BY total_earned DESC
LIMIT 10;

-- Top products
SELECT
  product_sku,
  COUNT(*) as sales,
  SUM(commission_amount_cents) / 100.0 as total_commissions
FROM marketplace_affiliate_commissions
WHERE status = 'paid'
GROUP BY product_sku
ORDER BY sales DESC;
```

---

## 🔒 Security Considerations

### 1. INTERNAL_API_KEY
- Used for server-to-server commission creation
- **Never expose in frontend code**
- Generate: `openssl rand -base64 32`

### 2. Webhook Signature Verification
- Stripe webhook validates signature
- Prevents fake webhook attacks

### 3. RLS Policies
- Affiliates can only see their own data
- Admin has full access
- Service role bypasses RLS for Edge Functions

### 4. Subscription Locks
- Prevents paying commission twice
- Atomic insert (unique constraint)
- If webhook retries, lock prevents duplicate

### 5. Rate Limits
- Consider adding rate limits on `track-marketplace-affiliate-click`
- Prevents click fraud

---

## 🐛 Troubleshooting

### Commission Not Created After Purchase

**Check:**
1. Stripe webhook configured correctly?
   ```bash
   stripe listen --forward-to localhost:54321/functions/v1/stripe-affiliate-webhook
   ```
2. Metadata present on checkout session/subscription?
   - Go to Stripe → Payment → expand metadata
   - Should see: `partner_code`, `product_sku`
3. Check Edge Function logs:
   ```bash
   supabase functions logs stripe-affiliate-webhook
   ```
4. `INTERNAL_API_KEY` set correctly?
5. Product has `stripe_price_id`?

### Referral Not Attached After Signup

**Check:**
1. `ll_partner_code` in localStorage?
2. `AttachReferralOnLogin` component rendered?
3. Check browser console for errors
4. Verify Edge Function working:
   ```bash
   supabase functions logs attach-marketplace-affiliate-to-signup
   ```

### Payout Batch Empty

**Check:**
1. Commissions approved? (`status = 'approved'`)
2. Eligible date > 30 days ago?
3. Total per affiliate ≥ $50?
4. Run manual query:
   ```sql
   SELECT
     marketplace_affiliate_id,
     SUM(commission_amount_cents) / 100.0 as total
   FROM marketplace_affiliate_commissions
   WHERE status = 'approved'
     AND eligible_at < now() - interval '30 days'
   GROUP BY marketplace_affiliate_id
   HAVING SUM(commission_amount_cents) >= 5000;
   ```

---

## 🎨 Customization

### Change Commission Rates

```sql
UPDATE marketplace_affiliate_products
SET commission_rate_bp = 1500  -- 15%
WHERE type = 'service';
```

### Add New Product

```sql
INSERT INTO marketplace_affiliate_products (
  sku, name, type, price_cents, currency, commission_rate_bp, stripe_price_id, active
) VALUES (
  'new_product_sku',
  'New Product Name',
  'course',
  19900,
  'usd',
  2000,  -- 20%
  'price_STRIPE_ID',
  true
);
```

### Custom Payout Threshold

Change `$50` minimum in `admin-create-marketplace-payout-batch`:

```typescript
const min_payout_cents = Number(body.min_payout_cents || 2500); // $25
```

---

## 📈 Next Steps

1. **Populate Stripe Price IDs** for all products
2. **Configure Stripe webhook** endpoint
3. **Test full flow** in Stripe test mode
4. **Enable affiliates** (set status to `active`)
5. **Share referral links** with partners
6. **Monitor commissions** daily
7. **Process payouts** weekly/monthly

---

## 🆘 Support

For issues or questions:
- Check Edge Function logs: `supabase functions logs <function-name>`
- Review database with SQL Editor
- Test webhook locally: `stripe listen --forward-to ...`

