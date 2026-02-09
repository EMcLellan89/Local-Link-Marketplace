# Partner Training, Gamification & Email Automation System - Complete Guide

## 🎉 Overview

This complete "ALL" package includes everything needed for a world-class partner program:

1. ✅ **Partner Training Portal** - Onboarding, product cheat sheets, pitch scripts
2. ✅ **Leaderboards & Gamification** - Points, badges, rankings
3. ✅ **SendGrid Email Automation** - 6 milestone emails, daily nudges
4. ✅ **Admin Products & Rates Manager** - SKU ↔ Stripe Price management
5. ✅ **Referral Tracking & Attribution** - /join landing page + auto-attach

---

## 🗂️ What Was Built

### **Database Schema**

#### New Tables
- `marketplace_affiliate_badges` - Achievement tracking
- `marketplace_affiliate_training_progress` - Module completion
- `marketplace_affiliate_product_assets` - Training materials
- `marketplace_affiliate_subscription_locks` - Prevents duplicate commissions (from previous)

#### New Columns on `marketplace_affiliates`
- `approved_at` - Timestamp when partner was approved
- `last_nudged_at` - Last email nudge sent
- `points` - Gamification points
- `current_badge` - Current achievement level

#### Functions
- `award_affiliate_points(affiliate_id, points, reason)` - Awards points and updates badges
- `set_affiliate_approved_at()` - Trigger that sets approved_at timestamp

---

### **Edge Functions (Supabase)**

#### 1. `send-email` (Internal Only)
- **Security:** Requires `X-Internal-Api-Key` header
- **Purpose:** Secure SendGrid email sender
- **Env Vars:** `SENDGRID_API_KEY`, `EMAIL_FROM`, `INTERNAL_API_KEY`

**Example Call:**
```typescript
await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Internal-Api-Key': INTERNAL_API_KEY,
  },
  body: JSON.stringify({
    to: 'partner@example.com',
    subject: 'Welcome!',
    html: '<p>Welcome to the program!</p>',
  }),
});
```

#### 2. `daily-partner-nudges` (Internal Only)
- **Security:** Requires `X-Internal-Api-Key` header
- **Purpose:** Automatically sends milestone emails based on partner activity
- **Cooldown:** 48 hours (configurable via `NUDGE_COOLDOWN_HOURS`)
- **Env Vars:** All from `send-email` + `APP_BASE_URL`, `NUDGE_COOLDOWN_HOURS`

**Email Triggers:**
- **Partner Approved** - Immediately after approval
- **No Link Copied (48h)** - Partner hasn't shared a link yet
- **First Signup** - Got their first referral
- **First Sale** - Got their first paid commission
- **Payout Ready** - Has approved commissions
- **Inactive 14 Days** - No activity in 2 weeks

**Run Manually (Admin):**
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/daily-partner-nudges \
  -H "X-Internal-Api-Key: YOUR_KEY"
```

#### 3. `get-marketplace-affiliate-leaderboard`
- **Security:** Public (no sensitive data exposed)
- **Purpose:** Returns ranked leaderboard with points, sales, earnings
- **Returns:** JSON array of top partners

---

### **Frontend Pages**

#### 1. Partner Training Portal (`/partner/training`)
**Features:**
- Module completion tracking (Quick Start, Product Cheat Sheets, Pitch & Objections, Demos)
- Progress bar showing % complete
- Product-by-product pitch scripts with **Copy Pitch** button
- Objection handling guides
- Referral link generation with **Copy Link** button
- FTC disclosure reminder with copy button

**Database Integration:**
- Reads from `marketplace_affiliate_training_progress`
- Updates completion status per module

#### 2. Leaderboard Page (`/partner/leaderboard`)
**Features:**
- Live rankings based on points
- Badge showcase (Starter → Legend)
- Top 3 highlighted with special icons
- Current user highlighted in blue
- Points breakdown explanation
- Next badge progress indicator

**Point System:**
- 10 points per referral signup
- 100 points per paid conversion
- 1 point per $1 commission earned

**Badges:**
- **Starter** - 0 sales (default)
- **Starter Seller** - 1+ sales
- **Momentum** - 5+ sales
- **Closer** - 10+ sales
- **Elite** - 25+ sales
- **Legend** - 50+ sales

#### 3. Admin Products & Rates Manager (`/admin/affiliate-products`)
**Features:**
- View all partner products grouped by type
- Inline edit: Name, Stripe Price ID, Commission %, Active status
- Visual validation for Stripe Price IDs (must start with `price_`)
- Test link button (opens `/join?product=SKU`)
- Commission rate guidelines reference

**Critical Fields:**
- `stripe_price_id` - Must be populated for checkout to work
- `commission_rate_bp` - Stored in basis points (1000 = 10%)
- `active` - Controls visibility to partners

#### 4. Join Page (`/join`)
**Purpose:** Partner referral landing page

**Flow:**
1. Reads URL params: `ref` (partner code), `product` (SKU), `utm_*` (tracking)
2. Calls `track-marketplace-affiliate-click` to create referral
3. Stores in localStorage:
   - `ll_referral_id`
   - `ll_partner_code`
   - `ll_product_sku`
   - `ll_utm`
4. Redirects to appropriate page based on product

**Example URLs:**
```
/join?ref=ABC123&product=course_lca
/join?ref=ABC123&product=crm_tradehive&utm_source=email&utm_campaign=launch
```

#### 5. AttachReferralOnLogin Component
**Purpose:** Auto-attaches stored referral to user after signup/login

**Behavior:**
- Runs once per login
- Checks localStorage for `ll_partner_code` or `ll_referral_id`
- Calls `attach-marketplace-affiliate-to-signup`
- Clears localStorage after successful attach

**Integration:** Added to `App.tsx` inside `AuthProvider`

---

### **Routes Added**

```typescript
// Partner routes
/partner/training          // Training Portal
/partner/leaderboard       // Leaderboard & Badges
/partner/dashboard         // Main dashboard (existing)
/partner/affiliates        // Affiliate earnings (existing)

// Admin routes
/admin/affiliate-products  // Products & Rates Manager
/admin/affiliate-commissions // Commission approval queue (existing)

// Public routes
/join                      // Referral landing page
```

---

## ⚙️ Configuration Required

### **1. Supabase Secrets**

Add these in **Supabase → Settings → Edge Functions → Secrets**:

```bash
SENDGRID_API_KEY=SG.xxx...
EMAIL_FROM=partners@locallinkmarketplace.com
INTERNAL_API_KEY=<generate-with: openssl rand -base64 32>
APP_BASE_URL=https://locallinkmarketplace.com
NUDGE_COOLDOWN_HOURS=48
```

### **2. SendGrid Configuration**

1. **Verify Sending Domain**
   - Go to SendGrid → Settings → Sender Authentication
   - Verify your domain (e.g., `locallinkmarketplace.com`)
   - Set `EMAIL_FROM` to use verified domain

2. **Create API Key**
   - Go to SendGrid → Settings → API Keys
   - Create new key with "Mail Send" permissions
   - Copy key → save as `SENDGRID_API_KEY`

3. **Test Email**
   ```bash
   curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/send-email \
     -H "Content-Type: application/json" \
     -H "X-Internal-Api-Key: YOUR_KEY" \
     -d '{
       "to": "test@example.com",
       "subject": "Test",
       "html": "<p>Test email</p>"
     }'
   ```

### **3. Populate Stripe Price IDs**

**Critical:** Each product must have a Stripe Price ID for checkout to work.

```sql
-- Example: Update products with Stripe Price IDs
UPDATE marketplace_affiliate_products
SET stripe_price_id = 'price_1ABC123...'
WHERE sku = 'course_lca';

UPDATE marketplace_affiliate_products
SET stripe_price_id = 'price_1DEF456...'
WHERE sku = 'crm_tradehive';

-- Repeat for all products
```

**How to find Stripe Price IDs:**
1. Go to Stripe Dashboard → Products
2. Click on a product
3. Copy the Price ID (starts with `price_`)

**Or use the Admin UI:**
1. Go to `/admin/affiliate-products`
2. Paste Stripe Price IDs directly in the table
3. Click "Save" for each row

---

## 🚀 How to Use

### **For Partners**

#### 1. Get Started
- Go to `/partner/training`
- Complete "Quick Start" module
- Learn product pitches

#### 2. Copy First Link
- Go to `/partner/training` or `/affiliate/products`
- Click "Copy Link" for any product
- Share with business owner

#### 3. Track Progress
- Go to `/affiliate/dashboard` - See clicks, signups, commissions
- Go to `/partner/leaderboard` - See your rank & badges
- Go to `/affiliate/earnings` - See payout status

#### 4. Earn Badges
- **Starter Seller** - Make 1 sale
- **Momentum** - Make 5 sales
- **Closer** - Make 10 sales
- **Elite** - Make 25 sales
- **Legend** - Make 50 sales

### **For Admins**

#### 1. Approve New Partners
- Go to `/admin/partner-applications`
- Review application
- Click "Approve"
- Partner receives "You're approved" email automatically

#### 2. Manage Products & Rates
- Go to `/admin/affiliate-products`
- Update Stripe Price IDs
- Adjust commission rates
- Toggle product availability

#### 3. Approve Commissions
- Go to `/admin/affiliate-commissions`
- Review pending commissions
- Approve or reject
- Partner receives "Payout Ready" email when approved

#### 4. Run Email Nudges
**Option A: Manual (one-time)**
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/daily-partner-nudges \
  -H "X-Internal-Api-Key: YOUR_KEY"
```

**Option B: Cron (automated)**
- Use a cron service (e.g., EasyCron, cron-job.org)
- Schedule daily at 9am
- POST to `/functions/v1/daily-partner-nudges`

**Option C: Admin Button (recommended)**
- Add button to `/admin/affiliate-products`
- Calls Edge Function on click

#### 5. Create Payout Batches
- Go to `/admin/affiliate-commissions`
- Click "Create Payout Batch"
- System filters:
  - Status = `approved`
  - Eligible date > 30 days ago
  - Total per affiliate ≥ $50
- Process payouts (PayPal, Stripe Transfer, ACH)
- Mark batch as `paid`

---

## 📊 Analytics & Reports

### **Top Partners Report**
```sql
SELECT
  a.affiliate_code,
  a.display_name,
  a.points,
  a.current_badge,
  COUNT(c.id) as total_sales,
  SUM(c.commission_amount_cents) / 100.0 as total_earned
FROM marketplace_affiliates a
LEFT JOIN marketplace_affiliate_commissions c
  ON c.marketplace_affiliate_id = a.id
  AND c.status IN ('approved', 'paid')
WHERE a.status = 'active'
GROUP BY a.id
ORDER BY a.points DESC
LIMIT 20;
```

### **Product Performance**
```sql
SELECT
  product_sku,
  COUNT(*) as sales,
  SUM(commission_amount_cents) / 100.0 as total_commissions,
  AVG(commission_amount_cents) / 100.0 as avg_commission
FROM marketplace_affiliate_commissions
WHERE status IN ('approved', 'paid')
GROUP BY product_sku
ORDER BY sales DESC;
```

### **Email Engagement**
```sql
SELECT
  COUNT(*) FILTER (WHERE last_nudged_at IS NOT NULL) as partners_emailed,
  COUNT(*) FILTER (WHERE last_nudged_at > now() - interval '7 days') as emailed_last_week,
  COUNT(*) FILTER (WHERE last_nudged_at IS NULL AND approved_at IS NOT NULL) as never_emailed
FROM marketplace_affiliates
WHERE status = 'active';
```

---

## 🧪 Testing Checklist

### **1. Training Portal**
- [ ] Visit `/partner/training`
- [ ] Complete a module → check `marketplace_affiliate_training_progress`
- [ ] Copy pitch script
- [ ] Copy referral link
- [ ] Copy FTC disclosure

### **2. Leaderboard**
- [ ] Visit `/partner/leaderboard`
- [ ] Make a test sale → award points manually:
  ```sql
  SELECT award_affiliate_points(
    '<affiliate_id>',
    110,
    'Test sale'
  );
  ```
- [ ] Refresh page → see updated rank & badge

### **3. Email System**
- [ ] Send test email via `send-email` function
- [ ] Approve a partner → check they receive "approved" email
- [ ] Run `daily-partner-nudges` manually
- [ ] Check partner's `last_nudged_at` updated

### **4. Join Page Flow**
- [ ] Visit `/join?ref=TEST123&product=course_lca`
- [ ] Check localStorage has `ll_partner_code`, `ll_product_sku`
- [ ] Sign up or log in
- [ ] Check `marketplace_affiliate_referrals` has `referred_user_id`
- [ ] Check localStorage cleared

### **5. Admin Products Manager**
- [ ] Visit `/admin/affiliate-products`
- [ ] Edit a product name
- [ ] Add Stripe Price ID
- [ ] Change commission rate
- [ ] Click "Save"
- [ ] Click "Test" → opens `/join?product=SKU`

### **6. End-to-End Commission Flow**
- [ ] Partner shares link
- [ ] Customer clicks → signs up
- [ ] Customer buys product
- [ ] Stripe webhook fires
- [ ] Commission created (status: pending)
- [ ] Admin approves commission
- [ ] Partner receives "Payout Ready" email
- [ ] After 30 days, create payout batch
- [ ] Mark as paid
- [ ] Partner dashboard shows "Paid"

---

## 🐛 Troubleshooting

### **Email not sending**
1. Check `SENDGRID_API_KEY` is set correctly
2. Verify sending domain in SendGrid
3. Check Edge Function logs:
   ```bash
   supabase functions logs send-email
   ```
4. Test with curl (see Configuration section)

### **Nudges not running**
1. Check `INTERNAL_API_KEY` matches in secrets
2. Verify `last_nudged_at` cooldown hasn't blocked it
3. Check Edge Function logs:
   ```bash
   supabase functions logs daily-partner-nudges
   ```
4. Run manually to test

### **Points not updating**
1. Check function exists:
   ```sql
   SELECT award_affiliate_points('<affiliate_id>', 10, 'test');
   ```
2. Verify trigger on `marketplace_affiliates`:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'set_affiliate_approved_at_trigger';
   ```

### **Leaderboard empty**
1. Check Edge Function deployed:
   ```bash
   curl https://YOUR_PROJECT.supabase.co/functions/v1/get-marketplace-affiliate-leaderboard
   ```
2. Check affiliates have points:
   ```sql
   SELECT id, affiliate_code, points FROM marketplace_affiliates WHERE points > 0;
   ```

### **Referral not attaching**
1. Check localStorage has `ll_partner_code`
2. Check `AttachReferralOnLogin` component is rendered
3. Check browser console for errors
4. Check Edge Function logs:
   ```bash
   supabase functions logs attach-marketplace-affiliate-to-signup
   ```

---

## 🎨 Customization

### **Change Badge Thresholds**

Edit `src/pages/partner/LeaderboardPage.tsx`:
```typescript
const BADGES: Badge[] = [
  { id: "starter", salesRequired: 0 },
  { id: "starter_seller", salesRequired: 1 },
  { id: "momentum", salesRequired: 10 },     // Changed from 5
  { id: "closer", salesRequired: 25 },        // Changed from 10
  { id: "elite", salesRequired: 50 },         // Changed from 25
  { id: "legend", salesRequired: 100 },       // Changed from 50
];
```

Also update the database function:
```sql
CREATE OR REPLACE FUNCTION public.award_affiliate_points(...)
-- Update the IF conditions to match new thresholds
```

### **Change Points Formula**

Edit `supabase/functions/create-marketplace-affiliate-commission/index.ts`:
```typescript
// After commission created
const points = 100 + Math.floor(sale_amount_cents / 100);  // 100 base + $1 per dollar
await supabase.rpc('award_affiliate_points', {
  p_affiliate_id: affiliate.id,
  p_points: points,
  p_reason: `Commission for ${product_sku}`
});
```

### **Add New Email Template**

1. Edit `supabase/functions/daily-partner-nudges/index.ts`
2. Add template to `TEMPLATES` object
3. Add logic to detect when to send it
4. Deploy function

### **Change Nudge Cooldown**

Set environment variable:
```bash
NUDGE_COOLDOWN_HOURS=72  # 3 days instead of 48 hours
```

---

## 📈 Scaling Recommendations

### **When You Have 100+ Partners**
- Add Redis cache for leaderboard (update every hour)
- Paginate leaderboard (show top 100, then "Load More")
- Add email queue system (SQS, RabbitMQ) instead of inline sending

### **When You Have 1000+ Partners**
- Move leaderboard to materialized view (refresh every 6 hours)
- Add partner tiers (Starter/Pro/Elite) with different commission rates
- Implement email batch sending (100 at a time with delays)

### **When You Have 10,000+ Partners**
- Switch to dedicated analytics database (ClickHouse, BigQuery)
- Implement event-driven architecture (EventBridge, Kafka)
- Add CDN for static training content
- Use dedicated email service (Customer.io, Braze)

---

## ✅ Production Checklist

- [ ] All Stripe Price IDs populated
- [ ] SendGrid domain verified
- [ ] Email templates reviewed & approved
- [ ] Cron job configured for daily nudges
- [ ] Admin users trained on commission approval
- [ ] Test all email templates with real addresses
- [ ] Monitor SendGrid deliverability
- [ ] Set up alerts for failed Edge Functions
- [ ] Document partner onboarding process
- [ ] Create partner support channel
- [ ] Enable analytics tracking on referral links

---

## 🆘 Support

For issues:
1. Check Edge Function logs: `supabase functions logs <function-name>`
2. Check database with SQL Editor
3. Test webhooks locally: `stripe listen --forward-to ...`
4. Review commission records in admin panel

Need help? Check:
- `AFFILIATE_COMMISSION_SYSTEM_SETUP.md` - Core commission system
- `PARTNER_TRAINING_GAMIFICATION_COMPLETE.md` - This file
- Supabase logs for detailed error messages

---

## 🎉 You're Ready!

Your complete partner program is now live with:
- ✅ Training portal with product scripts
- ✅ Gamified leaderboards & badges
- ✅ Automated email nudges
- ✅ Admin control panel
- ✅ One-time commission tracking
- ✅ Net-30 payout system

**Next Steps:**
1. Populate Stripe Price IDs
2. Configure SendGrid
3. Approve first partners
4. Monitor email engagement
5. Iterate based on partner feedback
