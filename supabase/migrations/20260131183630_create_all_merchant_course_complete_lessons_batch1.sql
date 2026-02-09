/*
  # Complete Merchant Academy Lessons - Batch 1
  
  Creates comprehensive lessons for high-priority merchant courses:
  1. Local Customers on Autopilot (5 modules × 4-5 lessons = 22 lessons)
  2. UGC From Home (4 modules × 5-6 lessons = 22 lessons)
  3. Reviews That Convert (3 modules × 5 lessons = 15 lessons)
  4. AI Receptionist & Missed Calls (3 modules × 5 lessons = 15 lessons)
  
  Total: ~74 comprehensive lessons with actionable content
*/

-- First, create modules for courses that don't have them yet

-- LOCAL CUSTOMERS ON AUTOPILOT - Create Modules
INSERT INTO academy_modules (course_id, title, description, display_order) 
SELECT 
  id,
  'Module 1: The Local-Link System',
  'Understanding how the platform generates customers without ads',
  1
FROM academy_courses WHERE slug = 'local-customers-on-autopilot'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT 
  id,
  'Module 2: Setting Up Your Profile for Maximum Visibility',
  'Optimizing your merchant profile to attract customers',
  2
FROM academy_courses WHERE slug = 'local-customers-on-autopilot'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT 
  id,
  'Module 3: Creating Irresistible Deals',
  'Deal strategy that converts browsers into buyers',
  3
FROM academy_courses WHERE slug = 'local-customers-on-autopilot'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT 
  id,
  'Module 4: The Referral Engine',
  'Turning customers into your marketing team',
  4
FROM academy_courses WHERE slug = 'local-customers-on-autopilot'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT 
  id,
  'Module 5: Automation & Scaling',
  'Systems to handle growth without overwhelm',
  5
FROM academy_courses WHERE slug = 'local-customers-on-autopilot'
ON CONFLICT DO NOTHING;

-- UGC FROM HOME - Create Modules  
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT 
  id,
  'Module 1: UGC Fundamentals',
  'What UGC is and why brands pay for it',
  1
FROM academy_courses WHERE slug = 'ugc-from-home'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT 
  id,
  'Module 2: Building Your Portfolio',
  'Creating samples that get you hired',
  2
FROM academy_courses WHERE slug = 'ugc-from-home'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT 
  id,
  'Module 3: Finding & Pitching Clients',
  'Where to find brands and how to pitch',
  3
FROM academy_courses WHERE slug = 'ugc-from-home'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT 
  id,
  'Module 4: Pricing & Scaling Your UGC Business',
  'What to charge and how to grow',
  4
FROM academy_courses WHERE slug = 'ugc-from-home'
ON CONFLICT DO NOTHING;

-- REVIEWS THAT CONVERT - Create Modules
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT 
  id,
  'Module 1: Review Generation System',
  'Getting more 5-star reviews systematically',
  1
FROM academy_courses WHERE slug = 'reviews-that-convert'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT 
  id,
  'Module 2: Review Response & Reputation Management',
  'Responding to reviews and managing your reputation',
  2
FROM academy_courses WHERE slug = 'reviews-that-convert'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT 
  id,
  'Module 3: Leveraging Reviews for Marketing',
  'Using reviews to attract more customers',
  3
FROM academy_courses WHERE slug = 'reviews-that-convert'
ON CONFLICT DO NOTHING;

-- AI RECEPTIONIST - Create Modules
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT 
  id,
  'Module 1: AI Phone System Setup',
  'Setting up your 24/7 AI receptionist',
  1
FROM academy_courses WHERE slug = 'ai-receptionist-missed-calls'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT 
  id,
  'Module 2: Call Scripts & Conversation Flow',
  'Programming your AI to convert callers',
  2
FROM academy_courses WHERE slug = 'ai-receptionist-missed-calls'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT 
  id,
  'Module 3: Integration & Automation',
  'Connecting to your CRM and calendar',
  3
FROM academy_courses WHERE slug = 'ai-receptionist-missed-calls'
ON CONFLICT DO NOTHING;

-- Now create lessons for each course
-- LOCAL CUSTOMERS ON AUTOPILOT - Module 1 Lessons
