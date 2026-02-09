/*
  # Drop Unused Indexes - Batch 10: Loyalty, Marketing, and Marketplace Tables

  1. Changes
    - Drop unused indexes from loyalty_* tables
    - Drop unused indexes from marketing_* tables
    - Drop unused indexes from marketplace_* tables
    
  2. Rationale
    - These indexes have idx_scan = 0, never used by queries
    - Reduces storage and maintenance overhead
*/

-- Loyalty tables
DROP INDEX IF EXISTS idx_loyalty_contract_uploads_merchant_id;
DROP INDEX IF EXISTS idx_loyalty_events_customer_id;

-- Marketing tables
DROP INDEX IF EXISTS idx_marketing_campaigns_segment_id;
DROP INDEX IF EXISTS idx_marketing_email_campaigns_business_unit_id;
DROP INDEX IF EXISTS idx_marketing_email_campaigns_created_by;
DROP INDEX IF EXISTS idx_marketing_email_campaigns_segment_id;

-- Marketplace abandoned carts
DROP INDEX IF EXISTS idx_marketplace_abandoned_carts_checkout_session_id;

-- Marketplace affiliate tables
DROP INDEX IF EXISTS idx_marketplace_affiliate_badges_marketplace_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_marketplace_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_referral_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_payouts_marketplace_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_product_assets_product_sku;
DROP INDEX IF EXISTS idx_marketplace_affiliate_referrals_marketplace_affiliate_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_referrals_referred_user_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_subscription_locks_commission_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_subscription_locks_marketplace_affili;
DROP INDEX IF EXISTS idx_marketplace_affiliate_training_progress_marketplace_affilia;
DROP INDEX IF EXISTS idx_marketplace_affiliates_user_id;

-- Marketplace checkout tables
DROP INDEX IF EXISTS idx_marketplace_checkout_configs_order_bump_product_id;
DROP INDEX IF EXISTS idx_marketplace_checkout_configs_product_id;
DROP INDEX IF EXISTS idx_marketplace_checkout_configs_upsell_product_id;
DROP INDEX IF EXISTS idx_marketplace_checkout_sessions_bump_product_id;
DROP INDEX IF EXISTS idx_marketplace_checkout_sessions_partner_id;
DROP INDEX IF EXISTS idx_marketplace_checkout_sessions_price_id;
DROP INDEX IF EXISTS idx_marketplace_checkout_sessions_product_id;
DROP INDEX IF EXISTS idx_marketplace_checkout_sessions_user_id;

-- Marketplace commissions and orders
DROP INDEX IF EXISTS idx_marketplace_commissions_order_id;
DROP INDEX IF EXISTS idx_marketplace_commissions_partner_id;
DROP INDEX IF EXISTS idx_marketplace_order_items_order_id;
DROP INDEX IF EXISTS idx_marketplace_order_items_product_id;
DROP INDEX IF EXISTS idx_marketplace_orders_checkout_session_id;
DROP INDEX IF EXISTS idx_marketplace_orders_partner_id;
DROP INDEX IF EXISTS idx_marketplace_orders_price_id;
DROP INDEX IF EXISTS idx_marketplace_orders_product_id;
DROP INDEX IF EXISTS idx_marketplace_orders_user_id;

-- Marketplace products and subscriptions
DROP INDEX IF EXISTS idx_marketplace_product_prices_product_id;
DROP INDEX IF EXISTS idx_marketplace_subscriptions_price_id;
DROP INDEX IF EXISTS idx_marketplace_subscriptions_product_id;
DROP INDEX IF EXISTS idx_marketplace_subscriptions_user_id;
