/*
  # External Sales Ingest System

  Creates infrastructure for external systems (like StoryLab) to report sales to Local-Link
  for commission tracking and partner payouts.

  1. New Tables
    - `external_systems` - Registered external systems with API credentials
    - `external_sales_events` - Log of all incoming sale events
    - `external_sale_commissions` - Commissions generated from external sales

  2. Security
    - Enable RLS on all tables
    - Only admins can view/manage external systems
    - Partners can view their own commission records
    - Webhook signature verification required

  3. Features
    - Idempotent processing (duplicate prevention)
    - Audit trail of all events
    - Retry/failure handling
    - Partner attribution via ref codes
*/

-- External systems registry (StoryLab, etc.)
CREATE TABLE IF NOT EXISTS external_systems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  system_key text UNIQUE NOT NULL,
  system_name text NOT NULL,
  description text,
  api_key text UNIQUE NOT NULL,
  webhook_secret text NOT NULL,
  is_active boolean DEFAULT true,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for fast API key lookup
CREATE INDEX IF NOT EXISTS idx_external_systems_api_key ON external_systems(api_key) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_external_systems_system_key ON external_systems(system_key);

-- External sales events log
CREATE TABLE IF NOT EXISTS external_sales_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_system_id uuid NOT NULL REFERENCES external_systems(id) ON DELETE CASCADE,
  
  -- Idempotency
  external_order_id text NOT NULL,
  idempotency_key text NOT NULL,
  
  -- Sale details
  product_key text NOT NULL,
  product_name text,
  amount_cents integer NOT NULL,
  currency text DEFAULT 'USD',
  
  -- Partner attribution
  partner_ref_code text,
  partner_id uuid REFERENCES partners(id) ON DELETE SET NULL,
  
  -- Processing status
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'duplicate')),
  processed_at timestamptz,
  error_message text,
  
  -- Full payload for debugging
  raw_payload jsonb NOT NULL,
  
  -- Metadata
  customer_email text,
  customer_name text,
  metadata jsonb DEFAULT '{}'::jsonb,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure idempotency
  UNIQUE(external_system_id, idempotency_key)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_external_sales_events_system ON external_sales_events(external_system_id);
CREATE INDEX IF NOT EXISTS idx_external_sales_events_partner ON external_sales_events(partner_id) WHERE partner_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_external_sales_events_status ON external_sales_events(status);
CREATE INDEX IF NOT EXISTS idx_external_sales_events_external_order ON external_sales_events(external_order_id);
CREATE INDEX IF NOT EXISTS idx_external_sales_events_ref_code ON external_sales_events(partner_ref_code) WHERE partner_ref_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_external_sales_events_created ON external_sales_events(created_at DESC);

-- External sale commissions
CREATE TABLE IF NOT EXISTS external_sale_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_sales_event_id uuid NOT NULL REFERENCES external_sales_events(id) ON DELETE CASCADE,
  external_system_id uuid NOT NULL REFERENCES external_systems(id) ON DELETE CASCADE,
  
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  
  -- Commission details
  sale_amount_cents integer NOT NULL,
  commission_rate numeric(5,4) NOT NULL,
  commission_amount_cents integer NOT NULL,
  
  -- Product info
  product_key text NOT NULL,
  product_name text,
  
  -- Payout status
  payout_status text DEFAULT 'pending' CHECK (payout_status IN ('pending', 'approved', 'paid', 'cancelled')),
  payout_batch_id uuid,
  paid_at timestamptz,
  
  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_external_sale_commissions_event ON external_sale_commissions(external_sales_event_id);
CREATE INDEX IF NOT EXISTS idx_external_sale_commissions_partner ON external_sale_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_external_sale_commissions_system ON external_sale_commissions(external_system_id);
CREATE INDEX IF NOT EXISTS idx_external_sale_commissions_status ON external_sale_commissions(payout_status);
CREATE INDEX IF NOT EXISTS idx_external_sale_commissions_created ON external_sale_commissions(created_at DESC);

-- RLS Policies
ALTER TABLE external_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_sales_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_sale_commissions ENABLE ROW LEVEL SECURITY;

-- External systems: Admin only
CREATE POLICY "Admins can view external systems"
  ON external_systems FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage external systems"
  ON external_systems FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- External sales events: Admin and partner (own events)
CREATE POLICY "Admins can view all external sales events"
  ON external_sales_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Partners can view their external sales events"
  ON external_sales_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.user_id = auth.uid()
      AND partners.id = external_sales_events.partner_id
    )
  );

-- External sale commissions: Admin and partner (own commissions)
CREATE POLICY "Admins can view all external sale commissions"
  ON external_sale_commissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Partners can view their external sale commissions"
  ON external_sale_commissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.user_id = auth.uid()
      AND partners.id = external_sale_commissions.partner_id
    )
  );

CREATE POLICY "Admins can manage external sale commissions"
  ON external_sale_commissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to process external sale and create commission
CREATE OR REPLACE FUNCTION process_external_sale(
  p_external_system_id uuid,
  p_external_order_id text,
  p_idempotency_key text,
  p_product_key text,
  p_product_name text,
  p_amount_cents integer,
  p_partner_ref_code text,
  p_customer_email text DEFAULT NULL,
  p_customer_name text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_raw_payload jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event_id uuid;
  v_partner_id uuid;
  v_partner_tier text;
  v_commission_rate numeric;
  v_commission_cents integer;
  v_commission_id uuid;
  v_result jsonb;
BEGIN
  -- Check if event already exists (idempotency)
  SELECT id INTO v_event_id
  FROM external_sales_events
  WHERE external_system_id = p_external_system_id
  AND idempotency_key = p_idempotency_key;

  IF v_event_id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', true,
      'duplicate', true,
      'event_id', v_event_id,
      'message', 'Event already processed'
    );
  END IF;

  -- Resolve partner from ref code
  IF p_partner_ref_code IS NOT NULL THEN
    SELECT id, tier INTO v_partner_id, v_partner_tier
    FROM partners
    WHERE referral_code = p_partner_ref_code
    AND status = 'active';
  END IF;

  -- Insert event
  INSERT INTO external_sales_events (
    external_system_id,
    external_order_id,
    idempotency_key,
    product_key,
    product_name,
    amount_cents,
    partner_ref_code,
    partner_id,
    status,
    customer_email,
    customer_name,
    metadata,
    raw_payload
  ) VALUES (
    p_external_system_id,
    p_external_order_id,
    p_idempotency_key,
    p_product_key,
    p_product_name,
    p_amount_cents,
    p_partner_ref_code,
    v_partner_id,
    'processing',
    p_customer_email,
    p_customer_name,
    p_metadata,
    p_raw_payload
  )
  RETURNING id INTO v_event_id;

  -- If partner found, create commission
  IF v_partner_id IS NOT NULL THEN
    -- Get commission rate for product (default to 30% if not found)
    SELECT COALESCE(
      (SELECT commission_rate FROM marketplace_products WHERE product_key = p_product_key LIMIT 1),
      0.30
    ) INTO v_commission_rate;

    -- Calculate commission
    v_commission_cents := FLOOR(p_amount_cents * v_commission_rate);

    -- Insert commission
    INSERT INTO external_sale_commissions (
      external_sales_event_id,
      external_system_id,
      partner_id,
      sale_amount_cents,
      commission_rate,
      commission_amount_cents,
      product_key,
      product_name,
      payout_status
    ) VALUES (
      v_event_id,
      p_external_system_id,
      v_partner_id,
      p_amount_cents,
      v_commission_rate,
      v_commission_cents,
      p_product_key,
      p_product_name,
      'pending'
    )
    RETURNING id INTO v_commission_id;
  END IF;

  -- Mark event as completed
  UPDATE external_sales_events
  SET status = 'completed',
      processed_at = now()
  WHERE id = v_event_id;

  -- Build result
  v_result := jsonb_build_object(
    'success', true,
    'duplicate', false,
    'event_id', v_event_id,
    'partner_id', v_partner_id,
    'commission_id', v_commission_id,
    'commission_cents', v_commission_cents,
    'message', CASE
      WHEN v_partner_id IS NULL THEN 'Sale recorded (no partner attribution)'
      ELSE 'Sale recorded and commission created'
    END
  );

  RETURN v_result;

EXCEPTION WHEN OTHERS THEN
  -- Log error
  IF v_event_id IS NOT NULL THEN
    UPDATE external_sales_events
    SET status = 'failed',
        error_message = SQLERRM
    WHERE id = v_event_id;
  END IF;

  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'event_id', v_event_id
  );
END;
$$;

-- Function to get external sale stats for partner
CREATE OR REPLACE FUNCTION get_partner_external_sales_stats(p_partner_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_sales', COUNT(*),
    'total_amount_cents', COALESCE(SUM(sale_amount_cents), 0),
    'total_commission_cents', COALESCE(SUM(commission_amount_cents), 0),
    'pending_commission_cents', COALESCE(SUM(CASE WHEN payout_status = 'pending' THEN commission_amount_cents ELSE 0 END), 0),
    'paid_commission_cents', COALESCE(SUM(CASE WHEN payout_status = 'paid' THEN commission_amount_cents ELSE 0 END), 0)
  ) INTO v_result
  FROM external_sale_commissions
  WHERE partner_id = p_partner_id;

  RETURN v_result;
END;
$$;

-- Register StoryLab as default external system
INSERT INTO external_systems (
  system_key,
  system_name,
  description,
  api_key,
  webhook_secret,
  is_active,
  settings
) VALUES (
  'storylab',
  'StoryLab',
  'AI-powered personalized children''s book creation platform',
  'sk_storylab_' || encode(gen_random_bytes(32), 'hex'),
  'whsec_' || encode(gen_random_bytes(32), 'hex'),
  true,
  '{"commission_rate": 0.30, "product_categories": ["books", "digital"]}'::jsonb
)
ON CONFLICT (system_key) DO NOTHING;
