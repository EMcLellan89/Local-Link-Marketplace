/*
  # Drop Unused Indexes - Batch 35

  1. Purpose
    - Remove unused indexes (idx_scan = 0) to reduce storage overhead
    - Improve INSERT/UPDATE performance by reducing index maintenance
    - Continue systematic cleanup from security audit

  2. Indexes Dropped
    - vapi table indexes continued
    - video table indexes
    - website table indexes
    - winback table indexes
    - miscellaneous remaining indexes
*/

DROP INDEX IF EXISTS idx_vapi_call_logs_customer_id;
DROP INDEX IF EXISTS idx_vapi_call_logs_merchant_id;
DROP INDEX IF EXISTS idx_video_content_creator_id;
DROP INDEX IF EXISTS idx_video_content_merchant_id;
DROP INDEX IF EXISTS idx_website_analytics_merchant_id;
DROP INDEX IF EXISTS idx_website_analytics_website_id;
DROP INDEX IF EXISTS idx_website_templates_category;
DROP INDEX IF EXISTS idx_websites_merchant_id;
DROP INDEX IF EXISTS idx_winback_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_winback_targets_campaign_id;
DROP INDEX IF EXISTS idx_winback_targets_customer_id;
DROP INDEX IF EXISTS idx_paybright_transactions_merchant_id;
DROP INDEX IF EXISTS idx_paybright_transactions_transaction_id;
DROP INDEX IF EXISTS idx_partner_tax_payments_partner_id;
DROP INDEX IF EXISTS idx_partner_tax_payments_tax_year;
DROP INDEX IF EXISTS idx_postcard_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_postcard_mailings_campaign_id;
DROP INDEX IF EXISTS idx_product_categories_parent_id;
DROP INDEX IF EXISTS idx_products_category_id;
DROP INDEX IF EXISTS idx_products_merchant_id;
