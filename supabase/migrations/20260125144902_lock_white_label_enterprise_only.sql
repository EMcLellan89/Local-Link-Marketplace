/*
  # Lock White-Label to Enterprise Tier Only

  1. Database Constraints
    - Add CHECK constraint to ensure white_label_enabled is only true for Enterprise tier
    - Add comments documenting this business rule
    
  2. Function Enforcement
    - Create function to validate white-label access
    - Partners must have Enterprise tier to use white-label features
    
  3. Security
    - Prevents any tier other than Enterprise from enabling white-label
    - Documents the $1,798/month requirement
*/

-- Add CHECK constraint to enforce white-label = Enterprise only
ALTER TABLE partner_tiers DROP CONSTRAINT IF EXISTS white_label_enterprise_only;

ALTER TABLE partner_tiers ADD CONSTRAINT white_label_enterprise_only
  CHECK (
    (white_label_enabled = false) OR 
    (white_label_enabled = true AND monthly_cost_usd >= 1798)
  );

COMMENT ON CONSTRAINT white_label_enterprise_only ON partner_tiers IS 
  'BUSINESS RULE: White-label access is ONLY available for Enterprise tier ($1,798/month). This cannot be overridden.';

COMMENT ON COLUMN partner_tiers.white_label_enabled IS 
  'White-label multi-tenancy. LOCKED to Enterprise tier only ($1,798/month). Partners at Starter ($297) or Pro ($797) tiers CANNOT access white-label features.';

-- Create helper function to check white-label eligibility
CREATE OR REPLACE FUNCTION check_partner_white_label_access(p_partner_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tier_key text;
  v_white_label_enabled boolean;
BEGIN
  -- Get partner's current tier
  SELECT tier INTO v_tier_key
  FROM partners
  WHERE id = p_partner_id;
  
  IF v_tier_key IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if tier has white-label enabled
  SELECT white_label_enabled INTO v_white_label_enabled
  FROM partner_tiers
  WHERE key = v_tier_key;
  
  RETURN COALESCE(v_white_label_enabled, false);
END;
$$;

COMMENT ON FUNCTION check_partner_white_label_access IS 
  'Returns true only if partner has Enterprise tier ($1,798/month) with white-label access. All other tiers return false.';

-- Verify current configuration is correct
DO $$
DECLARE
  v_starter_wl boolean;
  v_pro_wl boolean;
  v_enterprise_wl boolean;
BEGIN
  SELECT white_label_enabled INTO v_starter_wl FROM partner_tiers WHERE key = 'starter';
  SELECT white_label_enabled INTO v_pro_wl FROM partner_tiers WHERE key = 'pro';
  SELECT white_label_enabled INTO v_enterprise_wl FROM partner_tiers WHERE key = 'enterprise';
  
  IF v_starter_wl = true OR v_pro_wl = true THEN
    RAISE EXCEPTION 'SECURITY VIOLATION: White-label must ONLY be enabled for Enterprise tier';
  END IF;
  
  IF v_enterprise_wl = false THEN
    RAISE EXCEPTION 'CONFIGURATION ERROR: Enterprise tier must have white-label enabled';
  END IF;
  
  RAISE NOTICE 'White-label configuration validated: LOCKED to Enterprise tier only';
END $$;
