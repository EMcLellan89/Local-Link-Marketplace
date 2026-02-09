/*
  # Drop Unused Indexes - Batch 9: Shopping, SMS, Social, Sponsorships, Storylab, Stripe, Subscriptions
  
  ## Tables Covered:
  - shopping_* tables
  - sms_* tables
  - social_* tables
  - sponsorship_* tables
  - storylab_* tables
  - stripe_* tables
  - subscription_* tables
  - support_* tables
*/

-- Shopping tables
DROP INDEX IF EXISTS idx_shopping_cart_items_cart_id;
DROP INDEX IF EXISTS idx_shopping_cart_items_product_id;

-- SMS tables
DROP INDEX IF EXISTS idx_sms_campaigns_created_at;
DROP INDEX IF EXISTS idx_sms_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_sms_sends_campaign_id;
DROP INDEX IF EXISTS idx_sms_sends_created_at;

-- Social tables
DROP INDEX IF EXISTS idx_social_media_posts_created_at;
DROP INDEX IF EXISTS idx_social_media_posts_merchant_id;

-- Sponsorship tables
DROP INDEX IF EXISTS idx_sponsorship_deals_created_at;
DROP INDEX IF EXISTS idx_sponsorship_deals_merchant_id;

-- Storylab tables
DROP INDEX IF EXISTS idx_storylab_orders_created_at;
DROP INDEX IF EXISTS idx_storylab_orders_partner_id;
DROP INDEX IF EXISTS idx_storylab_statements_created_at;
DROP INDEX IF EXISTS idx_storylab_statements_partner_id;

-- Stripe tables
DROP INDEX IF EXISTS idx_stripe_connect_accounts_partner_id;
DROP INDEX IF EXISTS idx_stripe_events_created_at;
DROP INDEX IF EXISTS idx_stripe_webhook_events_created_at;

-- Subscription tables
DROP INDEX IF EXISTS idx_subscription_plans_created_at;
DROP INDEX IF EXISTS idx_subscriptions_customer_id;
DROP INDEX IF EXISTS idx_subscriptions_plan_id;
DROP INDEX IF EXISTS idx_subscriptions_status;

-- Support tables
DROP INDEX IF EXISTS idx_support_tickets_created_at;
DROP INDEX IF EXISTS idx_support_tickets_merchant_id;
DROP INDEX IF EXISTS idx_support_tickets_status;