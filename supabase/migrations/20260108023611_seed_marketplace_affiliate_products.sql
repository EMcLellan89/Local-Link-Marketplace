/*
  # Seed Marketplace Affiliate Products

  Seeds the product catalog with commission rates:
  - 10% on CRMs and subscriptions
  - 15% on services and setup fees  
  - 20% on courses

  All commissions are one-time only (no residual).
*/

-- CRMs (10% commission = 1000 basis points)
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, active) VALUES
('tradehive_solo', 'TradeHive CRM - Solo', 'crm', 9900, 'usd', 1000, true),
('tradehive_team', 'TradeHive CRM - Team', 'crm', 14900, 'usd', 1000, true),
('adsuite_solo', 'AdSuite CRM - Solo', 'crm', 14900, 'usd', 1000, true),
('adsuite_team', 'AdSuite CRM - Team', 'crm', 19900, 'usd', 1000, true),
('petconnect_solo', 'PetConnect CRM - Solo', 'crm', 9900, 'usd', 1000, true),
('petconnect_team', 'PetConnect CRM - Team', 'crm', 14900, 'usd', 1000, true),
('carecompanion_solo', 'CareCompanion CRM - Solo', 'crm', 9900, 'usd', 1000, true),
('carecompanion_team', 'CareCompanion CRM - Team', 'crm', 14900, 'usd', 1000, true)
ON CONFLICT (sku) DO NOTHING;

-- Marketplace Subscriptions (10% commission)
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, active) VALUES
('marketplace_basic', 'Local-Link Marketplace - Basic', 'subscription', 2900, 'usd', 1000, true),
('marketplace_pro', 'Local-Link Marketplace - Pro', 'subscription', 4900, 'usd', 1000, true),
('marketplace_premium', 'Local-Link Marketplace - Premium', 'subscription', 9900, 'usd', 1000, true)
ON CONFLICT (sku) DO NOTHING;

-- Courses (20% commission = 2000 basis points)
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, active) VALUES
('course_lca', 'Local-Link Certified Associate', 'course', 19700, 'usd', 2000, true),
('course_ugc', 'UGC Creator Certification', 'course', 19700, 'usd', 2000, true),
('course_ai_marketing', 'AI Marketing & Automation', 'course', 29700, 'usd', 2000, true),
('course_ai_reviews', 'AI Review & Reputation Management', 'course', 29700, 'usd', 2000, true),
('course_partner_accelerator', 'Partner Accelerator Program', 'course', 97, 'usd', 2000, true),
('course_recurring_revenue', 'Selling Recurring Revenue to Trades', 'course', 19700, 'usd', 2000, true),
('course_marketing_trades', 'Marketing for Trades', 'course', 9700, 'usd', 2000, true),
('course_pet_businesses', 'Marketing for Pet Businesses', 'course', 4900, 'usd', 2000, true),
('course_cold_calling', 'Selling Local Services Without Cold Calling', 'course', 9900, 'usd', 2000, true),
('course_crm_selling', 'How to Sell CRMs to Trades', 'course', 14900, 'usd', 2000, true),
('course_marketplace_deals', 'Marketplace Deal Selling Playbook', 'course', 9900, 'usd', 2000, true),
('course_ai_small_biz', 'AI Marketing for Small Business', 'course', 19900, 'usd', 2000, true),
('course_bundling', 'How to Bundle Services for $1k+ Sales', 'course', 24900, 'usd', 2000, true)
ON CONFLICT (sku) DO NOTHING;

-- Services & Setup Fees (15% commission = 1500 basis points)
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, active) VALUES
('setup_crm', 'CRM Setup & Onboarding', 'setup_fee', 39900, 'usd', 1500, true),
('setup_website', 'Website Design & Setup', 'setup_fee', 99900, 'usd', 1500, true),
('service_landing_page', 'Landing Page Design', 'service', 29900, 'usd', 1500, true),
('service_swipe_file', 'Swipe File Access (Lifetime)', 'service', 29700, 'usd', 1500, true),
('service_design_pack', 'Design Services Package', 'service', 49900, 'usd', 1500, true),
('service_print_postcards', 'Postcard Design & Print Bundle', 'service', 19900, 'usd', 1500, true),
('service_marketing_audit', 'Marketing Audit & Strategy', 'service', 49900, 'usd', 1500, true)
ON CONFLICT (sku) DO NOTHING;

-- Bundles (10-15% based on mix)
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, active) VALUES
('bundle_trades_starter', 'Trades Starter Bundle', 'bundle', 29900, 'usd', 1250, true),
('bundle_marketplace_merchant', 'Marketplace Merchant Bundle', 'bundle', 19900, 'usd', 1250, true),
('bundle_course_crm', 'Course + CRM Bundle', 'bundle', 39900, 'usd', 1500, true),
('bundle_complete_platform', 'Complete Platform Access', 'bundle', 99900, 'usd', 1000, true)
ON CONFLICT (sku) DO NOTHING;
