/*
  # Add Remaining Missing Foreign Key Indexes

  This migration adds all remaining foreign key indexes identified by Supabase's
  index advisor to improve query performance.

  Tables covered (68 foreign keys):
  - accounting_employee_payroll
  - accounting_tax_payments
  - admin_crm_activities
  - admin_crm_companies
  - admin_crm_contacts
  - admin_crm_goals
  - admin_crm_list_members
  - admin_crm_project_assignments
  - budget_buster_accounts
  - budget_buster_ai_insights
  - budget_buster_bills
  - budget_buster_debts
  - budget_buster_mode_switches
  - budget_buster_savings_goals
  - budget_buster_subscriptions
  - budget_buster_transactions
  - budget_buster_users
  - business_coaching_sessions
  - communications_transactions
  - communications_usage
  - crm_companies
  - crm_contacts
  - crm_deals
  - crm_notes
  - crm_tasks
  - customers
  - job_applications
  - job_deliverables
  - job_payouts
  - jobs
  - merchant_team_members
  - merchants
  - partner_accounting_transactions
  - partner_bank_accounts
  - partner_crm_companies
  - partner_crm_contacts
  - partner_crm_deal_notes
  - partner_crm_deal_products
  - partner_crm_deals
  - partner_tax_payments
  - partner_team_members
  - project_assignments
  - team_members
  - vapi_assistants
  - vapi_call_logs
  - vapi_tools
*/

-- Accounting Tables
CREATE INDEX IF NOT EXISTS idx_accounting_employee_payroll_employee_id ON accounting_employee_payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_accounting_tax_payments_obligation_id ON accounting_tax_payments(obligation_id);

-- Admin CRM Tables
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_company_id ON admin_crm_activities(company_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_companies_assigned_to_team_member ON admin_crm_companies(assigned_to_team_member);
CREATE INDEX IF NOT EXISTS idx_admin_crm_contacts_admin_company_id ON admin_crm_contacts(admin_company_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_goals_team_member_id ON admin_crm_goals(team_member_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_list_members_list_id ON admin_crm_list_members(list_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_project_assignments_team_member_id ON admin_crm_project_assignments(team_member_id);

-- Budget Buster Tables
CREATE INDEX IF NOT EXISTS idx_budget_buster_accounts_user_id ON budget_buster_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_ai_insights_user_id ON budget_buster_ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_bills_user_id ON budget_buster_bills(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_debts_user_id ON budget_buster_debts(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_mode_switches_subscription_id ON budget_buster_mode_switches(subscription_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_mode_switches_user_id ON budget_buster_mode_switches(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_savings_goals_user_id ON budget_buster_savings_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_partner_id ON budget_buster_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_user_id ON budget_buster_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_transactions_account_id ON budget_buster_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_transactions_user_id ON budget_buster_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_users_profile_id ON budget_buster_users(profile_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_users_referred_by_partner_id ON budget_buster_users(referred_by_partner_id);

-- Business Coaching
CREATE INDEX IF NOT EXISTS idx_business_coaching_sessions_booking_id ON business_coaching_sessions(booking_id);

-- Communications
CREATE INDEX IF NOT EXISTS idx_communications_transactions_merchant_id ON communications_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_communications_usage_subscription_id ON communications_usage(subscription_id);

-- CRM Tables
CREATE INDEX IF NOT EXISTS idx_crm_companies_assigned_to ON crm_companies(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_assigned_to ON crm_contacts(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_company_id ON crm_contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_assigned_to ON crm_deals(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_deals_company_id ON crm_deals(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_notes_company_id ON crm_notes(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_notes_contact_id ON crm_notes(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_assigned_to ON crm_tasks(assigned_to);

-- Customers
CREATE INDEX IF NOT EXISTS idx_customers_referred_by_partner_id ON customers(referred_by_partner_id);

-- Job Tables
CREATE INDEX IF NOT EXISTS idx_job_applications_partner_id ON job_applications(partner_id);
CREATE INDEX IF NOT EXISTS idx_job_deliverables_job_id ON job_deliverables(job_id);
CREATE INDEX IF NOT EXISTS idx_job_payouts_job_id ON job_payouts(job_id);
CREATE INDEX IF NOT EXISTS idx_job_payouts_sourcing_partner_id ON job_payouts(sourcing_partner_id);
CREATE INDEX IF NOT EXISTS idx_job_payouts_worker_partner_id ON job_payouts(worker_partner_id);
CREATE INDEX IF NOT EXISTS idx_jobs_merchant_id ON jobs(merchant_id);

-- Merchant Tables
CREATE INDEX IF NOT EXISTS idx_merchant_team_members_merchant_id ON merchant_team_members(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_team_members_user_id ON merchant_team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_merchants_partner_id ON merchants(partner_id);
CREATE INDEX IF NOT EXISTS idx_merchants_referred_by_partner_id ON merchants(referred_by_partner_id);

-- Partner Accounting
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_category_id ON partner_accounting_transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_partner_id ON partner_accounting_transactions(partner_id);

-- Partner Tables
CREATE INDEX IF NOT EXISTS idx_partner_bank_accounts_partner_id ON partner_bank_accounts(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_companies_partner_id ON partner_crm_companies(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_contacts_company_id ON partner_crm_contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_contacts_partner_id ON partner_crm_contacts(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deal_notes_deal_id ON partner_crm_deal_notes(deal_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deal_notes_partner_id ON partner_crm_deal_notes(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deal_products_deal_id ON partner_crm_deal_products(deal_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deal_products_partner_id ON partner_crm_deal_products(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_company_id ON partner_crm_deals(company_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_partner_id ON partner_crm_deals(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_tax_payments_partner_id ON partner_tax_payments(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_team_members_partner_id ON partner_team_members(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_team_members_user_id ON partner_team_members(user_id);

-- Team Tables
CREATE INDEX IF NOT EXISTS idx_project_assignments_project_id ON project_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);

-- VAPI Tables
CREATE INDEX IF NOT EXISTS idx_vapi_assistants_merchant_id ON vapi_assistants(merchant_id);
CREATE INDEX IF NOT EXISTS idx_vapi_call_logs_customer_id ON vapi_call_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_vapi_call_logs_merchant_id ON vapi_call_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_vapi_tools_assistant_id ON vapi_tools(assistant_id);