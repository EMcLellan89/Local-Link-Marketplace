/*
  # Drop Unused Indexes - Batch 3: Campaigns & CRM Tables

  This migration drops unused indexes from campaign and CRM-related tables.

  ## Tables Affected:
  - Campaign tables (campaigns, recipients, metrics)
  - CRM tables (contacts, deals, tasks, activities)
  - Communication tables

  ## Impact:
  Removes unused indexes to improve write performance and reduce storage.
*/

-- Campaign indexes
DROP INDEX IF EXISTS idx_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_campaigns_status;
DROP INDEX IF EXISTS idx_campaigns_campaign_type;
DROP INDEX IF EXISTS idx_campaigns_start_date;
DROP INDEX IF EXISTS idx_campaigns_end_date;
DROP INDEX IF EXISTS idx_campaign_recipients_campaign_id;
DROP INDEX IF EXISTS idx_campaign_metrics_campaign_id;
DROP INDEX IF EXISTS idx_campaign_metrics_date;

-- CRM indexes
DROP INDEX IF EXISTS idx_crm_contacts_merchant_id;
DROP INDEX IF EXISTS idx_crm_contacts_email;
DROP INDEX IF EXISTS idx_crm_contacts_phone;
DROP INDEX IF EXISTS idx_crm_contacts_created_at;
DROP INDEX IF EXISTS idx_crm_deals_merchant_id;
DROP INDEX IF EXISTS idx_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_crm_deals_stage;
DROP INDEX IF EXISTS idx_crm_deals_status;
DROP INDEX IF EXISTS idx_crm_deals_expected_close_date;
DROP INDEX IF EXISTS idx_crm_tasks_merchant_id;
DROP INDEX IF EXISTS idx_crm_tasks_assigned_to;
DROP INDEX IF EXISTS idx_crm_tasks_due_date;
DROP INDEX IF EXISTS idx_crm_tasks_status;
DROP INDEX IF EXISTS idx_crm_activities_merchant_id;
DROP INDEX IF EXISTS idx_crm_activities_contact_id;
DROP INDEX IF EXISTS idx_crm_activities_activity_type;
DROP INDEX IF EXISTS idx_crm_activities_activity_date;

-- Communication indexes
DROP INDEX IF EXISTS idx_communications_transactions_customer_id;
DROP INDEX IF EXISTS idx_communications_transactions_type;
DROP INDEX IF EXISTS idx_communications_transactions_status;
DROP INDEX IF EXISTS idx_communications_transactions_created_at;