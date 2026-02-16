/*
  # Drop Unused Indexes - Security Audit Batch 10
  
  Drops unused indexes from scheduled, SMS, social media, sponsorship, StoryLab, and Stripe tables.
  
  These indexes have not been used and are safe to remove for improved database performance.
  
  Tables affected:
  - scheduled_messages
  - sms_campaigns, sms_messages
  - social_media_posts
  - sponsorships
  - storylab_orders, storylab_statements
  - stripe_webhook_events
  - subscriptions
  - support_tickets
*/

-- Scheduled message tables
DROP INDEX IF EXISTS idx_scheduled_messages_merchant_id;
DROP INDEX IF EXISTS idx_scheduled_messages_customer_id;
DROP INDEX IF EXISTS idx_scheduled_messages_status;

-- SMS tables
DROP INDEX IF EXISTS idx_sms_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_sms_messages_merchant_id;
DROP INDEX IF EXISTS idx_sms_messages_customer_id;

-- Social media tables
DROP INDEX IF EXISTS idx_social_media_posts_merchant_id;
DROP INDEX IF EXISTS idx_social_media_posts_platform;

-- Sponsorship tables
DROP INDEX IF EXISTS idx_sponsorships_merchant_id;
DROP INDEX IF EXISTS idx_sponsorships_partner_id;

-- StoryLab tables
DROP INDEX IF EXISTS idx_storylab_orders_partner_id;
DROP INDEX IF EXISTS idx_storylab_orders_status;
DROP INDEX IF EXISTS idx_storylab_statements_partner_id;

-- Stripe tables
DROP INDEX IF EXISTS idx_stripe_webhook_events_event_type;
DROP INDEX IF EXISTS idx_stripe_webhook_events_processed;

-- Subscription tables
DROP INDEX IF EXISTS idx_subscriptions_user_id;
DROP INDEX IF EXISTS idx_subscriptions_status;

-- Support tables
DROP INDEX IF EXISTS idx_support_tickets_user_id;
DROP INDEX IF EXISTS idx_support_tickets_merchant_id;
DROP INDEX IF EXISTS idx_support_tickets_status;