# Local-Link Academy™ - Quick Start Guide

## 🚀 Immediate Testing (Dev Mode)

### Step 1: Browse Academy
```
http://localhost:5173/academy
```

**What you'll see:**
- 11 courses total
- 2 tiered courses (Local Customers, UGC)
- 9 single-SKU courses
- Professional layout with course cards

### Step 2: View Course Detail
```
http://localhost:5173/academy/local-customers-on-autopilot
```

**What you'll see:**
- Course overview
- 5 modules with 15 lessons
- 3 tier options: Starter ($97), Certified ($197), Pro ($297)
- "Enroll Now" button

### Step 3: Enroll in Course (Dev Mode)
1. Select "Certified" tier
2. Click "Enroll Now"
3. Dev mode: Payment bypassed, instant redirect
4. Lands on `/learn/local-customers-on-autopilot`

### Step 4: View My Courses
```
http://localhost:5173/learn
```

**What you'll see:**
- All enrolled courses
- Progress bars
- "Continue" buttons
- "Take Exam" button (when eligible)

## 📊 All 11 Courses at a Glance

### Tiered Courses (3 SKUs Each)
1. **Local Customers on Autopilot™**
   - Starter: $97 | Certified: $197 ⭐ | Pro: $297
   - 5 modules, 15 lessons
   - Topics: Listing, Reviews, Loyalty, CRM

2. **UGC From Home™**
   - Starter: $97 | Certified: $197 ⭐ | Pro: $297
   - 8 modules, 24 lessons
   - Topics: Portfolio, Outreach, Pricing, Retainers

### Single SKU Courses
3. **AI Receptionist & Missed Call Recovery™** - $97 (4 modules)
4. **Reviews That Bring Customers In™** - $49 (4 modules)
5. **Local-Link Partner Accelerator™** - $197 (FREE for partners) (4 modules)
6. **Selling Recurring Revenue™** - $297 (4 modules)
7. **Marketing for Trades** - $197 (4 modules)
8. **Pet Businesses That Get Found First™** - $197 (4 modules)
9. **Care Coordination for Families™** - $97 (4 modules)
10. **Start a Local Service Side Hustle™** - $97 (4 modules)
11. **Online Sales Without Ads™** - $197 (4 modules) *(original)*

## 💰 Revenue Potential

### Example: 100 Students Per Course (1,100 Total)

**Conservative Mix:**
- 40% buy Starter/Single ($97 avg) = 440 × $97 = $42,680
- 40% buy Certified ($197) = 440 × $197 = $86,680
- 20% buy Pro ($297) = 220 × $297 = $65,340

**Total Revenue:** $194,700

**With Affiliates (30% avg):**
- Affiliate Payouts: $58,410
- Net Revenue: $136,290

## 🔗 Affiliate System

### How It Works
1. Partner shares: `https://locallink.com/academy/ugc-from-home?ref=PARTNER123`
2. Cookie stored for 30 days
3. Customer enrolls
4. Partner earns commission:
   - **40%** for first 60 days (launch)
   - **30%** after 60 days (evergreen)
5. Payout monthly (minimum $50)

### Example Earnings
- 10 sales × $197 (UGC Certified) = $1,970 gross
- 40% commission = **$788** in month 1
- 30% commission = **$591** ongoing

## 📱 Key URLs

### Public Pages
```
/academy                                  → Course catalog
/academy/local-customers-on-autopilot     → Course detail
/academy/ugc-from-home?ref=PARTNER123     → With referral code
```

### Protected Pages (Require Login)
```
/learn                                    → My Courses
/learn/local-customers-on-autopilot       → Course dashboard
/learn/ugc-from-home/exam                 → Certification exam
/certificate/ABC123DEF456                 → Certificate view
/affiliate                                → Affiliate portal
```

## 🎯 Entitlements

### What Each Tier Includes

**Starter ($97)**
- ✅ Course access
- ❌ No exam
- ❌ No badge
- ❌ No premium features

**Certified ($197)** ⭐ RECOMMENDED
- ✅ Course access
- ✅ Certification exam
- ✅ Digital badge
- ❌ No premium features

**Pro ($297)**
- ✅ Course access
- ✅ Certification exam
- ✅ Digital badge
- ✅ Featured listing boost (LCA) OR Templates + Creator listing (UGC)

## 🛠️ Before Going Live

### 1. Create Stripe Products (Required)
For each of the 14 SKUs, create a Stripe product and price:

```
lca-starter          → price_lca_starter_97
lca-certified        → price_lca_certified_197
lca-pro              → price_lca_pro_297
ugc-starter          → price_ugc_starter_97
ugc-certified        → price_ugc_certified_197
ugc-pro              → price_ugc_pro_297
ai-receptionist-course     → price_ai_receptionist_97
reviews-course             → price_reviews_49
partner-accelerator        → price_partner_accelerator_197
recurring-revenue-course   → price_recurring_revenue_297
trades-marketing-course    → price_trades_marketing_197
pet-business-course        → price_pet_business_197
care-coordination-course   → price_care_coordination_97
side-hustle-course         → price_side_hustle_97
```

### 2. Update Database
```sql
UPDATE products_catalog
SET stripe_price_id = 'price_lca_starter_97'
WHERE slug = 'lca-starter';

-- Repeat for all 14 products
```

### 3. Disable Dev Mode
```bash
# .env
VITE_DEV_MODE=false
```

### 4. Add Course Content
- Upload videos to YouTube/Vimeo
- Update `course_lessons.video_url`
- Add markdown content to `course_lessons.content_md`
- Create downloadable resources

## 🧪 Testing Checklist

### Catalog & Navigation
- [ ] `/academy` loads all 11 courses
- [ ] Tiered courses show 3 options
- [ ] Single courses show price
- [ ] Course cards are clickable

### Course Detail
- [ ] `/academy/local-customers-on-autopilot` shows course info
- [ ] Module list displays correctly
- [ ] Tier selection works (radio buttons)
- [ ] Price updates when tier changes
- [ ] "Enroll Now" button works

### Enrollment Flow
- [ ] Clicking "Enroll Now" redirects to course dashboard (dev mode)
- [ ] Course appears in My Courses (`/learn`)
- [ ] Progress tracking works
- [ ] Can click "Continue" to resume

### Exam & Certificate
- [ ] `/learn/ugc-from-home/exam` shows questions
- [ ] Can submit answers
- [ ] See pass/fail result
- [ ] Certificate issued if passed + lessons complete
- [ ] `/certificate/CODE` displays certificate

### Affiliate System
- [ ] `?ref=PARTNER123` stores cookie
- [ ] Cookie persists 30 days
- [ ] Referral tracked on enrollment (check database)

## 📈 Success Metrics

### Track These KPIs

**Enrollment Metrics**
- Course enrollment conversion rate
- Most popular course
- Most popular tier (Starter vs Certified vs Pro)
- Average order value

**Engagement Metrics**
- Course completion rate
- Lesson completion rate
- Exam pass rate
- Certificate issuance rate

**Revenue Metrics**
- Total revenue per course
- Revenue per customer
- Affiliate-driven revenue %
- Affiliate payout amounts

**Affiliate Metrics**
- Active affiliates
- Referrals per affiliate
- Conversion rate per affiliate
- Average commission earned

## 🆘 Troubleshooting

### "Course not found" Error
- Verify course slug in database: `SELECT * FROM courses WHERE slug = 'course-slug';`
- Check if course is published: `is_published = true`

### "No products found" Error
- Verify product mapping: `SELECT * FROM products_catalog WHERE metadata->>'course_slug' = 'course-slug';`
- Check if products are active: `is_active = true`

### Enrollment Not Working
- Check if dev mode is enabled: `VITE_DEV_MODE=true`
- Verify Stripe webhook is configured (production only)
- Check browser console for errors

### Affiliate Cookie Not Tracking
- Verify referral code exists: `SELECT * FROM affiliate_partners WHERE code = 'CODE';`
- Check browser cookies (should see `ll_course_ref`)
- Verify cookie hasn't expired (30 days)

## 💡 Pro Tips

1. **Start with 2-3 courses** and fully flesh them out before launching all 11
2. **Price Certified tier as the best value** (most will choose this)
3. **Use affiliate program aggressively** - 40% launch rate drives viral growth
4. **Create course completion challenges** - gamification increases engagement
5. **Offer bundle deals** - Buy 3 courses, get 20% off
6. **Run limited-time promotions** - Launch sales, holiday discounts
7. **Partner with influencers** - Give them 50% commission for first 90 days

## 🎉 Launch Strategy

### Week 1: Beta Launch
- Enroll 10-20 beta testers for free
- Get feedback on content and UX
- Fix bugs and improve content

### Week 2-3: Early Bird Launch
- 20% off all courses for early adopters
- Launch affiliate program (50% commission first month)
- Email existing customer base

### Week 4+: Public Launch
- Full price, standard 40% affiliate commission
- Run paid ads if budget allows
- Content marketing (blog posts, YouTube videos)

---

**Next Step:** Set `VITE_DEV_MODE=false` and configure Stripe to go live!
