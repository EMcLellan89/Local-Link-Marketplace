/*
  # Drop Unused Indexes - Batch 6: Reviews, Referrals, Communications

  1. Performance Improvements
    - Remove unused indexes to improve write performance
    - Reduce database storage overhead
    - Simplify query planner decisions

  2. Tables Affected
    - Review and rating tables
    - Referral and reward tables
    - Communication and notification tables
    - Email and SMS tracking

  3. Safety
    - Only dropping indexes confirmed as unused
    - Foreign key indexes are preserved
*/

-- Review and rating indexes
DROP INDEX IF EXISTS idx_reviews_merchant_id;
DROP INDEX IF EXISTS idx_reviews_customer_id;
DROP INDEX IF EXISTS idx_reviews_rating;
DROP INDEX IF EXISTS idx_reviews_created_at;
DROP INDEX IF EXISTS idx_review_requests_merchant_id;
DROP INDEX IF EXISTS idx_review_requests_customer_id;
DROP INDEX IF EXISTS idx_review_requests_status;
DROP INDEX IF EXISTS idx_reputation_monitoring_merchant_id;
DROP INDEX IF EXISTS idx_reputation_monitoring_platform;

-- Referral and reward indexes
DROP INDEX IF EXISTS idx_referrals_referrer_id;
DROP INDEX IF EXISTS idx_referrals_referred_id;
DROP INDEX IF EXISTS idx_referrals_status;
DROP INDEX IF EXISTS idx_referrals_created_at;
DROP INDEX IF EXISTS idx_referral_rewards_customer_id;
DROP INDEX IF EXISTS idx_referral_rewards_referral_id;
DROP INDEX IF EXISTS idx_referral_rewards_status;
DROP INDEX IF EXISTS idx_customer_referral_links_customer_id;
DROP INDEX IF EXISTS idx_customer_referral_links_merchant_id;

-- Communication indexes
DROP INDEX IF EXISTS idx_communications_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_communications_subscriptions_status;
DROP INDEX IF EXISTS idx_communications_transactions_merchant_id;
DROP INDEX IF EXISTS idx_communications_transactions_type;
DROP INDEX IF EXISTS idx_communications_transactions_created_at;
DROP INDEX IF EXISTS idx_email_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_email_campaigns_status;
DROP INDEX IF EXISTS idx_email_campaigns_scheduled_at;
DROP INDEX IF EXISTS idx_email_subscriptions_user_id;
DROP INDEX IF EXISTS idx_email_subscriptions_subscribed;

-- SMS and messaging indexes
DROP INDEX IF EXISTS idx_twilio_messages_merchant_id;
DROP INDEX IF EXISTS idx_twilio_messages_direction;
DROP INDEX IF EXISTS idx_twilio_messages_status;
DROP INDEX IF EXISTS idx_twilio_messages_created_at;
DROP INDEX IF EXISTS idx_sms_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_sms_campaigns_status;
DROP INDEX IF EXISTS idx_sms_campaigns_scheduled_at;