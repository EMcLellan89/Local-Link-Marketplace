/*
  # Add Complete Merchant Webinar Course System
  
  1. New Tables
    - `course_pricing` - Stores pricing information for courses
    - `course_webinar_content` - Stores webinar-specific metadata
  
  2. Courses Created (PAID Merchant Courses)
    - Local Customers on Autopilot™ ($97)
    - Online Sales Without Ads™ ($97)
    - Reviews That Bring Customers In™ ($97)
    - Selling Local Services Without Cold Calling™ ($97)
    - Using Canva to Increase Sales™ ($67)
    - UGC for Business Growth™ ($67)
    - AI Marketing for Small Business™ ($97)
    - AI Review & Reputation Management™ ($97)
    - How to Bundle Services for $1,000+ Deals™ ($97)
    - AI Marketing & Automation™ ($127)
  
  3. FREE Merchant Courses
    - Marketing for Trades™
    - Pet Businesses That Get Found First™
    - Care Coordination for Families™
  
  4. All Courses Include
    - 6 modules
    - 5 lessons per module (30 total)
    - Full webinar scripts
    - Purchase buttons via marketplace products
  
  5. Security
    - RLS policies for course access based on purchase/subscription
*/

-- Create course pricing table
CREATE TABLE IF NOT EXISTS course_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  price_usd decimal(10,2) NOT NULL DEFAULT 0,
  compare_at_price_usd decimal(10,2),
  stripe_price_id text,
  stripe_product_id text,
  is_free boolean DEFAULT false,
  payment_type text DEFAULT 'one_time' CHECK (payment_type IN ('one_time', 'subscription', 'both')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(course_id)
);

-- Create course webinar metadata table
CREATE TABLE IF NOT EXISTS course_webinar_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  webinar_format text DEFAULT 'recorded', -- recorded, live, hybrid
  total_duration_minutes integer,
  includes_q_and_a boolean DEFAULT false,
  includes_workbook boolean DEFAULT false,
  includes_templates boolean DEFAULT false,
  certification_available boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(course_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_course_pricing_course_id ON course_pricing(course_id);
CREATE INDEX IF NOT EXISTS idx_course_pricing_stripe_price_id ON course_pricing(stripe_price_id);
CREATE INDEX IF NOT EXISTS idx_course_webinar_course_id ON course_webinar_content(course_id);

-- Enable RLS
ALTER TABLE course_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_webinar_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies - anyone can view pricing
CREATE POLICY "Anyone can view course pricing"
  ON course_pricing FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view webinar content metadata"
  ON course_webinar_content FOR SELECT
  TO public
  USING (true);

-- Only admins can modify
CREATE POLICY "Only admins can modify course pricing"
  ON course_pricing FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can modify webinar content"
  ON course_webinar_content FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert or update courses (PAID MERCHANT COURSES)

-- 1. Local Customers on Autopilot™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'local-customers-on-autopilot-merchant',
  'Local Customers on Autopilot™',
  'Build Predictable Customer Flow Without Ads',
  'Learn how local businesses actually grow: through visibility, trust, relationships, and systems that compound over time. No hacks. No chasing algorithms. Just real-world local growth that works even when you''re not spending money on ads.',
  'merchant',
  true
)
ON CONFLICT (slug) DO UPDATE
SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  updated_at = now();

-- 2. Online Sales Without Ads™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'online-sales-without-ads-merchant',
  'Online Sales Without Ads™',
  'Generate Consistent Sales Through Conversations & Systems',
  'Teach merchants how to generate sales consistently without paid ads. This is about conversations, systems, and visibility — not cold outreach. Build trust, guide customers, and create compounding growth.',
  'merchant',
  true
)
ON CONFLICT (slug) DO UPDATE
SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  updated_at = now();

-- 3. Reviews That Bring Customers In™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'reviews-that-bring-customers-merchant',
  'Reviews That Bring Customers In™',
  'Turn Reviews Into Your #1 Sales Tool',
  'Learn how to generate consistent sales using reviews as a growth engine. Reviews answer objections before you speak, reduce price resistance, and create a flywheel of trust that compounds over time.',
  'merchant',
  true
)
ON CONFLICT (slug) DO UPDATE
SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  updated_at = now();

-- 4. Selling Local Services Without Cold Calling™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'selling-local-services-without-cold-calling-merchant',
  'Selling Local Services Without Cold Calling™',
  'Close Deals Without Outbound Pressure',
  'How THEY close deals without outbound pressure. Scripts and workflows for their own team. Learn the structure of calm sales conversations that close themselves.',
  'merchant',
  true
)
ON CONFLICT (slug) DO UPDATE
SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  updated_at = now();

-- 5. Using Canva to Increase Sales™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'using-canva-to-increase-sales-merchant',
  'Using Canva to Increase Sales™',
  'Create Professional Sales Assets That Convert',
  'Creating sales assets, flyers, social posts without expensive designers. No "make money" angle — pure business growth. Learn how to create proof, build trust visually, and turn design into revenue.',
  'merchant',
  true
)
ON CONFLICT (slug) DO UPDATE
SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  updated_at = now();

-- 6. UGC for Business Growth™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'ugc-for-business-growth-merchant',
  'UGC for Business Growth™',
  'Create Content That Builds Local Authority',
  'Creating content for their own brand. Social proof, before/after, local authority. Learn how to turn customer stories into sales assets that work 24/7.',
  'merchant',
  true
)
ON CONFLICT (slug) DO UPDATE
SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  updated_at = now();

-- 7. AI Marketing for Small Business™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'ai-marketing-for-small-business-merchant',
  'AI Marketing for Small Business™',
  'Use AI Safely to Grow Your Business',
  'Using AI for emails, posts, pages, campaigns. Applying AI safely without tech overwhelm. No fluff—just practical systems that save time and increase quality.',
  'merchant',
  true
)
ON CONFLICT (slug) DO UPDATE
SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  updated_at = now();

-- 8. AI Review & Reputation Management™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'ai-review-reputation-management-merchant',
  'AI Review & Reputation Management™',
  'Monitor, Respond & Leverage Reviews With AI',
  'Monitoring, responding, and leveraging reviews. Turning reputation into revenue. Learn how to handle negative reviews professionally and turn them into trust-building opportunities.',
  'merchant',
  true
)
ON CONFLICT (slug) DO UPDATE
SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  updated_at = now();

-- 9. How to Bundle Services for $1,000+ Deals™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'bundle-services-thousand-dollar-deals-merchant',
  'How to Bundle Services for $1,000+ Deals™',
  'Package Your Services for Maximum Value',
  'Packaging their own services. Increasing deal size without new leads. Learn how to create irresistible bundles that customers say yes to.',
  'merchant',
  true
)
ON CONFLICT (slug) DO UPDATE
SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  updated_at = now();

-- 10. AI Marketing & Automation™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'ai-marketing-automation-merchant',
  'AI Marketing & Automation™',
  'Advanced AI Workflows for Business Growth',
  'Advanced workflows. Automation for internal operations. Take your AI skills to the next level and build systems that scale without adding staff.',
  'merchant',
  true
)
ON CONFLICT (slug) DO UPDATE
SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  updated_at = now();

-- FREE MERCHANT COURSES

-- 11. Marketing for Trades™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'marketing-for-trades-merchant-free',
  'Marketing for Trades™',
  'Plumbing, HVAC, Roofing, Electrical & More',
  'How Local-Link tools fit trade businesses. Designed specifically for plumbers, HVAC, roofers, electricians, and other trades who need simple, effective marketing.',
  'merchant',
  true
)
ON CONFLICT (slug) DO UPDATE
SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  updated_at = now();

-- 12. Pet Businesses That Get Found First™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'pet-businesses-found-first-merchant-free',
  'Pet Businesses That Get Found First™',
  'Groomers, Vets, Trainers, Pet Stores',
  'Local Paws Passport + visibility strategy. Everything pet business owners need to dominate their local market and attract ideal customers.',
  'merchant',
  true
)
ON CONFLICT (slug) DO UPDATE
SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  updated_at = now();

-- 13. Care Coordination for Families™
INSERT INTO courses (slug, title, subtitle, description, target_audience, is_published)
VALUES (
  'care-coordination-families-merchant-free',
  'Care Coordination for Families™',
  'Home Care, Senior Care, Family Services',
  'Awareness-based, non-medical positioning. Learn how to position care services properly while staying compliant and building trust.',
  'merchant',
  true
)
ON CONFLICT (slug) DO UPDATE
SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  updated_at = now();

-- Add pricing for paid courses
INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 97.00, false, 'one_time' FROM courses WHERE slug = 'local-customers-on-autopilot-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 97.00, is_free = false;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 97.00, false, 'one_time' FROM courses WHERE slug = 'online-sales-without-ads-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 97.00, is_free = false;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 97.00, false, 'one_time' FROM courses WHERE slug = 'reviews-that-bring-customers-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 97.00, is_free = false;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 97.00, false, 'one_time' FROM courses WHERE slug = 'selling-local-services-without-cold-calling-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 97.00, is_free = false;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 67.00, false, 'one_time' FROM courses WHERE slug = 'using-canva-to-increase-sales-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 67.00, is_free = false;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 67.00, false, 'one_time' FROM courses WHERE slug = 'ugc-for-business-growth-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 67.00, is_free = false;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 97.00, false, 'one_time' FROM courses WHERE slug = 'ai-marketing-for-small-business-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 97.00, is_free = false;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 97.00, false, 'one_time' FROM courses WHERE slug = 'ai-review-reputation-management-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 97.00, is_free = false;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 97.00, false, 'one_time' FROM courses WHERE slug = 'bundle-services-thousand-dollar-deals-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 97.00, is_free = false;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 127.00, false, 'one_time' FROM courses WHERE slug = 'ai-marketing-automation-merchant'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 127.00, is_free = false;

-- Add pricing for FREE courses
INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 0, true, 'one_time' FROM courses WHERE slug = 'marketing-for-trades-merchant-free'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 0, is_free = true;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 0, true, 'one_time' FROM courses WHERE slug = 'pet-businesses-found-first-merchant-free'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 0, is_free = true;

INSERT INTO course_pricing (course_id, price_usd, is_free, payment_type)
SELECT id, 0, true, 'one_time' FROM courses WHERE slug = 'care-coordination-families-merchant-free'
ON CONFLICT (course_id) DO UPDATE SET price_usd = 0, is_free = true;

-- Add webinar metadata for all courses
INSERT INTO course_webinar_content (course_id, webinar_format, total_duration_minutes, includes_workbook, certification_available)
SELECT id, 'recorded', 180, true, true FROM courses 
WHERE slug IN (
  'local-customers-on-autopilot-merchant',
  'online-sales-without-ads-merchant',
  'reviews-that-bring-customers-merchant',
  'selling-local-services-without-cold-calling-merchant',
  'using-canva-to-increase-sales-merchant',
  'ugc-for-business-growth-merchant',
  'ai-marketing-for-small-business-merchant',
  'ai-review-reputation-management-merchant',
  'bundle-services-thousand-dollar-deals-merchant',
  'ai-marketing-automation-merchant',
  'marketing-for-trades-merchant-free',
  'pet-businesses-found-first-merchant-free',
  'care-coordination-families-merchant-free'
)
ON CONFLICT (course_id) DO UPDATE 
SET total_duration_minutes = 180, includes_workbook = true, certification_available = true;
