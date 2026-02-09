/*
  # Fix Remaining Function Search Paths
  
  1. Security Fix
    - Adds explicit search_path to remaining functions
    - Prevents search_path hijacking attacks
    
  2. Functions Fixed
    - quarter_date_range(text)
    - get_partner_quarterly_revenue(uuid, text)
    
  Note: The integer parameter versions already have search_path set
*/

-- Fix quarter_date_range(text) version
DROP FUNCTION IF EXISTS quarter_date_range(text);
CREATE FUNCTION quarter_date_range(p_quarter text)
RETURNS TABLE(start_date date, end_date date)
LANGUAGE plpgsql
STABLE
SET search_path = public, pg_catalog
AS $$
DECLARE
  y int;
  q int;
BEGIN
  y := split_part(p_quarter, '-', 1)::int;
  q := replace(split_part(p_quarter, '-', 2), 'Q', '')::int;
  
  IF q = 1 THEN
    start_date := make_date(y,1,1);  
    end_date := make_date(y,4,1);
  ELSIF q = 2 THEN
    start_date := make_date(y,4,1);  
    end_date := make_date(y,7,1);
  ELSIF q = 3 THEN
    start_date := make_date(y,7,1);  
    end_date := make_date(y,10,1);
  ELSE
    start_date := make_date(y,10,1); 
    end_date := make_date(y+1,1,1);
  END IF;
  
  RETURN NEXT;
END;
$$;

-- Fix get_partner_quarterly_revenue(uuid, text) version
DROP FUNCTION IF EXISTS get_partner_quarterly_revenue(uuid, text);
CREATE FUNCTION get_partner_quarterly_revenue(p_partner_id uuid, p_quarter text)
RETURNS TABLE(total_revenue_cents bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  RETURN QUERY
  SELECT COALESCE(SUM(car.order_amount_cents), 0)::bigint as total_revenue_cents
  FROM course_affiliate_referrals car
  JOIN course_affiliates ca ON ca.id = car.affiliate_id
  WHERE ca.user_id = p_partner_id
    AND car.status IN ('pending', 'approved', 'paid')
    AND to_char(car.created_at, 'Q-YYYY') = p_quarter;
END;
$$;
