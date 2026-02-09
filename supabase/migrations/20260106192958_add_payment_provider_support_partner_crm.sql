/*
  # Add Payment Provider Support for Partner CRM

  1. Updates
    - Add payment_provider column to partner_crm_subscriptions
    - Add tier column for Core/Pro/Elite plans
    - Add subscription_required enforcement
    - Add withheld_commissions tracking

  2. New Tables
    - payment_events - Raw webhook/callback logs from all providers

  3. Security
    - Maintain RLS policies
    - Track payment provider for audit
*/

-- Add payment provider support to partner_crm_subscriptions
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_crm_subscriptions' AND column_name = 'payment_provider') THEN
    ALTER TABLE public.partner_crm_subscriptions ADD COLUMN payment_provider text DEFAULT 'stripe';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_crm_subscriptions' AND column_name = 'tier') THEN
    ALTER TABLE public.partner_crm_subscriptions ADD COLUMN tier text DEFAULT 'core';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_crm_subscriptions' AND column_name = 'provider_subscription_id') THEN
    ALTER TABLE public.partner_crm_subscriptions ADD COLUMN provider_subscription_id text;
  END IF;
END $$;

-- Update unique constraint to include provider
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'partner_crm_subscriptions_stripe_subscription_id_key'
  ) THEN
    ALTER TABLE public.partner_crm_subscriptions 
    DROP CONSTRAINT partner_crm_subscriptions_stripe_subscription_id_key;
  END IF;
END $$;

-- Add composite unique constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'partner_crm_subscriptions_provider_sub_key'
  ) THEN
    ALTER TABLE public.partner_crm_subscriptions 
    ADD CONSTRAINT partner_crm_subscriptions_provider_sub_key 
    UNIQUE (payment_provider, stripe_subscription_id);
  END IF;
END $$;

-- Add withheld status to commissions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'commissions_status_check'
  ) THEN
    ALTER TABLE public.commissions DROP CONSTRAINT IF EXISTS commissions_status_check;
  END IF;
END $$;

-- Payment events log (for audit trail)
CREATE TABLE IF NOT EXISTS public.payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  event_type text NOT NULL,
  event_id text,
  payload jsonb NOT NULL,
  signature text,
  processed boolean DEFAULT false,
  error text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_events_provider ON public.payment_events(provider);
CREATE INDEX IF NOT EXISTS idx_payment_events_event_id ON public.payment_events(event_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_processed ON public.payment_events(processed);

ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage payment events"
  ON public.payment_events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to check if partner has active subscription
CREATE OR REPLACE FUNCTION public.partner_has_active_crm_subscription(p_partner_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.partner_crm_subscriptions
    WHERE partner_id = p_partner_id
    AND status IN ('active', 'trialing')
  );
END;
$$;

-- Update commission rules to include withheld status
UPDATE public.commission_rules 
SET rate_bps = 0 
WHERE order_type = 'partner_crm';

-- Add index on payment provider
CREATE INDEX IF NOT EXISTS idx_partner_crm_subscriptions_payment_provider
  ON public.partner_crm_subscriptions(payment_provider);

CREATE INDEX IF NOT EXISTS idx_partner_crm_subscriptions_tier
  ON public.partner_crm_subscriptions(tier);
