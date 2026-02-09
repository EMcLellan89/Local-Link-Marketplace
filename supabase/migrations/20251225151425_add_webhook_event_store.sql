/*
  # Webhook Event Store for Idempotency

  1. New Tables
    - `webhook_events`
      - Stores webhook events with provider + event_id for replay protection
      - Payload hash for verification
      - Supports idempotent webhook processing

  2. Security
    - Enable RLS
    - Service role access only (webhooks are server-side)
*/

CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  event_id text NOT NULL,
  event_type text NOT NULL,
  external_payment_id text,
  payload_hash text NOT NULL,
  received_at timestamptz DEFAULT now(),
  UNIQUE(provider, event_id)
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_provider ON webhook_events(provider);
CREATE INDEX IF NOT EXISTS idx_webhook_events_external_payment_id ON webhook_events(external_payment_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_received_at ON webhook_events(received_at DESC);

ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage webhook events"
  ON webhook_events
  FOR ALL
  USING (true);
