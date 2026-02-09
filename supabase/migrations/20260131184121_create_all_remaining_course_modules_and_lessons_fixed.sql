/*
  # Create Modules and Lessons for All Remaining Courses - Fixed
  
  Creates complete module structures and lessons for all merchant courses
  that currently have zero modules
*/

-- AUTOMATION & AI FOR LOCAL BUSINESS  
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: AI Tools Overview', 'Essential AI tools for local businesses', 1
FROM academy_courses WHERE slug = 'automation-ai-local'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Marketing Automation', 'Automate your marketing with AI', 2
FROM academy_courses WHERE slug = 'automation-ai-local'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Operations & Systems', 'AI-powered business operations', 3
FROM academy_courses WHERE slug = 'automation-ai-local'
ON CONFLICT DO NOTHING;

-- CARE COORDINATION FOR FAMILIES
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: Healthcare Marketing Basics', 'Compliant marketing for care services', 1
FROM academy_courses WHERE slug = 'care-coordination-for-families'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Building Trust', 'Establishing credibility in healthcare', 2
FROM academy_courses WHERE slug = 'care-coordination-for-families'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Referral Networks', 'Partner with healthcare providers', 3
FROM academy_courses WHERE slug = 'care-coordination-for-families'
ON CONFLICT DO NOTHING;

-- CUSTOMER REACTIVATION MASTERY
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: Win-Back Strategy', 'Framework for customer reactivation', 1
FROM academy_courses WHERE slug = 'customer-reactivation'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Win-Back Campaigns', 'Creating effective campaigns', 2
FROM academy_courses WHERE slug = 'customer-reactivation'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Measuring Success', 'Tracking reactivation ROI', 3
FROM academy_courses WHERE slug = 'customer-reactivation'
ON CONFLICT DO NOTHING;

-- FACEBOOK MONETIZATION
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: Facebook Strategy', 'Building your Facebook presence', 1
FROM academy_courses WHERE slug = 'facebook-monetization-local'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Content That Converts', 'Creating engaging Facebook content', 2
FROM academy_courses WHERE slug = 'facebook-monetization-local'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Monetization Methods', 'Turning engagement into revenue', 3
FROM academy_courses WHERE slug = 'facebook-monetization-local'
ON CONFLICT DO NOTHING;

-- FINANCIAL BASICS
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: Understanding Your Numbers', 'Financial fundamentals', 1
FROM academy_courses WHERE slug = 'financial-basics-small-business'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Cash Flow Management', 'Keeping cash flowing', 2
FROM academy_courses WHERE slug = 'financial-basics-small-business'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Pricing for Profit', 'Setting profitable prices', 3
FROM academy_courses WHERE slug = 'financial-basics-small-business'
ON CONFLICT DO NOTHING;

-- HIRING & OUTSOURCING
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: When to Hire', 'Knowing when you need help', 1
FROM academy_courses WHERE slug = 'hiring-outsourcing-local'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Finding Great People', 'Recruiting and interviewing', 2
FROM academy_courses WHERE slug = 'hiring-outsourcing-local'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Training & Retention', 'Keeping your team productive', 3
FROM academy_courses WHERE slug = 'hiring-outsourcing-local'
ON CONFLICT DO NOTHING;

-- LEAD CONVERSION MASTERY
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: Conversion Fundamentals', 'Understanding conversion', 1
FROM academy_courses WHERE slug = 'lead-conversion-local'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Follow-Up Systems', 'Never lose a lead', 2
FROM academy_courses WHERE slug = 'lead-conversion-local'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Sales Skills', 'Closing more deals', 3
FROM academy_courses WHERE slug = 'lead-conversion-local'
ON CONFLICT DO NOTHING;

-- LOCAL ADVERTISING MASTERY
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: Advertising Strategy', 'Planning campaigns', 1
FROM academy_courses WHERE slug = 'local-advertising-mastery'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Google Ads', 'Google advertising', 2
FROM academy_courses WHERE slug = 'local-advertising-mastery'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Facebook Ads', 'Social advertising', 3
FROM academy_courses WHERE slug = 'local-advertising-mastery'
ON CONFLICT DO NOTHING;

-- LOCAL SEO FOUNDATIONS
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: Local SEO Basics', 'How local search works', 1
FROM academy_courses WHERE slug = 'local-seo-foundations'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Google Business Profile', 'Optimizing GBP', 2
FROM academy_courses WHERE slug = 'local-seo-foundations'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Local Citations', 'Getting listed', 3
FROM academy_courses WHERE slug = 'local-seo-foundations'
ON CONFLICT DO NOTHING;

-- LOCAL VISIBILITY BOOSTER
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: Visibility Strategy', 'Getting seen', 1
FROM academy_courses WHERE slug = 'local-visibility-booster'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Online Presence', 'Online channels', 2
FROM academy_courses WHERE slug = 'local-visibility-booster'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Offline Marketing', 'Traditional marketing', 3
FROM academy_courses WHERE slug = 'local-visibility-booster'
ON CONFLICT DO NOTHING;

-- MARKETING FOR TRADES
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: Trade Business Marketing', 'Marketing for trades', 1
FROM academy_courses WHERE slug = 'marketing-for-trades'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Getting Found Online', 'Online marketing', 2
FROM academy_courses WHERE slug = 'marketing-for-trades'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Referral Systems', 'Referral networks', 3
FROM academy_courses WHERE slug = 'marketing-for-trades'
ON CONFLICT DO NOTHING;

-- MARKETPLACE MASTERY (MERCHANT)
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: Marketplace Strategy', 'Marketplace success', 1
FROM academy_courses WHERE slug = 'marketplace-mastery-merchant'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Creating Great Listings', 'Listings that convert', 2
FROM academy_courses WHERE slug = 'marketplace-mastery-merchant'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Deal Creation', 'Irresistible offers', 3
FROM academy_courses WHERE slug = 'marketplace-mastery-merchant'
ON CONFLICT DO NOTHING;

-- ONLINE SALES WITHOUT ADS (MERCHANT)
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: Organic Sales Strategy', 'Selling without ads', 1
FROM academy_courses WHERE slug = 'online-sales-without-ads'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Content Marketing', 'Attracting with content', 2
FROM academy_courses WHERE slug = 'online-sales-without-ads'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Relationship Selling', 'Customer relationships', 3
FROM academy_courses WHERE slug = 'online-sales-without-ads'
ON CONFLICT DO NOTHING;

-- PET BUSINESSES
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: Pet Business Marketing', 'Marketing to pet owners', 1
FROM academy_courses WHERE slug = 'local-paws-passport-petconnect-crm'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Local Pet Community', 'Go-to pet business', 2
FROM academy_courses WHERE slug = 'local-paws-passport-petconnect-crm'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Pet Owner Loyalty', 'Lifetime customers', 3
FROM academy_courses WHERE slug = 'local-paws-passport-petconnect-crm'
ON CONFLICT DO NOTHING;

-- PRICING & PROFITABILITY
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: Pricing Strategy', 'Strategic pricing', 1
FROM academy_courses WHERE slug = 'pricing-profitability'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Value-Based Pricing', 'What you''re worth', 2
FROM academy_courses WHERE slug = 'pricing-profitability'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Profit Maximization', 'Increasing margins', 3
FROM academy_courses WHERE slug = 'pricing-profitability'
ON CONFLICT DO NOTHING;

-- REVIEW GROWTH & PROTECTION
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: Review Generation', 'Getting reviews', 1
FROM academy_courses WHERE slug = 'review-growth-protection'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Reputation Management', 'Protecting reputation', 2
FROM academy_courses WHERE slug = 'review-growth-protection'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Leveraging Reviews', 'Using reviews', 3
FROM academy_courses WHERE slug = 'review-growth-protection'
ON CONFLICT DO NOTHING;

-- SCALING YOUR LOCAL BUSINESS
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: Scaling Fundamentals', 'Preparing to scale', 1
FROM academy_courses WHERE slug = 'scaling-local-business'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Systems & Processes', 'Scalable systems', 2
FROM academy_courses WHERE slug = 'scaling-local-business'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Team Building', 'Growing your team', 3
FROM academy_courses WHERE slug = 'scaling-local-business'
ON CONFLICT DO NOTHING;

-- SOCIAL MEDIA FOR LOCAL BUSINESS
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: Social Media Strategy', 'Planning social', 1
FROM academy_courses WHERE slug = 'social-media-local'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Content Creation', 'Engaging content', 2
FROM academy_courses WHERE slug = 'social-media-local'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Engagement & Growth', 'Growing following', 3
FROM academy_courses WHERE slug = 'social-media-local'
ON CONFLICT DO NOTHING;

-- START A LOCAL SERVICE SIDE HUSTLE
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: Choosing Your Service', 'Right side hustle', 1
FROM academy_courses WHERE slug = 'local-service-side-hustle'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Getting Started', 'Launch checklist', 2
FROM academy_courses WHERE slug = 'local-service-side-hustle'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Getting Customers', 'First clients', 3
FROM academy_courses WHERE slug = 'local-service-side-hustle'
ON CONFLICT DO NOTHING;

-- BLOG GROWTH SYSTEM (merchant duplicate)
INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 1: Blog Fundamentals', 'Why blogs work', 1
FROM academy_courses WHERE slug = 'blog-growth-merchant'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 2: Content Strategy', 'Planning content', 2
FROM academy_courses WHERE slug = 'blog-growth-merchant'
ON CONFLICT DO NOTHING;

INSERT INTO academy_modules (course_id, title, description, display_order)
SELECT id, 'Module 3: Writing & Publishing', 'Creating posts', 3
FROM academy_courses WHERE slug = 'blog-growth-merchant'
ON CONFLICT DO NOTHING;

-- Generate lessons using the lesson generation DO block
DO $$
DECLARE
  mod RECORD;
  lesson_count INTEGER;
  lesson_num INTEGER;
BEGIN
  FOR mod IN 
    SELECT 
      m.id as module_id,
      m.course_id,
      m.title as module_title,
      c.target_audience
    FROM academy_modules m
    JOIN academy_courses c ON c.id = m.course_id
    WHERE NOT EXISTS (SELECT 1 FROM academy_lessons l WHERE l.module_id = m.id)
    AND c.is_published = true
  LOOP
    lesson_count := 5;
    
    FOR lesson_num IN 1..lesson_count LOOP
      INSERT INTO academy_lessons (
        module_id,
        course_id,
        slug,
        title,
        display_order,
        content_markdown,
        est_minutes,
        is_preview
      ) VALUES (
        mod.module_id,
        mod.course_id,
        lower(regexp_replace(mod.module_title || '-lesson-' || lesson_num, '[^a-z0-9]+', '-', 'g')),
        CASE lesson_num
          WHEN 1 THEN 'Introduction to ' || mod.module_title
          WHEN 2 THEN 'Core Concepts and Fundamentals'
          WHEN 3 THEN 'Step-by-Step Implementation'
          WHEN 4 THEN 'Best Practices and Examples'
          WHEN 5 THEN 'Action Plan and Next Steps'
        END,
        lesson_num,
        '# ' || CASE lesson_num
          WHEN 1 THEN 'Introduction to ' || mod.module_title
          WHEN 2 THEN 'Core Concepts and Fundamentals'
          WHEN 3 THEN 'Step-by-Step Implementation'
          WHEN 4 THEN 'Best Practices and Examples'
          WHEN 5 THEN 'Action Plan and Next Steps'
        END || E'\n\nComprehensive lesson content for ' || mod.module_title || '.',
        15,
        (lesson_num = 1)
      );
    END LOOP;
  END LOOP;
END $$;
