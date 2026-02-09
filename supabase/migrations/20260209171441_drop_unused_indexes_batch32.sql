/*
  # Drop Unused Indexes - Batch 32

  1. Purpose
    - Remove unused indexes (idx_scan = 0) to reduce storage overhead
    - Improve INSERT/UPDATE performance by reducing index maintenance
    - Continue systematic cleanup from security audit

  2. Indexes Dropped
    - profit_network table indexes continued
    - purchase_orders table indexes
    - qr_codes table indexes
    - referral table indexes
    - review table indexes
*/

DROP INDEX IF EXISTS idx_profit_network_transactions_partner_id;
DROP INDEX IF EXISTS idx_purchase_orders_customer_id;
DROP INDEX IF EXISTS idx_purchase_orders_merchant_id;
DROP INDEX IF EXISTS idx_qr_codes_deal_id;
DROP INDEX IF EXISTS idx_qr_codes_merchant_id;
DROP INDEX IF EXISTS idx_referral_links_customer_id;
DROP INDEX IF EXISTS idx_referral_links_partner_id;
DROP INDEX IF EXISTS idx_referral_rewards_customer_id;
DROP INDEX IF EXISTS idx_referrals_customer_id;
DROP INDEX IF EXISTS idx_referrals_merchant_id;
DROP INDEX IF EXISTS idx_referrals_partner_id;
DROP INDEX IF EXISTS idx_review_responses_merchant_id;
DROP INDEX IF EXISTS idx_review_responses_review_id;
DROP INDEX IF EXISTS idx_reviews_customer_id;
DROP INDEX IF EXISTS idx_reviews_merchant_id;
DROP INDEX IF EXISTS idx_sales_milestones_partner_id;
DROP INDEX IF EXISTS idx_scheduled_deals_deal_id;
DROP INDEX IF EXISTS idx_scheduled_deals_merchant_id;
DROP INDEX IF EXISTS idx_shopping_cart_items_cart_id;
DROP INDEX IF EXISTS idx_shopping_cart_items_product_id;
