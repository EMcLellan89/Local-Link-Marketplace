/*
  # Drop Unused Indexes - Batch 4: Customers, Deals, DFY, Email
  
  ## Tables Covered:
  - customer_* tables
  - deal_* tables
  - dfy_* tables
  - email_* tables
*/

-- Customer tables
DROP INDEX IF EXISTS idx_customer_preferences_customer_id;
DROP INDEX IF EXISTS idx_customer_referral_campaigns_created_at;
DROP INDEX IF EXISTS idx_customer_referral_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_customer_referral_rewards_created_at;
DROP INDEX IF EXISTS idx_customer_referral_rewards_customer_id;
DROP INDEX IF EXISTS idx_customer_referral_rewards_merchant_id;
DROP INDEX IF EXISTS idx_customer_referrals_created_at;
DROP INDEX IF EXISTS idx_customer_referrals_merchant_id;
DROP INDEX IF EXISTS idx_customer_referrals_referrer_id;
DROP INDEX IF EXISTS idx_customer_rewards_balance_customer_id;
DROP INDEX IF EXISTS idx_customer_rewards_ledger_created_at;
DROP INDEX IF EXISTS idx_customer_rewards_ledger_customer_id;
DROP INDEX IF EXISTS idx_customers_created_at;
DROP INDEX IF EXISTS idx_customers_user_id;

-- Deal tables
DROP INDEX IF EXISTS idx_deal_redemptions_created_at;
DROP INDEX IF EXISTS idx_deal_redemptions_customer_id;
DROP INDEX IF EXISTS idx_deal_redemptions_deal_id;
DROP INDEX IF EXISTS idx_deal_templates_created_at;
DROP INDEX IF EXISTS idx_deal_templates_merchant_id;
DROP INDEX IF EXISTS idx_deals_created_at;
DROP INDEX IF EXISTS idx_deals_end_date;
DROP INDEX IF EXISTS idx_deals_merchant_id;
DROP INDEX IF EXISTS idx_deals_start_date;

-- DFY tables
DROP INDEX IF EXISTS idx_dfy_campaign_content_campaign_id;
DROP INDEX IF EXISTS idx_dfy_campaigns_created_at;
DROP INDEX IF EXISTS idx_dfy_content_library_created_at;
DROP INDEX IF EXISTS idx_dfy_fulfillment_tasks_created_at;
DROP INDEX IF EXISTS idx_dfy_fulfillment_tasks_order_id;
DROP INDEX IF EXISTS idx_dfy_orders_created_at;
DROP INDEX IF EXISTS idx_dfy_orders_status;
DROP INDEX IF EXISTS idx_dfy_products_category;
DROP INDEX IF EXISTS idx_dfy_products_created_at;

-- Email tables
DROP INDEX IF EXISTS idx_email_campaigns_created_at;
DROP INDEX IF EXISTS idx_email_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_email_sends_campaign_id;
DROP INDEX IF EXISTS idx_email_sends_created_at;
DROP INDEX IF EXISTS idx_email_subscriptions_created_at;
DROP INDEX IF EXISTS idx_email_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_email_templates_created_at;
DROP INDEX IF EXISTS idx_email_templates_merchant_id;