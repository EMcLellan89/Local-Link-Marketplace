/*
  # Add Merchant Services to Partner Product Catalog

  1. New Products
    - All merchant hub services
    - TradeHive, AdSuite, Local-Link CRM plans  
    - Business Coach packages
    - Service fulfillment options

  2. Commission Structure
    - Base rate 20% (2000 bp) for Partner tier
    - Master tier gets 15% boost = 23% (tier multiplier)
    - Enterprise tier gets 25% boost = 25% (tier multiplier)
    - Upline bonus 7% on all commissionable items

  3. Special Rules
    - Fixed commissions: $75 for repeat business/merchant services, $100 for capital
    - Job board items: 7% if outsourced, tier % if partner fulfills
    - No commission: Academy, Deals, Reviews, Analytics, Invoicing
*/

-- Job Board Eligible Services (Tier-based one-time commission)
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, commission_rate_bp, active, currency)
VALUES
('marketing_services', 'Marketing Services', 'service', 0, 2000, true, 'USD'),
('crm_migration', 'CRM Migration Service', 'service', 99900, 2000, true, 'USD'),
('ai_automation_setup', 'AI & Automation Setup', 'service', 149900, 2000, true, 'USD'),
('ad_swipe_file_access', 'Ad Swipe File Access', 'service', 49900, 2000, true, 'USD'),
('website_design_service', 'Website Design Service', 'service', 199900, 2000, true, 'USD'),
('printing_services_package', 'Printing Services Package', 'service', 29900, 2000, true, 'USD'),
('ugc_video_content', 'UGC Video Content Creation', 'service', 79900, 2000, true, 'USD'),
('lead_generation_outreach', 'Lead Generation & Outreach', 'service', 99900, 2000, true, 'USD'),
('appointment_setting_service', 'Appointment Setting Service', 'service', 79900, 2000, true, 'USD'),
('recruiting_services_package', 'Recruiting Services', 'service', 149900, 2000, true, 'USD'),
('postcard_advertising_campaign', 'Postcard Advertising Campaign', 'service', 99900, 2000, true, 'USD')
ON CONFLICT (sku) DO NOTHING;

-- Fixed Commission Services
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, commission_rate_bp, active, currency)
VALUES
('repeat_business_program', 'Drive Repeat Business Program', 'service', 79900, 938, true, 'USD'),
('merchant_services_setup', 'Merchant Services Setup', 'service', 0, 938, true, 'USD'),
('business_capital_application', 'Business Capital Application', 'service', 0, 1250, true, 'USD')
ON CONFLICT (sku) DO NOTHING;

-- TradeHive CRM Plans (Recurring monthly commissions)
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, commission_rate_bp, active, currency)
VALUES
('tradehive_solo_45', 'TradeHive CRM - Solo ($45/mo)', 'crm', 4500, 2000, true, 'USD'),
('tradehive_team_145', 'TradeHive CRM - Team ($145/mo)', 'crm', 14500, 2000, true, 'USD'),
('tradehive_growth_299', 'TradeHive CRM - Growth ($299/mo)', 'crm', 29900, 2000, true, 'USD'),
('tradehive_scale_499', 'TradeHive CRM - Scale ($499/mo)', 'crm', 49900, 2000, true, 'USD')
ON CONFLICT (sku) DO NOTHING;

-- AdSuite CRM Plans (Recurring monthly commissions)
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, commission_rate_bp, active, currency)
VALUES
('adsuite_solo_45', 'AdSuite CRM - Solo ($45/mo)', 'crm', 4500, 2000, true, 'USD'),
('adsuite_team_145', 'AdSuite CRM - Team ($145/mo)', 'crm', 14500, 2000, true, 'USD'),
('adsuite_growth_299', 'AdSuite CRM - Growth ($299/mo)', 'crm', 29900, 2000, true, 'USD'),
('adsuite_scale_499', 'AdSuite CRM - Scale ($499/mo)', 'crm', 49900, 2000, true, 'USD')
ON CONFLICT (sku) DO NOTHING;

-- Local-Link CRM Plans (Recurring monthly commissions)
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, commission_rate_bp, active, currency)
VALUES
('locallink_crm_solo_45', 'Local-Link CRM - Solo ($45/mo)', 'crm', 4500, 2000, true, 'USD'),
('locallink_crm_team_145', 'Local-Link CRM - Team ($145/mo)', 'crm', 14500, 2000, true, 'USD'),
('locallink_crm_growth_299', 'Local-Link CRM - Growth ($299/mo)', 'crm', 29900, 2000, true, 'USD'),
('locallink_crm_scale_499', 'Local-Link CRM - Scale ($499/mo)', 'crm', 49900, 2000, true, 'USD')
ON CONFLICT (sku) DO NOTHING;

-- Business Coach Packages (Recurring monthly commissions)
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, commission_rate_bp, active, currency)
VALUES
('business_coach_starter', 'Business Coach - Starter ($299/mo)', 'service', 29900, 2000, true, 'USD'),
('business_coach_growth', 'Business Coach - Growth ($499/mo)', 'service', 49900, 2000, true, 'USD'),
('business_coach_scale', 'Business Coach - Scale ($999/mo)', 'service', 99900, 2000, true, 'USD')
ON CONFLICT (sku) DO NOTHING;

-- Non-Commissionable Services (0% commission for tracking purposes)
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, commission_rate_bp, active, currency)
VALUES
('academy_access', 'Local-Link Academy Access', 'service', 0, 0, true, 'USD'),
('deals_promotions_feature', 'Deals & Promotions Feature', 'service', 0, 0, true, 'USD'),
('reviews_ratings_system', 'Reviews & Ratings System', 'service', 0, 0, true, 'USD'),
('analytics_dashboard', 'Analytics Dashboard', 'service', 0, 0, true, 'USD'),
('invoicing_accounting_tools', 'Invoicing & Accounting Tools', 'service', 0, 0, true, 'USD')
ON CONFLICT (sku) DO NOTHING;

-- Add helpful comment
COMMENT ON TABLE marketplace_affiliate_products IS 
'Partner commission products. Base rate 20% (2000bp) applies to Partner tier. 
Master tier: 1.15x multiplier (23% effective). Enterprise tier: 1.25x multiplier (25% effective). 
Upline: 7% bonus on all commissionable sales. 
Fixed commissions: basis points adjusted to achieve $75 or $100 payouts. 
Job board items: 7% if outsourced, tier-based if partner fulfills directly.';
