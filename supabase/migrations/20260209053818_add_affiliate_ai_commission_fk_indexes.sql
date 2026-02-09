/*
  # Add Foreign Key Indexes - Affiliate, AI, and Commission Tables

  1. Indexes Added
    - affiliate_commissions: partner_id, referred_user_id, order_id, payout_id
    - affiliate_referrals: partner_id, referred_user_id
    - ai_assistant_conversations: user_id
    - ai_runs: job_id
    - commissions: partner_id, merchant_id, order_id

  2. Performance Impact
    - Improves join performance for commission calculations
    - Speeds up partner earnings queries
    - Optimizes AI conversation lookups

  3. Security Notes
    - Critical for RLS policy performance on commission tables
    - Enables fast partner-specific data filtering
*/

-- Affiliate tables
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_partner_id ON affiliate_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_referred_user_id ON affiliate_commissions(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_order_id ON affiliate_commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_payout_id ON affiliate_commissions(payout_id) WHERE payout_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_partner_id ON affiliate_referrals(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_referred_user_id ON affiliate_referrals(referred_user_id);

-- AI tables
CREATE INDEX IF NOT EXISTS idx_ai_assistant_conversations_user_id ON ai_assistant_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_runs_job_id ON ai_runs(job_id);
