# Local-Link Academy™ - Test URLs Quick Reference

## 🔗 All Test URLs

### Main Academy Page
```
/academy
```
**Shows:** All 11 courses with pricing

---

## 📚 Individual Course Detail Pages

### Tiered Courses (3 pricing options)

#### 1. Local Customers on Autopilot™
```
/academy/local-customers-on-autopilot
```
**Price:** $97 / $197 / $297

#### 2. UGC From Home™
```
/academy/ugc-from-home
```
**Price:** $97 / $197 / $297

---

### Single SKU Courses

#### 3. AI Receptionist: Never Miss a Call
```
/academy/ai-receptionist-missed-calls
```
**Price:** $49

#### 4. Reviews That Convert™
```
/academy/reviews-that-convert
```
**Price:** $49

#### 5. Partner Accelerator Program™
```
/academy/partner-accelerator
```
**Price:** $99

#### 6. Selling Recurring Revenue™
```
/academy/selling-recurring-revenue
```
**Price:** $49

#### 7. Marketing for Trades™
```
/academy/marketing-for-trades
```
**Price:** $49

#### 8. Pet Businesses First™
```
/academy/pet-businesses-first
```
**Price:** $49

#### 9. Care Coordination for Families™
```
/academy/care-coordination-for-families
```
**Price:** $49

#### 10. Local Service Side Hustle™
```
/academy/local-service-side-hustle
```
**Price:** $29

#### 11. Online Sales Without Ads™
```
/academy/online-sales-without-ads
```
**Price:** $97

---

## 🎓 Course Dashboard URLs (After Enrollment)

### Access Your Enrolled Courses

#### My Courses Overview
```
/learn
```
**Shows:** All enrolled courses with progress

#### Individual Course Dashboards
```
/learn/local-customers-on-autopilot
/learn/ugc-from-home
/learn/ai-receptionist-missed-calls
/learn/reviews-that-convert
/learn/partner-accelerator
/learn/selling-recurring-revenue
/learn/marketing-for-trades
/learn/pet-businesses-first
/learn/care-coordination-for-families
/learn/local-service-side-hustle
/learn/online-sales-without-ads
```

---

## 📖 Example Lesson URL
```
/learn/ugc-from-home/lesson/lesson-id-here
```

---

## 📝 Example Exam URL
```
/learn/ugc-from-home/exam
```

---

## 🏆 Certificate Example
```
/certificate/ABC123DEF456
```

---

## 🧪 Quick Test Sequence

### Test 1: Browse Academy
1. Navigate to: `/academy`
2. Verify: All 11 courses visible
3. Check: Prices display correctly

### Test 2: View Course Details
1. Click any course or visit: `/academy/ugc-from-home`
2. Verify: Course details load
3. Check: Tier selection (if tiered)
4. Check: Module list visible

### Test 3: Dev Mode Enrollment (Logged In)
1. Be logged in first
2. Click "Enroll Now" on: `/academy/ugc-from-home`
3. Verify: 1-second loading state
4. Check: Redirects to `/learn/ugc-from-home`
5. Verify: Course dashboard loads

### Test 4: Dev Mode Enrollment (Not Logged In)
1. Log out
2. Visit: `/academy/ugc-from-home`
3. Click "Enroll Now"
4. Verify: Redirects to `/login?redirect=/academy/ugc-from-home`
5. Log in
6. Verify: Returns to course page
7. Click "Enroll Now" again
8. Verify: Enrolls and redirects to course

### Test 5: Course Navigation
1. From: `/learn/ugc-from-home`
2. Click any lesson
3. Verify: Lesson viewer loads
4. Check: Video embed (if URL exists)
5. Test: "Mark Complete" button
6. Test: Next/Previous navigation

### Test 6: Affiliate Tracking
1. Visit: `/academy/ugc-from-home?ref=PARTNER123`
2. Check: Cookie stored in browser
3. Enroll in course
4. Verify: Referral tracked (check localStorage)

---

## 🎯 Navigation Shortcuts

### From Merchant Dashboard
```
Dashboard → Local-Link Academy (2nd menu item)
```

### From Main Nav
```
Header → Academy
```

### Direct Link
```
yourdomain.com/academy
```

---

## 🔐 Protected vs Public URLs

### Public (No Login Required)
- `/academy` - Course catalog
- `/academy/:courseSlug` - Course details
- `/certificate/:code` - Certificate viewing

### Protected (Login Required)
- `/learn` - My courses
- `/learn/:courseSlug` - Course content
- `/learn/:courseSlug/lesson/:id` - Lessons
- `/learn/:courseSlug/exam` - Exams

---

## 💡 Pro Tips

### Test with Query Parameters
```
# Affiliate tracking
/academy/ugc-from-home?ref=PARTNER123

# Post-enrollment success
/learn/ugc-from-home?success=1

# Login redirect
/login?redirect=/academy/ugc-from-home
```

### Check Console Logs
Open browser DevTools → Console tab
Look for:
```
"DEV MODE: Bypassing payment, redirecting to course"
```

### Verify Cookies
DevTools → Application → Cookies
Look for:
```
ll_course_ref = PARTNER123
```

---

## 📱 Mobile Testing URLs
All URLs work on mobile. Test responsive design:
- Academy grid → Stack
- Course detail sidebar → Stack
- Video player → Full width

---

## 🚀 Quick Copy-Paste Testing

### Full Test Script
```bash
# 1. Academy Landing
http://localhost:5173/academy

# 2. View Course Detail
http://localhost:5173/academy/ugc-from-home

# 3. With Affiliate Code
http://localhost:5173/academy/ugc-from-home?ref=TEST123

# 4. My Courses
http://localhost:5173/learn

# 5. Course Dashboard
http://localhost:5173/learn/ugc-from-home

# 6. Lesson (example)
http://localhost:5173/learn/ugc-from-home/lesson/lesson-id

# 7. Exam
http://localhost:5173/learn/ugc-from-home/exam

# 8. Certificate (example)
http://localhost:5173/certificate/ABC123
```

---

## 🔄 URL Patterns

### Pattern Reference
```
/academy                          → All courses
/academy/:courseSlug              → Course detail
/academy/:courseSlug?ref=CODE     → With affiliate
/learn                            → My courses
/learn/:courseSlug                → Course dashboard
/learn/:courseSlug/lesson/:id     → Lesson viewer
/learn/:courseSlug/exam           → Certification exam
/certificate/:code                → Certificate
```

---

**Last Updated:** 2026-01-03
**Total URLs:** 20+ (dynamic based on course slugs)
**Dev Server:** `npm run dev` → http://localhost:5173
**Production:** `npm run build` → dist/
