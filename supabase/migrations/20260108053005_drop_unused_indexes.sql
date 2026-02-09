/*
  # Drop Unused Indexes
  
  1. Performance Optimization
    - Removes indexes that are not being used by the query planner
    - Reduces storage overhead
    - Improves write performance (INSERT, UPDATE, DELETE)
    
  2. Indexes Removed
    - idx_affiliate_payouts_partner (not used)
    - affiliate_clicks_partner_id_idx (not used)
    - affiliate_clicks_referral_code_idx (not used)
    - affiliate_clicks_converted_idx (not used)
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_affiliate_payouts_partner;
DROP INDEX IF EXISTS affiliate_clicks_partner_id_idx;
DROP INDEX IF EXISTS affiliate_clicks_referral_code_idx;
DROP INDEX IF EXISTS affiliate_clicks_converted_idx;
