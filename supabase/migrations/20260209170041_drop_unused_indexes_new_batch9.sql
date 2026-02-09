/*
  # Drop Unused Indexes - New Batch 9
  
  1. Indexes to Drop (Scheduled, Social, Stripe, Subscriptions, Support)
    - Scheduled tasks
    - Social media
    - Stripe integration
    - Subscription management
    - Support tickets
  
  2. Performance Impact
    - Reduces storage overhead
    - Speeds up INSERT/UPDATE operations
    - All indexes have idx_scan = 0 (never used)
*/

-- Scheduled indexes
DROP INDEX IF EXISTS idx_scheduled_emails_merchant_id;
DROP INDEX IF EXISTS idx_scheduled_emails_send_at;
DROP INDEX IF EXISTS idx_scheduled_emails_status;
DROP INDEX IF EXISTS idx_scheduled_posts_merchant_id;
DROP INDEX IF EXISTS idx_scheduled_posts_publish_at;
DROP INDEX IF EXISTS idx_scheduled_posts_status;

-- Social indexes
DROP INDEX IF EXISTS idx_social_accounts_merchant_id;
DROP INDEX IF EXISTS idx_social_accounts_platform;
DROP INDEX IF EXISTS idx_social_posts_account_id;
DROP INDEX IF EXISTS idx_social_posts_posted_at;

-- Stripe indexes
DROP INDEX IF EXISTS idx_stripe_customers_customer_id;
DROP INDEX IF EXISTS idx_stripe_customers_stripe_id;
DROP INDEX IF EXISTS idx_stripe_webhook_events_created_at;
DROP INDEX IF EXISTS idx_stripe_webhook_events_type;

-- Subscription indexes
DROP INDEX IF EXISTS idx_subscriptions_customer_id;
DROP INDEX IF EXISTS idx_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_subscriptions_status;

-- Support indexes
DROP INDEX IF EXISTS idx_support_tickets_assigned_to;
DROP INDEX IF EXISTS idx_support_tickets_merchant_id;
DROP INDEX IF EXISTS idx_support_tickets_priority;
DROP INDEX IF EXISTS idx_support_tickets_status;