/*
  # Drop Unused Indexes - Batch 10: Territories, Team, Transactions, Twilio, UGC, VAPI, Video
  
  ## Tables Covered:
  - team_* tables
  - territories
  - territory_* tables
  - transactions
  - twilio_* tables
  - ugc_* tables
  - vapi_* tables
  - video_* tables
*/

-- Team tables
DROP INDEX IF EXISTS idx_team_crm_activities_created_at;
DROP INDEX IF EXISTS idx_team_crm_companies_created_at;
DROP INDEX IF EXISTS idx_team_crm_contacts_company_id;
DROP INDEX IF EXISTS idx_team_crm_contacts_created_at;
DROP INDEX IF EXISTS idx_team_crm_deals_created_at;
DROP INDEX IF EXISTS idx_team_crm_notes_created_at;
DROP INDEX IF EXISTS idx_team_crm_tasks_created_at;
DROP INDEX IF EXISTS idx_team_hierarchy_created_at;
DROP INDEX IF EXISTS idx_team_members_created_at;
DROP INDEX IF EXISTS idx_team_members_user_id;

-- Territory tables
DROP INDEX IF EXISTS idx_territories_created_at;
DROP INDEX IF EXISTS idx_territories_partner_id;
DROP INDEX IF EXISTS idx_territory_assignments_created_at;
DROP INDEX IF EXISTS idx_territory_assignments_partner_id;

-- Transactions
DROP INDEX IF EXISTS idx_transactions_created_at;
DROP INDEX IF EXISTS idx_transactions_status;
DROP INDEX IF EXISTS idx_transactions_type;

-- Twilio tables
DROP INDEX IF EXISTS idx_twilio_call_logs_created_at;
DROP INDEX IF EXISTS idx_twilio_email_logs_created_at;
DROP INDEX IF EXISTS idx_twilio_sms_logs_created_at;
DROP INDEX IF EXISTS idx_twilio_sms_logs_status;

-- UGC tables
DROP INDEX IF EXISTS idx_ugc_creators_created_at;
DROP INDEX IF EXISTS idx_ugc_creators_user_id;
DROP INDEX IF EXISTS idx_ugc_network_members_created_at;
DROP INDEX IF EXISTS idx_ugc_orders_created_at;
DROP INDEX IF EXISTS idx_ugc_orders_status;
DROP INDEX IF EXISTS idx_ugc_reviews_created_at;
DROP INDEX IF EXISTS idx_ugc_reviews_creator_id;

-- VAPI tables
DROP INDEX IF EXISTS idx_vapi_call_logs_created_at;
DROP INDEX IF EXISTS idx_vapi_call_logs_merchant_id;
DROP INDEX IF EXISTS idx_vapi_configurations_merchant_id;

-- Video tables
DROP INDEX IF EXISTS idx_video_analytics_created_at;
DROP INDEX IF EXISTS idx_video_analytics_video_id;