/*
  # Drop Unused Indexes - Batch 33

  1. Purpose
    - Remove unused indexes (idx_scan = 0) to reduce storage overhead
    - Improve INSERT/UPDATE performance by reducing index maintenance
    - Continue systematic cleanup from security audit

  2. Indexes Dropped
    - shopping_carts table indexes
    - sms table indexes
    - social_media table indexes
    - stripe table indexes
    - support table indexes
*/

DROP INDEX IF EXISTS idx_shopping_carts_customer_id;
DROP INDEX IF EXISTS idx_sms_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_sms_messages_campaign_id;
DROP INDEX IF EXISTS idx_sms_messages_customer_id;
DROP INDEX IF EXISTS idx_social_media_accounts_merchant_id;
DROP INDEX IF EXISTS idx_social_media_posts_account_id;
DROP INDEX IF EXISTS idx_social_media_posts_merchant_id;
DROP INDEX IF EXISTS idx_sponsorships_sponsor_merchant_id;
DROP INDEX IF EXISTS idx_sponsorships_sponsored_merchant_id;
DROP INDEX IF EXISTS idx_stripe_webhook_events_customer_id;
DROP INDEX IF EXISTS idx_stripe_webhook_events_merchant_id;
DROP INDEX IF EXISTS idx_subscription_usage_merchant_id;
DROP INDEX IF EXISTS idx_subscription_usage_subscription_id;
DROP INDEX IF EXISTS idx_support_tickets_assigned_to;
DROP INDEX IF EXISTS idx_support_tickets_customer_id;
DROP INDEX IF EXISTS idx_support_tickets_merchant_id;
DROP INDEX IF EXISTS idx_survey_responses_customer_id;
DROP INDEX IF EXISTS idx_survey_responses_survey_id;
DROP INDEX IF EXISTS idx_surveys_merchant_id;
DROP INDEX IF EXISTS idx_team_members_user_id;
