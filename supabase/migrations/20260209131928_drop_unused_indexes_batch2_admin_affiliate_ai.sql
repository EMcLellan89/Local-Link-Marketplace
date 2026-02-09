/*
  # Drop Unused Indexes - Batch 2: Admin, Affiliate, and AI Tables

  1. Changes
    - Drop unused indexes from admin_* tables
    - Drop unused indexes from affiliate_* tables
    - Drop unused indexes from ai_* tables
    
  2. Rationale
    - These indexes have idx_scan = 0, meaning they've never been used by any query
    - Reducing unused indexes improves database performance and reduces storage
*/

-- Admin CRM tables
DROP INDEX IF EXISTS idx_admin_crm_activities_company_id;
DROP INDEX IF EXISTS idx_admin_crm_activities_contact_id;
DROP INDEX IF EXISTS idx_admin_crm_activities_project_id;
DROP INDEX IF EXISTS idx_admin_crm_activities_team_member_id;
DROP INDEX IF EXISTS idx_admin_crm_companies_assigned_to_team_member;
DROP INDEX IF EXISTS idx_admin_crm_contacts_admin_company_id;
DROP INDEX IF EXISTS idx_admin_crm_contacts_assigned_to_team_member;
DROP INDEX IF EXISTS idx_admin_crm_goals_team_member_id;
DROP INDEX IF EXISTS idx_admin_crm_list_members_company_id;
DROP INDEX IF EXISTS idx_admin_crm_list_members_contact_id;
DROP INDEX IF EXISTS idx_admin_crm_list_members_list_id;
DROP INDEX IF EXISTS idx_admin_crm_project_assignments_project_id;
DROP INDEX IF EXISTS idx_admin_crm_project_assignments_team_member_id;
DROP INDEX IF EXISTS idx_admin_sessions_admin_user_id;

-- Affiliate tables
DROP INDEX IF EXISTS idx_affiliate_clicks_converted_user_id;
DROP INDEX IF EXISTS idx_affiliate_clicks_partner_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_order_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_partner_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_payout_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_referred_user_id;
DROP INDEX IF EXISTS idx_affiliate_partners_user_id;
DROP INDEX IF EXISTS idx_affiliate_payouts_partner_id;
DROP INDEX IF EXISTS idx_affiliate_referrals_partner_id;
DROP INDEX IF EXISTS idx_affiliate_referrals_referred_user_id;

-- AI tables
DROP INDEX IF EXISTS idx_ai_assistant_conversations_user_id;
DROP INDEX IF EXISTS idx_ai_bot_setups_merchant_id;
DROP INDEX IF EXISTS idx_ai_bot_subscriptions_bot_product_id;
DROP INDEX IF EXISTS idx_ai_package_items_bot_addon_id;
DROP INDEX IF EXISTS idx_ai_runs_job_id;
DROP INDEX IF EXISTS idx_ai_tool_calls_bot;
DROP INDEX IF EXISTS idx_ai_tool_calls_conversation;
DROP INDEX IF EXISTS idx_ai_tool_calls_created;
DROP INDEX IF EXISTS idx_ai_tool_calls_tool_id;
DROP INDEX IF EXISTS idx_ai_tool_calls_user;
