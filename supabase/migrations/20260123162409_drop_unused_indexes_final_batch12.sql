/*
  # Drop Unused Indexes - Final Batch 12 (Shopping, SMS, Social, Stripe)

  This migration removes unused indexes from shopping, SMS, social, and Stripe tables.

  Tables covered:
  - shopping_carts
  - sms_queue
  - social_shares
  - social_ugc_subscriptions
  - stripe_subscription_map
  - support_messages
  - support_tickets
  - survey_responses
  - swipe_file_favorites
  - system_settings
  - territories
  - territory_licenses
  - ticket_messages
*/

-- Shopping and SMS
DROP INDEX IF EXISTS idx_shopping_carts_customer_id;
DROP INDEX IF EXISTS idx_shopping_carts_merchant_id;
DROP INDEX IF EXISTS idx_sms_queue_user_id;

-- Social Tables
DROP INDEX IF EXISTS idx_social_shares_customer_id;
DROP INDEX IF EXISTS idx_social_ugc_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_social_ugc_subscriptions_package_id;

-- Stripe
DROP INDEX IF EXISTS idx_stripe_subscription_map_user_id;

-- Support Tables
DROP INDEX IF EXISTS idx_support_messages_ticket_id;
DROP INDEX IF EXISTS idx_support_tickets_customer_id;

-- Survey Tables
DROP INDEX IF EXISTS idx_survey_responses_customer_id;
DROP INDEX IF EXISTS idx_survey_responses_purchase_id;
DROP INDEX IF EXISTS idx_survey_responses_survey_id;

-- Other Tables
DROP INDEX IF EXISTS idx_swipe_file_favorites_template_id;
DROP INDEX IF EXISTS idx_system_settings_updated_by;
DROP INDEX IF EXISTS idx_territories_assigned_partner_id;
DROP INDEX IF EXISTS idx_territories_parent_territory_id;
DROP INDEX IF EXISTS idx_territory_licenses_partner_id;
DROP INDEX IF EXISTS idx_territory_licenses_pricing_tier_id;
DROP INDEX IF EXISTS idx_territory_licenses_territory_id;
DROP INDEX IF EXISTS idx_ticket_messages_ticket_id;