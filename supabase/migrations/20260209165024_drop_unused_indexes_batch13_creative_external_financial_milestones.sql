/*
  # Drop Unused Indexes - Batch 13: Creative, External, Financial, Milestones
  
  ## Additional Unused Indexes:
  - Creative tracking indexes
  - External sales indexes
  - Financial engine indexes
  - Partner milestones indexes
*/

-- Creative tracking
DROP INDEX IF EXISTS idx_creative_events_created_at;
DROP INDEX IF EXISTS idx_creative_events_event_type;
DROP INDEX IF EXISTS idx_moat_creatives_created_at;
DROP INDEX IF EXISTS idx_moat_creatives_merchant_id;
DROP INDEX IF EXISTS idx_moat_creatives_status;
DROP INDEX IF EXISTS idx_moat_winning_creatives_created_at;

-- External sales
DROP INDEX IF EXISTS idx_external_sales_created_at;
DROP INDEX IF EXISTS idx_external_sales_partner_id;
DROP INDEX IF EXISTS idx_external_sales_sale_date;

-- Financial engine
DROP INDEX IF EXISTS idx_financial_accounts_account_type;
DROP INDEX IF EXISTS idx_financial_accounts_created_at;
DROP INDEX IF EXISTS idx_financial_bank_connections_created_at;
DROP INDEX IF EXISTS idx_financial_bank_connections_status;
DROP INDEX IF EXISTS idx_financial_monthly_summaries_created_at;
DROP INDEX IF EXISTS idx_financial_monthly_summaries_merchant_id;
DROP INDEX IF EXISTS idx_financial_plans_created_at;
DROP INDEX IF EXISTS idx_financial_plans_plan_type;
DROP INDEX IF EXISTS idx_financial_receipts_created_at;
DROP INDEX IF EXISTS idx_financial_receipts_upload_date;
DROP INDEX IF EXISTS idx_financial_rules_created_at;
DROP INDEX IF EXISTS idx_financial_rules_rule_type;
DROP INDEX IF EXISTS idx_financial_subscriptions_created_at;
DROP INDEX IF EXISTS idx_financial_subscriptions_status;
DROP INDEX IF EXISTS idx_financial_transactions_category;
DROP INDEX IF EXISTS idx_financial_transactions_transaction_type;

-- Milestones
DROP INDEX IF EXISTS idx_partner_milestones_created_at;
DROP INDEX IF EXISTS idx_partner_milestones_milestone_type;
DROP INDEX IF EXISTS idx_sales_milestones_created_at;
DROP INDEX IF EXISTS idx_sales_milestones_partner_id;
DROP INDEX IF EXISTS idx_sales_milestones_reached_at;

-- Additional unused
DROP INDEX IF EXISTS idx_dfy_content_library_category;
DROP INDEX IF EXISTS idx_dfy_content_library_content_type;
DROP INDEX IF EXISTS idx_gift_cards_code;
DROP INDEX IF EXISTS idx_internal_crm_companies_company_type;
DROP INDEX IF EXISTS idx_internal_crm_deals_deal_type;
DROP INDEX IF EXISTS idx_internal_crm_tasks_priority;
DROP INDEX IF EXISTS idx_ll_crm_contacts_contact_type;
DROP INDEX IF EXISTS idx_ll_crm_deals_deal_type;
DROP INDEX IF EXISTS idx_ll_crm_documents_document_type;
DROP INDEX IF EXISTS idx_ll_crm_invoices_status;
DROP INDEX IF EXISTS idx_ll_crm_payments_payment_method;