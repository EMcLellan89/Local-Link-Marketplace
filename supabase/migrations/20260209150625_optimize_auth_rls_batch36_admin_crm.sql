/*
  # Optimize Auth RLS Initialization - Batch 36 (Admin CRM)

  1. Problem
    - RLS policies call auth.uid() directly for each row
    - Should wrap in (SELECT auth.uid()) to evaluate once per query

  2. Tables Fixed
    - admin_crm_goals
    - admin_crm_companies
    - admin_crm_contacts
    - admin_crm_activities

  3. Performance Impact
    - Reduces auth overhead for CRM queries
    - Improves performance for team member queries
*/

-- Admin CRM Goals
DROP POLICY IF EXISTS "Team members can view own goals" ON admin_crm_goals;
DROP POLICY IF EXISTS "Team members can manage own goals" ON admin_crm_goals;

CREATE POLICY "Team members can view own goals"
ON admin_crm_goals FOR SELECT
TO authenticated
USING (team_member_id = (SELECT auth.uid()));

CREATE POLICY "Team members can manage own goals"
ON admin_crm_goals FOR ALL
TO authenticated
USING (team_member_id = (SELECT auth.uid()))
WITH CHECK (team_member_id = (SELECT auth.uid()));

-- Admin CRM Companies
DROP POLICY IF EXISTS "Team members can view assigned companies" ON admin_crm_companies;
DROP POLICY IF EXISTS "Team members can update assigned companies" ON admin_crm_companies;

CREATE POLICY "Team members can view assigned companies"
ON admin_crm_companies FOR SELECT
TO authenticated
USING (assigned_to_team_member = (SELECT auth.uid()));

CREATE POLICY "Team members can update assigned companies"
ON admin_crm_companies FOR UPDATE
TO authenticated
USING (assigned_to_team_member = (SELECT auth.uid()))
WITH CHECK (assigned_to_team_member = (SELECT auth.uid()));

-- Admin CRM Contacts
DROP POLICY IF EXISTS "Team members can view company contacts" ON admin_crm_contacts;
DROP POLICY IF EXISTS "Team members can manage company contacts" ON admin_crm_contacts;

CREATE POLICY "Team members can view company contacts"
ON admin_crm_contacts FOR SELECT
TO authenticated
USING (
  admin_company_id IN (
    SELECT id FROM admin_crm_companies 
    WHERE assigned_to_team_member = (SELECT auth.uid())
  )
);

CREATE POLICY "Team members can manage company contacts"
ON admin_crm_contacts FOR ALL
TO authenticated
USING (
  admin_company_id IN (
    SELECT id FROM admin_crm_companies 
    WHERE assigned_to_team_member = (SELECT auth.uid())
  )
)
WITH CHECK (
  admin_company_id IN (
    SELECT id FROM admin_crm_companies 
    WHERE assigned_to_team_member = (SELECT auth.uid())
  )
);

-- Admin CRM Activities
DROP POLICY IF EXISTS "Team members can view company activities" ON admin_crm_activities;
DROP POLICY IF EXISTS "Team members can create activities" ON admin_crm_activities;

CREATE POLICY "Team members can view company activities"
ON admin_crm_activities FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT id FROM admin_crm_companies 
    WHERE assigned_to_team_member = (SELECT auth.uid())
  )
);

CREATE POLICY "Team members can create activities"
ON admin_crm_activities FOR INSERT
TO authenticated
WITH CHECK (
  company_id IN (
    SELECT id FROM admin_crm_companies 
    WHERE assigned_to_team_member = (SELECT auth.uid())
  )
);