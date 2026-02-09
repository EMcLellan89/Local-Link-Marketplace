/*
  # Add Partner Tier Subscription Products

  1. New Products
    - Partner Tier Subscription ($69/mo)
      - Base partner tier with standard commission rates (20%)
      - Required for all partners
    - Master Partner Tier Subscription ($179/mo)
      - 15% commission boost (23% total)
      - Priority support
    - Enterprise Partner Tier Subscription ($549/mo)
      - 25% commission boost (25% total)
      - Priority support + dedicated account manager

  2. Changes
    - Adds three partner tier subscription products to marketplace_affiliate_products
    - Sets commission rate to 0% (partners don't earn commission on their own tier subscriptions)
    - Type set to 'subscription' for recurring billing

  3. Notes
    - Partners must pay BOTH a partner tier subscription AND a CRM subscription
    - Partner tier determines commission rates on all sales they make
    - These products are mandatory for partner status
*/

-- Insert Partner Tier Subscription Products
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, currency, commission_rate_bp, active)
VALUES
  (
    'partner_tier_base_69',
    'Partner Tier Subscription ($69/mo)',
    'subscription',
    6900,
    'USD',
    0, -- Partners don't earn commission on their own tier subscriptions
    true
  ),
  (
    'partner_tier_master_179',
    'Master Partner Tier Subscription ($179/mo)',
    'subscription',
    17900,
    'USD',
    0,
    true
  ),
  (
    'partner_tier_enterprise_549',
    'Enterprise Partner Tier Subscription ($549/mo)',
    'subscription',
    54900,
    'USD',
    0,
    true
  )
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  active = EXCLUDED.active;
