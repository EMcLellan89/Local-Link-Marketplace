-- Add Loyalty Contract Uploads System
--
-- 1. New Tables
--   - loyalty_contract_uploads table for storing uploaded contracts
--
-- 2. Security
--   - Enable RLS
--   - Merchants can view/upload their own contracts
--   - Admins can view/manage all contracts

CREATE TABLE IF NOT EXISTS loyalty_contract_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan_name text NOT NULL,
  plan_price integer NOT NULL,
  contract_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  business_name text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE loyalty_contract_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own contract uploads"
  ON loyalty_contract_uploads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can insert own contract uploads"
  ON loyalty_contract_uploads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Merchants can update own contract uploads"
  ON loyalty_contract_uploads
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = merchant_id)
  WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Admins can view all contract uploads"
  ON loyalty_contract_uploads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all contract uploads"
  ON loyalty_contract_uploads
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_loyalty_contract_uploads_merchant_id ON loyalty_contract_uploads(merchant_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_contract_uploads_status ON loyalty_contract_uploads(status);