/*
  # Add Commission Payout Eligibility Check

  1. New Functions
    - `check_partner_payout_eligibility` - Validates partner has active CRM subscription
    - `get_eligible_partners_for_payout` - Returns partners eligible for commission payout
    - `process_partner_commission_payout` - Process payout with eligibility validation

  2. Business Rules
    - Partners must have active Partner CRM subscription (status = 'active' or 'trialing')
    - Partners with 'past_due', 'canceled', or no subscription cannot receive payouts
    - Commission tracking continues regardless of subscription status
    - Only PAYOUTS are blocked for non-subscribers
*/

-- Function to check if a partner is eligible for payout
CREATE OR REPLACE FUNCTION public.check_partner_payout_eligibility(p_partner_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_subscription_status text;
BEGIN
  SELECT status INTO v_subscription_status
  FROM public.partner_crm_subscriptions
  WHERE partner_id = p_partner_id
  ORDER BY created_at DESC
  LIMIT 1;

  RETURN v_subscription_status IN ('active', 'trialing');
END;
$$;

-- Function to get partners eligible for payout with their commission totals
CREATE OR REPLACE FUNCTION public.get_eligible_partners_for_payout()
RETURNS TABLE (
  partner_id uuid,
  partner_name text,
  subscription_status text,
  approved_commission_cents bigint,
  approved_count bigint,
  is_eligible boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ap.id as partner_id,
    COALESCE(p.full_name, ap.business_name) as partner_name,
    COALESCE(pcs.status, 'none') as subscription_status,
    COALESCE(SUM(c.commission_cents), 0)::bigint as approved_commission_cents,
    COUNT(c.id)::bigint as approved_count,
    COALESCE(pcs.status, 'none') IN ('active', 'trialing') as is_eligible
  FROM public.affiliate_partners ap
  LEFT JOIN public.profiles p ON ap.user_id = p.id
  LEFT JOIN public.partner_crm_subscriptions pcs ON pcs.partner_id = ap.id
  LEFT JOIN public.commissions c ON c.partner_id = ap.id AND c.status = 'approved'
  GROUP BY ap.id, p.full_name, ap.business_name, pcs.status
  HAVING COUNT(c.id) > 0
  ORDER BY is_eligible DESC, approved_commission_cents DESC;
END;
$$;

-- Function to process commission payout with eligibility check
CREATE OR REPLACE FUNCTION public.process_partner_commission_payout(
  p_commission_ids uuid[],
  p_payout_method text DEFAULT 'manual',
  p_transaction_id text DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_partner_id uuid;
  v_total_amount bigint := 0;
  v_commission_count int := 0;
  v_is_eligible boolean;
  v_subscription_status text;
BEGIN
  SELECT DISTINCT partner_id INTO v_partner_id
  FROM public.commissions
  WHERE id = ANY(p_commission_ids)
  AND status = 'approved';

  IF v_partner_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'No approved commissions found for the given IDs'
    );
  END IF;

  IF (SELECT COUNT(DISTINCT partner_id) FROM public.commissions WHERE id = ANY(p_commission_ids)) > 1 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'All commissions must belong to the same partner'
    );
  END IF;

  SELECT check_partner_payout_eligibility(v_partner_id) INTO v_is_eligible;

  IF NOT v_is_eligible THEN
    SELECT COALESCE(status, 'none') INTO v_subscription_status
    FROM public.partner_crm_subscriptions
    WHERE partner_id = v_partner_id
    ORDER BY created_at DESC
    LIMIT 1;

    RETURN jsonb_build_object(
      'success', false,
      'error', 'Partner is not eligible for payout',
      'reason', 'Partner CRM subscription required',
      'subscription_status', v_subscription_status,
      'message', 'Partner must have an active Partner CRM subscription ($49/month) to receive commission payouts'
    );
  END IF;

  SELECT
    SUM(commission_cents),
    COUNT(*)
  INTO v_total_amount, v_commission_count
  FROM public.commissions
  WHERE id = ANY(p_commission_ids)
  AND status = 'approved';

  UPDATE public.commissions
  SET
    status = 'paid',
    updated_at = now()
  WHERE id = ANY(p_commission_ids)
  AND status = 'approved';

  RETURN jsonb_build_object(
    'success', true,
    'partner_id', v_partner_id,
    'amount_cents', v_total_amount,
    'commission_count', v_commission_count,
    'payout_method', p_payout_method,
    'transaction_id', p_transaction_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_partner_payout_eligibility TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_eligible_partners_for_payout TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_partner_commission_payout TO authenticated;
