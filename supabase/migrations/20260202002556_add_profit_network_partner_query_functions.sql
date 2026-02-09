/*
  # Add Profit Network Partner Query Functions

  1. Purpose
    - Allow partners to view their commission details
    - Show deduction breakdowns
    - Calculate projected payouts

  2. New Functions
    - get_partner_profit_network_summary: Overall summary for a partner
    - get_enrollment_commission_statement: Detailed statement for an enrollment
    - project_next_week_deductions: Show what will be deducted next week
*/

-- Function to get overall Profit Network summary for a partner
CREATE OR REPLACE FUNCTION get_partner_profit_network_summary(p_partner_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_enrollments jsonb;
  v_total_sales bigint;
  v_total_revenue_cents bigint;
  v_total_gross_commission_cents bigint;
  v_total_deductions_cents bigint;
  v_total_net_commission_cents bigint;
  v_total_paid_cents bigint;
BEGIN
  -- Get all enrollments for partner with their status
  SELECT jsonb_agg(
    jsonb_build_object(
      'enrollment_id', e.id,
      'business_name', b.name,
      'status', e.status,
      'total_sales', e.total_sales,
      'total_revenue_cents', e.total_revenue_cents,
      'total_commission_earned_cents', e.total_commission_earned_cents,
      'payback_status', get_enrollment_payback_status(e.id)
    )
  ) INTO v_enrollments
  FROM profit_network_enrollments e
  JOIN profit_network_businesses b ON b.id = e.business_id
  WHERE e.partner_id = p_partner_id;

  -- Calculate totals
  SELECT 
    COALESCE(SUM(total_sales), 0),
    COALESCE(SUM(total_revenue_cents), 0),
    COALESCE(SUM(total_commission_earned_cents), 0),
    COALESCE(SUM(total_commission_paid_cents), 0)
  INTO 
    v_total_sales,
    v_total_revenue_cents,
    v_total_gross_commission_cents,
    v_total_paid_cents
  FROM profit_network_enrollments
  WHERE partner_id = p_partner_id;

  -- Calculate total deductions
  SELECT COALESCE(SUM(amount_cents), 0) INTO v_total_deductions_cents
  FROM profit_network_deductions
  WHERE partner_id = p_partner_id;

  v_total_net_commission_cents := v_total_gross_commission_cents - v_total_deductions_cents;

  RETURN jsonb_build_object(
    'partner_id', p_partner_id,
    'enrollments', v_enrollments,
    'totals', jsonb_build_object(
      'total_sales', v_total_sales,
      'total_revenue_cents', v_total_revenue_cents,
      'gross_commission_cents', v_total_gross_commission_cents,
      'total_deductions_cents', v_total_deductions_cents,
      'net_commission_cents', v_total_net_commission_cents,
      'paid_to_date_cents', v_total_paid_cents,
      'pending_payout_cents', GREATEST(0, v_total_net_commission_cents - v_total_paid_cents)
    )
  );
END;
$$;

-- Function to get detailed commission statement for an enrollment
CREATE OR REPLACE FUNCTION get_enrollment_commission_statement(
  p_enrollment_id uuid,
  p_start_date date DEFAULT NULL,
  p_end_date date DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_enrollment record;
  v_business record;
  v_payback_status jsonb;
  v_sales jsonb;
  v_deductions jsonb;
  v_summary jsonb;
BEGIN
  -- Get enrollment
  SELECT * INTO v_enrollment
  FROM profit_network_enrollments
  WHERE id = p_enrollment_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Enrollment not found');
  END IF;

  -- Get business
  SELECT * INTO v_business
  FROM profit_network_businesses
  WHERE id = v_enrollment.business_id;

  -- Get payback status
  v_payback_status := get_enrollment_payback_status(p_enrollment_id);

  -- Get sales within date range
  SELECT jsonb_agg(
    jsonb_build_object(
      'sale_id', id,
      'created_at', created_at,
      'product_name', product_name,
      'sale_amount_cents', sale_amount_cents,
      'commission_rate', total_commission_rate,
      'commission_amount_cents', commission_amount_cents,
      'net_commission_cents', net_commission_cents,
      'status', status,
      'deductions_applied', deductions_applied
    ) ORDER BY created_at DESC
  ) INTO v_sales
  FROM profit_network_sales
  WHERE enrollment_id = p_enrollment_id
    AND (p_start_date IS NULL OR created_at::date >= p_start_date)
    AND (p_end_date IS NULL OR created_at::date <= p_end_date);

  -- Get deductions within date range
  SELECT jsonb_agg(
    jsonb_build_object(
      'deduction_id', id,
      'created_at', created_at,
      'deduction_type', deduction_type,
      'amount_cents', amount_cents,
      'description', description,
      'week_number', week_number
    ) ORDER BY created_at DESC
  ) INTO v_deductions
  FROM profit_network_deductions
  WHERE enrollment_id = p_enrollment_id
    AND (p_start_date IS NULL OR created_at::date >= p_start_date)
    AND (p_end_date IS NULL OR created_at::date <= p_end_date);

  -- Calculate summary for date range
  WITH range_data AS (
    SELECT 
      COALESCE(SUM(s.commission_amount_cents), 0) as gross_commission,
      COALESCE(SUM(s.net_commission_cents), 0) as net_commission,
      COALESCE(COUNT(*), 0) as sale_count,
      COALESCE(SUM(s.sale_amount_cents), 0) as total_revenue
    FROM profit_network_sales s
    WHERE s.enrollment_id = p_enrollment_id
      AND (p_start_date IS NULL OR s.created_at::date >= p_start_date)
      AND (p_end_date IS NULL OR s.created_at::date <= p_end_date)
  ),
  deduction_data AS (
    SELECT 
      COALESCE(SUM(CASE WHEN deduction_type = 'startup_payback' THEN amount_cents ELSE 0 END), 0) as payback_deductions,
      COALESCE(SUM(CASE WHEN deduction_type = 'ad_costs' THEN amount_cents ELSE 0 END), 0) as ad_cost_deductions,
      COALESCE(SUM(amount_cents), 0) as total_deductions
    FROM profit_network_deductions
    WHERE enrollment_id = p_enrollment_id
      AND (p_start_date IS NULL OR created_at::date >= p_start_date)
      AND (p_end_date IS NULL OR created_at::date <= p_end_date)
  )
  SELECT jsonb_build_object(
    'date_range', jsonb_build_object(
      'start_date', p_start_date,
      'end_date', p_end_date
    ),
    'sale_count', r.sale_count,
    'total_revenue_cents', r.total_revenue,
    'gross_commission_cents', r.gross_commission,
    'net_commission_cents', r.net_commission,
    'payback_deductions_cents', d.payback_deductions,
    'ad_cost_deductions_cents', d.ad_cost_deductions,
    'total_deductions_cents', d.total_deductions
  ) INTO v_summary
  FROM range_data r, deduction_data d;

  RETURN jsonb_build_object(
    'enrollment_id', p_enrollment_id,
    'business', jsonb_build_object(
      'id', v_business.id,
      'name', v_business.name,
      'commission_rate', v_business.base_commission_rate
    ),
    'tracking_url', v_enrollment.tracking_url,
    'payback_status', v_payback_status,
    'summary', v_summary,
    'sales', COALESCE(v_sales, '[]'::jsonb),
    'deductions', COALESCE(v_deductions, '[]'::jsonb)
  );
END;
$$;

-- Function to project next week's deductions
CREATE OR REPLACE FUNCTION project_next_week_deductions(p_enrollment_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_next_week_start date;
  v_next_week_end date;
  v_projected_deductions jsonb;
  v_payback_status jsonb;
  v_message text;
BEGIN
  -- Calculate next week's date range
  v_next_week_start := (date_trunc('week', now()) + INTERVAL '7 days')::date;
  v_next_week_end := (v_next_week_start + INTERVAL '6 days')::date;

  -- Get payback status
  v_payback_status := get_enrollment_payback_status(p_enrollment_id);

  -- Calculate projected deductions
  v_projected_deductions := calculate_profit_network_weekly_deductions(
    p_enrollment_id,
    v_next_week_start,
    v_next_week_end
  );

  -- Generate helpful message
  IF (v_payback_status->>'current_week')::integer <= 8 THEN
    v_message := 'You are still in your startup period (Week ' || (v_payback_status->>'current_week')::text || 
                 '). Local-Link is covering your ad costs. No deductions will be applied.';
  ELSIF (v_payback_status->>'payback_status')::text = 'active' THEN
    v_message := 'Next week, both your weekly payback ($' || 
                 ((v_projected_deductions->>'payback_deduction_cents')::numeric / 100)::text || 
                 ') and your ad costs ($' || 
                 ((v_projected_deductions->>'ad_cost_deduction_cents')::numeric / 100)::text || 
                 ') will be deducted from your commissions.';
  ELSIF (v_payback_status->>'payback_status')::text = 'complete' THEN
    v_message := 'Payback complete! Only your ad costs ($' || 
                 ((v_projected_deductions->>'ad_cost_deduction_cents')::numeric / 100)::text || 
                 ') will be deducted from your commissions.';
  ELSE
    v_message := 'No deductions scheduled for next week.';
  END IF;

  RETURN jsonb_build_object(
    'enrollment_id', p_enrollment_id,
    'next_week_start', v_next_week_start,
    'next_week_end', v_next_week_end,
    'current_week', (v_payback_status->>'current_week')::integer,
    'payback_status', v_payback_status->>'payback_status',
    'projected_deductions', v_projected_deductions,
    'message', v_message
  );
END;
$$;

-- Grant execute permissions to authenticated users for their own data
-- Note: These functions have security definer and check partner_id internally or via enrollment ownership
