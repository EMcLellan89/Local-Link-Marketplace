/*
  # Add All Foreign Key Indexes - Batch 9 (QR, Recruiting, Redemption, Referral, Reputation, Review)
  
  1. Foreign Key Indexes for:
    - QR, Recruiting, Redemption, Referral, Reputation, Review tables
*/

-- qr_codes
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_by_partner_id 
  ON qr_codes(created_by_partner_id);

-- recruiting_services
CREATE INDEX IF NOT EXISTS idx_recruiting_services_merchant_id 
  ON recruiting_services(merchant_id);

-- redemptions
CREATE INDEX IF NOT EXISTS idx_redemptions_purchase_id 
  ON redemptions(purchase_id);

-- referral_conversions
CREATE INDEX IF NOT EXISTS idx_referral_conversions_referee_customer_id 
  ON referral_conversions(referee_customer_id);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_referral_link_id 
  ON referral_conversions(referral_link_id);

-- referral_links
CREATE INDEX IF NOT EXISTS idx_referral_links_customer_id 
  ON referral_links(customer_id);
CREATE INDEX IF NOT EXISTS idx_referral_links_program_id 
  ON referral_links(program_id);

-- referral_programs
CREATE INDEX IF NOT EXISTS idx_referral_programs_merchant_id 
  ON referral_programs(merchant_id);

-- referral_rewards
CREATE INDEX IF NOT EXISTS idx_referral_rewards_conversion_id 
  ON referral_rewards(conversion_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_customer_id 
  ON referral_rewards(customer_id);

-- referrals
CREATE INDEX IF NOT EXISTS idx_referrals_referred_customer_id 
  ON referrals(referred_customer_id);

-- reputation_alerts
CREATE INDEX IF NOT EXISTS idx_reputation_alerts_merchant_id 
  ON reputation_alerts(merchant_id);

-- reputation_campaigns
CREATE INDEX IF NOT EXISTS idx_reputation_campaigns_merchant_id 
  ON reputation_campaigns(merchant_id);

-- reputation_responses
CREATE INDEX IF NOT EXISTS idx_reputation_responses_merchant_id 
  ON reputation_responses(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reputation_responses_posted_by 
  ON reputation_responses(posted_by);
CREATE INDEX IF NOT EXISTS idx_reputation_responses_review_id 
  ON reputation_responses(review_id);

-- reputation_reviews
CREATE INDEX IF NOT EXISTS idx_reputation_reviews_merchant_id 
  ON reputation_reviews(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reputation_reviews_platform_id 
  ON reputation_reviews(platform_id);

-- review_helpful_votes
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_customer_id 
  ON review_helpful_votes(customer_id);

-- review_responses
CREATE INDEX IF NOT EXISTS idx_review_responses_review_id 
  ON review_responses(review_id);

-- reviews
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id 
  ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_purchase_id 
  ON reviews(purchase_id);
