-- Admin Affiliate Payout Functions
--
-- Provides RPC functions for admin to manage affiliate commissions and payouts
--
-- Functions:
--   1. approve_affiliate_commissions - Batch approve pending commissions
--   2. process_affiliate_payout - Process payment and mark commissions as paid
--   3. get_pending_commissions_by_partner - Get all pending commissions grouped by partner
--   4. cancel_affiliate_commission - Cancel/refund a commission

-- Function 1: Batch approve pending commissions
CREATE OR REPLACE FUNCTION approve_affiliate_commissions(commission_ids uuid[])
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated_count integer;
  v_total_amount integer;
BEGIN
  -- Update commissions to approved
  WITH updated AS (
    UPDATE affiliate_commissions
    SET status = 'approved'
    WHERE id = ANY(commission_ids)
      AND status = 'pending'
    RETURNING commission_cents
  )
  SELECT COUNT(*), COALESCE(SUM(commission_cents), 0)
  INTO v_updated_count, v_total_amount
  FROM updated;

  -- Update partner pending amounts
  UPDATE partners p
  SET pending_commission_cents = (
    SELECT COALESCE(SUM(commission_cents), 0)
    FROM affiliate_commissions
    WHERE partner_id = p.id AND status = 'pending'
  )
  WHERE id IN (
    SELECT DISTINCT partner_id FROM affiliate_commissions WHERE id = ANY(commission_ids)
  );

  RETURN jsonb_build_object(
    'success', true,
    'updated_count', v_updated_count,
    'total_approved_cents', v_total_amount
  );
END;
$$;

-- Function 2: Process payout and mark commissions as paid
CREATE OR REPLACE FUNCTION process_affiliate_payout(
  p_commission_ids uuid[],
  p_payout_method text,
  p_transaction_id text,
  p_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_partner_id uuid;
  v_total_amount integer;
  v_payout_id uuid;
  v_partner_record record;
BEGIN
  -- Get partner and calculate total
  SELECT DISTINCT partner_id INTO v_partner_id
  FROM affiliate_commissions
  WHERE id = ANY(p_commission_ids) AND status = 'approved';

  IF v_partner_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'No approved commissions found or multiple partners in batch'
    );
  END IF;

  -- Calculate total payout amount
  SELECT COALESCE(SUM(commission_cents), 0) INTO v_total_amount
  FROM affiliate_commissions
  WHERE id = ANY(p_commission_ids) AND status = 'approved';

  IF v_total_amount = 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'No commissions to pay out'
    );
  END IF;

  -- Get partner details
  SELECT * INTO v_partner_record
  FROM partners
  WHERE id = v_partner_id;

  -- Create payout record
  INSERT INTO affiliate_payouts (
    partner_id,
    amount_cents,
    payout_method,
    payout_details,
    status,
    processed_at,
    transaction_id,
    notes
  )
  VALUES (
    v_partner_id,
    v_total_amount,
    p_payout_method,
    v_partner_record.payout_details,
    'completed',
    now(),
    p_transaction_id,
    p_notes
  )
  RETURNING id INTO v_payout_id;

  -- Mark commissions as paid
  UPDATE affiliate_commissions
  SET status = 'paid', paid_at = now()
  WHERE id = ANY(p_commission_ids) AND status = 'approved';

  -- Update partner totals
  UPDATE partners
  SET 
    pending_commission_cents = (
      SELECT COALESCE(SUM(commission_cents), 0)
      FROM affiliate_commissions
      WHERE partner_id = v_partner_id AND status = 'pending'
    ),
    total_commission_earned = (
      SELECT COALESCE(SUM(commission_cents), 0)
      FROM affiliate_commissions
      WHERE partner_id = v_partner_id AND status = 'paid'
    )
  WHERE id = v_partner_id;

  RETURN jsonb_build_object(
    'success', true,
    'payout_id', v_payout_id,
    'partner_id', v_partner_id,
    'amount_cents', v_total_amount,
    'commission_count', array_length(p_commission_ids, 1)
  );
END;
$$;

-- Function 3: Get pending commissions grouped by partner
CREATE OR REPLACE FUNCTION get_pending_commissions_by_partner()
RETURNS TABLE (
  partner_id uuid,
  partner_name text,
  partner_email text,
  referral_code text,
  commission_rate numeric,
  total_pending_cents bigint,
  commission_count bigint,
  oldest_commission_date timestamptz,
  commission_ids uuid[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id AS partner_id,
    p.company_name AS partner_name,
    p.email AS partner_email,
    p.referral_code,
    p.commission_rate,
    COALESCE(SUM(ac.commission_cents), 0)::bigint AS total_pending_cents,
    COUNT(ac.id)::bigint AS commission_count,
    MIN(ac.created_at) AS oldest_commission_date,
    array_agg(ac.id) AS commission_ids
  FROM partners p
  INNER JOIN affiliate_commissions ac ON ac.partner_id = p.id
  WHERE ac.status = 'pending' AND p.affiliate_enabled = true
  GROUP BY p.id, p.company_name, p.email, p.referral_code, p.commission_rate
  ORDER BY total_pending_cents DESC;
END;
$$;

-- Function 4: Cancel/refund a commission
CREATE OR REPLACE FUNCTION cancel_affiliate_commission(
  p_commission_id uuid,
  p_reason text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_commission record;
BEGIN
  -- Get commission details
  SELECT * INTO v_commission
  FROM affiliate_commissions
  WHERE id = p_commission_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Commission not found'
    );
  END IF;

  -- Cannot cancel already paid commissions
  IF v_commission.status = 'paid' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Cannot cancel paid commission. Use refund process instead.'
    );
  END IF;

  -- Update commission status
  UPDATE affiliate_commissions
  SET status = 'cancelled'
  WHERE id = p_commission_id;

  -- Update partner pending total
  UPDATE partners
  SET pending_commission_cents = (
    SELECT COALESCE(SUM(commission_cents), 0)
    FROM affiliate_commissions
    WHERE partner_id = v_commission.partner_id AND status = 'pending'
  )
  WHERE id = v_commission.partner_id;

  RETURN jsonb_build_object(
    'success', true,
    'commission_id', p_commission_id,
    'cancelled_amount_cents', v_commission.commission_cents,
    'reason', p_reason
  );
END;
$$;

-- Function 5: Get commission details for a partner
CREATE OR REPLACE FUNCTION get_partner_commission_summary(p_partner_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'partner_id', p_partner_id,
    'total_commissions_cents', COALESCE(SUM(commission_cents), 0),
    'pending_cents', COALESCE(SUM(CASE WHEN status = 'pending' THEN commission_cents ELSE 0 END), 0),
    'approved_cents', COALESCE(SUM(CASE WHEN status = 'approved' THEN commission_cents ELSE 0 END), 0),
    'paid_cents', COALESCE(SUM(CASE WHEN status = 'paid' THEN commission_cents ELSE 0 END), 0),
    'cancelled_cents', COALESCE(SUM(CASE WHEN status = 'cancelled' THEN commission_cents ELSE 0 END), 0),
    'total_count', COUNT(*),
    'pending_count', COUNT(*) FILTER (WHERE status = 'pending'),
    'approved_count', COUNT(*) FILTER (WHERE status = 'approved'),
    'paid_count', COUNT(*) FILTER (WHERE status = 'paid')
  ) INTO v_result
  FROM affiliate_commissions
  WHERE partner_id = p_partner_id;

  RETURN v_result;
END;
$$;

-- Grant execute permissions to authenticated users (admin check should be done in app)
GRANT EXECUTE ON FUNCTION approve_affiliate_commissions TO authenticated;
GRANT EXECUTE ON FUNCTION process_affiliate_payout TO authenticated;
GRANT EXECUTE ON FUNCTION get_pending_commissions_by_partner TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_affiliate_commission TO authenticated;
GRANT EXECUTE ON FUNCTION get_partner_commission_summary TO authenticated;
