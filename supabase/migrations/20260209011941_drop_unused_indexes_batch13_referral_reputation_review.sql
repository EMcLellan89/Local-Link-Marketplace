/*
  # Drop Unused Indexes - Batch 13: Referral, Reputation, and Review Tables
  
  This migration continues dropping unused indexes.
  
  ## Indexes Dropped
  - Referral program indexes
  - Reputation monitoring indexes
  - Review and rating indexes
  
  ## Impact
  - Reduces storage usage
  - Improves write performance
*/

-- referral_codes
DROP INDEX IF EXISTS idx_referral_codes_customer_id;
DROP INDEX IF EXISTS idx_referral_codes_merchant_id;

-- referral_email_tracking
DROP INDEX IF EXISTS idx_referral_email_tracking_customer_id;

-- referral_rewards
DROP INDEX IF EXISTS idx_referral_rewards_referral_id;

-- referral_sms_tracking
DROP INDEX IF EXISTS idx_referral_sms_tracking_customer_id;

-- referrals
DROP INDEX IF EXISTS idx_referrals_merchant_id;
DROP INDEX IF EXISTS idx_referrals_referrer_id;

-- reputation_alerts
DROP INDEX IF EXISTS idx_reputation_alerts_merchant_id;

-- reputation_monitoring
DROP INDEX IF EXISTS idx_reputation_monitoring_merchant_id;

-- review_requests
DROP INDEX IF EXISTS idx_review_requests_customer_id;
DROP INDEX IF EXISTS idx_review_requests_merchant_id;

-- review_responses
DROP INDEX IF EXISTS idx_review_responses_merchant_id;
DROP INDEX IF EXISTS idx_review_responses_review_id;

-- reviews
DROP INDEX IF EXISTS idx_reviews_customer_id;
DROP INDEX IF EXISTS idx_reviews_merchant_id;

-- scheduled_emails
DROP INDEX IF EXISTS idx_scheduled_emails_merchant_id;

-- scheduled_messages
DROP INDEX IF EXISTS idx_scheduled_messages_customer_id;
DROP INDEX IF EXISTS idx_scheduled_messages_merchant_id;

-- segment_members
DROP INDEX IF EXISTS idx_segment_members_customer_id;
DROP INDEX IF EXISTS idx_segment_members_segment_id;

-- segments
DROP INDEX IF EXISTS idx_segments_merchant_id;

-- seo_keywords
DROP INDEX IF EXISTS idx_seo_keywords_merchant_id;

-- seo_rankings
DROP INDEX IF EXISTS idx_seo_rankings_keyword_id;

-- social_media_accounts
DROP INDEX IF EXISTS idx_social_media_accounts_merchant_id;

-- social_media_posts
DROP INDEX IF EXISTS idx_social_media_posts_account_id;
DROP INDEX IF EXISTS idx_social_media_posts_merchant_id;
