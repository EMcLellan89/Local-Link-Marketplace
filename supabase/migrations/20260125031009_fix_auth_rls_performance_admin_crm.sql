/*
  # Optimize Auth RLS Performance - Admin CRM Tables

  1. Performance Optimization
    - Wrap auth.uid() in SELECT subquery for admin CRM tables
    - All admin CRM tables check for admin role via profiles table

  2. Security
    - Maintains existing security model (admin-only access)
    - Improves query performance by caching auth.uid() result
*/

-- admin_crm_activities
DROP POLICY IF EXISTS "Admins can manage activities" ON admin_crm_activities;
CREATE POLICY "Admins can manage activities"
  ON admin_crm_activities
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (SELECT auth.uid()) 
        AND profiles.role = 'admin'
    )
  );

-- admin_crm_companies
DROP POLICY IF EXISTS "Admins can manage companies" ON admin_crm_companies;
CREATE POLICY "Admins can manage companies"
  ON admin_crm_companies
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (SELECT auth.uid()) 
        AND profiles.role = 'admin'
    )
  );

-- admin_crm_contacts
DROP POLICY IF EXISTS "Admins can manage contacts" ON admin_crm_contacts;
CREATE POLICY "Admins can manage contacts"
  ON admin_crm_contacts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (SELECT auth.uid()) 
        AND profiles.role = 'admin'
    )
  );

-- admin_crm_goals
DROP POLICY IF EXISTS "Admins can manage goals" ON admin_crm_goals;
CREATE POLICY "Admins can manage goals"
  ON admin_crm_goals
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (SELECT auth.uid()) 
        AND profiles.role = 'admin'
    )
  );

-- admin_crm_list_members
DROP POLICY IF EXISTS "Admins can manage list members" ON admin_crm_list_members;
CREATE POLICY "Admins can manage list members"
  ON admin_crm_list_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (SELECT auth.uid()) 
        AND profiles.role = 'admin'
    )
  );

-- admin_crm_lists
DROP POLICY IF EXISTS "Admins can manage lists" ON admin_crm_lists;
CREATE POLICY "Admins can manage lists"
  ON admin_crm_lists
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (SELECT auth.uid()) 
        AND profiles.role = 'admin'
    )
  );

-- admin_crm_project_assignments
DROP POLICY IF EXISTS "Admins can manage project assignments" ON admin_crm_project_assignments;
CREATE POLICY "Admins can manage project assignments"
  ON admin_crm_project_assignments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (SELECT auth.uid()) 
        AND profiles.role = 'admin'
    )
  );

-- admin_crm_projects
DROP POLICY IF EXISTS "Admins can manage projects" ON admin_crm_projects;
CREATE POLICY "Admins can manage projects"
  ON admin_crm_projects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (SELECT auth.uid()) 
        AND profiles.role = 'admin'
    )
  );
