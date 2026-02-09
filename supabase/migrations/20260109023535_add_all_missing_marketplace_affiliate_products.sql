/*
  # Add All Missing Marketplace Affiliate Products
  
  Comprehensive addition of all partner-commissionable products and services:
  
  1. **Individual AI Bots** (15% commission = 1500 basis points)
     - All 12+ individual AI automation bots
     - Monthly recurring subscriptions
  
  2. **AI Suite Packages** (15% commission)
     - Lead Generation Package - $497/mo
     - Customer Service Package - $497/mo
     - Revenue Maximization Package - $447/mo
     - Complete AI Suite - $1,497/mo
  
  3. **Professional Services** (15% commission)
     - Appointment Setting Service - $2,500/mo (100 hours)
     - Resume Writing - $150 one-time
     - Job Description Templates - $150 one-time
     - Hiring Funnel Setup - $750 one-time
  
  4. **UGC Content Creation** (15% commission)
     - Various UGC packages for video content
  
  5. **Lead Generation** (15% commission)
     - Lead packages at various quantities
  
  6. **Printing & Design** (15% commission)
     - Business cards, flyers, brochures
     - Design service fee - $25
  
  All commissions are one-time only (no residual) except for recurring subscriptions.
*/

-- Individual AI Bots (15% commission = 1500 basis points, type = service)
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, active, stripe_price_id) VALUES
('ai_bot_ad_copy', 'AI Ad Copy Writer Bot', 'service', 14900, 'usd', 1500, true, NULL),
('ai_bot_social_media', 'AI Social Media Manager Bot', 'service', 19900, 'usd', 1500, true, NULL),
('ai_bot_email_composer', 'AI Email Composer Bot', 'service', 17900, 'usd', 1500, true, NULL),
('ai_bot_review_responder', 'AI Review Responder Bot', 'service', 14900, 'usd', 1500, true, NULL),
('ai_bot_quote_assistant', 'AI Quote Assistant Bot', 'service', 14900, 'usd', 1500, true, NULL),
('ai_bot_appointment_scheduler', 'AI Appointment Scheduler Bot', 'service', 19900, 'usd', 1500, true, NULL),
('ai_bot_lead_qualifier', 'AI Lead Qualifier Bot', 'service', 24900, 'usd', 1500, true, NULL),
('ai_bot_follow_up', 'AI Follow-Up Automation Bot', 'service', 17900, 'usd', 1500, true, NULL),
('ai_bot_invoice_reminder', 'AI Invoice Reminder Bot', 'service', 14900, 'usd', 1500, true, NULL),
('ai_bot_customer_retention', 'AI Customer Retention Bot', 'service', 19900, 'usd', 1500, true, NULL),
('ai_bot_reputation_monitor', 'AI Reputation Monitor Bot', 'service', 14900, 'usd', 1500, true, NULL),
('ai_bot_proposal_generator', 'AI Proposal Generator Bot', 'service', 14900, 'usd', 1500, true, NULL)
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  active = EXCLUDED.active;

-- AI Suite Packages (15% commission, type = bundle)
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, active) VALUES
('ai_suite_lead_generation', 'AI Lead Generation Package', 'bundle', 49700, 'usd', 1500, true),
('ai_suite_customer_service', 'AI Customer Service Package', 'bundle', 49700, 'usd', 1500, true),
('ai_suite_revenue_max', 'AI Revenue Maximization Package', 'bundle', 44700, 'usd', 1500, true),
('ai_suite_complete', 'Complete AI Suite', 'bundle', 149700, 'usd', 1500, true)
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  active = EXCLUDED.active;

-- Professional Services (15% commission)
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, active) VALUES
('service_appointment_setting_100hr', 'Appointment Setting Service (100 hrs)', 'service', 250000, 'usd', 1500, true),
('service_appointment_setting_20hr', 'Appointment Setting Service (20 hrs)', 'service', 50000, 'usd', 1500, true),
('service_resume_writing', 'Professional Resume Writing', 'service', 15000, 'usd', 1500, true),
('service_job_templates', 'Job Description Template Library', 'service', 15000, 'usd', 1500, true),
('service_hiring_funnel', 'Complete Hiring Funnel Setup', 'service', 75000, 'usd', 1500, true),
('service_onboarding_package', 'Employee Onboarding Package', 'service', 49900, 'usd', 1500, true)
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  active = EXCLUDED.active;

-- UGC Content Creation Packages (15% commission)
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, active) VALUES
('ugc_starter', 'UGC Starter Package', 'service', 19900, 'usd', 1500, true),
('ugc_growth', 'UGC Growth Package', 'service', 39900, 'usd', 1500, true),
('ugc_pro', 'UGC Pro Package', 'service', 59900, 'usd', 1500, true),
('ugc_enterprise', 'UGC Enterprise Package', 'service', 99900, 'usd', 1500, true)
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  active = EXCLUDED.active;

-- Lead Generation Services (15% commission)
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, active) VALUES
('leads_100', 'Lead Package - 100 Leads', 'service', 2000, 'usd', 1500, true),
('leads_500', 'Lead Package - 500 Leads', 'service', 10000, 'usd', 1500, true),
('leads_1000', 'Lead Package - 1,000 Leads', 'service', 20000, 'usd', 1500, true),
('leads_5000', 'Lead Package - 5,000 Leads', 'service', 100000, 'usd', 1500, true)
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  active = EXCLUDED.active;

-- Printing & Design Services (15% commission)
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, active) VALUES
('printing_business_cards_500', 'Business Cards (500)', 'service', 4900, 'usd', 1500, true),
('printing_business_cards_1000', 'Business Cards (1,000)', 'service', 7900, 'usd', 1500, true),
('printing_flyers_500', 'Flyers (500)', 'service', 9900, 'usd', 1500, true),
('printing_flyers_1000', 'Flyers (1,000)', 'service', 14900, 'usd', 1500, true),
('printing_brochures_250', 'Brochures (250)', 'service', 12900, 'usd', 1500, true),
('printing_door_hangers_500', 'Door Hangers (500)', 'service', 19900, 'usd', 1500, true),
('printing_yard_signs_10', 'Yard Signs (10)', 'service', 14900, 'usd', 1500, true),
('service_design_fee', 'Professional Design Service', 'service', 2500, 'usd', 1500, true)
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  active = EXCLUDED.active;

-- Additional Merchant Services (15% commission)
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, active) VALUES
('service_merchant_processing', 'Zero-Fee Payment Processing Setup', 'service', 0, 'usd', 1500, true),
('service_business_capital', 'Business Capital Application', 'service', 0, 'usd', 1500, true),
('service_postcard_campaign_500', 'Postcard Marketing Campaign (500)', 'service', 29900, 'usd', 1500, true),
('service_postcard_campaign_1000', 'Postcard Marketing Campaign (1,000)', 'service', 49900, 'usd', 1500, true)
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  active = EXCLUDED.active;

-- Promotional Swag & Apparel (15% commission)
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, active) VALUES
('swag_tshirts_24', 'Custom T-Shirts (24)', 'service', 19200, 'usd', 1500, true),
('swag_hats_24', 'Branded Hats (24)', 'service', 19200, 'usd', 1500, true),
('swag_mugs_24', 'Custom Mugs (24)', 'service', 16800, 'usd', 1500, true),
('swag_pens_100', 'Branded Pens (100)', 'service', 7200, 'usd', 1500, true),
('swag_tote_bags_50', 'Tote Bags (50)', 'service', 18000, 'usd', 1500, true),
('swag_stickers_500', 'Die-Cut Stickers (500)', 'service', 18000, 'usd', 1500, true)
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  active = EXCLUDED.active;
