/*
  # Team Management System - Part 1: Team Members

  1. Tables
    - `merchant_team_members` - Employees working under merchant owners
    - `partner_team_members` - Employees working under partner owners

  2. Security
    - Enable RLS
    - Owners can manage their team
    - Team members can view their own record
*/

-- Merchant Team Members
CREATE TABLE IF NOT EXISTS merchant_team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL DEFAULT 'employee',
  permissions jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_merchant_team_members_merchant_id ON merchant_team_members(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_team_members_user_id ON merchant_team_members(user_id);

-- Partner Team Members
CREATE TABLE IF NOT EXISTS partner_team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL DEFAULT 'employee',
  permissions jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partner_team_members_partner_id ON partner_team_members(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_team_members_user_id ON partner_team_members(user_id);

-- Enable RLS
ALTER TABLE merchant_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Merchant Team Members
CREATE POLICY "Merchant owners can manage their team"
  ON merchant_team_members FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can view their own record"
  ON merchant_team_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for Partner Team Members
CREATE POLICY "Partner owners can manage their team"
  ON partner_team_members FOR ALL
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can view their own partner record"
  ON partner_team_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());