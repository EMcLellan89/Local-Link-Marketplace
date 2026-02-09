/*
  # Add Communications Prepay and Business Verification System

  1. New Fields to twilio_configurations
    - Business verification profile fields (legal name, tax ID, address, etc.)
    - SMS use case information
    - Opt-in and compliance URLs
    - Prepaid balance tracking
    - Verification status

  2. New Table: communications_transactions
    - Track all prepayments and usage charges
    - Balance tracking
    - Transaction history

  3. Security
    - Enable RLS on communications_transactions
    - Add policies for merchant access
*/

-- Add business verification and prepay fields to twilio_configurations
DO $$
BEGIN
  -- Business Information
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'legal_business_name') THEN
    ALTER TABLE twilio_configurations ADD COLUMN legal_business_name text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'dba_name') THEN
    ALTER TABLE twilio_configurations ADD COLUMN dba_name text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'tax_id') THEN
    ALTER TABLE twilio_configurations ADD COLUMN tax_id text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'business_type') THEN
    ALTER TABLE twilio_configurations ADD COLUMN business_type text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'website_url') THEN
    ALTER TABLE twilio_configurations ADD COLUMN website_url text;
  END IF;

  -- Address
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'address_line1') THEN
    ALTER TABLE twilio_configurations ADD COLUMN address_line1 text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'address_line2') THEN
    ALTER TABLE twilio_configurations ADD COLUMN address_line2 text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'city') THEN
    ALTER TABLE twilio_configurations ADD COLUMN city text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'state') THEN
    ALTER TABLE twilio_configurations ADD COLUMN state text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'zip_code') THEN
    ALTER TABLE twilio_configurations ADD COLUMN zip_code text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'country') THEN
    ALTER TABLE twilio_configurations ADD COLUMN country text DEFAULT 'United States';
  END IF;

  -- Contact
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'contact_first_name') THEN
    ALTER TABLE twilio_configurations ADD COLUMN contact_first_name text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'contact_last_name') THEN
    ALTER TABLE twilio_configurations ADD COLUMN contact_last_name text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'contact_email') THEN
    ALTER TABLE twilio_configurations ADD COLUMN contact_email text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'contact_phone') THEN
    ALTER TABLE twilio_configurations ADD COLUMN contact_phone text;
  END IF;

  -- SMS Use Case
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'sms_use_case') THEN
    ALTER TABLE twilio_configurations ADD COLUMN sms_use_case text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'use_case_description') THEN
    ALTER TABLE twilio_configurations ADD COLUMN use_case_description text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'sample_message') THEN
    ALTER TABLE twilio_configurations ADD COLUMN sample_message text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'opt_in_method') THEN
    ALTER TABLE twilio_configurations ADD COLUMN opt_in_method text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'opt_in_url') THEN
    ALTER TABLE twilio_configurations ADD COLUMN opt_in_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'privacy_policy_url') THEN
    ALTER TABLE twilio_configurations ADD COLUMN privacy_policy_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'terms_url') THEN
    ALTER TABLE twilio_configurations ADD COLUMN terms_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'monthly_sms_volume') THEN
    ALTER TABLE twilio_configurations ADD COLUMN monthly_sms_volume integer DEFAULT 10000;
  END IF;

  -- Prepaid Balance
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'prepaid_balance_cents') THEN
    ALTER TABLE twilio_configurations ADD COLUMN prepaid_balance_cents integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'low_balance_threshold_cents') THEN
    ALTER TABLE twilio_configurations ADD COLUMN low_balance_threshold_cents integer DEFAULT 1000;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'verified') THEN
    ALTER TABLE twilio_configurations ADD COLUMN verified boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_configurations' AND column_name = 'verification_submitted_at') THEN
    ALTER TABLE twilio_configurations ADD COLUMN verification_submitted_at timestamptz;
  END IF;
END $$;

-- Create communications_transactions table
CREATE TABLE IF NOT EXISTS communications_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('prepay', 'call_charge', 'sms_charge', 'phone_number_charge', 'refund')),
  amount_cents integer NOT NULL,
  description text,
  call_log_id uuid REFERENCES twilio_call_logs(id) ON DELETE SET NULL,
  sms_log_id uuid REFERENCES twilio_sms_logs(id) ON DELETE SET NULL,
  balance_after_cents integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE communications_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own transactions"
  ON communications_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = communications_transactions.merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert transactions"
  ON communications_transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = communications_transactions.merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

-- Create index for merchant lookups
CREATE INDEX IF NOT EXISTS idx_communications_transactions_merchant_id
  ON communications_transactions(merchant_id);

CREATE INDEX IF NOT EXISTS idx_communications_transactions_created_at
  ON communications_transactions(created_at DESC);

-- Create function to deduct usage from balance
CREATE OR REPLACE FUNCTION deduct_communications_usage(
  p_merchant_id uuid,
  p_transaction_type text,
  p_amount_cents integer,
  p_description text,
  p_call_log_id uuid DEFAULT NULL,
  p_sms_log_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_balance integer;
  v_new_balance integer;
  v_config_id uuid;
  v_transaction_id uuid;
BEGIN
  -- Get current balance
  SELECT id, prepaid_balance_cents INTO v_config_id, v_current_balance
  FROM twilio_configurations
  WHERE merchant_id = p_merchant_id
  FOR UPDATE;

  IF v_config_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Configuration not found');
  END IF;

  IF v_current_balance < p_amount_cents THEN
    RETURN jsonb_build_object('error', 'Insufficient balance');
  END IF;

  -- Calculate new balance
  v_new_balance := v_current_balance - p_amount_cents;

  -- Update configuration balance
  UPDATE twilio_configurations
  SET prepaid_balance_cents = v_new_balance,
      updated_at = now()
  WHERE id = v_config_id;

  -- Create transaction record
  INSERT INTO communications_transactions (
    merchant_id,
    transaction_type,
    amount_cents,
    description,
    call_log_id,
    sms_log_id,
    balance_after_cents
  ) VALUES (
    p_merchant_id,
    p_transaction_type,
    -p_amount_cents,
    p_description,
    p_call_log_id,
    p_sms_log_id,
    v_new_balance
  )
  RETURNING id INTO v_transaction_id;

  RETURN jsonb_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'balance_after_cents', v_new_balance
  );
END;
$$;
