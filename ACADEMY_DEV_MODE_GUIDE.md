# Local-Link Academy™ - Dev Mode Guide

## ✅ Setup Complete!

All 11 courses are now live in the navigation and ready for development testing.

---

## 🎯 Quick Access

### Navigation Update
**Menu Item Changed:**
- ❌ Old: "Sales Training Course"
- ✅ New: **"Local-Link Academy"** (with NEW badge)

**Location in Menu:**
- Merchant Dashboard → Second item
- Partner Dashboard → Available in main nav
- Customer Portal → Accessible via header

**Route:** `/academy`

---

## 📚 All 11 Courses Available

### Tiered Courses (3 pricing tiers each)
1. **Local Customers on Autopilot™** - $97 / $197 / $297
   - Slug: `local-customers-on-autopilot`
   - Master the Local-Link platform

2. **UGC From Home™** - $97 / $197 / $297
   - Slug: `ugc-from-home`
   - SAHM income creating content (no followers needed)

### Single SKU Courses
3. **AI Receptionist: Never Miss a Call** - $49
   - Slug: `ai-receptionist-missed-calls`

4. **Reviews That Convert™** - $49
   - Slug: `reviews-that-convert`

5. **Partner Accelerator Program™** - $99
   - Slug: `partner-accelerator`

6. **Selling Recurring Revenue™** - $49
   - Slug: `selling-recurring-revenue`

7. **Marketing for Trades™** - $49
   - Slug: `marketing-for-trades`

8. **Pet Businesses First™** - $49
   - Slug: `pet-businesses-first`

9. **Care Coordination for Families™** - $49
   - Slug: `care-coordination-for-families`

10. **Local Service Side Hustle™** - $29
    - Slug: `local-service-side-hustle`

11. **Online Sales Without Ads™** - $97
    - Slug: `online-sales-without-ads`

---

## 🛠️ Dev Mode Features

### Automatic Payment Bypass
When `VITE_DEV_MODE=true`:
- ✅ No Stripe checkout required
- ✅ Instant enrollment on "Enroll Now" click
- ✅ Redirects directly to course dashboard
- ✅ 1-second delay for UX (simulated processing)
- ✅ All courses unlock immediately

### Dev Mode Console Messages
Look for: `"DEV MODE: Bypassing payment, redirecting to course"`

---

## 🔄 User Flow (Dev Mode)

### 1. Browse Academy
```
Click "Local-Link Academy" in nav
↓
/academy landing page
↓
See all 11 courses with prices
```

### 2. Select Course
```
Click any course card
↓
/academy/:courseSlug (e.g., /academy/ugc-from-home)
↓
See course details, modules, tier options
```

### 3. Enroll (Dev Mode)
```
Select tier (if tiered course)
↓
Click "Enroll Now"
↓
Check if logged in:
  - Not logged in → Redirect to /login
  - Logged in → Continue
↓
DEV MODE: Skip Stripe checkout
↓
Redirect to /learn/:courseSlug
↓
Course dashboard loads with mock data
```

### 4. Access Course
```
/learn/:courseSlug
↓
See modules and lessons
↓
Click lesson → /learn/:courseSlug/lesson/:id
↓
Watch video, mark complete
↓
Complete all → Take exam
↓
Pass exam → Get certificate
```

---

## 🔐 Authentication Flow

### Not Logged In
```
Click "Enroll Now"
↓
Redirect: /login?redirect=/academy/:courseSlug
↓
User logs in or registers
↓
Auto-return to course detail page
↓
Click "Enroll Now" again
↓
(Dev mode) → Instant enrollment
```

### Already Logged In
```
Click "Enroll Now"
↓
(Dev mode) → Instant enrollment
↓
Redirect to /learn/:courseSlug
```

---

## 💳 Stripe Integration (Production Mode)

### When Dev Mode is OFF
```
Click "Enroll Now"
↓
Call: /functions/v1/course-checkout-dual
↓
Request body:
{
  "productSlug": "lca-certified",
  "affiliateCode": "PARTNER123" (if exists),
  "preferredProvider": "stripe"
}
↓
Response: { "url": "https://checkout.stripe.com/..." }
↓
Redirect to Stripe checkout page
↓
User completes payment
↓
Stripe webhook triggers enrollment
↓
Redirect: /learn/:courseSlug?success=1
```

### Webhook Flow
```
Stripe sends payment confirmation
↓
Edge function: subscription-payment-webhook
↓
Creates enrollment record
↓
Creates affiliate referral (if ref code exists)
↓
Sends welcome email
↓
User can access course
```

---

## 🧪 Testing Checklist

### Dev Mode Testing (No Stripe Required)

#### 1. Navigation
- [ ] Click "Local-Link Academy" in merchant menu
- [ ] Academy landing page loads
- [ ] All 11 courses display
- [ ] Prices show correctly

#### 2. Course Cards
- [ ] Click "Local Customers on Autopilot™"
- [ ] Detail page loads
- [ ] See 3 tier options
- [ ] Module list visible

#### 3. Enrollment (Logged Out)
- [ ] Click "Enroll Now" (not logged in)
- [ ] Redirects to /login
- [ ] After login, returns to course page
- [ ] Click "Enroll Now" again
- [ ] Dev mode message in console
- [ ] Redirects to /learn/course-slug

#### 4. Enrollment (Logged In)
- [ ] Already logged in
- [ ] Click "Enroll Now"
- [ ] 1-second loading state
- [ ] Redirects to course dashboard
- [ ] Mock modules and lessons show

#### 5. Course Access
- [ ] Course dashboard shows progress bar
- [ ] Modules list displays
- [ ] Click lesson → Lesson viewer loads
- [ ] Video embed visible (if URL set)
- [ ] "Mark Complete" button works

#### 6. All Courses
- [ ] Test each of the 11 courses
- [ ] Verify pricing displays correctly
- [ ] Ensure images load
- [ ] Check tier selection (for tiered courses)

---

## 🚀 Going Live (Production Mode)

### Before Launch Checklist

#### 1. Environment Variables
```bash
# .env file
VITE_DEV_MODE=false  # ← CHANGE THIS!
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### 2. Stripe Setup
- [ ] Create 14 products in Stripe (2 tiered × 3 tiers + 9 single)
- [ ] Get price IDs for each SKU
- [ ] Update database:
```sql
UPDATE products_catalog
SET stripe_price_id = 'price_xxxxx'
WHERE slug = 'lca-starter';
-- Repeat for all 14 products
```

#### 3. Webhook Configuration
- [ ] Add Stripe webhook endpoint: `/functions/v1/subscription-payment-webhook`
- [ ] Select events: `checkout.session.completed`
- [ ] Get signing secret
- [ ] Add to Supabase secrets

#### 4. Database
- [ ] Verify all 11 courses exist in `courses` table
- [ ] Verify all 14 products in `products_catalog`
- [ ] Check `course_modules` and `course_lessons` tables
- [ ] Ensure RLS policies enabled

#### 5. Content
- [ ] Upload course videos
- [ ] Update `course_lessons.video_url` columns
- [ ] Add lesson markdown content
- [ ] Create exam questions (for certified courses)

#### 6. Final Tests
- [ ] Set `VITE_DEV_MODE=false`
- [ ] Test full Stripe checkout flow
- [ ] Verify webhook creates enrollment
- [ ] Check affiliate tracking
- [ ] Test certificate generation

---

## 🎨 Customization

### Change Course Images
Update the `image_url` in the course object (dev mode) or database (production):
```typescript
image_url: 'https://images.pexels.com/photos/...'
```

### Update Pricing
Dev mode: Edit `AcademyLanding.tsx` → `loadDevModeCourses()`
```typescript
price_cents: 9700  // = $97.00
```

Production: Update database:
```sql
UPDATE products_catalog
SET price_cents = 9700
WHERE slug = 'lca-starter';
```

### Add New Course
1. Add to dev mode mock data in `AcademyLanding.tsx`
2. Add to database (production):
```sql
INSERT INTO courses (slug, title, subtitle, description, image_url)
VALUES ('new-course', 'New Course™', 'Subtitle', 'Description', 'image-url');
```

---

## 🐛 Troubleshooting

### "Course not found" error
**Cause:** Slug mismatch or course doesn't exist
**Fix:**
```sql
SELECT * FROM courses WHERE slug = 'course-slug';
```

### Enrollment button not working
**Check:**
1. Console for errors
2. Dev mode enabled? Check `.env`
3. User logged in?
4. Network tab for API calls

### Images not loading
**Fix:** Use valid Pexels URLs or update image URLs

### Stuck on loading
**Check:**
1. Database connection
2. Supabase URL in `.env`
3. Course exists in database
4. Console for errors

---

## 📊 Database Schema Quick Reference

### Key Tables
```sql
-- Courses
courses (id, slug, title, subtitle, description, image_url)

-- Products (SKUs)
products_catalog (slug, title, price_cents, stripe_price_id, metadata)

-- Enrollments
enrollments (user_id, course_id, status, enrolled_at)

-- Modules
course_modules (course_id, module_index, title, description)

-- Lessons
course_lessons (module_id, lesson_index, title, video_url, content_md)

-- Progress Tracking
lesson_progress (user_id, lesson_id, completed, completed_at)

-- Certificates
certificates (user_id, course_id, certificate_code, issued_at)

-- Affiliate Tracking
affiliate_referrals (referral_code, course_slug, commission_cents)
```

---

## 💰 Revenue Projections

### Monthly Revenue Potential

**Conservative (10 enrollments/month per course):**
- 2 tiered courses × 10 × $197 avg = $3,940
- 9 single courses × 10 × $49 avg = $4,410
- **Total: $8,350/month**

**Moderate (50 enrollments/month per course):**
- 2 tiered × 50 × $197 = $19,700
- 9 single × 50 × $49 = $22,050
- **Total: $41,750/month**

**Optimistic (100 enrollments/month per course):**
- 2 tiered × 100 × $197 = $39,400
- 9 single × 100 × $49 = $44,100
- **Total: $83,500/month = $1,002,000/year**

### Affiliate Program Impact
- 40% commission on course sales
- Partner refers 10 students/month → $788/month per partner
- 100 active partners → $78,800/month in commissions
- Your net: $125,250/month

---

## 🎓 Next Steps

### Immediate (Dev Mode Testing)
1. Click "Local-Link Academy" in nav
2. Browse all 11 courses
3. Click through to course details
4. Test enrollment flow
5. Verify course dashboard loads
6. Check lesson viewer

### Short Term (Content Creation)
1. Record course videos
2. Write lesson content
3. Create exam questions
4. Design certificates
5. Build out modules

### Long Term (Launch & Scale)
1. Switch to production mode
2. Set up Stripe products
3. Configure webhooks
4. Launch marketing campaign
5. Recruit affiliates
6. Monitor enrollments

---

**Last Updated:** 2026-01-03
**Dev Mode:** ✅ ACTIVE
**Courses Live:** 11
**Total SKUs:** 14
**Build Status:** ✅ PASSING
