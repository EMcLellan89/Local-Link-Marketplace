/*
  # Add Missing Foreign Key Indexes - Batch 9
  
  1. Tables Covered
    - Purchase tables (purchases)
    - QR code tables (qr_codes)
    - Referral tables (referral_attribution, referral_conversions, referral_links, referral_programs, referral_rewards, referral_short_links, referrals)
    - Review tables (review_helpful_votes, review_responses, reviews)
    - Scheduled tables (scheduled_deals)
    
  2. Performance Impact
    - Adds indexes on foreign key columns to prevent N+1 queries
    - Improves JOIN performance for purchase tracking, referrals, and reviews
    - Critical for customer engagement and referral program tracking
    
  3. Security
    - No security changes, only performance optimization
*/

-- Purchase tables
CREATE INDEX IF NOT EXISTS idx_purchases_customer_id ON purchases(customer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_deal_id ON purchases(deal_id);
CREATE INDEX IF NOT EXISTS idx_purchases_paybright_transaction_id ON purchases(paybright_transaction_id);

-- QR code tables
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_by_partner_id ON qr_codes(created_by_partner_id);

-- Referral tables
CREATE INDEX IF NOT EXISTS idx_referral_attribution_attributed_partner_id ON referral_attribution(attributed_partner_id);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_referee_customer_id ON referral_conversions(referee_customer_id);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_referral_link_id ON referral_conversions(referral_link_id);
CREATE INDEX IF NOT EXISTS idx_referral_links_customer_id ON referral_links(customer_id);
CREATE INDEX IF NOT EXISTS idx_referral_links_program_id ON referral_links(program_id);
CREATE INDEX IF NOT EXISTS idx_referral_programs_merchant_id ON referral_programs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_conversion_id ON referral_rewards(conversion_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_customer_id ON referral_rewards(customer_id);
CREATE INDEX IF NOT EXISTS idx_referral_short_links_merchant_id ON referral_short_links(merchant_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_customer_id ON referrals(referred_customer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_customer_id ON referrals(referrer_customer_id);

-- Review tables
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_customer_id ON review_helpful_votes(customer_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_review_id ON review_helpful_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_responses_merchant_id ON review_responses(merchant_id);
CREATE INDEX IF NOT EXISTS idx_review_responses_review_id ON review_responses(review_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_deal_id ON reviews(deal_id);
CREATE INDEX IF NOT EXISTS idx_reviews_merchant_id ON reviews(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_purchase_id ON reviews(purchase_id);

-- Scheduled tables
CREATE INDEX IF NOT EXISTS idx_scheduled_deals_deal_id ON scheduled_deals(deal_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_deals_merchant_id ON scheduled_deals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_deals_template_id ON scheduled_deals(template_id);
