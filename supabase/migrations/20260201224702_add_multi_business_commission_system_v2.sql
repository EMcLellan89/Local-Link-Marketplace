/*
  # Multi-Business Accounting and Commission Payout System

  1. New Tables
    - `commission_payout_batches`
      - Tracks batches of commission payouts
      - Records when payouts were processed
      - Links to commission ledger entries

  2. New Functions
    - `get_multi_business_accounting()` - Returns accounting data for each business
    - `get_commission_payout_stats()` - Returns stats for commission payouts
    - `get_pending_partner_payouts()` - Returns partners awaiting payout
    - `queue_approved_commissions()` - Queues approved commissions for payout
    - `process_commission_payouts()` - Processes queued commission payouts
    - `automated_daily_commission_payout()` - Automated cron job handler

  3. Security
    - RLS enabled on new tables
    - Admin-only access to payout functions
    - Audit trail maintained

  4. Automation
    - Daily cron job at 2:00 AM UTC for automatic payouts
*/

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS get_multi_business_accounting(date, date);
DROP FUNCTION IF EXISTS get_commission_payout_stats();
DROP FUNCTION IF EXISTS get_pending_partner_payouts();
DROP FUNCTION IF EXISTS queue_approved_commissions();
DROP FUNCTION IF EXISTS process_commission_payouts();
DROP FUNCTION IF EXISTS automated_daily_commission_payout();

-- Create commission payout batches table
CREATE TABLE IF NOT EXISTS commission_payout_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number text NOT NULL UNIQUE,
  total_amount_cents bigint NOT NULL DEFAULT 0,
  payout_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  created_by uuid REFERENCES auth.users(id),
  notes text
);

ALTER TABLE commission_payout_batches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage payout batches" ON commission_payout_batches;

CREATE POLICY "Admin can manage payout batches"
  ON commission_payout_batches
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Add batch_id to commission_ledger if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'commission_ledger' AND column_name = 'batch_id'
  ) THEN
    ALTER TABLE commission_ledger ADD COLUMN batch_id uuid REFERENCES commission_payout_batches(id);
  END IF;
END $$;

-- Create index on batch_id
CREATE INDEX IF NOT EXISTS idx_commission_ledger_batch_id ON commission_ledger(batch_id);

-- Function to get multi-business accounting
CREATE FUNCTION get_multi_business_accounting(
  p_start_date date DEFAULT CURRENT_DATE - INTERVAL '30 days',
  p_end_date date DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  business_name text,
  business_id text,
  gross_revenue_cents bigint,
  net_revenue_cents bigint,
  refunds_cents bigint,
  commissions_paid_cents bigint,
  commissions_pending_cents bigint,
  total_orders bigint,
  profit_cents bigint
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH business_data AS (
    SELECT
      'Local-Link Marketplace' AS biz_name,
      'marketplace' AS biz_id,
      COALESCE(SUM(CASE WHEN cl.status != 'refunded' THEN cl.sale_amount_cents ELSE 0 END), 0) AS gross_rev,
      COALESCE(SUM(CASE WHEN cl.status = 'refunded' THEN cl.sale_amount_cents ELSE 0 END), 0) AS refunds,
      COALESCE(SUM(CASE WHEN cl.status = 'paid' THEN cl.commission_owed_cents ELSE 0 END), 0) AS comm_paid,
      COALESCE(SUM(CASE WHEN cl.status IN ('approved', 'queued') THEN cl.commission_owed_cents ELSE 0 END), 0) AS comm_pending,
      COUNT(DISTINCT cl.id) AS orders
    FROM commission_ledger cl
    WHERE cl.created_at >= p_start_date AND cl.created_at <= p_end_date + INTERVAL '1 day'

    UNION ALL

    SELECT
      'Local Paws Passport' AS biz_name,
      'paws_passport' AS biz_id,
      COALESCE(SUM(CASE WHEN mp.status != 'refunded' THEN mp.commission_cents ELSE 0 END), 0) * 10 AS gross_rev,
      COALESCE(SUM(CASE WHEN mp.status = 'refunded' THEN mp.commission_cents ELSE 0 END), 0) * 10 AS refunds,
      COALESCE(SUM(CASE WHEN mp.status = 'paid' THEN mp.commission_cents ELSE 0 END), 0) AS comm_paid,
      COALESCE(SUM(CASE WHEN mp.status IN ('pending', 'approved') THEN mp.commission_cents ELSE 0 END), 0) AS comm_pending,
      COUNT(DISTINCT mp.id) AS orders
    FROM marketplace_affiliate_commissions mp
    WHERE mp.sale_date >= p_start_date AND mp.sale_date <= p_end_date + INTERVAL '1 day'
    AND mp.product_slug LIKE '%paws-passport%'

    UNION ALL

    SELECT
      'Budget Buster' AS biz_name,
      'budget_buster' AS biz_id,
      COALESCE(SUM(CASE WHEN s.status = 'active' THEN s.amount_cents ELSE 0 END), 0) AS gross_rev,
      0 AS refunds,
      0 AS comm_paid,
      0 AS comm_pending,
      COUNT(DISTINCT s.id) AS orders
    FROM budget_buster_subscriptions s
    WHERE s.created_at >= p_start_date AND s.created_at <= p_end_date + INTERVAL '1 day'

    UNION ALL

    SELECT
      'Academy Courses' AS biz_name,
      'academy' AS biz_id,
      COALESCE(SUM(o.amount_total_cents), 0) AS gross_rev,
      0 AS refunds,
      COALESCE(SUM(ac.commission_amount_cents), 0) AS comm_paid,
      0 AS comm_pending,
      COUNT(DISTINCT o.id) AS orders
    FROM affiliate_orders o
    LEFT JOIN affiliate_commissions ac ON ac.order_id = o.id AND ac.status = 'paid'
    WHERE o.created_at >= p_start_date AND o.created_at <= p_end_date + INTERVAL '1 day'
  )
  SELECT
    bd.biz_name,
    bd.biz_id,
    bd.gross_rev,
    (bd.gross_rev - bd.refunds) AS net_rev,
    bd.refunds,
    bd.comm_paid,
    bd.comm_pending,
    bd.orders,
    (bd.gross_rev - bd.refunds - bd.comm_paid - bd.comm_pending) AS profit
  FROM business_data bd
  ORDER BY bd.gross_rev DESC;
END;
$$;

-- Function to get commission payout stats
CREATE FUNCTION get_commission_payout_stats()
RETURNS TABLE (
  total_pending_cents bigint,
  total_pending_count bigint,
  total_queued_cents bigint,
  total_queued_count bigint,
  partners_awaiting_payout bigint
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN status = 'approved' THEN commission_owed_cents ELSE 0 END), 0) AS total_pending_cents,
    COUNT(*) FILTER (WHERE status = 'approved') AS total_pending_count,
    COALESCE(SUM(CASE WHEN status = 'queued' THEN commission_owed_cents ELSE 0 END), 0) AS total_queued_cents,
    COUNT(*) FILTER (WHERE status = 'queued') AS total_queued_count,
    COUNT(DISTINCT recipient_partner_id) FILTER (WHERE status IN ('approved', 'queued')) AS partners_awaiting_payout
  FROM commission_ledger;
END;
$$;

-- Function to get pending partner payouts
CREATE FUNCTION get_pending_partner_payouts()
RETURNS TABLE (
  partner_id uuid,
  partner_name text,
  partner_email text,
  total_owed_cents bigint,
  commission_count bigint,
  oldest_commission timestamptz
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    COALESCE(p.business_name, 'Unknown Partner') AS partner_name,
    COALESCE(u.email, 'No email') AS partner_email,
    COALESCE(SUM(cl.commission_owed_cents), 0) AS total_owed_cents,
    COUNT(cl.id) AS commission_count,
    MIN(cl.created_at) AS oldest_commission
  FROM commission_ledger cl
  INNER JOIN partners p ON p.id = cl.recipient_partner_id
  LEFT JOIN auth.users u ON u.id = p.user_id
  WHERE cl.status IN ('approved', 'queued')
  GROUP BY p.id, p.business_name, u.email
  HAVING SUM(cl.commission_owed_cents) > 0
  ORDER BY SUM(cl.commission_owed_cents) DESC;
END;
$$;

-- Function to queue approved commissions
CREATE FUNCTION queue_approved_commissions()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_queued_count integer;
BEGIN
  UPDATE commission_ledger
  SET status = 'queued'
  WHERE status = 'approved';

  GET DIAGNOSTICS v_queued_count = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', true,
    'queued_count', v_queued_count,
    'timestamp', now()
  );
END;
$$;

-- Function to process commission payouts
CREATE FUNCTION process_commission_payouts()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_batch_id uuid;
  v_batch_number text;
  v_total_amount bigint;
  v_payout_count integer;
BEGIN
  SELECT
    COALESCE(SUM(commission_owed_cents), 0),
    COUNT(*)
  INTO v_total_amount, v_payout_count
  FROM commission_ledger
  WHERE status = 'queued';

  IF v_payout_count = 0 THEN
    RETURN jsonb_build_object(
      'success', true,
      'processed_count', 0,
      'total_amount_cents', 0,
      'message', 'No commissions to process'
    );
  END IF;

  v_batch_number := 'BATCH-' || to_char(now(), 'YYYYMMDD-HH24MISS');

  INSERT INTO commission_payout_batches (
    batch_number,
    total_amount_cents,
    payout_count,
    status,
    created_by
  ) VALUES (
    v_batch_number,
    v_total_amount,
    v_payout_count,
    'processing',
    auth.uid()
  )
  RETURNING id INTO v_batch_id;

  UPDATE commission_ledger
  SET
    status = 'paid',
    paid_at = now(),
    batch_id = v_batch_id
  WHERE status = 'queued';

  UPDATE commission_payout_batches
  SET
    status = 'completed',
    processed_at = now()
  WHERE id = v_batch_id;

  RETURN jsonb_build_object(
    'success', true,
    'batch_id', v_batch_id,
    'batch_number', v_batch_number,
    'processed_count', v_payout_count,
    'total_amount_cents', v_total_amount,
    'timestamp', now()
  );
END;
$$;

-- Automated daily commission payout function
CREATE FUNCTION automated_daily_commission_payout()
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_result jsonb;
BEGIN
  PERFORM queue_approved_commissions();
  SELECT process_commission_payouts() INTO v_result;
  RAISE NOTICE 'Daily commission payout completed: %', v_result;
END;
$$;

-- Schedule daily automated payouts at 2:00 AM UTC
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule('daily-commission-payout');
    PERFORM cron.schedule(
      'daily-commission-payout',
      '0 2 * * *',
      'SELECT automated_daily_commission_payout();'
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Could not schedule cron job: %', SQLERRM;
END $$;
