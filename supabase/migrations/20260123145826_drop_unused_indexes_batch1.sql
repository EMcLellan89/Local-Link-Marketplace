/*
  # Drop Unused Indexes - Batch 1
  
  1. Performance
    - Remove unused indexes to improve write performance
    - Reduces storage overhead
  
  2. Indexes Removed
    - Team member, partner CRM, project, and tax-related unused indexes
*/

-- Drop unused indexes that are not being used
DROP INDEX IF EXISTS idx_team_members_manager_id;
DROP INDEX IF EXISTS idx_partner_crm_companies_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_companies_status;
DROP INDEX IF EXISTS idx_partner_crm_companies_primary_email;
DROP INDEX IF EXISTS idx_partner_crm_contacts_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_contacts_company_id;
DROP INDEX IF EXISTS idx_partner_crm_contacts_email;
DROP INDEX IF EXISTS idx_partner_crm_deals_partner_id;
DROP INDEX IF EXISTS idx_team_projects_manager_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_company_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_stage;
DROP INDEX IF EXISTS idx_partner_crm_deals_payment_received;
DROP INDEX IF EXISTS idx_partner_crm_deals_synced;
DROP INDEX IF EXISTS idx_partner_crm_deal_products_deal_id;
DROP INDEX IF EXISTS idx_partner_crm_deal_products_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_deal_products_sku;
DROP INDEX IF EXISTS idx_partner_crm_deal_notes_deal_id;
DROP INDEX IF EXISTS idx_partner_crm_deal_notes_partner_id;
DROP INDEX IF EXISTS idx_partner_bank_accounts_partner_id;
DROP INDEX IF EXISTS idx_partner_bank_accounts_is_active;
DROP INDEX IF EXISTS idx_partner_tax_settings_partner_id;
DROP INDEX IF EXISTS idx_partner_quarterly_taxes_partner_id;
DROP INDEX IF EXISTS idx_team_projects_status;
DROP INDEX IF EXISTS idx_partner_quarterly_taxes_year_quarter;
DROP INDEX IF EXISTS idx_partner_quarterly_taxes_due_date;
DROP INDEX IF EXISTS idx_partner_quarterly_taxes_payment_status;
DROP INDEX IF EXISTS idx_partner_accounting_transactions_partner_id;
DROP INDEX IF EXISTS idx_partner_accounting_transactions_date;
DROP INDEX IF EXISTS idx_partner_accounting_transactions_type;
DROP INDEX IF EXISTS idx_partner_accounting_transactions_category;
DROP INDEX IF EXISTS idx_partner_accounting_transactions_tax_year;
