/*
  # Drop Unused Indexes - New Batch 3
  
  1. Indexes to Drop (Appointments, Campaigns, CRM)
    - Appointments table indexes
    - Campaign-related indexes
    - CRM activities, contacts, tasks
  
  2. Performance Impact
    - Reduces storage overhead
    - Speeds up INSERT/UPDATE operations
    - All indexes have idx_scan = 0 (never used)
*/

-- Appointments indexes
DROP INDEX IF EXISTS idx_appointments_merchant_id;
DROP INDEX IF EXISTS idx_appointments_scheduled_at;
DROP INDEX IF EXISTS idx_appointments_status;

-- Campaign indexes
DROP INDEX IF EXISTS idx_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_campaigns_status;
DROP INDEX IF EXISTS idx_campaign_analytics_campaign_id;
DROP INDEX IF EXISTS idx_campaign_analytics_date;
DROP INDEX IF EXISTS idx_campaign_segments_campaign_id;

-- CRM indexes
DROP INDEX IF EXISTS idx_crm_activities_contact_id;
DROP INDEX IF EXISTS idx_crm_activities_created_at;
DROP INDEX IF EXISTS idx_crm_activities_type;
DROP INDEX IF EXISTS idx_crm_contacts_email;
DROP INDEX IF EXISTS idx_crm_contacts_merchant_id;
DROP INDEX IF EXISTS idx_crm_contacts_status;
DROP INDEX IF EXISTS idx_crm_tasks_assigned_to;
DROP INDEX IF EXISTS idx_crm_tasks_due_date;
DROP INDEX IF EXISTS idx_crm_tasks_merchant_id;
DROP INDEX IF EXISTS idx_crm_tasks_status;