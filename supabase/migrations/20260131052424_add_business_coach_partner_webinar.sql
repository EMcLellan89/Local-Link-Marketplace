/*
  # Add Partner Webinar: Business Coach Certification Kickoff

  ## Overview
  Creates a comprehensive partner-focused webinar that introduces the Business Coach
  Certification program and teaches partners how to position themselves as business rescue experts.

  ## Webinar Details:
  - Target: Local-Link partners interested in business coaching
  - Duration: ~60 minutes
  - Goal: Inspire partners to get certified and start landing coaching clients
  - CTA: Enroll in certification course + start prospecting

  ## Structure:
  - Introduction & Transformation Promise (7 min)
  - Why Business Coaching is the Ultimate High-Ticket Service (10 min)
  - The Business Coach Certification Framework (20 min)
  - How to Land Your First 3 Coaching Clients (15 min)
  - Certification Path & Next Steps (8 min)
*/

-- Create the partner webinar course
INSERT INTO courses (
  slug,
  title,
  subtitle,
  description,
  image_url,
  is_published,
  target_audience
)
VALUES (
  'partner-webinar-business-coach-cert',
  'Partner Webinar: Become a Certified Business Coach & Earn $3K-$10K Per Client',
  'Turn Struggling Businesses Into Success Stories While Building Your High-Ticket Practice',
  'A 60-minute intensive webinar showing Local-Link partners exactly how to get certified as a Business Coach and position yourself as a business rescue expert. Learn the frameworks, positioning, and client acquisition strategies that make business coaching the most profitable and fulfilling service you can offer.',
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
  true,
  'partner'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Create webinar module and lessons
DO $$
DECLARE
  v_course_id uuid;
  v_module_id uuid;
BEGIN
  -- Get the course ID
  SELECT id INTO v_course_id FROM courses WHERE slug = 'partner-webinar-business-coach-cert';

  -- Create the webinar module
  INSERT INTO course_modules (course_id, title, description, module_index)
  VALUES (
    v_course_id,
    'Complete Webinar Recording',
    'Full 60-minute webinar on becoming a certified business coach',
    1
  )
  RETURNING id INTO v_module_id;

  -- Lesson 1: Introduction & The Transformation Promise
  INSERT INTO course_lessons (module_id, title, content_md, lesson_index, video_duration_minutes)
  VALUES (
    v_module_id,
    'Introduction & The Transformation Promise (7 min)',
    '# Welcome: The Business Coach Opportunity

## Opening Hook (90 seconds)
"How many of you have a local business owner in your network right now who is struggling?
Maybe they''re working 70-hour weeks and barely breaking even.
Maybe they''re one bad month away from closing their doors.
Maybe they have great skills but terrible systems.

What if I told you that YOU could be the person who saves that business—and earn $3,000 to $10,000 doing it?

That''s what we''re covering today."

## Who This Webinar Is For (2 min)
✅ Local-Link partners who want to add high-ticket services
✅ Consultants and coaches who want structured systems
✅ Anyone who loves solving problems and transforming businesses
✅ People who want recurring, high-value client relationships

## The Transformation Promise (3 minutes)
"By the end of this webinar, you will:
1. Understand WHY business coaching is the highest-leverage service you can offer
2. Know the EXACT frameworks certified business coaches use
3. Have a clear path to certification and your first 3 clients
4. See exactly how to charge $3K-$10K per client confidently"

## What Makes This Different (90 seconds)
"This isn''t about becoming a ''life coach'' or generic consultant.
This is about becoming a BUSINESS RESCUE SPECIALIST.
You''re not teaching mindset. You''re fixing cash flow problems.
You''re not doing ''discovery calls.'' You''re running business health assessments.
You''re not hoping for referrals. You''re positioning as the expert who saves businesses."',
    1,
    7
  );

  -- Lesson 2: Why Business Coaching is the Ultimate High-Ticket Service
  INSERT INTO course_lessons (module_id, title, content_md, lesson_index, video_duration_minutes)
  VALUES (
    v_module_id,
    'Why Business Coaching is the Ultimate High-Ticket Service (10 min)',
    '# The Business Coaching Advantage

## The Problem With Most Services (3 minutes)
"Let''s talk about what you''re probably selling right now:
- Website design: One-time fee, lots of competition
- Social media management: Monthly recurring, but clients cancel easily
- SEO services: Takes 6-12 months to see results
- Paid ads: Client takes all the risk

All of these have the same problem: **You''re in the commodity game.**"

## What Makes Business Coaching Different (4 minutes)

### 1. Direct Revenue Impact
"When you fix pricing or cash flow, they see results in DAYS, not months."

### 2. High Perceived Value
"You''re offering BUSINESS RESCUE. The difference between staying open and closing down is worth hundreds of thousands."

### 3. Natural Upsells and Recurring Revenue
"Business coaching naturally leads to implementation services, monthly retainers, and team training."

### 4. Low Competition Locally
"YOU will be the LOCAL expert. In most towns, you''ll be the ONLY certified business coach."

## The Income Math (3 minutes)
"Simple math:
- 3 clients per month at $5,000 each = $15,000/month
- 2 become monthly retainers at $2,000/month = $4,000 recurring
- 50% refer 1 other business = 1.5 extra clients/month

**Month 6**: You''re at $40K+/month with a waitlist."',
    2,
    10
  );

  -- Lesson 3: The Business Coach Certification Framework
  INSERT INTO course_lessons (module_id, title, content_md, lesson_index, video_duration_minutes)
  VALUES (
    v_module_id,
    'The Business Coach Certification Framework (20 min)',
    '# What You''ll Learn in the Certification Program

## 10 Modules, 40 Hours of Training
1. Business Assessment & Diagnosis
2. Financial Rescue Strategies
3. Marketing Systems That Work
4. Operations Optimization
5. Sales System Development
6. Leadership & Team Building
7. Crisis Management & Turnarounds
8. Pricing & Profitability
9. Customer Retention & Loyalty
10. Scaling & Growth Strategies

## Module Spotlight: Business Assessment
The 60-Minute Business Health Check framework lets you:
- Identify the #1 problem killing their business
- Calculate their cash runway
- Find $5K-$50K in hidden revenue opportunities
- Create an action plan they can start TODAY

## Module Spotlight: Financial Rescue
Learn the 48-Hour Cash Flow Rescue system to generate $5K-$20K without new customers.

## The Certification Exam
40-question exam covering all 10 modules. 80% pass rate required.

Once you pass, you earn:
✅ **Certified Business Coach** badge
✅ Access to the Business Coach job board
✅ Swipe files, templates, and resources
✅ Ongoing support and community',
    3,
    20
  );

  -- Lesson 4: How to Land Your First 3 Coaching Clients
  INSERT INTO course_lessons (module_id, title, content_md, lesson_index, video_duration_minutes)
  VALUES (
    v_module_id,
    'How to Land Your First 3 Coaching Clients (15 min)',
    '# Your First 3 Clients: The Launch Plan

## The "Rescue List" Strategy
Write down 20 local businesses who might be struggling. Offer free business health assessments. Deliver massive value. They''ll ask you to help implement.

## The Pilot Program Approach
"I''m certifying 3 pilot clients at $2,500 (50% off). You get the full program. I get testimonials and referrals."

Result: $7,500 from 3 clients in week 1.

## The Job Board Fast Track
Once certified, access the Local-Link Business Coach job board. Merchants purchase coaching services, jobs appear on your dashboard. These are WARM, qualified leads who already paid.

## The Referral Multiplier
One happy client can easily refer 3-5 others over 12 months.

## 30-Day Launch Timeline
**Week 1-3**: Complete all modules and pass exam
**Week 4**: Run 3 free assessments, close 2-3 pilot clients, accept first job board job

**Result**: Certified + $7,500+ revenue + testimonials by Day 30',
    4,
    15
  );

  -- Lesson 5: Certification Path & Next Steps
  INSERT INTO course_lessons (module_id, title, content_md, lesson_index, video_duration_minutes)
  VALUES (
    v_module_id,
    'Certification Path & Next Steps (8 min)',
    '# Your Certification Journey Starts Now

## What''s Included
- ✅ 10 Comprehensive Modules (40+ hours)
- ✅ Certification Exam (40 questions, unlimited retakes)
- ✅ Business Health Assessment templates
- ✅ Client proposal and contract templates
- ✅ Exclusive job board access
- ✅ Private partner forum and support

## Investment & ROI
Most certified coaches land their first client within 2 weeks and pay off certification immediately.

1 client at $3,000 = 3-6x ROI
3 clients at $3,000 each = 18x+ ROI

## How to Enroll
1. Click the enrollment link
2. Complete registration (2 minutes)
3. Get instant access to Module 1
4. Start your certification journey today

## Final Words
Right now, there are struggling business owners in YOUR community who need help.

You can be the person who changes that.
You can be the Certified Business Coach who saves businesses and builds a thriving practice.

**Click that enrollment button and let''s get you certified.**

Let''s go save some businesses.',
    5,
    8
  );

END $$;

-- Add webinar pricing (free for partners)
INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 0, true, 'one_time' FROM courses WHERE slug = 'partner-webinar-business-coach-cert'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 0, is_free = true;

-- Add webinar metadata
INSERT INTO course_webinar_content (course_id, webinar_format, total_duration_minutes, includes_q_and_a, includes_workbook)
SELECT id, 'recorded', 60, true, true FROM courses
WHERE slug = 'partner-webinar-business-coach-cert'
ON CONFLICT (course_id) DO UPDATE
SET total_duration_minutes = 60, includes_q_and_a = true, includes_workbook = true;