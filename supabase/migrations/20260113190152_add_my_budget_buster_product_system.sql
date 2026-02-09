/*
  # My Budget Buster Product System
  
  1. Overview
    Adds comprehensive tracking for the "My Budget Buster" SaaS product
    with two modes: Manual ($9.99/mo) and Connected ($12.99/mo with Plaid)
    
  2. New Tables
    - `budget_buster_subscriptions` - User subscriptions with mode tracking
    - `budget_buster_mode_switches` - Track when users change modes
    - `budget_buster_usage_metrics` - Daily usage stats per user
    
  3. Product Configuration
    - Adds 4 SKUs to marketplace_affiliate_products:
      * Manual Monthly ($9.99)
      * Manual Annual ($99)
      * Connected Monthly ($12.99)
      * Connected Annual ($129)
    
  4. Dashboard Metrics
    - MRR by mode
    - Gross margin by mode
    - Churn by mode
    - ARPU calculations
    - Plaid ROI tracking
    
  5. Commission Structure
    - 20% recurring commission on all subscriptions
    - Mode-aware commission tracking
    - Margin-adjusted payouts
*/

-- =====================================================
-- SUBSCRIPTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS budget_buster_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User & Order Info
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  partner_id UUID REFERENCES partners(id),
  
  -- Product Mode
  mode TEXT NOT NULL CHECK (mode IN ('manual', 'connected')),
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
  
  -- Pricing
  base_price_cents INTEGER NOT NULL,
  actual_price_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'expired', 'past_due')),
  
  -- Billing
  stripe_subscription_id TEXT,
  paybright_subscription_id TEXT,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end TIMESTAMPTZ NOT NULL,
  next_billing_date TIMESTAMPTZ,
  
  -- Features
  plaid_enabled BOOLEAN DEFAULT false,
  plaid_connection_count INTEGER DEFAULT 0,
  plaid_last_sync TIMESTAMPTZ,
  
  -- Cost Tracking
  estimated_monthly_cost_cents INTEGER DEFAULT 0,
  gross_margin_bp INTEGER,
  
  -- Lifecycle
  activated_at TIMESTAMPTZ DEFAULT now(),
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  last_payment_at TIMESTAMPTZ,
  failed_payment_count INTEGER DEFAULT 0,
  
  -- Metadata
  signup_source TEXT,
  promo_code TEXT,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_budget_buster_subs_user ON budget_buster_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subs_partner ON budget_buster_subscriptions(partner_id) WHERE partner_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_budget_buster_subs_status ON budget_buster_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subs_mode ON budget_buster_subscriptions(mode);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subs_stripe ON budget_buster_subscriptions(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_budget_buster_subs_period ON budget_buster_subscriptions(current_period_end);

ALTER TABLE budget_buster_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON budget_buster_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Partners can view their customer subscriptions"
  ON budget_buster_subscriptions FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all subscriptions"
  ON budget_buster_subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Service role full access"
  ON budget_buster_subscriptions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- MODE SWITCHES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS budget_buster_mode_switches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  subscription_id UUID REFERENCES budget_buster_subscriptions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  from_mode TEXT NOT NULL CHECK (from_mode IN ('manual', 'connected')),
  to_mode TEXT NOT NULL CHECK (to_mode IN ('manual', 'connected')),
  
  old_price_cents INTEGER,
  new_price_cents INTEGER,
  price_difference_cents INTEGER,
  
  switch_reason TEXT,
  user_initiated BOOLEAN DEFAULT true,
  
  effective_date TIMESTAMPTZ DEFAULT now(),
  prorated BOOLEAN DEFAULT false,
  proration_amount_cents INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mode_switches_sub ON budget_buster_mode_switches(subscription_id);
CREATE INDEX IF NOT EXISTS idx_mode_switches_user ON budget_buster_mode_switches(user_id);

ALTER TABLE budget_buster_mode_switches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own mode switches"
  ON budget_buster_mode_switches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins view all switches"
  ON budget_buster_mode_switches FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Service role full access switches"
  ON budget_buster_mode_switches FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- USAGE METRICS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS budget_buster_usage_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  subscription_id UUID REFERENCES budget_buster_subscriptions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  metric_date DATE NOT NULL,
  
  transactions_logged INTEGER DEFAULT 0,
  budgets_created INTEGER DEFAULT 0,
  reports_generated INTEGER DEFAULT 0,
  
  plaid_syncs INTEGER DEFAULT 0,
  plaid_accounts_connected INTEGER DEFAULT 0,
  plaid_errors INTEGER DEFAULT 0,
  
  sessions INTEGER DEFAULT 0,
  active_minutes INTEGER DEFAULT 0,
  
  plaid_cost_cents INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(subscription_id, metric_date)
);

CREATE INDEX IF NOT EXISTS idx_usage_metrics_sub ON budget_buster_usage_metrics(subscription_id);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_date ON budget_buster_usage_metrics(metric_date);

ALTER TABLE budget_buster_usage_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own usage"
  ON budget_buster_usage_metrics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins view all usage"
  ON budget_buster_usage_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Service role can manage usage"
  ON budget_buster_usage_metrics FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- ADD PRODUCTS TO MARKETPLACE
-- =====================================================

INSERT INTO marketplace_affiliate_products (sku, name, type, category, price_cents, commission_rate_bp, recurring, active, metadata)
VALUES
  (
    'budget_buster_manual_monthly',
    'My Budget Buster - Premium Manual (Monthly)',
    'subscription',
    'saas',
    999,
    2000,
    true,
    true,
    jsonb_build_object(
      'mode', 'manual',
      'billing_cycle', 'monthly',
      'plaid_enabled', false,
      'features', jsonb_build_array(
        'Full-featured budgeting',
        'Manual transaction entry',
        'Unlimited budgets',
        'Export reports',
        'Mobile app access',
        'Privacy-first (no bank connections)'
      ),
      'gross_margin_bp', 9000,
      'estimated_monthly_cost_cents', 10
    )
  ),
  (
    'budget_buster_manual_annual',
    'My Budget Buster - Premium Manual (Annual)',
    'subscription',
    'saas',
    9900,
    2000,
    true,
    true,
    jsonb_build_object(
      'mode', 'manual',
      'billing_cycle', 'annual',
      'plaid_enabled', false,
      'savings_vs_monthly', '$19.88/year',
      'features', jsonb_build_array(
        'Full-featured budgeting',
        'Manual transaction entry',
        'Unlimited budgets',
        'Export reports',
        'Mobile app access',
        'Privacy-first (no bank connections)'
      ),
      'gross_margin_bp', 9000,
      'estimated_monthly_cost_cents', 10
    )
  ),
  (
    'budget_buster_connected_monthly',
    'My Budget Buster - Premium Connected (Monthly)',
    'subscription',
    'saas',
    1299,
    2000,
    true,
    true,
    jsonb_build_object(
      'mode', 'connected',
      'billing_cycle', 'monthly',
      'plaid_enabled', true,
      'features', jsonb_build_array(
        'Everything in Manual, PLUS:',
        'Automatic bank sync via Plaid',
        'Auto-categorization',
        'Real-time balance updates',
        'Transaction notifications',
        'Multi-account support'
      ),
      'gross_margin_bp', 7000,
      'estimated_monthly_cost_cents', 390
    )
  ),
  (
    'budget_buster_connected_annual',
    'My Budget Buster - Premium Connected (Annual)',
    'subscription',
    'saas',
    12900,
    2000,
    true,
    true,
    jsonb_build_object(
      'mode', 'connected',
      'billing_cycle', 'annual',
      'plaid_enabled', true,
      'savings_vs_monthly', '$25.88/year',
      'features', jsonb_build_array(
        'Everything in Manual, PLUS:',
        'Automatic bank sync via Plaid',
        'Auto-categorization',
        'Real-time balance updates',
        'Transaction notifications',
        'Multi-account support'
      ),
      'gross_margin_bp', 7000,
      'estimated_monthly_cost_cents', 390
    )
  )
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  price_cents = EXCLUDED.price_cents,
  metadata = EXCLUDED.metadata;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION get_budget_buster_mrr_by_mode()
RETURNS TABLE (
  mode TEXT,
  billing_cycle TEXT,
  active_subs BIGINT,
  mrr_cents NUMERIC,
  avg_price_cents NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.mode,
    s.billing_cycle,
    COUNT(*) as active_subs,
    SUM(
      CASE 
        WHEN s.billing_cycle = 'monthly' THEN s.actual_price_cents
        WHEN s.billing_cycle = 'annual' THEN s.actual_price_cents / 12
        ELSE 0
      END
    ) as mrr_cents,
    AVG(s.actual_price_cents) as avg_price_cents
  FROM budget_buster_subscriptions s
  WHERE s.status = 'active'
  GROUP BY s.mode, s.billing_cycle;
END;
$$;

CREATE OR REPLACE FUNCTION get_budget_buster_margins_by_mode()
RETURNS TABLE (
  mode TEXT,
  total_revenue_cents NUMERIC,
  total_cost_cents NUMERIC,
  gross_profit_cents NUMERIC,
  gross_margin_percent NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.mode,
    SUM(s.actual_price_cents) as total_revenue_cents,
    SUM(s.estimated_monthly_cost_cents) as total_cost_cents,
    SUM(s.actual_price_cents - s.estimated_monthly_cost_cents) as gross_profit_cents,
    CASE 
      WHEN SUM(s.actual_price_cents) > 0 THEN
        (SUM(s.actual_price_cents - s.estimated_monthly_cost_cents)::NUMERIC / SUM(s.actual_price_cents)::NUMERIC) * 100
      ELSE 0
    END as gross_margin_percent
  FROM budget_buster_subscriptions s
  WHERE s.status = 'active'
  GROUP BY s.mode;
END;
$$;

CREATE OR REPLACE FUNCTION calculate_budget_buster_commission(
  p_subscription_id UUID,
  p_period_start TIMESTAMPTZ,
  p_period_end TIMESTAMPTZ
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_subscription RECORD;
  v_commission_amount NUMERIC;
  v_commission_rate NUMERIC;
BEGIN
  SELECT * INTO v_subscription
  FROM budget_buster_subscriptions
  WHERE id = p_subscription_id;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  SELECT commission_rate_bp / 10000.0 INTO v_commission_rate
  FROM marketplace_affiliate_products
  WHERE sku LIKE 'budget_buster_' || v_subscription.mode || '_' || v_subscription.billing_cycle
  LIMIT 1;
  
  v_commission_amount := (v_subscription.actual_price_cents * v_commission_rate);
  
  IF v_subscription.billing_cycle = 'annual' THEN
    v_commission_amount := v_commission_amount / 12;
  END IF;
  
  RETURN v_commission_amount;
END;
$$;
