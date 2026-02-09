/*
  # Add Marketplace Mastery Course Modules and Lessons
  
  1. 8 Modules for required onboarding course
  2. Comprehensive lessons covering entire platform
  3. Purpose: Retention, adoption, reduced churn
*/

-- Get course ID and add modules/lessons
DO $$
DECLARE
  v_course_id uuid;
  v_module_1_id uuid;
  v_module_2_id uuid;
  v_module_3_id uuid;
  v_module_4_id uuid;
  v_module_5_id uuid;
  v_module_6_id uuid;
  v_module_7_id uuid;
  v_module_8_id uuid;
BEGIN
  SELECT id INTO v_course_id FROM courses WHERE slug = 'marketplace-mastery-required';
  
  IF v_course_id IS NULL THEN
    RAISE NOTICE 'Course not found';
    RETURN;
  END IF;

  -- MODULE 1: Understanding the Ecosystem
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (
    v_course_id, 1,
    'Understanding the Local-Link Ecosystem',
    'Big-picture clarity on how Local-Link works and why it matters'
  ) RETURNING id INTO v_module_1_id;

  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, is_preview)
  VALUES 
    (v_module_1_id, 1, 'What Local-Link Marketplace Actually Is', 'Understand the full platform, not just one feature.', true),
    (v_module_1_id, 2, 'How Customers, Merchants, Partners & Teams Interact', 'See how all users connect in the ecosystem.', true),
    (v_module_1_id, 3, 'Why Local-Link is Different from Directories', 'Learn what makes Local-Link unique and powerful.', false),
    (v_module_1_id, 4, 'How Local-Link Replaces Multiple Tools', 'Consolidate your tech stack into one platform.', false);

  -- MODULE 2: Dashboard Walkthrough
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (
    v_course_id, 2,
    'Merchant Dashboard Walkthrough',
    'Navigate confidently and find everything you need'
  ) RETURNING id INTO v_module_2_id;

  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, is_preview)
  VALUES 
    (v_module_2_id, 1, 'Dashboard Overview & Navigation', 'Master the main dashboard and menu system.', false),
    (v_module_2_id, 2, 'Where Listings, Jobs & Messages Live', 'Find key features quickly without confusion.', false),
    (v_module_2_id, 3, 'Updating Your Business Info Correctly', 'Keep your profile accurate and attractive.', false),
    (v_module_2_id, 4, 'Avoiding Common Setup Mistakes', 'Learn from others and set up right the first time.', false);

  -- MODULE 3: Listings That Convert
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (
    v_course_id, 3,
    'Listings That Actually Convert',
    'Optimize your presence to attract customers'
  ) RETURNING id INTO v_module_3_id;

  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, is_preview)
  VALUES 
    (v_module_3_id, 1, 'Optimizing Your Marketplace Listing', 'Stand out from competitors with a great listing.', false),
    (v_module_3_id, 2, 'Writing Descriptions That Attract Customers', 'Craft compelling copy that converts browsers to buyers.', false),
    (v_module_3_id, 3, 'Choosing Categories & Tags Strategically', 'Get found by the right customers searching for you.', false),
    (v_module_3_id, 4, 'Photos, Offers & CTAs That Work', 'Visual and action elements that drive results.', false);

  -- MODULE 4: Using Partners
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (
    v_course_id, 4,
    'Using Partners the Right Way',
    'Build successful partner relationships'
  ) RETURNING id INTO v_module_4_id;

  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, is_preview)
  VALUES 
    (v_module_4_id, 1, 'What Partners Do Inside Local-Link', 'Understand partner services and specializations.', false),
    (v_module_4_id, 2, 'Hiring Partners for Blogs, Ads, SEO & Design', 'Match the right partner to your specific needs.', false),
    (v_module_4_id, 3, 'How Partner Pricing Works', 'Understand costs and payment structures.', false),
    (v_module_4_id, 4, 'Managing Expectations & Timelines', 'Set clear expectations for smooth projects.', false);

  -- MODULE 5: Services & Tools
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (
    v_course_id, 5,
    'How Services, Courses & Tools Work Together',
    'Discover the full Local-Link service ecosystem'
  ) RETURNING id INTO v_module_5_id;

  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, is_preview)
  VALUES 
    (v_module_5_id, 1, 'Academy Courses Connect to Services', 'Learn how education leads to implementation.', false),
    (v_module_5_id, 2, 'When to DIY vs Done-For-You', 'Make smart decisions about your time and money.', false),
    (v_module_5_id, 3, 'How Services Stack for Maximum ROI', 'Combine blogs, ads, directories and tools strategically.', false),
    (v_module_5_id, 4, 'Why Multiple Services Improve Results', 'Understand synergy effects and compounding value.', false);

  -- MODULE 6: Pricing & Billing
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (
    v_course_id, 6,
    'Understanding Pricing, Billing & Memberships',
    'Clear answers about how billing works'
  ) RETURNING id INTO v_module_6_id;

  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, is_preview)
  VALUES 
    (v_module_6_id, 1, 'How Billing & Subscriptions Work', 'Understand recurring and one-time payments.', false),
    (v_module_6_id, 2, 'Membership vs One-Time Services', 'Know the difference and choose wisely.', false),
    (v_module_6_id, 3, 'Upgrades, Downgrades & Changes', 'Manage your subscription with flexibility.', false),
    (v_module_6_id, 4, 'What Happens if You Pause or Cancel', 'Understand your options without fear.', false);

  -- MODULE 7: Tracking Results
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (
    v_course_id, 7,
    'Tracking Results Inside Local-Link',
    'See proof of value in your dashboard'
  ) RETURNING id INTO v_module_7_id;

  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, is_preview)
  VALUES 
    (v_module_7_id, 1, 'What Metrics Local-Link Tracks', 'Learn which numbers matter most.', false),
    (v_module_7_id, 2, 'Interpreting Your Performance Data', 'Turn raw data into actionable insights.', false),
    (v_module_7_id, 3, 'What Success Looks Like', 'Set realistic expectations and benchmarks.', false),
    (v_module_7_id, 4, 'Making Better Decisions Using Data', 'Use analytics to guide your strategy.', false);

  -- MODULE 8: Growth Path
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (
    v_course_id, 8,
    'Your Growth Path Inside Local-Link',
    'Plan your long-term success journey'
  ) RETURNING id INTO v_module_8_id;

  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, is_preview)
  VALUES 
    (v_module_8_id, 1, 'Growth Paths of Successful Merchants', 'Learn from merchants who have scaled.', false),
    (v_module_8_id, 2, 'What to Do at Different Business Stages', 'Match your actions to your current stage.', false),
    (v_module_8_id, 3, 'Scaling Using Local-Link', 'Use the platform to grow systematically.', false),
    (v_module_8_id, 4, 'Staying Inside the Ecosystem Long-Term', 'Continue getting value as you grow.', false);

END $$;
