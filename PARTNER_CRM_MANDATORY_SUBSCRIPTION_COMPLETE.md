# Partner CRM - Mandatory Subscription System (COMPLETE IMPLEMENTATION)

## Executive Summary

This system implements a **mandatory Partner CRM subscription** for all partners, supporting both **Stripe** and **GoPayBright** recurring payments. Partners must maintain an active subscription to receive commissions.

---

## 1. PRICING - FINALIZED

### Three-Tier Structure

| Tier | Monthly Price | Annual (20% Off) | Target Audience |
|------|--------------|------------------|-----------------|
| **Core** | $49/mo | $470/yr | Solo partners, side-hustlers |
| **Pro** | $99/mo | $950/yr | Agencies, serious sellers |
| **Elite** | $149/mo | $1,430/yr | Top partners, white-label |

### Stripe Price IDs (Create These)

```
partner-crm-core-monthly: $49/mo
partner-crm-pro-monthly: $99/mo
partner-crm-elite-monthly: $149/mo

partner-crm-core-annual: $470/yr
partner-crm-pro-annual: $950/yr
partner-crm-elite-annual: $1,430/yr
```

### SKU Mapping

```typescript
"partner-crm-core" → "partner_crm" (0% commission on own subscription)
"partner-crm-pro" → "partner_crm"
"partner-crm-elite" → "partner_crm"
```

---

## 2. COMMISSION ENFORCEMENT RULE

### The Golden Rule

**No Active Partner CRM Subscription = No Commission Release**

### Commission States

```
"pending" - Partner has active subscription, awaiting approval
"withheld" - Partner lacks active subscription, commission tracked but not paid
"approved" - Admin approved, ready for payout
"paid" - Transferred to partner's Stripe Connect account
"reversed" - Customer refunded, commission

 clawed back
```

### Enforcement Logic (Automatic)

```typescript
// When creating commission:
const { data: partnerSub } = await sb
  .from("partner_crm_subscriptions")
  .select("status")
  .eq("partner_id", partnerId)
  .maybeSingle();

const hasActiveSub = partnerSub && ["active", "trialing"].includes(partnerSub.status);
const commissionStatus = hasActiveSub ? "pending" : "withheld";
```

**Result:** Partners see commissions in dashboard but marked "withheld" until they subscribe.

---

## 3. PAYMENT PROVIDER SETUP

### A) Stripe Setup

1. **Create Products in Stripe Dashboard**
   - Product: "Partner CRM - Core" → Price: $49/mo
   - Product: "Partner CRM - Pro" → Price: $99/mo
   - Product: "Partner CRM - Elite" → Price: $149/mo

2. **Configure Webhook**
   ```
   URL: https://YOUR_PROJECT.supabase.co/functions/v1/stripe-partner-webhook
   Events:
     - checkout.session.completed
     - invoice.paid
     - customer.subscription.updated
     - customer.subscription.deleted
     - charge.refunded
   ```

3. **Environment Variables** (Auto-configured in Supabase)
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

### B) GoPayBright Setup

1. **Merchant Gateway Account Required**
   - Must support recurring billing
   - Contact GoPayBright to enable monthly subscriptions

2. **Environment Variables Needed**
   ```
   GOPAYBRIGHT_MERCHANT_ID
   GOPAYBRIGHT_API_KEY
   GOPAYBRIGHT_ENDPOINT (default: https://api.gopaybright.com)
   GOPAYBRIGHT_WEBHOOK_SECRET
   ```

3. **Configure Webhook**
   ```
   URL: https://YOUR_PROJECT.supabase.co/functions/v1/gopaybright-partner-callback
   Events: subscription.created, subscription.renewed, subscription.cancelled
   ```

---

## 4. PRICING PAGE COPY (EXACT)

### Hero Section

```
# Become a Local-Link Partner

## Professional tools to build a commission-based business

Track customers, close deals, and earn recurring income with the Partner CRM.
Required for all partners to ensure accurate commission tracking and payouts.
```

### Why It's Required (Positioning)

**"Required for Commission Tracking & Compliance"**

The Partner CRM isn't a fee - it's your business infrastructure:

✅ **Accurate Attribution** - Know exactly which customers are yours
✅ **Automatic Sync** - All purchases tracked in real-time
✅ **Commission Calculation** - Transparent, rule-based earnings
✅ **Payout Compliance** - Required for Stripe Connect transfers
✅ **Audit Trail** - Complete history for tax reporting
✅ **Support Priority** - Direct partner success team access

---

## 5. TIER FEATURES (WHAT EACH UNLOCKS)

### Core - $49/mo (Mandatory Minimum)

- ✅ Deal pipeline (unlimited deals)
- ✅ Customer attribution & tracking
- ✅ Referral link generator
- ✅ Real-time commission dashboard
- ✅ Order sync (Stripe webhooks)
- ✅ Payout history & reporting
- ✅ Partner Accelerator course access
- ✅ Email support
- **Required to earn commissions**

### Pro - $99/mo (For Agencies)

- ✅ Everything in Core, plus:
- ✅ Multiple pipelines (segment by product/region)
- ✅ Team members (add sales reps)
- ✅ Advanced commission reporting
- ✅ Priority attribution locking
- ✅ Partner leaderboard eligibility
- ✅ Quarterly bonus pool eligibility
- ✅ White-label email templates

### Elite - $149/mo (Top Partners)

- ✅ Everything in Pro, plus:
- ✅ Full white-label materials
- ✅ Sub-partner tracking (recruit & train)
- ✅ Higher commission tiers (negotiated)
- ✅ Early product access (beta features)
- ✅ Featured partner placement (marketplace)
- ✅ Dedicated partner success manager
- ✅ Co-marketing opportunities

---

## 6. PARTNER ONBOARDING EMAIL (EXACT COPY)

### Subject: Welcome to Local-Link Partners - Action Required

```
Hi [First Name],

Congratulations! Your partner application has been approved.

To activate your partner account and start earning commissions, you need to subscribe to the Partner CRM.

WHY THE PARTNER CRM IS REQUIRED

The Partner CRM isn't a membership fee - it's the system that:
• Tracks which customers belong to you
• Syncs their purchases in real-time
• Calculates your commissions automatically
• Ensures accurate payouts via Stripe Connect
• Provides compliance audit trails

Without it, we can't attribute sales or process payouts.

CHOOSE YOUR PLAN

Core - $49/mo
Perfect for solo partners. Track customers, earn commissions, access training.

Pro - $99/mo
For agencies. Add team members, advanced reporting, bonus pool eligibility.

Elite - $149/mo
Top partners. White-label materials, sub-partner recruiting, co-marketing.

NEXT STEPS

1. Subscribe to Partner CRM: [LINK TO PRICING PAGE]
2. Set up your referral link
3. Access your Partner Accelerator training
4. Start bringing customers to Local-Link

Questions? Reply to this email or visit our Partner Help Center.

Welcome to the team,
[Your Name]
Local-Link Partner Success Team

P.S. Your commissions are already being tracked - they'll be released as soon as your subscription is active.
```

---

## 7. IN-APP MESSAGING (WHEN SUBSCRIPTION LAPSES)

### Dashboard Banner (When Status = "withheld")

```
⚠️ Your Partner CRM subscription has lapsed.

You have $XXX.XX in withheld commissions.
Reactivate your subscription to release pending payouts.

[Reactivate Now]
```

### Email Reminder (Sent at Lapse + 3 Days)

```
Subject: $XXX in commissions waiting - Reactivate your Partner CRM

Hi [Name],

Your Partner CRM subscription ended on [Date].

You currently have $XXX.XX in commissions that can't be released until your subscription is reactivated.

Reactivate now to:
✅ Release withheld commissions
✅ Continue earning on new orders
✅ Maintain your partner status

[Reactivate Partner CRM]

Questions? Contact partner-support@local-linkmarketplace.com
```

---

## 8. ADMIN FUNCTIONS (COMMISSION MANAGEMENT)

### View All Withheld Commissions

```sql
SELECT
  ap.code,
  ap.user_id,
  SUM(c.commission_cents) / 100.0 as withheld_total
FROM commissions c
JOIN affiliate_partners ap ON c.partner_id = ap.id
WHERE c.status = 'withheld'
GROUP BY ap.code, ap.user_id
ORDER BY withheld_total DESC;
```

### Release Withheld Commissions (When Partner Resubscribes)

```sql
-- Auto-triggered by webhook when subscription becomes active
UPDATE commissions
SET status = 'pending'
WHERE partner_id = 'PARTNER_ID'
AND status = 'withheld';
```

### Manual Override (Admin Emergency Use)

```sql
-- Approve specific commission despite no subscription
UPDATE commissions
SET status = 'approved'
WHERE id = 'COMMISSION_ID';
```

---

## 9. ROUTES ADDED

```
/partner/crm/pricing - Pricing page (both Stripe + GoPayBright options)
/partner/crm - Dashboard (access gated)
/partner/crm/upgrade - Redirect if no subscription
/partner/crm/customers - Customer list
/partner/crm/commissions - Commission history & withheld view
```

---

## 10. DATABASE SCHEMA SUMMARY

### Tables Created/Modified

```sql
partner_crm_subscriptions
  - payment_provider (stripe|gopaybright)
  - tier (core|pro|elite)
  - status (active|trialing|past_due|canceled)

payment_events
  - Audit log for all webhook events

commissions
  - status now includes "withheld"

orders
  - Links to partner_id for commission calculation
```

---

## 11. TESTING CHECKLIST

### Test Stripe Flow
- [ ] Partner applies & gets approved
- [ ] Partner visits /partner/crm → redirects to /partner/crm/upgrade
- [ ] Partner clicks "Subscribe" → Stripe Checkout
- [ ] Complete payment
- [ ] Webhook activates subscription
- [ ] Partner can access /partner/crm dashboard
- [ ] Test customer purchase with partner ref code
- [ ] Verify commission created with status="pending"

### Test GoPayBright Flow
- [ ] Partner selects GoPayBright option
- [ ] Redirect to GoPayBright recurring checkout
- [ ] Complete GoPayBright payment
- [ ] Callback activates subscription
- [ ] Verify subscription in database

### Test Subscription Lapse
- [ ] Cancel subscription in Stripe/GoPayBright
- [ ] Webhook sets status="canceled"
- [ ] New customer purchase creates commission with status="withheld"
- [ ] Dashboard shows withheld banner
- [ ] Resubscribe → withheld commissions change to "pending"

---

## 12. LAUNCH DAY TASKS

1. **Create Stripe Products & Prices**
2. **Configure Stripe Webhook Endpoint**
3. **Set Up GoPayBright Recurring (if enabled)**
4. **Update Partner Application Flow** (mention required subscription)
5. **Send Email to Existing Partners** (grandfather clause or require subscription)
6. **Update Partner Agreement** (mention CRM subscription requirement)
7. **Launch Partner CRM Pricing Page**
8. **Monitor First 10 Subscriptions** (check webhook logs)

---

## 13. GRANDFATHER CLAUSE (OPTIONAL)

If you have existing partners:

**Option A: Require Immediately**
- Email all partners: "Subscribe by [Date] or commissions withheld"

**Option B: Grace Period**
- 30-day grace period, then automatic withhold

**Option C: Grandfather Legacy Partners**
- Partners approved before [Date] = no subscription required
- Add `grandfathered: boolean` column to `affiliate_partners`

Recommended: **Option A** (clean, fair, universal rule)

---

## IMPLEMENTATION COMPLETE

✅ Database schema with payment provider support
✅ GoPayBright recurring subscription checkout
✅ GoPayBright webhook callback handler
✅ Stripe webhook with subscription enforcement
✅ Commission withheld logic
✅ Pricing copy & tier features defined
✅ Onboarding email template
✅ Admin SQL queries

**Next:** Create the pricing page UI with both Stripe and GoPayBright options, then build and test.
