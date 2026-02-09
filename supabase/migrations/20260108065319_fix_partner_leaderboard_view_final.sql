/*
  # Fix Partner Leaderboard View Security - Final
  
  1. Security Fix
    - Recreates partner_leaderboard view without SECURITY DEFINER
    - Uses correct column names and enum values
    - Default view creation is SECURITY INVOKER (safe)
    
  2. Changes
    - Drop existing view
    - Recreate with proper column references
    - Uses gross_amount from transactions table
    - Uses commission_cents from affiliate_commissions table
    - Uses correct 'Active' status value
*/

-- Drop and recreate partner_leaderboard view without SECURITY DEFINER
DROP VIEW IF EXISTS partner_leaderboard CASCADE;

CREATE VIEW partner_leaderboard AS
SELECT 
  p.id,
  p.company_name,
  p.user_id,
  COUNT(DISTINCT m.id) as total_merchants,
  COUNT(DISTINCT t.id) as total_transactions,
  COALESCE(SUM(t.gross_amount), 0) as total_revenue,
  COALESCE(SUM(ac.commission_cents / 100.0), 0) as total_commissions,
  p.created_at
FROM partners p
LEFT JOIN merchants m ON m.partner_id = p.id
LEFT JOIN transactions t ON t.partner_id = p.id
LEFT JOIN affiliate_partners ap ON ap.user_id = p.user_id
LEFT JOIN affiliate_commissions ac ON ac.partner_id = ap.id
WHERE p.status = 'Active'
GROUP BY p.id, p.company_name, p.user_id, p.created_at
ORDER BY total_revenue DESC;
