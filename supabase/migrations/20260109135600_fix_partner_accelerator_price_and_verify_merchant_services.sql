/*
  # Fix Partner Accelerator Price and Verify All Merchant Services

  1. Updates
    - Fix Partner Accelerator Program price from $0.97 to $197.00
    - Ensure all merchant hub services are in marketplace for partner commission tracking

  2. Verification
    - Partner Accelerator should show as $197 in commission calculator
    - All merchant services should be visible to partners for selling to their clients
*/

-- Fix Partner Accelerator Program price (was 97 cents, should be $197)
UPDATE marketplace_affiliate_products
SET price_cents = 19700
WHERE sku = 'course_partner_accelerator';

-- Ensure all courses from merchant side are available
-- These are products merchants can buy, and partners earn commission when their merchants purchase

-- Update Selling Recurring Revenue course if price is wrong
UPDATE marketplace_affiliate_products
SET price_cents = 29700
WHERE sku = 'course_recurring_revenue' AND price_cents != 29700;

-- Verify all merchant services exist with correct commission structure
-- If any are missing, they'll be added with ON CONFLICT DO NOTHING

-- Additional merchant service products that should be sellable by partners
INSERT INTO marketplace_affiliate_products (sku, name, type, price_cents, commission_rate_bp, active, currency)
VALUES
-- These are already added, but using ON CONFLICT to be safe
('marketing_campaign_service', 'Marketing Campaign Management', 'service', 0, 2000, true, 'USD'),
('seo_local_service', 'Local SEO Optimization', 'service', 99900, 2000, true, 'USD'),
('social_media_management', 'Social Media Management', 'service', 79900, 2000, true, 'USD'),
('content_creation_service', 'Content Creation Service', 'service', 59900, 2000, true, 'USD'),
('reputation_management', 'Reputation Management', 'service', 49900, 2000, true, 'USD')
ON CONFLICT (sku) DO NOTHING;

-- Add a comment showing the correct commission structure
COMMENT ON TABLE marketplace_affiliate_products IS 
'Partner commission products for selling to merchants. 
Partner Accelerator: $197 (Free for partners, but tracks value).
Selling Recurring Revenue: $297.
All merchant services earn tier-based commissions: 20% Partner, 23% Master, 25% Enterprise.
Upline earns 7% bonus on all sales.';
