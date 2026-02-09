/*
  # Add Missing Foreign Key Indexes - Batch 3: Admin CRM Tables

  This migration adds B-tree indexes for foreign key columns that lack covering indexes.
  
  ## Tables Updated:
  - admin_crm_activities (contact_id, project_id, team_member_id)
  - admin_crm_contacts (assigned_to_team_member)
  - admin_crm_list_members (company_id, contact_id)
  - admin_crm_projects (client_company_id)

  Note: Many indexes already exist from the original migration, adding only missing ones.
*/

-- Admin CRM Tables
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_contact_id ON admin_crm_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_project_id ON admin_crm_activities(project_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_team_member_id ON admin_crm_activities(team_member_id);

CREATE INDEX IF NOT EXISTS idx_admin_crm_contacts_assigned_to_team_member ON admin_crm_contacts(assigned_to_team_member);

CREATE INDEX IF NOT EXISTS idx_admin_crm_list_members_company_id ON admin_crm_list_members(company_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_list_members_contact_id ON admin_crm_list_members(contact_id);

CREATE INDEX IF NOT EXISTS idx_admin_crm_projects_client_company_id ON admin_crm_projects(client_company_id);
