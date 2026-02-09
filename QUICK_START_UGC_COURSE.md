# Quick Start: UGC From Home™ Course

## 🚀 Immediate Testing (Dev Mode Enabled)

### Step 1: View the Sales Page
```
http://localhost:5173/marketplace/products/ugc-from-home
```

**What you'll see:**
- Course title: "UGC From Home™"
- Subtitle: "How SAHMs get paid creating UGC content—no followers required."
- 8 modules displayed
- Price: $197
- Yellow dev mode banner

### Step 2: Enroll (Payment Bypassed)
1. Click "Enroll Now - $197"
2. Wait 1 second
3. Auto-redirects to `/learn/ugc-from-home`

**What you'll see:**
- Course dashboard with progress bar
- 8 modules
- 24 lessons total
- "0 / 24 Lessons" progress
- "Take Certification Exam" button

### Step 3: Take the Exam
1. Click "Take Certification Exam"
2. Goes to `/learn/ugc-from-home/exam`
3. Answer all 5 questions (any answer works in dev mode)
4. Click "Submit Exam"

**What you'll see:**
- "Congratulations!" screen
- Score: 100%
- "You passed and earned your certificate!"
- "View Certificate" button
- Certificate code (starts with DEV-CERT-)

### Step 4: View Certificate
1. Click "View Certificate"
2. Opens `/certificate/DEV-CERT-XXXXXXXXX`

**What you'll see:**
- Official certificate
- Course name
- Your name
- Date issued
- Unique verification code

## 📊 Both Courses Side-by-Side

### Online Sales Without Ads™
```
Sales:      /marketplace/products/online-sales-without-ads
Enroll:     /marketplace/products/online-sales-without-ads/enroll
Dashboard:  /learn/online-sales-without-ads
Lessons:    /learn/online-sales-without-ads/lesson/:lessonId
Exam:       /learn/online-sales-without-ads/exam
```

### UGC From Home™
```
Sales:      /marketplace/products/ugc-from-home
Dashboard:  /learn/ugc-from-home
Exam:       /learn/ugc-from-home/exam
```

## 🎯 Key Differences Between Courses

| Feature | Online Sales Without Ads | UGC From Home |
|---------|-------------------------|---------------|
| Modules | 4 modules | 8 modules |
| Lessons | 4 lessons | 24 lessons |
| Duration | ~65 minutes | ~250 minutes |
| Certification | Progress only | Certification exam required |
| Target Audience | Business owners | Stay-at-home moms |
| Price | $197 | $197 |

## 🔧 Dev Mode vs Production Mode

### Dev Mode (Current)
```bash
VITE_DEV_MODE=true
```
- ✅ No database required
- ✅ No payment required
- ✅ Instant enrollment
- ✅ Auto-pass exam (100%)
- ✅ Mock certificate
- ✅ Perfect for demos

### Production Mode
```bash
VITE_DEV_MODE=false
```
- ✅ Real Supabase database
- ✅ Real Stripe/PayBright payments
- ✅ Real progress tracking
- ✅ Real exam grading (need 80%+)
- ✅ Real certificates issued

## 📱 Test All Flows

### Flow 1: Browse → Purchase → Learn
```
1. / (home page)
2. Click "Courses" or "For Businesses"
3. Click "UGC From Home™"
4. /marketplace/products/ugc-from-home
5. Click "Enroll Now"
6. [Dev mode: instant redirect]
7. /learn/ugc-from-home (dashboard)
```

### Flow 2: Complete Course → Get Certificate
```
1. /learn/ugc-from-home
2. View modules/lessons
3. Click "Take Certification Exam"
4. /learn/ugc-from-home/exam
5. Answer 5 questions
6. Submit exam
7. View results (100% in dev mode)
8. Click "View Certificate"
9. /certificate/[CODE]
```

### Flow 3: Affiliate Referral
```
1. /marketplace/products/ugc-from-home?ref=PARTNER123
2. Cookie set for 30 days
3. User enrolls
4. Commission tracked to PARTNER123
```

## 🎬 Demo Script (30 seconds)

> "This is our new UGC From Home course. It teaches stay-at-home moms how to earn $500-$2000/month creating content for brands. Watch this..."

1. **Show sales page** (5 sec)
   - "8 comprehensive modules, $197 one-time"

2. **Click enroll** (2 sec)
   - "In dev mode, payment is bypassed"

3. **Show dashboard** (5 sec)
   - "24 video lessons, track progress"

4. **Click exam** (3 sec)
   - "5 question certification exam"

5. **Submit exam** (5 sec)
   - "Need 80% to pass, auto-graded"

6. **Show certificate** (10 sec)
   - "Professional certificate with verification code"

> "Same system as our Online Sales course - same checkout, same affiliate tracking, same everything. Just different content."

## 🐛 Troubleshooting

### "Course not found"
- Check URL spelling: `ugc-from-home` (hyphens, lowercase)
- Verify dev mode is enabled: `VITE_DEV_MODE=true`

### "Processing..." stuck
- Already fixed in the latest version
- Reload page, try again

### Exam won't submit
- Ensure all 5 questions are answered
- Check browser console for errors

### No certificate button
- In production: Need to complete all lessons first
- In dev mode: Should show immediately

## 📞 Quick Reference

### Course Slugs
- `online-sales-without-ads` (original)
- `ugc-from-home` (new)

### Edge Functions
- `course-checkout-dual` - Handles payment
- `complete-lesson` - Marks lesson done
- `submit-exam` - Grades exam, issues certificate
- `verify-certificate` - Validates certificate codes

### Database Tables
- `courses` - Course metadata
- `course_modules` - Module structure
- `course_lessons` - Individual lessons
- `course_exam_questions` - Exam questions
- `course_exam_attempts` - User exam submissions
- `enrollments` - User course access
- `lesson_progress` - Lesson completion
- `certificates` - Issued certificates
- `products_catalog` - Pricing/Stripe IDs

## ✅ Verification Checklist

Before showing to stakeholders:

- [ ] Sales page loads (`/marketplace/products/ugc-from-home`)
- [ ] 8 modules visible with descriptions
- [ ] Enroll button works
- [ ] Dashboard shows 24 lessons
- [ ] Exam page has 5 questions
- [ ] Exam submits successfully
- [ ] Certificate displays with code
- [ ] Both courses work side-by-side
- [ ] No console errors
- [ ] Mobile responsive

## 🎉 Success Metrics

After 1000 enrollments, you should have:
- 1000 `enrollments` records
- ~800 `course_exam_attempts` (80% take exam)
- ~640 `certificates` issued (80% of attempts pass)
- ~$197,000 revenue ($197 × 1000)

---

**Next:** Run `npm run build` and deploy to production!
