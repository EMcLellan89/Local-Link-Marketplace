/*
  # Add Expanded Done-For-You Services
  
  1. Letter Writing Services (3 tiers)
  2. Email Marketing (setup + 3 monthly)
  3. SMS Marketing (setup + 3 monthly)
  4. Google Business Profile Management
  5. Landing Page Creation
  6. Social Media Content
  7. Directory & Citation Management
  8. Sales Scripts & Call Handling
  9. Proposal & Estimate Templates
  10. Reputation Response Management
  
  All services positioned for partner fulfillment
*/

-- Letter Writing Services
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-letter-writing-single', 'Letter Writing — Single Letter', 'Professionally written letter for customer reactivation, business outreach, or partnership development', 9900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'letter_writing', 'quantity', 1)),
  ('dfy-letter-writing-sequence', 'Letter Writing — 3-Letter Sequence', 'Three-letter campaign sequence designed to maximize response and engagement', 24900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'letter_writing', 'quantity', 3)),
  ('dfy-letter-writing-monthly', 'Letter Writing — Monthly Campaign', 'Ongoing monthly letter campaigns with custom messaging and audience targeting', 39900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'letter_writing', 'recurring', true))
ON CONFLICT (slug) DO NOTHING;

-- Email Marketing DFY
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-email-marketing-setup', 'Email Marketing — Setup', 'Complete email marketing setup including campaign strategy, list segmentation, and automation configuration', 29900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'email_marketing', 'setup', true)),
  ('dfy-email-marketing-lite', 'Email Marketing — Lite', 'Monthly email campaign management with 2-4 sends per month', 29900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'email_marketing', 'tier', 'lite', 'sends_per_month', '2-4')),
  ('dfy-email-marketing-pro', 'Email Marketing — Pro', 'Professional email marketing with 4-8 sends, segmentation, and performance optimization', 49900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'email_marketing', 'tier', 'pro', 'sends_per_month', '4-8')),
  ('dfy-email-marketing-scale', 'Email Marketing — Scale', 'Enterprise email marketing with 8+ sends, advanced automation, and A/B testing', 69900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'email_marketing', 'tier', 'scale', 'sends_per_month', '8+'))
ON CONFLICT (slug) DO NOTHING;

-- SMS Marketing DFY
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-sms-marketing-setup', 'SMS Marketing — Setup', 'SMS campaign setup with compliance, opt-in flows, and automation rules', 19900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'sms_marketing', 'setup', true)),
  ('dfy-sms-marketing-lite', 'SMS Marketing — Lite', 'Monthly SMS campaigns for appointment reminders, promotions, and reactivation', 19900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'sms_marketing', 'tier', 'lite')),
  ('dfy-sms-marketing-pro', 'SMS Marketing — Pro', 'Professional SMS marketing with segmentation and performance tracking', 34900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'sms_marketing', 'tier', 'pro')),
  ('dfy-sms-marketing-scale', 'SMS Marketing — Scale', 'Enterprise SMS with advanced automation and multi-campaign management', 49900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'sms_marketing', 'tier', 'scale'))
ON CONFLICT (slug) DO NOTHING;

-- Google Business Profile Management
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-gbp-setup', 'Google Business Profile — Setup', 'Complete GBP optimization including profile setup, photo optimization, and Q&A management', 19900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'gbp_management', 'setup', true)),
  ('dfy-gbp-monthly', 'Google Business Profile — Monthly Management', 'Ongoing GBP management with weekly posts, Q&A responses, and profile optimization', 29900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'gbp_management', 'recurring', true))
ON CONFLICT (slug) DO NOTHING;

-- Landing Page Creation
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-landing-page-single', 'Landing Page — Single Page', 'Custom landing page designed to convert traffic into leads with clear CTAs and mobile optimization', 79900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'landing_page', 'quantity', 1)),
  ('dfy-landing-page-ab-variant', 'Landing Page — A/B Variant Add-On', 'Additional landing page variant for split testing and conversion optimization', 19900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'landing_page', 'variant', true)),
  ('dfy-landing-page-optimization', 'Landing Page — Monthly Optimization', 'Ongoing landing page optimization with performance tracking and iterative improvements', 19900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'landing_page', 'optimization', true))
ON CONFLICT (slug) DO NOTHING;

-- Social Media Content
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-social-content-8', 'Social Media Content — 8 Posts/Month', 'Monthly social media content creation with 8 platform-ready posts', 29900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'social_content', 'posts_per_month', 8)),
  ('dfy-social-content-16', 'Social Media Content — 16 Posts/Month', 'Comprehensive social media content with 16 posts, scheduling, and engagement strategy', 49900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'social_content', 'posts_per_month', 16))
ON CONFLICT (slug) DO NOTHING;

-- Directory & Citation Management
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-citations-setup', 'Directory & Citation Management — Setup', 'Complete local directory setup across 50+ platforms to improve local SEO and trust signals', 29900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'citation_management', 'setup', true)),
  ('dfy-citations-maintenance', 'Directory & Citation Management — Maintenance', 'Ongoing citation monitoring, updates, and new directory additions', 14900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'citation_management', 'maintenance', true))
ON CONFLICT (slug) DO NOTHING;

-- Sales Scripts & Call Handling
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-sales-scripts-pack', 'Sales Scripts — Complete Pack', 'Professional sales scripts including discovery calls, objection handling, and closing scripts', 29900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'sales_scripts', 'pack', true)),
  ('dfy-sales-scripts-optimization', 'Call Handling Script Optimization — Monthly', 'Monthly script refinement based on call performance and conversion data', 9900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'sales_scripts', 'optimization', true))
ON CONFLICT (slug) DO NOTHING;

-- Proposal & Estimate Templates
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-proposals-template-set', 'Proposal & Estimate Templates — Set', 'Professional proposal and estimate templates customized for your industry and services', 19900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'proposals', 'template_set', true)),
  ('dfy-proposals-custom', 'Proposal & Estimate Templates — Custom', 'Fully customized proposals with your branding, pricing structure, and terms', 39900, 'one_time', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'proposals', 'custom', true))
ON CONFLICT (slug) DO NOTHING;

-- Reputation Response Management
INSERT INTO products_catalog (slug, title, description, price_cents, product_type, stripe_price_id, is_active, metadata)
VALUES 
  ('dfy-reputation-responses', 'Reputation Response Management — Monthly', 'Professional review response management across all platforms to protect and enhance your reputation', 9900, 'subscription', 'pending_stripe_setup', true, jsonb_build_object('service_type', 'reputation_responses', 'recurring', true))
ON CONFLICT (slug) DO NOTHING;
