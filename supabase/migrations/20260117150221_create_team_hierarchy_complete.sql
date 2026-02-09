/*
  # Team Hierarchy System Complete
  
  Creates hierarchical team management with Manager and Team Member roles
  
  1. New Tables
    - team_projects (admin creates projects for teams)
    - project_assignments (managers assign tasks to team members)
    - team_monthly_goals (managers set monthly goals for team members)
  
  2. Modifications
    - Adds manager_id to team_members
  
  3. Security
    - Full RLS implementation
    - Managers can view/manage their team
    - Team members can only view their own data
    - Admins have full access
*/

-- Add manager_id to team_members
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS manager_id uuid;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS department text;

CREATE INDEX IF NOT EXISTS idx_team_members_manager_id ON team_members(manager_id);

-- Team Projects (created by admin, assigned to managers)
CREATE TABLE IF NOT EXISTS team_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name text NOT NULL,
  description text,
  manager_id uuid NOT NULL,
  created_by_admin uuid,
  status text DEFAULT 'active' CHECK (status IN ('active', 'on_hold', 'completed', 'cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  start_date date,
  due_date date,
  budget_cents bigint DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_projects_manager_id ON team_projects(manager_id);
CREATE INDEX IF NOT EXISTS idx_team_projects_status ON team_projects(status);
CREATE INDEX IF NOT EXISTS idx_team_projects_created_by ON team_projects(created_by_admin);

ALTER TABLE team_projects ENABLE ROW LEVEL SECURITY;

-- Project Assignments (managers assign to team members)
CREATE TABLE IF NOT EXISTS project_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES team_projects(id) ON DELETE CASCADE,
  assigned_to uuid NOT NULL,
  assigned_by uuid,
  task_title text NOT NULL,
  task_description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'completed', 'blocked')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  estimated_hours numeric(10,2),
  actual_hours numeric(10,2),
  due_date timestamptz,
  completed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_assignments_project_id ON project_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_assignments_assigned_to ON project_assignments(assigned_to);
CREATE INDEX IF NOT EXISTS idx_project_assignments_status ON project_assignments(status);
CREATE INDEX IF NOT EXISTS idx_project_assignments_due_date ON project_assignments(due_date);

ALTER TABLE project_assignments ENABLE ROW LEVEL SECURITY;

-- Team Monthly Goals (managers set goals for team members)
CREATE TABLE IF NOT EXISTS team_monthly_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id uuid NOT NULL,
  manager_id uuid NOT NULL,
  goal_period text NOT NULL,
  goal_title text NOT NULL,
  goal_description text,
  target_metric text,
  target_value numeric(10,2),
  current_value numeric(10,2) DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'achieved', 'missed', 'cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category text,
  notes text,
  due_date date,
  achieved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_monthly_goals_team_member ON team_monthly_goals(team_member_id);
CREATE INDEX IF NOT EXISTS idx_team_monthly_goals_manager ON team_monthly_goals(manager_id);
CREATE INDEX IF NOT EXISTS idx_team_monthly_goals_period ON team_monthly_goals(goal_period);
CREATE INDEX IF NOT EXISTS idx_team_monthly_goals_status ON team_monthly_goals(status);

ALTER TABLE team_monthly_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team_projects

CREATE POLICY "Admins manage all projects"
  ON team_projects FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members
      WHERE internal_team_members.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND internal_team_members.role = 'admin'
    )
  );

CREATE POLICY "Managers view own team projects"
  ON team_projects FOR SELECT
  TO authenticated
  USING (
    manager_id = (SELECT id FROM team_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Team members view projects with assignments"
  ON team_projects FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT project_id FROM project_assignments
      WHERE assigned_to = (SELECT id FROM team_members WHERE user_id = auth.uid())
    )
  );

-- RLS Policies for project_assignments

CREATE POLICY "Admins manage all assignments"
  ON project_assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members
      WHERE internal_team_members.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND internal_team_members.role = 'admin'
    )
  );

CREATE POLICY "Managers manage team assignments"
  ON project_assignments FOR ALL
  TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM team_members
      WHERE manager_id = (SELECT id FROM team_members WHERE user_id = auth.uid())
    )
    OR assigned_by = (SELECT id FROM team_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Team members view own assignments"
  ON project_assignments FOR SELECT
  TO authenticated
  USING (
    assigned_to = (SELECT id FROM team_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Team members update own assignment status"
  ON project_assignments FOR UPDATE
  TO authenticated
  USING (
    assigned_to = (SELECT id FROM team_members WHERE user_id = auth.uid())
  )
  WITH CHECK (
    assigned_to = (SELECT id FROM team_members WHERE user_id = auth.uid())
  );

-- RLS Policies for team_monthly_goals

CREATE POLICY "Admins manage all monthly goals"
  ON team_monthly_goals FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members
      WHERE internal_team_members.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND internal_team_members.role = 'admin'
    )
  );

CREATE POLICY "Managers manage team monthly goals"
  ON team_monthly_goals FOR ALL
  TO authenticated
  USING (
    manager_id = (SELECT id FROM team_members WHERE user_id = auth.uid())
    OR team_member_id IN (
      SELECT id FROM team_members
      WHERE manager_id = (SELECT id FROM team_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Team members view own monthly goals"
  ON team_monthly_goals FOR SELECT
  TO authenticated
  USING (
    team_member_id = (SELECT id FROM team_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Team members update monthly goal progress"
  ON team_monthly_goals FOR UPDATE
  TO authenticated
  USING (
    team_member_id = (SELECT id FROM team_members WHERE user_id = auth.uid())
  )
  WITH CHECK (
    team_member_id = (SELECT id FROM team_members WHERE user_id = auth.uid())
  );

-- Helper functions

CREATE OR REPLACE FUNCTION get_manager_team_stats(p_manager_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'team_size', COUNT(DISTINCT tm.id),
    'active_projects', COUNT(DISTINCT CASE WHEN tp.status = 'active' THEN tp.id END),
    'total_tasks', COUNT(DISTINCT pa.id),
    'completed_tasks', COUNT(DISTINCT CASE WHEN pa.status = 'completed' THEN pa.id END),
    'pending_tasks', COUNT(DISTINCT CASE WHEN pa.status = 'pending' THEN pa.id END),
    'in_progress_tasks', COUNT(DISTINCT CASE WHEN pa.status = 'in_progress' THEN pa.id END),
    'active_goals', COUNT(DISTINCT CASE WHEN tmg.status = 'active' THEN tmg.id END),
    'achieved_goals', COUNT(DISTINCT CASE WHEN tmg.status = 'achieved' THEN tmg.id END)
  )
  INTO result
  FROM team_members tm
  LEFT JOIN team_projects tp ON tp.manager_id = p_manager_id
  LEFT JOIN project_assignments pa ON pa.assigned_to = tm.id
  LEFT JOIN team_monthly_goals tmg ON tmg.team_member_id = tm.id
  WHERE tm.manager_id = p_manager_id;

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION get_team_member_stats(p_team_member_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'my_tasks', COUNT(DISTINCT CASE WHEN pa.status NOT IN ('completed', 'cancelled') THEN pa.id END),
    'completed_tasks', COUNT(DISTINCT CASE WHEN pa.status = 'completed' THEN pa.id END),
    'overdue_tasks', COUNT(DISTINCT CASE WHEN pa.status NOT IN ('completed', 'cancelled') AND pa.due_date < now() THEN pa.id END),
    'active_goals', COUNT(DISTINCT CASE WHEN tmg.status = 'active' THEN tmg.id END),
    'achieved_goals', COUNT(DISTINCT CASE WHEN tmg.status = 'achieved' THEN tmg.id END),
    'total_hours_logged', COALESCE(SUM(pa.actual_hours), 0),
    'total_hours_estimated', COALESCE(SUM(pa.estimated_hours), 0)
  )
  INTO result
  FROM project_assignments pa
  FULL OUTER JOIN team_monthly_goals tmg ON tmg.team_member_id = p_team_member_id
  WHERE pa.assigned_to = p_team_member_id OR tmg.team_member_id = p_team_member_id;

  RETURN result;
END;
$$;
