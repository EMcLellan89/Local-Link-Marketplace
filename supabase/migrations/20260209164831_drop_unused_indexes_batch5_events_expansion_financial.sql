/*
  # Drop Unused Indexes - Batch 5: Events, Expansion, Financial, Gift, Internal, Invoice, Job
  
  ## Tables Covered:
  - event_* tables
  - expansion_* tables
  - external_* tables
  - financial_* tables
  - gift_* tables
  - internal_* tables
  - invoice_* tables
  - job_* tables
*/

-- Event tables
DROP INDEX IF EXISTS idx_event_registrations_created_at;
DROP INDEX IF EXISTS idx_event_registrations_event_id;
DROP INDEX IF EXISTS idx_events_created_at;
DROP INDEX IF EXISTS idx_events_merchant_id;

-- Expansion tables
DROP INDEX IF EXISTS idx_expansion_requests_created_at;
DROP INDEX IF EXISTS idx_expansion_requests_partner_id;

-- External tables
DROP INDEX IF EXISTS idx_external_sales_ingested_at;

-- Financial tables
DROP INDEX IF EXISTS idx_financial_accounts_merchant_id;
DROP INDEX IF EXISTS idx_financial_bank_connections_merchant_id;
DROP INDEX IF EXISTS idx_financial_plans_merchant_id;
DROP INDEX IF EXISTS idx_financial_receipts_merchant_id;
DROP INDEX IF EXISTS idx_financial_receipts_transaction_id;
DROP INDEX IF EXISTS idx_financial_rules_merchant_id;
DROP INDEX IF EXISTS idx_financial_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_financial_transactions_account_id;
DROP INDEX IF EXISTS idx_financial_transactions_created_at;
DROP INDEX IF EXISTS idx_financial_transactions_merchant_id;

-- Gift cards
DROP INDEX IF EXISTS idx_gift_cards_created_at;
DROP INDEX IF EXISTS idx_gift_cards_merchant_id;

-- Internal CRM
DROP INDEX IF EXISTS idx_internal_crm_companies_created_at;
DROP INDEX IF EXISTS idx_internal_crm_contacts_company_id;
DROP INDEX IF EXISTS idx_internal_crm_contacts_created_at;
DROP INDEX IF EXISTS idx_internal_crm_deals_created_at;
DROP INDEX IF EXISTS idx_internal_crm_notes_created_at;
DROP INDEX IF EXISTS idx_internal_crm_tasks_created_at;

-- Invoice tables
DROP INDEX IF EXISTS idx_invoice_items_created_at;
DROP INDEX IF EXISTS idx_invoices_created_at;
DROP INDEX IF EXISTS idx_invoices_due_date;
DROP INDEX IF EXISTS idx_invoices_status;

-- Job tables
DROP INDEX IF EXISTS idx_job_applications_created_at;
DROP INDEX IF EXISTS idx_job_applications_job_id;
DROP INDEX IF EXISTS idx_job_applications_status;
DROP INDEX IF EXISTS idx_job_hire_orders_created_at;
DROP INDEX IF EXISTS idx_job_hire_orders_merchant_id;
DROP INDEX IF EXISTS idx_job_postings_created_at;
DROP INDEX IF EXISTS idx_job_postings_merchant_id;