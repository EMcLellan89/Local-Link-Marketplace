/*
  # Webhook Idempotency + Financial Reconciliation

  ## Summary
  1. Adds stripe_event_id column to stripe_webhook_events for deduplication
  2. Creates a financial reconciliation function using actual schema
  3. Creates a commission reconciliation summary function

  ## Tables Modified
  - stripe_webhook_events: adds stripe_event_id (unique), status, error_message

  ## New Functions
  - get_financial_summary(days): aggregate revenue/commission/payout totals
  - get_commission_reconciliation(): per-partner commission accuracy check
*/

-- Add idempotency + tracking columns to stripe_webhook_events
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stripe_webhook_events' AND column_name = 'stripe_event_id'
  ) THEN
    ALTER TABLE stripe_webhook_events ADD COLUMN stripe_event_id text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stripe_webhook_events' AND column_name = 'status'
  ) THEN
    ALTER TABLE stripe_webhook_events ADD COLUMN status text DEFAULT 'processed';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stripe_webhook_events' AND column_name = 'error_message'
  ) THEN
    ALTER TABLE stripe_webhook_events ADD COLUMN error_message text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stripe_webhook_events' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE stripe_webhook_events ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Unique constraint on stripe_event_id for idempotency
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'stripe_webhook_events_stripe_event_id_key'
  ) THEN
    ALTER TABLE stripe_webhook_events
    ADD CONSTRAINT stripe_webhook_events_stripe_event_id_key UNIQUE (stripe_event_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_swe_stripe_event_id ON stripe_webhook_events(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_swe_created_at ON stripe_webhook_events(created_at);

-- Financial summary function (last N days)
CREATE OR REPLACE FUNCTION get_financial_summary(days_back integer DEFAULT 30)
RETURNS TABLE (
  total_marketplace_revenue_cents bigint,
  total_commissions_cents bigint,
  total_payouts_cents bigint,
  total_refunds_cents bigint,
  net_revenue_cents bigint,
  commission_rate_pct numeric,
  pending_payouts_cents bigint,
  marketplace_order_count bigint,
  active_merchant_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    -- Marketplace revenue
    COALESCE((
      SELECT SUM(o.total_cents)::bigint
      FROM marketplace_orders o
      WHERE o.created_at > NOW() - (days_back || ' days')::interval
    ), 0) AS total_marketplace_revenue_cents,

    -- Partner commissions generated
    COALESCE((
      SELECT SUM(c.amount_cents)::bigint
      FROM commissions c
      WHERE c.created_at > NOW() - (days_back || ' days')::interval
        AND c.status != 'reversed'
    ), 0) AS total_commissions_cents,

    -- Partner payouts executed
    COALESCE((
      SELECT SUM(p.payout_amount)::bigint
      FROM partner_payouts p
      WHERE p.created_at > NOW() - (days_back || ' days')::interval
        AND p.status = 'paid'
    ), 0) AS total_payouts_cents,

    -- Refunded marketplace orders
    COALESCE((
      SELECT SUM(o.total_cents)::bigint
      FROM marketplace_orders o
      WHERE o.created_at > NOW() - (days_back || ' days')::interval
        AND o.commission_status = 'refunded'
    ), 0) AS total_refunds_cents,

    -- Net revenue
    COALESCE((
      SELECT SUM(o.total_cents)::bigint
      FROM marketplace_orders o
      WHERE o.created_at > NOW() - (days_back || ' days')::interval
        AND o.commission_status != 'refunded'
    ), 0) -
    COALESCE((
      SELECT SUM(c.amount_cents)::bigint
      FROM commissions c
      WHERE c.created_at > NOW() - (days_back || ' days')::interval
        AND c.status != 'reversed'
    ), 0) AS net_revenue_cents,

    -- Commission as % of revenue
    CASE
      WHEN COALESCE((SELECT SUM(o.total_cents) FROM marketplace_orders o WHERE o.created_at > NOW() - (days_back || ' days')::interval), 0) > 0
      THEN ROUND(
        COALESCE((SELECT SUM(c.amount_cents) FROM commissions c WHERE c.created_at > NOW() - (days_back || ' days')::interval AND c.status != 'reversed'), 0)::numeric /
        COALESCE((SELECT SUM(o.total_cents) FROM marketplace_orders o WHERE o.created_at > NOW() - (days_back || ' days')::interval), 1)::numeric * 100,
        1
      )
      ELSE 0
    END AS commission_rate_pct,

    -- Pending payouts (what we owe partners)
    COALESCE((
      SELECT SUM(p.payout_amount)::bigint
      FROM partner_payouts p
      WHERE p.status IN ('pending', 'approved')
    ), 0) AS pending_payouts_cents,

    -- Order count
    COALESCE((
      SELECT COUNT(*)::bigint
      FROM marketplace_orders o
      WHERE o.created_at > NOW() - (days_back || ' days')::interval
    ), 0) AS marketplace_order_count,

    -- Active merchant count
    COALESCE((
      SELECT COUNT(DISTINCT ms.merchant_id)::bigint
      FROM merchant_subscriptions ms
      WHERE ms.status = 'active'
    ), 0) AS active_merchant_count;
END;
$$;

-- Per-partner commission accuracy check
CREATE OR REPLACE FUNCTION get_commission_reconciliation(days_back integer DEFAULT 30)
RETURNS TABLE (
  partner_id uuid,
  partner_name text,
  commission_count bigint,
  total_commission_cents bigint,
  paid_commission_cents bigint,
  pending_commission_cents bigint,
  reversed_commission_cents bigint,
  latest_payout_date timestamptz,
  needs_review boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS partner_id,
    pr.full_name AS partner_name,
    COUNT(c.id)::bigint AS commission_count,
    COALESCE(SUM(c.amount_cents), 0)::bigint AS total_commission_cents,
    COALESCE(SUM(CASE WHEN c.status = 'paid' THEN c.amount_cents ELSE 0 END), 0)::bigint AS paid_commission_cents,
    COALESCE(SUM(CASE WHEN c.status = 'pending' THEN c.amount_cents ELSE 0 END), 0)::bigint AS pending_commission_cents,
    COALESCE(SUM(CASE WHEN c.status = 'reversed' THEN c.amount_cents ELSE 0 END), 0)::bigint AS reversed_commission_cents,
    MAX(pp.paid_at) AS latest_payout_date,
    (
      COALESCE(SUM(CASE WHEN c.status = 'pending' THEN c.amount_cents ELSE 0 END), 0) > 50000
      OR COALESCE(SUM(CASE WHEN c.status = 'reversed' THEN c.amount_cents ELSE 0 END), 0) > 10000
    ) AS needs_review
  FROM partners p
  JOIN profiles pr ON pr.id = p.user_id
  LEFT JOIN commissions c ON c.partner_id = p.id
    AND c.created_at > NOW() - (days_back || ' days')::interval
  LEFT JOIN partner_payouts pp ON pp.partner_id = p.id
    AND pp.status = 'paid'
  GROUP BY p.id, pr.full_name
  HAVING COUNT(c.id) > 0
  ORDER BY COALESCE(SUM(CASE WHEN c.status = 'pending' THEN c.amount_cents ELSE 0 END), 0) DESC;
END;
$$;
