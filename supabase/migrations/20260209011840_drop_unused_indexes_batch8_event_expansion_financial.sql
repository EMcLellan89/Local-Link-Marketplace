/*
  # Drop Unused Indexes - Batch 8: Event, Expansion, and Financial Tables
  
  This migration continues dropping unused indexes.
  
  ## Indexes Dropped
  - Event and expansion indexes
  - External sales indexes
  - Financial engine indexes
  
  ## Impact
  - Reduces storage usage
  - Improves write performance
*/

-- event_registrations
DROP INDEX IF EXISTS idx_event_registrations_customer_id;
DROP INDEX IF EXISTS idx_event_registrations_event_id;

-- events
DROP INDEX IF EXISTS idx_events_merchant_id;

-- expansion_requests
DROP INDEX IF EXISTS idx_expansion_requests_partner_id;

-- external_sales
DROP INDEX IF EXISTS idx_external_sales_partner_id;

-- favorites
DROP INDEX IF EXISTS idx_favorites_customer_id;
DROP INDEX IF EXISTS idx_favorites_merchant_id;

-- finance_bank_transactions
DROP INDEX IF EXISTS idx_finance_bank_transactions_account_id;

-- finance_categorization_rules
DROP INDEX IF EXISTS idx_finance_categorization_rules_entity;

-- finance_dfy_service_requests
DROP INDEX IF EXISTS idx_finance_dfy_service_requests_merchant_id;

-- finance_document_uploads
DROP INDEX IF EXISTS idx_finance_document_uploads_merchant_id;

-- finance_merchant_tax
DROP INDEX IF EXISTS idx_finance_merchant_tax_merchant_id;

-- finance_monthly_close
DROP INDEX IF EXISTS idx_finance_monthly_close_merchant_id;

-- finance_partner_earnings
DROP INDEX IF EXISTS idx_finance_partner_earnings_partner_id;

-- finance_plaid_accounts
DROP INDEX IF EXISTS idx_finance_plaid_accounts_merchant_id;

-- finance_receipts
DROP INDEX IF EXISTS idx_finance_receipts_merchant_id;

-- finance_statements
DROP INDEX IF EXISTS idx_finance_statements_merchant_id;

-- finance_subscription_plans
DROP INDEX IF EXISTS idx_finance_subscription_plans_tier;

-- finance_subscriptions
DROP INDEX IF EXISTS idx_finance_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_finance_subscriptions_plan_id;

-- finance_tax_ready_checklist
DROP INDEX IF EXISTS idx_finance_tax_ready_checklist_merchant_id;
