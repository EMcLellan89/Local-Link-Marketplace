/*
  # Add Missing Foreign Key Indexes - Batch 36: BI & Referrals (Final)

  1. Changes
    - Add indexes for bi_reports (merchant_id)
    - Add indexes for bi_competitor_tracking (merchant_id)
    - Add indexes for referral_programs (merchant_id)
    - Add indexes for referral_links (customer_id, program_id)
    - Add indexes for referral_conversions (referral_link_id, referee_customer_id)
    - Add indexes for referral_rewards (conversion_id)
    
  2. Rationale
    - BI reports require merchant filtering
    - Referral programs need merchant and customer lookups
    - Conversion tracking needs link and customer queries
    
  3. Performance Impact
    - Faster BI report generation
    - Better referral tracking
    - Improved reward calculations
*/

-- BI Reports
CREATE INDEX IF NOT EXISTS idx_bi_reports_merchant_id ON bi_reports(merchant_id);

-- BI Competitor Tracking
CREATE INDEX IF NOT EXISTS idx_bi_competitor_tracking_merchant_id ON bi_competitor_tracking(merchant_id);

-- Referral Programs
CREATE INDEX IF NOT EXISTS idx_referral_programs_merchant_id ON referral_programs(merchant_id);

-- Referral Links
CREATE INDEX IF NOT EXISTS idx_referral_links_customer_id ON referral_links(customer_id);
CREATE INDEX IF NOT EXISTS idx_referral_links_program_id ON referral_links(program_id);

-- Referral Conversions
CREATE INDEX IF NOT EXISTS idx_referral_conversions_referral_link_id ON referral_conversions(referral_link_id);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_referee_customer_id ON referral_conversions(referee_customer_id);

-- Referral Rewards
CREATE INDEX IF NOT EXISTS idx_referral_rewards_conversion_id ON referral_rewards(conversion_id);
