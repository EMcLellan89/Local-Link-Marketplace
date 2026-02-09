# Multi-Business Accounting & Commission System

## Quick Access URLs

### Admin Dashboards
- **Business Dashboard**: `/admin/business-dashboard`
- **Commission Payouts**: `/admin/commission-payouts`
- **Partner Commission Details**: `/partner/earnings`

## Features Built

### 1. Local-Link Business Dashboard (`/admin/business-dashboard`)

**What it shows:**
- All businesses on separate lines (Local-Link Marketplace, Local Paws Passport, Budget Buster, Academy Courses)
- Combined totals at the top across all businesses
- For each business:
  - Gross Revenue
  - Net Revenue (after refunds)
  - Refunds
  - Commissions Paid
  - Commissions Pending
  - Total Orders
  - Net Profit (revenue minus commissions)

**Features:**
- Custom date range selector
- Export to CSV
- Real-time refresh
- Direct link to Commission Payouts dashboard

### 2. Commission Payouts Dashboard (`/admin/commission-payouts`)

**What it shows:**
- Total pending commissions awaiting approval
- Total queued commissions ready for payout
- Number of partners awaiting payment
- List of all partners with pending payouts
- Recent payout batch history

**Actions Available:**
- Queue Approved Commissions - One-click to queue all approved commissions
- Process Payouts - One-click to pay all queued commissions
- Export payout report to CSV
- Manual refresh

**Automation:**
- Automatically runs every day at 2:00 AM UTC
- No manual intervention needed for daily payouts

### 3. Partner Commission Dashboard (`/partner/earnings`)

**What partners see:**
- Monthly income from all businesses combined
- Breakdown by business source
- Earned vs Paid vs Pending amounts
- Real-time updates as sales come in
- Export personal commission reports

## How It Works

### Daily Automated Flow

1. **2:00 AM UTC Daily** - Automated job runs
2. All "approved" commissions → Changed to "queued"
3. All "queued" commissions → Processed and paid
4. Payout batch created with tracking number
5. All commissions marked as "paid" with timestamp
6. Partner dashboards updated instantly

### Manual Flow (If Needed)

1. Go to `/admin/commission-payouts`
2. Click "Queue Approved Commissions"
3. Click "Process X Payouts"
4. Done! Partners see updated earnings immediately

## Database Functions

All new functions created:

- `get_multi_business_accounting(start_date, end_date)` - Returns all business metrics
- `get_commission_payout_stats()` - Returns commission summary stats
- `get_pending_partner_payouts()` - Lists partners awaiting payment
- `queue_approved_commissions()` - Queues commissions for payout
- `process_commission_payouts()` - Processes all queued payouts
- `automated_daily_commission_payout()` - Cron job function

## New Table

**commission_payout_batches**
- Tracks each payout batch
- Links to commission_ledger entries
- Maintains audit trail
- Records who processed, when, and amounts

## Security

- All functions use SECURITY DEFINER with proper search_path
- RLS policies enforce admin-only access
- Audit trail maintained for all payouts
- Transaction safety built-in

## Integration

Partner commissions from ALL businesses automatically flow to:
- `/partner/earnings` - Partner sees their income
- `/admin/business-dashboard` - Admin sees all business accounting
- `/admin/commission-payouts` - Admin processes payouts

Everything is connected and updates in real-time!
