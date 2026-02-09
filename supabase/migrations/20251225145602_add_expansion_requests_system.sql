/*
  # Partner Expansion Requests System

  ## Overview
  Allows partners to request new territories. Admin reviews and approves/declines.
  Approval automatically assigns territory (creates if needed) with certification gating.

  ## New Tables

  1. **expansion_requests** - Partner territory expansion requests
     - Partner ID, requested territory name, country code
     - Status workflow (Requested/UnderReview/Approved/Declined)
     - Admin notes for review outcomes

  ## Security
  - RLS enabled
  - Partners can create and view own requests
  - Admins can view and manage all requests
*/

-- Expansion Status
DO $$ BEGIN
  CREATE TYPE expansion_status AS ENUM ('Requested', 'UnderReview', 'Approved', 'Declined');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Expansion Requests Table
CREATE TABLE IF NOT EXISTS expansion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  requested_name text NOT NULL,
  country_code text NOT NULL,
  notes text,
  status expansion_status NOT NULL DEFAULT 'Requested',
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add lastActivityAt to territories for tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'territories' AND column_name = 'last_activity_at'
  ) THEN
    ALTER TABLE territories ADD COLUMN last_activity_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_expansion_requests_partner ON expansion_requests(partner_id);
CREATE INDEX IF NOT EXISTS idx_expansion_requests_status ON expansion_requests(status);
CREATE INDEX IF NOT EXISTS idx_expansion_requests_created ON expansion_requests(created_at DESC);

-- Enable RLS
ALTER TABLE expansion_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Partners can view own requests
CREATE POLICY "Partners can view own expansion requests"
  ON expansion_requests FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT partner_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Partners can create own requests
CREATE POLICY "Partners can create expansion requests"
  ON expansion_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    partner_id IN (
      SELECT partner_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Admins can manage all requests
CREATE POLICY "Admins can manage expansion requests"
  ON expansion_requests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_expansion_requests_updated_at BEFORE UPDATE ON expansion_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
