/*
  # Add Missing Foreign Key Indexes - Batch 17: Marketplace Affiliates (Final)

  1. Changes
    - Add indexes for marketplace_affiliate_referrals (marketplace_affiliate_id, referred_user_id)
    - Add indexes for marketplace_affiliate_commissions (marketplace_affiliate_id, referral_id)
    - Add indexes for marketplace_affiliate_payouts (marketplace_affiliate_id)
    - Add indexes for marketplace_affiliate_subscription_locks (marketplace_affiliate_id, commission_id)
    
  2. Rationale
    - Marketplace affiliate tracking requires fast queries
    - Commission calculations need efficient referral lookups
    - Payout processing needs affiliate filtering
    
  3. Performance Impact
    - Faster affiliate dashboard loading
    - Better commission calculation performance
    - Improved payout processing
*/

-- Marketplace Affiliate Referrals
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_referrals_marketplace_affiliate_id ON marketplace_affiliate_referrals(marketplace_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_referrals_referred_user_id ON marketplace_affiliate_referrals(referred_user_id);

-- Marketplace Affiliate Commissions
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_commissions_marketplace_affiliate_id ON marketplace_affiliate_commissions(marketplace_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_commissions_referral_id ON marketplace_affiliate_commissions(referral_id);

-- Marketplace Affiliate Payouts
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_payouts_marketplace_affiliate_id ON marketplace_affiliate_payouts(marketplace_affiliate_id);

-- Marketplace Affiliate Subscription Locks
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_subscription_locks_marketplace_affiliate_id ON marketplace_affiliate_subscription_locks(marketplace_affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_subscription_locks_commission_id ON marketplace_affiliate_subscription_locks(commission_id);
