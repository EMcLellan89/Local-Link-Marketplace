/*
  # Update Profit Network Deduction Logic

  1. Business Rules (Clarified)
    - Week 1-8: Local-Link covers $20/day in ads ($1,120 total) for first ad account only
    - Starting Week 9: BOTH payback ($50/week) AND current ad costs are deducted from commission
    - Payback deductions continue until $1,120 is fully repaid (23 weeks at $50/week)
    - After payback complete: Only ad costs are deducted from commission
    - Partners can choose their own daily ad spend amount (not locked to $20/day)

  2. New Functions
    - calculate_profit_network_weekly_deductions: Calculate all deductions for a week
    - process_profit_network_commission_payout: Process payout with proper deductions
    - get_enrollment_payback_status: Get current payback status

  3. Updates
    - Add helper function to determine if enrollment is in payback period
    - Add function to calculate net payout after all deductions
*/

-- Function to get current payback status for an enrollment
CREATE OR REPLACE FUNCTION get_enrollment_payback_status(p_enrollment_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_enrollment record;
  v_weeks_since_start integer;
  v_current_week integer;
  v_payback_status text;
  v_remaining_payback_cents bigint;
BEGIN
  -- Get enrollment details
  SELECT 
    id,
    startup_ad_budget_cents,
    startup_start_date,
    startup_end_date,
    payback_owed_cents,
    payback_paid_cents,
    weekly_payback_cents,
    payback_complete,
    partner_pays_ads,
    daily_ad_spend_cents
  INTO v_enrollment
  FROM profit_network_enrollments
  WHERE id = p_enrollment_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Enrollment not found');
  END IF;

  -- Calculate weeks since start
  IF v_enrollment.startup_start_date IS NOT NULL THEN
    v_weeks_since_start := FLOOR(EXTRACT(EPOCH FROM (now() - v_enrollment.startup_start_date)) / (7 * 24 * 60 * 60));
    v_current_week := v_weeks_since_start + 1;
  ELSE
    v_weeks_since_start := 0;
    v_current_week := 1;
  END IF;

  -- Determine payback status
  IF v_current_week <= 8 THEN
    v_payback_status := 'startup'; -- Local-Link covering ads
  ELSIF v_enrollment.payback_complete THEN
    v_payback_status := 'complete'; -- Payback finished, only ad costs deducted
  ELSE
    v_payback_status := 'active'; -- Weeks 9+, both payback and ad costs deducted
  END IF;

  -- Calculate remaining payback
  v_remaining_payback_cents := GREATEST(0, COALESCE(v_enrollment.payback_owed_cents, 0) - COALESCE(v_enrollment.payback_paid_cents, 0));

  RETURN jsonb_build_object(
    'enrollment_id', p_enrollment_id,
    'current_week', v_current_week,
    'payback_status', v_payback_status,
    'payback_owed_cents', v_enrollment.payback_owed_cents,
    'payback_paid_cents', v_enrollment.payback_paid_cents,
    'remaining_payback_cents', v_remaining_payback_cents,
    'weekly_payback_cents', v_enrollment.weekly_payback_cents,
    'payback_complete', v_enrollment.payback_complete,
    'partner_pays_ads', v_enrollment.partner_pays_ads,
    'daily_ad_spend_cents', v_enrollment.daily_ad_spend_cents,
    'in_startup_period', v_current_week <= 8,
    'in_payback_period', v_payback_status = 'active'
  );
END;
$$;

-- Function to calculate weekly deductions for an enrollment
CREATE OR REPLACE FUNCTION calculate_profit_network_weekly_deductions(
  p_enrollment_id uuid,
  p_week_start_date date,
  p_week_end_date date
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_payback_status jsonb;
  v_payback_deduction_cents bigint := 0;
  v_ad_cost_deduction_cents bigint := 0;
  v_total_deduction_cents bigint := 0;
  v_ad_costs record;
BEGIN
  -- Get payback status
  v_payback_status := get_enrollment_payback_status(p_enrollment_id);

  -- Calculate payback deduction
  -- Only deduct payback if we're past week 8 and payback is not complete
  IF (v_payback_status->>'payback_status')::text = 'active' THEN
    v_payback_deduction_cents := (v_payback_status->>'weekly_payback_cents')::bigint;
    
    -- Don't deduct more than what's remaining
    v_payback_deduction_cents := LEAST(
      v_payback_deduction_cents, 
      (v_payback_status->>'remaining_payback_cents')::bigint
    );
  END IF;

  -- Calculate ad cost deduction
  -- Deduct ad costs starting week 9 (both during payback and after)
  IF (v_payback_status->>'current_week')::integer > 8 THEN
    SELECT COALESCE(SUM(daily_spend_cents), 0) INTO v_ad_cost_deduction_cents
    FROM profit_network_ad_costs
    WHERE enrollment_id = p_enrollment_id
      AND date >= p_week_start_date
      AND date <= p_week_end_date
      AND partner_paid = false; -- Only count costs partner hasn't paid yet
  END IF;

  v_total_deduction_cents := v_payback_deduction_cents + v_ad_cost_deduction_cents;

  RETURN jsonb_build_object(
    'enrollment_id', p_enrollment_id,
    'week_start', p_week_start_date,
    'week_end', p_week_end_date,
    'current_week', (v_payback_status->>'current_week')::integer,
    'payback_status', v_payback_status->>'payback_status',
    'payback_deduction_cents', v_payback_deduction_cents,
    'ad_cost_deduction_cents', v_ad_cost_deduction_cents,
    'total_deduction_cents', v_total_deduction_cents,
    'breakdown', jsonb_build_object(
      'payback_weekly_rate', (v_payback_status->>'weekly_payback_cents')::bigint,
      'payback_remaining', (v_payback_status->>'remaining_payback_cents')::bigint,
      'ad_costs_this_week', v_ad_cost_deduction_cents
    )
  );
END;
$$;

-- Function to calculate net commission payout after deductions
CREATE OR REPLACE FUNCTION calculate_profit_network_net_payout(
  p_enrollment_id uuid,
  p_gross_commission_cents bigint,
  p_week_start_date date,
  p_week_end_date date
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deductions jsonb;
  v_total_deduction_cents bigint;
  v_net_payout_cents bigint;
BEGIN
  -- Calculate deductions for this week
  v_deductions := calculate_profit_network_weekly_deductions(
    p_enrollment_id,
    p_week_start_date,
    p_week_end_date
  );

  v_total_deduction_cents := (v_deductions->>'total_deduction_cents')::bigint;
  
  -- Calculate net payout (cannot be negative)
  v_net_payout_cents := GREATEST(0, p_gross_commission_cents - v_total_deduction_cents);

  RETURN jsonb_build_object(
    'enrollment_id', p_enrollment_id,
    'gross_commission_cents', p_gross_commission_cents,
    'total_deduction_cents', v_total_deduction_cents,
    'net_payout_cents', v_net_payout_cents,
    'deduction_breakdown', v_deductions->>'breakdown',
    'payback_deduction_cents', (v_deductions->>'payback_deduction_cents')::bigint,
    'ad_cost_deduction_cents', (v_deductions->>'ad_cost_deduction_cents')::bigint,
    'current_week', (v_deductions->>'current_week')::integer,
    'payback_status', v_deductions->>'payback_status'
  );
END;
$$;

-- Function to process commission payout with deductions
CREATE OR REPLACE FUNCTION process_profit_network_commission_payout(
  p_sale_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sale record;
  v_week_start date;
  v_week_end date;
  v_payout_calc jsonb;
  v_payback_deduction_id uuid;
  v_ad_deduction_id uuid;
BEGIN
  -- Get sale details
  SELECT * INTO v_sale
  FROM profit_network_sales
  WHERE id = p_sale_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Sale not found');
  END IF;

  -- Calculate week range (assuming sale created_at is in the payout week)
  v_week_start := date_trunc('week', v_sale.created_at)::date;
  v_week_end := (v_week_start + INTERVAL '6 days')::date;

  -- Calculate net payout with deductions
  v_payout_calc := calculate_profit_network_net_payout(
    v_sale.enrollment_id,
    v_sale.commission_amount_cents,
    v_week_start,
    v_week_end
  );

  -- Record payback deduction if applicable
  IF (v_payout_calc->>'payback_deduction_cents')::bigint > 0 THEN
    INSERT INTO profit_network_deductions (
      enrollment_id,
      partner_id,
      sale_id,
      deduction_type,
      amount_cents,
      description,
      week_number,
      year
    ) VALUES (
      v_sale.enrollment_id,
      v_sale.partner_id,
      v_sale.id,
      'startup_payback',
      (v_payout_calc->>'payback_deduction_cents')::bigint,
      'Startup ad budget payback - Week ' || (v_payout_calc->>'current_week')::text,
      (v_payout_calc->>'current_week')::integer,
      EXTRACT(YEAR FROM v_week_start)::integer
    )
    RETURNING id INTO v_payback_deduction_id;

    -- Update enrollment payback tracking
    UPDATE profit_network_enrollments
    SET 
      payback_paid_cents = payback_paid_cents + (v_payout_calc->>'payback_deduction_cents')::bigint,
      payback_complete = (payback_paid_cents + (v_payout_calc->>'payback_deduction_cents')::bigint) >= payback_owed_cents,
      updated_at = now()
    WHERE id = v_sale.enrollment_id;
  END IF;

  -- Record ad cost deduction if applicable
  IF (v_payout_calc->>'ad_cost_deduction_cents')::bigint > 0 THEN
    INSERT INTO profit_network_deductions (
      enrollment_id,
      partner_id,
      sale_id,
      deduction_type,
      amount_cents,
      description,
      week_number,
      year
    ) VALUES (
      v_sale.enrollment_id,
      v_sale.partner_id,
      v_sale.id,
      'ad_costs',
      (v_payout_calc->>'ad_cost_deduction_cents')::bigint,
      'Ad costs for week ' || (v_payout_calc->>'current_week')::text,
      (v_payout_calc->>'current_week')::integer,
      EXTRACT(YEAR FROM v_week_start)::integer
    )
    RETURNING id INTO v_ad_deduction_id;

    -- Mark ad costs as partner paid
    UPDATE profit_network_ad_costs
    SET partner_paid = true
    WHERE enrollment_id = v_sale.enrollment_id
      AND date >= v_week_start
      AND date <= v_week_end
      AND partner_paid = false;
  END IF;

  -- Update sale with net commission
  UPDATE profit_network_sales
  SET 
    net_commission_cents = (v_payout_calc->>'net_payout_cents')::bigint,
    deductions_applied = true,
    status = CASE 
      WHEN (v_payout_calc->>'net_payout_cents')::bigint > 0 THEN 'approved'
      ELSE 'fully_deducted'
    END
  WHERE id = p_sale_id;

  RETURN jsonb_build_object(
    'success', true,
    'sale_id', p_sale_id,
    'gross_commission_cents', (v_payout_calc->>'gross_commission_cents')::bigint,
    'net_payout_cents', (v_payout_calc->>'net_payout_cents')::bigint,
    'payback_deduction_cents', (v_payout_calc->>'payback_deduction_cents')::bigint,
    'ad_cost_deduction_cents', (v_payout_calc->>'ad_cost_deduction_cents')::bigint,
    'payback_deduction_id', v_payback_deduction_id,
    'ad_deduction_id', v_ad_deduction_id
  );
END;
$$;

-- Add columns to sales table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profit_network_sales' AND column_name = 'deductions_applied'
  ) THEN
    ALTER TABLE profit_network_sales ADD COLUMN deductions_applied boolean DEFAULT false;
  END IF;
END $$;

-- Update comment on enrollments table to document the business rules
COMMENT ON TABLE profit_network_enrollments IS 
'Partner enrollments in Profit Network businesses. 
DEDUCTION RULES:
- Week 1-8: Local-Link covers $20/day ads (startup_ad_budget_cents = $1,120)
- Week 9+: Partner pays back $50/week (weekly_payback_cents) until startup budget is repaid
- Week 9+: Partner ALSO pays for their own ad costs each week
- After payback_complete = true: Only ad costs are deducted (no more payback)
- Partner can set custom daily_ad_spend_cents (not locked to $20/day)
- First ad account only gets the startup budget coverage';
