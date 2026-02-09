/*
  # Drop Unused Indexes - Batch 4: Customers, Deals, DFY & Email Tables
  
  1. Tables Affected
    - customers and customer_* tables
    - deals and deal_* tables
    - dfy_* tables (orders, products, tasks, etc.)
    - email_* tables (campaigns, sends, templates, etc.)
  
  2. Performance Impact
    - Removes indexes with zero query usage
    - Improves write performance across high-traffic tables
  
  3. Safety
    - All indexes confirmed unused via database statistics
*/

-- Customer tables
DROP INDEX IF EXISTS idx_customers_merchant_id;
DROP INDEX IF EXISTS idx_customers_referred_by;
DROP INDEX IF EXISTS idx_customer_preferences_customer_id;
DROP INDEX IF EXISTS idx_customer_rewards_customer_id;
DROP INDEX IF EXISTS idx_customer_referrals_customer_id;
DROP INDEX IF EXISTS idx_customer_referrals_referred_customer_id;

-- Deals
DROP INDEX IF EXISTS idx_deals_merchant_id;
DROP INDEX IF EXISTS idx_deals_customer_id;
DROP INDEX IF EXISTS idx_deal_redemptions_deal_id;
DROP INDEX IF EXISTS idx_deal_redemptions_customer_id;
DROP INDEX IF EXISTS idx_deal_templates_merchant_id;

-- DFY tables
DROP INDEX IF EXISTS idx_dfy_orders_merchant_id;
DROP INDEX IF EXISTS idx_dfy_orders_product_id;
DROP INDEX IF EXISTS idx_dfy_products_category;
DROP INDEX IF EXISTS idx_dfy_tasks_order_id;
DROP INDEX IF EXISTS idx_dfy_deliverables_order_id;
DROP INDEX IF EXISTS idx_dfy_content_items_order_id;
DROP INDEX IF EXISTS idx_dfy_tracking_links_partner_id;

-- Email tables
DROP INDEX IF EXISTS idx_email_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_email_sends_campaign_id;
DROP INDEX IF EXISTS idx_email_sends_customer_id;
DROP INDEX IF EXISTS idx_email_templates_merchant_id;
DROP INDEX IF EXISTS idx_email_subscribers_merchant_id;
DROP INDEX IF EXISTS idx_email_automation_rules_merchant_id;