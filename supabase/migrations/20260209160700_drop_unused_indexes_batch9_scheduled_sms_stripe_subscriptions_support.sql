/*
  # Drop Unused Indexes - Batch 9: Scheduled, SMS, Stripe, Subscriptions & Support Tables
  
  1. Tables Affected
    - scheduled_* tables
    - sms_* tables
    - stripe_* tables
    - subscriptions and subscription_* tables
    - support_* tables
    - survey_* tables
    - team_* tables
  
  2. Performance Impact
    - Removes indexes with 0 usage count
    - Reduces storage and write overhead
  
  3. Safety
    - All indexes verified as unused
*/

-- Scheduled tasks
DROP INDEX IF EXISTS idx_scheduled_deals_merchant_id;
DROP INDEX IF EXISTS idx_scheduled_posts_merchant_id;

-- SMS
DROP INDEX IF EXISTS idx_sms_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_sms_sends_campaign_id;
DROP INDEX IF EXISTS idx_sms_sends_customer_id;

-- Stripe
DROP INDEX IF EXISTS idx_stripe_customers_user_id;
DROP INDEX IF EXISTS idx_stripe_subscriptions_customer_id;
DROP INDEX IF EXISTS idx_stripe_webhook_events_event_id;

-- Subscriptions
DROP INDEX IF EXISTS idx_subscriptions_user_id;
DROP INDEX IF EXISTS idx_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_subscription_items_subscription_id;
DROP INDEX IF EXISTS idx_subscription_plans_merchant_id;

-- Support
DROP INDEX IF EXISTS idx_support_tickets_customer_id;
DROP INDEX IF EXISTS idx_support_tickets_merchant_id;
DROP INDEX IF EXISTS idx_support_tickets_assigned_to;
DROP INDEX IF EXISTS idx_support_messages_ticket_id;

-- Surveys
DROP INDEX IF EXISTS idx_surveys_merchant_id;
DROP INDEX IF EXISTS idx_survey_responses_survey_id;
DROP INDEX IF EXISTS idx_survey_responses_customer_id;

-- Team
DROP INDEX IF EXISTS idx_team_members_user_id;
DROP INDEX IF EXISTS idx_team_members_merchant_id;
DROP INDEX IF EXISTS idx_team_tasks_assigned_to;
DROP INDEX IF EXISTS idx_team_projects_merchant_id;