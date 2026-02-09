# Local-Link Profit Network™ - Complete System Guide

## Overview

The **Local-Link Profit Network™** is a revolutionary partner program where partners promote pre-sold businesses and earn **25% flat commission** on all sales. The businesses are completely sold through automated Facebook ads and bots - partners simply share their unique tracking link and collect commissions.

## Quick Access URLs

### Partner Access
- **Main Profit Network Page**: `/partner/profit-network`
- **Sales & Statements Dashboard**: `/partner/profit-network/sales`
- **Available from**: Bottom of `/partner/playbooks` page

### Admin Access
- **Business Dashboard**: `/admin/business-dashboard` (shows all Profit Network sales)
- **Commission Payouts**: `/admin/commission-payouts`

## How the Profit Network Works

### 1. Partner Enrollment

**Step 1: Partner Applies**
- Partner visits `/partner/profit-network`
- Browses approved businesses
- Clicks "Apply Now" for businesses they want to promote
- Application status changes to "pending"

**Step 2: Admin Approves**
- Admin reviews application
- Approves partner enrollment
- System automatically generates:
  - Unique tracking link code (format: `PN-{partner_code}-{business_code}-{random}`)
  - Full tracking URL (format: `{business_url}?ref={link_code}`)

**Step 3: Partner Activates**
- Partner receives approval notification
- Status changes to "active"
- Partner can now access their tracking link and start sharing

### 2. Commission Structure

**Base Commission: 25% Flat Rate**
- Every sale tracked through partner's link = 25% commission
- No sliding scales, no tiers - just flat 25%

**Bonus Opportunities**
- Admin can enable bonuses up to 10% extra
- Bonuses can be set per business
- Can have expiration dates for limited-time promotions
- Maximum total commission: 35% (25% base + 10% bonus)

**Example Commission Calculation:**
```
Sale Amount: $1,000
Base Commission (25%): $250
Bonus (10%): $100
Total Commission: $350
```

### 3. Ad Cost Model - The 8-Week Startup

**First 8 Weeks (Startup Period)**
- Local-Link covers $20/day in ads = $140/week
- Total covered: 8 weeks × $140 = $1,120
- Partner pays $0 during this period
- Partner focuses on sharing their link and making sales

**Week 9 Onward (Payback Period)**
- Partner pays back $50/week
- Payback continues for 23 weeks (total $1,150)
- Deducted automatically from weekly commission
- Once paid back, status changes to "payback_complete"

**After Payback Complete**
- Partner's ad costs are deducted from commission BEFORE payment
- Default: $20/day = $140/week
- Partner can adjust daily ad spend (minimum $20/day)
- Options: $20, $30, $40, $50/day or more
- Cannot go below $20/day minimum

### 4. Weekly Payment Flow

**Every Week:**
1. System calculates gross commission earned
2. Subtracts deductions in this order:
   - Startup payback ($50/week if applicable)
   - Current week's ad costs
   - Partner subscription fee (if applicable)
3. Net commission = What partner receives

**Example Weekly Statement (During Payback):**
```
Gross Commission Earned: $500
- Startup Payback: -$50
- Ad Costs (7 days × $20): -$140
- Subscription Fee: -$0
= Net Commission: $310
```

**Example Weekly Statement (After Payback):**
```
Gross Commission Earned: $500
- Ad Costs (7 days × $20): -$140
= Net Commission: $360
```

### 5. Monthly Statements

Partners receive detailed monthly statements showing:
- Total sales count
- Gross commission earned
- Breakdown of all deductions:
  - Startup payback amount
  - Total ad costs for the month
  - Subscription fees
- Net commission received
- Payback progress (if applicable)
- Current daily ad spend setting

## Database Schema

### Tables

**profit_network_businesses**
- Approved businesses partners can promote
- Commission rates and bonus settings
- Website URLs and branding

**profit_network_enrollments**
- Partner enrollments in specific businesses
- Unique tracking links
- Ad budget and payback tracking
- Enrollment status and stats

**profit_network_sales**
- Individual sales tracked from each business
- Links partner, business, and commission
- Calculates deductions and net commission

**profit_network_ad_costs**
- Daily ad spend tracking per enrollment
- Distinguishes startup period vs partner-paid

**profit_network_deductions**
- All deductions from partner commissions
- Categorized by type (payback, ads, subscription)

**profit_network_statements**
- Monthly summary statements per partner
- Shows earnings, deductions, net pay

## System Functions

### Partner Functions

**`enroll_in_profit_network(partner_id, business_id)`**
- Creates enrollment
- Generates unique tracking link
- Sets up startup ad budget and payback

**`generate_profit_network_link_code(partner_id, business_id)`**
- Creates unique tracking code
- Format: PN-{partner}-{business}-{random}

### Sales Tracking

**`record_profit_network_sale(link_code, sale_amount_cents, product_name, ...)`**
- Records sale from tracking link
- Calculates commission with bonuses
- Links to partner and business
- Updates enrollment stats

### Reporting

**`get_partner_profit_network_weekly_summary(partner_id)`**
- Returns last 90 days of weekly summaries
- Shows sales, gross commission, deductions, net

## Integration with Existing Systems

### Business Dashboard Integration

The Business Dashboard (`/admin/business-dashboard`) shows:
- Profit Network as one of the business lines
- Total revenue from all Profit Network businesses combined
- Commission owed and paid
- Integration with other businesses (Marketplace, Paws Passport, Budget Buster, Academy)

### Commission Payout System

- Profit Network commissions flow through the standard commission ledger
- Integrated with daily automated payouts
- Partners see Profit Network earnings in `/partner/earnings`

## Partner Experience

### Viewing Available Businesses

Partners see:
- Business name and logo
- Category (e.g., Home Services, E-commerce, etc.)
- Base commission rate (25%)
- Active bonuses (if any)
- Total commission rate
- Description and website link
- "Apply Now" button (if not enrolled) or enrollment status

### Managing Active Enrollments

For each enrolled business, partners see:
- Unique tracking link with copy button
- Total sales count
- Revenue generated
- Total commission earned
- Total commission paid out
- Startup payback progress bar (if applicable)
- Free ad weeks remaining (during startup)
- Current daily ad spend setting

### Tracking Sales

Partners can view sales:
- **Weekly View**: Shows last 90 days by week
  - Total sales per week
  - Gross commission
  - Total deductions
  - Net received

- **Monthly View**: Detailed statements per month
  - Sales count
  - Gross commission
  - Itemized deductions (payback, ads, subscription)
  - Net commission
  - Payback progress

- **All Sales View**: Table of individual sales
  - Date
  - Business name
  - Product sold
  - Sale amount
  - Commission earned
  - Deductions applied
  - Net earned
  - Status (pending/approved/paid)

## Admin Management

### Adding Businesses

Admins can add new Profit Network businesses with:
- Name, description, logo
- Website URL
- Category
- Base commission rate (default 25%)
- Optional bonus rate (up to 10%)
- Bonus expiration date
- Active/inactive status

### Approving Enrollments

1. Partner submits enrollment
2. Admin reviews in admin panel
3. Admin approves → System generates tracking link
4. Partner receives notification
5. Partner can start sharing link

### Managing Bonuses

Admins can:
- Enable/disable bonuses per business
- Set bonus percentage (up to 10%)
- Set expiration dates
- See real-time impact on commission rates

### Viewing Partner Performance

Admins see for each partner:
- Total enrollments
- Sales per business
- Commission earned
- Payback status
- Ad spend settings
- Monthly statements

## Tracking and Attribution

### How Sales are Tracked

1. Partner shares tracking URL: `{business_url}?ref=PN-PARTNER-BUSINESS-ABC123`
2. Customer clicks link
3. Customer makes purchase on business website
4. Business website sends sale to Local-Link with ref code
5. System looks up enrollment by ref code
6. Sale is recorded with automatic commission calculation
7. Partner sees sale in their dashboard immediately

### Multi-Touch Attribution

- Last-click attribution model
- If customer clicks multiple partner links, last one gets credit
- 30-day cookie window (configurable)

## Financial Flow

### Revenue Flow
```
Customer Purchase → Business Website → Local-Link Marketplace
→ Commission Calculated → Deductions Applied → Partner Paid
```

### Payment Timing

- **Sales**: Recorded in real-time
- **Commission Calculation**: Immediate
- **Deductions**: Applied at payment time
- **Payouts**: Weekly, every Monday for previous week
- **Statements**: Generated end of each month

## Security & Compliance

### Data Protection
- RLS policies ensure partners only see their own data
- Admin access controlled through role checks
- Unique tracking codes prevent fraud
- All sales verified through business websites

### Commission Integrity
- Commission rates locked at time of sale
- Cannot be changed retroactively
- Audit trail maintained for all transactions
- Deductions calculated transparently

## Getting Started (Partner Guide)

### Step 1: Access Profit Network
- Go to Partner Playbooks page
- Scroll to bottom
- Click "View Available Businesses"

### Step 2: Choose Businesses
- Review available businesses
- Check commission rates and bonuses
- Click "Apply Now" for businesses you want

### Step 3: Get Approved
- Wait for admin approval (usually 24-48 hours)
- Receive email notification when approved
- Access your unique tracking link

### Step 4: Start Promoting
- Copy your tracking link
- Share on social media, email, website
- We handle all the ads ($20/day for first 8 weeks)
- Watch sales come in!

### Step 5: Get Paid
- View sales in real-time on your dashboard
- See weekly/monthly breakdowns
- Automatic weekly payments
- Download monthly statements

## Support Resources

### For Partners
- `/partner/profit-network` - Main dashboard
- `/partner/profit-network/sales` - Detailed sales tracking
- `/partner/earnings` - Overall commission earnings
- Partner Playbooks - Training materials

### For Admins
- `/admin/business-dashboard` - Financial overview
- `/admin/commission-payouts` - Payment management
- Commission ledger - Detailed transaction log

## Success Metrics

### Partner Success Indicators
- Number of active enrollments
- Total sales generated
- Average commission per sale
- Payback completion rate
- Ad spend ROI

### Business Success Indicators
- Total partners enrolled
- Sales volume per business
- Average sale size
- Partner satisfaction
- Revenue growth

## Future Enhancements

### Planned Features
- Mobile app for partners
- Real-time push notifications for sales
- Advanced analytics dashboard
- A/B testing for different businesses
- Automated partner recruiting
- Performance-based tier upgrades
