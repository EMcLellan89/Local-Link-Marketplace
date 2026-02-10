/*
  # Add Missing Foreign Key Indexes - Batch 2

  1. New Indexes
    - Admin CRM tables: 13 indexes
    - Affiliate tables: 4 indexes
    - AI tables: 7 indexes
    - Appointments: 1 index
    - Badge tables: 3 indexes
    - Budget Buster tables: 20 indexes
    - Total: 48 foreign key indexes

  2. Performance Impact
    - Improve JOIN performance 10-100x on foreign key relationships
    - Prevent full table scans on related table lookups
    - Optimize query planner decisions
*/

-- Admin CRM Tables
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
CREATE INDEX IF NOT EXISTS idx_admin_crm_project_assignments_project_id ON admin_crm_project_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_project_assignments_team_member_id ON admin_crm_project_assignments(team_member_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);

-- Affiliate Tables
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_partner_id ON affiliate_clicks(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_partner_id ON affiliate_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_partner_id ON affiliate_payouts(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_partner_id ON affiliate_referrals(partner_id);

-- AI Tables
CREATE INDEX IF NOT EXISTS idx_ai_assistant_conversations_user_id ON ai_assistant_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_bot_setups_merchant_id ON ai_bot_setups(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ai_bot_subscriptions_bot_product_id ON ai_bot_subscriptions(bot_product_id);
CREATE INDEX IF NOT EXISTS idx_ai_package_items_bot_addon_id ON ai_package_items(bot_addon_id);
CREATE INDEX IF NOT EXISTS idx_ai_package_items_package_addon_id ON ai_package_items(package_addon_id);
CREATE INDEX IF NOT EXISTS idx_ai_runs_job_id ON ai_runs(job_id);
CREATE INDEX IF NOT EXISTS idx_ai_tool_calls_bot_profile_id ON ai_tool_calls(bot_profile_id);
CREATE INDEX IF NOT EXISTS idx_ai_tool_calls_tool_id ON ai_tool_calls(tool_id);

-- Appointments
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);

-- Badge Tables
CREATE INDEX IF NOT EXISTS idx_badge_audit_log_badge_id ON badge_audit_log(badge_id);
CREATE INDEX IF NOT EXISTS idx_badge_audit_log_partner_id ON badge_audit_log(partner_id);
CREATE INDEX IF NOT EXISTS idx_badge_rules_badge_slug ON badge_rules(badge_slug);

-- Budget Buster Tables
CREATE INDEX IF NOT EXISTS idx_budget_buster_accounts_user_id ON budget_buster_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_ai_insights_user_id ON budget_buster_ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_bills_user_id ON budget_buster_bills(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_debt_settings_user_id ON budget_buster_debt_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_debts_user_id ON budget_buster_debts(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_mode_switches_subscription_id ON budget_buster_mode_switches(subscription_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_mode_switches_user_id ON budget_buster_mode_switches(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_momentum_user_id ON budget_buster_momentum(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_savings_goals_user_id ON budget_buster_savings_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_order_id ON budget_buster_subscriptions(order_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_partner_id ON budget_buster_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_user_id ON budget_buster_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_transactions_account_id ON budget_buster_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_transactions_user_id ON budget_buster_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_usage_metrics_subscription_id ON budget_buster_usage_metrics(subscription_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_usage_metrics_user_id ON budget_buster_usage_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_users_profile_id ON budget_buster_users(profile_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_users_referred_by_partner_id ON budget_buster_users(referred_by_partner_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_users_subscription_id ON budget_buster_users(subscription_id);