/*
  # Add Business Coaching to Marketplace Products

  1. Changes
    - Add business coaching packages as marketplace affiliate products
    - Enable partner commission tracking for coaching sales
    - Commission rate: 20% (2000 basis points) for all tiers
    - Partners earn based on their tier level when sold to their merchants

  2. Commission Structure
    - Base commission: 20% of sale price
    - Bronze tier: 10% commission
    - Silver tier: 15% commission
    - Gold tier: 20% commission
    - Platinum tier: 25% commission
    - Upline bonus: 5% for referring partner
*/

-- Add business coaching packages to marketplace
INSERT INTO marketplace_affiliate_products (
  sku,
  name,
  type,
  price_cents,
  currency,
  commission_rate_bp,
  active,
  stripe_price_id
)
VALUES
  (
    'COACH-SINGLE-297',
    'Business Coach - Single Strategy Session',
    'service',
    29700,
    'USD',
    2000,
    true,
    NULL
  ),
  (
    'COACH-MONTHLY-997',
    'Business Coach - Monthly Growth Package',
    'service',
    99700,
    'USD',
    2000,
    true,
    NULL
  ),
  (
    'COACH-QUARTERLY-2497',
    'Business Coach - Quarterly Transformation',
    'service',
    249700,
    'USD',
    2000,
    true,
    NULL
  ),
  (
    'COACH-STARTUP-4997',
    'Business Coach - Startup Launch Package',
    'service',
    499700,
    'USD',
    2000,
    true,
    NULL
  )
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  active = EXCLUDED.active;

-- Function to create commission when business coaching is purchased
CREATE OR REPLACE FUNCTION create_coaching_commission(
  p_booking_id uuid,
  p_merchant_id uuid,
  p_package_price_cents integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_partner_id uuid;
  v_partner_tier text;
  v_commission_rate numeric;
  v_commission_amount_cents integer;
  v_upline_partner_id uuid;
  v_upline_commission_cents integer;
BEGIN
  -- Get the partner who referred this merchant
  SELECT partner_id INTO v_partner_id
  FROM merchants
  WHERE id = p_merchant_id AND partner_id IS NOT NULL;

  -- If no partner, exit
  IF v_partner_id IS NULL THEN
    RETURN;
  END IF;

  -- Get partner tier
  SELECT tier INTO v_partner_tier
  FROM partners
  WHERE id = v_partner_id;

  -- Calculate commission based on tier
  v_commission_rate := CASE COALESCE(v_partner_tier, 'bronze')
    WHEN 'bronze' THEN 0.10
    WHEN 'silver' THEN 0.15
    WHEN 'gold' THEN 0.20
    WHEN 'platinum' THEN 0.25
    ELSE 0.10
  END;

  v_commission_amount_cents := FLOOR(p_package_price_cents * v_commission_rate);

  -- Create commission record
  INSERT INTO partner_ai_commissions (
    partner_id,
    amount_cents,
    status,
    reason,
    metadata
  ) VALUES (
    v_partner_id,
    v_commission_amount_cents,
    'pending',
    'Business Coaching Sale',
    jsonb_build_object(
      'booking_id', p_booking_id,
      'merchant_id', p_merchant_id,
      'package_price_cents', p_package_price_cents,
      'commission_rate', v_commission_rate,
      'tier', v_partner_tier
    )
  );

  -- Check for upline partner (if this partner was referred by another partner)
  SELECT referred_by_partner_id INTO v_upline_partner_id
  FROM partners
  WHERE id = v_partner_id AND referred_by_partner_id IS NOT NULL;

  -- Create upline bonus commission (5% of sale)
  IF v_upline_partner_id IS NOT NULL THEN
    v_upline_commission_cents := FLOOR(p_package_price_cents * 0.05);
    
    INSERT INTO partner_ai_commissions (
      partner_id,
      amount_cents,
      status,
      reason,
      metadata
    ) VALUES (
      v_upline_partner_id,
      v_upline_commission_cents,
      'pending',
      'Business Coaching Upline Bonus',
      jsonb_build_object(
        'booking_id', p_booking_id,
        'merchant_id', p_merchant_id,
        'downline_partner_id', v_partner_id,
        'package_price_cents', p_package_price_cents
      )
    );

    -- Update upline partner's total commission earned
    UPDATE partners
    SET total_commission_earned = total_commission_earned + v_upline_commission_cents
    WHERE id = v_upline_partner_id;
  END IF;

  -- Update partner's total commission earned
  UPDATE partners
  SET total_commission_earned = total_commission_earned + v_commission_amount_cents
  WHERE id = v_partner_id;
END;
$$;