# Dev Mode Guide

## Overview

The entire Local-Link Marketplace platform is now operating in **DEV MODE**, which means you can access and build all features without requiring a live database connection. All data is mocked, and authentication is bypassed.

## Current Status

🚨 **DEV MODE IS ENABLED** - All database queries are bypassed with mock data.

### Latest Updates

✅ **Course Sales Page Fixed** - The "Processing..." issue has been resolved. The course sales page now:
- Loads mock course data instantly
- Bypasses payment when clicking "Enroll Now"
- Redirects directly to the course dashboard
- Shows a yellow dev mode banner indicating payment is bypassed

✅ **Video Content Added** - Each lesson now includes:
- Embedded YouTube videos (educational business/sales content)
- Comprehensive written lesson content with key takeaways
- Action items and exercises
- Full lesson navigation with previous/next buttons
- Mark as complete functionality

## What's Been Configured

### 1. **Core Dev Mode Setup**
- `src/lib/devMode.ts` - Central hub for all mock data
- Mock user authentication (auto-logged in as merchant)
- Mock data for deals, purchases, leads, invoices, reviews, etc.
- Dev mode warning displayed in browser console

### 2. **Pages with Dev Mode Support**

#### ✅ Completed
- **Merchant Dashboard** (`/merchant/dashboard`)
  - Mock stats for revenue, deals, leads
  - No database queries required

- **Course System**
  - **Course Sales Page** (`/marketplace/products/online-sales-without-ads`)
    - Mock course data with 4 modules
    - Click "Enroll Now" to bypass payment and access course
    - Shows dev mode banner
  - **Course Dashboard** (`/learn/online-sales-without-ads`)
    - 2 modules, 4 lessons with mock data
    - Track progress without database
    - Progress bar and completion tracking
  - **Lesson Viewer** (`/learn/online-sales-without-ads/lesson/:lessonId`)
    - **4 Complete Lessons with Videos:**
      1. Introduction to Sales Without Ads (12 min video)
      2. Understanding Your Customer (15 min video)
      3. Setting Up Your CRM (18 min video)
      4. Creating Your Outreach Strategy (20 min video)
    - Each lesson includes:
      - Embedded YouTube video player
      - Detailed written content with HTML formatting
      - Key takeaways and action items
      - Previous/Next navigation
      - Mark as complete button
  - **Course Enrollment** (`/marketplace/products/online-sales-without-ads/enroll`)
    - Form bypassed in dev mode
    - Redirects to course dashboard

- **Customer Deals Page** (`/deals`)
  - Browse mock deals
  - Toggle favorites without database
  - Filter by categories

#### 🔄 Needs Dev Mode (Still Queries Database)
- Partner Dashboard
- Admin Dashboard
- CRM Pages
- Analytics Pages
- Review Management
- Invoicing
- Most merchant service pages

## How to Use Dev Mode

### Enable Dev Mode
Your `.env` file should have:
```
VITE_DEV_MODE=true
```

### Disable Dev Mode (Production)
Before going live, set:
```
VITE_DEV_MODE=false
```

## Mock Data Available

### Authentication
- **User ID**: `dev-user-mock-id`
- **Role**: merchant
- **Email**: dev@local-link.com
- **Name**: Dev User

### Mock Deals
- "$50 Off First Service" - Services category
- "2-for-1 Dinner Special" - Restaurant category

### Mock Purchases
- 2 sample purchases with redemption codes

### Mock CRM Leads
- 3 leads (New, Contacted, Qualified status)

### Mock Invoices
- 2 invoices (Sent, Paid status)

### Mock AI Bots
- Facebook Messenger Bot
- Website Chat Assistant

### Mock Reviews
- 3 five-star reviews

## Adding Dev Mode to New Pages

When building a new page that queries the database, follow this pattern:

```typescript
import { DEV_MODE, MOCK_DEALS } from '../../lib/devMode';

async function fetchData() {
  // Check dev mode first
  if (DEV_MODE) {
    // Use mock data
    setData(MOCK_DEALS);
    setLoading(false);
    return;
  }

  // Regular database query
  const { data } = await supabase.from('deals').select('*');
  setData(data);
}
```

## Console Warning

When dev mode is enabled, you'll see this warning in the browser console:

```
🚨 DEV MODE ENABLED
All data is mocked. Database queries are bypassed.
Set VITE_DEV_MODE=false before going live!
```

## Next Steps for Full Dev Mode Coverage

To make the entire platform work in dev mode, you need to:

1. **Add dev mode checks to remaining pages** in these directories:
   - `src/pages/merchant/*` (CRM, Analytics, Marketing, etc.)
   - `src/pages/partner/*` (Dashboard, Analytics)
   - `src/pages/admin/*` (Dashboard, Applications)
   - `src/pages/customer/*` (Profile, Purchases, Favorites)

2. **Update `src/lib/devMode.ts`** with additional mock data as needed

3. **Pattern to follow**:
   ```typescript
   // At top of file
   import { DEV_MODE, MOCK_[DATA] } from '../../lib/devMode';

   // In fetch functions
   if (DEV_MODE) {
     // Mock response
     return;
   }
   // Real database query
   ```

## Testing Strategy

### In Dev Mode
1. Navigate through all pages
2. Test all user flows (customer, merchant, partner, admin)
3. Verify UI renders correctly with mock data
4. Test form submissions (they should log to console)
5. Ensure no database errors appear

### Before Production
1. Set `VITE_DEV_MODE=false`
2. Run `npm run build`
3. Test with real Supabase database
4. Verify all queries work
5. Test authentication flows
6. Verify RLS policies

## Benefits of Dev Mode

✅ **Build UI without database setup**
✅ **Test all flows independently**
✅ **Fast iteration without network calls**
✅ **Safe to demo without real data**
✅ **No accidental database modifications**

## Important Reminders

⚠️ **NEVER deploy with DEV_MODE=true**
⚠️ **Always test with real database before launch**
⚠️ **Dev mode is for development only**
⚠️ **Mock data is reset on page refresh**

## File Structure

```
src/
├── lib/
│   └── devMode.ts          # All mock data
├── contexts/
│   └── AuthContext.tsx     # Auth with dev mode
├── pages/
│   ├── merchant/
│   │   └── MerchantDashboard.tsx   # ✅ Has dev mode
│   ├── customer/
│   │   └── DealsPage.tsx           # ✅ Has dev mode
│   └── course/
│       ├── CourseDashboard.tsx      # ✅ Has dev mode
│       └── LessonViewer.tsx         # ✅ Has dev mode
└── main.tsx                # Shows dev mode warning
```

## Getting Help

If you encounter issues:
1. Check browser console for dev mode warning
2. Verify `VITE_DEV_MODE=true` in `.env`
3. Check that page has `DEV_MODE` check before database queries
4. Look at completed pages as examples

---

**Ready to build!** You can now work on any part of the platform without worrying about database setup. Just add dev mode support to pages as you build them out.
