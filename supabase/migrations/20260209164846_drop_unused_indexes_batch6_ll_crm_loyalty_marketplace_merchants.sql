/*
  # Drop Unused Indexes - Batch 6: LocalLink CRM, Loyalty, Marketplace, Merchants
  
  ## Tables Covered:
  - ll_crm_* tables (LocalLink CRM)
  - loyalty_* tables
  - marketplace_* tables
  - merchant_* tables
*/

-- LocalLink CRM tables
DROP INDEX IF EXISTS idx_ll_crm_contacts_created_at;
DROP INDEX IF EXISTS idx_ll_crm_contacts_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_deals_created_at;
DROP INDEX IF EXISTS idx_ll_crm_deals_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_documents_created_at;
DROP INDEX IF EXISTS idx_ll_crm_documents_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_email_sends_created_at;
DROP INDEX IF EXISTS idx_ll_crm_email_sends_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_invoices_created_at;
DROP INDEX IF EXISTS idx_ll_crm_invoices_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_payments_created_at;
DROP INDEX IF EXISTS idx_ll_crm_pipeline_stages_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_workflow_executions_created_at;

-- Loyalty tables
DROP INDEX IF EXISTS idx_loyalty_programs_created_at;
DROP INDEX IF EXISTS idx_loyalty_programs_merchant_id;
DROP INDEX IF EXISTS idx_loyalty_rewards_created_at;
DROP INDEX IF EXISTS idx_loyalty_rewards_merchant_id;

-- Marketplace tables
DROP INDEX IF EXISTS idx_marketplace_affiliate_clicks_clicked_at;
DROP INDEX IF EXISTS idx_marketplace_affiliate_clicks_product_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_created_at;
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_status;
DROP INDEX IF EXISTS idx_marketplace_affiliate_links_created_at;
DROP INDEX IF EXISTS idx_marketplace_affiliate_links_creator_id;
DROP INDEX IF EXISTS idx_marketplace_affiliate_links_product_id;
DROP INDEX IF EXISTS idx_marketplace_cart_items_cart_id;
DROP INDEX IF EXISTS idx_marketplace_cart_items_product_id;
DROP INDEX IF EXISTS idx_marketplace_categories_created_at;
DROP INDEX IF EXISTS idx_marketplace_orders_created_at;
DROP INDEX IF EXISTS idx_marketplace_orders_customer_id;
DROP INDEX IF EXISTS idx_marketplace_orders_status;
DROP INDEX IF EXISTS idx_marketplace_payout_batches_created_at;
DROP INDEX IF EXISTS idx_marketplace_product_reviews_created_at;
DROP INDEX IF EXISTS idx_marketplace_product_reviews_product_id;
DROP INDEX IF EXISTS idx_marketplace_products_category_id;
DROP INDEX IF EXISTS idx_marketplace_products_created_at;
DROP INDEX IF EXISTS idx_marketplace_referrals_created_at;

-- Merchant tables
DROP INDEX IF EXISTS idx_merchant_orders_created_at;
DROP INDEX IF EXISTS idx_merchant_orders_merchant_id;
DROP INDEX IF EXISTS idx_merchant_orders_status;
DROP INDEX IF EXISTS idx_merchant_processing_applications_created_at;
DROP INDEX IF EXISTS idx_merchant_processing_applications_merchant_id;
DROP INDEX IF EXISTS idx_merchant_services_merchant_id;
DROP INDEX IF EXISTS idx_merchant_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_merchant_subscriptions_status;
DROP INDEX IF EXISTS idx_merchants_created_at;