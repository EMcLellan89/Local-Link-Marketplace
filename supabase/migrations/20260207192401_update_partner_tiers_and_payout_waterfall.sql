/*
  # Update Partner System with Payout Waterfall

  1. Update partner_tiers to new 5-tier structure
  2. Add payout waterfall deduction tracking
  3. Add special partner overrides (admin-only)
  4. Add helper functions for automated weekly payouts
*/

-- Drop the white_label constraint (Elite tier needs white_label at $997)
ALTER TABLE partner_tiers DROP CONSTRAINT IF EXISTS white_label_enterprise_only;

-- Update existing tiers to new locked pricing and commission rates
UPDATE partner_tiers SET monthly_cost_usd = 79, commission_rate_bps = 1000, features = '["Access to basic products", "Courses and deals", "Learning platform", "Entry-level SaaS", "10% Commission"]'::jsonb WHERE key = 'starter';
UPDATE partner_tiers SET monthly_cost_usd = 498, commission_rate_bps = 2000, features = '["High-ticket DFY", "AI systems", "Industry SaaS", "Priority jobs", "Ad runners", "20% Commission"]'::jsonb WHERE key = 'pro';
UPDATE partner_tiers SET monthly_cost_usd = 1798, commission_rate_bps = 3000, features = '["Full platform access", "White-label platform", "Vertical licenses", "Hybrid licensing", "Portfolio deals", "30% Commission"]'::jsonb WHERE key = 'enterprise';

-- Add Growth and Elite tiers
INSERT INTO partner_tiers (key, name, monthly_cost_usd, commission_rate_bps, white_label_enabled, features)
VALUES
  ('growth', 'Growth Partner', 218, 1500, false, 
    '["Core Local-Link services", "DFY offers", "Appointment setting", "Job board access", "CRM bundles", "15% Commission"]'::jsonb),
  ('elite', 'Elite Partner', 997, 2500, true,
    '["White-labeled services", "Licensing offers", "Larger retainers", "Multiple verticals", "25% Commission"]'::jsonb)
ON CONFLICT (key) DO UPDATE SET
  monthly_cost_usd = EXCLUDED.monthly_cost_usd,
  commission_rate_bps = EXCLUDED.commission_rate_bps,
  white_label_enabled = EXCLUDED.white_label_enabled,
  features = EXCLUDED.features;

-- Weekly deduction tracking table
CREATE TABLE IF NOT EXISTS partner_weekly_deductions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  week_ending_date date NOT NULL,

  gross_commission_cents integer DEFAULT 0,
  subscription_deduction_cents integer DEFAULT 0,
  loan_repayment_cents integer DEFAULT 0,
  ad_spend_deduction_cents integer DEFAULT 0,
  total_deductions_cents integer GENERATED ALWAYS AS (
    subscription_deduction_cents + loan_repayment_cents + ad_spend_deduction_cents
  ) STORED,
  net_payout_cents integer GENERATED ALWAYS AS (
    GREATEST(0, gross_commission_cents - (subscription_deduction_cents + loan_repayment_cents + ad_spend_deduction_cents))
  ) STORED,

  processed_at timestamptz,
  stripe_payout_id text,
  payout_status text DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'paid', 'failed')),
  notes text,

  created_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, week_ending_date)
);

-- Special partner overrides (ADMIN-ONLY)
CREATE TABLE IF NOT EXISTS partner_special_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid UNIQUE REFERENCES partners(id) ON DELETE CASCADE,
  partner_type text NOT NULL CHECK (partner_type IN ('standard', 'family', 'family_core', 'employee', 'special')),
  subscription_fee_override_usd integer,
  commission_rate_override_bps integer,
  profit_share_enabled boolean DEFAULT false,
  referral_code_used text,
  internal_notes text,
  approved_by uuid REFERENCES profiles(id),
  approved_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product profit shares
CREATE TABLE IF NOT EXISTS partner_profit_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  profit_share_percent numeric(5,2) NOT NULL,
  active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, product_name)
);

-- Add columns to existing tables
ALTER TABLE partner_ad_advances ADD COLUMN IF NOT EXISTS daily_ad_budget_cents integer DEFAULT 2000;
ALTER TABLE partner_ad_advances ADD COLUMN IF NOT EXISTS balance_remaining_cents integer GENERATED ALWAYS AS (total_advanced_cents - amount_repaid_cents) STORED;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS tier_key text;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_partner_weekly_deductions_partner ON partner_weekly_deductions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_weekly_deductions_week ON partner_weekly_deductions(week_ending_date);
CREATE INDEX IF NOT EXISTS idx_partner_special_overrides_partner ON partner_special_overrides(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_profit_shares_partner ON partner_profit_shares(partner_id);

-- RLS
ALTER TABLE partner_weekly_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_special_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_profit_shares ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Partners can view own weekly deductions" ON partner_weekly_deductions;
CREATE POLICY "Partners can view own weekly deductions"
  ON partner_weekly_deductions FOR SELECT
  TO authenticated
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Admin full access to weekly deductions" ON partner_weekly_deductions;
CREATE POLICY "Admin full access to weekly deductions"
  ON partner_weekly_deductions FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admin only access to special overrides" ON partner_special_overrides;
CREATE POLICY "Admin only access to special overrides"
  ON partner_special_overrides FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admin only access to profit shares" ON partner_profit_shares;
CREATE POLICY "Admin only access to profit shares"
  ON partner_profit_shares FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Helper function: Get subscription fee
CREATE OR REPLACE FUNCTION get_partner_subscription_fee_usd(p_partner_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_override integer;
  v_tier_fee integer;
BEGIN
  SELECT subscription_fee_override_usd INTO v_override
  FROM partner_special_overrides WHERE partner_id = p_partner_id;

  IF v_override IS NOT NULL THEN RETURN v_override; END IF;

  SELECT pt.monthly_cost_usd INTO v_tier_fee
  FROM partners p JOIN partner_tiers pt ON p.tier_key = pt.key
  WHERE p.id = p_partner_id;

  RETURN COALESCE(v_tier_fee, 0);
END;
$$;

-- Helper function: Get commission rate
CREATE OR REPLACE FUNCTION get_partner_commission_rate_bps(p_partner_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_override integer;
  v_tier_rate integer;
BEGIN
  SELECT commission_rate_override_bps INTO v_override
  FROM partner_special_overrides WHERE partner_id = p_partner_id;

  IF v_override IS NOT NULL THEN RETURN v_override; END IF;

  SELECT pt.commission_rate_bps INTO v_tier_rate
  FROM partners p JOIN partner_tiers pt ON p.tier_key = pt.key
  WHERE p.id = p_partner_id;

  RETURN COALESCE(v_tier_rate, 0);
END;
$$;

-- Waterfall calculation function
CREATE OR REPLACE FUNCTION calculate_partner_weekly_payout(
  p_partner_id uuid,
  p_week_ending_date date,
  p_gross_commission_cents integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_subscription_weekly_cents integer;
  v_loan_repayment_cents integer;
  v_ad_spend_cents integer;
  v_net_payout integer;
BEGIN
  v_subscription_weekly_cents := ROUND((get_partner_subscription_fee_usd(p_partner_id) * 100)::numeric / 4);

  SELECT COALESCE(LEAST(weekly_repayment_cents, total_advanced_cents - amount_repaid_cents), 0)
  INTO v_loan_repayment_cents
  FROM partner_ad_advances
  WHERE partner_id = p_partner_id AND status = 'active'
  ORDER BY started_at DESC LIMIT 1;

  SELECT COALESCE(daily_ad_budget_cents * 7, 14000) INTO v_ad_spend_cents
  FROM partner_ad_advances
  WHERE partner_id = p_partner_id
  ORDER BY started_at DESC LIMIT 1;

  v_net_payout := GREATEST(0, p_gross_commission_cents - v_subscription_weekly_cents - v_loan_repayment_cents - v_ad_spend_cents);

  RETURN jsonb_build_object(
    'gross_commission_cents', p_gross_commission_cents,
    'subscription_cents', v_subscription_weekly_cents,
    'loan_repayment_cents', v_loan_repayment_cents,
    'ad_spend_cents', v_ad_spend_cents,
    'net_payout_cents', v_net_payout
  );
END;
$$;

-- Weekly payout processor
CREATE OR REPLACE FUNCTION process_weekly_partner_payouts(p_week_ending_date date)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_partner record;
  v_gross integer;
  v_calc jsonb;
  v_count integer := 0;
  v_total bigint := 0;
BEGIN
  FOR v_partner IN SELECT id FROM partners WHERE status = 'active' LOOP
    SELECT COALESCE(SUM(amount_cents), 0) INTO v_gross
    FROM partner_ledger
    WHERE partner_id = v_partner.id
    AND entry_type IN ('commission', 'bonus')
    AND week_start_date >= p_week_ending_date - INTERVAL '7 days'
    AND week_start_date < p_week_ending_date;

    v_calc := calculate_partner_weekly_payout(v_partner.id, p_week_ending_date, v_gross);

    INSERT INTO partner_weekly_deductions (
      partner_id, week_ending_date, gross_commission_cents,
      subscription_deduction_cents, loan_repayment_cents, ad_spend_deduction_cents,
      processed_at, payout_status
    ) VALUES (
      v_partner.id, p_week_ending_date, (v_calc->>'gross_commission_cents')::integer,
      (v_calc->>'subscription_cents')::integer, (v_calc->>'loan_repayment_cents')::integer,
      (v_calc->>'ad_spend_cents')::integer, now(),
      CASE WHEN (v_calc->>'net_payout_cents')::integer > 0 THEN 'pending' ELSE 'paid' END
    ) ON CONFLICT (partner_id, week_ending_date) DO UPDATE SET
      gross_commission_cents = EXCLUDED.gross_commission_cents,
      processed_at = EXCLUDED.processed_at;

    IF (v_calc->>'loan_repayment_cents')::integer > 0 THEN
      UPDATE partner_ad_advances
      SET amount_repaid_cents = amount_repaid_cents + (v_calc->>'loan_repayment_cents')::integer,
          status = CASE WHEN balance_remaining_cents <= (v_calc->>'loan_repayment_cents')::integer THEN 'paid' ELSE status END,
          updated_at = now()
      WHERE partner_id = v_partner.id AND status = 'active';
    END IF;

    v_count := v_count + 1;
    v_total := v_total + (v_calc->>'net_payout_cents')::bigint;
  END LOOP;

  RETURN jsonb_build_object('partners_processed', v_count, 'total_paid_cents', v_total);
END;
$$;
