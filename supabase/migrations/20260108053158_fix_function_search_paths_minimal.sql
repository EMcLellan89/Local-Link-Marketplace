/*
  # Fix Function Search Paths - Minimal
  
  1. Security Improvements
    - Adds explicit search_path to functions to prevent search_path hijacking
    - Sets search_path to 'public, pg_catalog' for security
    
  2. Functions Fixed
    - quarter_date_range
    - get_partner_quarterly_revenue
*/

-- Fix function: quarter_date_range
DROP FUNCTION IF EXISTS quarter_date_range(int, int) CASCADE;
CREATE FUNCTION quarter_date_range(p_year int, p_quarter int)
RETURNS TABLE(start_date date, end_date date)
LANGUAGE plpgsql
STABLE
SET search_path = public, pg_catalog
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (DATE (p_year || '-' || ((p_quarter - 1) * 3 + 1) || '-01'))::date AS start_date,
    (DATE (p_year || '-' || ((p_quarter - 1) * 3 + 3) || '-01') + INTERVAL '1 month - 1 day')::date AS end_date;
END;
$$;

-- Fix function: get_partner_quarterly_revenue
DROP FUNCTION IF EXISTS get_partner_quarterly_revenue(uuid, int, int) CASCADE;
CREATE FUNCTION get_partner_quarterly_revenue(
  p_partner_id uuid,
  p_year int,
  p_quarter int
)
RETURNS numeric
LANGUAGE plpgsql
STABLE
SET search_path = public, pg_catalog
AS $$
DECLARE
  v_revenue numeric;
  v_date_range record;
BEGIN
  SELECT * INTO v_date_range FROM quarter_date_range(p_year, p_quarter);
  
  SELECT COALESCE(SUM(amount), 0)
  INTO v_revenue
  FROM transactions
  WHERE partner_id = p_partner_id
    AND transaction_date >= v_date_range.start_date
    AND transaction_date <= v_date_range.end_date
    AND status = 'completed';
  
  RETURN v_revenue;
END;
$$;
