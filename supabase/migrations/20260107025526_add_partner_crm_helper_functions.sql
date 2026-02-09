/*
  # Add Partner CRM Helper Functions

  Helper functions for Partner CRM subscription management:
  
  1. Release withheld commissions when subscription reactivated
  2. Get partner quarterly revenue for bonus tracking
*/

-- Function to release withheld commissions when Partner CRM reactivated
CREATE OR REPLACE FUNCTION public.release_withheld_commissions(p_partner_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE course_affiliate_referrals
  SET status = 'pending'
  WHERE affiliate_id IN (
    SELECT id FROM course_affiliates WHERE user_id = p_partner_id
  )
  AND status = 'withheld';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get partner quarterly revenue
CREATE OR REPLACE FUNCTION public.get_partner_quarterly_revenue(
  p_partner_id uuid,
  p_quarter text
)
RETURNS TABLE(
  total_revenue_cents bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT COALESCE(SUM(car.order_amount_cents), 0)::bigint as total_revenue_cents
  FROM course_affiliate_referrals car
  JOIN course_affiliates ca ON ca.id = car.affiliate_id
  WHERE ca.user_id = p_partner_id
  AND car.status IN ('pending', 'approved', 'paid')
  AND to_char(car.created_at, 'Q-YYYY') = p_quarter;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;