/*
  # Drop Unused Indexes - Batch 34

  1. Purpose
    - Remove unused indexes (idx_scan = 0) to reduce storage overhead
    - Improve INSERT/UPDATE performance by reducing index maintenance
    - Continue systematic cleanup from security audit

  2. Indexes Dropped
    - territory table indexes
    - transaction table indexes
    - twilio table indexes
    - ugc table indexes
    - user table indexes
*/

DROP INDEX IF EXISTS idx_territories_partner_id;
DROP INDEX IF EXISTS idx_territory_assignments_partner_id;
DROP INDEX IF EXISTS idx_territory_assignments_territory_id;
DROP INDEX IF EXISTS idx_transactions_customer_id;
DROP INDEX IF EXISTS idx_transactions_merchant_id;
DROP INDEX IF EXISTS idx_twilio_calls_customer_id;
DROP INDEX IF EXISTS idx_twilio_calls_merchant_id;
DROP INDEX IF EXISTS idx_twilio_emails_merchant_id;
DROP INDEX IF EXISTS idx_twilio_emails_recipient_email;
DROP INDEX IF EXISTS idx_twilio_messages_customer_id;
DROP INDEX IF EXISTS idx_twilio_messages_merchant_id;
DROP INDEX IF EXISTS idx_ugc_content_creator_id;
DROP INDEX IF EXISTS idx_ugc_content_merchant_id;
DROP INDEX IF EXISTS idx_ugc_orders_creator_id;
DROP INDEX IF EXISTS idx_ugc_orders_merchant_id;
DROP INDEX IF EXISTS idx_user_preferences_user_id;
DROP INDEX IF EXISTS idx_user_subscriptions_subscription_id;
DROP INDEX IF EXISTS idx_user_subscriptions_user_id;
DROP INDEX IF EXISTS idx_vapi_assistants_merchant_id;
DROP INDEX IF EXISTS idx_vapi_call_logs_assistant_id;
