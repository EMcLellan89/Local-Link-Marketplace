/*
  # Drop Unused Indexes - Batch 13: Creative, External Sales, Financial Engine & Milestones Tables
  
  1. Tables Affected
    - creative_* tables (ad tracking)
    - external_sales_* tables
    - financial_* tables (accounting engine)
    - milestone_* tables
  
  2. Performance Impact
    - Removes indexes with no scans
    - Improves performance on high-volume tracking tables
  
  3. Safety
    - Zero usage verified for all indexes
*/

-- Creative tracking
DROP INDEX IF EXISTS idx_creatives_merchant_id;
DROP INDEX IF EXISTS idx_creatives_campaign_id;
DROP INDEX IF EXISTS idx_creative_tracking_creative_id;
DROP INDEX IF EXISTS idx_creative_performance_creative_id;

-- External sales
DROP INDEX IF EXISTS idx_external_sales_partner_id;
DROP INDEX IF EXISTS idx_external_sales_merchant_id;
DROP INDEX IF EXISTS idx_external_sale_commissions_sale_id;

-- Financial engine
DROP INDEX IF EXISTS idx_financial_accounts_merchant_id;
DROP INDEX IF EXISTS idx_financial_transactions_account_id;
DROP INDEX IF EXISTS idx_financial_budgets_merchant_id;
DROP INDEX IF EXISTS idx_financial_plans_merchant_id;
DROP INDEX IF EXISTS idx_financial_receipts_merchant_id;
DROP INDEX IF EXISTS idx_bank_transactions_account_id;
DROP INDEX IF EXISTS idx_accounting_rules_merchant_id;

-- Milestones
DROP INDEX IF EXISTS idx_milestones_partner_id;
DROP INDEX IF EXISTS idx_milestone_progress_partner_id;
DROP INDEX IF EXISTS idx_partner_milestone_badges_partner_id;
DROP INDEX IF EXISTS idx_partner_milestone_certs_partner_id;
DROP INDEX IF EXISTS idx_sales_milestones_partner_id;