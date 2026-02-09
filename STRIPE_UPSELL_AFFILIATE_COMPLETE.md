# Stripe One-Click Upsells & Affiliate System - Complete Implementation

## 🎯 Overview

This system provides a complete monetization layer with one-click upsells after course purchases and a full affiliate program for partners to earn commissions.

---

## 📁 Page Structure & Routes

### Partner Affiliate Routes

```typescript
// Route: /partner/affiliates
Component: src/pages/partner/AffiliateDashboard.tsx
Auth: Required (Partner role)
Purpose: Main affiliate dashboard with stats, referral links, and commission history

// Route: /partner/contracts
Component: src/pages/partner/ContractsPage.tsx
Auth: Required (Partner role)
Purpose: View and digitally sign partnership contracts
```

### Component Features

**AffiliateDashboard.tsx**
- Real-time conversion & earnings tracking
- Click-to-copy referral link
- Commission history table with status
- Conversion rate calculation
- Tier display (standard/premium/vip)
- Pending vs paid earnings breakdown

**ContractsPage.tsx**
- List all partnership agreements
- Digital signature workflow
- Download signed contracts
- IP address tracking for compliance
- Multiple contract types support

---

## 🗄️ Database Schema

### Core Tables

**stripe_customers**
- Maps auth users to Stripe customer IDs
- Enables one-click upsells after first purchase
- Auto-populated on checkout

**upsell_offers**
- Defines available upsell products
- Pre-seeded with 6 script pack products
- Trigger-based (shows after specific products)

**upsell_purchases**
- Tracks all upsell transactions
- Status: pending/succeeded/failed
- Links to payment intents

**affiliate_commissions**
- Detailed per-sale commission tracking
- Status: pending/approved/paid/cancelled
- Links to partner and order

**affiliate_payouts**
- Payout request records
- Status: pending/processing/completed/failed
- Transaction ID tracking

**affiliate_clicks**
- Referral traffic tracking
- IP and user agent logging
- Conversion tracking

**partner_contracts**
- Signed agreement storage
- Types: territory/white_label/reseller/affiliate
- Digital signature with IP and timestamp

---

## 🔌 Edge Functions

### one-click-upsell

**Endpoint**: `POST /functions/v1/one-click-upsell`

**Purpose**: Creates Stripe payment intent for instant upsells

**Request**:
```json
{
  "upsell_offer_id": "uuid"
}
```

**Response**:
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

**Flow**:
1. Validates authenticated user
2. Gets or creates Stripe customer
3. Creates payment intent with saved payment method
4. Records pending purchase
5. Returns client secret for confirmation

---

### course-stripe-webhook (Updated)

**Endpoint**: `POST /functions/v1/course-stripe-webhook`

**Purpose**: Handles Stripe webhook events

**Events Handled**:
- `checkout.session.completed` - Regular purchases + affiliate tracking
- `payment_intent.succeeded` - One-click upsell confirmations

**checkout.session.completed Flow**:
1. Store Stripe customer ID for future upsells
2. Create order record
3. Create course enrollment if applicable
4. Process affiliate commission (course affiliates first, then partners)
5. Update affiliate stats

**payment_intent.succeeded Flow**:
1. Update upsell purchase status
2. Create order record
3. Grant product entitlement
4. Log completion

---

## 💳 Stripe Integration Details

### Customer Storage
- First purchase creates Stripe customer
- Customer ID stored in `stripe_customers` table
- Linked to auth.users via user_id
- Enables card-on-file for upsells

### Payment Intent Metadata
```json
{
  "user_id": "uuid",
  "product_slug": "ai-receptionist-script-pack-trades",
  "product_type": "upsell",
  "upsell_offer_id": "uuid"
}
```

### Webhook Security
- Signature verification required
- Uses `STRIPE_WEBHOOK_SECRET_COURSE` env var
- 400 error on invalid signature

---

## 🎁 Pre-Seeded Upsell Products

```sql
1. ai-receptionist-script-pack-trades ($39)
   - HVAC, plumbing, electrical, tree services

2. ai-receptionist-script-pack-restaurants ($39)
   - Restaurant and food service scripts

3. ai-receptionist-script-pack-pet ($39)
   - Groomers, vets, trainers

4. ai-receptionist-script-pack-care ($39)
   - Home care and health services

5. ai-receptionist-script-pack-retail ($39)
   - Retail and general services

6. ai-receptionist-script-pack-mega ($149)
   - ALL industries + lifetime updates
```

---

## 🤝 Affiliate Program Flow

### Partner Signup
1. Partner applies via `/partners/apply`
2. Admin approves and enables `affiliate_enabled = true`
3. System generates unique `referral_code`
4. Partner sets `commission_rate` (default 20%)

### Referral Tracking
1. Customer clicks: `yoursite.com?ref=PARTNERCODE`
2. Frontend stores ref code in session/localStorage
3. Checkout includes `affiliate_code` in metadata
4. Webhook processes commission on payment success

### Commission Calculation
```typescript
commission_cents = order_total_cents * commission_rate
```

### Commission States
- **pending**: Sale completed, awaiting approval
- **approved**: Approved, ready for payout
- **paid**: Payment sent to affiliate
- **cancelled**: Refund or cancellation

---

## 📊 Partner Dashboard Stats

**Real-Time Metrics**:
- Total Clicks
- Total Conversions
- Conversion Rate (%)
- Pending Earnings ($)
- Total Earned ($)

**Commission History**:
- Date
- Product Name
- Order Total
- Commission Amount
- Status (pending/approved/paid)

---

## 📜 Contract System

### Contract Types
1. **territory** - Geographic exclusivity agreements
2. **white_label** - Reseller agreements
3. **reseller** - Product resale rights
4. **affiliate** - Standard affiliate terms

### Signing Flow
1. Admin creates contract record with `contract_type`
2. Partner views unsigned contracts
3. Partner clicks "Sign Agreement"
4. Modal displays terms
5. Partner enters full legal name + checkbox acceptance
6. System records:
   - `signed_at` timestamp
   - `signed_by_name`
   - `ip_address`
   - `terms_version`

### Legal Compliance
- IP address logged for each signature
- Terms version tracked
- Full audit trail
- Download signed PDFs
- No modification after signing

---

## 🔐 Security & RLS Policies

### stripe_customers
```sql
-- Users can view own customer data
USING (auth.uid() = user_id)
```

### affiliate_commissions
```sql
-- Partners can view own commissions
USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()))
```

### affiliate_payouts
```sql
-- Partners can view own payouts
USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()))

-- Partners can request payouts
WITH CHECK (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()))
```

### partner_contracts
```sql
-- Partners can view own contracts
USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()))
```

---

## 🚀 Frontend Implementation

### Upsell Display (After Purchase)

```tsx
// On course purchase success page
const { data: offers } = await supabase
  .from('upsell_offers')
  .select('*')
  .eq('trigger_after_product', 'ai-receptionist-missed-call')
  .eq('is_active', true)
  .order('display_order');

// Display offers as cards with "Add to Order" button
// On click, call one-click-upsell function
const response = await fetch(`${SUPABASE_URL}/functions/v1/one-click-upsell`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ upsell_offer_id: offer.id }),
});

const { clientSecret } = await response.json();

// Confirm with Stripe.js
const { error } = await stripe.confirmCardPayment(clientSecret);
```

### Referral Link Handling

```tsx
// On landing page load
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  if (ref) {
    localStorage.setItem('affiliate_code', ref);
    // Track click
    trackAffiliateClick(ref);
  }
}, []);

// On checkout
const affiliateCode = localStorage.getItem('affiliate_code') || '';
// Include in Stripe checkout metadata
```

---

## 📈 Analytics & Reporting

### Partner Analytics Available
- Click-through rate
- Conversion rate
- Average order value
- Top performing products
- Earnings over time
- Payout history

### Admin Analytics
- Top affiliates by revenue
- Commission payout totals
- Pending approvals count
- Fraud detection metrics

---

## 🛠️ Admin Functions Needed

### Batch Approval
```sql
-- Approve multiple commissions at once
UPDATE affiliate_commissions
SET status = 'approved'
WHERE id = ANY($1::uuid[]) AND status = 'pending';
```

### Batch Payout
```sql
-- Mark multiple as paid and record transaction
UPDATE affiliate_commissions
SET status = 'paid', paid_at = now()
WHERE id = ANY($1::uuid[]) AND status = 'approved';

-- Create payout records
INSERT INTO affiliate_payouts (partner_id, amount_cents, status, transaction_id)
SELECT partner_id, SUM(commission_cents), 'completed', $2
FROM affiliate_commissions
WHERE id = ANY($1::uuid[])
GROUP BY partner_id;
```

---

## 🧪 Testing Checklist

### Upsell Flow
- [ ] Complete course purchase with test card
- [ ] Verify Stripe customer ID saved
- [ ] View upsell offer on success page
- [ ] Click "Add to Order" button
- [ ] Confirm upsell completes successfully
- [ ] Verify order created in database
- [ ] Check entitlement granted

### Affiliate Flow
- [ ] Create test partner with affiliate enabled
- [ ] Get referral link from dashboard
- [ ] Open link in incognito
- [ ] Complete purchase
- [ ] Verify commission created
- [ ] Check dashboard shows pending earnings
- [ ] Admin approves commission
- [ ] Verify status updates

### Contract Flow
- [ ] Create contract for partner
- [ ] Partner views unsigned contract
- [ ] Partner signs with legal name
- [ ] Verify signed_at timestamp
- [ ] Download signed contract
- [ ] Verify cannot re-sign

---

## 🔄 Webhook Event Handling

### Required Stripe Webhooks
1. `checkout.session.completed`
2. `payment_intent.succeeded`

### Webhook URL
```
https://your-project.supabase.co/functions/v1/course-stripe-webhook
```

### Webhook Secret
Set in Supabase dashboard as `STRIPE_WEBHOOK_SECRET_COURSE`

---

## 📦 Environment Variables

All automatically configured by Supabase:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET_COURSE`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 🎓 Next Steps

1. **Track Affiliate Clicks** - Create click tracking endpoint
2. **Payout Portal** - Admin UI for batch payouts
3. **Email Notifications** - Notify on commissions & payouts
4. **Fraud Detection** - Flag suspicious referral patterns
5. **Tiered Commissions** - VIP partners earn higher rates
6. **Recurring Commissions** - Earn on subscription renewals
7. **Product Performance** - Which upsells convert best

---

## 📞 Support

For implementation questions or issues:
- Check webhook logs in Stripe dashboard
- Review Supabase edge function logs
- Verify RLS policies allow data access
- Test with Stripe test mode first
