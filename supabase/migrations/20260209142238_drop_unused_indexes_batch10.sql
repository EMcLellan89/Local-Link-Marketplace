/*
  # Drop Unused Indexes - Batch 10

  1. Changes
    - Remove indexes that haven't been used in query plans
    - These are likely redundant or covered by other indexes
  
  2. Performance Impact
    - Reduces index maintenance overhead
    - Frees up storage space
    - Faster INSERT/UPDATE/DELETE operations
*/

-- Drop unused indexes from various tables
DROP INDEX IF EXISTS idx_academy_certifications_created_at;
DROP INDEX IF EXISTS idx_academy_enrollments_created_at;
DROP INDEX IF EXISTS idx_academy_progress_created_at;
DROP INDEX IF EXISTS idx_academy_quiz_attempts_created_at;
DROP INDEX IF EXISTS idx_accounting_employee_payroll_created_at;
DROP INDEX IF EXISTS idx_accounting_employees_created_at;
DROP INDEX IF EXISTS idx_accounting_partner_1099_data_created_at;
DROP INDEX IF EXISTS idx_accounting_tax_obligations_created_at;
DROP INDEX IF EXISTS idx_accounting_tax_payments_created_at;
DROP INDEX IF EXISTS idx_admin_crm_activities_created_at;
DROP INDEX IF EXISTS idx_admin_crm_companies_created_at;
DROP INDEX IF EXISTS idx_admin_crm_contacts_created_at;
DROP INDEX IF EXISTS idx_admin_crm_goals_created_at;
DROP INDEX IF EXISTS idx_ai_bot_subscriptions_created_at;
DROP INDEX IF EXISTS idx_ai_tool_calls_created_at;
DROP INDEX IF EXISTS idx_badge_audit_log_created_at;
DROP INDEX IF EXISTS idx_bot_conversations_created_at;
DROP INDEX IF EXISTS idx_bot_deployments_created_at;
DROP INDEX IF EXISTS idx_budget_buster_accounts_created_at;
DROP INDEX IF EXISTS idx_budget_buster_bills_created_at;
DROP INDEX IF EXISTS idx_budget_buster_debts_created_at;
DROP INDEX IF EXISTS idx_budget_buster_subscriptions_created_at;
DROP INDEX IF EXISTS idx_budget_buster_transactions_created_at;
DROP INDEX IF EXISTS idx_budget_buster_users_created_at;
DROP INDEX IF EXISTS idx_business_coaching_bookings_created_at;
DROP INDEX IF EXISTS idx_commission_partner_earnings_created_at;
DROP INDEX IF EXISTS idx_commission_payouts_created_at;
DROP INDEX IF EXISTS idx_communications_subscriptions_created_at;
DROP INDEX IF EXISTS idx_communications_transactions_created_at;
