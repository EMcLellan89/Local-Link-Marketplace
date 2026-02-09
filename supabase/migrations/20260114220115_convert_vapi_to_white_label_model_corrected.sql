/*
  # Convert Vapi to White-Label Reseller Model

  1. Changes
    - Add platform_vapi_config table for single platform-level Vapi account
    - Update vapi_configurations to remove API keys (now platform-level)
    - Add usage tracking per merchant
    - Add billing fields for cost tracking
    - Add functions for platform-level Vapi management

  2. Security
    - Only admins can access platform_vapi_config
    - Merchants can only see their usage, not credentials
    - Usage tracking for transparent billing

  3. White-Label Features
    - Single Vapi account for entire platform
    - Per-merchant phone numbers
    - Per-merchant assistants (personalized)
    - Usage tracking for billing
    - Cost attribution per merchant
*/

-- Platform-level Vapi Configuration (ONE record for entire platform)
CREATE TABLE IF NOT EXISTS platform_vapi_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vapi_api_key text NOT NULL,
  vapi_public_key text NOT NULL,
  vapi_account_id text,
  is_active boolean DEFAULT true,
  monthly_budget_cents integer DEFAULT 100000,
  current_month_spend_cents integer DEFAULT 0,
  last_reset_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE platform_vapi_config ENABLE ROW LEVEL SECURITY;

-- Only admins can view platform config
CREATE POLICY "Only admins can view platform vapi config"
  ON platform_vapi_config FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can manage platform config
CREATE POLICY "Only admins can manage platform vapi config"
  ON platform_vapi_config FOR ALL
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

-- Update vapi_configurations to remove API keys (now platform-level)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vapi_configurations' 
    AND column_name = 'vapi_api_key'
  ) THEN
    ALTER TABLE vapi_configurations DROP COLUMN vapi_api_key;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vapi_configurations' 
    AND column_name = 'vapi_public_key'
  ) THEN
    ALTER TABLE vapi_configurations DROP COLUMN vapi_public_key;
  END IF;
END $$;

-- Add white-label fields to vapi_configurations
ALTER TABLE vapi_configurations ADD COLUMN IF NOT EXISTS vapi_phone_number text;
ALTER TABLE vapi_configurations ADD COLUMN IF NOT EXISTS included_minutes_monthly integer DEFAULT 0;
ALTER TABLE vapi_configurations ADD COLUMN IF NOT EXISTS overage_rate_per_minute_cents integer DEFAULT 8;
ALTER TABLE vapi_configurations ADD COLUMN IF NOT EXISTS current_month_minutes integer DEFAULT 0;
ALTER TABLE vapi_configurations ADD COLUMN IF NOT EXISTS current_month_cost_cents integer DEFAULT 0;
ALTER TABLE vapi_configurations ADD COLUMN IF NOT EXISTS last_billing_reset timestamptz DEFAULT now();
ALTER TABLE vapi_configurations ADD COLUMN IF NOT EXISTS auto_provision boolean DEFAULT true;

COMMENT ON COLUMN vapi_configurations.included_minutes_monthly IS 'Minutes included in CRM subscription';
COMMENT ON COLUMN vapi_configurations.overage_rate_per_minute_cents IS 'Rate charged for minutes beyond included amount';
COMMENT ON COLUMN vapi_configurations.current_month_minutes IS 'Minutes used this billing period';
COMMENT ON COLUMN vapi_configurations.current_month_cost_cents IS 'Total cost this billing period';

-- Add billing tracking to call logs
ALTER TABLE vapi_call_logs ADD COLUMN IF NOT EXISTS billed_to_merchant boolean DEFAULT false;
ALTER TABLE vapi_call_logs ADD COLUMN IF NOT EXISTS merchant_charge_cents integer DEFAULT 0;
ALTER TABLE vapi_call_logs ADD COLUMN IF NOT EXISTS platform_cost_cents integer DEFAULT 0;
ALTER TABLE vapi_call_logs ADD COLUMN IF NOT EXISTS margin_cents integer DEFAULT 0;

-- Function to get platform Vapi credentials (for edge functions)
CREATE OR REPLACE FUNCTION get_platform_vapi_credentials()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_config record;
BEGIN
  SELECT * INTO v_config
  FROM platform_vapi_config
  WHERE is_active = true
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'No active platform Vapi configuration found');
  END IF;

  RETURN jsonb_build_object(
    'api_key', v_config.vapi_api_key,
    'public_key', v_config.vapi_public_key,
    'account_id', v_config.vapi_account_id,
    'is_active', v_config.is_active
  );
END;
$$;

-- Function to track Vapi call usage and calculate billing
CREATE OR REPLACE FUNCTION record_vapi_call_billing(
  p_merchant_id uuid,
  p_call_id text,
  p_duration_seconds integer,
  p_platform_cost_cents integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_config record;
  v_minutes_used numeric;
  v_included_minutes integer;
  v_overage_minutes numeric;
  v_merchant_charge_cents integer := 0;
  v_margin_cents integer;
BEGIN
  -- Get merchant's Vapi configuration
  SELECT * INTO v_config
  FROM vapi_configurations
  WHERE merchant_id = p_merchant_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'No Vapi configuration found for merchant');
  END IF;

  -- Calculate minutes (round up)
  v_minutes_used := CEIL(p_duration_seconds::numeric / 60);
  
  -- Update merchant's usage
  UPDATE vapi_configurations
  SET 
    current_month_minutes = current_month_minutes + v_minutes_used::integer,
    current_month_cost_cents = current_month_cost_cents + p_platform_cost_cents,
    updated_at = now()
  WHERE merchant_id = p_merchant_id
  RETURNING included_minutes_monthly INTO v_included_minutes;

  -- Calculate overage charges
  v_overage_minutes := GREATEST(0, (v_config.current_month_minutes + v_minutes_used) - v_included_minutes);
  
  IF v_overage_minutes > 0 THEN
    v_merchant_charge_cents := (v_overage_minutes * v_config.overage_rate_per_minute_cents)::integer;
  END IF;

  -- Calculate margin (what you charge merchant vs what Vapi charges you)
  v_margin_cents := v_merchant_charge_cents - p_platform_cost_cents;

  -- Update call log with billing info
  UPDATE vapi_call_logs
  SET 
    billed_to_merchant = true,
    merchant_charge_cents = v_merchant_charge_cents,
    platform_cost_cents = p_platform_cost_cents,
    margin_cents = v_margin_cents
  WHERE vapi_call_id = p_call_id;

  -- Update platform spend tracking
  UPDATE platform_vapi_config
  SET current_month_spend_cents = current_month_spend_cents + p_platform_cost_cents
  WHERE is_active = true;

  RETURN jsonb_build_object(
    'success', true,
    'minutes_used', v_minutes_used,
    'merchant_charge_cents', v_merchant_charge_cents,
    'platform_cost_cents', p_platform_cost_cents,
    'margin_cents', v_margin_cents,
    'total_minutes_this_month', v_config.current_month_minutes + v_minutes_used::integer
  );
END;
$$;

-- Function to reset monthly billing (run on 1st of each month)
CREATE OR REPLACE FUNCTION reset_vapi_monthly_billing()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
BEGIN
  -- Reset all merchant configurations
  UPDATE vapi_configurations
  SET 
    current_month_minutes = 0,
    current_month_cost_cents = 0,
    last_billing_reset = now()
  WHERE is_active = true;

  GET DIAGNOSTICS v_count = ROW_COUNT;

  -- Reset platform spend
  UPDATE platform_vapi_config
  SET 
    current_month_spend_cents = 0,
    last_reset_at = now()
  WHERE is_active = true;

  RETURN v_count;
END;
$$;

-- Function to provision Vapi for merchant (called when they subscribe to CRM)
CREATE OR REPLACE FUNCTION provision_vapi_for_merchant(
  p_merchant_id uuid,
  p_included_minutes integer DEFAULT 100
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_config_id uuid;
BEGIN
  -- Check if platform Vapi is configured
  IF NOT EXISTS (SELECT 1 FROM platform_vapi_config WHERE is_active = true) THEN
    RETURN jsonb_build_object('error', 'Platform Vapi not configured');
  END IF;

  -- Create or update merchant Vapi configuration
  INSERT INTO vapi_configurations (
    merchant_id,
    phone_number_id,
    is_active,
    included_minutes_monthly,
    overage_rate_per_minute_cents,
    auto_provision
  ) VALUES (
    p_merchant_id,
    NULL,
    true,
    p_included_minutes,
    8,
    true
  )
  ON CONFLICT (merchant_id) DO UPDATE
  SET 
    is_active = true,
    included_minutes_monthly = p_included_minutes,
    updated_at = now()
  RETURNING id INTO v_config_id;

  RETURN jsonb_build_object(
    'success', true,
    'config_id', v_config_id,
    'included_minutes', p_included_minutes,
    'message', 'Vapi provisioned for merchant'
  );
END;
$$;

-- Add indexes for billing queries
CREATE INDEX IF NOT EXISTS idx_vapi_call_logs_billing 
  ON vapi_call_logs(merchant_id, created_at, billed_to_merchant) 
  WHERE billed_to_merchant = true;

CREATE INDEX IF NOT EXISTS idx_vapi_configurations_active 
  ON vapi_configurations(merchant_id, is_active) 
  WHERE is_active = true;
