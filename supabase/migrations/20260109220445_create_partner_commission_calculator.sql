/*
  # Partner Commission Calculator Function

  1. Purpose
    - Calculate partner commission based on tier, product type, and fulfillment method
    - Calculate upline 7% bonus on all commissions
    - Handle different commission types: fixed, job_board, recurring, one-time

  2. Commission Rules
    - Recurring CRM: Partner tier % (15%/20%/25%) monthly
    - Courses: Partner tier % one-time
    - Fixed services: $75 or $100 fixed amount
    - Job board: 7% if outsourced, tier % if self-fulfilled
    - Upline: Always 7% of partner's commission
    - Partner must be active to receive commissions
*/

CREATE OR REPLACE FUNCTION calculate_partner_commission(
  p_partner_id uuid,
  p_product_sku text,
  p_self_fulfilled boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_partner_tier text;
  v_partner_active boolean;
  v_commission_rate numeric;
  v_product record;
  v_partner_commission_cents int;
  v_upline_commission_cents int;
  v_result jsonb;
BEGIN
  -- Get partner details
  SELECT tier, status = 'active' INTO v_partner_tier, v_partner_active
  FROM partners
  WHERE id = p_partner_id;
  
  IF v_partner_tier IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Partner not found'
    );
  END IF;
  
  IF NOT v_partner_active THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Partner is not active',
      'partner_commission_cents', 0,
      'upline_commission_cents', 0
    );
  END IF;
  
  -- Get commission rate based on tier
  v_commission_rate := CASE v_partner_tier
    WHEN 'starter' THEN 0.15
    WHEN 'pro' THEN 0.20
    WHEN 'enterprise' THEN 0.25
    ELSE 0.15
  END;
  
  -- Get product details
  SELECT * INTO v_product
  FROM marketplace_affiliate_products
  WHERE sku = p_product_sku AND active = true;
  
  IF v_product IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Product not found or inactive'
    );
  END IF;
  
  -- Calculate commission based on product category/type
  CASE 
    -- Fixed commission services
    WHEN v_product.category = 'fixed_commission' THEN
      v_partner_commission_cents := (v_product.metadata->>'fixed_commission_cents')::int;
    
    -- Job board services
    WHEN v_product.category = 'job_board' THEN
      IF p_self_fulfilled THEN
        -- Partner does the work: tier % commission
        v_partner_commission_cents := ROUND(v_product.price_cents * v_commission_rate);
      ELSE
        -- Outsourced or admin does it: 7% commission
        v_partner_commission_cents := ROUND(v_product.price_cents * 0.07);
      END IF;
    
    -- Merchant CRM or regular products: tier % commission
    WHEN v_product.category IN ('merchant_crm', 'course', 'crm') THEN
      v_partner_commission_cents := ROUND(v_product.price_cents * v_commission_rate);
    
    -- Default: tier % commission
    ELSE
      v_partner_commission_cents := ROUND(v_product.price_cents * v_commission_rate);
  END CASE;
  
  -- Calculate upline 7% bonus (based on partner's commission)
  v_upline_commission_cents := ROUND(v_partner_commission_cents * 0.07);
  
  -- Build result
  v_result := jsonb_build_object(
    'success', true,
    'partner_commission_cents', v_partner_commission_cents,
    'upline_commission_cents', v_upline_commission_cents,
    'partner_tier', v_partner_tier,
    'commission_rate', v_commission_rate,
    'product_name', v_product.name,
    'product_price_cents', v_product.price_cents,
    'product_category', v_product.category,
    'recurring', v_product.recurring,
    'self_fulfilled', p_self_fulfilled
  );
  
  RETURN v_result;
END;
$$;

-- Create function to get all commissionable products for display
CREATE OR REPLACE FUNCTION get_commissionable_products()
RETURNS TABLE (
  sku text,
  name text,
  type text,
  price_cents int,
  category text,
  recurring boolean,
  description text,
  starter_commission_cents int,
  pro_commission_cents int,
  enterprise_commission_cents int,
  upline_bonus_cents int
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.sku,
    p.name,
    p.type,
    p.price_cents,
    p.category,
    COALESCE(p.recurring, false) as recurring,
    p.description,
    -- Calculate commissions for each tier
    CASE 
      WHEN p.category = 'fixed_commission' THEN (p.metadata->>'fixed_commission_cents')::int
      WHEN p.category = 'job_board' THEN ROUND(p.price_cents * 0.15)::int -- Assuming self-fulfilled
      ELSE ROUND(p.price_cents * 0.15)::int
    END as starter_commission_cents,
    CASE 
      WHEN p.category = 'fixed_commission' THEN (p.metadata->>'fixed_commission_cents')::int
      WHEN p.category = 'job_board' THEN ROUND(p.price_cents * 0.20)::int
      ELSE ROUND(p.price_cents * 0.20)::int
    END as pro_commission_cents,
    CASE 
      WHEN p.category = 'fixed_commission' THEN (p.metadata->>'fixed_commission_cents')::int
      WHEN p.category = 'job_board' THEN ROUND(p.price_cents * 0.25)::int
      ELSE ROUND(p.price_cents * 0.25)::int
    END as enterprise_commission_cents,
    -- Upline bonus (7% of starter commission as example)
    ROUND(
      CASE 
        WHEN p.category = 'fixed_commission' THEN (p.metadata->>'fixed_commission_cents')::int
        ELSE ROUND(p.price_cents * 0.15)::int
      END * 0.07
    )::int as upline_bonus_cents
  FROM marketplace_affiliate_products p
  WHERE p.active = true
    AND p.category IS NOT NULL
    AND p.category NOT IN ('no_commission') -- Exclude non-commissionable items
  ORDER BY 
    CASE p.category
      WHEN 'merchant_crm' THEN 1
      WHEN 'fixed_commission' THEN 2
      WHEN 'job_board' THEN 3
      WHEN 'course' THEN 4
      ELSE 5
    END,
    p.price_cents DESC;
END;
$$;
