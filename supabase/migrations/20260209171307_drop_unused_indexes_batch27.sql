/*
  # Drop Unused Indexes - Batch 27
*/

DROP INDEX IF EXISTS idx_project_assignments_project_id;
DROP INDEX IF EXISTS idx_redemptions_purchase_id;
DROP INDEX IF EXISTS idx_admin_crm_activities_contact_id;
DROP INDEX IF EXISTS idx_admin_crm_activities_project_id;
DROP INDEX IF EXISTS idx_admin_crm_activities_team_member_id;
DROP INDEX IF EXISTS idx_admin_crm_contacts_assigned_to_team_member;
DROP INDEX IF EXISTS idx_admin_crm_list_members_company_id;
DROP INDEX IF EXISTS idx_admin_crm_list_members_contact_id;
DROP INDEX IF EXISTS idx_admin_crm_projects_client_company_id;
DROP INDEX IF EXISTS idx_subscription_crm_mapping_crm_tier_id;
DROP INDEX IF EXISTS idx_vapi_tools_assistant_id;
DROP INDEX IF EXISTS idx_white_label_licenses_vertical_product_id;
DROP INDEX IF EXISTS idx_budget_buster_users_subscription_id;
DROP INDEX IF EXISTS idx_budget_buster_debt_settings_user_id;
DROP INDEX IF EXISTS idx_budget_buster_savings_goals_user_id;
DROP INDEX IF EXISTS idx_budget_buster_momentum_user_id;
DROP INDEX IF EXISTS idx_budget_buster_ai_insights_user_id;
DROP INDEX IF EXISTS idx_academy_enrollments_course_id_fk;
DROP INDEX IF EXISTS idx_academy_quiz_attempts_user_id_fk;
DROP INDEX IF EXISTS idx_merchant_members_merchant_id;
