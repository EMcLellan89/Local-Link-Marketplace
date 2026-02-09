/*
  # Add Blog Growth System Courses to Local-Link Marketplace
  
  ## Overview
  Creates two courses for the Local-Link Blog Growth System:
  1. Merchant Course (PAID): "Blog Growth System for Local Businesses"
  2. Partner Course (FREE): "Blog Income System"
  
  ## Merchant Course
  - Target: Local business owners
  - Pricing: $297 (self-serve), $497 (with templates), $997 (with DFY)
  - 8 Modules, ~40 lessons
  - Outcome: Live blog, content system, traffic + leads
  
  ## Partner Course
  - Target: Partners wanting blog income
  - Pricing: FREE (ecosystem growth)
  - 7 Modules, ~35 lessons
  - Outcome: Monetizable blogging skill, client pipeline
  
  ## Products Created
  - blog-growth-merchant-basic ($297)
  - blog-growth-merchant-pro ($497)
  - blog-growth-merchant-dfy ($997)
  - blog-growth-partner-free (FREE)
*/

-- =====================================================
-- 1. CREATE MERCHANT COURSE
-- =====================================================

INSERT INTO courses (slug, title, subtitle, description, is_published)
VALUES (
  'blog-growth-merchant',
  'Blog Growth System for Local Businesses',
  'Turn your blog into a lead-generating machine',
  'Master the art of blogging for local SEO. Learn to create content that ranks in Google, attracts qualified leads, and builds authority in your market. Perfect for business owners who want to reduce ad spend and own their traffic.',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  updated_at = now();

-- =====================================================
-- 2. CREATE PARTNER COURSE
-- =====================================================

INSERT INTO courses (slug, title, subtitle, description, is_published)
VALUES (
  'blog-growth-partner',
  'Blog Income System: Start a Side Hustle Writing Blogs',
  'Turn blogging into recurring income',
  'Learn how to write blogs that businesses pay for. Master local SEO content, pricing strategies, and client acquisition through the Local-Link marketplace. Start earning immediately with built-in demand.',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  updated_at = now();

-- =====================================================
-- 3. CREATE MERCHANT COURSE PRODUCTS
-- =====================================================

-- Basic Package: $297
INSERT INTO products_catalog (
  slug, 
  title, 
  description, 
  product_type, 
  stripe_price_id, 
  price_cents, 
  is_active,
  metadata
)
VALUES (
  'blog-growth-merchant-basic',
  'Blog Growth System - Basic',
  'Complete blog training for local businesses. 8 modules, 40+ lessons, lifetime access. Learn to write, rank, and convert with blogs.',
  'one_time',
  'price_blog_merchant_basic_297',
  29700,
  true,
  jsonb_build_object(
    'course_slug', 'blog-growth-merchant',
    'includes', json_build_array(
      'Full course access',
      '8 comprehensive modules',
      '40+ video lessons',
      'Blog setup checklist',
      'Topic generator tool',
      'Lifetime access',
      'Community support'
    ),
    'target_audience', 'merchant',
    'commission_rate', 0.30
  )
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents,
  metadata = EXCLUDED.metadata,
  updated_at = now();

-- Pro Package: $497
INSERT INTO products_catalog (
  slug, 
  title, 
  description, 
  product_type, 
  stripe_price_id, 
  price_cents, 
  is_active,
  metadata
)
VALUES (
  'blog-growth-merchant-pro',
  'Blog Growth System - Pro',
  'Everything in Basic PLUS done-for-you templates, AI prompts, and 50 pre-written blog outlines. Start blogging immediately.',
  'one_time',
  'price_blog_merchant_pro_497',
  49700,
  true,
  jsonb_build_object(
    'course_slug', 'blog-growth-merchant',
    'includes', json_build_array(
      'Everything in Basic',
      '50 blog post templates',
      'AI prompt library',
      'Blog calendar tool',
      'CTA swipe file',
      'Distribution checklist',
      'Priority email support'
    ),
    'target_audience', 'merchant',
    'commission_rate', 0.30,
    'is_featured', true
  )
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents,
  metadata = EXCLUDED.metadata,
  updated_at = now();

-- DFY Package: $997
INSERT INTO products_catalog (
  slug, 
  title, 
  description, 
  product_type, 
  stripe_price_id, 
  price_cents, 
  is_active,
  metadata
)
VALUES (
  'blog-growth-merchant-dfy',
  'Blog Growth System - Done-For-You',
  'Everything in Pro PLUS we write your first 5 blogs for you. Get ranked content written by Local-Link certified partners.',
  'one_time',
  'price_blog_merchant_dfy_997',
  99700,
  true,
  jsonb_build_object(
    'course_slug', 'blog-growth-merchant',
    'includes', json_build_array(
      'Everything in Pro',
      '5 custom blogs written for you',
      'SEO optimization included',
      'Keyword research',
      'Content calendar setup',
      'White-glove onboarding',
      'Direct partner support'
    ),
    'target_audience', 'merchant',
    'commission_rate', 0.30,
    'creates_job_listing', true,
    'job_credits', 5
  )
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents,
  metadata = EXCLUDED.metadata,
  updated_at = now();

-- =====================================================
-- 4. CREATE PARTNER COURSE PRODUCT (FREE)
-- =====================================================

INSERT INTO products_catalog (
  slug, 
  title, 
  description, 
  product_type, 
  stripe_price_id, 
  price_cents, 
  is_active,
  metadata
)
VALUES (
  'blog-growth-partner-free',
  'Blog Income System - Partner Training',
  'FREE training for partners. Learn to write blogs businesses pay for and earn through the Local-Link marketplace. Start making money immediately.',
  'one_time',
  'price_blog_partner_free',
  0,
  true,
  jsonb_build_object(
    'course_slug', 'blog-growth-partner',
    'includes', json_build_array(
      '7 comprehensive modules',
      'Blog writing mastery',
      'Pricing calculator',
      'Client acquisition system',
      'Access to merchant jobs',
      'Partner certification',
      'Marketplace priority'
    ),
    'target_audience', 'partner',
    'is_free', true,
    'requires_partner_role', true
  )
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

-- =====================================================
-- 5. ADD TO MARKETPLACE AFFILIATE PRODUCTS
-- =====================================================

INSERT INTO marketplace_affiliate_products (
  sku,
  name,
  description,
  type,
  price_cents,
  currency,
  commission_rate_bp,
  active,
  recurring,
  stripe_price_id,
  category,
  metadata
)
VALUES
  (
    'blog-growth-merchant-basic',
    'Blog Growth System - Basic',
    'Complete blog training: 8 modules, 40+ lessons, lifetime access. Learn to write, rank, and convert with blogs.',
    'course',
    29700,
    'usd',
    3000,
    true,
    false,
    'price_blog_merchant_basic_297',
    'courses',
    jsonb_build_object('target_audience', 'merchant', 'course_slug', 'blog-growth-merchant')
  ),
  (
    'blog-growth-merchant-pro',
    'Blog Growth System - Pro',
    'Training + templates + AI prompts + 50 blog outlines. Everything you need to start blogging immediately.',
    'course',
    49700,
    'usd',
    3000,
    true,
    false,
    'price_blog_merchant_pro_497',
    'courses',
    jsonb_build_object('target_audience', 'merchant', 'course_slug', 'blog-growth-merchant', 'is_featured', true)
  ),
  (
    'blog-growth-merchant-dfy',
    'Blog Growth System - Done-For-You',
    'Training + templates + 5 blogs written for you by certified partners. White-glove service.',
    'course',
    99700,
    'usd',
    3000,
    true,
    false,
    'price_blog_merchant_dfy_997',
    'courses',
    jsonb_build_object('target_audience', 'merchant', 'course_slug', 'blog-growth-merchant', 'creates_job_listing', true)
  )
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  stripe_price_id = EXCLUDED.stripe_price_id,
  metadata = EXCLUDED.metadata;
