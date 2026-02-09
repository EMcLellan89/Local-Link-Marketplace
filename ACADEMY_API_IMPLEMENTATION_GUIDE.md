# Academy API Implementation Guide

Complete guide for the Local-Link Revenue Academy system including API endpoints, admin tools, and integration patterns.

## Overview

The Academy system provides:
- Course enrollment and entitlement management
- Certification exam system
- Admin content editor screens
- Partner commission tracking for course sales
- Track purchasing and upsell capabilities

---

## API Endpoints

### 1. Entitle User from Order

**Endpoint:** `POST /functions/v1/academy-entitle-from-order`

Automatically grants course access when a marketplace order is completed.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
apikey: YOUR_SUPABASE_ANON_KEY
```

**Request Body:**
```json
{
  "order_id": "uuid-of-marketplace-order"
}
```

**Response:**
```json
{
  "ok": true,
  "enrollment_id": "uuid",
  "course_slug": "local-link-academy"
}
```

**Usage Example:**
```javascript
const response = await fetch(
  `${SUPABASE_URL}/functions/v1/academy-entitle-from-order`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ order_id: orderId })
  }
);

const data = await response.json();
```

**Business Logic:**
- Looks up the marketplace order
- Extracts course slug from product metadata
- Checks if user already enrolled (returns existing enrollment)
- Creates new enrollment if needed
- Links enrollment to order for tracking

---

### 2. Purchase Track (Checkout)

**Endpoint:** `POST /functions/v1/academy-tracks-purchase`

Creates a Stripe checkout session for purchasing a course track.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
apikey: YOUR_SUPABASE_ANON_KEY
```

**Request Body:**
```json
{
  "user_id": "uuid-of-user",
  "track_slug": "local-link-academy",
  "referral_code": "PARTNER123" // optional
}
```

**Response:**
```json
{
  "ok": true,
  "checkout_url": "https://checkout.stripe.com/...",
  "session_id": "cs_test_..."
}
```

**Usage Example:**
```javascript
async function buyTrack(userId, trackSlug, referralCode) {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/academy-tracks-purchase`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        user_id: userId,
        track_slug: trackSlug,
        referral_code: referralCode
      })
    }
  );

  const data = await response.json();

  if (data.ok) {
    window.location.href = data.checkout_url;
  }
}
```

**Business Logic:**
- Validates track/product exists
- Finds active one-time pricing
- Creates checkout session record
- Creates Stripe checkout with partner attribution
- Redirects to Stripe checkout

---

### 3. Manual Entitlement (Admin)

**Endpoint:** `POST /functions/v1/academy-tracks-entitle`

Admin endpoint to manually grant course access to users.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
apikey: YOUR_SUPABASE_ANON_KEY
X-Admin-Key: YOUR_ADMIN_KEY
```

**Request Body:**
```json
{
  "user_id": "uuid-of-user",
  "course_slugs": [
    "local-link-academy",
    "partner-accelerator",
    "ugc-creator-network"
  ],
  "reason": "Promotional grant for beta testers"
}
```

**Response:**
```json
{
  "ok": true,
  "enrollments": [
    {
      "course_slug": "local-link-academy",
      "enrollment_id": "uuid",
      "status": "newly_enrolled"
    },
    {
      "course_slug": "partner-accelerator",
      "enrollment_id": "uuid",
      "status": "already_enrolled"
    }
  ],
  "errors": [],
  "reason": "Promotional grant for beta testers"
}
```

**Usage Example:**
```javascript
async function grantAccess(userId, courseSlugs, reason) {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/academy-tracks-entitle`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'X-Admin-Key': ADMIN_KEY,
      },
      body: JSON.stringify({
        user_id: userId,
        course_slugs: courseSlugs,
        reason: reason
      })
    }
  );

  return await response.json();
}
```

**Business Logic:**
- Requires admin authentication
- Validates all course slugs
- Checks existing enrollments
- Creates new enrollments for non-enrolled courses
- Returns comprehensive status for all courses

---

## Admin Content Editor Screens

### 1. Academy Modules Page

**Route:** `/admin/academy/modules`

**Features:**
- Select course from dropdown
- View all modules in order
- Create new modules with title, description, order, duration
- Edit existing modules inline
- Delete modules (cascades to lessons)
- Automatic order indexing

**Usage:**
1. Navigate to `/admin/academy/modules`
2. Select target course
3. Click "Add Module" to create
4. Click edit icon to modify
5. Click delete icon to remove

**Fields:**
- Title (required)
- Description (optional)
- Order Index (auto-assigned but editable)
- Duration in minutes (optional)

---

### 2. Academy Lessons Page

**Route:** `/admin/academy/lessons`

**Features:**
- Two-tier selection (Course → Module)
- View all lessons in selected module
- Create lessons with markdown content
- Add video URLs (YouTube, Vimeo, etc.)
- Mark lessons as free preview
- Set duration and order
- Rich content editor

**Usage:**
1. Navigate to `/admin/academy/lessons`
2. Select course and module
3. Click "Add Lesson" to create
4. Fill in lesson details:
   - Title
   - Content (supports markdown)
   - Video URL
   - Duration
   - Preview status
5. Save and publish

**Fields:**
- Title (required)
- Content (markdown, optional)
- Video URL (optional)
- Order Index (auto-assigned)
- Duration in minutes (optional)
- Is Preview (boolean)

**Content Format:**
Supports full markdown including:
- Headings
- Lists
- Code blocks
- Links
- Images
- Quotes

---

### 3. Exam Questions Page

**Route:** `/admin/academy/exam-questions`

**Features:**
- Question bank management
- Multiple choice questions (2-4 options)
- Difficulty levels (easy, medium, hard)
- Answer explanations
- Duplicate questions feature
- Visual correct answer highlighting
- Question counter

**Usage:**
1. Navigate to `/admin/academy/exam-questions`
2. Select target course
3. Click "Add Question"
4. Fill in question details:
   - Question text
   - 2-4 answer options
   - Correct answer (A, B, C, or D)
   - Difficulty level
   - Explanation (optional)
5. Save question

**Question Structure:**
- Question Text (required)
- Option A (required)
- Option B (required)
- Option C (optional)
- Option D (optional)
- Correct Answer: a, b, c, or d (required)
- Difficulty: easy, medium, hard (required)
- Explanation (optional)

**Duplicate Feature:**
Click the copy icon to create a duplicate question you can then modify.

---

## Database Schema

### Core Tables

**course_products**
- id (uuid)
- title (text)
- slug (text, unique)
- description (text)
- price_cents (integer)
- thumbnail_url (text)
- target_audience (text)
- created_at (timestamptz)

**course_modules**
- id (uuid)
- course_id (uuid, fk)
- title (text)
- description (text)
- order_index (integer)
- duration_minutes (integer)
- created_at (timestamptz)

**course_lessons**
- id (uuid)
- module_id (uuid, fk)
- title (text)
- content (text) - markdown format
- video_url (text)
- order_index (integer)
- duration_minutes (integer)
- is_preview (boolean)
- created_at (timestamptz)

**course_enrollments**
- id (uuid)
- user_id (uuid, fk)
- course_id (uuid, fk)
- enrolled_at (timestamptz)
- completed_at (timestamptz)
- progress_percent (integer)
- status (text: active, completed, suspended)

**course_exam_questions**
- id (uuid)
- course_id (uuid, fk)
- question_text (text)
- option_a (text)
- option_b (text)
- option_c (text)
- option_d (text)
- correct_answer (text: a, b, c, d)
- explanation (text)
- difficulty (text: easy, medium, hard)
- created_at (timestamptz)

**course_exam_attempts**
- id (uuid)
- user_id (uuid, fk)
- course_id (uuid, fk)
- score (integer)
- total_questions (integer)
- passed (boolean)
- completed_at (timestamptz)

---

## Integration with Marketplace

### Linking Courses to Products

In the `marketplace_products` table, add to the metadata JSONB field:

```json
{
  "course_slug": "local-link-academy",
  "auto_enroll": true
}
```

### Webhook Flow

1. **Stripe Webhook** → Creates marketplace order
2. **Order Status** → Changes to "completed"
3. **Trigger Function** → Calls `academy-entitle-from-order`
4. **Enrollment Created** → User gains course access
5. **Commission Tracked** → Partner credited if applicable

### Manual Integration

```javascript
// After successful payment
const { data: order } = await supabase
  .from('marketplace_orders')
  .select('*')
  .eq('stripe_payment_intent_id', paymentIntentId)
  .single();

if (order.status === 'completed') {
  await fetch(`${SUPABASE_URL}/functions/v1/academy-entitle-from-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ order_id: order.id })
  });
}
```

---

## Environment Variables

Add to your `.env` file:

```bash
# Supabase (already configured)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe (already configured)
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Admin Authentication
LOCAL_LINK_ADMIN_KEY=your-secure-admin-key-here

# Application Base URL
APP_BASE_URL=http://localhost:5173
```

---

## Frontend Integration Patterns

### Check Enrollment Status

```javascript
async function checkEnrollment(userId, courseId) {
  const { data, error } = await supabase
    .from('course_enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle();

  return data !== null;
}
```

### List User's Courses

```javascript
async function getUserCourses(userId) {
  const { data } = await supabase
    .from('course_enrollments')
    .select(`
      *,
      course:course_products(*)
    `)
    .eq('user_id', userId)
    .eq('status', 'active');

  return data;
}
```

### Load Course Structure

```javascript
async function getCourseStructure(courseId) {
  const { data } = await supabase
    .from('course_modules')
    .select(`
      *,
      lessons:course_lessons(*)
    `)
    .eq('course_id', courseId)
    .order('order_index');

  return data;
}
```

### Track Lesson Completion

```javascript
async function markLessonComplete(userId, lessonId) {
  const { error } = await supabase
    .from('course_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      completed_at: new Date().toISOString()
    });

  return !error;
}
```

---

## Exam System

### Load Exam Questions

```javascript
async function loadExamQuestions(courseId, count = 20) {
  const { data } = await supabase
    .from('course_exam_questions')
    .select('id, question_text, option_a, option_b, option_c, option_d, difficulty')
    .eq('course_id', courseId)
    .order('random()')
    .limit(count);

  return data;
}
```

### Submit Exam

Use the existing `/functions/v1/submit-exam` endpoint:

```javascript
const response = await fetch(
  `${SUPABASE_URL}/functions/v1/submit-exam`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      course_slug: 'local-link-academy',
      answers: {
        'question-uuid-1': 'a',
        'question-uuid-2': 'c',
        // ... up to 20 answers
      }
    })
  }
);

const { passed, score, total_questions } = await response.json();
```

### Issue Certificate

After passing exam:

```javascript
if (passed) {
  const certificateUrl = `/academy/certificate/${courseSlug}?user=${userId}`;

  // Certificate page uses /functions/v1/verify-certificate to validate
}
```

---

## Security Considerations

### RLS Policies

All course tables have Row Level Security enabled:

**Enrollments:**
- Users can read their own enrollments
- Admin can read/write all

**Modules & Lessons:**
- Public can read if marked as preview
- Enrolled users can read all
- Admin can manage

**Exam Questions:**
- Admin only for management
- Exam system loads questions without exposing correct answers
- Correct answers only returned after submission

### Admin Authentication

All admin endpoints require `X-Admin-Key` header matching `LOCAL_LINK_ADMIN_KEY` environment variable.

**Never:**
- Expose admin key in frontend code
- Store admin key in localStorage
- Log admin key to console
- Commit admin key to git

---

## Testing

### Test Course Enrollment

```bash
# Create test enrollment
curl -X POST ${SUPABASE_URL}/functions/v1/academy-entitle-from-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -d '{"order_id": "test-order-uuid"}'
```

### Test Manual Entitlement

```bash
# Grant access to multiple courses
curl -X POST ${SUPABASE_URL}/functions/v1/academy-tracks-entitle \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "X-Admin-Key: ${ADMIN_KEY}" \
  -d '{
    "user_id": "test-user-uuid",
    "course_slugs": ["local-link-academy"],
    "reason": "Test enrollment"
  }'
```

---

## Production Checklist

- [ ] All course content uploaded
- [ ] At least 20 exam questions per course
- [ ] Admin screens tested
- [ ] Enrollment flow tested end-to-end
- [ ] Stripe webhooks configured
- [ ] Certificate generation working
- [ ] Email notifications configured
- [ ] Analytics tracking enabled
- [ ] RLS policies verified
- [ ] Admin key secured
- [ ] Backup procedures in place

---

## Support

For issues or questions:
1. Check Supabase logs: `supabase functions logs academy-entitle-from-order`
2. Verify environment variables are set
3. Test with admin screens first
4. Check RLS policies if access denied

## Next Steps

1. Seed exam questions (see `ACADEMY_EXAM_SEED_100_QUESTIONS.md`)
2. Configure email templates for enrollment confirmation
3. Set up analytics dashboards for course performance
4. Create marketing materials for course sales pages
