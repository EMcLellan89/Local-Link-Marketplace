/*
  # Business Ad Sales Commission Rule

  1. Commission Structure (LOCKED)
    - Product sales (AutoScale, Financial Engine, Business Deals Hub): Use partner tier rate
    - Business sales with ads running: FLAT 25% for ALL partners (overrides tier)

  2. New Table
    - `business_ad_campaigns` - Track businesses with active ad campaigns

  3. Function
    - `get_commission_rate_for_sale()` - Returns correct rate based on sale type
*/

-- Track businesses with active ad campaigns
CREATE TABLE IF NOT EXISTS business_ad_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES profit_network_businesses(id) ON DELETE CASCADE,
  campaign_name text NOT NULL,
  daily_budget_cents integer NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add index
CREATE INDEX IF NOT EXISTS idx_business_ad_campaigns_business ON business_ad_campaigns(business_id);
CREATE INDEX IF NOT EXISTS idx_business_ad_campaigns_status ON business_ad_campaigns(status);

-- Enable RLS
ALTER TABLE business_ad_campaigns ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin full access to business ad campaigns"
  ON business_ad_campaigns FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Partners can view business ad campaigns"
  ON business_ad_campaigns FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE user_id = auth.uid()
      AND status = 'Active'
    )
  );

-- Function to determine commission rate for a sale
CREATE OR REPLACE FUNCTION get_commission_rate_for_sale(
  p_partner_id uuid,
  p_sale_type text, -- 'product', 'business', 'service', 'deal'
  p_item_id uuid DEFAULT NULL -- business_id or product_id
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tier_rate integer;
  v_has_active_ads boolean;
BEGIN
  -- SPECIAL RULE: Business sales with active ad campaigns = FLAT 25% (2500 bps)
  IF p_sale_type = 'business' AND p_item_id IS NOT NULL THEN
    -- Check if this business has active ad campaigns
    SELECT EXISTS (
      SELECT 1 FROM business_ad_campaigns
      WHERE business_id = p_item_id
      AND status = 'active'
    ) INTO v_has_active_ads;

    IF v_has_active_ads THEN
      RETURN 2500; -- Flat 25% for all partners on business sales with ads
    END IF;
  END IF;

  -- For all other sales (products, services, deals, businesses without ads):
  -- Use partner's tier commission rate
  RETURN get_partner_commission_rate_bps(p_partner_id);
END;
$$;

-- Update comment
COMMENT ON FUNCTION get_commission_rate_for_sale IS 'Returns commission rate: 25% flat for business sales with ads, otherwise uses partner tier rate';
COMMENT ON TABLE business_ad_campaigns IS 'Track businesses with active ad campaigns for commission calculation';
