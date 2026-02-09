/*
  # Fix Partner Tier Pricing - CRM Included

  1. Changes
    - Removes incorrect partner tier subscriptions ($69, $179, $549)
    - Adds correct partner tier subscriptions with CRM included:
      - Starter Partner: $218/mo (includes Starter CRM, 15% commission, 1 territory)
      - Pro Partner: $658/mo (includes Pro CRM, 20% commission, 3 territories) 
      - Enterprise Partner: $1,798/mo (includes Enterprise CRM, 25% commission, unlimited territories)

  2. Notes
    - Partners pay ONE monthly fee that includes both partner access AND CRM
    - Commission rates: Starter 15%, Pro 20%, Enterprise 25%
    - These are the only monthly costs for partners
*/

-- Remove incorrect partner tier products
DELETE FROM marketplace_affiliate_products 
WHERE sku IN ('partner_tier_base_69', 'partner_tier_master_179', 'partner_tier_enterprise_549');

-- Insert correct partner tier subscriptions with CRM included
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, active)
VALUES
  (
    'partner_tier_starter_218',
    'Starter Partner ($218/mo - CRM Included)',
    'subscription',
    21800,
    'USD',
    0, -- Partners don't earn commission on their own subscriptions
    true
  ),
  (
    'partner_tier_pro_658',
    'Pro Partner ($658/mo - CRM Included)',
    'subscription',
    65800,
    'USD',
    0,
    true
  ),
  (
    'partner_tier_enterprise_1798',
    'Enterprise Partner ($1,798/mo - CRM Included)',
    'subscription',
    179800,
    'USD',
    0,
    true
  )
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  active = EXCLUDED.active;
