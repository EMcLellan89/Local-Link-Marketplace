/*
  # Deploy Winner For Me - Campaign System

  1. New Tables
    - `partner_campaigns`
      - Tracks deployed winning creatives as active campaigns
      - Enforces $20/day minimum budget
      - Tracks 8-week funded period and payback schedule
      - Campaign status: active, paused, stopped
    - `partner_ledger`
      - Double-entry ledger for all partner financial transactions
      - Types: ad_spend, payback_deduction, commission_earned, payout
      - Links to campaigns for spend tracking

  2. Helper Functions
    - `week_start_utc(date)` - Calculate start of ISO week

  3. Views
    - `partner_weekly_ledger_summary` - Aggregated weekly financial summary

  4. Security
    - Enable RLS on both tables
    - Partners can view/manage own campaigns
    - Partners can view own ledger entries
    - Admins have full access

  5. Indexes
    - Foreign keys indexed for performance
    - Query patterns optimized
*/

-- =====================================================
-- Helper function: Calculate week start (ISO week)
-- =====================================================
CREATE OR REPLACE FUNCTION week_start_utc(d date)
RETURNS date
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT (d - ((EXTRACT(DOW FROM d)::int + 6) % 7) * interval '1 day')::date;
$$;

-- =====================================================
-- Table: partner_campaigns
-- =====================================================
CREATE TABLE IF NOT EXISTS partner_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  creative_id uuid NOT NULL REFERENCES ad_creatives(id) ON DELETE RESTRICT,

  -- Campaign configuration
  business_key text NOT NULL DEFAULT 'storylab_kids',
  vertical_key text NOT NULL DEFAULT 'kids',
  daily_budget_cents bigint NOT NULL DEFAULT 2000, -- $20 minimum
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'stopped')),

  -- Funding & payback tracking
  deployed_at timestamptz NOT NULL DEFAULT now(),
  funded_until_week int NOT NULL, -- Week number when funding ends (8 weeks from start)
  total_funded_cents bigint NOT NULL DEFAULT 0, -- Total platform funding provided
  total_ad_spend_cents bigint NOT NULL DEFAULT 0, -- Actual ad spend to date
  payback_balance_cents bigint NOT NULL DEFAULT 0, -- Amount partner still owes
  payback_per_week_cents bigint NOT NULL DEFAULT 5000, -- $50/week starting week 9

  -- Metadata
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT min_daily_budget CHECK (daily_budget_cents >= 2000)
);

-- =====================================================
-- Table: partner_ledger
-- =====================================================
CREATE TABLE IF NOT EXISTS partner_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  campaign_id uuid REFERENCES partner_campaigns(id) ON DELETE SET NULL,

  -- Transaction details
  entry_type text NOT NULL CHECK (entry_type IN ('ad_spend', 'payback_deduction', 'commission_earned', 'payout', 'adjustment')),
  amount_cents bigint NOT NULL, -- Positive for earnings, negative for deductions
  balance_after_cents bigint NOT NULL, -- Running balance after this entry

  -- Week tracking (for payback schedule)
  week_start_date date NOT NULL,
  week_number int NOT NULL, -- Weeks since campaign deployment

  -- Context
  description text NOT NULL DEFAULT '',
  meta jsonb DEFAULT '{}'::jsonb,

  created_at timestamptz NOT NULL DEFAULT now()
);

-- =====================================================
-- View: partner_weekly_ledger_summary
-- =====================================================
CREATE OR REPLACE VIEW partner_weekly_ledger_summary AS
SELECT
  partner_id,
  week_start_date,
  week_number,
  SUM(CASE WHEN entry_type = 'ad_spend' THEN amount_cents ELSE 0 END) as total_ad_spend_cents,
  SUM(CASE WHEN entry_type = 'payback_deduction' THEN ABS(amount_cents) ELSE 0 END) as total_payback_cents,
  SUM(CASE WHEN entry_type = 'commission_earned' THEN amount_cents ELSE 0 END) as total_commissions_cents,
  SUM(CASE WHEN entry_type = 'payout' THEN amount_cents ELSE 0 END) as total_payouts_cents,
  SUM(amount_cents) as net_week_cents,
  COUNT(*) as entry_count,
  MAX(balance_after_cents) as ending_balance_cents
FROM partner_ledger
GROUP BY partner_id, week_start_date, week_number;

-- =====================================================
-- Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_partner_campaigns_partner_id ON partner_campaigns(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_campaigns_creative_id ON partner_campaigns(creative_id);
CREATE INDEX IF NOT EXISTS idx_partner_campaigns_status ON partner_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_partner_campaigns_deployed_at ON partner_campaigns(deployed_at);

CREATE INDEX IF NOT EXISTS idx_partner_ledger_partner_id ON partner_ledger(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_ledger_campaign_id ON partner_ledger(campaign_id);
CREATE INDEX IF NOT EXISTS idx_partner_ledger_week_start ON partner_ledger(week_start_date);
CREATE INDEX IF NOT EXISTS idx_partner_ledger_entry_type ON partner_ledger(entry_type);
CREATE INDEX IF NOT EXISTS idx_partner_ledger_created_at ON partner_ledger(created_at DESC);

-- =====================================================
-- RLS Policies
-- =====================================================

-- partner_campaigns
ALTER TABLE partner_campaigns ENABLE ROW LEVEL SECURITY;

-- Partners can view their own campaigns
CREATE POLICY "Partners can view own campaigns"
  ON partner_campaigns FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

-- Partners can insert their own campaigns
CREATE POLICY "Partners can create own campaigns"
  ON partner_campaigns FOR INSERT
  TO authenticated
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

-- Partners can update their own campaigns
CREATE POLICY "Partners can update own campaigns"
  ON partner_campaigns FOR UPDATE
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

-- Admins have full access to campaigns
CREATE POLICY "Admins have full access to campaigns"
  ON partner_campaigns FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- partner_ledger
ALTER TABLE partner_ledger ENABLE ROW LEVEL SECURITY;

-- Partners can view their own ledger entries
CREATE POLICY "Partners can view own ledger"
  ON partner_ledger FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

-- Only admin can insert ledger entries (system uses service role)
CREATE POLICY "Admins can insert ledger entries"
  ON partner_ledger FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins have full access to ledger
CREATE POLICY "Admins have full access to ledger"
  ON partner_ledger FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
