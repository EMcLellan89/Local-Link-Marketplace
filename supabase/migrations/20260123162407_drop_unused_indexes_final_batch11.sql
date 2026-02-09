/*
  # Drop Unused Indexes - Final Batch 11 (Referrals, Reputation, Reviews)

  This migration removes unused indexes from referral, reputation, and review tables.

  Tables covered:
  - referral_conversions
  - referral_links
  - referral_programs
  - referral_rewards
  - referrals
  - reputation_alerts
  - reputation_campaigns
  - reputation_responses
  - reputation_reviews
  - review_helpful_votes
  - review_responses
  - reviews
  - scheduled_deals
  - service_bookings
*/

-- Referral Tables
DROP INDEX IF EXISTS idx_referral_conversions_referee_customer_id;
DROP INDEX IF EXISTS idx_referral_conversions_referral_link_id;
DROP INDEX IF EXISTS idx_referral_links_customer_id;
DROP INDEX IF EXISTS idx_referral_links_program_id;
DROP INDEX IF EXISTS idx_referral_programs_merchant_id;
DROP INDEX IF EXISTS idx_referral_rewards_conversion_id;
DROP INDEX IF EXISTS idx_referral_rewards_customer_id;
DROP INDEX IF EXISTS idx_referrals_referred_customer_id;

-- Reputation Tables
DROP INDEX IF EXISTS idx_reputation_alerts_merchant_id;
DROP INDEX IF EXISTS idx_reputation_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_reputation_responses_merchant_id;
DROP INDEX IF EXISTS idx_reputation_responses_posted_by;
DROP INDEX IF EXISTS idx_reputation_responses_review_id;
DROP INDEX IF EXISTS idx_reputation_reviews_merchant_id;
DROP INDEX IF EXISTS idx_reputation_reviews_platform_id;

-- Review Tables
DROP INDEX IF EXISTS idx_review_helpful_votes_customer_id;
DROP INDEX IF EXISTS idx_review_responses_review_id;
DROP INDEX IF EXISTS idx_reviews_customer_id;
DROP INDEX IF EXISTS idx_reviews_purchase_id;

-- Other Tables
DROP INDEX IF EXISTS idx_scheduled_deals_template_id;
DROP INDEX IF EXISTS idx_service_bookings_service_id;