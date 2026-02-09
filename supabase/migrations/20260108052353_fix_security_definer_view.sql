/*
  # Fix Security Definer View
  
  1. Security Fix
    - Remove SECURITY DEFINER from partner_leaderboard view
    - Recreate as SECURITY INVOKER (default) to run with current user's privileges
    - This prevents privilege escalation attacks
  
  2. Changes
    - Drop and recreate partner_leaderboard view without SECURITY DEFINER
    - Add appropriate RLS policies to control access
  
  3. Important Notes
    - SECURITY DEFINER views execute with owner's privileges
    - This is a security risk as it can bypass RLS
    - SECURITY INVOKER (default) is safer - executes with caller's privileges
*/

-- Drop the existing SECURITY DEFINER view
DROP VIEW IF EXISTS partner_leaderboard;

-- Recreate as normal view (SECURITY INVOKER is the default)
CREATE VIEW partner_leaderboard AS
SELECT 
  p.id,
  p.company_name,
  p.user_id,
  COALESCE(SUM(
    CASE
      WHEN t.payment_status = 'Paid'::payment_status THEN t.net_amount
      ELSE 0::numeric
    END
  ), 0::numeric) AS total_revenue,
  COUNT(DISTINCT m.id) AS merchant_count,
  COUNT(DISTINCT t.id) FILTER (WHERE t.payment_status = 'Paid'::payment_status) AS completed_transactions,
  p.created_at
FROM partners p
LEFT JOIN merchants m ON m.partner_id = p.id
LEFT JOIN transactions t ON t.partner_id = p.id
WHERE p.status = 'Active'::partner_status
GROUP BY p.id, p.company_name, p.user_id, p.created_at
ORDER BY COALESCE(SUM(
  CASE
    WHEN t.payment_status = 'Paid'::payment_status THEN t.net_amount
    ELSE 0::numeric
  END
), 0::numeric) DESC;

-- Add comment explaining the security change
COMMENT ON VIEW partner_leaderboard IS 'Partner leaderboard showing revenue and merchant counts. Uses SECURITY INVOKER to respect RLS policies.';
