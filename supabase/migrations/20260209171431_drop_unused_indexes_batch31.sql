/*
  # Drop Unused Indexes - Batch 31

  1. Purpose
    - Remove unused indexes (idx_scan = 0) to reduce storage overhead
    - Improve INSERT/UPDATE performance by reducing index maintenance
    - Continue systematic cleanup from security audit

  2. Indexes Dropped
    - partner_bank_accounts table indexes
    - partner_crm table indexes
    - partner_deals table indexes
    - partner_playbooks table indexes
    - profit_network table indexes
*/

DROP INDEX IF EXISTS idx_partner_bank_accounts_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_companies_owner_id;
DROP INDEX IF EXISTS idx_partner_crm_contacts_company_id;
DROP INDEX IF EXISTS idx_partner_crm_contacts_owner_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_company_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_owner_id;
DROP INDEX IF EXISTS idx_partner_crm_notes_company_id;
DROP INDEX IF EXISTS idx_partner_crm_notes_contact_id;
DROP INDEX IF EXISTS idx_partner_crm_notes_created_by;
DROP INDEX IF EXISTS idx_partner_crm_tasks_assigned_to;
DROP INDEX IF EXISTS idx_partner_crm_tasks_company_id;
DROP INDEX IF EXISTS idx_partner_crm_tasks_contact_id;
DROP INDEX IF EXISTS idx_partner_deals_partner_id;
DROP INDEX IF EXISTS idx_partner_playbook_completions_partner_id;
DROP INDEX IF EXISTS idx_partner_playbook_completions_playbook_id;
DROP INDEX IF EXISTS idx_partner_playbook_lessons_playbook_id;
DROP INDEX IF EXISTS idx_profit_network_businesses_business_id;
DROP INDEX IF EXISTS idx_profit_network_partner_selections_business_id;
DROP INDEX IF EXISTS idx_profit_network_partner_selections_partner_id;
DROP INDEX IF EXISTS idx_profit_network_transactions_business_id;
