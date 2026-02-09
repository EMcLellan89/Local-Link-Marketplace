/*
  # Drop Unused Indexes - Batch 36 (Final)

  1. Purpose
    - Remove final set of unused indexes (idx_scan = 0)
    - Complete storage overhead reduction
    - Finalize systematic cleanup from security audit

  2. Indexes Dropped
    - Final miscellaneous indexes across various tables
    - Complete unused index cleanup
*/

DROP INDEX IF EXISTS idx_promotional_swag_products_category;
DROP INDEX IF EXISTS idx_promotional_swag_products_merchant_id;
DROP INDEX IF EXISTS idx_project_milestones_project_id;
DROP INDEX IF EXISTS idx_projects_merchant_id;
DROP INDEX IF EXISTS idx_referral_program_merchants_merchant_id;
DROP INDEX IF EXISTS idx_referral_program_merchants_program_id;
DROP INDEX IF EXISTS idx_rewards_transactions_customer_id;
DROP INDEX IF EXISTS idx_scheduled_messages_merchant_id;
DROP INDEX IF EXISTS idx_service_catalog_merchant_id;
DROP INDEX IF EXISTS idx_storylab_orders_partner_id;
DROP INDEX IF EXISTS idx_storylab_projects_order_id;
DROP INDEX IF EXISTS idx_subscription_addons_merchant_id;
DROP INDEX IF EXISTS idx_subscription_addons_subscription_id;
DROP INDEX IF EXISTS idx_swipe_file_templates_category;
DROP INDEX IF EXISTS idx_white_label_configurations_partner_id;
DROP INDEX IF EXISTS idx_business_deal_purchases_customer_id;
DROP INDEX IF EXISTS idx_business_deal_purchases_deal_id;
DROP INDEX IF EXISTS idx_chart_accounts_merchant_id;
DROP INDEX IF EXISTS idx_communications_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_external_sales_partner_id;
