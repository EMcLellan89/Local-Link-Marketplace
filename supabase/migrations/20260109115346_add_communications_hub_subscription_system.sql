/*
  # Communications Hub Subscription System

  1. New Tables
    - `communications_subscriptions`
      - Tracks VoIP and Email subscriptions for merchants, partners, and internal team
      - Includes pricing tier, user count, status
    - `communications_usage`
      - Tracks usage for billing (calls and emails)
      - Records cost per usage event
    - `communications_products`
      - Pre-seeded products for VoIP and Email tiers

  2. Security
    - Enable RLS on all tables
    - Merchants/Partners can view/manage own subscriptions
    - Admin can view all subscriptions
    - Usage tracking is system-managed

  3. Pricing Structure
    - VoIP: $10/user/month + $0.05/call
    - Email Tier 1: $25/month (up to 100k emails)
    - Email Tier 2: $99/month (100k to 2.5M emails)
*/

-- Communications Products
CREATE TABLE IF NOT EXISTS communications_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_type text NOT NULL CHECK (product_type IN ('voip', 'email')),
  name text NOT NULL,
  description text,
  base_price_cents integer NOT NULL,
  usage_price_cents integer,
  included_units integer,
  max_units integer,
  billing_period text DEFAULT 'month',
  features jsonb DEFAULT '[]',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Communications Subscriptions
CREATE TABLE IF NOT EXISTS communications_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('merchant', 'partner', 'internal')),
  entity_id uuid NOT NULL,
  product_id uuid REFERENCES communications_products(id),

  -- VoIP specific
  voip_enabled boolean DEFAULT false,
  voip_user_count integer DEFAULT 0,
  voip_monthly_cost_cents integer DEFAULT 0,

  -- Email specific
  email_enabled boolean DEFAULT false,
  email_tier text CHECK (email_tier IN ('tier1', 'tier2')),
  email_monthly_cost_cents integer DEFAULT 0,

  -- Subscription management
  status text DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'suspended', 'cancelled')),
  stripe_subscription_id text,
  stripe_customer_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(entity_type, entity_id)
);

-- Communications Usage Tracking
CREATE TABLE IF NOT EXISTS communications_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES communications_subscriptions(id) ON DELETE CASCADE,

  usage_type text NOT NULL CHECK (usage_type IN ('voip_call', 'email_sent')),

  -- VoIP specific
  call_direction text CHECK (call_direction IN ('inbound', 'outbound')),
  call_duration_seconds integer,
  call_from text,
  call_to text,
  call_cost_cents integer DEFAULT 5,

  -- Email specific
  email_to text,
  email_subject text,
  email_status text,

  -- Common
  cost_cents integer NOT NULL DEFAULT 0,
  usage_date timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}',

  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_communications_subscriptions_entity ON communications_subscriptions(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_communications_subscriptions_status ON communications_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_communications_subscriptions_stripe ON communications_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_communications_usage_subscription ON communications_usage(subscription_id);
CREATE INDEX IF NOT EXISTS idx_communications_usage_date ON communications_usage(usage_date);
CREATE INDEX IF NOT EXISTS idx_communications_usage_type ON communications_usage(usage_type);

-- RLS Policies
ALTER TABLE communications_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications_usage ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can view active products
CREATE POLICY "Anyone can view active communications products"
  ON communications_products FOR SELECT
  USING (active = true);

-- Subscriptions: Merchants can manage own
CREATE POLICY "Merchants can view own communications subscription"
  ON communications_subscriptions FOR SELECT
  TO authenticated
  USING (
    entity_type = 'merchant' AND
    entity_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own communications subscription"
  ON communications_subscriptions FOR UPDATE
  TO authenticated
  USING (
    entity_type = 'merchant' AND
    entity_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Subscriptions: Partners can manage own
CREATE POLICY "Partners can view own communications subscription"
  ON communications_subscriptions FOR SELECT
  TO authenticated
  USING (
    entity_type = 'partner' AND
    entity_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can update own communications subscription"
  ON communications_subscriptions FOR UPDATE
  TO authenticated
  USING (
    entity_type = 'partner' AND
    entity_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

-- Subscriptions: Internal team can view all
CREATE POLICY "Internal team can view all communications subscriptions"
  ON communications_subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND is_active = true
    )
  );

-- Usage: Users can view own usage
CREATE POLICY "Users can view own communications usage"
  ON communications_usage FOR SELECT
  TO authenticated
  USING (
    subscription_id IN (
      SELECT id FROM communications_subscriptions
      WHERE (
        entity_type = 'merchant' AND
        entity_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
      ) OR (
        entity_type = 'partner' AND
        entity_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
      )
    )
  );

-- Usage: Internal team can view all
CREATE POLICY "Internal team can view all communications usage"
  ON communications_usage FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND is_active = true
    )
  );

-- Seed Communications Products
INSERT INTO communications_products (product_type, name, description, base_price_cents, usage_price_cents, included_units, max_units, features)
VALUES
  (
    'voip',
    'VoIP Calling',
    'Professional business phone system with unlimited users',
    1000,
    5,
    0,
    999999,
    '["Unlimited inbound/outbound calls", "Call recording", "Call forwarding", "Voicemail to email", "Real-time analytics", "$0.05 per call"]'::jsonb
  ),
  (
    'email',
    'Email Marketing - Starter',
    'Email marketing platform for small businesses',
    2500,
    0,
    100000,
    100000,
    '["Up to 100,000 emails/month", "Email templates", "Campaign analytics", "A/B testing", "Automated workflows", "Contact management"]'::jsonb
  ),
  (
    'email',
    'Email Marketing - Professional',
    'Email marketing platform for growing businesses',
    9900,
    0,
    2500000,
    2500000,
    '["Up to 2,500,000 emails/month", "Advanced segmentation", "Email templates", "Campaign analytics", "A/B testing", "Automated workflows", "Priority support", "API access"]'::jsonb
  )
ON CONFLICT DO NOTHING;

-- Function to calculate monthly communications cost
CREATE OR REPLACE FUNCTION calculate_communications_monthly_cost(
  p_subscription_id uuid,
  p_period_start timestamptz,
  p_period_end timestamptz
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_base_cost integer := 0;
  v_usage_cost integer := 0;
  v_total_cost integer := 0;
  v_subscription record;
BEGIN
  -- Get subscription details
  SELECT * INTO v_subscription
  FROM communications_subscriptions
  WHERE id = p_subscription_id;

  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  -- Add VoIP base cost
  IF v_subscription.voip_enabled THEN
    v_base_cost := v_base_cost + v_subscription.voip_monthly_cost_cents;
  END IF;

  -- Add Email base cost
  IF v_subscription.email_enabled THEN
    v_base_cost := v_base_cost + v_subscription.email_monthly_cost_cents;
  END IF;

  -- Calculate usage cost (calls)
  SELECT COALESCE(SUM(cost_cents), 0) INTO v_usage_cost
  FROM communications_usage
  WHERE subscription_id = p_subscription_id
    AND usage_date >= p_period_start
    AND usage_date < p_period_end;

  v_total_cost := v_base_cost + v_usage_cost;

  RETURN v_total_cost;
END;
$$;

-- Function to get communications usage summary
CREATE OR REPLACE FUNCTION get_communications_usage_summary(
  p_subscription_id uuid,
  p_period_start timestamptz,
  p_period_end timestamptz
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
  v_call_count integer;
  v_call_cost integer;
  v_email_count integer;
  v_total_cost integer;
BEGIN
  -- Count calls and cost
  SELECT
    COUNT(*),
    COALESCE(SUM(cost_cents), 0)
  INTO v_call_count, v_call_cost
  FROM communications_usage
  WHERE subscription_id = p_subscription_id
    AND usage_type = 'voip_call'
    AND usage_date >= p_period_start
    AND usage_date < p_period_end;

  -- Count emails
  SELECT COUNT(*) INTO v_email_count
  FROM communications_usage
  WHERE subscription_id = p_subscription_id
    AND usage_type = 'email_sent'
    AND usage_date >= p_period_start
    AND usage_date < p_period_end;

  v_total_cost := v_call_cost;

  v_result := jsonb_build_object(
    'call_count', v_call_count,
    'call_cost_cents', v_call_cost,
    'email_count', v_email_count,
    'total_usage_cost_cents', v_total_cost
  );

  RETURN v_result;
END;
$$;