/*
  # Add Missing Foreign Key Indexes - Batch 2 (Accounting Part 2 & Admin)

  1. Performance Improvements
    - Add indexes for remaining accounting table foreign keys
    - Add indexes for admin and affiliate table foreign keys
    
  2. Tables Affected
    - accounting_payments, accounting_payroll, accounting_reconciliations
    - accounting_tax_categories, accounting_tax_payments, accounting_tax_reports
    - accounting_transactions, admin_crm_activities, admin_crm_companies
    - admin_crm_contacts, admin_crm_goals, admin_crm_list_members
    - admin_crm_project_assignments, admin_sessions
    - affiliate_clicks, affiliate_commissions, affiliate_partners
    - affiliate_payouts, affiliate_referrals
*/

-- Accounting tables (part 2)
CREATE INDEX IF NOT EXISTS idx_accounting_payments_bill_id ON accounting_payments(bill_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_customer_id ON accounting_payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_deposit_account_id ON accounting_payments(deposit_account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_invoice_id ON accounting_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_journal_entry_id ON accounting_payments(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_merchant_id ON accounting_payments(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payroll_journal_entry_id ON accounting_payroll(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payroll_merchant_id ON accounting_payroll(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_reconciliations_account_id ON accounting_reconciliations(account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_reconciliations_merchant_id ON accounting_reconciliations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_reconciliations_reconciled_by ON accounting_reconciliations(reconciled_by);
CREATE INDEX IF NOT EXISTS idx_accounting_tax_categories_merchant_id ON accounting_tax_categories(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_tax_payments_obligation_id ON accounting_tax_payments(obligation_id);
CREATE INDEX IF NOT EXISTS idx_accounting_tax_reports_merchant_id ON accounting_tax_reports(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_account_id ON accounting_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_customer_id ON accounting_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_journal_entry_id ON accounting_transactions(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_merchant_id ON accounting_transactions(merchant_id);

-- Admin CRM tables
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_company_id ON admin_crm_activities(company_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_contact_id ON admin_crm_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_project_id ON admin_crm_activities(project_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_team_member_id ON admin_crm_activities(team_member_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_companies_assigned_to_team_member ON admin_crm_companies(assigned_to_team_member);
CREATE INDEX IF NOT EXISTS idx_admin_crm_contacts_admin_company_id ON admin_crm_contacts(admin_company_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_contacts_assigned_to_team_member ON admin_crm_contacts(assigned_to_team_member);
CREATE INDEX IF NOT EXISTS idx_admin_crm_goals_team_member_id ON admin_crm_goals(team_member_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_list_members_company_id ON admin_crm_list_members(company_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_list_members_contact_id ON admin_crm_list_members(contact_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_list_members_list_id ON admin_crm_list_members(list_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_project_assignments_team_member_id ON admin_crm_project_assignments(team_member_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_project_assignments_project_id ON admin_crm_project_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);

-- Affiliate tables
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_converted_user_id ON affiliate_clicks(converted_user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_partner_id ON affiliate_clicks(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_partner_id ON affiliate_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_referred_user_id ON affiliate_commissions(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_partners_user_id ON affiliate_partners(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_partner_id ON affiliate_payouts(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_partner_id ON affiliate_referrals(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_referred_user_id ON affiliate_referrals(referred_user_id);
