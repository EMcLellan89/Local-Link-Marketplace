/*
  # Drop Unused Indexes - Final Batch 2: Deals & CRM

  1. Purpose
    - Remove unused indexes from deals and CRM tables
    - Focus on timestamp and redundant composite indexes
  
  2. Tables Affected
    - deals, deal_transactions
    - crm_activities, admin_crm_* tables
  
  3. Impact
    - Reduces index maintenance overhead during writes
*/

-- Drop redundant deal indexes
DROP INDEX IF EXISTS idx_deals_created_at;
DROP INDEX IF EXISTS idx_deal_transactions_created_at;
DROP INDEX IF EXISTS idx_deal_transactions_redeemed_at;

-- Drop redundant CRM indexes
DROP INDEX IF EXISTS idx_crm_activities_created_at;
DROP INDEX IF EXISTS idx_admin_crm_activities_created_at;
DROP INDEX IF EXISTS idx_admin_crm_contacts_created_at;
DROP INDEX IF EXISTS idx_admin_crm_companies_created_at;
