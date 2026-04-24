/*
  # Partner Analytics System

  ## Summary
  Creates the full partner performance tracking infrastructure:
  monthly stats snapshots, per-event link tracking, commission ledger,
  and payout records.

  ## New Tables

  ### partner_dashboard_stats
  - Monthly rollup of clicks / leads / sales / revenue / commissions
  - Unique per (partner_id, month)

  ### partner_link_events
  - Individual click / lead / sale / refund events per partner slug + product

  ### partner_commissions
  - Line-item commission ledger with type, rate, amount, status, and payable_at
  - Replaces scattered commission tracking; typed by CommissionEventType

  ### partner_payouts
  - Payout batches: amount, method, period, status, paid_at

  ## Security
  - RLS on all tables
  - Partners read/write their own rows only
  - Service role has full access for backend writes
*/

-- ── partner_dashboard_stats ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partner_dashboard_stats (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id            uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  month                 date NOT NULL,
  clicks                integer NOT NULL DEFAULT 0,
  leads                 integer NOT NULL DEFAULT 0,
  sales                 integer NOT NULL DEFAULT 0,
  gross_revenue         numeric(12,2) NOT NULL DEFAULT 0,
  commission_earned     numeric(12,2) NOT NULL DEFAULT 0,
  pending_commission    numeric(12,2) NOT NULL DEFAULT 0,
  paid_commission       numeric(12,2) NOT NULL DEFAULT 0,
  active_subscriptions  integer NOT NULL DEFAULT 0,
  conversion_rate       numeric(6,4) NOT NULL DEFAULT 0,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE(partner_id, month)
);

CREATE INDEX IF NOT EXISTS partner_dashboard_stats_partner_id_idx ON partner_dashboard_stats(partner_id);
CREATE INDEX IF NOT EXISTS partner_dashboard_stats_month_idx ON partner_dashboard_stats(month);

ALTER TABLE partner_dashboard_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners read own dashboard stats"
  ON partner_dashboard_stats FOR SELECT
  TO authenticated
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Service role manages dashboard stats"
  ON partner_dashboard_stats FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── partner_link_events ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partner_link_events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id    uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  partner_slug  text NOT NULL,
  product_code  text,
  landing_page  text,
  event_type    text NOT NULL CHECK (event_type IN ('click','lead','checkout_started','sale','refund')),
  session_id    text,
  ip_hash       text,
  user_agent    text,
  metadata      jsonb DEFAULT '{}',
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS partner_link_events_partner_id_idx ON partner_link_events(partner_id);
CREATE INDEX IF NOT EXISTS partner_link_events_partner_slug_idx ON partner_link_events(partner_slug);
CREATE INDEX IF NOT EXISTS partner_link_events_event_type_idx ON partner_link_events(event_type);
CREATE INDEX IF NOT EXISTS partner_link_events_created_at_idx ON partner_link_events(created_at);

ALTER TABLE partner_link_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners read own link events"
  ON partner_link_events FOR SELECT
  TO authenticated
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Service role manages link events"
  ON partner_link_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── partner_commissions ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partner_commissions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id        uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  source_partner_id uuid REFERENCES partners(id),
  transaction_id    uuid,
  product_code      text NOT NULL,
  commission_type   text NOT NULL CHECK (commission_type IN (
                      'merchant_membership_first_month',
                      'marketplace_product',
                      'onehub_crm_cpa',
                      'partner_recruit_bonus',
                      'recruit_override'
                    )),
  sale_amount       numeric(12,2) NOT NULL DEFAULT 0,
  commission_rate   numeric(6,4) NOT NULL DEFAULT 0,
  commission_amount numeric(12,2) NOT NULL DEFAULT 0,
  recurring         boolean NOT NULL DEFAULT false,
  status            text NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','approved','paid','withheld','reversed')),
  notes             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  payable_at        timestamptz,
  paid_at           timestamptz
);

CREATE INDEX IF NOT EXISTS partner_commissions_partner_id_idx ON partner_commissions(partner_id);
CREATE INDEX IF NOT EXISTS partner_commissions_status_idx ON partner_commissions(status);
CREATE INDEX IF NOT EXISTS partner_commissions_commission_type_idx ON partner_commissions(commission_type);
CREATE INDEX IF NOT EXISTS partner_commissions_created_at_idx ON partner_commissions(created_at);
CREATE INDEX IF NOT EXISTS partner_commissions_payable_at_idx ON partner_commissions(payable_at);

ALTER TABLE partner_commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners read own commissions"
  ON partner_commissions FOR SELECT
  TO authenticated
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Service role manages commissions"
  ON partner_commissions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── partner_payouts ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partner_payouts (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id           uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  payout_amount        numeric(12,2) NOT NULL DEFAULT 0,
  payout_method        text DEFAULT 'stripe',
  stripe_transfer_id   text,
  status               text NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending','processing','paid','failed','cancelled')),
  payout_period_start  date,
  payout_period_end    date,
  notes                text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  paid_at              timestamptz
);

CREATE INDEX IF NOT EXISTS partner_payouts_partner_id_idx ON partner_payouts(partner_id);
CREATE INDEX IF NOT EXISTS partner_payouts_status_idx ON partner_payouts(status);
CREATE INDEX IF NOT EXISTS partner_payouts_created_at_idx ON partner_payouts(created_at);

ALTER TABLE partner_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners read own payouts"
  ON partner_payouts FOR SELECT
  TO authenticated
  USING (partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Service role manages payouts"
  ON partner_payouts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
