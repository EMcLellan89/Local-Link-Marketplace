/*
  # Add Done-For-You Service Products
  
  1. Virtual Assistant Services (3 tiers)
  2. Blog Writing DFY (3 tiers)
  3. CRM Management DFY (setup + monthly)
  4. Review Management DFY (setup + monthly)
  5. Appointment Setting DFY
  6. AI Automation Setup DFY (setup + monthly)
  7. Growth Bundles (3 bundles)
  
  All DFY services with proper pricing and metadata
*/

-- Virtual Assistant Services (Recurring)
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-va-starter', 'Virtual Assistant — Starter', '10 hours per month of trained VA support for admin tasks, CRM updates, and basic follow-ups', 39900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'va', 'hours', 10, 'tier', 'starter')),
  ('dfy-va-growth', 'Virtual Assistant — Growth', '20 hours per month for lead follow-up, scheduling, inbox & CRM management', 74900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'va', 'hours', 20, 'tier', 'growth')),
  ('dfy-va-scale', 'Virtual Assistant — Scale', '40 hours per month for customer communications, job coordination, and reporting support', 129900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'va', 'hours', 40, 'tier', 'scale'))
ON CONFLICT (slug) DO NOTHING;

-- Blog Writing DFY (Recurring)
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-blog-2-month', 'Blog Writing DFY — 2 Blogs/Month', 'Professionally written, SEO-friendly blogs designed to rank locally and convert readers', 49900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'blog_writing', 'blogs_per_month', 2)),
  ('dfy-blog-4-month', 'Blog Writing DFY — 4 Blogs/Month', 'Double the content for accelerated SEO and authority building', 89900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'blog_writing', 'blogs_per_month', 4)),
  ('dfy-blog-8-month', 'Blog Writing DFY — 8 Blogs/Month', 'Maximum content velocity for competitive markets and rapid growth', 149900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'blog_writing', 'blogs_per_month', 8))
ON CONFLICT (slug) DO NOTHING;

-- CRM Management DFY
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-crm-setup', 'CRM Management — Setup', 'Complete CRM setup with pipeline, automation rules, and follow-up sequences', 49900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'crm_management', 'setup', true)),
  ('dfy-crm-monthly', 'CRM Management — Monthly', 'Ongoing CRM management, data cleanup, and optimization', 29900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'crm_management', 'recurring', true))
ON CONFLICT (slug) DO NOTHING;

-- Review Management DFY
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-review-setup', 'Review Management — Setup', 'Review request automation setup, monitoring configuration, and response framework', 19900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'review_management', 'setup', true)),
  ('dfy-review-monthly', 'Review Management — Monthly', 'Ongoing review monitoring, response guidance, and reputation tracking', 14900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'review_management', 'recurring', true))
ON CONFLICT (slug) DO NOTHING;

-- Appointment Setting DFY
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-appointment-setting', 'Appointment Setting — Done For You', 'Human-backed appointment setting with lead calling, booking, follow-up, and CRM updates', 79900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'appointment_setting', 'includes_calling', true))
ON CONFLICT (slug) DO NOTHING;

-- AI Automation Setup DFY
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-ai-automation-setup', 'AI Automation Setup — Done For You', 'AI receptionist, missed call recovery, and CRM automation configuration', 29900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'ai_automation', 'setup', true)),
  ('dfy-ai-automation-monthly', 'AI Automation Management — Monthly', 'Ongoing AI system management, optimization, and support', 14900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'ai_automation', 'recurring', true))
ON CONFLICT (slug) DO NOTHING;

-- Growth Bundles
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-bundle-starter-growth', 'Starter Growth Bundle', 'Blog Writing (2/mo) + VA Starter (10 hrs) — Save 15% vs individual pricing', 75900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'bundle', 'includes', array['blog_2', 'va_starter'], 'savings_percent', 15)),
  ('dfy-bundle-visibility-stack', 'Visibility Stack Bundle', 'Blog Writing (4/mo) + Review Management + SEO optimization — Complete visibility package', 129900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'bundle', 'includes', array['blog_4', 'review_mgmt', 'seo'], 'savings_percent', 20)),
  ('dfy-bundle-scale-stack', 'Scale Stack Bundle', 'VA Growth (20 hrs) + CRM Management + Appointment Setting — Full business operations support', 174900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'bundle', 'includes', array['va_growth', 'crm_mgmt', 'appointment_setting'], 'savings_percent', 20))
ON CONFLICT (slug) DO NOTHING;
