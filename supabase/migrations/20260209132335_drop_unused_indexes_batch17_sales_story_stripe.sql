/*
  # Drop Unused Indexes - Batch 17: Sales, Story, and Stripe Tables

  1. Changes
    - Drop unused indexes from sales, scheduled, service tables
    - Drop unused indexes from story_* tables
    - Drop unused indexes from stripe and subscription tables
    
  2. Rationale
    - These indexes have idx_scan = 0, never used by queries
    - Improves database performance
*/

-- Sales and scheduled
DROP INDEX IF EXISTS idx_sales_events_attributed_partner_id;
DROP INDEX IF EXISTS idx_scheduled_deals_template_id;

-- Service and shopping
DROP INDEX IF EXISTS idx_service_bookings_service_id;
DROP INDEX IF EXISTS idx_shopping_carts_customer_id;
DROP INDEX IF EXISTS idx_shopping_carts_merchant_id;

-- SMS and social
DROP INDEX IF EXISTS idx_sms_queue_user_id;
DROP INDEX IF EXISTS idx_social_shares_customer_id;
DROP INDEX IF EXISTS idx_social_ugc_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_social_ugc_subscriptions_package_id;

-- Story tables
DROP INDEX IF EXISTS idx_story_assets_book_id;
DROP INDEX IF EXISTS idx_story_audit_logs_book_id;
DROP INDEX IF EXISTS idx_story_audit_logs_profile_id;
DROP INDEX IF EXISTS idx_story_books_project_id;
DROP INDEX IF EXISTS idx_story_jobs_book_id;
DROP INDEX IF EXISTS idx_story_jobs_profile_id;

-- Stripe tables
DROP INDEX IF EXISTS idx_stripe_customers_user_id;
DROP INDEX IF EXISTS idx_stripe_subscription_map_user_id;

-- Subscription tables
DROP INDEX IF EXISTS idx_subscription_crm_mapping_crm_tier_id;
DROP INDEX IF EXISTS idx_subscription_items_plan_id;
DROP INDEX IF EXISTS idx_subscriptions_plan_id;

-- Support tables
DROP INDEX IF EXISTS idx_support_messages_sender_id;
DROP INDEX IF EXISTS idx_support_messages_ticket_id;
DROP INDEX IF EXISTS idx_support_tickets_customer_id;
DROP INDEX IF EXISTS idx_support_tickets_merchant_id;

-- Survey tables
DROP INDEX IF EXISTS idx_survey_responses_customer_id;
DROP INDEX IF EXISTS idx_survey_responses_purchase_id;
DROP INDEX IF EXISTS idx_survey_responses_survey_id;
DROP INDEX IF EXISTS idx_surveys_merchant_id;

-- Swipe file and system
DROP INDEX IF EXISTS idx_swipe_file_favorites_template_id;
DROP INDEX IF EXISTS idx_system_settings_updated_by;
