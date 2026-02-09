# Marketing for Trades™ — Complete Route + Component Specification

**Purpose:** Full implementation spec for Bolt.new developer (front → checkout → course → exam → certificate → admin)

**Course Details:**
- Slug: `marketing-for-trades`
- Title: Marketing for Trades™
- Price: $197 ($19,700 cents)
- 5 modules / 25 lessons
- Certification exam: 25 questions, 80% passing score

---

## 1. PUBLIC ROUTES (Pre-Purchase)

### Route: `/academy`

**Purpose:** Course catalog landing page showing all available courses

**Component:** `AcademyLanding.tsx`

**Auth:** Public (no login required)

**Supabase Queries:**
```typescript
// Fetch all published courses
const { data: courses } = await supabase
  .from('courses')
  .select('id, slug, title, subtitle, description, image_url, is_published')
  .eq('is_published', true)
  .order('created_at', { ascending: false });
```

**UI Elements:**
- Hero section with "Local-Link Academy" branding
- Course grid with filters (Free, One-time, Subscription)
- Each course card shows:
  - Course image
  - Title + subtitle
  - Short description
  - Price
  - "Learn More" CTA → navigates to `/academy/{course-slug}`

**Key Features:**
- Search/filter by category
- Sort by newest, price, popularity
- "Sign in" link in header
- "Get Started" for courses you don't own → sales page
- "Continue Learning" for enrolled courses → course dashboard

---

### Route: `/academy/marketing-for-trades`

**Purpose:** Sales page for Marketing for Trades™ course

**Component:** `MarketingForTradesSalesPage.tsx` (or generic `CourseSalesPage.tsx` with slug param)

**Auth:** Public

**Supabase Queries:**
```typescript
// Fetch course details
const { data: course } = await supabase
  .from('courses')
  .select('*')
  .eq('slug', 'marketing-for-trades')
  .single();

// Fetch modules
const { data: modules } = await supabase
  .from('course_modules')
  .select('id, module_index, title, description')
  .eq('course_id', course.id)
  .order('module_index');

// Fetch lesson count per module
const { data: lessons } = await supabase
  .from('course_lessons')
  .select('id, module_id, lesson_index, title, is_preview')
  .in('module_id', modules.map(m => m.id))
  .order('lesson_index');

// If user is logged in, check enrollment
const { data: enrollment } = await supabase
  .from('course_enrollments')
  .select('id')
  .eq('user_id', user.id)
  .eq('course_id', course.id)
  .maybeSingle();
```

**UI Sections:**
1. **Hero**
   - Course title + subtitle
   - Price: $197
   - Primary CTA: "Enroll Now" → `/checkout?product=marketing-for-trades&partner_code={optional}`
   - Secondary CTA: "Preview Free Lesson"

2. **What You'll Learn** (primary_outcomes from course table)
   - 4 key outcomes displayed as checklist

3. **Course Curriculum** (collapsible module list)
   - 5 modules shown
   - Each module shows lesson titles
   - Lock icon on paid lessons
   - "Preview" badge on lesson 1

4. **Instructor Bio** (optional)

5. **FAQ Section**
   - How long do I have access?
   - What if I'm not satisfied?
   - Do I get a certificate?

6. **Final CTA**
   - "Start Learning Today - $197"

**Logic:**
```typescript
// Check if user already enrolled
if (enrollment) {
  // Show "Go to Course Dashboard" button instead of "Enroll Now"
  navigate(`/learn/marketing-for-trades`);
}

// Handle partner code in URL
const searchParams = new URLSearchParams(location.search);
const partnerCode = searchParams.get('partner_code');
if (partnerCode) {
  // Store in session or pass to checkout
  sessionStorage.setItem('partner_code', partnerCode);
}
```

---

## 2. CHECKOUT FLOW

### Route: `/checkout?product=marketing-for-trades&partner_code=ABC123`

**Purpose:** Initialize Stripe Checkout session and redirect to Stripe

**Component:** `CourseCheckout.tsx`

**Auth:** Required (redirect to `/login` with return URL)

**Supabase Queries:**
```typescript
// Verify user is logged in
const { data: { user } } = await supabase.auth.getUser();

// Fetch course price
const { data: course } = await supabase
  .from('courses')
  .select('slug, title, price_cents')
  .eq('slug', productSlug)
  .single();

// Check if user already enrolled (prevent double purchase)
const { data: existingEnrollment } = await supabase
  .from('course_enrollments')
  .select('id')
  .eq('user_id', user.id)
  .eq('course_slug', productSlug)
  .maybeSingle();

if (existingEnrollment) {
  // Redirect to course dashboard
  navigate(`/learn/${productSlug}`);
  return;
}
```

**Stripe Integration:**
```typescript
// Call your edge function or API to create Stripe Checkout Session
const response = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout-session`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    product_slug: 'marketing-for-trades',
    partner_code: partnerCode, // from URL or sessionStorage
    success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${window.location.origin}/academy/marketing-for-trades`
  })
});

const { sessionId } = await response.json();

// Redirect to Stripe Checkout
const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
await stripe.redirectToCheckout({ sessionId });
```

---

### Route: `/checkout/success?session_id={stripe_session_id}`

**Purpose:** Post-payment confirmation page

**Component:** `CourseCheckoutSuccess.tsx`

**Auth:** Required

**Supabase Queries:**
```typescript
// Verify session ID with Stripe (via edge function)
const response = await fetch(`${SUPABASE_URL}/functions/v1/verify-checkout-session`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ session_id: sessionId })
});

const { status, product_slug } = await response.json();

if (status === 'paid') {
  // Check enrollment (webhook should have created it)
  const { data: enrollment } = await supabase
    .from('course_enrollments')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_slug', product_slug)
    .maybeSingle();
}
```

**UI:**
- Success message: "Welcome to Marketing for Trades™!"
- Order confirmation number
- "What's Next" section
- Primary CTA: "Start Course" → `/learn/marketing-for-trades`
- Receipt sent to email

**Note:** Webhook handles:
- Creating `course_enrollments` record
- Creating `user_entitlements` record
- Recording `affiliate_referrals` if partner_code present
- Sending confirmation email

---

## 3. STUDENT EXPERIENCE (Post-Purchase)

### Route: `/learn`

**Purpose:** Student dashboard showing all enrolled courses

**Component:** `MyCourses.tsx`

**Auth:** Required

**Supabase Queries:**
```typescript
// Fetch user's enrolled courses
const { data: enrollments } = await supabase
  .from('course_enrollments')
  .select(`
    id,
    enrolled_at,
    course:course_id (
      slug,
      title,
      subtitle,
      description,
      image_url
    )
  `)
  .eq('user_id', user.id)
  .order('enrolled_at', { ascending: false });

// For each course, get progress
for (const enrollment of enrollments) {
  const courseSlug = enrollment.course.slug;

  // Get total lessons
  const { count: totalLessons } = await supabase
    .from('course_lessons')
    .select('id', { count: 'exact', head: true })
    .eq('course_slug', courseSlug);

  // Get completed lessons
  const { count: completedLessons } = await supabase
    .from('lesson_progress')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('course_slug', courseSlug)
    .eq('completed', true);

  enrollment.progress = (completedLessons / totalLessons) * 100;
}
```

**UI:**
- Grid of enrolled course cards
- Each card shows:
  - Course image
  - Title
  - Progress bar (% complete)
  - "Continue" or "Start Course" button
  - Certificate badge if exam passed

---

### Route: `/learn/marketing-for-trades`

**Purpose:** Course dashboard (module/lesson overview)

**Component:** `CourseDashboard.tsx` or `MarketingForTradesCourseDashboard.tsx`

**Auth:** Required + Enrolled

**Auth Guard:**
```typescript
// Check enrollment
const { data: enrollment } = await supabase
  .from('course_enrollments')
  .select('id')
  .eq('user_id', user.id)
  .eq('course_slug', 'marketing-for-trades')
  .maybeSingle();

if (!enrollment) {
  // Redirect to sales page
  navigate('/academy/marketing-for-trades');
  return;
}
```

**Supabase Queries:**
```typescript
// Fetch course
const { data: course } = await supabase
  .from('courses')
  .select('*')
  .eq('slug', 'marketing-for-trades')
  .single();

// Fetch modules
const { data: modules } = await supabase
  .from('course_modules')
  .select('*')
  .eq('course_id', course.id)
  .order('module_index');

// Fetch lessons with progress
const { data: lessons } = await supabase
  .from('course_lessons')
  .select(`
    id,
    module_id,
    lesson_index,
    title,
    video_duration_minutes
  `)
  .in('module_id', modules.map(m => m.id))
  .order('lesson_index');

// Fetch user's progress
const { data: progress } = await supabase
  .from('lesson_progress')
  .select('lesson_slug, completed')
  .eq('user_id', user.id)
  .eq('course_slug', 'marketing-for-trades');

// Map progress to lessons
const progressMap = new Map(progress.map(p => [p.lesson_slug, p.completed]));

// Check if exam is unlocked (all lessons complete)
const allLessonsComplete = lessons.every(l => progressMap.get(l.slug));

// Check if exam passed
const { data: examAttempt } = await supabase
  .from('course_exam_attempts')
  .select('id, score, passed')
  .eq('user_id', user.id)
  .eq('course_slug', 'marketing-for-trades')
  .eq('passed', true)
  .maybeSingle();
```

**UI:**
- Course header (title, your progress %)
- Module accordion list
  - Each module shows:
    - Module title
    - Lesson list with checkmarks for completed
    - Duration estimates
    - "Continue" or "Start" button for next incomplete lesson
- Bottom section:
  - "Take Final Exam" button (locked until all lessons complete)
  - "View Certificate" button (visible if exam passed)

**Navigation:**
- Click lesson → `/learn/marketing-for-trades/lesson/{lesson-slug}`
- Click "Take Exam" → `/learn/marketing-for-trades/exam`
- Click "View Certificate" → `/certificate/{certificate-code}`

---

### Route: `/learn/marketing-for-trades/lesson/{lesson-slug}`

**Purpose:** Individual lesson viewer

**Component:** `LessonViewer.tsx`

**Auth:** Required + Enrolled

**Supabase Queries:**
```typescript
// Fetch lesson
const { data: lesson } = await supabase
  .from('course_lessons')
  .select(`
    *,
    module:module_id (
      module_index,
      title
    )
  `)
  .eq('course_slug', 'marketing-for-trades')
  .eq('slug', lessonSlug)
  .single();

// Fetch user progress for this lesson
const { data: progress } = await supabase
  .from('lesson_progress')
  .select('completed, completed_at')
  .eq('user_id', user.id)
  .eq('course_slug', 'marketing-for-trades')
  .eq('lesson_slug', lessonSlug)
  .maybeSingle();

// Fetch all lessons for navigation
const { data: allLessons } = await supabase
  .from('course_lessons')
  .select('slug, lesson_index, title')
  .eq('course_slug', 'marketing-for-trades')
  .order('lesson_index');

// Determine prev/next
const currentIndex = allLessons.findIndex(l => l.slug === lessonSlug);
const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
```

**Content Rendering:**
```typescript
// lesson.content_md is markdown string
// Parse and render as HTML with syntax highlighting

// OR if using structured JSON (lesson.content):
{
  "sections": [
    { "type": "heading", "content": "Title" },
    { "type": "paragraph", "content": "Text..." },
    { "type": "bullets", "items": ["Item 1", "Item 2"] },
    { "type": "callout", "content": "Important note" }
  ]
}
```

**UI:**
- Breadcrumb: Marketing for Trades > Module 1 > Lesson Title
- Lesson content (markdown or structured JSON rendered)
- Video embed if `lesson.video_url` exists
- Exercise section (from `lesson.resources` JSON)
- "Mark as Complete" button (if not completed)
- Navigation: "← Previous Lesson" | "Next Lesson →"

**Mark Complete Mutation:**
```typescript
const handleMarkComplete = async () => {
  const { error } = await supabase
    .from('lesson_progress')
    .upsert({
      user_id: user.id,
      course_slug: 'marketing-for-trades',
      lesson_slug: lessonSlug,
      completed: true,
      completed_at: new Date().toISOString()
    });

  if (!error) {
    // Update UI, show checkmark
    // Auto-navigate to next lesson (optional)
  }
};
```

---

### Route: `/learn/marketing-for-trades/exam`

**Purpose:** Final certification exam (25 questions)

**Component:** `CourseExamPage.tsx`

**Auth:** Required + Enrolled + All Lessons Complete

**Auth Guard:**
```typescript
// Check all lessons completed
const { data: lessons } = await supabase
  .from('course_lessons')
  .select('id')
  .eq('course_slug', 'marketing-for-trades');

const { data: progress } = await supabase
  .from('lesson_progress')
  .select('id')
  .eq('user_id', user.id)
  .eq('course_slug', 'marketing-for-trades')
  .eq('completed', true);

if (progress.length < lessons.length) {
  // Redirect back to dashboard with message
  alert('Complete all lessons before taking the exam');
  navigate('/learn/marketing-for-trades');
  return;
}
```

**Supabase Queries:**
```typescript
// Fetch exam questions
const { data: questions } = await supabase
  .from('course_exam_questions')
  .select('id, question_index, question_text, options, question_type')
  .eq('course_id', courseId)
  .order('question_index');

// Note: Do NOT fetch correct_option_id or explanation (only after submission)

// Check previous attempts
const { data: attempts } = await supabase
  .from('course_exam_attempts')
  .select('id, score, passed, attempted_at')
  .eq('user_id', user.id)
  .eq('course_id', courseId)
  .order('attempted_at', { ascending: false });
```

**UI:**
- Exam header: "Marketing for Trades™ Certification Exam"
- Instructions:
  - 25 questions
  - 80% to pass (20/25 correct)
  - No time limit
  - You can retake if you don't pass
- Question format (multiple choice):
  - Radio buttons for options (a, b, c, d)
- "Submit Exam" button at bottom
- Progress indicator: "Question 5/25"

**Submit Exam Logic:**
```typescript
const handleSubmit = async (answers: Record<number, string>) => {
  // Call edge function to grade exam
  const response = await fetch(`${SUPABASE_URL}/functions/v1/submit-exam`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      course_slug: 'marketing-for-trades',
      answers: answers // { question_index: selected_option_id }
    })
  });

  const result = await response.json();
  // result: { score: 88, passed: true, certificate_code: "LLA-MFT-AB12CD", breakdown: [...] }

  if (result.passed) {
    // Show success modal
    // "Congratulations! You scored 88%. Your certificate is ready."
    // CTA: "View Certificate" → `/certificate/{certificate_code}`
  } else {
    // Show failure modal
    // "You scored 72%. You need 80% to pass. Review the material and try again."
    // CTA: "Review Course" → `/learn/marketing-for-trades`
  }
};
```

**Edge Function: `submit-exam`**
```typescript
// Pseudo-code for the edge function
export default async (req: Request) => {
  const { course_slug, answers } = await req.json();
  const user = await getUser(req);

  // Fetch correct answers
  const { data: questions } = await supabase
    .from('course_exam_questions')
    .select('question_index, correct_option_id')
    .eq('course_slug', course_slug);

  // Grade
  let correctCount = 0;
  const breakdown = [];
  for (const q of questions) {
    const correct = answers[q.question_index] === q.correct_option_id;
    if (correct) correctCount++;
    breakdown.push({ question_index: q.question_index, correct });
  }

  const score = Math.round((correctCount / questions.length) * 100);
  const passed = score >= 80;

  // Insert attempt
  const { data: attempt } = await supabase
    .from('course_exam_attempts')
    .insert({
      user_id: user.id,
      course_slug,
      score,
      passed,
      answers: answers // store for review
    })
    .select()
    .single();

  // If passed, create certificate
  let certificate_code = null;
  if (passed) {
    const code = generateCertificateCode(); // e.g., LLA-MFT-AB12CD34
    const { data: cert } = await supabase
      .from('certificates')
      .insert({
        user_id: user.id,
        course_slug,
        certificate_code: code,
        issued_at: new Date().toISOString()
      })
      .select()
      .single();

    certificate_code = code;

    // Trigger email with certificate link
    await sendCertificateEmail(user.email, course_slug, code);
  }

  return Response.json({ score, passed, certificate_code, breakdown });
};
```

---

## 4. CERTIFICATE SYSTEM

### Route: `/certificate/{certificate-code}`

**Purpose:** Public certificate verification page

**Component:** `CertificatePage.tsx`

**Auth:** Public (anyone with code can view)

**Supabase Query:**
```typescript
// Verify certificate exists and is valid
const { data: certificate } = await supabase
  .from('certificates')
  .select(`
    id,
    certificate_code,
    issued_at,
    is_revoked,
    course:course_slug (
      title,
      slug
    ),
    user:user_id (
      id,
      email
    )
  `)
  .eq('certificate_code', certificateCode)
  .maybeSingle();

if (!certificate || certificate.is_revoked) {
  // Show "Certificate Not Found" or "Revoked"
}

// Fetch user's profile for name
const { data: profile } = await supabase
  .from('profiles')
  .select('full_name, first_name, last_name')
  .eq('id', certificate.user.id)
  .single();
```

**UI:**
- Certificate template display (styled as printable)
  - Local-Link Academy logo
  - "Certificate of Completion"
  - Recipient name (profile.full_name)
  - Course title
  - Issued date
  - Certificate code
  - Signature/seal
- "Download PDF" button
- "Verify Authenticity" section showing:
  - Certificate code
  - Issued date
  - Course completed
  - Status: Valid / Revoked

**PDF Generation:**
```typescript
// Option 1: Client-side with jsPDF
import { jsPDF } from 'jspdf';

const generatePDF = () => {
  const doc = new jsPDF('landscape');
  // Add certificate template
  // Add text fields
  doc.save(`Marketing_for_Trades_Certificate_${certificateCode}.pdf`);
};

// Option 2: Server-side edge function
const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-certificate-pdf`, {
  method: 'POST',
  body: JSON.stringify({ certificate_code: certificateCode })
});
const blob = await response.blob();
// Download blob
```

---

## 5. ADMIN ROUTES

### Route: `/admin/academy`

**Purpose:** Admin dashboard for managing courses

**Component:** `AdminAcademyDashboard.tsx`

**Auth:** Required + Admin role

**Auth Guard:**
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single();

if (profile.role !== 'admin') {
  navigate('/');
  return;
}
```

**Supabase Queries:**
```typescript
// Fetch all courses
const { data: courses } = await supabase
  .from('courses')
  .select('*')
  .order('created_at', { ascending: false });

// Fetch enrollment counts per course
for (const course of courses) {
  const { count } = await supabase
    .from('course_enrollments')
    .select('id', { count: 'exact', head: true })
    .eq('course_slug', course.slug);

  course.enrollment_count = count;
}
```

**UI:**
- Course list table
  - Columns: Title, Slug, Price, Published, Enrollments, Actions
  - Actions: Edit, View Sales Page, Publish/Unpublish
- "Create Course" button
- Stats cards:
  - Total Courses
  - Total Students
  - Total Revenue
  - Certificates Issued

---

### Route: `/admin/academy/course/{course-slug}`

**Purpose:** Edit course details, modules, and lessons

**Component:** `AdminCourseEditor.tsx`

**Auth:** Admin only

**Tabs:**
1. **Course Settings** - Edit title, description, price, image
2. **Modules** - Add/edit/reorder modules
3. **Lessons** - Add/edit/reorder lessons within modules
4. **Exam Questions** - Manage exam questions
5. **Enrollments** - View enrolled students

---

### Route: `/admin/academy/certificates`

**Purpose:** Certificate management and verification

**Component:** `AdminCertificates.tsx`

**Auth:** Admin only

**Supabase Queries:**
```typescript
// Fetch all certificates
const { data: certificates } = await supabase
  .from('certificates')
  .select(`
    *,
    user:user_id (
      email,
      profiles (full_name)
    ),
    course:course_slug (
      title
    )
  `)
  .order('issued_at', { ascending: false });
```

**UI:**
- Search by certificate code or email
- Table with columns:
  - Certificate Code
  - Student Name
  - Course
  - Issued Date
  - Status (Valid/Revoked)
  - Actions (View, Revoke, Regenerate)

---

## 6. WEBHOOK HANDLERS

### Stripe Webhook: `subscription-payment-webhook`

**Triggered by:** `checkout.session.completed`

**Logic:**
```typescript
const session = event.data.object;
const { user_id, product_slug, partner_code } = session.metadata;

// 1. Create course enrollment
const { data: enrollment } = await supabase
  .from('course_enrollments')
  .insert({
    user_id,
    course_slug: product_slug,
    enrolled_at: new Date().toISOString()
  })
  .select()
  .single();

// 2. Create entitlement
await supabase
  .from('user_entitlements')
  .insert({
    user_id,
    entitlement_key: 'course_access',
    course_slug: product_slug,
    source_sku: product_slug
  });

// 3. Record affiliate referral if partner_code exists
if (partner_code) {
  const { data: affiliate } = await supabase
    .from('course_affiliates')
    .select('id')
    .eq('partner_code', partner_code)
    .single();

  if (affiliate) {
    await supabase
      .from('course_affiliate_referrals')
      .insert({
        affiliate_id: affiliate.id,
        course_slug: product_slug,
        customer_user_id: user_id,
        purchase_amount_cents: session.amount_total,
        stripe_session_id: session.id
      });
  }
}

// 4. Send welcome email
await sendCourseWelcomeEmail(user_id, product_slug);
```

---

## 7. DATA SCHEMA SUMMARY

**Tables Used:**

```sql
-- Core course tables
courses (id, slug, title, subtitle, description, image_url, is_published)
course_modules (id, course_id, module_index, title, description)
course_lessons (id, module_id, lesson_index, title, content_md, video_url, resources, is_preview)

-- User progress
course_enrollments (id, user_id, course_slug, enrolled_at)
lesson_progress (id, user_id, course_slug, lesson_slug, completed, completed_at)

-- Exams
course_exam_questions (id, course_id, question_index, question_text, options, correct_option_id, explanation)
course_exam_attempts (id, user_id, course_slug, score, passed, answers, attempted_at)

-- Certificates
certificates (id, user_id, course_slug, certificate_code, issued_at, is_revoked)

-- Entitlements (access control)
user_entitlements (id, user_id, entitlement_key, course_slug, source_sku)

-- Affiliates
course_affiliates (id, partner_code, user_id, name, email)
course_affiliate_referrals (id, affiliate_id, course_slug, customer_user_id, purchase_amount_cents)
course_affiliate_payouts (id, affiliate_id, amount_cents, status, paid_at)
```

---

## 8. COMPONENT REUSABILITY

**Generic Components (can reuse for all courses):**
- `CourseSalesPage.tsx` - Pass course slug as prop
- `CourseDashboard.tsx` - Pass course slug as prop
- `LessonViewer.tsx` - Pass lesson slug as prop
- `CourseExamPage.tsx` - Pass course slug as prop
- `CertificatePage.tsx` - Pass certificate code as prop

**Course-Specific Components (optional custom design):**
- `MarketingForTradesSalesPage.tsx` - Custom hero, testimonials
- `MarketingForTradesDashboard.tsx` - Custom branding

---

## 9. PARTNER CODE FLOW

**URL Structure:**
```
https://local-linkmarketplace.com/academy/marketing-for-trades?partner_code=JOHN123
```

**Tracking Flow:**
1. User clicks affiliate link with `?partner_code=JOHN123`
2. Sales page loads, stores partner code in `sessionStorage`
3. User clicks "Enroll Now"
4. Checkout page reads partner code from sessionStorage
5. Stripe Checkout session metadata includes `partner_code: "JOHN123"`
6. Webhook receives payment → creates referral record
7. Admin runs payout batch weekly

**Affiliate Dashboard Route: `/affiliate/dashboard`**
- Show referral count, revenue generated, unpaid commissions
- Payout history

---

## 10. EMAIL TRIGGERS

**Email 1: Welcome to Course**
- Trigger: `course_enrollments` insert
- Template: "Welcome to Marketing for Trades™ - Start Lesson 1"

**Email 2: Lesson Milestone**
- Trigger: 50% lessons completed
- Template: "You're halfway through! Keep going."

**Email 3: Exam Unlocked**
- Trigger: All lessons marked complete
- Template: "You're ready! Take the final exam."

**Email 4: Certificate Issued**
- Trigger: `certificates` insert
- Template: "Congratulations! Your certificate is ready. Download here: {link}"

---

## 11. ENVIRONMENT VARIABLES NEEDED

```env
# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx (backend only)
STRIPE_WEBHOOK_SECRET=whsec_xxx

# App URLs
VITE_APP_URL=https://local-linkmarketplace.com
```

---

## 12. TESTING CHECKLIST

**Pre-Launch Tests:**

- [ ] Guest can view course sales page
- [ ] Guest cannot access paid lesson content
- [ ] Enrolled user can access all lessons
- [ ] Enrolled user can mark lessons complete
- [ ] Progress persists across sessions
- [ ] Exam locked until all lessons complete
- [ ] Exam grades correctly (80% passing)
- [ ] Certificate generates on exam pass
- [ ] Certificate PDF downloads correctly
- [ ] Public certificate verification works
- [ ] Stripe webhook creates enrollment
- [ ] Partner code tracked through entire flow
- [ ] Affiliate referral recorded correctly
- [ ] Admin can view enrollments
- [ ] Admin can revoke certificates

---

## 13. DEPLOYMENT NOTES

**Step 1:** Run migration script
```bash
psql $DATABASE_URL < marketing_for_trades_seed.sql
```

**Step 2:** Deploy edge functions
- `create-checkout-session`
- `verify-checkout-session`
- `submit-exam`
- `generate-certificate-pdf` (optional)

**Step 3:** Configure Stripe webhook endpoint
```
https://xxx.supabase.co/functions/v1/subscription-payment-webhook
```
Events to subscribe:
- `checkout.session.completed`

**Step 4:** Test with Stripe test mode first

**Step 5:** Go live

---

## 14. QUICK START URLS

**For Developer:**
1. Start here: `/academy` (course catalog)
2. Sales page: `/academy/marketing-for-trades`
3. After purchase: `/learn/marketing-for-trades`
4. First lesson: `/learn/marketing-for-trades/lesson/welcome-how-trades-buy`

**For Admin:**
1. Admin dashboard: `/admin/academy`
2. Certificate lookup: `/admin/academy/certificates`

---

## END OF SPECIFICATION

This document contains everything needed to build the complete Marketing for Trades™ course experience in Bolt.new.

**Next Steps:**
1. Hand this to your developer
2. Run the SQL seed script (`marketing_for_trades_seed.sql`)
3. Build routes in order: public → checkout → student → admin
4. Test end-to-end with Stripe test mode
5. Launch 🚀
