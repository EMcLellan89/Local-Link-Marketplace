/*
  # Team CRM System

  1. New Tables
    - team_members - Team users who use the CRM
    - crm_companies - Companies in the CRM
    - crm_contacts - Contacts linked to companies
    - crm_notes - Notes for companies/contacts
    - crm_tasks - Tasks for team members
    - crm_deals - Deals to submit/track
    
  2. Features
    - Complete company management
    - Contact management with company relationships
    - Notes system for activities
    - Task management for daily work
    - Deal pipeline tracking
    - Phone, email, address tracking
    
  3. Security
    - RLS enabled on all tables
    - Team members can only see their own data
    - Admins can see all data
*/

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL DEFAULT 'sales_rep',
  phone text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CRM Companies Table
CREATE TABLE IF NOT EXISTS crm_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_to uuid REFERENCES team_members(id) ON DELETE SET NULL,
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
  status text DEFAULT 'lead',
  revenue_potential_cents bigint,
  employee_count integer,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CRM Contacts Table
CREATE TABLE IF NOT EXISTS crm_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES crm_companies(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES team_members(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  title text,
  email text,
  phone text,
  mobile_phone text,
  is_primary boolean DEFAULT false,
  linkedin_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CRM Notes Table
CREATE TABLE IF NOT EXISTS crm_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES team_members(id) ON DELETE SET NULL,
  company_id uuid REFERENCES crm_companies(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES crm_contacts(id) ON DELETE CASCADE,
  note_type text DEFAULT 'general',
  subject text,
  content text NOT NULL,
  is_pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CRM Tasks Table
CREATE TABLE IF NOT EXISTS crm_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_to uuid REFERENCES team_members(id) ON DELETE CASCADE NOT NULL,
  created_by uuid REFERENCES team_members(id) ON DELETE SET NULL,
  company_id uuid REFERENCES crm_companies(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES crm_contacts(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  task_type text DEFAULT 'follow_up',
  priority text DEFAULT 'medium',
  status text DEFAULT 'pending',
  due_date timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CRM Deals Table
CREATE TABLE IF NOT EXISTS crm_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_to uuid REFERENCES team_members(id) ON DELETE SET NULL NOT NULL,
  company_id uuid REFERENCES crm_companies(id) ON DELETE CASCADE NOT NULL,
  contact_id uuid REFERENCES crm_contacts(id) ON DELETE SET NULL,
  deal_name text NOT NULL,
  deal_value_cents bigint NOT NULL,
  stage text DEFAULT 'prospecting',
  probability integer DEFAULT 50,
  expected_close_date date,
  actual_close_date date,
  status text DEFAULT 'open',
  products_services text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);
CREATE INDEX IF NOT EXISTS idx_crm_companies_assigned_to ON crm_companies(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_companies_status ON crm_companies(status);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_company_id ON crm_contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_assigned_to ON crm_contacts(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_notes_company_id ON crm_notes(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_notes_contact_id ON crm_notes(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_assigned_to ON crm_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_due_date ON crm_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_status ON crm_tasks(status);
CREATE INDEX IF NOT EXISTS idx_crm_deals_assigned_to ON crm_deals(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_deals_company_id ON crm_deals(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_stage ON crm_deals(stage);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_deals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team_members
CREATE POLICY "Team members can view their own profile"
  ON team_members FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Team members can update their own profile"
  ON team_members FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage team members"
  ON team_members FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for crm_companies
CREATE POLICY "Team members can view their assigned companies"
  ON crm_companies FOR SELECT
  TO authenticated
  USING (
    assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Team members can create companies"
  ON crm_companies FOR INSERT
  TO authenticated
  WITH CHECK (
    assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Team members can update their assigned companies"
  ON crm_companies FOR UPDATE
  TO authenticated
  USING (
    assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Team members can delete their assigned companies"
  ON crm_companies FOR DELETE
  TO authenticated
  USING (
    assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for crm_contacts
CREATE POLICY "Team members can view their assigned contacts"
  ON crm_contacts FOR SELECT
  TO authenticated
  USING (
    assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR company_id IN (SELECT id FROM crm_companies WHERE assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Team members can create contacts"
  ON crm_contacts FOR INSERT
  TO authenticated
  WITH CHECK (
    assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Team members can update their assigned contacts"
  ON crm_contacts FOR UPDATE
  TO authenticated
  USING (
    assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR company_id IN (SELECT id FROM crm_companies WHERE assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Team members can delete their assigned contacts"
  ON crm_contacts FOR DELETE
  TO authenticated
  USING (
    assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for crm_notes
CREATE POLICY "Team members can view notes for their companies/contacts"
  ON crm_notes FOR SELECT
  TO authenticated
  USING (
    company_id IN (SELECT id FROM crm_companies WHERE assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid()))
    OR contact_id IN (SELECT id FROM crm_contacts WHERE assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Team members can create notes"
  ON crm_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Team members can update their own notes"
  ON crm_notes FOR UPDATE
  TO authenticated
  USING (
    created_by IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Team members can delete their own notes"
  ON crm_notes FOR DELETE
  TO authenticated
  USING (
    created_by IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for crm_tasks
CREATE POLICY "Team members can view their assigned tasks"
  ON crm_tasks FOR SELECT
  TO authenticated
  USING (
    assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Team members can create tasks"
  ON crm_tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Team members can update their assigned tasks"
  ON crm_tasks FOR UPDATE
  TO authenticated
  USING (
    assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Team members can delete their assigned tasks"
  ON crm_tasks FOR DELETE
  TO authenticated
  USING (
    assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for crm_deals
CREATE POLICY "Team members can view their assigned deals"
  ON crm_deals FOR SELECT
  TO authenticated
  USING (
    assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Team members can create deals"
  ON crm_deals FOR INSERT
  TO authenticated
  WITH CHECK (
    assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Team members can update their assigned deals"
  ON crm_deals FOR UPDATE
  TO authenticated
  USING (
    assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Team members can delete their assigned deals"
  ON crm_deals FOR DELETE
  TO authenticated
  USING (
    assigned_to IN (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Helper function to get team member ID from user ID
CREATE OR REPLACE FUNCTION get_team_member_id(p_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_team_member_id uuid;
BEGIN
  SELECT id INTO v_team_member_id
  FROM team_members
  WHERE user_id = p_user_id AND is_active = true;
  
  RETURN v_team_member_id;
END;
$$;

-- Function to get team dashboard stats
CREATE OR REPLACE FUNCTION get_team_dashboard_stats(p_team_member_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
  v_tasks_today integer;
  v_tasks_overdue integer;
  v_deals_to_close integer;
  v_companies_count integer;
  v_contacts_count integer;
  v_deals_value_cents bigint;
BEGIN
  -- Tasks due today
  SELECT COUNT(*) INTO v_tasks_today
  FROM crm_tasks
  WHERE assigned_to = p_team_member_id
    AND status != 'completed'
    AND DATE(due_date) = CURRENT_DATE;

  -- Overdue tasks
  SELECT COUNT(*) INTO v_tasks_overdue
  FROM crm_tasks
  WHERE assigned_to = p_team_member_id
    AND status != 'completed'
    AND due_date < now();

  -- Deals to close this month
  SELECT COUNT(*) INTO v_deals_to_close
  FROM crm_deals
  WHERE assigned_to = p_team_member_id
    AND status = 'open'
    AND DATE_TRUNC('month', expected_close_date) = DATE_TRUNC('month', CURRENT_DATE);

  -- Companies assigned
  SELECT COUNT(*) INTO v_companies_count
  FROM crm_companies
  WHERE assigned_to = p_team_member_id;

  -- Contacts assigned
  SELECT COUNT(*) INTO v_contacts_count
  FROM crm_contacts
  WHERE assigned_to = p_team_member_id;

  -- Total deal value
  SELECT COALESCE(SUM(deal_value_cents), 0) INTO v_deals_value_cents
  FROM crm_deals
  WHERE assigned_to = p_team_member_id
    AND status = 'open';

  v_result := jsonb_build_object(
    'tasks_today', v_tasks_today,
    'tasks_overdue', v_tasks_overdue,
    'deals_to_close', v_deals_to_close,
    'companies_count', v_companies_count,
    'contacts_count', v_contacts_count,
    'deals_value_cents', v_deals_value_cents
  );

  RETURN v_result;
END;
$$;
