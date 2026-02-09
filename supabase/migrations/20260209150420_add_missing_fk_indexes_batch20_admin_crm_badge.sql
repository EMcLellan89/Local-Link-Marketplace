/*
  # Add Missing Foreign Key Indexes - Batch 20 (Admin CRM & Badge)

  1. Foreign Key Indexes Added
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
    - Improves JOIN performance for all admin CRM and badge queries
    - Optimizes foreign key constraint checks
    - Reduces query planning time
*/

-- Admin CRM Activities
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_company_id
ON admin_crm_activities(company_id);

-- Admin CRM Companies
CREATE INDEX IF NOT EXISTS idx_admin_crm_companies_assigned_to_team_member
ON admin_crm_companies(assigned_to_team_member);

-- Admin CRM Contacts
CREATE INDEX IF NOT EXISTS idx_admin_crm_contacts_admin_company_id
ON admin_crm_contacts(admin_company_id);

-- Admin CRM Goals
CREATE INDEX IF NOT EXISTS idx_admin_crm_goals_team_member_id
ON admin_crm_goals(team_member_id);

-- Admin CRM List Members
CREATE INDEX IF NOT EXISTS idx_admin_crm_list_members_list_id
ON admin_crm_list_members(list_id);

-- Admin CRM Project Assignments
CREATE INDEX IF NOT EXISTS idx_admin_crm_project_assignments_team_member_id
ON admin_crm_project_assignments(team_member_id);

-- AI Bot Subscriptions
CREATE INDEX IF NOT EXISTS idx_ai_bot_subscriptions_bot_product_id
ON ai_bot_subscriptions(bot_product_id);

-- AI Tool Calls
CREATE INDEX IF NOT EXISTS idx_ai_tool_calls_bot_profile_id
ON ai_tool_calls(bot_profile_id);

CREATE INDEX IF NOT EXISTS idx_ai_tool_calls_tool_id
ON ai_tool_calls(tool_id);

CREATE INDEX IF NOT EXISTS idx_ai_tool_calls_user_id
ON ai_tool_calls(user_id);

-- Badge Audit Log
CREATE INDEX IF NOT EXISTS idx_badge_audit_log_badge_id
ON badge_audit_log(badge_id);

CREATE INDEX IF NOT EXISTS idx_badge_audit_log_partner_id
ON badge_audit_log(partner_id);