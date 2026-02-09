/*
  # Fix Auth RLS Performance - Team Projects & Assignments
  
  1. Performance
    - Replace direct auth.uid() calls with (select auth.uid()) in RLS policies
  
  2. Tables Updated
    - team_projects
    - project_assignments
    - team_monthly_goals
*/

-- team_projects
DROP POLICY IF EXISTS "Admins manage all projects" ON team_projects;
DROP POLICY IF EXISTS "Managers view own team projects" ON team_projects;
DROP POLICY IF EXISTS "Team members view projects with assignments" ON team_projects;

CREATE POLICY "Admins manage all projects" ON team_projects
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Managers view own team projects" ON team_projects
  FOR SELECT TO authenticated
  USING (
    manager_id IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members view projects with assignments" ON team_projects
  FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT project_id FROM project_assignments
      WHERE assigned_to IN (
        SELECT id FROM team_members 
        WHERE user_id = (SELECT auth.uid())
      )
    )
  );

-- project_assignments
DROP POLICY IF EXISTS "Admins manage all assignments" ON project_assignments;
DROP POLICY IF EXISTS "Managers manage team assignments" ON project_assignments;
DROP POLICY IF EXISTS "Team members update own assignment status" ON project_assignments;
DROP POLICY IF EXISTS "Team members view own assignments" ON project_assignments;

CREATE POLICY "Admins manage all assignments" ON project_assignments
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Managers manage team assignments" ON project_assignments
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_projects tp
      JOIN team_members tm ON tp.manager_id = tm.id
      WHERE tp.id = project_assignments.project_id
      AND tm.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_projects tp
      JOIN team_members tm ON tp.manager_id = tm.id
      WHERE tp.id = project_assignments.project_id
      AND tm.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members update own assignment status" ON project_assignments
  FOR UPDATE TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    assigned_to IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members view own assignments" ON project_assignments
  FOR SELECT TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- team_monthly_goals
DROP POLICY IF EXISTS "Admins manage all monthly goals" ON team_monthly_goals;
DROP POLICY IF EXISTS "Managers manage team monthly goals" ON team_monthly_goals;
DROP POLICY IF EXISTS "Team members update monthly goal progress" ON team_monthly_goals;
DROP POLICY IF EXISTS "Team members view own monthly goals" ON team_monthly_goals;

CREATE POLICY "Admins manage all monthly goals" ON team_monthly_goals
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Managers manage team monthly goals" ON team_monthly_goals
  FOR ALL TO authenticated
  USING (
    manager_id IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    manager_id IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members update monthly goal progress" ON team_monthly_goals
  FOR UPDATE TO authenticated
  USING (
    team_member_id IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    team_member_id IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members view own monthly goals" ON team_monthly_goals
  FOR SELECT TO authenticated
  USING (
    team_member_id IN (
      SELECT id FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );
