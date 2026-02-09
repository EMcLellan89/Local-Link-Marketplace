/*
  # Add Missing Foreign Key Indexes on Affiliate Tables
  
  1. Performance Fix
    - Adds missing foreign key indexes for optimal query performance
    - Improves JOIN performance and foreign key constraint checks
    
  2. Indexes Added
    - affiliate_clicks.partner_id
    - affiliate_payouts.partner_id
*/

-- Add missing foreign key indexes
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_partner_id 
  ON affiliate_clicks(partner_id);

CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_partner_id 
  ON affiliate_payouts(partner_id);
