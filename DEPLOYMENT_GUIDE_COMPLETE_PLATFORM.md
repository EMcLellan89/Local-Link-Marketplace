# Complete Deployment Guide
## Local-Link Content & Automation Platform

This platform **DESTROYS Content360** by being:
- **Revenue-first** (not just engagement)
- **Local-focused** (not generic social)
- **Partner-monetized** (built-in resale)
- **Truly DFY** (30-day auto-install, not just tools)

---

## 🎯 What You're Building

### Core Features
- ✅ Multi-tenant SaaS architecture
- ✅ Subscription management (base plans + add-ons)
- ✅ Partner commission system (10-20% + 7% upline)
- ✅ DFY 30-day content installation
- ✅ AI content generation (industry-specific)
- ✅ Multi-channel scheduler
- ✅ Built-in CRM with lead tracking
- ✅ Revenue attribution (ROI per post/campaign)
- ✅ Referral tracking + short links
- ✅ White-label partner portal

### What Makes It Better Than Content360
| Feature | Content360 | Local-Link |
|---------|-----------|------------|
| Focus | Content creation | **Revenue generation** |
| Attribution | Engagement metrics | **Revenue per post** |
| CRM Integration | None | **Built-in** |
| Offline/Online | Online only | **Omni-channel** |
| Monetization | None | **Partner ecosystem** |
| Local Features | Generic | **Industry-specific campaigns** |
| DFY Setup | Manual | **30-day auto-install** |

---

## 📦 Installation Steps

### 1. Database Setup (5 minutes)

Run these SQL files in order in your Supabase dashboard:

```bash
# Already completed in your project:
# ✓ create_org_tables_step_by_step.sql
# ✓ create_subscription_and_plans_system.sql
# ✓ create_subscription_rpc_functions.sql

# Run these new files:
psql -f COMPLETE_CONTENT_PLATFORM_SCHEMA.sql
psql -f SEED_DATA_PLANS_AND_TEMPLATES.sql
```

Or in Supabase Dashboard:
1. Go to SQL Editor
2. Copy/paste `COMPLETE_CONTENT_PLATFORM_SCHEMA.sql`
3. Run
4. Copy/paste `SEED_DATA_PLANS_AND_TEMPLATES.sql`
5. Run

### 2. Environment Variables

Create/update `.env`:
```env
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

PUBLIC_BASE_URL=http://localhost:5173
# Or your production URL: https://yourdomain.com
```

### 3. Stripe Setup (15 minutes)

#### Create Products in Stripe

1. Go to https://dashboard.stripe.com/test/products
2. Create these products (match the names exactly):

**Merchant Plans:**
- CORE - $97/month (recurring)
- GROW - $197/month (recurring)
- REVENUE - $297/month (recurring)

**Merchant Add-ons:**
- Advanced Scheduler - $29/month
- Email Marketing Pack - $49/month
- SMS Marketing Pack - $79/month
- DFY Content Service - $149/month
- White-Glove Support - $99/month

**Partner Tiers:**
- Partner Starter - $0/month (free)
- Partner Pro - $97/month
- Partner Enterprise - $297/month

3. Copy each Price ID and update your database:
```sql
UPDATE plans SET stripe_price_id = 'price_xxx' WHERE name = 'CORE';
UPDATE plans SET stripe_price_id = 'price_yyy' WHERE name = 'GROW';
-- Repeat for all plans
```

#### Setup Webhook

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/webhooks/stripe`
4. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
5. Copy webhook secret to `.env`

### 4. API Implementation (30 minutes)

Create these files in your project (all code is in `COMPLETE_API_IMPLEMENTATION_GUIDE.md`):

```
src/lib/api-helpers.ts          # Shared utilities
src/pages/api/auth/merchant-signup.ts
src/pages/api/org/me.ts
src/pages/api/billing/status.ts
src/pages/api/billing/create-checkout-session.ts
src/pages/api/billing/add-addon.ts
src/pages/api/webhooks/stripe.ts
src/pages/api/dfy/install-30-days.ts
src/pages/api/merchant/dashboard.ts
src/pages/api/partner/dashboard.ts
```

### 5. Test the System (10 minutes)

#### Test Merchant Signup
```bash
curl -X POST http://localhost:5173/api/auth/merchant-signup \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "Test HVAC Co",
    "owner_name": "John Doe",
    "email": "john@testhvac.com",
    "phone": "555-0100",
    "industry": "hvac",
    "service_area": ["Austin", "Round Rock"]
  }'
```

#### Test Subscription Creation
1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future date for expiry
3. Any 3-digit CVC
4. Any ZIP code

#### Test Webhook
```bash
stripe listen --forward-to localhost:5173/api/webhooks/stripe
```

---

## 🚀 DFY Merchant Onboarding Flow

### What Happens When a Merchant Signs Up

1. **Account Creation** (automatic)
   - Auth user created
   - Organization created
   - Default CRM pipeline with 6 stages
   - Merchant settings initialized

2. **Plan Selection** (user chooses)
   - Redirected to pricing page
   - Selects CORE, GROW, or REVENUE
   - Stripe checkout opens

3. **Payment Complete** (webhook triggered)
   - Subscription created in DB
   - Features computed and cached
   - Commission relationship created (if from referral)

4. **DFY Install Wizard** (3 questions)
   - Goal: Calls, Bookings, Reviews, or Sales?
   - Frequency: How many posts per week?
   - Channels: Facebook, Instagram, Google, Email, SMS?

5. **30-Day Content Generated** (automatic)
   - Industry-specific campaign created
   - 28-30 posts pre-scheduled
   - Calendar populated
   - Bio link + QR codes created

6. **Dashboard Ready** (immediately usable)
   - Next 7 days of scheduled posts
   - Empty CRM (ready for leads)
   - KPI tracking active
   - Referral link for customers

### Merchant Experience (80% DFY)

**Week 1:**
- Posts automatically scheduled
- Business owner reviews + approves
- Optionally swaps photos/videos
- 5-10 minutes total

**Week 2-4:**
- System runs on autopilot
- Merchant just monitors
- Leads flow into CRM
- Revenue tracked per post

**After 30 Days:**
- Merchant sees what's working
- Can tweak/optimize
- Or buy DFY Content Service add-on
- Or let system continue as-is

---

## 💰 Partner Commission Flow

### How Partners Earn

1. **Partner Signs Up**
   - Chooses Starter (free, 10%), Pro ($97, 15%), or Enterprise ($297, 20%)
   - Gets unique referral code
   - Can optionally set upline (for 7% upline commissions)

2. **Partner Shares Link**
   - `yourdomain.com/signup/merchant?ref=PARTNER123`
   - Code auto-fills in merchant signup
   - Relationship locked with commission rate snapshot

3. **Merchant Subscribes**
   - Partner earns their rate (10-20%) every month
   - If partner has upline, upline earns 7% (if active subscriber)
   - Commissions tracked in `commission_splits` table

4. **Invoice Paid** (Stripe webhook)
   - Direct partner commission created (10-20% of invoice)
   - Upline commission created (7% of invoice, if upline is active)
   - Both marked as "earned"

5. **Payouts** (admin controlled)
   - Admin marks commissions as "paid"
   - Can batch process via Stripe Connect
   - Full audit trail maintained

### Example: $197/month merchant with Pro partner + upline

- **Merchant pays:** $197/month (GROW plan)
- **Direct partner earns:** $29.55/month (15%)
- **Upline earns:** $13.79/month (7%)
- **Platform keeps:** $153.66/month
- **Both partners earn forever** (recurring)

---

## 🎨 UI Components to Build

### Merchant Dashboard
- KPI cards (leads, scheduled posts, campaigns)
- Next 7 days calendar preview
- CRM pipeline summary
- Quick actions (Create post, Add lead, View analytics)

### Merchant Billing Page
- Current plan display
- Add-on marketplace (with "owned" badges)
- Upgrade/downgrade buttons
- Billing portal link

### Partner Dashboard
- Merchants count + influenced MRR
- Commission totals (earned, paid)
- Referral link generator
- Client list with plan details

### Onboarding Wizard
- 3-step DFY setup
- Goal selection
- Frequency picker
- Channel checkboxes
- "Generate My 30 Days" button

---

## 📊 Feature Gating Examples

```typescript
// Get user's effective features
const { effective_features } = await fetch('/api/billing/status').then(r => r.json());

// Gate features in UI
if (!effective_features.scheduler) {
  // Show upgrade modal
  <UpgradeModal
    feature="Multi-Channel Scheduler"
    requiredPlan="GROW"
    price="$197/month"
  />
}

if (effective_features.email_credits < 100) {
  // Show add-on upsell
  <AddOnUpsell
    addon="Email Marketing Pack"
    benefit="2,500 email credits/month"
    price="$49/month"
  />
}

// Track usage
if (leadCount >= effective_features.leads_per_month) {
  // Soft limit reached
  <UpgradePrompt plan="GROW" benefit="500 leads/month" />
}
```

---

## 🔐 Security Checklist

- ✅ All RLS policies enabled
- ✅ Service role key never exposed to client
- ✅ Webhook signature verification
- ✅ User auth required on all protected endpoints
- ✅ Org membership checked before data access
- ✅ Commission rates locked at relationship creation
- ✅ Stripe customer IDs validated

---

## 🧪 Testing Checklist

### Merchant Flow
- [ ] Signup with referral code
- [ ] Purchase CORE plan
- [ ] Run DFY 30-day install
- [ ] Verify 28+ posts scheduled
- [ ] Upgrade to GROW plan
- [ ] Add Email Marketing Pack add-on
- [ ] Remove add-on
- [ ] Create manual post
- [ ] Add lead to CRM
- [ ] Generate short link

### Partner Flow
- [ ] Partner Pro signup with upline code
- [ ] Generate referral link
- [ ] Merchant signs up via referral
- [ ] Merchant subscribes to GROW
- [ ] Verify direct partner commission created (15%)
- [ ] Verify upline commission created (7%)
- [ ] Invoice paid webhook creates earned commissions
- [ ] Admin marks commissions as paid

### Edge Cases
- [ ] Merchant with no referral
- [ ] Partner with no upline
- [ ] Upline without active subscription (no 7%)
- [ ] Subscription canceled
- [ ] Subscription past_due
- [ ] Add-on already owned (duplicate prevented)

---

## 🚢 Production Deployment

### Vercel / Netlify
```bash
# Set environment variables in dashboard
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...  # Server-side only!
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
PUBLIC_BASE_URL=https://yourdomain.com

# Deploy
vercel --prod
# or
netlify deploy --prod
```

### Update Stripe Webhook
- Point to: `https://yourdomain.com/api/webhooks/stripe`
- Use live keys
- Enable live mode

### Post-Deploy Checklist
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Seed data loaded
- [ ] Stripe webhook receiving events
- [ ] Test production signup flow
- [ ] Confirm commission creation
- [ ] Monitor error logs

---

## 📈 Next Steps (Post-Launch)

### Week 1
1. Add 5 more industries to content templates
2. Create campaign templates for top 10 local events
3. Build email notification system for leads

### Month 1
1. Add analytics dashboard (ROI tracking)
2. Implement automated follow-up sequences
3. Build customer referral engine (merchant → customer referrals)

### Quarter 1
1. White-label customization for Enterprise partners
2. Territory protection system
3. Advanced automation workflows (Zapier-style)
4. Mobile app (iOS/Android)

---

## 🆘 Troubleshooting

### Webhook Not Receiving Events
```bash
# Test locally
stripe listen --forward-to localhost:5173/api/webhooks/stripe

# Check logs
stripe logs tail
```

### Commission Not Created
- Check `partner_relationships` table exists
- Verify `commission_rate` is set (0.10-0.20)
- Confirm webhook `invoice.paid` is enabled
- Check `commission_splits` table for errors

### Features Not Computing
```sql
-- Manually trigger recompute
SELECT rpc_recompute_org_features('org-uuid-here');

-- Check result
SELECT * FROM org_features WHERE org_id = 'org-uuid-here';
```

### RLS Errors
```sql
-- Temporarily disable for debugging (DEV ONLY!)
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;

-- Re-enable after fix
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

---

## 💡 Pro Tips

1. **Start with CORE plan** - Validate the model before building GROW/REVENUE features
2. **Seed 20+ content templates** - More industries = more merchants
3. **Make DFY install < 60 seconds** - Speed = conversion
4. **Show ROI immediately** - "Your posts generated 12 calls worth $3,600"
5. **Partner dashboard is your growth engine** - Make it addictive

---

## 🎉 You're Ready!

You now have a complete Content360 killer with:
- ✅ Better positioning (revenue vs. engagement)
- ✅ Better features (CRM, attribution, local focus)
- ✅ Better monetization (partner ecosystem)
- ✅ Better DFY (30-day auto-install)

**Go crush Content360.** 🚀
