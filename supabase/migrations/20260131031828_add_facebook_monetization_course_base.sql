/*
  # Facebook Monetization for Local Businesses™ - Course Base

  1. Course + 8 Modules
  2. Marketplace Product
  3. Target: both merchants & partners
  
  Revenue: $197 public | FREE included | 25% partner commission
*/

-- Insert Course
INSERT INTO courses (
  slug,
  title,
  subtitle,
  description,
  image_url,
  is_published,
  target_audience
) VALUES (
  'facebook-monetization-local',
  'Facebook Monetization for Local Businesses™',
  'Turn Views Into Leads, Sales, and Monthly Income',
  'Master Facebook monetization: in-stream ads, direct sales, subscriptions, and strategic funnels. Includes templates, scripts, and Local-Link integration. 8 modules, 31 lessons, certification included.',
  'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg',
  true,
  'both'
) ON CONFLICT (slug) DO NOTHING;

-- Insert 8 Modules
INSERT INTO course_modules (course_id, module_index, title, description)
SELECT c.id, 1, 'The Facebook Money Machine', 'How Facebook pays you, income models, and monetization myths busted.'
FROM courses c WHERE c.slug = 'facebook-monetization-local'
ON CONFLICT (course_id, module_index) DO NOTHING;

INSERT INTO course_modules (course_id, module_index, title, description)
SELECT c.id, 2, 'Building a Monetizable Profile', 'Pro mode setup, authority branding, and trust signals that convert.'
FROM courses c WHERE c.slug = 'facebook-monetization-local'
ON CONFLICT (course_id, module_index) DO NOTHING;

INSERT INTO course_modules (course_id, module_index, title, description)
SELECT c.id, 3, 'Content That Gets Paid', '4 profitable post types, Reels mastery, and monetizable long-form videos.'
FROM courses c WHERE c.slug = 'facebook-monetization-local'
ON CONFLICT (course_id, module_index) DO NOTHING;

INSERT INTO course_modules (course_id, module_index, title, description)
SELECT c.id, 4, 'Monetization Methods', 'In-stream ads, DM sales systems, fan subscriptions, and service packages.'
FROM courses c WHERE c.slug = 'facebook-monetization-local'
ON CONFLICT (course_id, module_index) DO NOTHING;

INSERT INTO course_modules (course_id, module_index, title, description)
SELECT c.id, 5, 'Facebook Funnels', 'Post→DM→Deal funnels, Messenger automation, and lead magnets that work.'
FROM courses c WHERE c.slug = 'facebook-monetization-local'
ON CONFLICT (course_id, module_index) DO NOTHING;

INSERT INTO course_modules (course_id, module_index, title, description)
SELECT c.id, 6, 'Local-Link Power Stack', 'CRM integration, automated funnels, referral systems, and partner tools.'
FROM courses c WHERE c.slug = 'facebook-monetization-local'
ON CONFLICT (course_id, module_index) DO NOTHING;

INSERT INTO course_modules (course_id, module_index, title, description)
SELECT c.id, 7, 'Scaling to $5K+ Per Month', 'Key metrics, content multiplication, hiring, and delegation strategies.'
FROM courses c WHERE c.slug = 'facebook-monetization-local'
ON CONFLICT (course_id, module_index) DO NOTHING;

INSERT INTO course_modules (course_id, module_index, title, description)
SELECT c.id, 8, 'Launch Plan & Certification', '30-day plan, First $1K Challenge, and certification exam.'
FROM courses c WHERE c.slug = 'facebook-monetization-local'
ON CONFLICT (course_id, module_index) DO NOTHING;

-- Add to Marketplace
INSERT INTO products_catalog (
  slug,
  title,
  description,
  product_type,
  stripe_price_id,
  price_cents,
  is_active,
  metadata
) VALUES (
  'facebook-monetization-course',
  'Facebook Monetization for Local Businesses™',
  'Complete course: 8 modules, 31 lessons, certification, templates, scripts. Turn Facebook into a predictable revenue engine. Merchant & Partner webinars included.',
  'one_time',
  'price_facebook_monetization_197',
  19700,
  true,
  jsonb_build_object(
    'course_slug', 'facebook-monetization-local',
    'target_audience', 'both',
    'includes_certification', true,
    'partner_commission_percent', 25,
    'access_type', 'lifetime',
    'includes_webinars', true,
    'bonuses', jsonb_build_array(
      'DM Closing Script Pack',
      'Content Calendar Templates',
      'Funnel Builder Maps',
      'Income Model Planner',
      'Launch Workbook',
      'Merchant Webinar: Monetizing Your Business',
      'Partner Webinar: Selling Facebook Services'
    )
  )
) ON CONFLICT (slug) DO NOTHING;
