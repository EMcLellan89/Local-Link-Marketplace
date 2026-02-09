/*
  # Add Email Subscriptions Table

  1. New Table: email_subscriptions
    - Track merchant email service subscriptions
    - Store tier information (essentials vs pro)
    - Track monthly usage and limits
    - Store billing information

  2. Security
    - Enable RLS on email_subscriptions
    - Add policies for merchant access
*/

-- Create email_subscriptions table
CREATE TABLE IF NOT EXISTS email_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL UNIQUE,
  tier text NOT NULL CHECK (tier IN ('essentials', 'pro')),
  monthly_price_cents integer NOT NULL,
  monthly_email_limit integer NOT NULL,
  emails_sent_this_month integer DEFAULT 0,
  status text NOT NULL CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
  billing_name text NOT NULL,
  billing_address text,
  website text,
  current_period_start timestamptz DEFAULT now(),
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own email subscription"
  ON email_subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = email_subscriptions.merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own email subscription"
  ON email_subscriptions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = email_subscriptions.merchant_id
      AND merchants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = email_subscriptions.merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can insert own email subscription"
  ON email_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = email_subscriptions.merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

-- Create index for merchant lookups
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_merchant_id
  ON email_subscriptions(merchant_id);

-- Create function to check email send limit
CREATE OR REPLACE FUNCTION check_email_send_limit(
  p_merchant_id uuid,
  p_email_count integer DEFAULT 1
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_subscription record;
  v_can_send boolean;
BEGIN
  -- Get subscription details
  SELECT * INTO v_subscription
  FROM email_subscriptions
  WHERE merchant_id = p_merchant_id
  AND status = 'active';

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'can_send', false,
      'error', 'No active email subscription'
    );
  END IF;

  -- Check if within limit
  v_can_send := (v_subscription.emails_sent_this_month + p_email_count) <= v_subscription.monthly_email_limit;

  IF v_can_send THEN
    -- Increment counter
    UPDATE email_subscriptions
    SET emails_sent_this_month = emails_sent_this_month + p_email_count,
        updated_at = now()
    WHERE merchant_id = p_merchant_id;

    RETURN jsonb_build_object(
      'can_send', true,
      'emails_remaining', v_subscription.monthly_email_limit - (v_subscription.emails_sent_this_month + p_email_count)
    );
  ELSE
    RETURN jsonb_build_object(
      'can_send', false,
      'error', 'Monthly email limit reached',
      'limit', v_subscription.monthly_email_limit,
      'sent', v_subscription.emails_sent_this_month
    );
  END IF;
END;
$$;

-- Create function to reset monthly counters (to be called at the start of each month)
CREATE OR REPLACE FUNCTION reset_monthly_email_counters()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE email_subscriptions
  SET emails_sent_this_month = 0,
      current_period_start = now(),
      current_period_end = now() + interval '30 days',
      updated_at = now()
  WHERE status = 'active'
  AND current_period_end < now();
END;
$$;
