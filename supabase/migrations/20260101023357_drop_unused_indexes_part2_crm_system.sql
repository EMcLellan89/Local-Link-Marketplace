/*
  # Drop Unused Indexes - Part 2: CRM System
  
  1. Removes unused indexes from CRM-related tables
  2. Tables affected:
     - crm_activities, crm_tasks, crm_leads, crm_migrations, crm_subscriptions
*/

-- Drop unused indexes on crm_activities
DROP INDEX IF EXISTS idx_crm_activities_user_id;
DROP INDEX IF EXISTS idx_crm_activities_lead_id;

-- Drop unused indexes on crm_tasks
DROP INDEX IF EXISTS idx_crm_tasks_created_by;
DROP INDEX IF EXISTS idx_crm_tasks_lead_id;
DROP INDEX IF EXISTS idx_crm_tasks_assigned_to;
DROP INDEX IF EXISTS idx_crm_tasks_due_date;
DROP INDEX IF EXISTS idx_crm_tasks_status;

-- Drop unused indexes on crm_leads
DROP INDEX IF EXISTS idx_crm_leads_status;
DROP INDEX IF EXISTS idx_crm_leads_assigned_to;
DROP INDEX IF EXISTS idx_crm_leads_next_follow_up;

-- Drop unused indexes on crm_migrations
DROP INDEX IF EXISTS idx_crm_migrations_merchant;
DROP INDEX IF EXISTS idx_crm_migrations_status;

-- Drop unused indexes on crm_subscriptions
DROP INDEX IF EXISTS idx_crm_subscriptions_status;
