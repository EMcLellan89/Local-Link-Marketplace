/*
  # Drop Unused Indexes - Batch 2
  
  1. Performance
    - Remove more unused indexes
  
  2. Indexes Removed
    - Merchant, partner, project assignment, budget buster related indexes
*/

DROP INDEX IF EXISTS idx_merchants_partner_id;
DROP INDEX IF EXISTS idx_crm_subscriptions_merchant_created;
DROP INDEX IF EXISTS idx_team_projects_created_by;
DROP INDEX IF EXISTS idx_project_assignments_project_id;
DROP INDEX IF EXISTS idx_project_assignments_assigned_to;
DROP INDEX IF EXISTS idx_project_assignments_status;
DROP INDEX IF EXISTS idx_project_assignments_due_date;
DROP INDEX IF EXISTS idx_partners_status_created;
DROP INDEX IF EXISTS idx_team_monthly_goals_team_member;
DROP INDEX IF EXISTS idx_team_monthly_goals_manager;
DROP INDEX IF EXISTS idx_team_monthly_goals_period;
DROP INDEX IF EXISTS idx_team_monthly_goals_status;
DROP INDEX IF EXISTS idx_partner_tax_payments_partner;
DROP INDEX IF EXISTS idx_partner_tax_payments_year_quarter;
DROP INDEX IF EXISTS idx_partner_tax_payments_status;
DROP INDEX IF EXISTS idx_partner_tax_payments_due_date;
DROP INDEX IF EXISTS idx_budget_buster_subs_user;
DROP INDEX IF EXISTS idx_budget_buster_subs_partner;
DROP INDEX IF EXISTS idx_budget_buster_subs_mode;
DROP INDEX IF EXISTS idx_budget_buster_subs_stripe;
DROP INDEX IF EXISTS idx_budget_buster_subs_period;
DROP INDEX IF EXISTS idx_mode_switches_sub;
DROP INDEX IF EXISTS idx_mode_switches_user;
DROP INDEX IF EXISTS idx_usage_metrics_sub;
DROP INDEX IF EXISTS idx_usage_metrics_date;
DROP INDEX IF EXISTS idx_bb_users_profile;
DROP INDEX IF EXISTS idx_bb_users_email;
DROP INDEX IF EXISTS idx_bb_users_stripe;
DROP INDEX IF EXISTS idx_bb_users_partner;
DROP INDEX IF EXISTS idx_bb_accounts_user;
DROP INDEX IF EXISTS idx_bb_accounts_type;
DROP INDEX IF EXISTS idx_bb_accounts_plaid;
DROP INDEX IF EXISTS idx_bb_transactions_user;
DROP INDEX IF EXISTS idx_bb_transactions_account;
DROP INDEX IF EXISTS idx_bb_transactions_date;
DROP INDEX IF EXISTS idx_bb_transactions_category;
DROP INDEX IF EXISTS idx_bb_transactions_plaid;
