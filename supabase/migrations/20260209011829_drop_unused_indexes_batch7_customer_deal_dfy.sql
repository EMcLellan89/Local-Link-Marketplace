/*
  # Drop Unused Indexes - Batch 7: Customer, Deal, and DFY Tables
  
  This migration continues dropping unused indexes.
  
  ## Indexes Dropped
  - Customer-related indexes
  - Deal and referral indexes
  - DFY (Done For You) service indexes
  
  ## Impact
  - Reduces storage usage
  - Improves write performance
*/

-- customer_preferences
DROP INDEX IF EXISTS idx_customer_preferences_customer_id;

-- customer_referrals
DROP INDEX IF EXISTS idx_customer_referrals_customer_id;
DROP INDEX IF EXISTS idx_customer_referrals_merchant_id;

-- customer_reward_transactions
DROP INDEX IF EXISTS idx_customer_reward_transactions_customer_id;

-- customers
DROP INDEX IF EXISTS idx_customers_user_id;

-- deal_analytics
DROP INDEX IF EXISTS idx_deal_analytics_deal_id;

-- deal_categories
DROP INDEX IF EXISTS idx_deal_categories_merchant_id;

-- deal_redemptions
DROP INDEX IF EXISTS idx_deal_redemptions_customer_id;
DROP INDEX IF EXISTS idx_deal_redemptions_deal_id;

-- deal_templates
DROP INDEX IF EXISTS idx_deal_templates_created_by;

-- deals
DROP INDEX IF EXISTS idx_deals_category_id;
DROP INDEX IF EXISTS idx_deals_merchant_id;

-- dfy_content_library
DROP INDEX IF EXISTS idx_dfy_content_library_category;
DROP INDEX IF EXISTS idx_dfy_content_library_industry;

-- dfy_fulfillment_tasks
DROP INDEX IF EXISTS idx_dfy_fulfillment_tasks_order_id;

-- dfy_orders
DROP INDEX IF EXISTS idx_dfy_orders_product_id;
DROP INDEX IF EXISTS idx_dfy_orders_user_id;

-- dfy_products
DROP INDEX IF EXISTS idx_dfy_products_category;

-- email_campaigns
DROP INDEX IF EXISTS idx_email_campaigns_merchant_id;

-- email_logs
DROP INDEX IF EXISTS idx_email_logs_merchant_id;
DROP INDEX IF EXISTS idx_email_logs_recipient;

-- email_segments
DROP INDEX IF EXISTS idx_email_segments_merchant_id;

-- email_subscriptions
DROP INDEX IF EXISTS idx_email_subscriptions_merchant_id;

-- email_templates
DROP INDEX IF EXISTS idx_email_templates_merchant_id;
