/*
  # Add Partner Tax Payments Table

  1. New Tables
    - `partner_tax_payments` - Quarterly tax payment tracking with autopay

  2. Updates
    - Add accounting_tier to partner_crm_subscriptions (lite/pro)

  3. Security
    - Enable RLS
    - Partners can only access their own data
*/

-- Partner Tax Payments
CREATE TABLE IF NOT EXISTS partner_tax_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,

  -- Payment Period
  tax_year integer NOT NULL,
  quarter integer NOT NULL CHECK (quarter BETWEEN 1 AND 4),

  -- Amounts
  estimated_amount_cents bigint NOT NULL,
  actual_amount_cents bigint,

  -- Dates
  due_date date NOT NULL,
  scheduled_payment_date date,
  actual_payment_date date,

  -- Status
  status text DEFAULT 'pending' CHECK (status IN (
    'pending',        -- Not yet processed
    'scheduled',      -- Autopay scheduled
    'processing',     -- Payment in progress
    'paid',           -- Successfully paid
    'failed',         -- Payment failed
    'cancelled',      -- Cancelled by partner
    'manual'          -- Paid manually outside system
  )),

  -- Payment Method
  payment_method text CHECK (payment_method IN ('autopay', 'manual', 'external')),
  bank_account_id uuid REFERENCES partner_bank_accounts(id) ON DELETE SET NULL,

  -- Transaction Reference
  payment_transaction_id text, -- External payment ID
  failure_reason text,

  notes text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add accounting tier to partner_crm_subscriptions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partner_crm_subscriptions' 
    AND column_name = 'accounting_tier'
  ) THEN
    ALTER TABLE partner_crm_subscriptions 
    ADD COLUMN accounting_tier text DEFAULT 'lite' CHECK (accounting_tier IN ('none', 'lite', 'pro'));
    
    COMMENT ON COLUMN partner_crm_subscriptions.accounting_tier IS 'Tier 1: Lite, Tier 2+: Pro';
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_partner_tax_payments_partner ON partner_tax_payments(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_tax_payments_year_quarter ON partner_tax_payments(tax_year, quarter);
CREATE INDEX IF NOT EXISTS idx_partner_tax_payments_status ON partner_tax_payments(status);
CREATE INDEX IF NOT EXISTS idx_partner_tax_payments_due_date ON partner_tax_payments(due_date);

-- Enable RLS
ALTER TABLE partner_tax_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Tax Payments
CREATE POLICY "Partners can view own tax payments"
  ON partner_tax_payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = partner_tax_payments.partner_id
      AND partners.user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can insert own tax payments"
  ON partner_tax_payments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = partner_tax_payments.partner_id
      AND partners.user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can update own tax payments"
  ON partner_tax_payments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = partner_tax_payments.partner_id
      AND partners.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = partner_tax_payments.partner_id
      AND partners.user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can delete own tax payments"
  ON partner_tax_payments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = partner_tax_payments.partner_id
      AND partners.user_id = auth.uid()
    )
  );
