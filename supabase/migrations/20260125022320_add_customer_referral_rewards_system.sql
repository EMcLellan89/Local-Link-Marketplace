/*
  # Customer Referral Rewards System

  1. New Tables
    - `customer_rewards_ledger`
      - Tracks all earned and redeemed rewards for customers
      - Links to merchant org and customer
      - Includes amount_cents, reason, source jsonb, and status
    - `customer_reward_rules`
      - Merchant-configurable reward rules
      - Defines reward type, amount, and trigger conditions
    - `reward_redemptions`
      - Audit trail for all reward redemptions
      - Tracks method (manual, coupon, invoice_credit) and notes

  2. Functions
    - `rpc_rewards_get_balance` - Calculate earned/redeemed/balance for customer
    - `rpc_rewards_redeem` - Redeem rewards with FIFO logic and audit trail

  3. Security
    - Enable RLS on all tables
    - Authenticated users can access their org's data
    - Admin can manage all rewards
*/

-- Customer rewards ledger
CREATE TABLE IF NOT EXISTS customer_rewards_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  amount_cents int NOT NULL DEFAULT 0,
  reason text NOT NULL,
  source jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'earned' CHECK (status IN ('earned','redeemed','void')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rewards_ledger_org_customer ON customer_rewards_ledger(merchant_org_id, customer_id);
CREATE INDEX IF NOT EXISTS idx_rewards_ledger_status ON customer_rewards_ledger(merchant_org_id, status);

ALTER TABLE customer_rewards_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchant can view own org rewards"
  ON customer_rewards_ledger FOR SELECT
  TO authenticated
  USING (
    merchant_org_id IN (
      SELECT org_id FROM org_members WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Merchant can insert rewards"
  ON customer_rewards_ledger FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_org_id IN (
      SELECT org_id FROM org_members WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Merchant can update rewards"
  ON customer_rewards_ledger FOR UPDATE
  TO authenticated
  USING (
    merchant_org_id IN (
      SELECT org_id FROM org_members WHERE profile_id = auth.uid()
    )
  );

-- Customer reward rules (merchant-configurable)
CREATE TABLE IF NOT EXISTS customer_reward_rules (
  merchant_org_id uuid PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  reward_type text NOT NULL DEFAULT 'credit',
  reward_amount_cents int NOT NULL DEFAULT 2500,
  trigger text NOT NULL DEFAULT 'invoice_paid',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE customer_reward_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchant can view own reward rules"
  ON customer_reward_rules FOR SELECT
  TO authenticated
  USING (
    merchant_org_id IN (
      SELECT org_id FROM org_members WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Merchant can manage reward rules"
  ON customer_reward_rules FOR ALL
  TO authenticated
  USING (
    merchant_org_id IN (
      SELECT org_id FROM org_members WHERE profile_id = auth.uid()
    )
  );

-- Reward redemptions (audit trail)
CREATE TABLE IF NOT EXISTS reward_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  amount_cents int NOT NULL,
  method text NOT NULL DEFAULT 'manual' CHECK (method IN ('manual','coupon','invoice_credit')),
  note text NULL,
  created_by_user_id uuid NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_redemptions_org_customer ON reward_redemptions(merchant_org_id, customer_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_created_at ON reward_redemptions(merchant_org_id, created_at DESC);

ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchant can view own redemptions"
  ON reward_redemptions FOR SELECT
  TO authenticated
  USING (
    merchant_org_id IN (
      SELECT org_id FROM org_members WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Merchant can insert redemptions"
  ON reward_redemptions FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_org_id IN (
      SELECT org_id FROM org_members WHERE profile_id = auth.uid()
    )
  );

-- RPC: Get rewards balance for a customer
CREATE OR REPLACE FUNCTION rpc_rewards_get_balance(p_org_id uuid, p_customer_id uuid)
RETURNS TABLE(earned_cents int, redeemed_cents int, balance_cents int)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH earned AS (
    SELECT COALESCE(SUM(amount_cents),0)::int AS v
    FROM customer_rewards_ledger
    WHERE merchant_org_id = p_org_id AND customer_id = p_customer_id AND status = 'earned'
  ),
  redeemed AS (
    SELECT COALESCE(SUM(amount_cents),0)::int AS v
    FROM customer_rewards_ledger
    WHERE merchant_org_id = p_org_id AND customer_id = p_customer_id AND status = 'redeemed'
  )
  SELECT earned.v AS earned_cents, redeemed.v AS redeemed_cents, (earned.v - redeemed.v)::int AS balance_cents
  FROM earned, redeemed;
$$;

-- RPC: Redeem rewards with FIFO logic
CREATE OR REPLACE FUNCTION rpc_rewards_redeem(
  p_org_id uuid,
  p_customer_id uuid,
  p_amount_cents int,
  p_method text DEFAULT 'manual',
  p_note text DEFAULT NULL,
  p_created_by uuid DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_balance int;
  v_to_redeem int;
  r record;
BEGIN
  IF p_amount_cents <= 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Amount must be > 0');
  END IF;

  SELECT balance_cents INTO v_balance
  FROM rpc_rewards_get_balance(p_org_id, p_customer_id);

  IF v_balance <= 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'No available balance');
  END IF;

  v_to_redeem := LEAST(v_balance, p_amount_cents);

  -- Mark ledger entries as redeemed until we reach v_to_redeem (FIFO by created_at)
  FOR r IN
    SELECT id, amount_cents
    FROM customer_rewards_ledger
    WHERE merchant_org_id = p_org_id AND customer_id = p_customer_id AND status = 'earned'
    ORDER BY created_at ASC
  LOOP
    EXIT WHEN v_to_redeem <= 0;

    -- Flip whole entry if it fits; if not, split the row
    IF r.amount_cents <= v_to_redeem THEN
      UPDATE customer_rewards_ledger SET status='redeemed'
      WHERE id = r.id;

      v_to_redeem := v_to_redeem - r.amount_cents;
    ELSE
      -- Split: reduce earned row, add redeemed row
      UPDATE customer_rewards_ledger
      SET amount_cents = amount_cents - v_to_redeem
      WHERE id = r.id;

      INSERT INTO customer_rewards_ledger(merchant_org_id, customer_id, amount_cents, reason, source, status)
      VALUES (p_org_id, p_customer_id, v_to_redeem, 'Reward redeemed (split)', '{}'::jsonb, 'redeemed');

      v_to_redeem := 0;
    END IF;
  END LOOP;

  -- Record redemption event
  INSERT INTO reward_redemptions(merchant_org_id, customer_id, amount_cents, method, note, created_by_user_id)
  VALUES (p_org_id, p_customer_id, LEAST(v_balance, p_amount_cents), p_method, p_note, p_created_by);

  RETURN jsonb_build_object('ok', true, 'redeemed_cents', LEAST(v_balance, p_amount_cents));
END $$;

GRANT EXECUTE ON FUNCTION rpc_rewards_get_balance(uuid,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_rewards_redeem(uuid,uuid,int,text,text,uuid) TO authenticated;