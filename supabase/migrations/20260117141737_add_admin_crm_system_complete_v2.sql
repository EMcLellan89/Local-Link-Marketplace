/*
  # Admin CRM System

  1. New Tables
    - admin_crm_goals - Team goals set by admin
    - admin_crm_projects - Projects with team assignments
    - admin_crm_companies - All companies (auto-fed from merchants, partners)
    - admin_crm_contacts - All contacts (auto-fed)
    - admin_crm_lists - CRM list management
    - admin_crm_list_members - Members in each list
    - admin_crm_activities - Activity log
    
  2. Features
    - Goal setting for team members
    - Project management with assignments
    - Auto-population from existing data
    - List management for segmentation
    - Complete contact management
    - Activity tracking
    
  3. Security
    - RLS enabled on all tables
    - Admin-only access
*/

-- Admin CRM Goals Table
CREATE TABLE IF NOT EXISTS admin_crm_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id uuid REFERENCES team_members(id) ON DELETE CASCADE,
  goal_type text NOT NULL,
  title text NOT NULL,
  description text,
  target_value numeric NOT NULL,
  current_value numeric DEFAULT 0,
  unit text DEFAULT 'count',
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text DEFAULT 'active',
  created_by_admin_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Admin CRM Projects Table
CREATE TABLE IF NOT EXISTS admin_crm_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name text NOT NULL,
  description text,
  status text DEFAULT 'planning',
  priority text DEFAULT 'medium',
  start_date date,
  due_date date,
  budget_cents bigint,
  client_company_id uuid,
  created_by_admin_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Project Team Assignments
CREATE TABLE IF NOT EXISTS admin_crm_project_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES admin_crm_projects(id) ON DELETE CASCADE NOT NULL,
  team_member_id uuid REFERENCES team_members(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'member',
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(project_id, team_member_id)
);

-- Admin CRM Companies (Master list with source tracking)
CREATE TABLE IF NOT EXISTS admin_crm_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL,
  source_id uuid,
  company_name text NOT NULL,
  industry text,
  website text,
  phone text,
  email text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  zip_code text,
  country text DEFAULT 'USA',
  status text DEFAULT 'active',
  company_type text,
  revenue_potential_cents bigint,
  employee_count integer,
  notes text,
  tags text[],
  assigned_to_team_member uuid REFERENCES team_members(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(source_type, source_id)
);

-- Admin CRM Contacts
CREATE TABLE IF NOT EXISTS admin_crm_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_company_id uuid REFERENCES admin_crm_companies(id) ON DELETE CASCADE,
  source_type text,
  source_id uuid,
  first_name text NOT NULL,
  last_name text NOT NULL,
  title text,
  email text,
  phone text,
  mobile_phone text,
  is_primary boolean DEFAULT false,
  linkedin_url text,
  notes text,
  tags text[],
  assigned_to_team_member uuid REFERENCES team_members(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CRM Lists for Segmentation
CREATE TABLE IF NOT EXISTS admin_crm_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_name text NOT NULL,
  description text,
  list_type text DEFAULT 'custom',
  created_by_admin_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- List Members
CREATE TABLE IF NOT EXISTS admin_crm_list_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid REFERENCES admin_crm_lists(id) ON DELETE CASCADE NOT NULL,
  company_id uuid REFERENCES admin_crm_companies(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES admin_crm_contacts(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now()
);

-- Activity Log
CREATE TABLE IF NOT EXISTS admin_crm_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type text NOT NULL,
  title text NOT NULL,
  description text,
  company_id uuid REFERENCES admin_crm_companies(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES admin_crm_contacts(id) ON DELETE CASCADE,
  project_id uuid REFERENCES admin_crm_projects(id) ON DELETE CASCADE,
  team_member_id uuid REFERENCES team_members(id) ON DELETE SET NULL,
  created_by_admin_id text,
  activity_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_admin_crm_goals_team_member ON admin_crm_goals(team_member_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_goals_status ON admin_crm_goals(status);
CREATE INDEX IF NOT EXISTS idx_admin_crm_projects_status ON admin_crm_projects(status);
CREATE INDEX IF NOT EXISTS idx_admin_crm_project_assignments_project ON admin_crm_project_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_project_assignments_team_member ON admin_crm_project_assignments(team_member_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_companies_source ON admin_crm_companies(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_companies_status ON admin_crm_companies(status);
CREATE INDEX IF NOT EXISTS idx_admin_crm_companies_assigned_to ON admin_crm_companies(assigned_to_team_member);
CREATE INDEX IF NOT EXISTS idx_admin_crm_contacts_company ON admin_crm_contacts(admin_company_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_contacts_source ON admin_crm_contacts(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_list_members_list ON admin_crm_list_members(list_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_company ON admin_crm_activities(company_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_date ON admin_crm_activities(activity_date);

-- Enable RLS
ALTER TABLE admin_crm_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_crm_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_crm_project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_crm_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_crm_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_crm_list_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_crm_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Admin-only access)
CREATE POLICY "Admins can manage goals"
  ON admin_crm_goals FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage projects"
  ON admin_crm_projects FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage project assignments"
  ON admin_crm_project_assignments FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage companies"
  ON admin_crm_companies FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage contacts"
  ON admin_crm_contacts FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage lists"
  ON admin_crm_lists FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage list members"
  ON admin_crm_list_members FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage activities"
  ON admin_crm_activities FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Function to sync merchant to admin CRM
CREATE OR REPLACE FUNCTION sync_merchant_to_admin_crm()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO admin_crm_companies (
    source_type,
    source_id,
    company_name,
    website,
    phone,
    email,
    address_line1,
    address_line2,
    city,
    state,
    zip_code,
    company_type,
    status
  ) VALUES (
    'merchant',
    NEW.id,
    NEW.business_name,
    NEW.website_url,
    NEW.phone,
    NEW.email,
    NEW.address_line1,
    NEW.address_line2,
    NEW.city,
    NEW.state,
    NEW.postal_code,
    'merchant',
    CAST(NEW.status AS text)
  )
  ON CONFLICT (source_type, source_id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    website = EXCLUDED.website,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    address_line1 = EXCLUDED.address_line1,
    address_line2 = EXCLUDED.address_line2,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    zip_code = EXCLUDED.zip_code,
    status = EXCLUDED.status,
    updated_at = now();

  RETURN NEW;
END;
$$;

-- Function to sync partner to admin CRM
CREATE OR REPLACE FUNCTION sync_partner_to_admin_crm()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO admin_crm_companies (
    source_type,
    source_id,
    company_name,
    phone,
    email,
    company_type,
    status
  ) VALUES (
    'partner',
    NEW.id,
    COALESCE(NEW.company_name, 'Partner ' || NEW.id::text),
    NEW.phone,
    NEW.email,
    'partner',
    NEW.status
  )
  ON CONFLICT (source_type, source_id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    status = EXCLUDED.status,
    updated_at = now();

  RETURN NEW;
END;
$$;

-- Create triggers for auto-sync
DROP TRIGGER IF EXISTS trigger_sync_merchant_to_admin_crm ON merchants;
CREATE TRIGGER trigger_sync_merchant_to_admin_crm
  AFTER INSERT OR UPDATE ON merchants
  FOR EACH ROW
  EXECUTE FUNCTION sync_merchant_to_admin_crm();

DROP TRIGGER IF EXISTS trigger_sync_partner_to_admin_crm ON partners;
CREATE TRIGGER trigger_sync_partner_to_admin_crm
  AFTER INSERT OR UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION sync_partner_to_admin_crm();

-- Initial sync of existing merchants
INSERT INTO admin_crm_companies (
  source_type,
  source_id,
  company_name,
  website,
  phone,
  email,
  address_line1,
  address_line2,
  city,
  state,
  zip_code,
  company_type,
  status
)
SELECT 
  'merchant',
  id,
  business_name,
  website_url,
  phone,
  email,
  address_line1,
  address_line2,
  city,
  state,
  postal_code,
  'merchant',
  CAST(status AS text)
FROM merchants
WHERE NOT EXISTS (
  SELECT 1 FROM admin_crm_companies 
  WHERE source_type = 'merchant' AND source_id = merchants.id
);

-- Initial sync of existing partners
INSERT INTO admin_crm_companies (
  source_type,
  source_id,
  company_name,
  phone,
  email,
  company_type,
  status
)
SELECT 
  'partner',
  id,
  COALESCE(company_name, 'Partner ' || id::text),
  phone,
  email,
  'partner',
  status
FROM partners
WHERE NOT EXISTS (
  SELECT 1 FROM admin_crm_companies 
  WHERE source_type = 'partner' AND source_id = partners.id
);

-- Function to get admin CRM dashboard stats
CREATE OR REPLACE FUNCTION get_admin_crm_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
  v_total_companies integer;
  v_total_contacts integer;
  v_active_projects integer;
  v_active_goals integer;
  v_team_members integer;
  v_merchants integer;
  v_partners integer;
BEGIN
  SELECT COUNT(*) INTO v_total_companies FROM admin_crm_companies;
  SELECT COUNT(*) INTO v_total_contacts FROM admin_crm_contacts;
  SELECT COUNT(*) INTO v_active_projects FROM admin_crm_projects WHERE status IN ('planning', 'active', 'in_progress');
  SELECT COUNT(*) INTO v_active_goals FROM admin_crm_goals WHERE status = 'active';
  SELECT COUNT(*) INTO v_team_members FROM team_members WHERE is_active = true;
  SELECT COUNT(*) INTO v_merchants FROM admin_crm_companies WHERE company_type = 'merchant';
  SELECT COUNT(*) INTO v_partners FROM admin_crm_companies WHERE company_type = 'partner';

  v_result := jsonb_build_object(
    'total_companies', v_total_companies,
    'total_contacts', v_total_contacts,
    'active_projects', v_active_projects,
    'active_goals', v_active_goals,
    'team_members', v_team_members,
    'merchants', v_merchants,
    'partners', v_partners
  );

  RETURN v_result;
END;
$$;
