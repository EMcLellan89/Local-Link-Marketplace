/*
  # Add Missing Foreign Key Indexes - Batch 9: Admin CRM, AI Bots, Badges

  1. New Indexes
    - admin_crm_activities.company_id
    - admin_crm_companies.assigned_to_team_member
    - admin_crm_contacts.admin_company_id
    - admin_crm_goals.team_member_id
    - admin_crm_list_members.list_id
    - admin_crm_project_assignments.team_member_id
    - ai_bot_subscriptions.bot_product_id
    - ai_tool_calls.bot_profile_id
    - ai_tool_calls.tool_id
    - ai_tool_calls.user_id
    - badge_audit_log.badge_id
    - badge_audit_log.partner_id

  2. Performance Impact
    - Improves JOIN performance on foreign key relationships
    - Reduces query planning time for admin CRM, AI bot, and badge queries
*/

-- Admin CRM Indexes
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_company_id ON admin_crm_activities(company_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_companies_assigned_to_team_member ON admin_crm_companies(assigned_to_team_member);
CREATE INDEX IF NOT EXISTS idx_admin_crm_contacts_admin_company_id ON admin_crm_contacts(admin_company_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_goals_team_member_id ON admin_crm_goals(team_member_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_list_members_list_id ON admin_crm_list_members(list_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_project_assignments_team_member_id ON admin_crm_project_assignments(team_member_id);

-- AI Bot System Indexes
CREATE INDEX IF NOT EXISTS idx_ai_bot_subscriptions_bot_product_id ON ai_bot_subscriptions(bot_product_id);
CREATE INDEX IF NOT EXISTS idx_ai_tool_calls_bot_profile_id ON ai_tool_calls(bot_profile_id);
CREATE INDEX IF NOT EXISTS idx_ai_tool_calls_tool_id ON ai_tool_calls(tool_id);
CREATE INDEX IF NOT EXISTS idx_ai_tool_calls_user_id ON ai_tool_calls(user_id);

-- Badge System Indexes
CREATE INDEX IF NOT EXISTS idx_badge_audit_log_badge_id ON badge_audit_log(badge_id);
CREATE INDEX IF NOT EXISTS idx_badge_audit_log_partner_id ON badge_audit_log(partner_id);
