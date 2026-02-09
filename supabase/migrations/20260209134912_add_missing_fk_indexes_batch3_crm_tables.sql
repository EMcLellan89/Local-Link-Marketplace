/*
  # Add Missing Foreign Key Indexes - Batch 3: CRM Tables

  1. Changes
    - Add indexes for crm_leads (merchant_id, assigned_to)
    - Add indexes for crm_activities (lead_id, merchant_id, user_id)
    - Add indexes for crm_tasks (merchant_id, lead_id, assigned_to, created_by)
    - Add indexes for crm_migrations
    
  2. Rationale
    - CRM tables are heavily queried for merchant operations
    - Lead assignment and activity tracking need fast lookups
    
  3. Performance Impact
    - Faster lead list queries
    - Improved activity timeline rendering
    - Better task management performance
*/

-- CRM Migrations
CREATE INDEX IF NOT EXISTS idx_crm_migrations_merchant_id ON crm_migrations(merchant_id);

-- CRM Leads
CREATE INDEX IF NOT EXISTS idx_crm_leads_merchant_id ON crm_leads(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_assigned_to ON crm_leads(assigned_to);

-- CRM Activities
CREATE INDEX IF NOT EXISTS idx_crm_activities_lead_id ON crm_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_merchant_id ON crm_activities(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_user_id ON crm_activities(user_id);

-- CRM Tasks
CREATE INDEX IF NOT EXISTS idx_crm_tasks_merchant_id ON crm_tasks(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_lead_id ON crm_tasks(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_assigned_to ON crm_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_created_by ON crm_tasks(created_by);
