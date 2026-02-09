/*
  # Add Product Tiers for Merchant Courses
  
  1. Products for all merchant courses
    - Uses 'one_time' product_type (correct enum value)
    - Proper pricing tiers as specified
*/

-- Get course IDs and insert products
DO $$
DECLARE
  v_blog_growth_id uuid;
  v_seo_id uuid;
  v_visibility_id uuid;
  v_reactivation_id uuid;
  v_review_id uuid;
  v_conversion_id uuid;
  v_advertising_id uuid;
  v_social_id uuid;
  v_hiring_id uuid;
  v_automation_id uuid;
  v_financial_id uuid;
  v_pricing_id uuid;
  v_scaling_id uuid;
  v_marketplace_id uuid;
BEGIN
  -- Get course IDs
  SELECT id INTO v_blog_growth_id FROM courses WHERE slug = 'blog-growth-merchant';
  SELECT id INTO v_seo_id FROM courses WHERE slug = 'local-seo-foundations';
  SELECT id INTO v_visibility_id FROM courses WHERE slug = 'local-visibility-booster';
  SELECT id INTO v_reactivation_id FROM courses WHERE slug = 'customer-reactivation';
  SELECT id INTO v_review_id FROM courses WHERE slug = 'review-growth-protection';
  SELECT id INTO v_conversion_id FROM courses WHERE slug = 'lead-conversion-local';
  SELECT id INTO v_advertising_id FROM courses WHERE slug = 'local-advertising-mastery';
  SELECT id INTO v_social_id FROM courses WHERE slug = 'social-media-local';
  SELECT id INTO v_hiring_id FROM courses WHERE slug = 'hiring-outsourcing-local';
  SELECT id INTO v_automation_id FROM courses WHERE slug = 'automation-ai-local';
  SELECT id INTO v_financial_id FROM courses WHERE slug = 'financial-basics-small-business';
  SELECT id INTO v_pricing_id FROM courses WHERE slug = 'pricing-profitability';
  SELECT id INTO v_scaling_id FROM courses WHERE slug = 'scaling-local-business';
  SELECT id INTO v_marketplace_id FROM courses WHERE slug = 'marketplace-mastery-merchant';

  -- Blog Growth System ($997 - $2,997)
  IF v_blog_growth_id IS NOT NULL THEN
    INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
    VALUES 
      ('blog-growth-starter', 'Blog Growth System — Starter', 'Complete course access + templates', 99700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'blog-growth-merchant', 'tier', 'starter')),
      ('blog-growth-professional', 'Blog Growth System — Professional', 'Course + templates + 1-on-1 review session', 149700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'blog-growth-merchant', 'tier', 'professional')),
      ('blog-growth-premium', 'Blog Growth System — Premium', 'Course + templates + 3 review sessions + certificate', 299700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'blog-growth-merchant', 'tier', 'premium'))
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Local SEO Foundations ($497 - $997)
  IF v_seo_id IS NOT NULL THEN
    INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
    VALUES 
      ('local-seo-basic', 'Local SEO Foundations — Basic', 'Complete course access', 49700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'local-seo-foundations', 'tier', 'basic')),
      ('local-seo-advanced', 'Local SEO Foundations — Advanced', 'Course + SEO audit template + certification', 99700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'local-seo-foundations', 'tier', 'advanced'))
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Visibility Booster ($297 - $697)
  IF v_visibility_id IS NOT NULL THEN
    INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
    VALUES 
      ('visibility-booster-starter', 'Visibility Booster — Starter', 'Complete course access', 29700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'local-visibility-booster', 'tier', 'starter')),
      ('visibility-booster-pro', 'Visibility Booster — Pro', 'Course + directory submission checklist + templates', 69700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'local-visibility-booster', 'tier', 'pro'))
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Customer Reactivation ($297 - $597)
  IF v_reactivation_id IS NOT NULL THEN
    INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
    VALUES 
      ('reactivation-basic', 'Customer Reactivation — Basic', 'Complete course access', 29700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'customer-reactivation', 'tier', 'basic')),
      ('reactivation-complete', 'Customer Reactivation — Complete', 'Course + email/SMS templates + automation guide', 59700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'customer-reactivation', 'tier', 'complete'))
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Review Growth ($197 - $497)
  IF v_review_id IS NOT NULL THEN
    INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
    VALUES 
      ('review-growth-basic', 'Review Growth & Protection — Basic', 'Complete course access', 19700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'review-growth-protection', 'tier', 'basic')),
      ('review-growth-complete', 'Review Growth & Protection — Complete', 'Course + review request templates + response scripts', 49700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'review-growth-protection', 'tier', 'complete'))
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Lead Conversion ($297 - $697)
  IF v_conversion_id IS NOT NULL THEN
    INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
    VALUES 
      ('lead-conversion-starter', 'Lead Conversion — Starter', 'Complete course access', 29700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'lead-conversion-local', 'tier', 'starter')),
      ('lead-conversion-pro', 'Lead Conversion — Pro', 'Course + scripts + follow-up templates', 69700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'lead-conversion-local', 'tier', 'pro'))
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Advertising Mastery ($497 - $997)
  IF v_advertising_id IS NOT NULL THEN
    INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
    VALUES 
      ('advertising-basic', 'Local Advertising Mastery — Basic', 'Complete course access', 49700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'local-advertising-mastery', 'tier', 'basic')),
      ('advertising-pro', 'Local Advertising Mastery — Pro', 'Course + ad templates + ROI calculator', 99700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'local-advertising-mastery', 'tier', 'pro'))
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Social Media ($197 - $497)
  IF v_social_id IS NOT NULL THEN
    INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
    VALUES 
      ('social-media-basic', 'Social Media for Local Business — Basic', 'Complete course access', 19700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'social-media-local', 'tier', 'basic')),
      ('social-media-complete', 'Social Media for Local Business — Complete', 'Course + content calendar + templates', 49700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'social-media-local', 'tier', 'complete'))
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Hiring & Outsourcing ($297 - $697)
  IF v_hiring_id IS NOT NULL THEN
    INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
    VALUES 
      ('hiring-basic', 'Hiring & Outsourcing — Basic', 'Complete course access', 29700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'hiring-outsourcing-local', 'tier', 'basic')),
      ('hiring-complete', 'Hiring & Outsourcing — Complete', 'Course + vendor evaluation templates + contracts', 69700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'hiring-outsourcing-local', 'tier', 'complete'))
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Automation & AI ($497 - $997)
  IF v_automation_id IS NOT NULL THEN
    INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
    VALUES 
      ('automation-ai-basic', 'Automation & AI — Basic', 'Complete course access', 49700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'automation-ai-local', 'tier', 'basic')),
      ('automation-ai-advanced', 'Automation & AI — Advanced', 'Course + AI prompt library + automation blueprints', 99700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'automation-ai-local', 'tier', 'advanced'))
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Financial Basics ($197 - $497)
  IF v_financial_id IS NOT NULL THEN
    INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
    VALUES 
      ('financial-basic', 'Financial Basics — Basic', 'Complete course access', 19700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'financial-basics-small-business', 'tier', 'basic')),
      ('financial-complete', 'Financial Basics — Complete', 'Course + budget templates + ROI calculators', 49700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'financial-basics-small-business', 'tier', 'complete'))
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Pricing & Profitability ($297 - $597)
  IF v_pricing_id IS NOT NULL THEN
    INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
    VALUES 
      ('pricing-basic', 'Pricing & Profitability — Basic', 'Complete course access', 29700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'pricing-profitability', 'tier', 'basic')),
      ('pricing-complete', 'Pricing & Profitability — Complete', 'Course + pricing calculator + value communication scripts', 59700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'pricing-profitability', 'tier', 'complete'))
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Scaling ($997 - $1,997)
  IF v_scaling_id IS NOT NULL THEN
    INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
    VALUES 
      ('scaling-standard', 'Scaling Your Business — Standard', 'Complete course access', 99700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'scaling-local-business', 'tier', 'standard')),
      ('scaling-premium', 'Scaling Your Business — Premium', 'Course + SOP templates + 1-on-1 strategy session', 199700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'scaling-local-business', 'tier', 'premium'))
    ON CONFLICT (slug) DO NOTHING;
  END IF;

  -- Marketplace Mastery ($197 - $497)
  IF v_marketplace_id IS NOT NULL THEN
    INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
    VALUES 
      ('marketplace-basic', 'Marketplace Mastery — Basic', 'Complete course access', 19700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'marketplace-mastery-merchant', 'tier', 'basic')),
      ('marketplace-complete', 'Marketplace Mastery — Complete', 'Course + optimization checklist + partner discovery guide', 49700, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('course_slug', 'marketplace-mastery-merchant', 'tier', 'complete'))
    ON CONFLICT (slug) DO NOTHING;
  END IF;

END $$;
