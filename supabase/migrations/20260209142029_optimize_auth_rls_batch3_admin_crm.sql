/*
  # Optimize Auth RLS Performance - Batch 3: Admin CRM

  1. Changes
    - Wrap auth.uid() in (SELECT auth.uid()) for Admin CRM tables
    - Affects: admin_crm_goals, admin_crm_companies, admin_crm_contacts, admin_crm_activities
  
  2. Performance Impact
    - Reduces auth function calls from N (rows) to 1 per query
    - Improves admin CRM query performance
*/

-- Admin CRM Goals
DO $$
BEGIN
  DROP POLICY IF EXISTS "Team members view own goals" ON admin_crm_goals;
  DROP POLICY IF EXISTS "Team members manage own goals" ON admin_crm_goals;
  
  CREATE POLICY "Team members view own goals"
    ON admin_crm_goals FOR SELECT
    TO authenticated
    USING (
      team_member_id IN (
        SELECT id FROM team_members WHERE user_id = (SELECT auth.uid())
      )
    );
  
  CREATE POLICY "Team members manage own goals"
    ON admin_crm_goals FOR ALL
    TO authenticated
    USING (
      team_member_id IN (
        SELECT id FROM team_members WHERE user_id = (SELECT auth.uid())
      )
    )
    WITH CHECK (
      team_member_id IN (
        SELECT id FROM team_members WHERE user_id = (SELECT auth.uid())
      )
    );
END $$;

-- Admin CRM Companies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Team members manage assigned companies" ON admin_crm_companies;
  
  CREATE POLICY "Team members manage assigned companies"
    ON admin_crm_companies FOR ALL
    TO authenticated
    USING (
      assigned_to_team_member IN (
        SELECT id FROM team_members WHERE user_id = (SELECT auth.uid())
      )
    )
    WITH CHECK (
      assigned_to_team_member IN (
        SELECT id FROM team_members WHERE user_id = (SELECT auth.uid())
      )
    );
END $$;

-- Admin CRM Contacts
DO $$
BEGIN
  DROP POLICY IF EXISTS "Team members manage assigned contacts" ON admin_crm_contacts;
  
  CREATE POLICY "Team members manage assigned contacts"
    ON admin_crm_contacts FOR ALL
    TO authenticated
    USING (
      assigned_to_team_member IN (
        SELECT id FROM team_members WHERE user_id = (SELECT auth.uid())
      )
    )
    WITH CHECK (
      assigned_to_team_member IN (
        SELECT id FROM team_members WHERE user_id = (SELECT auth.uid())
      )
    );
END $$;

-- Admin CRM Activities
DO $$
BEGIN
  DROP POLICY IF EXISTS "Team members manage own activities" ON admin_crm_activities;
  
  CREATE POLICY "Team members manage own activities"
    ON admin_crm_activities FOR ALL
    TO authenticated
    USING (
      team_member_id IN (
        SELECT id FROM team_members WHERE user_id = (SELECT auth.uid())
      )
    )
    WITH CHECK (
      team_member_id IN (
        SELECT id FROM team_members WHERE user_id = (SELECT auth.uid())
      )
    );
END $$;
