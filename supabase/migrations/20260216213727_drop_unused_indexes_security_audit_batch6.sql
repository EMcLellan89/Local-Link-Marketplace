/*
  # Drop Unused Indexes - Security Audit Batch 6
  
  Drops unused indexes from loyalty, marketplace, marketing, and merchant tables.
  
  These indexes have not been used and are safe to remove for improved database performance.
  
  Tables affected:
  - loyalty_contracts, loyalty_programs, loyalty_transactions
  - marketplace_affiliate_clicks, marketplace_affiliate_commissions, marketplace_affiliate_links
  - marketplace_cart_items, marketplace_checkout_sessions, marketplace_orders, marketplace_products
  - marketing_campaigns, marketing_segments
  - merchant_applications, merchant_orders, merchant_subscriptions, merchants
*/

-- Loyalty tables
DROP INDEX IF EXISTS idx_loyalty_contracts_merchant_id;
DROP INDEX IF EXISTS idx_loyalty_programs_merchant_id;
DROP INDEX IF EXISTS idx_loyalty_transactions_customer_id;
DROP INDEX IF EXISTS idx_loyalty_transactions_merchant_id;

-- Marketplace affiliate tables
DROP INDEX IF EXISTS idx_marketplace_affiliate_clicks_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_clicks_product_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_order_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_links_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_links_product_id;

-- Marketplace tables
DROP INDEX IF EXISTS idx_marketplace_cart_items_user_id;
DROP INDEX IF EXISTS idx_marketplace_cart_items_product_id;
DROP INDEX IF EXISTS idx_marketplace_checkout_sessions_user_id;
DROP INDEX IF EXISTS idx_marketplace_checkout_sessions_status;
DROP INDEX IF EXISTS idx_marketplace_orders_user_id;
DROP INDEX IF EXISTS idx_marketplace_orders_status;
DROP INDEX IF EXISTS idx_marketplace_products_creator_id;
DROP INDEX IF EXISTS idx_marketplace_products_category;

-- Marketing tables
DROP INDEX IF EXISTS idx_marketing_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_marketing_campaigns_status;
DROP INDEX IF EXISTS idx_marketing_segments_merchant_id;

-- Merchant tables
DROP INDEX IF EXISTS idx_merchant_applications_user_id;
DROP INDEX IF EXISTS idx_merchant_applications_status;
DROP INDEX IF EXISTS idx_merchant_orders_merchant_id;
DROP INDEX IF EXISTS idx_merchant_orders_customer_id;
DROP INDEX IF EXISTS idx_merchant_orders_status;
DROP INDEX IF EXISTS idx_merchant_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_merchant_subscriptions_status;
DROP INDEX IF EXISTS idx_merchants_user_id;
DROP INDEX IF EXISTS idx_merchants_business_name;