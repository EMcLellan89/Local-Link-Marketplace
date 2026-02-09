/*
  # Drop Unused Indexes - New Batch 4
  
  1. Indexes to Drop (Customers, Deals, DFY, Email)
    - Customer-related indexes
    - Deals and deal templates
    - DFY (Done For You) services
    - Email campaigns and templates
  
  2. Performance Impact
    - Reduces storage overhead
    - Speeds up INSERT/UPDATE operations
    - All indexes have idx_scan = 0 (never used)
*/

-- Customer indexes
DROP INDEX IF EXISTS idx_customer_preferences_customer_id;
DROP INDEX IF EXISTS idx_customer_rewards_ledger_created_at;
DROP INDEX IF EXISTS idx_customer_rewards_ledger_type;
DROP INDEX IF EXISTS idx_customers_email;
DROP INDEX IF EXISTS idx_customers_user_id;

-- Deal indexes
DROP INDEX IF EXISTS idx_deal_templates_merchant_id;
DROP INDEX IF EXISTS idx_deal_templates_type;
DROP INDEX IF EXISTS idx_deals_active_dates;
DROP INDEX IF EXISTS idx_deals_merchant_id;
DROP INDEX IF EXISTS idx_deals_status;

-- DFY indexes
DROP INDEX IF EXISTS idx_dfy_fulfillment_tasks_assigned_to;
DROP INDEX IF EXISTS idx_dfy_fulfillment_tasks_status;
DROP INDEX IF EXISTS idx_dfy_orders_merchant_id;
DROP INDEX IF EXISTS idx_dfy_orders_status;
DROP INDEX IF EXISTS idx_dfy_products_category;
DROP INDEX IF EXISTS idx_dfy_products_type;

-- Email indexes
DROP INDEX IF EXISTS idx_email_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_email_campaigns_status;
DROP INDEX IF EXISTS idx_email_templates_merchant_id;
DROP INDEX IF EXISTS idx_email_templates_type;