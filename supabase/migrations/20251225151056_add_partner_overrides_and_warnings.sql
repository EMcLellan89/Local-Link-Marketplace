/*
  # Partner Overrides and Warning System

  1. New Tables
    - `partner_overrides`
      - Stores admin-configured overrides for partners (bypass score, raise caps)
    - `partner_warning_logs`
      - Stores warning events for partners (compliance/performance issues)

  2. Changes
    - No schema changes to existing tables needed (certification status already flexible)

  3. Security
    - Enable RLS on all new tables
    - Admin-only access for overrides
    - Partner can read their own warning logs
*/

CREATE TABLE IF NOT EXISTS partner_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE UNIQUE,
  allow_expansion_despite_score boolean DEFAULT false,
  max_active_territories_override integer,
  max_open_requests_override integer,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS partner_warning_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  code text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partner_warning_logs_partner_id ON partner_warning_logs(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_warning_logs_code ON partner_warning_logs(code);
CREATE INDEX IF NOT EXISTS idx_partner_warning_logs_created_at ON partner_warning_logs(created_at DESC);

ALTER TABLE partner_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_warning_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage partner overrides"
  ON partner_overrides
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Partners can view own warning logs"
  ON partner_warning_logs
  FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT partner_id FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.partner_id IS NOT NULL
    )
  );

CREATE POLICY "Admins can manage warning logs"
  ON partner_warning_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
