# Local-Link Academy™ - Complete Navigation Map

## 🗺️ All Academy Routes

### Public Routes (No Login Required)

```
/academy
  └─ Academy Landing Page
     └─ Shows all 11 courses
     └─ Grouped: Tiered + Single SKU
     └─ Click course → /academy/:courseSlug

/academy/:courseSlug
  └─ Course Detail & Sales Page
     └─ Examples:
        ├─ /academy/local-customers-on-autopilot
        ├─ /academy/ugc-from-home
        ├─ /academy/ai-receptionist-missed-calls
        ├─ /academy/reviews-that-convert
        ├─ /academy/partner-accelerator
        ├─ /academy/selling-recurring-revenue
        ├─ /academy/marketing-for-trades
        ├─ /academy/pet-businesses-first
        ├─ /academy/care-coordination-for-families
        └─ /academy/local-service-side-hustle
     └─ Shows:
        ├─ Course overview
        ├─ Module list
        ├─ Tier selection (if tiered)
        └─ "Enroll Now" button
     └─ Click "Enroll Now" →
        ├─ Not logged in → /login?redirect=/academy/:courseSlug
        ├─ Dev mode → /learn/:courseSlug
        └─ Production → Stripe checkout

/academy/:courseSlug?ref=PARTNER123
  └─ Course Detail with Affiliate Tracking
     └─ Stores 30-day cookie
     └─ Tracks referral on enrollment

/certificate/:code
  └─ Certificate Display & Verification
     └─ Public access (no login)
     └─ Shows course completion certificate
     └─ Printable format
```

### Protected Routes (Login Required)

```
/learn
  └─ My Courses Dashboard
     └─ Shows all enrolled courses
     └─ Progress bars
     └─ "Continue" buttons
     └─ "Take Exam" buttons (when eligible)
     └─ Empty state if no enrollments
     └─ Click course → /learn/:courseSlug

/learn/:courseSlug
  └─ Generic Course Dashboard (NEW!)
     └─ Works with ANY course slug
     └─ Examples:
        ├─ /learn/local-customers-on-autopilot
        ├─ /learn/ugc-from-home
        ├─ /learn/ai-receptionist-missed-calls
        └─ ... (all 11 courses)
     └─ Shows:
        ├─ Progress tracker
        ├─ Module list
        ├─ Lesson list per module
        ├─ Certificate banner (if earned)
        └─ Exam CTA (if all lessons complete)
     └─ Click lesson → /learn/:courseSlug/lesson/:lessonId
     └─ Click "Take Exam" → /learn/:courseSlug/exam

/learn/online-sales-without-ads
  └─ Original Course Dashboard (Kept for compatibility)
     └─ Hardcoded for this specific course
     └─ Same functionality as generic
     └─ Click lesson → /learn/online-sales-without-ads/lesson/:lessonId

/learn/:courseSlug/lesson/:lessonId
  └─ Lesson Viewer
     └─ Works with ANY course + lesson
     └─ Shows:
        ├─ Video embed (if video_url set)
        ├─ Markdown content
        ├─ "Mark Complete" button
        ├─ Next/Previous navigation
        └─ Progress indicator
     └─ Tracks completion in lesson_progress table

/learn/:courseSlug/exam
  └─ Certification Exam
     └─ Works with ANY course
     └─ Examples:
        ├─ /learn/local-customers-on-autopilot/exam
        └─ /learn/ugc-from-home/exam
     └─ Shows:
        ├─ Multiple choice questions
        ├─ Submit button
        ├─ Pass/Fail result (80% required)
        └─ Certificate code on pass
     └─ Pass → Certificate issued
     └─ Fail → Can retake
```

---

## 🔀 Navigation Flows

### Flow 1: New User → Enrollment → Learning

```
1. User lands on homepage (/)
   └─ Clicks "Academy" in nav

2. Academy Landing (/academy)
   └─ Browses courses
   └─ Clicks "UGC From Home™"

3. Course Detail (/academy/ugc-from-home)
   └─ Reviews course content
   └─ Selects "Certified" tier ($197)
   └─ Clicks "Enroll Now"

4. Login Redirect (/login?redirect=/academy/ugc-from-home)
   └─ User logs in or registers
   └─ Returns to course detail

5. Checkout Flow
   └─ Dev Mode: Instant redirect to /learn/ugc-from-home
   └─ Production: Stripe checkout → webhook → enrollment

6. Course Dashboard (/learn/ugc-from-home)
   └─ Sees 8 modules, 24 lessons
   └─ Progress: 0% complete
   └─ Clicks first lesson

7. Lesson Viewer (/learn/ugc-from-home/lesson/:id)
   └─ Watches video
   └─ Clicks "Mark Complete"
   └─ Clicks "Next Lesson"

8. Complete All Lessons
   └─ Returns to course dashboard
   └─ Sees "Ready for Exam?" banner
   └─ Clicks "Take Exam"

9. Exam (/learn/ugc-from-home/exam)
   └─ Answers questions
   └─ Submits
   └─ Score: 85% (Pass!)
   └─ Certificate issued

10. Certificate (/certificate/ABC123DEF456)
    └─ Views certificate
    └─ Downloads/prints
    └─ Shares on LinkedIn
```

### Flow 2: Returning Student

```
1. User logs in
   └─ Navigates to /learn

2. My Courses Dashboard (/learn)
   └─ Sees enrolled courses with progress
   └─ Example: "UGC From Home™ - 33% Complete"
   └─ Clicks "Continue"

3. Course Dashboard (/learn/ugc-from-home)
   └─ Scrolls to next incomplete lesson
   └─ Clicks lesson

4. Resume Learning
   └─ Completes remaining lessons
   └─ Takes exam when ready
   └─ Earns certificate
```

### Flow 3: Affiliate Referral

```
1. Partner shares link
   └─ https://locallink.com/academy/ugc-from-home?ref=PARTNER123

2. Customer clicks link
   └─ Lands on /academy/ugc-from-home
   └─ Cookie stored: ll_course_ref=PARTNER123 (30 days)

3. Customer enrolls (within 30 days)
   └─ Completes checkout
   └─ Webhook creates:
      ├─ Enrollment record
      └─ Affiliate referral (40% commission)

4. Partner earns commission
   └─ Views in /affiliate portal
   └─ Gets paid monthly (min $50)
```

---

## 🎯 Key URLs by User Type

### For Customers
```
/academy                              → Browse courses
/academy/ugc-from-home                → View course details
/learn                                → My enrolled courses
/learn/ugc-from-home                  → Course dashboard
/learn/ugc-from-home/lesson/:id       → Watch lessons
/learn/ugc-from-home/exam             → Take exam
/certificate/:code                    → View certificate
```

### For Partners/Affiliates
```
/partner/apply                        → Become a partner
/partners                             → Partner dashboard
/academy/:courseSlug?ref=CODE         → Share with referral code
/affiliate                            → View earnings
```

### For Admins
```
/admin                                → Admin dashboard
/admin/partners                       → Manage partners
/admin/courses (future)               → Manage courses
```

---

## 🔐 Route Protection Summary

### Public Access ✅
- `/academy` - Course catalog
- `/academy/:courseSlug` - Course details
- `/certificate/:code` - Certificate viewing
- `/login`, `/register` - Auth pages

### Requires Login 🔒
- `/learn` - My courses
- `/learn/:courseSlug` - Course content
- `/learn/:courseSlug/lesson/:id` - Lessons
- `/learn/:courseSlug/exam` - Exams
- `/profile` - User profile
- `/affiliate` - Earnings

### Requires Enrollment 🎓
- `/learn/:courseSlug` - Must be enrolled in course
- `/learn/:courseSlug/lesson/:id` - Must be enrolled
- `/learn/:courseSlug/exam` - Must be enrolled + have exam_access

### Requires Admin Role 👑
- `/admin/*` - All admin pages

---

## 📱 Mobile-Friendly Routes

All routes are fully responsive:
- Academy catalog: Grid → Stack on mobile
- Course detail: Sidebar → Stack on mobile
- My Courses: Grid → Single column
- Course dashboard: Full-width modules
- Lesson viewer: Full-screen video

---

## 🎨 URL Structure Best Practices

### Followed Standards:
- ✅ Lowercase slugs
- ✅ Hyphens for multi-word (not underscores)
- ✅ Consistent naming convention
- ✅ Hierarchical structure
- ✅ RESTful patterns

### Examples:
```
Good: /academy/local-customers-on-autopilot
Bad:  /academy/Local_Customers_OnAutoPilot

Good: /learn/ugc-from-home/lesson/12345
Bad:  /course/UGC_From_Home/lessons/12345

Good: /certificate/ABC123
Bad:  /certs/abc-123-certificate
```

---

## 🔄 Redirects & Fallbacks

### Automatic Redirects:
- Not logged in + protected route → `/login?redirect=...`
- Enrolled + course slug → `/learn/:courseSlug`
- Course not found → `/academy`
- Not enrolled → `/academy/:courseSlug`
- Invalid certificate code → `/academy`

### Query Parameters:
- `?redirect=/path` - Return URL after login
- `?ref=CODE` - Affiliate referral code
- `?success=1` - Enrollment success flag

---

## 🧭 Breadcrumb Examples

```
Home → Academy
Home → Academy → UGC From Home™
Home → My Courses
Home → My Courses → UGC From Home™
Home → My Courses → UGC From Home™ → Lesson 1
Home → My Courses → UGC From Home™ → Exam
Home → Certificate
```

---

**Last Updated:** 2026-01-03
**Total Routes:** 20+ (dynamic with :courseSlug and :lessonId)
**Protected Routes:** 15+
**Public Routes:** 5+
