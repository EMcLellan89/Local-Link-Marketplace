# Network Navigators & Partner System - Build Status

## Completed

### 1. Facebook Monetization Playbook
**Status:** ✅ Complete
**Location:** `partner_playbooks` table, slug: `facebook-monetization-execution`

**Includes:**
- 6 comprehensive modules with step-by-step lessons
- Module 1: Prospecting & Qualification
- Module 2: Discovery & Diagnosis
- Module 3: Proposal & Pricing
- Module 4: Close & Onboard
- Module 5: Delivery & Results
- Module 6: Upsell & Retention
- 18 total lessons covering complete sales & delivery system

### 2. Network Navigators Products
**Status:** ✅ Complete
**Location:** `marketplace_affiliate_products` table

**Territory Subscriptions:**
- NN-TERR-25: 25-mile territory ($99/month, 20% commission)
- NN-TERR-50: 50-mile territory ($149/month, 20% commission)
- NN-TERR-75: 75-mile territory ($199/month, 25% commission)

**DFY Marketing Packages:**
- NN-DFY-SETUP: Setup & Launch Pack ($1,497, 25% commission)
- NN-DFY-LEADS: Lead Capture & Retargeting ($997, 25% commission)
- NN-DFY-SEO: Local SEO + GBP Pack ($797, 25% commission)
- NN-DFY-CONTENT: Content Creation Pack ($597, 25% commission)
- NN-DFY-REVIEWS: Review Engine Pack ($897, 25% commission)

### 3. DFY Job Templates
**Status:** ✅ Complete
**Location:** `dfy_job_templates` table

**Features:**
- Complete task checklists for each DFY package
- Required skills tracking
- Estimated hours and partner payouts
- Detailed fulfillment instructions
- Partner fulfillment workflow ready

### 4. Business Entry
**Status:** ✅ Complete
**Location:** `profit_network_businesses` table

Network Navigators added as external business with 20% base commission rate.

## In Progress / Needs Completion

### 5. Partner Referral Attribution System
**Status:** ⚠️ Partially Built (Migration Failed)
**Required Tables:**
- `partner_referral_links` - Generate unique referral links
- `partner_referral_clicks` - Track all clicks and conversions
- `partner_attributions` - Permanent first-click attribution
- `partner_commission_ledger` - Comprehensive commission tracking
- `deluxe_payout_exports` - Daily export batches
- `deluxe_payout_export_items` - Export line items

**Required Functions:**
- `generate_referral_slug()` - Create unique partner slugs
- `record_partner_attribution()` - Track first-click attribution
- `create_commission_ledger_entry()` - Record commissions

**Migration File Needed:** Break into smaller migrations due to complexity

### 6. Daily Deluxe Payout Export System
**Status:** 🔴 Not Started
**Requirements:**
- Daily cron job to export approved commissions
- CSV generation matching Deluxe eCheck format
- Save CSV to Supabase Storage
- Admin dashboard summary card
- Upload tracking (when admin uploads to Deluxe)
- Payment confirmation workflow

**Files Needed:**
- Edge Function: `daily-payout-export-job`
- Admin UI: `/admin/payout-exports`
- Cron schedule: Daily at 9 AM

### 7. Admin Payout Dashboard
**Status:** 🔴 Not Started
**Requirements:**
- List all export batches
- Download CSV files
- Mark as "uploaded to Deluxe"
- Mark as "paid" with date
- View export details (partners, amounts)
- Filter by date range and status

**Files Needed:**
- React Component: `src/pages/admin/AdminPayoutExports.tsx`
- Route: `/admin/payout-exports`

### 8. Job Board Purchase → Fulfillment Flow
**Status:** 🔴 Not Started
**Requirements:**

**Flow:**
1. Merchant purchases DFY package in marketplace
2. System creates job ticket in `dfy_job_orders` table
3. Certified partners see job in job board
4. Partner claims job
5. Partner completes tasks (checklist)
6. Partner submits for review
7. Admin approves work
8. Commission ledger entry created
9. Partner gets paid in next Deluxe export

**Tables Needed:**
- `dfy_job_orders` - Job tickets
- `dfy_job_claims` - Partner claims
- `dfy_job_deliverables` - Work submissions
- `dfy_job_reviews` - Admin reviews

**UI Needed:**
- Merchant: View job status
- Partner: Job board, claim jobs, submit work
- Admin: Review submissions, approve/reject

### 9. Partner Link Builder UI
**Status:** 🔴 Not Started
**Requirements:**
- Partner dashboard page
- Generate referral links for products
- Copy link functionality
- View click and conversion stats
- Create campaign-specific links

**Files Needed:**
- React Component: `src/pages/partner/PartnerShareLinks.tsx`
- Route: `/partner/share-links`

### 10. Commission Attribution Automation
**Status:** 🔴 Not Started
**Requirements:**
- Webhook integration with marketplace checkout
- Auto-create attribution on signup (if referral cookie exists)
- Auto-create ledger entry on purchase
- Auto-calculate commission based on partner tier
- Handle upgrades and upsells

**Files Needed:**
- Edge Function: `attach-marketplace-partner-attribution`
- Edge Function: `create-partner-commission-on-sale`

## Database Schema Summary

### Existing Tables (Relevant)
- `partners` - Partner profiles
- `partner_tiers` - Tier definitions (10%, 15%, 20%, 25%, 30%)
- `marketplace_affiliate_products` - All sellable products
- `profit_network_businesses` - External businesses (like Network Navigators)
- `dfy_job_templates` - Job fulfillment templates

### Tables to Create
- `partner_referral_links` - Unique referral URLs
- `partner_referral_clicks` - Click tracking
- `partner_attributions` - Permanent attribution mapping
- `partner_commission_ledger` - Commission tracking (CRITICAL)
- `deluxe_payout_exports` - Daily export batches
- `deluxe_payout_export_items` - Export line items
- `dfy_job_orders` - DFY job tickets
- `dfy_job_claims` - Job claims by partners
- `dfy_job_deliverables` - Work submissions
- `dfy_job_reviews` - Admin reviews

## Key Business Rules (Locked)

### Commission Rates by Tier
- Starter: 10% (1000 bps)
- Growth: 15% (1500 bps)
- Pro: 20% (2000 bps)
- Elite: 25% (2500 bps)
- Enterprise: 30% (3000 bps)

### Attribution Rules
1. **First-click wins** - Attribution is permanent
2. **Never changes** - Unless partner is terminated
3. **Applies to everything** - Territory, upgrades, upsells, renewals
4. **Stored at customer/merchant level** - Not per-transaction

### Payout Rules
1. **NO STRIPE PAYOUTS** - Only Deluxe eChecks
2. **Daily exports** - Generate CSV every day at 9 AM
3. **Admin uploads** - Manual upload to Deluxe
4. **Track payment** - Mark as paid after confirmation
5. **Commission ledger is source of truth** - Stripe IDs for reference only

## Next Steps (Priority Order)

1. **Fix Partner Referral System Migration** (Break into smaller pieces)
2. **Build Commission Ledger UI** (Admin CRM view)
3. **Create Daily Export Job** (Edge Function + Cron)
4. **Build Admin Payout Dashboard** (CSV download & tracking)
5. **Build Job Board Flow** (Purchase → Ticket → Claim → Complete → Pay)
6. **Build Partner Link Builder** (UI for partners)
7. **Add Webhook Automation** (Auto-attribution & commission)

## Testing Checklist

- [ ] Partner can generate referral link
- [ ] Click tracking works
- [ ] Attribution persists across sessions
- [ ] Commission ledger entry created on sale
- [ ] Commission calculation is correct
- [ ] Daily export generates CSV
- [ ] Admin can download CSV
- [ ] Admin can mark as uploaded/paid
- [ ] DFY purchase creates job ticket
- [ ] Partner can claim job
- [ ] Partner can submit work
- [ ] Admin can approve/reject
- [ ] Approved job creates commission entry
- [ ] Partner sees commission in dashboard

## Documentation Links

**Facebook Monetization Playbook:**
- Partner Portal → Playbooks → "Facebook Monetization: Complete Sales & Delivery System"

**Network Navigators Products:**
- Marketplace → Profit Network → Network Navigators
- Marketplace → DFY Marketing → Network Navigators Packages

**Job Templates:**
- Database: `dfy_job_templates` table
- View via admin SQL or API

## Important Notes

1. **Stripe Connect Status** - Still tracked but NOT used for payouts
2. **Revenue Share** - All external business sales (like Network Navigators) go to Local-Link Marketplace
3. **Partner Commission** - Partners earn commission on bringing in Network Navigators customers
4. **Territory Subscriptions** - Recurring monthly revenue for partners
5. **DFY Packages** - One-time services with partner fulfillment
6. **Job Board** - Internal marketplace for partners to fulfill DFY work
7. **Permanent Attribution** - Once attributed, partner earns forever on that customer

## Questions to Address

1. How to handle territory conflicts? (Multiple partners want same area)
2. Should we lock territories after purchase?
3. What happens if DFY job is rejected? Partner resubmits or refund?
4. Commission on failed/refunded sales - void the ledger entry?
5. Multi-partner referrals - do we credit both or first only?
6. Partner termination - what happens to their attributions?
