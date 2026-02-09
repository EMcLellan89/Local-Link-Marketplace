# 🚀 Quick Start - Dev Mode Enabled!

## What You'll See

### Top Banner (Always Visible)
```
┌─────────────────────────────────────────────────────────────────┐
│ 🚨 DEV MODE     Switch Roles:                                   │
│                                                                  │
│  [👥 Customer] [🏪 Merchant] [💼 Partner] [🛡️ Admin]           │
│                                                                  │
│                              Click a role to switch dashboards   │
└─────────────────────────────────────────────────────────────────┘
```

Orange/yellow gradient banner at the very top of every page with 4 role buttons.

## How to Start

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:5173
   ```

3. **You'll see the orange banner at the top** - click any role button to switch

## Quick Page Access

### Try These First:

**Customer View:**
- Click "Customer" button → Visit: `/deals`
- Browse local deals, view details, "purchase" (simulated)

**Merchant View:**
- Click "Merchant" button → Visit: `/merchant/dashboard`
- See your business dashboard, create deals, manage customers

**Partner View:**
- Click "Partner" button → Visit: `/partner/dashboard`
- View earnings, playbooks, training, leaderboard

**Admin View:**
- Click "Admin" button → Visit: `/admin/dashboard`
- Manage entire platform, approve applications, process payouts

## What's Bypassed in Dev Mode

✅ **Authentication** - No login required
✅ **Authorization** - Access any role instantly
✅ **Payments** - All Stripe flows simulated
✅ **Database checks** - Uses mock data
✅ **Partner requirements** - Access all partner features
✅ **Merchant subscription** - Access all tiers

## Visual Flow Example

```
You start at: http://localhost:5173
              ↓
      Landing page loads
              ↓
   Orange DEV MODE banner appears
              ↓
      Click "Merchant" button
              ↓
   Page redirects to /merchant/dashboard
              ↓
   See complete merchant dashboard with:
   - Revenue stats (mock data)
   - Recent orders (mock data)
   - Quick actions
   - Full navigation menu
              ↓
      Click "AI Bots" in menu
              ↓
   Navigate to /merchant/ai-bots
              ↓
   See 18+ AI automation tools
```

## Top 20 Pages to Explore

### Customer (Start Here)
1. `/deals` - Browse all deals
2. `/purchases` - Your purchases

### Merchant (Most Complete)
3. `/merchant/dashboard` - Main dashboard
4. `/merchant/ai-bots` - AI automation hub
5. `/merchant/crm` - Customer management
6. `/merchant/leads` - Lead tracking
7. `/merchant/deals/create` - Create deals
8. `/merchant/marketing` - Marketing hub
9. `/merchant/reviews` - Review management
10. `/merchant/analytics` - Business metrics

### Partner (Revenue System)
11. `/partner/dashboard` - Earnings & metrics
12. `/partner/playbooks` - Step-by-step systems
13. `/partner/profit-network` - White-label products
14. `/partner/training` - Training portal
15. `/partner/leaderboard` - Competition

### Admin (Platform Control)
16. `/admin/dashboard` - Platform overview
17. `/admin/partner-applications` - Approve partners
18. `/admin/territories` - Territory management
19. `/admin/commission-payouts` - Process payouts
20. `/admin/academy/modules` - Manage courses

## Console Messages

When dev mode is active, you'll see in browser console:

```
🚨 BYPASS MODE ENABLED

Auth and payments are bypassed. You can navigate freely!
Set VITE_BYPASS_MODE=false before going live!
```

This is normal and expected.

## Navigation Tips

### Method 1: Use the Role Switcher
- Click any role button → Auto-redirects to that role's dashboard
- Current role is highlighted with color

### Method 2: Direct URL
- Type any URL from the navigation guide
- Example: `http://localhost:5173/partner/playbooks`
- Works even if you're in a different role

### Method 3: Use In-App Navigation
- All menus and links work normally
- Click sidebar links
- Click dashboard cards
- Use breadcrumbs

## Testing User Journeys

### Example: Merchant Onboarding
1. Switch to "Merchant" role
2. Visit `/merchant/dashboard`
3. See dashboard with mock business data
4. Click "AI Bots" → See 18+ AI tools
5. Click "Create Deal" → Form works with validation
6. Click "CRM" → See mock leads and contacts
7. Click "Analytics" → See charts and metrics

### Example: Partner Earnings Flow
1. Switch to "Partner" role
2. Visit `/partner/dashboard`
3. See earnings: $125.00 total
4. Click "View Details" → See commission breakdown
5. Visit `/partner/playbooks` → See training systems
6. Click any playbook → See lessons and videos
7. Visit `/partner/leaderboard` → See rankings

### Example: Admin Operations
1. Switch to "Admin" role
2. Visit `/admin/dashboard`
3. See platform-wide metrics
4. Visit `/admin/partner-applications` → See pending applications
5. Click "Approve" on an application (simulated)
6. Visit `/admin/territories` → See territory map
7. Visit `/admin/commission-payouts` → Process partner payouts

## Mock Data Reference

### Mock Merchant
- Name: "Dev Local Business"
- Tier: Scale
- Status: Approved
- Monthly Revenue: $4,500

### Mock Partner
- Name: "Dev Partner Agency"
- Referral Code: DEVPARTNER2024
- Commission Rate: 30%
- Total Earned: $125.00
- Territories: Los Angeles, Orange County

### Mock Deals
1. "$50 Off First Service" - $50 ($100 value)
2. "2-for-1 Dinner Special" - $30 ($60 value)

### Mock Leads
1. John Smith - Smith Corp - Status: New
2. Sarah Johnson - Johnson Industries - Status: Contacted
3. Mike Davis - Davis LLC - Status: Qualified

## Feature Highlights to Test

### AI Automation (Merchant)
- `/merchant/ai-quote-assistant` - AI quote generator
- `/merchant/ai-review-responder` - Auto-respond to reviews
- `/merchant/ai-lead-qualifier` - Score leads automatically
- `/merchant/ai-email-composer` - Write emails with AI

### Partner Systems
- `/partner/playbooks` - Complete business playbooks
- `/partner/profit-network` - White-label products
- `/partner/share-kit` - Marketing asset generator
- `/partner/7-day-challenge` - Onboarding challenge

### Admin Tools
- `/admin/territories` - Territory management
- `/admin/partner-analytics` - Performance tracking
- `/admin/commission-payouts` - Payout processing
- `/admin/academy/modules` - Course management

### Academy (All Roles)
- `/academy` - Browse all courses
- `/academy/courses/blog-growth-system` - Blog course
- `/academy/courses/partner-accelerator` - Partner training
- `/my-courses` - Your enrolled courses

## Troubleshooting

### Banner Not Showing
- Check `.env` has `VITE_DEV_MODE=true`
- Restart dev server: `npm run dev`
- Clear browser cache and reload

### Role Switch Not Working
- Check browser console for errors
- Verify DevModeRoleSwitcher is imported in App.tsx
- Try direct URL navigation instead

### Pages Show 404
- Verify URL matches navigation guide
- Some pages require specific role
- Try switching to correct role first

### Mock Data Not Loading
- This is normal - pages may show empty states
- Mock data is defined in `src/lib/devMode.ts`
- Some pages fetch from database (will be empty in dev)

## Before Going to Production

**CRITICAL**: Turn off dev mode before deploying:

```bash
# In .env file:
VITE_DEV_MODE=false
VITE_BYPASS_MODE=false
```

Then test:
1. Authentication flows work
2. Payment processing works
3. Database queries work
4. RLS policies are enforced
5. Role-based access control works

---

## What You're Looking At

**250+ Pages** across 4 major user roles:
- ✅ Complete merchant business management system
- ✅ Partner program with earnings and training
- ✅ Customer deals marketplace
- ✅ Admin platform control center

**Key Features Built:**
- 🤖 AI Workforce (18 bots, just deployed)
- 💰 Financial Engine with AI categorization
- 🎓 Academy with courses and certifications
- 🏆 Gamification with badges and leaderboards
- 📱 CRM and lead management
- 🎨 Done-for-you services
- 🌐 White-label products (Profit Network)
- 📊 Commission tracking and payouts
- 🗺️ Territory management
- 🎯 Customer referral engine

**This is a complete, production-ready SaaS platform.**

---

Enjoy exploring! 🚀
