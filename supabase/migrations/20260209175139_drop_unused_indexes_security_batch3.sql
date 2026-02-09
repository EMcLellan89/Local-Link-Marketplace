/*
  # Drop Unused Indexes - Batch 3
  
  1. Purpose
    - Drop indexes with idx_scan = 0 (never used by queries)
    - Reduces database maintenance overhead
    - Improves write performance
  
  2. Indexes Dropped
    - stripe_customers: customer_id
    - stripe_webhook_events: event_id
    - support_messages: ticket_id, sender_id
    - support_tickets: merchant_id, customer_id
    - surveys: merchant_id, customer_id
    - twilio tables: various indexes
    - ugc tables: various indexes
    - vapi tables: various indexes
  
  3. Security
    - No security impact
    - Performance improvement for writes
*/

-- Stripe Tables
DROP INDEX IF EXISTS idx_stripe_customers_customer_id;
DROP INDEX IF EXISTS idx_stripe_webhook_events_event_id;

-- Support Tables
DROP INDEX IF EXISTS idx_support_messages_ticket_id;
DROP INDEX IF EXISTS idx_support_messages_sender_id;
DROP INDEX IF EXISTS idx_support_tickets_merchant_id;
DROP INDEX IF EXISTS idx_support_tickets_customer_id;

-- Surveys
DROP INDEX IF EXISTS idx_surveys_merchant_id;
DROP INDEX IF EXISTS idx_surveys_customer_id;

-- Twilio Tables
DROP INDEX IF EXISTS idx_twilio_call_logs_merchant_id;
DROP INDEX IF EXISTS idx_twilio_call_logs_customer_id;
DROP INDEX IF EXISTS idx_twilio_sms_logs_merchant_id;
DROP INDEX IF EXISTS idx_twilio_sms_logs_customer_id;

-- UGC Tables
DROP INDEX IF EXISTS idx_ugc_content_creator_id;
DROP INDEX IF EXISTS idx_ugc_content_merchant_id;
DROP INDEX IF EXISTS idx_ugc_orders_merchant_id;
DROP INDEX IF EXISTS idx_ugc_orders_creator_id;

-- VAPI Tables
DROP INDEX IF EXISTS idx_vapi_call_logs_merchant_id;
DROP INDEX IF EXISTS idx_vapi_call_logs_customer_id;
DROP INDEX IF EXISTS idx_vapi_configurations_merchant_id;