/*
  # Update Partner Commission Structure

  ## Summary
  Formalizes the new 4-tier partner commission structure and event-type tracking.

  ## Changes

  ### 1. partner_tiers table
  - Updates existing rows to match new pricing: starter ($49, 10%), growth ($99, 15%), pro ($149, 20%), enterprise ($299, 25%)
  - Adds missing columns (monthly_fee_cents, annual_fee_cents, max_territories) if not present

  ### 2. commission_events table (new)
  - Tracks every commission payout event with typed event categories
  - event_type: partner_recruit_bonus | merchant_membership_first_month | marketplace_product | onehub_crm_cpa | recruit_override

  ### 3. commission_timing_rules table (new)
  - Per-event-type hold/refund window configuration
*/

-- ── 1. Ensure partner_tiers has needed columns ─────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_tiers' AND column_name = 'monthly_fee_cents') THEN
    ALTER TABLE partner_tiers ADD COLUMN monthly_fee_cents integer NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_tiers' AND column_name = 'annual_fee_cents') THEN
    ALTER TABLE partner_tiers ADD COLUMN annual_fee_cents integer NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_tiers' AND column_name = 'max_territories') THEN
    ALTER TABLE partner_tiers ADD COLUMN max_territories integer;
  END IF;
END $$;

-- Upsert tiers using the real PK column (key)
INSERT INTO partner_tiers (key, name, monthly_cost_usd, commission_rate_bps, monthly_fee_cents, annual_fee_cents, max_territories, white_label_enabled, features)
VALUES
  ('starter',    'Starter',    49,  1000, 4900,  52920, 1,    false, '{"crm_contacts":500,"territories":1,"commission_rate":"10%"}'),
  ('growth',     'Growth',     99,  1500, 9900,  106920, 2,   false, '{"crm_contacts":2000,"territories":2,"commission_rate":"15%"}'),
  ('pro',        'Pro',       149,  2000, 14900, 160920, 3,   false, '{"crm_contacts":10000,"territories":3,"commission_rate":"20%"}'),
  ('enterprise', 'Enterprise',299,  2500, 29900, 322920, NULL, true, '{"crm_contacts":-1,"territories":-1,"commission_rate":"25%","white_label":true}')
ON CONFLICT (key) DO UPDATE
  SET
    name               = EXCLUDED.name,
    monthly_cost_usd   = EXCLUDED.monthly_cost_usd,
    commission_rate_bps= EXCLUDED.commission_rate_bps,
    monthly_fee_cents  = EXCLUDED.monthly_fee_cents,
    annual_fee_cents   = EXCLUDED.annual_fee_cents,
    max_territories    = EXCLUDED.max_territories,
    white_label_enabled= EXCLUDED.white_label_enabled,
    features           = EXCLUDED.features;

-- ── 2. commission_events table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS commission_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id      uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  event_type      text NOT NULL CHECK (event_type IN (
                    'partner_recruit_bonus',
                    'merchant_membership_first_month',
                    'marketplace_product',
                    'onehub_crm_cpa',
                    'recruit_override'
                  )),
  amount_cents    integer NOT NULL DEFAULT 0,
  source_id       text,
  source_type     text,
  metadata        jsonb DEFAULT '{}',
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','paid','withheld','reversed')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  approved_at     timestamptz,
  paid_at         timestamptz
);

CREATE INDEX IF NOT EXISTS commission_events_partner_id_idx ON commission_events(partner_id);
CREATE INDEX IF NOT EXISTS commission_events_event_type_idx ON commission_events(event_type);
CREATE INDEX IF NOT EXISTS commission_events_status_idx ON commission_events(status);
CREATE INDEX IF NOT EXISTS commission_events_created_at_idx ON commission_events(created_at);

ALTER TABLE commission_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own commission events"
  ON commission_events FOR SELECT
  TO authenticated
  USING (partner_id IN (
    SELECT id FROM partners WHERE user_id = (SELECT auth.uid())
  ));

CREATE POLICY "Service role can manage commission events"
  ON commission_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── 3. commission_timing_rules table ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS commission_timing_rules (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type            text NOT NULL UNIQUE CHECK (event_type IN (
                          'partner_recruit_bonus',
                          'merchant_membership_first_month',
                          'marketplace_product',
                          'onehub_crm_cpa',
                          'recruit_override'
                        )),
  hold_days             integer NOT NULL DEFAULT 0,
  refund_window_days    integer NOT NULL DEFAULT 30,
  is_recurring          boolean NOT NULL DEFAULT false,
  description           text,
  created_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE commission_timing_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read timing rules"
  ON commission_timing_rules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage timing rules"
  ON commission_timing_rules FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

INSERT INTO commission_timing_rules (event_type, hold_days, refund_window_days, is_recurring, description)
VALUES
  ('partner_recruit_bonus',             30, 30,  false, 'One-time bonus when a new partner signs up under you. Held 30 days for refund window.'),
  ('merchant_membership_first_month',   30, 30,  false, 'First-month merchant plan commission only. Not recurring.'),
  ('marketplace_product',               14, 14,  true,  'Product/course/service sales through the marketplace. Recurring for subscriptions.'),
  ('onehub_crm_cpa',                     0,  0,  true,  '30% recurring monthly — no hold once initial refund window clears.'),
  ('recruit_override',                   0,  0,  true,  '7% on direct recruit commissionable sales. Paid same cycle as base commission.')
ON CONFLICT (event_type) DO UPDATE
  SET
    hold_days          = EXCLUDED.hold_days,
    refund_window_days = EXCLUDED.refund_window_days,
    is_recurring       = EXCLUDED.is_recurring,
    description        = EXCLUDED.description;
