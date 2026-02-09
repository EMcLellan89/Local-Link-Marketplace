/*
  # Comprehensive Merchant Services Products

  1. Merchant CRM Products
    - TradeHive CRM: $45/$145/$299/$499 per month (recurring commission based on partner tier)
    - AdSuite CRM: $45/$145/$299/$499 per month (recurring commission based on partner tier)
    - Local-Link CRM: $45/$145/$299/$499 per month (recurring commission based on partner tier)

  2. Fixed Commission Services
    - Drive Repeat Business: $75 fixed commission
    - Merchant Services Setup: $75 fixed commission
    - Business Capital: $100 fixed commission

  3. Job Board Services
    - 7% commission if outsourced to others or if admin does the work
    - Partner tier % (15%/20%/25%) if partner self-fulfills
    - Upline always gets 7% bonus on all commissions

  4. No Commission Services
    - Academy, Deals, Reviews, Analytics, Invoicing

  5. Course Sales
    - One-time tier % commission when merchant purchases
    - Upline gets 7% bonus
*/

-- Merchant CRM Products - TradeHive
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, recurring, category, description, active)
VALUES
  (
    'tradehive_merchant_solo_45',
    'TradeHive CRM - Solo (Merchant)',
    'subscription',
    4500,
    'USD',
    10000, -- Base 100%, actual commission is partner tier % (15%/20%/25%)
    true,
    'merchant_crm',
    'Solo plan for merchants - $45/mo. Partner earns recurring commission at their tier rate (15%/20%/25%). Upline gets 7% of partner commission.',
    true
  ),
  (
    'tradehive_merchant_team_145',
    'TradeHive CRM - Team (Merchant)',
    'subscription',
    14500,
    'USD',
    10000,
    true,
    'merchant_crm',
    'Team plan for merchants - $145/mo. Partner earns recurring commission at their tier rate (15%/20%/25%). Upline gets 7% of partner commission.',
    true
  ),
  (
    'tradehive_merchant_growth_299',
    'TradeHive CRM - Growth (Merchant)',
    'subscription',
    29900,
    'USD',
    10000,
    true,
    'merchant_crm',
    'Growth plan for merchants - $299/mo. Partner earns recurring commission at their tier rate (15%/20%/25%). Upline gets 7% of partner commission.',
    true
  ),
  (
    'tradehive_merchant_scale_499',
    'TradeHive CRM - Scale (Merchant)',
    'subscription',
    49900,
    'USD',
    10000,
    true,
    'merchant_crm',
    'Scale plan for merchants - $499/mo. Partner earns recurring commission at their tier rate (15%/20%/25%). Upline gets 7% of partner commission.',
    true
  )
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  recurring = EXCLUDED.recurring,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  active = EXCLUDED.active;

-- Merchant CRM Products - AdSuite
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, recurring, category, description, active)
VALUES
  (
    'adsuite_merchant_solo_45',
    'AdSuite CRM - Solo (Merchant)',
    'subscription',
    4500,
    'USD',
    10000,
    true,
    'merchant_crm',
    'Solo plan for merchants - $45/mo. Partner earns recurring commission at their tier rate (15%/20%/25%). Upline gets 7% of partner commission.',
    true
  ),
  (
    'adsuite_merchant_team_145',
    'AdSuite CRM - Team (Merchant)',
    'subscription',
    14500,
    'USD',
    10000,
    true,
    'merchant_crm',
    'Team plan for merchants - $145/mo. Partner earns recurring commission at their tier rate (15%/20%/25%). Upline gets 7% of partner commission.',
    true
  ),
  (
    'adsuite_merchant_growth_299',
    'AdSuite CRM - Growth (Merchant)',
    'subscription',
    29900,
    'USD',
    10000,
    true,
    'merchant_crm',
    'Growth plan for merchants - $299/mo. Partner earns recurring commission at their tier rate (15%/20%/25%). Upline gets 7% of partner commission.',
    true
  ),
  (
    'adsuite_merchant_scale_499',
    'AdSuite CRM - Scale (Merchant)',
    'subscription',
    49900,
    'USD',
    10000,
    true,
    'merchant_crm',
    'Scale plan for merchants - $499/mo. Partner earns recurring commission at their tier rate (15%/20%/25%). Upline gets 7% of partner commission.',
    true
  )
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  recurring = EXCLUDED.recurring,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  active = EXCLUDED.active;

-- Merchant CRM Products - Local-Link
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, recurring, category, description, active)
VALUES
  (
    'locallink_merchant_solo_45',
    'Local-Link CRM - Solo (Merchant)',
    'subscription',
    4500,
    'USD',
    10000,
    true,
    'merchant_crm',
    'Solo plan for merchants - $45/mo. Partner earns recurring commission at their tier rate (15%/20%/25%). Upline gets 7% of partner commission.',
    true
  ),
  (
    'locallink_merchant_team_145',
    'Local-Link CRM - Team (Merchant)',
    'subscription',
    14500,
    'USD',
    10000,
    true,
    'merchant_crm',
    'Team plan for merchants - $145/mo. Partner earns recurring commission at their tier rate (15%/20%/25%). Upline gets 7% of partner commission.',
    true
  ),
  (
    'locallink_merchant_growth_299',
    'Local-Link CRM - Growth (Merchant)',
    'subscription',
    29900,
    'USD',
    10000,
    true,
    'merchant_crm',
    'Growth plan for merchants - $299/mo. Partner earns recurring commission at their tier rate (15%/20%/25%). Upline gets 7% of partner commission.',
    true
  ),
  (
    'locallink_merchant_scale_499',
    'Local-Link CRM - Scale (Merchant)',
    'subscription',
    49900,
    'USD',
    10000,
    true,
    'merchant_crm',
    'Scale plan for merchants - $499/mo. Partner earns recurring commission at their tier rate (15%/20%/25%). Upline gets 7% of partner commission.',
    true
  )
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  recurring = EXCLUDED.recurring,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  active = EXCLUDED.active;

-- Fixed Commission Services
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, recurring, category, description, active, metadata)
VALUES
  (
    'drive_repeat_business_79',
    'Drive Repeat Business Program',
    'service',
    7999,
    'USD',
    0,
    false,
    'fixed_commission',
    'Loyalty program setup for merchants - $79.99. Partner earns fixed $75 commission. Upline gets 7% of partner commission ($5.25).',
    true,
    '{"fixed_commission_cents": 7500, "commission_type": "fixed"}'::jsonb
  ),
  (
    'merchant_services_setup_99',
    'Merchant Services Setup',
    'service',
    9999,
    'USD',
    0,
    false,
    'fixed_commission',
    'Payment processing setup - $99.99. Partner earns fixed $75 commission. Upline gets 7% of partner commission ($5.25).',
    true,
    '{"fixed_commission_cents": 7500, "commission_type": "fixed"}'::jsonb
  ),
  (
    'business_capital_129',
    'Business Capital Application',
    'service',
    12999,
    'USD',
    0,
    false,
    'fixed_commission',
    'Business funding application assistance - $129.99. Partner earns fixed $100 commission. Upline gets 7% of partner commission ($7).',
    true,
    '{"fixed_commission_cents": 10000, "commission_type": "fixed"}'::jsonb
  )
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  recurring = EXCLUDED.recurring,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  active = EXCLUDED.active,
  metadata = EXCLUDED.metadata;
