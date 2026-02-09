/*
  # Add Missing Foreign Key Indexes - Batch 19: Customer Referrals

  1. Changes
    - Add indexes for customer_referral_links (customer_id, merchant_id)
    - Add indexes for customer_referrals (merchant_id, referrer_customer_id, referee_customer_id)
    - Add indexes for customer_referral_rewards (merchant_id, referral_id, referrer_customer_id)
    
  2. Rationale
    - Customer referral tracking requires fast merchant queries
    - Reward calculations need efficient referral lookups
    - Referral link management needs customer filtering
    
  3. Performance Impact
    - Faster referral tracking
    - Better reward calculation performance
    - Improved referral dashboard queries
*/

-- Customer Referral Links
CREATE INDEX IF NOT EXISTS idx_customer_referral_links_customer_id ON customer_referral_links(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_referral_links_merchant_id ON customer_referral_links(merchant_id);

-- Customer Referrals
CREATE INDEX IF NOT EXISTS idx_customer_referrals_merchant_id ON customer_referrals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_customer_referrals_referrer_customer_id ON customer_referrals(referrer_customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_referrals_referee_customer_id ON customer_referrals(referee_customer_id);

-- Customer Referral Rewards
CREATE INDEX IF NOT EXISTS idx_customer_referral_rewards_merchant_id ON customer_referral_rewards(merchant_id);
CREATE INDEX IF NOT EXISTS idx_customer_referral_rewards_referral_id ON customer_referral_rewards(referral_id);
CREATE INDEX IF NOT EXISTS idx_customer_referral_rewards_referrer_customer_id ON customer_referral_rewards(referrer_customer_id);
