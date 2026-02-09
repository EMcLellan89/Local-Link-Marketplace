/*
  # Fix Auth RLS Performance - Batch 11: Admin CRM Tables

  1. Performance Optimization
    - Optimizes Auth RLS policies on admin CRM tables
    - Wraps auth.uid() in subquery to prevent re-evaluation
    - Improves query performance by evaluating auth once per query

  2. Tables Modified
    - ad_creatives (1 policy)
    - admin_crm_activities (2 policies)
    - admin_crm_companies (2 policies)
    - admin_crm_contacts (2 policies)
    - admin_crm_goals (2 policies)
    - admin_crm_list_members (1 policy)

  3. Security
    - Maintains existing access control logic
    - No changes to authorization rules
    - Only optimizes performance of existing policies
*/

-- ad_creatives policies
DROP POLICY IF EXISTS "Admins full access" ON ad_creatives;
CREATE POLICY "Admins full access"
  ON ad_creatives FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- admin_crm_activities policies
DROP POLICY IF EXISTS "Admins can manage activities" ON admin_crm_activities;
CREATE POLICY "Admins can manage activities"
  ON admin_crm_activities FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Internal team can view CRM activities" ON admin_crm_activities;
CREATE POLICY "Internal team can view CRM activities"
  ON admin_crm_activities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.id = (select auth.uid())
    )
  );

-- admin_crm_companies policies
DROP POLICY IF EXISTS "Admins can manage companies" ON admin_crm_companies;
CREATE POLICY "Admins can manage companies"
  ON admin_crm_companies FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Internal team can view companies" ON admin_crm_companies;
CREATE POLICY "Internal team can view companies"
  ON admin_crm_companies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.id = (select auth.uid())
    )
  );

-- admin_crm_contacts policies
DROP POLICY IF EXISTS "Admins can manage contacts" ON admin_crm_contacts;
CREATE POLICY "Admins can manage contacts"
  ON admin_crm_contacts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Internal team can view contacts" ON admin_crm_contacts;
CREATE POLICY "Internal team can view contacts"
  ON admin_crm_contacts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.id = (select auth.uid())
    )
  );

-- admin_crm_goals policies
DROP POLICY IF EXISTS "Admins can manage goals" ON admin_crm_goals;
CREATE POLICY "Admins can manage goals"
  ON admin_crm_goals FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Internal team can view goals" ON admin_crm_goals;
CREATE POLICY "Internal team can view goals"
  ON admin_crm_goals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.id = (select auth.uid())
    )
  );

-- admin_crm_list_members policies
DROP POLICY IF EXISTS "Admins can manage list members" ON admin_crm_list_members;
CREATE POLICY "Admins can manage list members"
  ON admin_crm_list_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );