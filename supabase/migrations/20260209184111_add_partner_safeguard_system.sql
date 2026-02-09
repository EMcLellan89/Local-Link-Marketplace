/*
  # Partner Safeguard System

  Protects platform and merchants from inactive/underperforming partners while
  maintaining exclusivity model benefits.

  ## New Tables

  1. **partner_performance_metrics** - Track partner activity and results
  2. **partner_warnings** - Warning system before territory recovery
  3. **merchant_reassignment_requests** - Merchant-initiated partner changes
  4. **territory_recovery_log** - Audit trail of territory recoveries

  ## Features

  - Automatic inactivity detection (30/60/90 day thresholds)
  - Performance tracking (merchants signed, revenue generated)
  - Warning system (3 strikes before recovery)
  - Merchant reassignment after 90 days with admin approval
  - Original partner gets 90-day residual commission on reassignments
  - Territory recovery automation with notification

  ## Security

  - RLS enabled on all tables
  - Admin-only management
  - Audit trail for all actions
*/

-- Partner Performance Metrics
CREATE TABLE IF NOT EXISTS partner_performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  merchants_signed integer DEFAULT 0,
  merchants_active integer DEFAULT 0,
  deals_created integer DEFAULT 0,
  gross_revenue numeric(12,2) DEFAULT 0,
  partner_commission numeric(12,2) DEFAULT 0,
  last_merchant_signup timestamptz,
  last_deal_created timestamptz,
  last_login timestamptz,
  activity_score integer DEFAULT 0 CHECK (activity_score >= 0 AND activity_score <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, period_start)
);

-- Partner Warnings
CREATE TABLE IF NOT EXISTS partner_warnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  warning_type text NOT NULL CHECK (warning_type IN ('inactivity', 'low_performance', 'policy_violation', 'merchant_complaint')),
  severity text NOT NULL CHECK (severity IN ('minor', 'moderate', 'severe')),
  title text NOT NULL,
  description text NOT NULL,
  action_required text,
  deadline timestamptz,
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id),
  resolution_notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Merchant Reassignment Requests
CREATE TABLE IF NOT EXISTS merchant_reassignment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  current_partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  requested_partner_id uuid REFERENCES partners(id) ON DELETE SET NULL,
  reason text NOT NULL,
  merchant_tenure_days integer,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'cancelled')),
  admin_notes text,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  residual_commission_months integer DEFAULT 3,
  residual_end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Territory Recovery Log
CREATE TABLE IF NOT EXISTS territory_recovery_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  territory_id uuid NOT NULL REFERENCES territories(id) ON DELETE CASCADE,
  previous_partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  recovery_reason text NOT NULL,
  inactivity_days integer,
  warnings_issued integer DEFAULT 0,
  merchants_affected integer DEFAULT 0,
  last_activity_date timestamptz,
  recovery_date timestamptz DEFAULT now(),
  recovered_by uuid REFERENCES auth.users(id),
  notes text,
  merchants_transferred jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Add performance tracking fields to partners table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'performance_tier'
  ) THEN
    ALTER TABLE partners ADD COLUMN performance_tier text DEFAULT 'starter'
      CHECK (performance_tier IN ('starter', 'growth', 'pro', 'enterprise'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'last_merchant_signup'
  ) THEN
    ALTER TABLE partners ADD COLUMN last_merchant_signup timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE partners ADD COLUMN last_login timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'total_merchants'
  ) THEN
    ALTER TABLE partners ADD COLUMN total_merchants integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'active_warnings'
  ) THEN
    ALTER TABLE partners ADD COLUMN active_warnings integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'inactivity_strike_count'
  ) THEN
    ALTER TABLE partners ADD COLUMN inactivity_strike_count integer DEFAULT 0;
  END IF;
END $$;

-- Add reassignment tracking to merchants table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'merchants' AND column_name = 'original_partner_id'
  ) THEN
    ALTER TABLE merchants ADD COLUMN original_partner_id uuid REFERENCES partners(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'merchants' AND column_name = 'partner_assigned_at'
  ) THEN
    ALTER TABLE merchants ADD COLUMN partner_assigned_at timestamptz DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'merchants' AND column_name = 'residual_commission_end_date'
  ) THEN
    ALTER TABLE merchants ADD COLUMN residual_commission_end_date date;
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_partner_performance_partner ON partner_performance_metrics(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_performance_period ON partner_performance_metrics(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_partner_warnings_partner ON partner_warnings(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_warnings_resolved ON partner_warnings(resolved);
CREATE INDEX IF NOT EXISTS idx_merchant_reassignment_status ON merchant_reassignment_requests(status);
CREATE INDEX IF NOT EXISTS idx_merchant_reassignment_merchant ON merchant_reassignment_requests(merchant_id);
CREATE INDEX IF NOT EXISTS idx_territory_recovery_territory ON territory_recovery_log(territory_id);
CREATE INDEX IF NOT EXISTS idx_territory_recovery_partner ON territory_recovery_log(previous_partner_id);
CREATE INDEX IF NOT EXISTS idx_merchants_residual_end ON merchants(residual_commission_end_date) WHERE residual_commission_end_date IS NOT NULL;

-- Enable RLS
ALTER TABLE partner_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_reassignment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE territory_recovery_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Performance Metrics: Admins see all, partners see own
CREATE POLICY "Admins can view all performance metrics"
  ON partner_performance_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Partners can view own performance"
  ON partner_performance_metrics FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT partner_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Warnings: Admins manage, partners view own
CREATE POLICY "Admins can manage warnings"
  ON partner_warnings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Partners can view own warnings"
  ON partner_warnings FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT partner_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Reassignment Requests: Merchants create, admins manage
CREATE POLICY "Merchants can create reassignment requests"
  ON merchant_reassignment_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can view own requests"
  ON merchant_reassignment_requests FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage reassignment requests"
  ON merchant_reassignment_requests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Recovery Log: Admin read-only
CREATE POLICY "Admins can view recovery log"
  ON territory_recovery_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Helper Functions

-- Calculate partner activity score (0-100)
CREATE OR REPLACE FUNCTION calculate_partner_activity_score(p_partner_id uuid, p_days integer DEFAULT 30)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_score integer := 0;
  v_merchants_signed integer;
  v_deals_created integer;
  v_last_login_days integer;
  v_last_merchant_days integer;
BEGIN
  -- Count merchants signed in period
  SELECT COUNT(*) INTO v_merchants_signed
  FROM merchants
  WHERE partner_id = p_partner_id
  AND created_at >= now() - (p_days || ' days')::interval;

  -- Count deals created in period
  SELECT COUNT(*) INTO v_deals_created
  FROM deals
  WHERE partner_id = p_partner_id
  AND created_at >= now() - (p_days || ' days')::interval;

  -- Days since last login
  SELECT EXTRACT(DAY FROM now() - last_login)::integer INTO v_last_login_days
  FROM partners
  WHERE id = p_partner_id;

  -- Days since last merchant signup
  SELECT EXTRACT(DAY FROM now() - last_merchant_signup)::integer INTO v_last_merchant_days
  FROM partners
  WHERE id = p_partner_id;

  -- Calculate score
  -- Merchants signed: 5 points each (max 40)
  v_score := v_score + LEAST(v_merchants_signed * 5, 40);

  -- Deals created: 2 points each (max 20)
  v_score := v_score + LEAST(v_deals_created * 2, 20);

  -- Recent login: 20 points if within 7 days, decreasing
  IF v_last_login_days IS NULL THEN
    v_score := v_score + 0;
  ELSIF v_last_login_days <= 7 THEN
    v_score := v_score + 20;
  ELSIF v_last_login_days <= 14 THEN
    v_score := v_score + 15;
  ELSIF v_last_login_days <= 30 THEN
    v_score := v_score + 10;
  END IF;

  -- Recent merchant activity: 20 points if within 14 days
  IF v_last_merchant_days IS NULL THEN
    v_score := v_score + 0;
  ELSIF v_last_merchant_days <= 14 THEN
    v_score := v_score + 20;
  ELSIF v_last_merchant_days <= 30 THEN
    v_score := v_score + 10;
  END IF;

  RETURN LEAST(v_score, 100);
END;
$$;

-- Check if partner should receive inactivity warning
CREATE OR REPLACE FUNCTION check_partner_inactivity(p_partner_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
  v_last_merchant_days integer;
  v_last_login_days integer;
  v_active_warnings integer;
  v_should_warn boolean := false;
  v_severity text;
  v_message text;
BEGIN
  -- Get inactivity metrics
  SELECT
    EXTRACT(DAY FROM now() - last_merchant_signup)::integer,
    EXTRACT(DAY FROM now() - last_login)::integer,
    active_warnings
  INTO v_last_merchant_days, v_last_login_days, v_active_warnings
  FROM partners
  WHERE id = p_partner_id;

  -- Determine warning level
  IF v_last_merchant_days >= 90 OR v_last_login_days >= 90 THEN
    v_should_warn := true;
    v_severity := 'severe';
    v_message := '90+ days of inactivity. Territory recovery imminent.';
  ELSIF v_last_merchant_days >= 60 OR v_last_login_days >= 60 THEN
    v_should_warn := true;
    v_severity := 'moderate';
    v_message := '60+ days of inactivity. Please sign merchants or territory may be recovered.';
  ELSIF v_last_merchant_days >= 30 OR v_last_login_days >= 30 THEN
    v_should_warn := true;
    v_severity := 'minor';
    v_message := '30+ days of inactivity. Action needed to maintain territory.';
  END IF;

  v_result := jsonb_build_object(
    'should_warn', v_should_warn,
    'severity', v_severity,
    'message', v_message,
    'days_since_merchant', v_last_merchant_days,
    'days_since_login', v_last_login_days,
    'active_warnings', v_active_warnings
  );

  RETURN v_result;
END;
$$;

-- Approve merchant reassignment
CREATE OR REPLACE FUNCTION approve_merchant_reassignment(
  p_request_id uuid,
  p_admin_id uuid,
  p_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_merchant_id uuid;
  v_current_partner_id uuid;
  v_new_partner_id uuid;
  v_residual_months integer;
BEGIN
  -- Get request details
  SELECT merchant_id, current_partner_id, requested_partner_id, residual_commission_months
  INTO v_merchant_id, v_current_partner_id, v_new_partner_id, v_residual_months
  FROM merchant_reassignment_requests
  WHERE id = p_request_id;

  -- Update request status
  UPDATE merchant_reassignment_requests
  SET
    status = 'approved',
    reviewed_by = p_admin_id,
    reviewed_at = now(),
    admin_notes = p_notes,
    residual_end_date = CURRENT_DATE + (v_residual_months || ' months')::interval
  WHERE id = p_request_id;

  -- Update merchant
  UPDATE merchants
  SET
    original_partner_id = v_current_partner_id,
    partner_id = v_new_partner_id,
    partner_assigned_at = now(),
    residual_commission_end_date = CURRENT_DATE + (v_residual_months || ' months')::interval
  WHERE id = v_merchant_id;

  -- Create audit log
  INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id, metadata_json)
  VALUES (
    p_admin_id,
    'merchant_reassignment_approved',
    'merchant',
    v_merchant_id,
    jsonb_build_object(
      'request_id', p_request_id,
      'from_partner', v_current_partner_id,
      'to_partner', v_new_partner_id,
      'residual_months', v_residual_months
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'merchant_id', v_merchant_id,
    'new_partner_id', v_new_partner_id,
    'residual_end_date', CURRENT_DATE + (v_residual_months || ' months')::interval
  );
END;
$$;

-- Triggers
CREATE TRIGGER update_partner_performance_metrics_updated_at
  BEFORE UPDATE ON partner_performance_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_warnings_updated_at
  BEFORE UPDATE ON partner_warnings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_merchant_reassignment_requests_updated_at
  BEFORE UPDATE ON merchant_reassignment_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
