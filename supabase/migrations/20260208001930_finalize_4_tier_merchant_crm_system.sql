/*
  # Finalize 4-Tier Merchant CRM System

  1. Changes
    - Remove Enterprise Plus tier from merchant access (keep for partners/internal only)
    - Confirm 4-tier merchant structure: Starter, Founders, Standard, Premium
    - Update tier descriptions to emphasize included CRM value
    - Add tier comparison metadata
    
  2. Merchant Tiers (Final)
    - Starter ($149/mo): Starter CRM (500 contacts) + No accounting
    - Founders ($249/mo): Professional CRM (5,000 contacts) + Books Lite
    - Standard ($299/mo): Business CRM (25,000 contacts) + Books Pro
    - Premium ($349/mo): Enterprise CRM (100,000 contacts) + Books Pro
    
  3. Pricing Philosophy
    - CRM is INCLUDED in subscription price (not added separately)
    - Each tier provides progressively more value
    - Clear upgrade path based on business growth
*/

-- Update tier features to emphasize CRM is included
UPDATE subscription_tiers
SET 
  features = jsonb_build_array(
    '✓ Starter CRM included (500 contacts)',
    '✓ Contact management & basic pipeline',
    '✓ 1 postcard spot (rotating placement)',
    '✓ Basic marketplace listing',
    '✓ Business directory',
    '✓ QR code redemption',
    '✓ Deal scheduling',
    '✓ Basic analytics',
    '✓ Mobile app access',
    '✓ Email support'
  ),
  description = 'Everything you need to start - CRM, deals, and marketing in one simple price'
WHERE name = 'Starter';

UPDATE subscription_tiers
SET 
  features = jsonb_build_array(
    '✓ Professional CRM included (5,000 contacts)',
    '✓ Local-Link Books Lite included',
    '✓ Advanced contact management & pipelines',
    '✓ Email marketing & automation',
    '✓ 1 postcard spot (value placement)',
    '✓ Enhanced analytics dashboard',
    '✓ Email promotion (1x monthly)',
    '✓ Customer insights & segmentation',
    '✓ Review management',
    '✓ Advanced deal scheduling',
    '✓ FOUNDERS RATE LOCKED FOR LIFE',
    '✓ Priority support'
  ),
  description = 'Best value for growing businesses - Lock in this rate forever'
WHERE name = 'Founders';

UPDATE subscription_tiers
SET 
  features = jsonb_build_array(
    '✓ Business CRM included (25,000 contacts)',
    '✓ Local-Link Books Pro included',
    '✓ Full CRM suite with automation',
    '✓ Email & SMS marketing',
    '✓ Custom workflows & pipelines',
    '✓ 1 postcard spot (standard placement)',
    '✓ Priority marketplace listing',
    '✓ Featured in 2 email blasts/month',
    '✓ Social media feature (1x/month)',
    '✓ A/B testing tools',
    '✓ Custom branding options',
    '✓ Advanced reporting & forecasting',
    '✓ Priority support'
  ),
  description = 'Most popular for established businesses - Complete CRM & accounting suite'
WHERE name = 'Standard';

UPDATE subscription_tiers
SET 
  features = jsonb_build_array(
    '✓ Enterprise CRM included (100,000 contacts)',
    '✓ Local-Link Books Pro included',
    '✓ Enterprise-grade CRM with AI',
    '✓ Unlimited email & SMS',
    '✓ Advanced automation & workflows',
    '✓ TOP ROW premium placement',
    '✓ Featured deal badge',
    '✓ Priority marketplace listing',
    '✓ Featured in 4 email blasts/month',
    '✓ Boosted social media (2x/month)',
    '✓ White-label options',
    '✓ API access',
    '✓ Custom integrations',
    '✓ Dedicated account manager',
    '✓ 24/7 priority support'
  ),
  description = 'Maximum visibility and features - Enterprise CRM & complete marketing suite'
WHERE name = 'Premium';

-- Add metadata about CRM pricing strategy
COMMENT ON TABLE subscription_tiers IS 'Merchant subscription tiers with CRM and accounting INCLUDED in price. No separate CRM purchase required.';
COMMENT ON TABLE subscription_crm_mapping IS 'Maps subscription tiers to included CRM capabilities. CRM is bundled, not sold separately.';

-- Create view showing full value breakdown per tier
CREATE OR REPLACE VIEW merchant_tier_value_breakdown AS
SELECT 
  st.name as tier_name,
  st.tier_level,
  st.monthly_price::numeric as monthly_price,
  (st.monthly_price::numeric * 12 * 0.9)::numeric(10,2) as annual_price_estimate,
  lcp.tier_name as included_crm,
  lcp.contact_limit as crm_contacts,
  lcp.books_tier as included_accounting,
  st.postcard_placement,
  st.features,
  CASE 
    WHEN st.name = 'Founders' THEN 'LOCKED RATE FOR LIFE'
    WHEN st.name = 'Standard' THEN 'MOST POPULAR'
    WHEN st.name = 'Premium' THEN 'BEST VALUE'
    ELSE NULL
  END as badge,
  CASE
    WHEN st.name = 'Starter' THEN 'Perfect for solo businesses just getting started'
    WHEN st.name = 'Founders' THEN 'Lock in this rate forever - best for growing businesses'
    WHEN st.name = 'Standard' THEN 'Complete suite for established businesses'
    WHEN st.name = 'Premium' THEN 'Enterprise features with maximum visibility'
  END as marketing_message
FROM subscription_tiers st
LEFT JOIN subscription_crm_mapping scm ON scm.subscription_tier_name = st.name
LEFT JOIN ll_crm_pricing_tiers lcp ON lcp.id = scm.crm_tier_id
WHERE st.is_active = true
ORDER BY st.tier_level;

-- Add helper to check if merchant can upgrade
CREATE OR REPLACE FUNCTION can_merchant_upgrade_to_tier(
  merchant_id_input UUID,
  target_tier_name TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_tier_level INTEGER;
  target_tier_level INTEGER;
BEGIN
  -- Get current tier level
  SELECT st.tier_level INTO current_tier_level
  FROM merchants m
  JOIN subscription_tiers st ON st.name = m.subscription_plan
  WHERE m.id = merchant_id_input;
  
  -- Get target tier level
  SELECT tier_level INTO target_tier_level
  FROM subscription_tiers
  WHERE name = target_tier_name AND is_active = true;
  
  -- Can upgrade if target tier is higher
  RETURN COALESCE(target_tier_level, 0) > COALESCE(current_tier_level, 0);
END;
$$;

-- Update CRM tier descriptions
UPDATE ll_crm_pricing_tiers
SET 
  description = 'Included with Starter subscription - Essential contact management for small businesses'
WHERE tier_level = 1;

UPDATE ll_crm_pricing_tiers
SET 
  description = 'Included with Founders subscription - Professional CRM with email marketing and Books Lite accounting'
WHERE tier_level = 2;

UPDATE ll_crm_pricing_tiers
SET 
  description = 'Included with Standard subscription - Advanced CRM with SMS, automation, and Books Pro accounting'
WHERE tier_level = 3;

UPDATE ll_crm_pricing_tiers
SET 
  description = 'Included with Premium subscription - Enterprise CRM with AI, unlimited communications, and Books Pro accounting'
WHERE tier_level = 4;

-- Mark Enterprise Plus as internal/partner only (not for merchant subscriptions)
UPDATE ll_crm_pricing_tiers
SET 
  description = 'Custom enterprise solution for partners and internal use only - Contact sales'
WHERE tier_level = 5;

COMMENT ON VIEW merchant_tier_value_breakdown IS 'Shows complete value proposition for each merchant tier including all bundled features';
COMMENT ON FUNCTION can_merchant_upgrade_to_tier IS 'Checks if merchant can upgrade to a specific tier (must be higher than current)';
