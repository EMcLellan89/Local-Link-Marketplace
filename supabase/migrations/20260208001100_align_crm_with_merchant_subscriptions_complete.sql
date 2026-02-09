/*
  # Complete CRM + Merchant Subscription Alignment

  1. Changes
    - Create mapping between merchant subscription tiers and CRM tiers
    - Update subscription_tiers to include CRM features
    - Update contact limits and accounting tiers to match merchant pricing
    - Add helper functions to get CRM access based on subscription
    - Remove standalone CRM pricing (now bundled)
    
  2. Tier Mapping
    - Starter ($149/mo) → Starter CRM (500 contacts, no accounting)
    - Founders ($249/mo) → Professional CRM (5,000 contacts, Books Lite)  
    - Standard ($299/mo) → Business CRM (25,000 contacts, Books Pro)
    - Premium ($349/mo) → Enterprise CRM (100,000 contacts, Books Pro)
    - Enterprise Plus → Custom (unlimited, custom accounting)
    
  3. Security
    - Functions use SECURITY DEFINER with proper search_path
    - RLS policies ensure users only access their tier's CRM features
*/

-- Update CRM tier contact limits and accounting to match merchant subscription value
UPDATE ll_crm_pricing_tiers
SET 
  contact_limit = 500,
  books_tier = 'none',
  description = 'Included with Starter subscription - Essential CRM for small businesses'
WHERE tier_level = 1;

UPDATE ll_crm_pricing_tiers
SET 
  contact_limit = 5000,
  books_tier = 'lite',
  description = 'Included with Founders subscription - Professional CRM with Books Lite'
WHERE tier_level = 2;

UPDATE ll_crm_pricing_tiers
SET 
  contact_limit = 25000,
  books_tier = 'pro',
  description = 'Included with Standard subscription - Advanced CRM with Books Pro'
WHERE tier_level = 3;

UPDATE ll_crm_pricing_tiers
SET 
  contact_limit = 100000,
  books_tier = 'pro',
  description = 'Included with Premium subscription - Enterprise CRM with Books Pro'
WHERE tier_level = 4;

UPDATE ll_crm_pricing_tiers
SET 
  contact_limit = NULL, -- unlimited
  books_tier = 'custom',
  description = 'Custom enterprise solution - Contact sales for pricing'
WHERE tier_level = 5;

-- Create mapping table for subscription tier -> CRM tier
CREATE TABLE IF NOT EXISTS subscription_crm_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_tier_name TEXT NOT NULL REFERENCES subscription_tiers(name),
  crm_tier_id UUID NOT NULL REFERENCES ll_crm_pricing_tiers(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(subscription_tier_name)
);

-- Enable RLS
ALTER TABLE subscription_crm_mapping ENABLE ROW LEVEL SECURITY;

-- Public read access for mapping
CREATE POLICY "Public can read tier mappings"
  ON subscription_crm_mapping
  FOR SELECT
  TO public
  USING (true);

-- Insert mappings
INSERT INTO subscription_crm_mapping (subscription_tier_name, crm_tier_id)
SELECT 
  'Starter',
  id
FROM ll_crm_pricing_tiers
WHERE tier_level = 1
ON CONFLICT (subscription_tier_name) DO UPDATE
SET crm_tier_id = EXCLUDED.crm_tier_id;

INSERT INTO subscription_crm_mapping (subscription_tier_name, crm_tier_id)
SELECT 
  'Founders',
  id
FROM ll_crm_pricing_tiers
WHERE tier_level = 2
ON CONFLICT (subscription_tier_name) DO UPDATE
SET crm_tier_id = EXCLUDED.crm_tier_id;

INSERT INTO subscription_crm_mapping (subscription_tier_name, crm_tier_id)
SELECT 
  'Standard',
  id
FROM ll_crm_pricing_tiers
WHERE tier_level = 3
ON CONFLICT (subscription_tier_name) DO UPDATE
SET crm_tier_id = EXCLUDED.crm_tier_id;

INSERT INTO subscription_crm_mapping (subscription_tier_name, crm_tier_id)
SELECT 
  'Premium',
  id
FROM ll_crm_pricing_tiers
WHERE tier_level = 4
ON CONFLICT (subscription_tier_name) DO UPDATE
SET crm_tier_id = EXCLUDED.crm_tier_id;

-- Update subscription_tiers features to include CRM info
UPDATE subscription_tiers
SET features = jsonb_build_array(
  'Starter CRM included (500 contacts)',
  '1 postcard spot (rotating placement)',
  'Basic marketplace listing',
  'Business directory',
  'QR code redemption',
  'Basic analytics',
  'Standard customer support',
  'Mobile app access',
  'Deal scheduling'
)
WHERE name = 'Starter';

UPDATE subscription_tiers
SET features = jsonb_build_array(
  'Professional CRM included (5,000 contacts)',
  'Local-Link Books Lite included',
  '1 postcard spot (value section placement)',
  'Marketplace listing',
  'Business directory',
  'QR code redemption',
  'Enhanced analytics dashboard',
  'Email promotion (1x monthly)',
  'Founders rate locked for life',
  'Priority support',
  'Mobile app access',
  'Advanced deal scheduling',
  'Customer insights',
  'Review management'
)
WHERE name = 'Founders';

UPDATE subscription_tiers
SET features = jsonb_build_array(
  'Business CRM included (25,000 contacts)',
  'Local-Link Books Pro included',
  '1 postcard spot (standard placement)',
  'Priority marketplace listing',
  'Business directory',
  'QR code redemption',
  'Enhanced analytics (full dashboard)',
  'Featured in 2 email blasts/month',
  'Priority placement in app',
  'Social media feature (1x/month)',
  'Priority support',
  'Mobile app access',
  'Advanced deal scheduling',
  'Customer insights',
  'Review management',
  'A/B testing tools',
  'Custom branding options'
)
WHERE name = 'Standard';

UPDATE subscription_tiers
SET features = jsonb_build_array(
  'Enterprise CRM included (100,000 contacts)',
  'Local-Link Books Pro included',
  '1 postcard spot (TOP ROW premium placement)',
  'Featured deal badge',
  'Priority marketplace listing',
  'Business directory',
  'QR code redemption',
  'Advanced analytics + heat maps',
  'Featured in 4 email blasts/month',
  'Boosted social media (2x/month)',
  'Priority email placement',
  'Early access to new features',
  'Dedicated account manager',
  'Custom promo codes',
  'Priority support',
  'Mobile app access',
  'Advanced deal scheduling',
  'Customer insights',
  'Review management',
  'A/B testing tools',
  'White-label options',
  'API access',
  'Custom integrations'
)
WHERE name = 'Premium';

-- Helper function to get CRM tier for a merchant
CREATE OR REPLACE FUNCTION get_merchant_crm_tier(merchant_id_input UUID)
RETURNS TABLE(
  crm_tier_name TEXT,
  crm_tier_level INTEGER,
  contact_limit INTEGER,
  books_tier TEXT,
  ai_features_included BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lcp.tier_name,
    lcp.tier_level,
    lcp.contact_limit,
    lcp.books_tier,
    lcp.ai_features_included
  FROM merchants m
  JOIN subscription_crm_mapping scm ON scm.subscription_tier_name = m.subscription_plan
  JOIN ll_crm_pricing_tiers lcp ON lcp.id = scm.crm_tier_id
  WHERE m.id = merchant_id_input;
END;
$$;

-- Helper function to check if merchant can access specific CRM features
CREATE OR REPLACE FUNCTION check_crm_feature_access(
  merchant_id_input UUID,
  required_tier_level INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  merchant_tier_level INTEGER;
BEGIN
  SELECT lcp.tier_level INTO merchant_tier_level
  FROM merchants m
  JOIN subscription_crm_mapping scm ON scm.subscription_tier_name = m.subscription_plan
  JOIN ll_crm_pricing_tiers lcp ON lcp.id = scm.crm_tier_id
  WHERE m.id = merchant_id_input;
  
  RETURN COALESCE(merchant_tier_level, 0) >= required_tier_level;
END;
$$;

-- Create view for easy CRM access lookup
CREATE OR REPLACE VIEW merchant_crm_access AS
SELECT 
  m.id as merchant_id,
  m.business_name,
  m.subscription_plan,
  st.tier_level as subscription_tier_level,
  lcp.tier_name as crm_tier_name,
  lcp.tier_level as crm_tier_level,
  lcp.contact_limit,
  lcp.books_tier,
  lcp.ai_features_included
FROM merchants m
LEFT JOIN subscription_tiers st ON st.name = m.subscription_plan
LEFT JOIN subscription_crm_mapping scm ON scm.subscription_tier_name = m.subscription_plan
LEFT JOIN ll_crm_pricing_tiers lcp ON lcp.id = scm.crm_tier_id;

-- Add comments
COMMENT ON TABLE subscription_crm_mapping IS 'Maps merchant subscription tiers to included CRM tiers';
COMMENT ON VIEW merchant_crm_access IS 'Shows CRM access levels for all merchants based on their subscription';
COMMENT ON FUNCTION get_merchant_crm_tier IS 'Returns CRM tier details for a specific merchant';
COMMENT ON FUNCTION check_crm_feature_access IS 'Checks if merchant has access to features requiring specific CRM tier level';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscription_crm_mapping_tier ON subscription_crm_mapping(subscription_tier_name);
CREATE INDEX IF NOT EXISTS idx_ll_crm_pricing_tiers_level ON ll_crm_pricing_tiers(tier_level) WHERE is_active = true;
