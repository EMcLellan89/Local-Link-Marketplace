/*
  # Marketplace Ad Performance Tracking & ROI Analytics

  ## Overview
  Adds comprehensive ad performance tracking for marketplace deals to measure ROI and effectiveness.
  Merchants can see impressions, clicks, conversions, and revenue generated from their deals.

  ## New Tables

  ### 1. deal_performance_stats
  Aggregated performance metrics for each deal
  - `deal_id` (uuid, references deals) - the deal being tracked
  - `impressions` (integer) - how many times the deal was viewed
  - `unique_views` (integer) - unique users who viewed the deal
  - `clicks` (integer) - clicks on deal CTA buttons
  - `click_through_rate` (decimal) - CTR percentage
  - `purchases` (integer) - number of purchases
  - `conversion_rate` (decimal) - purchase conversion rate
  - `total_revenue_cents` (bigint) - total revenue generated
  - `total_cost_cents` (bigint) - total marketing/platform costs
  - `net_profit_cents` (bigint) - revenue minus costs
  - `roi_percentage` (decimal) - return on investment percentage
  - `avg_order_value_cents` (integer) - average purchase amount
  - `last_calculated_at` (timestamptz) - when stats were last updated
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. deal_impressions
  Track individual impressions and views
  - `id` (uuid, primary key)
  - `deal_id` (uuid, references deals)
  - `user_id` (uuid, nullable) - viewer if logged in
  - `session_id` (text) - anonymous session tracking
  - `referrer_url` (text) - where they came from
  - `user_agent` (text) - browser/device info
  - `ip_address` (inet) - IP for geo-tracking
  - `viewed_at` (timestamptz)

  ### 3. deal_clicks
  Track clicks on deal CTAs
  - `id` (uuid, primary key)
  - `deal_id` (uuid, references deals)
  - `user_id` (uuid, nullable)
  - `session_id` (text)
  - `click_type` (text) - 'view_details', 'purchase', 'call', 'directions'
  - `clicked_at` (timestamptz)

  ### 4. merchant_ad_costs
  Track advertising and platform costs
  - `id` (uuid, primary key)
  - `merchant_id` (uuid, references merchants)
  - `deal_id` (uuid, references deals, nullable)
  - `cost_type` (text) - 'platform_fee', 'featured_listing', 'promotion', 'other'
  - `amount_cents` (integer)
  - `description` (text)
  - `billing_period_start` (date)
  - `billing_period_end` (date)
  - `created_at` (timestamptz)

  ## New Functions

  ### calculate_deal_performance
  Recalculates all performance metrics for a deal
  - Counts impressions, clicks, purchases
  - Calculates conversion rates, revenue, costs
  - Computes ROI and net profit

  ### track_deal_impression
  Convenience function to log a deal impression

  ### track_deal_click
  Convenience function to log a deal click

  ## Security
  - RLS enabled on all tables
  - Merchants can only view their own performance data
  - Customers cannot access performance tracking
  - System can log impressions/clicks without auth

  ## Notes
  1. Performance stats are calculated on-demand or via scheduled job
  2. Impressions deduplicated by session for unique view counts
  3. ROI calculation: ((Revenue - Cost) / Cost) * 100
  4. Conversion rate: (Purchases / Impressions) * 100
*/

-- Create deal_performance_stats table
CREATE TABLE IF NOT EXISTS deal_performance_stats (
  deal_id uuid PRIMARY KEY REFERENCES deals(id) ON DELETE CASCADE,
  impressions integer DEFAULT 0,
  unique_views integer DEFAULT 0,
  clicks integer DEFAULT 0,
  click_through_rate decimal(5,2) DEFAULT 0,
  purchases integer DEFAULT 0,
  conversion_rate decimal(5,2) DEFAULT 0,
  total_revenue_cents bigint DEFAULT 0,
  total_cost_cents bigint DEFAULT 0,
  net_profit_cents bigint DEFAULT 0,
  roi_percentage decimal(10,2) DEFAULT 0,
  avg_order_value_cents integer DEFAULT 0,
  last_calculated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deal_performance_stats_roi ON deal_performance_stats(roi_percentage DESC);
CREATE INDEX IF NOT EXISTS idx_deal_performance_stats_revenue ON deal_performance_stats(total_revenue_cents DESC);

-- Create deal_impressions table
CREATE TABLE IF NOT EXISTS deal_impressions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text,
  referrer_url text,
  user_agent text,
  ip_address inet,
  viewed_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deal_impressions_deal_id ON deal_impressions(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_impressions_viewed_at ON deal_impressions(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_deal_impressions_session_id ON deal_impressions(session_id);

-- Create deal_clicks table
CREATE TABLE IF NOT EXISTS deal_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text,
  click_type text CHECK (click_type IN ('view_details', 'purchase', 'call', 'directions', 'website', 'other')),
  clicked_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deal_clicks_deal_id ON deal_clicks(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_clicks_clicked_at ON deal_clicks(clicked_at DESC);

-- Create merchant_ad_costs table
CREATE TABLE IF NOT EXISTS merchant_ad_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  deal_id uuid REFERENCES deals(id) ON DELETE SET NULL,
  cost_type text CHECK (cost_type IN ('platform_fee', 'featured_listing', 'promotion', 'advertising', 'other')) NOT NULL,
  amount_cents integer NOT NULL,
  description text,
  billing_period_start date,
  billing_period_end date,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_merchant_ad_costs_merchant_id ON merchant_ad_costs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_ad_costs_deal_id ON merchant_ad_costs(deal_id);
CREATE INDEX IF NOT EXISTS idx_merchant_ad_costs_billing_period ON merchant_ad_costs(billing_period_start, billing_period_end);

-- Enable RLS
ALTER TABLE deal_performance_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_ad_costs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deal_performance_stats
CREATE POLICY "Merchants can view their deal performance"
  ON deal_performance_stats FOR SELECT
  TO authenticated
  USING (
    deal_id IN (
      SELECT d.id FROM deals d
      INNER JOIN merchants m ON d.merchant_id = m.id
      WHERE m.user_id = auth.uid()
    )
  );

-- RLS Policies for deal_impressions (system can insert without auth)
CREATE POLICY "System can insert impressions"
  ON deal_impressions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Merchants can view their deal impressions"
  ON deal_impressions FOR SELECT
  TO authenticated
  USING (
    deal_id IN (
      SELECT d.id FROM deals d
      INNER JOIN merchants m ON d.merchant_id = m.id
      WHERE m.user_id = auth.uid()
    )
  );

-- RLS Policies for deal_clicks (system can insert without auth)
CREATE POLICY "System can insert clicks"
  ON deal_clicks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Merchants can view their deal clicks"
  ON deal_clicks FOR SELECT
  TO authenticated
  USING (
    deal_id IN (
      SELECT d.id FROM deals d
      INNER JOIN merchants m ON d.merchant_id = m.id
      WHERE m.user_id = auth.uid()
    )
  );

-- RLS Policies for merchant_ad_costs
CREATE POLICY "Merchants can view their ad costs"
  ON merchant_ad_costs FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can insert their ad costs"
  ON merchant_ad_costs FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update their ad costs"
  ON merchant_ad_costs FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Function to calculate deal performance
CREATE OR REPLACE FUNCTION calculate_deal_performance(p_deal_id uuid)
RETURNS void
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_impressions integer;
  v_unique_views integer;
  v_clicks integer;
  v_purchases integer;
  v_total_revenue_cents bigint;
  v_total_cost_cents bigint;
  v_ctr decimal;
  v_conversion_rate decimal;
  v_roi decimal;
  v_avg_order_value integer;
  v_net_profit_cents bigint;
BEGIN
  -- Count impressions
  SELECT COUNT(*) INTO v_impressions
  FROM deal_impressions
  WHERE deal_id = p_deal_id;

  -- Count unique views (by session_id)
  SELECT COUNT(DISTINCT session_id) INTO v_unique_views
  FROM deal_impressions
  WHERE deal_id = p_deal_id AND session_id IS NOT NULL;

  -- Count clicks
  SELECT COUNT(*) INTO v_clicks
  FROM deal_clicks
  WHERE deal_id = p_deal_id;

  -- Count purchases and total revenue
  SELECT 
    COUNT(*),
    COALESCE(SUM(amount_paid_cents), 0)
  INTO v_purchases, v_total_revenue_cents
  FROM purchases
  WHERE deal_id = p_deal_id AND status = 'paid';

  -- Sum ad costs for this deal
  SELECT COALESCE(SUM(amount_cents), 0) INTO v_total_cost_cents
  FROM merchant_ad_costs
  WHERE deal_id = p_deal_id;

  -- Calculate metrics
  v_ctr := CASE WHEN v_impressions > 0 THEN (v_clicks::decimal / v_impressions * 100) ELSE 0 END;
  v_conversion_rate := CASE WHEN v_impressions > 0 THEN (v_purchases::decimal / v_impressions * 100) ELSE 0 END;
  v_net_profit_cents := v_total_revenue_cents - v_total_cost_cents;
  v_roi := CASE WHEN v_total_cost_cents > 0 THEN ((v_net_profit_cents::decimal / v_total_cost_cents) * 100) ELSE 0 END;
  v_avg_order_value := CASE WHEN v_purchases > 0 THEN (v_total_revenue_cents / v_purchases) ELSE 0 END;

  -- Insert or update performance stats
  INSERT INTO deal_performance_stats (
    deal_id,
    impressions,
    unique_views,
    clicks,
    click_through_rate,
    purchases,
    conversion_rate,
    total_revenue_cents,
    total_cost_cents,
    net_profit_cents,
    roi_percentage,
    avg_order_value_cents,
    last_calculated_at,
    updated_at
  ) VALUES (
    p_deal_id,
    v_impressions,
    v_unique_views,
    v_clicks,
    v_ctr,
    v_purchases,
    v_conversion_rate,
    v_total_revenue_cents,
    v_total_cost_cents,
    v_net_profit_cents,
    v_roi,
    v_avg_order_value,
    now(),
    now()
  )
  ON CONFLICT (deal_id) DO UPDATE SET
    impressions = EXCLUDED.impressions,
    unique_views = EXCLUDED.unique_views,
    clicks = EXCLUDED.clicks,
    click_through_rate = EXCLUDED.click_through_rate,
    purchases = EXCLUDED.purchases,
    conversion_rate = EXCLUDED.conversion_rate,
    total_revenue_cents = EXCLUDED.total_revenue_cents,
    total_cost_cents = EXCLUDED.total_cost_cents,
    net_profit_cents = EXCLUDED.net_profit_cents,
    roi_percentage = EXCLUDED.roi_percentage,
    avg_order_value_cents = EXCLUDED.avg_order_value_cents,
    last_calculated_at = now(),
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Function to track deal impression
CREATE OR REPLACE FUNCTION track_deal_impression(
  p_deal_id uuid,
  p_user_id uuid DEFAULT NULL,
  p_session_id text DEFAULT NULL,
  p_referrer_url text DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_ip_address inet DEFAULT NULL
)
RETURNS uuid
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_impression_id uuid;
BEGIN
  INSERT INTO deal_impressions (
    deal_id,
    user_id,
    session_id,
    referrer_url,
    user_agent,
    ip_address
  ) VALUES (
    p_deal_id,
    p_user_id,
    p_session_id,
    p_referrer_url,
    p_user_agent,
    p_ip_address
  )
  RETURNING id INTO v_impression_id;

  RETURN v_impression_id;
END;
$$ LANGUAGE plpgsql;

-- Function to track deal click
CREATE OR REPLACE FUNCTION track_deal_click(
  p_deal_id uuid,
  p_click_type text,
  p_user_id uuid DEFAULT NULL,
  p_session_id text DEFAULT NULL
)
RETURNS uuid
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_click_id uuid;
BEGIN
  INSERT INTO deal_clicks (
    deal_id,
    user_id,
    session_id,
    click_type
  ) VALUES (
    p_deal_id,
    p_user_id,
    p_session_id,
    p_click_type
  )
  RETURNING id INTO v_click_id;

  RETURN v_click_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to recalculate performance when new purchase is made
CREATE OR REPLACE FUNCTION trigger_recalculate_deal_performance()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM calculate_deal_performance(NEW.deal_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS recalculate_deal_performance_on_purchase ON purchases;
CREATE TRIGGER recalculate_deal_performance_on_purchase
  AFTER INSERT OR UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION trigger_recalculate_deal_performance();

-- Function to update deal_performance_stats updated_at
CREATE OR REPLACE FUNCTION update_deal_performance_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_deal_performance_stats_updated_at_trigger ON deal_performance_stats;
CREATE TRIGGER update_deal_performance_stats_updated_at_trigger
  BEFORE UPDATE ON deal_performance_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_deal_performance_stats_updated_at();