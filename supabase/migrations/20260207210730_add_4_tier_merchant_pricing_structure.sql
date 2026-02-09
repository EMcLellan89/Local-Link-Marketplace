/*
  # Add 4-Tier Merchant Pricing Structure (Option B)

  1. New Tier Structure
    - **Starter** ($149/mo) - NEW entry-level tier for small businesses
    - **Founders** ($249/mo) - Locked grandfathered rate (unchanged)
    - **Standard** ($299/mo) - Most popular tier (unchanged)
    - **Premium** ($349/mo) - Top-tier visibility (unchanged)

  2. Changes Made
    - Add new "Starter" tier at $149/month with limited features
    - Update all tier feature distributions
    - Add tier_level and description columns for better management
    - Update postcard_placement constraint to allow "rotating" placement
    - Keep Founders tier locked for early adopters
    - Adjust feature access across all tiers

  3. Feature Distribution
    - Starter: Basic features, rotating placement, testing tier
    - Founders: Value placement, locked rate, grandfathered
    - Standard: Enhanced features, standard placement, most popular
    - Premium: Premium features, top-row placement, maximum visibility

  4. Strategic Benefits
    - Lower entry barrier ($149 vs $249) for micro-businesses
    - Network effect: More merchants = more customer value
    - Clear upsell path: $149 → $249 → $299 → $349
    - Volume growth strategy: 2x merchants compensates for lower ARPU
*/

-- Add new columns to subscription_tiers table
ALTER TABLE subscription_tiers 
ADD COLUMN IF NOT EXISTS tier_level INTEGER,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Drop existing check constraint
ALTER TABLE subscription_tiers 
DROP CONSTRAINT IF EXISTS subscription_tiers_postcard_placement_check;

-- Add updated check constraint that includes "rotating"
ALTER TABLE subscription_tiers 
ADD CONSTRAINT subscription_tiers_postcard_placement_check 
CHECK (postcard_placement IN ('rotating', 'value', 'standard', 'premium'));

-- Add unique constraint on name if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'subscription_tiers_name_key'
  ) THEN
    ALTER TABLE subscription_tiers ADD CONSTRAINT subscription_tiers_name_key UNIQUE (name);
  END IF;
END $$;

-- Update existing Founders tier
UPDATE subscription_tiers
SET 
  monthly_price = 249,
  postcard_placement = 'value',
  features = jsonb_build_array(
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
  ),
  is_active = true,
  tier_level = 2,
  description = 'Grandfathered early adopter rate. This exclusive pricing is locked for life and includes priority features.'
WHERE name = 'Founders';

-- Update existing Standard tier
UPDATE subscription_tiers
SET 
  monthly_price = 299,
  postcard_placement = 'standard',
  features = jsonb_build_array(
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
  ),
  is_active = true,
  tier_level = 3,
  description = 'Most popular tier for established businesses. Get priority placement and enhanced marketing features.'
WHERE name = 'Standard';

-- Update existing Premium tier
UPDATE subscription_tiers
SET 
  monthly_price = 349,
  postcard_placement = 'premium',
  features = jsonb_build_array(
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
  ),
  is_active = true,
  tier_level = 4,
  description = 'Maximum visibility for high-volume businesses. Get top-row placement and dedicated account management.'
WHERE name = 'Premium';

-- Insert new Starter tier (only if it doesn't exist)
INSERT INTO subscription_tiers (
  name,
  monthly_price,
  postcard_placement,
  features,
  is_active,
  tier_level,
  description
)
SELECT 
  'Starter',
  149,
  'rotating',
  jsonb_build_array(
    '1 postcard spot (rotating placement)',
    'Basic marketplace listing',
    'Business directory',
    'QR code redemption',
    'Basic analytics (impressions only)',
    'Standard customer support',
    'Mobile app access',
    'Deal scheduling'
  ),
  true,
  1,
  'Perfect for new businesses testing the platform. Get started with essential features at an affordable price.'
WHERE NOT EXISTS (
  SELECT 1 FROM subscription_tiers WHERE name = 'Starter'
);

-- Add comments for documentation
COMMENT ON COLUMN subscription_tiers.tier_level IS 'Tier hierarchy: 1=Starter, 2=Founders, 3=Standard, 4=Premium';
COMMENT ON COLUMN subscription_tiers.postcard_placement IS 'Placement types: rotating=bottom/random, value=middle, standard=good, premium=top-row';
COMMENT ON COLUMN subscription_tiers.description IS 'Marketing description for tier selection pages';

-- Create helper function to check if merchant is on locked Founders tier
CREATE OR REPLACE FUNCTION is_locked_founders_tier(merchant_id_input UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_tier TEXT;
BEGIN
  SELECT st.name INTO current_tier
  FROM merchants m
  JOIN subscription_tiers st ON m.subscription_plan = st.name
  WHERE m.id = merchant_id_input;
  
  RETURN current_tier = 'Founders';
END;
$$;

-- Create helper function to get allowed tier changes (prevent Founders downgrade)
CREATE OR REPLACE FUNCTION get_allowed_tier_changes(current_tier_name TEXT)
RETURNS TABLE(tier_name TEXT, tier_level INTEGER, monthly_price NUMERIC, can_switch BOOLEAN, reason TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Founders tier: Can upgrade but cannot downgrade
  IF current_tier_name = 'Founders' THEN
    RETURN QUERY
    SELECT 
      st.name,
      st.tier_level,
      st.monthly_price,
      st.tier_level >= 2 as can_switch,
      CASE 
        WHEN st.tier_level < 2 THEN 'Cannot downgrade from Founders tier (locked rate)'
        ELSE 'Upgrade available'
      END as reason
    FROM subscription_tiers st
    WHERE st.is_active = true
    ORDER BY st.tier_level;
  
  -- All other tiers: Can switch to any tier
  ELSE
    RETURN QUERY
    SELECT 
      st.name,
      st.tier_level,
      st.monthly_price,
      true as can_switch,
      'Tier change available' as reason
    FROM subscription_tiers st
    WHERE st.is_active = true
    ORDER BY st.tier_level;
  END IF;
END;
$$;

-- Add indexes for faster tier lookups
CREATE INDEX IF NOT EXISTS idx_subscription_tiers_tier_level ON subscription_tiers(tier_level) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_merchants_subscription_plan ON merchants(subscription_plan) WHERE subscription_plan IS NOT NULL;

-- Create view for tier comparison display
CREATE OR REPLACE VIEW tier_comparison_view AS
SELECT 
  name,
  tier_level,
  monthly_price,
  (monthly_price * 12 * 0.89)::NUMERIC(10,2) as annual_price,  -- 11% annual discount
  postcard_placement,
  features,
  description,
  CASE 
    WHEN name = 'Starter' THEN 'Best for getting started'
    WHEN name = 'Founders' THEN 'Locked rate for early adopters'
    WHEN name = 'Standard' THEN 'Most Popular'
    WHEN name = 'Premium' THEN 'Maximum Visibility'
  END as badge_text
FROM subscription_tiers
WHERE is_active = true
ORDER BY tier_level;

COMMENT ON VIEW tier_comparison_view IS 'Easy display of all tiers with computed annual pricing';
