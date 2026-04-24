/*
  # Add missing partner_leads columns and create partner_territories table

  1. Changes to partner_leads
    - Add contact_name (text) — the human contact at the business
    - Add city (text) — business city
    - Add state (text) — business state
    - Add category (text) — business category (Restaurant, Salon, etc.)

  2. New Table: partner_territories
    - id (uuid, primary key)
    - partner_id (uuid, references partners.id)
    - city (text)
    - state (text)
    - county (text)
    - zip_code (text)
    - status (text) — active, pending, inactive, expired
    - exclusive (boolean)
    - total_merchants (int)
    - active_merchants (int)
    - monthly_revenue (numeric)
    - granted_at (timestamptz)
    - created_at (timestamptz)

  3. Security
    - RLS enabled on partner_territories
    - Partners can read their own territories
*/

-- Add missing columns to partner_leads
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_leads' AND column_name = 'contact_name') THEN
    ALTER TABLE partner_leads ADD COLUMN contact_name text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_leads' AND column_name = 'city') THEN
    ALTER TABLE partner_leads ADD COLUMN city text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_leads' AND column_name = 'state') THEN
    ALTER TABLE partner_leads ADD COLUMN state text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_leads' AND column_name = 'category') THEN
    ALTER TABLE partner_leads ADD COLUMN category text DEFAULT 'Other';
  END IF;
END $$;

-- Create partner_territories table
CREATE TABLE IF NOT EXISTS partner_territories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  city text NOT NULL,
  state text NOT NULL,
  county text,
  zip_code text,
  status text NOT NULL DEFAULT 'pending',
  exclusive boolean NOT NULL DEFAULT false,
  total_merchants integer NOT NULL DEFAULT 0,
  active_merchants integer NOT NULL DEFAULT 0,
  monthly_revenue numeric NOT NULL DEFAULT 0,
  granted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE partner_territories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own territories"
  ON partner_territories FOR SELECT
  TO authenticated
  USING (partner_id = (SELECT id FROM partners WHERE user_id = auth.uid() LIMIT 1));

CREATE POLICY "Admins can manage territories"
  ON partner_territories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_partner_territories_partner_id ON partner_territories(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_territories_status ON partner_territories(status);
