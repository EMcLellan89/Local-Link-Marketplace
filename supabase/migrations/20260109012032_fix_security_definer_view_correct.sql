/*
  # Fix Security Definer View
  
  1. Changes
    - Change partner_leaderboard view from SECURITY DEFINER to SECURITY INVOKER
    - This ensures the view respects RLS policies and runs with the caller's privileges
    
  2. Security Impact
    - Previously, the view bypassed RLS policies (security risk)
    - Now, the view respects RLS policies on underlying tables
    - Users can only see data they have permission to access
*/

-- Drop the existing view
DROP VIEW IF EXISTS public.partner_leaderboard;

-- Recreate with SECURITY INVOKER (correct syntax in PostgreSQL 15+)
CREATE VIEW public.partner_leaderboard 
WITH (security_invoker = true)
AS
SELECT 
  p.id,
  p.company_name,
  p.user_id,
  count(DISTINCT m.id) AS total_merchants,
  count(DISTINCT t.id) AS total_transactions,
  COALESCE(sum(t.gross_amount), 0::numeric) AS total_revenue,
  COALESCE(sum(ac.commission_cents::numeric / 100.0), 0::numeric) AS total_commissions,
  p.created_at
FROM partners p
  LEFT JOIN merchants m ON m.partner_id = p.id
  LEFT JOIN transactions t ON t.partner_id = p.id
  LEFT JOIN affiliate_partners ap ON ap.user_id = p.user_id
  LEFT JOIN affiliate_commissions ac ON ac.partner_id = ap.id
WHERE p.status = 'Active'::partner_status
GROUP BY p.id, p.company_name, p.user_id, p.created_at
ORDER BY (COALESCE(sum(t.gross_amount), 0::numeric)) DESC;

-- Add comment
COMMENT ON VIEW public.partner_leaderboard IS 
'Partner performance leaderboard. Uses security_invoker to respect RLS policies on underlying tables.';
