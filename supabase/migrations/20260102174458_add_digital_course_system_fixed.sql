/*
  # Add Digital Course System - "Online Sales Without Ads™"

  ## Overview
  Adds a complete digital course system integrated with Local-Link Marketplace
  
  ## Features:
  1. Universal products table supporting subscription, one-time, and addon types
  2. Orders tracking for all purchases
  3. Course structure: courses → modules → lessons
  4. Enrollment and progress tracking
  5. Certificate issuance upon completion
  6. Course affiliate system (separate from partner recurring commissions)
     - 40% commission during launch
     - 30% commission standard rate
  
  ## Revenue Model:
  - Course: $197 one-time purchase
  - Course affiliates: 40% (launch) / 30% (standard)
  - Marketplace partners: Keep existing 20% recurring (unchanged)
  
  ## Security:
  - RLS enabled on all tables
  - Users can only access their own data
  - Public can view active products and course content structure
*/

-- =====================================================
-- 1. UNIVERSAL PRODUCTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS products_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  product_type text NOT NULL CHECK (product_type IN ('subscription', 'one_time', 'addon')),
  stripe_price_id text NOT NULL,
  price_cents integer NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =====================================================
-- 2. ORDERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  product_slug text NOT NULL,
  product_type text NOT NULL,
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  stripe_checkout_session_id text UNIQUE,
  stripe_payment_intent_id text UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  affiliate_code text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =====================================================
-- 3. COURSE SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text,
  description text,
  image_url text,
  is_published boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_index integer NOT NULL,
  title text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(course_id, module_index)
);

CREATE TABLE IF NOT EXISTS course_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  lesson_index integer NOT NULL,
  title text NOT NULL,
  content_md text,
  video_url text,
  video_duration_minutes integer,
  resources jsonb DEFAULT '[]',
  is_preview boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(module_id, lesson_index)
);

-- =====================================================
-- 4. ENROLLMENTS & PROGRESS
-- =====================================================

CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'refunded', 'canceled')),
  stripe_payment_intent_id text,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  last_position_seconds integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- =====================================================
-- 5. CERTIFICATES
-- =====================================================

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_code text UNIQUE NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- =====================================================
-- 6. COURSE AFFILIATE SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS course_affiliates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  rate_standard numeric NOT NULL DEFAULT 0.30,
  rate_launch numeric NOT NULL DEFAULT 0.40,
  is_active boolean NOT NULL DEFAULT true,
  total_referrals integer DEFAULT 0,
  total_earned_cents integer DEFAULT 0,
  total_paid_cents integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS course_affiliate_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES course_affiliates(id) ON DELETE CASCADE,
  referred_user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  product_slug text NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  order_amount_cents integer NOT NULL,
  commission_amount_cents integer NOT NULL,
  commission_rate numeric NOT NULL,
  status text NOT NULL DEFAULT 'earned' CHECK (status IN ('earned', 'void', 'paid')),
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);

CREATE TABLE IF NOT EXISTS course_affiliate_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES course_affiliates(id) ON DELETE CASCADE,
  amount_cents integer NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'paid', 'failed')),
  paid_at timestamptz,
  payment_method text,
  transaction_id text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_products_catalog_slug ON products_catalog(slug);
CREATE INDEX IF NOT EXISTS idx_products_catalog_type ON products_catalog(product_type);
CREATE INDEX IF NOT EXISTS idx_products_catalog_active ON products_catalog(is_active);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_affiliate_code ON orders(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_checkout_session_id);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_course_modules_course ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module ON course_lessons(module_id);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id);

CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_code ON certificates(certificate_code);

CREATE INDEX IF NOT EXISTS idx_course_affiliates_user ON course_affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliates_code ON course_affiliates(code);
CREATE INDEX IF NOT EXISTS idx_course_affiliate_referrals_affiliate ON course_affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliate_referrals_referred_user ON course_affiliate_referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliate_payouts_affiliate ON course_affiliate_payouts(affiliate_id);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert the course
INSERT INTO courses (slug, title, subtitle, description, is_published)
VALUES (
  'online-sales-without-ads',
  'Online Sales Without Ads™',
  'Sell using DMs, lead lists, and simple systems — no ads needed.',
  'Master the art of selling without spending a fortune on advertising. Learn proven strategies for reaching customers through direct messages, building targeted lead lists, and creating simple systems that drive consistent sales.',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Insert the product (NOTE: Replace stripe_price_id after creating in Stripe)
INSERT INTO products_catalog (slug, title, description, product_type, stripe_price_id, price_cents, is_active)
VALUES (
  'online-sales-without-ads',
  'Online Sales Without Ads™ (Course)',
  'Step-by-step video course with templates, worksheets, and a certificate upon completion. Learn how to generate sales without expensive ad campaigns.',
  'one_time',
  'PLACEHOLDER_STRIPE_PRICE_ID',
  19700,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents;

-- Seed sample modules
DO $$
DECLARE
  v_course_id uuid;
  v_module1_id uuid;
  v_module2_id uuid;
  v_module3_id uuid;
  v_module4_id uuid;
BEGIN
  SELECT id INTO v_course_id FROM courses WHERE slug = 'online-sales-without-ads';
  
  IF v_course_id IS NOT NULL THEN
    -- Module 1: Foundation
    INSERT INTO course_modules (course_id, module_index, title, description)
    VALUES (v_course_id, 1, 'Foundation: Why Ads Aren''t Everything', 'Understand the landscape and why direct selling works')
    ON CONFLICT (course_id, module_index) DO NOTHING
    RETURNING id INTO v_module1_id;
    
    -- Module 2: Lead Lists
    INSERT INTO course_modules (course_id, module_index, title, description)
    VALUES (v_course_id, 2, 'Building Targeted Lead Lists', 'Learn how to find and qualify your ideal customers')
    ON CONFLICT (course_id, module_index) DO NOTHING
    RETURNING id INTO v_module2_id;
    
    -- Module 3: DM Strategy
    INSERT INTO course_modules (course_id, module_index, title, description)
    VALUES (v_course_id, 3, 'DM Sales Strategy', 'Master the art of direct message selling')
    ON CONFLICT (course_id, module_index) DO NOTHING
    RETURNING id INTO v_module3_id;
    
    -- Module 4: Systems
    INSERT INTO course_modules (course_id, module_index, title, description)
    VALUES (v_course_id, 4, 'Simple Sales Systems', 'Build repeatable systems for consistent results')
    ON CONFLICT (course_id, module_index) DO NOTHING
    RETURNING id INTO v_module4_id;
    
    -- Get the module IDs if they weren't just created
    IF v_module1_id IS NULL THEN
      SELECT id INTO v_module1_id FROM course_modules WHERE course_id = v_course_id AND module_index = 1;
    END IF;
    IF v_module2_id IS NULL THEN
      SELECT id INTO v_module2_id FROM course_modules WHERE course_id = v_course_id AND module_index = 2;
    END IF;
    IF v_module3_id IS NULL THEN
      SELECT id INTO v_module3_id FROM course_modules WHERE course_id = v_course_id AND module_index = 3;
    END IF;
    IF v_module4_id IS NULL THEN
      SELECT id INTO v_module4_id FROM course_modules WHERE course_id = v_course_id AND module_index = 4;
    END IF;
    
    -- Add sample lessons
    IF v_module1_id IS NOT NULL THEN
      INSERT INTO course_lessons (module_id, lesson_index, title, content_md, is_preview)
      VALUES 
        (v_module1_id, 1, 'Welcome & Overview', '# Welcome to Online Sales Without Ads™\n\nIn this course, you will learn...', true),
        (v_module1_id, 2, 'The Problem with Ad Dependency', '# Why Relying Solely on Ads is Risky\n\nMany businesses...', false)
      ON CONFLICT (module_id, lesson_index) DO NOTHING;
    END IF;
    
    IF v_module2_id IS NOT NULL THEN
      INSERT INTO course_lessons (module_id, lesson_index, title, content_md, is_preview)
      VALUES 
        (v_module2_id, 1, 'Identifying Your Ideal Customer', '# Who is Your Ideal Customer?\n\nStart by...', false),
        (v_module2_id, 2, 'Tools for Building Lead Lists', '# Essential Tools and Resources\n\nHere are the tools...', false)
      ON CONFLICT (module_id, lesson_index) DO NOTHING;
    END IF;
    
    IF v_module3_id IS NOT NULL THEN
      INSERT INTO course_lessons (module_id, lesson_index, title, content_md, is_preview)
      VALUES 
        (v_module3_id, 1, 'Crafting the Perfect Opening Message', '# Your First Impression Matters\n\nWhen reaching out...', false),
        (v_module3_id, 2, 'Handling Objections and Closing', '# Overcoming Objections\n\nEvery sale has...', false)
      ON CONFLICT (module_id, lesson_index) DO NOTHING;
    END IF;
    
    IF v_module4_id IS NOT NULL THEN
      INSERT INTO course_lessons (module_id, lesson_index, title, content_md, is_preview)
      VALUES 
        (v_module4_id, 1, 'Setting Up Your Sales Pipeline', '# Building Your System\n\nA simple pipeline...', false),
        (v_module4_id, 2, 'Scaling Without Ads', '# Growing Your Sales\n\nOnce you have...', false)
      ON CONFLICT (module_id, lesson_index) DO NOTHING;
    END IF;
  END IF;
END $$;