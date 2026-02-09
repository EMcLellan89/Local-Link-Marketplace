/*
  # Fix Missing Foreign Key Indexes - Batch 5 (CRM & Customer Tables)
  
  1. Performance
    - Add indexes on all unindexed foreign keys
  
  2. Tables Updated
    - credit_ledger
    - crm_activities
    - crm_deals
    - crm_leads
    - crm_migrations
    - crm_notes
    - crm_tasks
    - customer tables
*/

CREATE INDEX IF NOT EXISTS idx_credit_ledger_user_id ON credit_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_lead_id ON crm_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_user_id ON crm_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_contact_id ON crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_assigned_to ON crm_leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_migrations_merchant_id ON crm_migrations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_notes_created_by ON crm_notes(created_by);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_created_by ON crm_tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_lead_id ON crm_tasks(lead_id);
CREATE INDEX IF NOT EXISTS idx_customer_activity_log_business_unit_id ON customer_activity_log(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_activity_log_customer_id ON customer_activity_log(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_activity_log_performed_by ON customer_activity_log(performed_by);
CREATE INDEX IF NOT EXISTS idx_customer_business_relationships_business_unit_id ON customer_business_relationships(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_email_segments_business_unit_id ON customer_email_segments(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_email_segments_created_by ON customer_email_segments(created_by);
CREATE INDEX IF NOT EXISTS idx_customer_impersonation_log_business_unit_id ON customer_impersonation_log(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_impersonation_log_customer_id ON customer_impersonation_log(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_impersonation_log_team_member_id ON customer_impersonation_log(team_member_id);
CREATE INDEX IF NOT EXISTS idx_customer_memberships_tier_id ON customer_memberships(tier_id);
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_assigned_to ON customer_support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_business_unit_id ON customer_support_tickets(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_customer_id ON customer_support_tickets(customer_id);
