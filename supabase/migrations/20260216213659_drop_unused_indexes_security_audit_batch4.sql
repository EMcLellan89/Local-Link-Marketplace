/*
  # Drop Unused Indexes - Security Audit Batch 4
  
  Drops unused indexes from deal, DFY, email, event, expansion, external sales, and financial tables.
  
  These indexes have not been used and are safe to remove for improved database performance.
  
  Tables affected:
  - deal_schedules, deal_templates, deals
  - dfy_campaign_templates, dfy_content_library, dfy_fulfillment_tasks, dfy_orders, dfy_products
  - email_campaigns, email_sequences, email_subscriptions, email_templates
  - event_logs
  - expansion_requests
  - external_sales_ingest
  - financial_accounting_categories, financial_bank_accounts, financial_bank_transactions, financial_charts_of_accounts
*/

-- Deal tables
DROP INDEX IF EXISTS idx_deal_schedules_deal_id;
DROP INDEX IF EXISTS idx_deal_templates_merchant_id;
DROP INDEX IF EXISTS idx_deals_merchant_id;
DROP INDEX IF EXISTS idx_deals_status;

-- DFY (Done-For-You) tables
DROP INDEX IF EXISTS idx_dfy_campaign_templates_category;
DROP INDEX IF EXISTS idx_dfy_content_library_category;
DROP INDEX IF EXISTS idx_dfy_content_library_industry;
DROP INDEX IF EXISTS idx_dfy_fulfillment_tasks_order_id;
DROP INDEX IF EXISTS idx_dfy_fulfillment_tasks_assigned_to;
DROP INDEX IF EXISTS idx_dfy_orders_merchant_id;
DROP INDEX IF EXISTS idx_dfy_orders_product_id;
DROP INDEX IF EXISTS idx_dfy_orders_status;
DROP INDEX IF EXISTS idx_dfy_products_category;

-- Email tables
DROP INDEX IF EXISTS idx_email_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_email_campaigns_status;
DROP INDEX IF EXISTS idx_email_sequences_merchant_id;
DROP INDEX IF EXISTS idx_email_subscriptions_user_id;
DROP INDEX IF EXISTS idx_email_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_email_templates_merchant_id;

-- Event tables
DROP INDEX IF EXISTS idx_event_logs_entity_type;
DROP INDEX IF EXISTS idx_event_logs_entity_id;
DROP INDEX IF EXISTS idx_event_logs_user_id;

-- Expansion tables
DROP INDEX IF EXISTS idx_expansion_requests_partner_id;
DROP INDEX IF EXISTS idx_expansion_requests_status;

-- External sales tables
DROP INDEX IF EXISTS idx_external_sales_ingest_business_id;
DROP INDEX IF EXISTS idx_external_sales_ingest_partner_id;
DROP INDEX IF EXISTS idx_external_sales_ingest_status;

-- Financial tables
DROP INDEX IF EXISTS idx_financial_accounting_categories_user_id;
DROP INDEX IF EXISTS idx_financial_bank_accounts_user_id;
DROP INDEX IF EXISTS idx_financial_bank_transactions_account_id;
DROP INDEX IF EXISTS idx_financial_bank_transactions_user_id;
DROP INDEX IF EXISTS idx_financial_charts_of_accounts_user_id;