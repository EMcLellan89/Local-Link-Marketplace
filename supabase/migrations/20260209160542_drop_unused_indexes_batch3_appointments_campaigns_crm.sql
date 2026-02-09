/*
  # Drop Unused Indexes - Batch 3: Appointments, Campaigns & CRM Tables
  
  1. Tables Affected
    - appointments
    - campaigns and campaign_* tables
    - crm_* tables (contacts, deals, notes, tasks, etc.)
  
  2. Performance Impact
    - Removes unused indexes identified by pg_stat_user_indexes
    - Reduces index maintenance overhead on writes
  
  3. Safety
    - All indexes have 0 scans indicating no query usage
*/

-- Appointments
DROP INDEX IF EXISTS idx_appointments_customer_id;
DROP INDEX IF EXISTS idx_appointments_merchant_id;
DROP INDEX IF EXISTS idx_appointments_partner_id;

-- Campaigns
DROP INDEX IF EXISTS idx_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_campaign_creatives_campaign_id;
DROP INDEX IF EXISTS idx_campaign_performance_campaign_id;
DROP INDEX IF EXISTS idx_deploy_winner_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_deploy_winner_campaigns_creative_id;

-- CRM tables
DROP INDEX IF EXISTS idx_crm_contacts_merchant_id;
DROP INDEX IF EXISTS idx_crm_contacts_assigned_to;
DROP INDEX IF EXISTS idx_crm_deals_merchant_id;
DROP INDEX IF EXISTS idx_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_crm_tasks_merchant_id;
DROP INDEX IF EXISTS idx_crm_tasks_assigned_to;
DROP INDEX IF EXISTS idx_crm_notes_merchant_id;
DROP INDEX IF EXISTS idx_crm_notes_contact_id;
DROP INDEX IF EXISTS idx_crm_activities_merchant_id;
DROP INDEX IF EXISTS idx_crm_activities_contact_id;
DROP INDEX IF EXISTS idx_crm_bot_training_data_merchant_id;
DROP INDEX IF EXISTS idx_crm_csv_exports_merchant_id;
DROP INDEX IF EXISTS idx_crm_migration_requests_merchant_id;
DROP INDEX IF EXISTS idx_crm_subscriptions_merchant_id;