/*
  # Fix Auth RLS Performance - VAPI, Team, CRM Tables
  
  1. Performance
    - Replace direct auth.uid() calls with (select auth.uid()) in RLS policies
  
  2. Tables Updated
    - vapi_assistants
    - vapi_configurations
    - vapi_tools
    - vapi_call_logs
    - team_members
    - crm_companies, crm_contacts, crm_notes, crm_tasks, crm_deals
    - platform_vapi_config
*/

-- vapi_assistants
DROP POLICY IF EXISTS "Merchants can manage own vapi assistants" ON vapi_assistants;
DROP POLICY IF EXISTS "Merchants can view own vapi assistants" ON vapi_assistants;

CREATE POLICY "Merchants can view own vapi assistants" ON vapi_assistants
  FOR SELECT TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Merchants can manage own vapi assistants" ON vapi_assistants
  FOR ALL TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- vapi_configurations
DROP POLICY IF EXISTS "Merchants can insert own vapi configuration" ON vapi_configurations;
DROP POLICY IF EXISTS "Merchants can update own vapi configuration" ON vapi_configurations;
DROP POLICY IF EXISTS "Merchants can view own vapi configuration" ON vapi_configurations;

CREATE POLICY "Merchants can view own vapi configuration" ON vapi_configurations
  FOR SELECT TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Merchants can insert own vapi configuration" ON vapi_configurations
  FOR INSERT TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Merchants can update own vapi configuration" ON vapi_configurations
  FOR UPDATE TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- vapi_tools
DROP POLICY IF EXISTS "Merchants can manage tools for their assistants" ON vapi_tools;
DROP POLICY IF EXISTS "Merchants can view tools for their assistants" ON vapi_tools;

CREATE POLICY "Merchants can view tools for their assistants" ON vapi_tools
  FOR SELECT TO authenticated
  USING (
    assistant_id IN (
      SELECT id FROM vapi_assistants 
      WHERE merchant_id IN (
        SELECT id FROM merchants 
        WHERE user_id = (SELECT auth.uid())
      )
    )
  );

CREATE POLICY "Merchants can manage tools for their assistants" ON vapi_tools
  FOR ALL TO authenticated
  USING (
    assistant_id IN (
      SELECT id FROM vapi_assistants 
      WHERE merchant_id IN (
        SELECT id FROM merchants 
        WHERE user_id = (SELECT auth.uid())
      )
    )
  );

-- vapi_call_logs
DROP POLICY IF EXISTS "Merchants can insert own vapi call logs" ON vapi_call_logs;
DROP POLICY IF EXISTS "Merchants can view own vapi call logs" ON vapi_call_logs;

CREATE POLICY "Merchants can view own vapi call logs" ON vapi_call_logs
  FOR SELECT TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Merchants can insert own vapi call logs" ON vapi_call_logs
  FOR INSERT TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- team_members
DROP POLICY IF EXISTS "Admins can manage team members" ON team_members;
DROP POLICY IF EXISTS "Team members can update their own profile" ON team_members;
DROP POLICY IF EXISTS "Team members can view their own profile" ON team_members;

CREATE POLICY "Admins can manage team members" ON team_members
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Team members can view their own profile" ON team_members
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Team members can update their own profile" ON team_members
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- crm_companies
DROP POLICY IF EXISTS "Team members can create companies" ON crm_companies;
DROP POLICY IF EXISTS "Team members can delete their assigned companies" ON crm_companies;
DROP POLICY IF EXISTS "Team members can update their assigned companies" ON crm_companies;
DROP POLICY IF EXISTS "Team members can view their assigned companies" ON crm_companies;

CREATE POLICY "Team members can view their assigned companies" ON crm_companies
  FOR SELECT TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members can create companies" ON crm_companies
  FOR INSERT TO authenticated
  WITH CHECK (
    assigned_to IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members can update their assigned companies" ON crm_companies
  FOR UPDATE TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members can delete their assigned companies" ON crm_companies
  FOR DELETE TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- crm_contacts
DROP POLICY IF EXISTS "Team members can create contacts" ON crm_contacts;
DROP POLICY IF EXISTS "Team members can delete their assigned contacts" ON crm_contacts;
DROP POLICY IF EXISTS "Team members can update their assigned contacts" ON crm_contacts;
DROP POLICY IF EXISTS "Team members can view their assigned contacts" ON crm_contacts;

CREATE POLICY "Team members can view their assigned contacts" ON crm_contacts
  FOR SELECT TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members can create contacts" ON crm_contacts
  FOR INSERT TO authenticated
  WITH CHECK (
    assigned_to IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members can update their assigned contacts" ON crm_contacts
  FOR UPDATE TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members can delete their assigned contacts" ON crm_contacts
  FOR DELETE TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- crm_notes
DROP POLICY IF EXISTS "Team members can create notes" ON crm_notes;
DROP POLICY IF EXISTS "Team members can delete their own notes" ON crm_notes;
DROP POLICY IF EXISTS "Team members can update their own notes" ON crm_notes;
DROP POLICY IF EXISTS "Team members can view notes for their companies/contacts" ON crm_notes;

CREATE POLICY "Team members can view notes for their companies/contacts" ON crm_notes
  FOR SELECT TO authenticated
  USING (
    company_id IN (
      SELECT id FROM crm_companies 
      WHERE assigned_to IN (
        SELECT id FROM team_members 
        WHERE user_id = (SELECT auth.uid())
      )
    )
    OR contact_id IN (
      SELECT id FROM crm_contacts 
      WHERE assigned_to IN (
        SELECT id FROM team_members 
        WHERE user_id = (SELECT auth.uid())
      )
    )
  );

CREATE POLICY "Team members can create notes" ON crm_notes
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members can update their own notes" ON crm_notes
  FOR UPDATE TO authenticated
  USING (
    created_by IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members can delete their own notes" ON crm_notes
  FOR DELETE TO authenticated
  USING (
    created_by IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- crm_tasks  
DROP POLICY IF EXISTS "Team members can create tasks" ON crm_tasks;
DROP POLICY IF EXISTS "Team members can delete their assigned tasks" ON crm_tasks;
DROP POLICY IF EXISTS "Team members can update their assigned tasks" ON crm_tasks;
DROP POLICY IF EXISTS "Team members can view their assigned tasks" ON crm_tasks;

CREATE POLICY "Team members can view their assigned tasks" ON crm_tasks
  FOR SELECT TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members can create tasks" ON crm_tasks
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members can update their assigned tasks" ON crm_tasks
  FOR UPDATE TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members can delete their assigned tasks" ON crm_tasks
  FOR DELETE TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- crm_deals
DROP POLICY IF EXISTS "Team members can create deals" ON crm_deals;
DROP POLICY IF EXISTS "Team members can delete their assigned deals" ON crm_deals;
DROP POLICY IF EXISTS "Team members can update their assigned deals" ON crm_deals;
DROP POLICY IF EXISTS "Team members can view their assigned deals" ON crm_deals;

CREATE POLICY "Team members can view their assigned deals" ON crm_deals
  FOR SELECT TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members can create deals" ON crm_deals
  FOR INSERT TO authenticated
  WITH CHECK (
    assigned_to IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members can update their assigned deals" ON crm_deals
  FOR UPDATE TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members can delete their assigned deals" ON crm_deals
  FOR DELETE TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- platform_vapi_config
DROP POLICY IF EXISTS "Only admins can manage platform vapi config" ON platform_vapi_config;
DROP POLICY IF EXISTS "Only admins can view platform vapi config" ON platform_vapi_config;

CREATE POLICY "Only admins can view platform vapi config" ON platform_vapi_config
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can manage platform vapi config" ON platform_vapi_config
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );
