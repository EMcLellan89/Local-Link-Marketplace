/*
  # Drop Unused Indexes - Part 1: Core Tables
  
  1. Removes unused indexes from core business tables
  2. Improves write performance by reducing index maintenance overhead
  3. Tables affected:
     - merchants, customers, deals, purchases, redemptions
     - partner_subscriptions, territory_licenses, loyalty_events
     - merchant_addon_subscriptions, postcard_placements
*/

-- Drop unused indexes on merchants
DROP INDEX IF EXISTS idx_merchants_user_id;
DROP INDEX IF EXISTS idx_merchants_status;
DROP INDEX IF EXISTS idx_merchants_category;
DROP INDEX IF EXISTS idx_merchants_current_subscription_id;
DROP INDEX IF EXISTS idx_merchants_partner_id;
DROP INDEX IF EXISTS idx_merchants_territory_id;

-- Drop unused indexes on customers
DROP INDEX IF EXISTS idx_customers_user_id;

-- Drop unused indexes on deals
DROP INDEX IF EXISTS idx_deals_status;
DROP INDEX IF EXISTS idx_deals_partner_id;
DROP INDEX IF EXISTS idx_deals_qr_code_id;
DROP INDEX IF EXISTS idx_deals_territory_id;

-- Drop unused indexes on purchases
DROP INDEX IF EXISTS idx_purchases_customer_id;

-- Drop unused indexes on redemptions
DROP INDEX IF EXISTS idx_redemptions_purchase_id;

-- Drop unused indexes on loyalty_events
DROP INDEX IF EXISTS idx_loyalty_events_customer_id;

-- Drop unused indexes on partner_subscriptions
DROP INDEX IF EXISTS idx_partner_subscriptions_partner_id;
DROP INDEX IF EXISTS idx_partner_subscriptions_status;
DROP INDEX IF EXISTS idx_partner_subscriptions_next_billing_date;
DROP INDEX IF EXISTS idx_partner_subscriptions_tier_id_fk;

-- Drop unused indexes on territory_licenses
DROP INDEX IF EXISTS idx_territory_licenses_territory_id;
DROP INDEX IF EXISTS idx_territory_licenses_partner_id;
DROP INDEX IF EXISTS idx_territory_licenses_status;
DROP INDEX IF EXISTS idx_territory_licenses_pricing_tier_id;

-- Drop unused indexes on merchant_addon_subscriptions
DROP INDEX IF EXISTS idx_merchant_addon_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_merchant_addon_subscriptions_addon_id;
DROP INDEX IF EXISTS idx_merchant_addon_subscriptions_status;

-- Drop unused indexes on postcard_placements
DROP INDEX IF EXISTS idx_postcard_placements_mailing_id;
