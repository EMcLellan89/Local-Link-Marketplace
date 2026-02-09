/*
  # Add StoryLab Orders and Statements System

  1. Order Extensions
    - Add business_key, item_key, vertical_key to orders table
    - Add partner tracking fields
    
  2. Partner Statements
    - Monthly commission statements per business
    - Tracks gross, deductions, net payouts
    - PDF generation support
    
  3. Contact Suppressions
    - STOP compliance for SMS
    - Bounce handling for email
    
  4. Stripe Idempotency
    - Prevent duplicate webhook processing
*/

-- ============ ORDER EXTENSIONS ============
DO $$
BEGIN
  -- Add columns if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'business_key'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN business_key text NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'item_key'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN item_key text NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'vertical_key'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN vertical_key text NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'stripe_checkout_session_id'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN stripe_checkout_session_id text NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'partner_id'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN partner_id uuid NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS orders_business_idx ON public.orders(business_key);
CREATE INDEX IF NOT EXISTS orders_partner_idx ON public.orders(partner_id);
CREATE INDEX IF NOT EXISTS orders_stripe_session_idx ON public.orders(stripe_checkout_session_id);

-- ============ MONTHLY STATEMENTS ============
CREATE TABLE IF NOT EXISTS public.partner_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL,
  business_key text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  gross_cents bigint NOT NULL DEFAULT 0,
  refunds_cents bigint NOT NULL DEFAULT 0,
  net_cents bigint NOT NULL DEFAULT 0,
  commission_cents bigint NOT NULL DEFAULT 0,
  bonus_cents bigint NOT NULL DEFAULT 0,
  deductions_cents bigint NOT NULL DEFAULT 0,
  payout_cents bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','paid')),
  pdf_asset_id uuid NULL,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (partner_id, business_key, period_start, period_end)
);

CREATE INDEX IF NOT EXISTS partner_statements_partner_idx ON public.partner_statements(partner_id);
CREATE INDEX IF NOT EXISTS partner_statements_business_idx ON public.partner_statements(business_key);
CREATE INDEX IF NOT EXISTS partner_statements_period_idx ON public.partner_statements(period_start, period_end);

ALTER TABLE public.partner_statements ENABLE ROW LEVEL SECURITY;

-- Partners can view their own statements
DROP POLICY IF EXISTS partner_statements_own ON public.partner_statements;
CREATE POLICY partner_statements_own ON public.partner_statements
  FOR SELECT
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE id = auth.uid()
    )
  );

-- ============ CONTACT SUPPRESSIONS ============
CREATE TABLE IF NOT EXISTS public.contact_suppressions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel text NOT NULL CHECK (channel IN ('sms','email')),
  address text NOT NULL,
  reason text NOT NULL DEFAULT 'user_opt_out',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (channel, address)
);

CREATE INDEX IF NOT EXISTS contact_suppressions_lookup_idx ON public.contact_suppressions(channel, address);

ALTER TABLE public.contact_suppressions ENABLE ROW LEVEL SECURITY;

-- Admins can manage suppressions
DROP POLICY IF EXISTS contact_suppressions_admin ON public.contact_suppressions;
CREATE POLICY contact_suppressions_admin ON public.contact_suppressions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- ============ STRIPE WEBHOOK IDEMPOTENCY ============
CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  id text PRIMARY KEY,
  event_type text NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now(),
  meta jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS stripe_webhook_events_type_idx ON public.stripe_webhook_events(event_type);
CREATE INDEX IF NOT EXISTS stripe_webhook_events_processed_idx ON public.stripe_webhook_events(processed_at);

-- No RLS needed - API only

-- Comments
COMMENT ON TABLE public.partner_statements IS 'Monthly commission statements for partners per business. Includes all deductions and net payouts.';
COMMENT ON TABLE public.contact_suppressions IS 'STOP list for SMS and bounce list for email. Prevents sending to opted-out contacts.';
COMMENT ON TABLE public.stripe_webhook_events IS 'Idempotency tracking for Stripe webhooks. Prevents duplicate processing.';
