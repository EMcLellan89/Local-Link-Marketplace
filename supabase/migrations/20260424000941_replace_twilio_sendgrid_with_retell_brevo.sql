/*
  # Replace Twilio/SendGrid with Retell AI / Brevo Communications System

  ## Summary
  Replaces the Twilio+SendGrid communication stack with:
  - Retell AI for voice/AI phone calls
  - Brevo for email and transactional SMS

  ## New Tables
  - `comm_configurations` — per-merchant config storing Retell AI agent ID + Brevo API key
  - `comm_call_logs` — tracks Retell AI call records (replaces twilio_call_logs)
  - `comm_sms_logs` — tracks Brevo SMS records (replaces twilio_sms_logs)
  - `comm_email_logs` — tracks Brevo email records (replaces twilio_email_logs)

  ## Security
  - RLS enabled on all new tables
  - Merchants can only access their own records
*/

-- ── comm_configurations ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comm_configurations (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id      uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  is_active        boolean NOT NULL DEFAULT true,
  -- Retell AI
  retell_api_key   text,
  retell_agent_id  text,
  -- Brevo
  brevo_api_key    text,
  sender_phone     text,
  email_from_address text,
  email_from_name  text DEFAULT 'Local-Link CRM',
  -- Feature flags
  sms_enabled      boolean NOT NULL DEFAULT false,
  email_enabled    boolean NOT NULL DEFAULT false,
  voice_enabled    boolean NOT NULL DEFAULT false,
  -- Prepay balance (cents)
  balance_cents    integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (merchant_id)
);

ALTER TABLE comm_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants manage own comm config"
  ON comm_configurations FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Merchants insert own comm config"
  ON comm_configurations FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Merchants update own comm config"
  ON comm_configurations FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_comm_configurations_merchant_id ON comm_configurations(merchant_id);

-- ── comm_call_logs ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comm_call_logs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id      uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  lead_id          uuid REFERENCES crm_leads(id) ON DELETE SET NULL,
  call_id          text NOT NULL,
  direction        text NOT NULL DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
  to_number        text,
  from_number      text,
  status           text NOT NULL DEFAULT 'initiated',
  duration_seconds integer,
  agent_id         text,
  transcript       text,
  recording_url    text,
  cost_cents       integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE comm_call_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants view own call logs"
  ON comm_call_logs FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_comm_call_logs_merchant_id ON comm_call_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_comm_call_logs_call_id ON comm_call_logs(call_id);
CREATE INDEX IF NOT EXISTS idx_comm_call_logs_lead_id ON comm_call_logs(lead_id);

-- ── comm_sms_logs ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comm_sms_logs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id      uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  lead_id          uuid REFERENCES crm_leads(id) ON DELETE SET NULL,
  message_id       text NOT NULL,
  direction        text NOT NULL DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
  from_number      text,
  to_number        text,
  body             text,
  status           text NOT NULL DEFAULT 'sent',
  cost_cents       integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE comm_sms_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants view own sms logs"
  ON comm_sms_logs FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_comm_sms_logs_merchant_id ON comm_sms_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_comm_sms_logs_lead_id ON comm_sms_logs(lead_id);

-- ── comm_email_logs ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comm_email_logs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id      uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  lead_id          uuid REFERENCES crm_leads(id) ON DELETE SET NULL,
  message_id       text NOT NULL,
  from_email       text,
  to_email         text,
  subject          text,
  body_html        text,
  body_text        text,
  status           text NOT NULL DEFAULT 'sent',
  opened_at        timestamptz,
  clicked_at       timestamptz,
  cost_cents       integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE comm_email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants view own email logs"
  ON comm_email_logs FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_comm_email_logs_merchant_id ON comm_email_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_comm_email_logs_lead_id ON comm_email_logs(lead_id);

-- ── updated_at trigger helper ──────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_comm_configurations'
  ) THEN
    CREATE TRIGGER set_updated_at_comm_configurations
      BEFORE UPDATE ON comm_configurations
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_comm_call_logs'
  ) THEN
    CREATE TRIGGER set_updated_at_comm_call_logs
      BEFORE UPDATE ON comm_call_logs
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
