/*
  # Drop Unused Indexes - Batch 26
*/

DROP INDEX IF EXISTS idx_partner_crm_deals_company_id;
DROP INDEX IF EXISTS idx_accounting_accountant_users_user_id;
DROP INDEX IF EXISTS idx_accounting_employee_payroll_employee_id;
DROP INDEX IF EXISTS idx_accounting_employees_team_member_id;
DROP INDEX IF EXISTS idx_accounting_tax_payments_obligation_id;
DROP INDEX IF EXISTS idx_accounting_partner_1099_data_partner_id;
DROP INDEX IF EXISTS idx_partner_deal_sync_log_partner_deal_id;
DROP INDEX IF EXISTS idx_partner_dfy_tracking_links_product_id;
DROP INDEX IF EXISTS idx_partner_milestone_badges_badge_id;
DROP INDEX IF EXISTS idx_partner_milestone_certs_cert_id;
DROP INDEX IF EXISTS idx_partner_playbook_completions_playbook_id;
DROP INDEX IF EXISTS idx_partner_quarterly_taxes_bank_account_id;
DROP INDEX IF EXISTS idx_partner_service_qualifications_service_id;
DROP INDEX IF EXISTS idx_partner_tax_payments_bank_account_id;
DROP INDEX IF EXISTS idx_partner_tax_settings_autopay_bank_account_id;
DROP INDEX IF EXISTS idx_partner_team_members_partner_id;
DROP INDEX IF EXISTS idx_partner_team_members_user_id;
DROP INDEX IF EXISTS idx_partner_tracking_links_product_slug;
DROP INDEX IF EXISTS idx_partner_uplines_upline_partner_id;
DROP INDEX IF EXISTS idx_profit_network_enrollments_approved_by;
