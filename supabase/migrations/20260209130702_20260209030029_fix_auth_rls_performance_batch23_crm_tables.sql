/*
  # Optimize Auth RLS Performance - Batch 23: CRM Tables
  
  1. Tables Optimized
    - crm_tasks (7 policies → 3, consolidated merchant CRUD)
    - crm_activities (7 policies → 2, consolidated merchant policies)
    - crm_leads (6 policies → 2, consolidated merchant CRUD)
    - crm_companies (4 policies → 1, consolidated team CRUD)
    - crm_deals (4 policies → 1, consolidated team CRUD)
  
  2. Changes
    - Wrap all auth.uid() calls in (select auth.uid()) for performance
    - Consolidate multiple CRUD policies into single ALL policies
    - Maintain exact same access control logic
*/

-- crm_tasks (consolidate 7 policies → 3)
DROP POLICY IF EXISTS "Admin full access to CRM tasks" ON crm_tasks;
DROP POLICY IF EXISTS "Assigned users can view tasks" ON crm_tasks;
DROP POLICY IF EXISTS "Merchants can delete own tasks" ON crm_tasks;
DROP POLICY IF EXISTS "Merchants can insert own tasks" ON crm_tasks;
DROP POLICY IF EXISTS "Merchants can manage own tasks" ON crm_tasks;
DROP POLICY IF EXISTS "Merchants can update own tasks" ON crm_tasks;
DROP POLICY IF EXISTS "Merchants can view own tasks" ON crm_tasks;

CREATE POLICY "Admin full access to CRM tasks"
  ON crm_tasks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Merchants can manage own tasks"
  ON crm_tasks FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Assigned users can view tasks"
  ON crm_tasks FOR SELECT
  TO authenticated
  USING (assigned_to = (select auth.uid()));

-- crm_activities (consolidate 7 policies → 2)
DROP POLICY IF EXISTS "Admin full access to CRM activities" ON crm_activities;
DROP POLICY IF EXISTS "Merchants can delete own activities" ON crm_activities;
DROP POLICY IF EXISTS "Merchants can insert own activities" ON crm_activities;
DROP POLICY IF EXISTS "Merchants can manage own CRM activities" ON crm_activities;
DROP POLICY IF EXISTS "Merchants can update own activities" ON crm_activities;
DROP POLICY IF EXISTS "Merchants can view own CRM activities" ON crm_activities;
DROP POLICY IF EXISTS "Merchants can view own activities" ON crm_activities;

CREATE POLICY "Admin full access to CRM activities"
  ON crm_activities FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Merchants can manage own CRM activities"
  ON crm_activities FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- crm_leads (consolidate 6 policies → 2)
DROP POLICY IF EXISTS "Admin full access to CRM leads" ON crm_leads;
DROP POLICY IF EXISTS "Merchants can delete own leads" ON crm_leads;
DROP POLICY IF EXISTS "Merchants can insert own leads" ON crm_leads;
DROP POLICY IF EXISTS "Merchants can manage own leads" ON crm_leads;
DROP POLICY IF EXISTS "Merchants can update own leads" ON crm_leads;
DROP POLICY IF EXISTS "Merchants can view own leads" ON crm_leads;

CREATE POLICY "Admin full access to CRM leads"
  ON crm_leads FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Merchants can manage own leads"
  ON crm_leads FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- crm_companies (consolidate 4 policies → 1)
DROP POLICY IF EXISTS "Team members can create companies" ON crm_companies;
DROP POLICY IF EXISTS "Team members can delete their assigned companies" ON crm_companies;
DROP POLICY IF EXISTS "Team members can update their assigned companies" ON crm_companies;
DROP POLICY IF EXISTS "Team members can view their assigned companies" ON crm_companies;

CREATE POLICY "Team members can manage their assigned companies"
  ON crm_companies FOR ALL
  TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM team_members
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    assigned_to IN (
      SELECT id FROM team_members
      WHERE user_id = (select auth.uid())
    )
  );

-- crm_deals (consolidate 4 policies → 1)
DROP POLICY IF EXISTS "Team members can create deals" ON crm_deals;
DROP POLICY IF EXISTS "Team members can delete their assigned deals" ON crm_deals;
DROP POLICY IF EXISTS "Team members can update their assigned deals" ON crm_deals;
DROP POLICY IF EXISTS "Team members can view their assigned deals" ON crm_deals;

CREATE POLICY "Team members can manage their assigned deals"
  ON crm_deals FOR ALL
  TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM team_members
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    assigned_to IN (
      SELECT id FROM team_members
      WHERE user_id = (select auth.uid())
    )
  );
