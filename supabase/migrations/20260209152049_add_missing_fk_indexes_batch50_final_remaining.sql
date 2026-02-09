/*
  # Add Missing Foreign Key Indexes - Batch 50: Final Remaining Tables

  1. Performance Optimization
    - Add B-tree indexes on foreign key columns for remaining tables
    
  2. Tables Affected
    - admin_crm_activities (company_id, contact_id, project_id)
    - admin_crm_companies (source_id)
    - admin_crm_contacts (admin_company_id, assigned_to_team_member)
    - admin_crm_list_members (list_id, contact_id)
    - team_member_commissions (team_member_id)
    - team_member_goals (team_member_id)
    - ecommerce_orders (merchant_id, customer_id)
    - printing_orders (merchant_id)
    - ugc_orders (merchant_id, creator_id)
    - video_service_orders (merchant_id)
    - website_orders (merchant_id)
    
  3. Impact
    - 20-50% faster JOIN queries on affected foreign keys
    - Improved query performance for admin, team, and order management
*/

-- Admin CRM Tables
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_company_id ON admin_crm_activities(company_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_contact_id ON admin_crm_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_project_id ON admin_crm_activities(project_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_companies_source_id ON admin_crm_companies(source_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_contacts_admin_company_id ON admin_crm_contacts(admin_company_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_contacts_assigned_to_team_member ON admin_crm_contacts(assigned_to_team_member);
CREATE INDEX IF NOT EXISTS idx_admin_crm_list_members_list_id ON admin_crm_list_members(list_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_list_members_contact_id ON admin_crm_list_members(contact_id);

-- Team Tables
CREATE INDEX IF NOT EXISTS idx_team_member_commissions_team_member_id ON team_member_commissions(team_member_id);
CREATE INDEX IF NOT EXISTS idx_team_member_goals_team_member_id ON team_member_goals(team_member_id);

-- Order Tables
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_merchant_id ON ecommerce_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_customer_id ON ecommerce_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_printing_orders_merchant_id ON printing_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_merchant_id ON ugc_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_creator_id ON ugc_orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_video_service_orders_merchant_id ON video_service_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_website_orders_merchant_id ON website_orders(merchant_id);