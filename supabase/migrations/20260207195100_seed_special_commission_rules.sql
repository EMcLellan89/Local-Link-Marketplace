/*
  # Seed Special Commission Rules

  1. Flat Rate Products ($150 one-time)
    - Merchant Services
    - Business Capital
    - Drive Repeat Business

  2. Profit-Based Products
    - Printing Services (tier rate on profit)
    - Postcard Advertising (50% of profit after costs)

  3. Recurring Products
    - Partner CRM (tier rate recurring)
    - Admin CRM (tier rate recurring)
    - All subscription products default to recurring_tier
*/

-- Flat Rate Products: $150 one-time commission
INSERT INTO product_commission_rules (sku, product_name, commission_rate_bps, commission_type, flat_rate_cents, notes, active)
VALUES
  ('MERCHANT_SERVICES', 'Merchant Services', 0, 'flat_rate', 15000, 'Flat $150 commission for Merchant Services', true),
  ('BUSINESS_CAPITAL', 'Business Capital', 0, 'flat_rate', 15000, 'Flat $150 commission for Business Capital', true),
  ('DRIVE_REPEAT_BUSINESS', 'Drive Repeat Business', 0, 'flat_rate', 15000, 'Flat $150 commission for Drive Repeat Business program', true)
ON CONFLICT (sku) 
DO UPDATE SET
  product_name = EXCLUDED.product_name,
  commission_type = EXCLUDED.commission_type,
  flat_rate_cents = EXCLUDED.flat_rate_cents,
  notes = EXCLUDED.notes,
  active = EXCLUDED.active,
  updated_at = now();

-- Profit-Based Products
INSERT INTO product_commission_rules (sku, product_name, commission_rate_bps, commission_type, profit_percentage_bps, notes, active)
VALUES
  ('PRINTING_SERVICES', 'Printing Services', 0, 'profit_based', 0, 'Commission based on profit after costs (use partner tier rate on profit)', true),
  ('POSTCARD_ADVERTISING', 'Postcard Advertising', 0, 'profit_based', 5000, 'Flat 50% of profit after printing and postage costs', true),
  ('CUSTOM_PRINT', 'Custom Print Orders', 0, 'profit_based', 0, 'Commission based on profit after costs (use partner tier rate on profit)', true)
ON CONFLICT (sku) 
DO UPDATE SET
  product_name = EXCLUDED.product_name,
  commission_type = EXCLUDED.commission_type,
  profit_percentage_bps = EXCLUDED.profit_percentage_bps,
  notes = EXCLUDED.notes,
  active = EXCLUDED.active,
  updated_at = now();

-- Recurring Subscription Products
INSERT INTO product_commission_rules (sku, product_name, commission_rate_bps, commission_type, is_recurring, recurring_frequency, notes, active)
VALUES
  ('PARTNER_CRM', 'Partner CRM', 0, 'recurring_tier', true, 'monthly', 'Recurring commission at partner tier rate every month', true),
  ('ADMIN_CRM', 'Admin CRM', 0, 'recurring_tier', true, 'monthly', 'Recurring commission at partner tier rate every month', true),
  ('AUTOSCALE_STARTER', 'AutoScale Starter', 0, 'recurring_tier', true, 'monthly', 'Recurring tier commission on AutoScale subscriptions', true),
  ('AUTOSCALE_GROWTH', 'AutoScale Growth', 0, 'recurring_tier', true, 'monthly', 'Recurring tier commission on AutoScale subscriptions', true),
  ('AUTOSCALE_ENTERPRISE', 'AutoScale Enterprise', 0, 'recurring_tier', true, 'monthly', 'Recurring tier commission on AutoScale subscriptions', true),
  ('FINANCIAL_ENGINE_BASIC', 'Financial Engine Basic', 0, 'recurring_tier', true, 'monthly', 'Recurring tier commission on Financial Engine subscriptions', true),
  ('FINANCIAL_ENGINE_PRO', 'Financial Engine Pro', 0, 'recurring_tier', true, 'monthly', 'Recurring tier commission on Financial Engine subscriptions', true),
  ('FINANCIAL_ENGINE_PREMIUM', 'Financial Engine Premium', 0, 'recurring_tier', true, 'monthly', 'Recurring tier commission on Financial Engine subscriptions', true),
  ('COMMUNICATIONS_HUB', 'Communications Hub', 0, 'recurring_tier', true, 'monthly', 'Recurring tier commission on Communications Hub subscriptions', true),
  ('FRONTDESK_AI_PRO', 'FrontDesk AI Pro', 0, 'recurring_tier', true, 'monthly', 'Recurring tier commission on FrontDesk AI Pro subscriptions', true),
  ('MY_BUDGET_BUSTER', 'My Budget Buster', 0, 'recurring_tier', true, 'monthly', 'Recurring tier commission on My Budget Buster subscriptions', true)
ON CONFLICT (sku) 
DO UPDATE SET
  product_name = EXCLUDED.product_name,
  commission_type = EXCLUDED.commission_type,
  is_recurring = EXCLUDED.is_recurring,
  recurring_frequency = EXCLUDED.recurring_frequency,
  notes = EXCLUDED.notes,
  active = EXCLUDED.active,
  updated_at = now();

-- One-time Tier-Based Products (courses, DFY services, etc.)
INSERT INTO product_commission_rules (sku, product_name, commission_rate_bps, commission_type, notes, active)
VALUES
  ('COURSE_LOCAL_CUSTOMERS_AUTOPILOT', 'Local Customers on Autopilot Course', 0, 'tier', 'One-time tier commission on course purchase', true),
  ('COURSE_PARTNER_ACCELERATOR', 'Partner Accelerator Course', 0, 'tier', 'One-time tier commission on course purchase', true),
  ('COURSE_UGC_MASTERY', 'UGC Mastery Course', 0, 'tier', 'One-time tier commission on course purchase', true),
  ('COURSE_BLOG_GROWTH', 'Blog Growth System Course', 0, 'tier', 'One-time tier commission on course purchase', true),
  ('DFY_LANDING_PAGE', 'Done-For-You Landing Page', 0, 'tier', 'One-time tier commission on DFY service', true),
  ('DFY_FUNNEL', 'Done-For-You Sales Funnel', 0, 'tier', 'One-time tier commission on DFY service', true),
  ('DFY_LEAD_MAGNET', 'Done-For-You Lead Magnet', 0, 'tier', 'One-time tier commission on DFY service', true),
  ('BUSINESS_COACH_SESSION', 'Business Coaching Session', 0, 'tier', 'One-time tier commission on coaching', true)
ON CONFLICT (sku) 
DO UPDATE SET
  product_name = EXCLUDED.product_name,
  commission_type = EXCLUDED.commission_type,
  notes = EXCLUDED.notes,
  active = EXCLUDED.active,
  updated_at = now();

COMMENT ON TABLE product_commission_rules IS 'Defines commission calculation rules per product SKU. Supports flat rate, profit-based, recurring, and tier-based commissions.';
