/*
  # Drop Unused Indexes - Batch 5: Budget, Business, and Campaign Tables
  
  This migration continues dropping unused indexes.
  
  ## Indexes Dropped
  - Budget buster indexes
  - Business and capital indexes
  - Campaign-related indexes
  
  ## Impact
  - Reduces storage usage
  - Improves write performance
*/

-- budget_buster_subscriptions
DROP INDEX IF EXISTS idx_budget_buster_subscriptions_user_id;

-- budget_buster_users
DROP INDEX IF EXISTS idx_budget_buster_users_user_id;

-- business_accounting_snapshots
DROP INDEX IF EXISTS idx_business_accounting_snapshots_merchant_id;

-- business_ad_campaigns
DROP INDEX IF EXISTS idx_business_ad_campaigns_merchant_id;

-- business_capital_applications
DROP INDEX IF EXISTS idx_business_capital_applications_merchant_id;

-- business_coaching_bookings
DROP INDEX IF EXISTS idx_business_coaching_bookings_merchant_id;
DROP INDEX IF EXISTS idx_business_coaching_bookings_partner_id;

-- business_coaching_packages
DROP INDEX IF EXISTS idx_business_coaching_packages_partner_id;

-- business_coaching_sessions
DROP INDEX IF EXISTS idx_business_coaching_sessions_booking_id;

-- business_deal_categories
DROP INDEX IF EXISTS idx_business_deal_categories_slug;

-- business_deal_orders
DROP INDEX IF EXISTS idx_business_deal_orders_deal_id;

-- business_deals
DROP INDEX IF EXISTS idx_business_deals_category_id;
DROP INDEX IF EXISTS idx_business_deals_merchant_id;

-- bundles
DROP INDEX IF EXISTS idx_bundles_partner_id;

-- campaign_creatives
DROP INDEX IF EXISTS idx_campaign_creatives_campaign_id;

-- campaign_recipients
DROP INDEX IF EXISTS idx_campaign_recipients_campaign_id;
DROP INDEX IF EXISTS idx_campaign_recipients_customer_id;

-- campaigns
DROP INDEX IF EXISTS idx_campaigns_merchant_id;

-- cart_items
DROP INDEX IF EXISTS idx_cart_items_cart_id;
DROP INDEX IF EXISTS idx_cart_items_product_id;

-- carts
DROP INDEX IF EXISTS idx_carts_customer_id;
