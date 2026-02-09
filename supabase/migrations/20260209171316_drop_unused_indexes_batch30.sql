/*
  # Drop Unused Indexes - Batch 30
*/

DROP INDEX IF EXISTS idx_admin_crm_companies_assigned_to_team_member;
DROP INDEX IF EXISTS idx_admin_crm_contacts_admin_company_id;
DROP INDEX IF EXISTS idx_admin_crm_goals_team_member_id;
DROP INDEX IF EXISTS idx_admin_crm_list_members_list_id;
DROP INDEX IF EXISTS idx_admin_crm_project_assignments_team_member_id;
DROP INDEX IF EXISTS idx_ai_bot_subscriptions_bot_product_id;
DROP INDEX IF EXISTS idx_ai_tool_calls_bot_profile_id;
DROP INDEX IF EXISTS idx_ai_tool_calls_tool_id;
DROP INDEX IF EXISTS idx_ai_tool_calls_user_id;
DROP INDEX IF EXISTS idx_badge_audit_log_badge_id;
DROP INDEX IF EXISTS idx_badge_audit_log_partner_id;
DROP INDEX IF EXISTS idx_merchant_orders_merchant_id_fk;
DROP INDEX IF EXISTS idx_merchant_subscriptions_merchant_id_fk;
DROP INDEX IF EXISTS idx_merchant_team_members_merchant_id_fk;
DROP INDEX IF EXISTS idx_merchant_team_members_user_id_fk;
DROP INDEX IF EXISTS idx_merchants_user_id_fk;
DROP INDEX IF EXISTS idx_order_items_order_id_fk;
DROP INDEX IF EXISTS idx_order_items_product_id_fk;
DROP INDEX IF EXISTS idx_outreach_logs_partner_id_fk;
DROP INDEX IF EXISTS idx_partner_accounting_transactions_partner_id_fk;
