/*
  # Drop Unused Indexes - Security Audit Batch 11
  
  Drops unused indexes from surveys, team, territory, transaction, Twilio, UGC, and VAPI tables.
  
  These indexes have not been used and are safe to remove for improved database performance.
  
  Tables affected:
  - surveys, survey_responses
  - team_assignments, team_crm_activities, team_crm_companies, team_crm_contacts, team_crm_deals
  - team_crm_projects, team_crm_tasks, team_members
  - territory_warnings
  - transactions
  - twilio_calls, twilio_emails, twilio_messages
  - ugc_creators, ugc_orders, ugc_videos
  - vapi_assistant_configs, vapi_call_logs, vapi_merchant_configs
*/

-- Survey tables
DROP INDEX IF EXISTS idx_surveys_merchant_id;
DROP INDEX IF EXISTS idx_survey_responses_survey_id;
DROP INDEX IF EXISTS idx_survey_responses_customer_id;

-- Team tables
DROP INDEX IF EXISTS idx_team_assignments_member_id;
DROP INDEX IF EXISTS idx_team_crm_activities_contact_id;
DROP INDEX IF EXISTS idx_team_crm_activities_company_id;
DROP INDEX IF EXISTS idx_team_crm_companies_owner_id;
DROP INDEX IF EXISTS idx_team_crm_contacts_company_id;
DROP INDEX IF EXISTS idx_team_crm_contacts_owner_id;
DROP INDEX IF EXISTS idx_team_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_team_crm_deals_owner_id;
DROP INDEX IF EXISTS idx_team_crm_projects_owner_id;
DROP INDEX IF EXISTS idx_team_crm_tasks_owner_id;
DROP INDEX IF EXISTS idx_team_members_user_id;
DROP INDEX IF EXISTS idx_team_members_manager_id;

-- Territory tables
DROP INDEX IF EXISTS idx_territory_warnings_partner_id;
DROP INDEX IF EXISTS idx_territory_warnings_territory_id;

-- Transaction tables
DROP INDEX IF EXISTS idx_transactions_customer_id;
DROP INDEX IF EXISTS idx_transactions_merchant_id;

-- Twilio tables
DROP INDEX IF EXISTS idx_twilio_calls_merchant_id;
DROP INDEX IF EXISTS idx_twilio_calls_customer_id;
DROP INDEX IF EXISTS idx_twilio_emails_merchant_id;
DROP INDEX IF EXISTS idx_twilio_emails_customer_id;
DROP INDEX IF EXISTS idx_twilio_messages_merchant_id;
DROP INDEX IF EXISTS idx_twilio_messages_customer_id;

-- UGC tables
DROP INDEX IF EXISTS idx_ugc_creators_user_id;
DROP INDEX IF EXISTS idx_ugc_orders_merchant_id;
DROP INDEX IF EXISTS idx_ugc_orders_creator_id;
DROP INDEX IF EXISTS idx_ugc_videos_order_id;
DROP INDEX IF EXISTS idx_ugc_videos_creator_id;

-- VAPI tables
DROP INDEX IF EXISTS idx_vapi_assistant_configs_merchant_id;
DROP INDEX IF EXISTS idx_vapi_call_logs_merchant_id;
DROP INDEX IF EXISTS idx_vapi_call_logs_assistant_id;
DROP INDEX IF EXISTS idx_vapi_merchant_configs_merchant_id;