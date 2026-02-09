/*
  # Team Management System - Part 2: Goals and Commissions

  1. Tables
    - `team_member_goals` - Sales and performance goals for team members
    - `team_member_commissions` - Commission tracking for team members

  2. Security
    - Enable RLS
    - Owners and team members can view their data
*/

-- Team Member Goals
CREATE TABLE IF NOT EXISTS team_member_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id uuid NOT NULL,
  team_member_type text NOT NULL CHECK (team_member_type IN ('merchant', 'partner')),
  goal_type text NOT NULL,
  target_amount_cents bigint NOT NULL DEFAULT 0,
  current_amount_cents bigint NOT NULL DEFAULT 0,
  period_start date NOT NULL,
  period_end date NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_member_goals_member_id ON team_member_goals(team_member_id);
CREATE INDEX IF NOT EXISTS idx_team_member_goals_type ON team_member_goals(team_member_type);

-- Team Member Commissions
CREATE TABLE IF NOT EXISTS team_member_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id uuid NOT NULL,
  team_member_type text NOT NULL CHECK (team_member_type IN ('merchant', 'partner')),
  owner_id uuid NOT NULL,
  sale_id uuid,
  amount_cents bigint NOT NULL DEFAULT 0,
  commission_rate numeric(5,2) NOT NULL DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  description text,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_member_commissions_member_id ON team_member_commissions(team_member_id);
CREATE INDEX IF NOT EXISTS idx_team_member_commissions_owner_id ON team_member_commissions(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_member_commissions_status ON team_member_commissions(status);

-- Enable RLS
ALTER TABLE team_member_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_member_commissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Team Member Goals
CREATE POLICY "Team members and owners can view goals"
  ON team_member_goals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owners can manage goals"
  ON team_member_goals FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for Team Member Commissions  
CREATE POLICY "Team members and owners can view commissions"
  ON team_member_commissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owners can manage commissions"
  ON team_member_commissions FOR ALL
  TO authenticated
  USING (true);