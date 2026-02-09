/*
  # Drop Unused Indexes - Batch 10: Territories, Transactions, Twilio, UGC, VAPI & Video Tables
  
  1. Tables Affected
    - territory_* tables
    - transactions and transaction_* tables
    - twilio_* tables
    - ugc_* tables (User Generated Content)
    - vapi_* tables (Voice AI)
    - video_* tables
  
  2. Performance Impact
    - Removes unused indexes identified by pg_stat_user_indexes
    - Improves write performance across communication and media tables
  
  3. Safety
    - All indexes have zero scan count
*/

-- Territories
DROP INDEX IF EXISTS idx_territories_partner_id;
DROP INDEX IF EXISTS idx_territory_assignments_partner_id;
DROP INDEX IF EXISTS idx_expansion_requests_partner_id;

-- Transactions
DROP INDEX IF EXISTS idx_transactions_customer_id;
DROP INDEX IF EXISTS idx_transactions_merchant_id;
DROP INDEX IF EXISTS idx_transaction_history_user_id;

-- Twilio
DROP INDEX IF EXISTS idx_twilio_messages_to_number;
DROP INDEX IF EXISTS idx_twilio_messages_from_number;
DROP INDEX IF EXISTS idx_twilio_calls_to_number;
DROP INDEX IF EXISTS idx_twilio_calls_from_number;

-- UGC (User Generated Content)
DROP INDEX IF EXISTS idx_ugc_creators_user_id;
DROP INDEX IF EXISTS idx_ugc_content_creator_id;
DROP INDEX IF EXISTS idx_ugc_content_merchant_id;
DROP INDEX IF EXISTS idx_ugc_orders_merchant_id;
DROP INDEX IF EXISTS idx_ugc_orders_creator_id;

-- VAPI (Voice AI)
DROP INDEX IF EXISTS idx_vapi_assistants_merchant_id;
DROP INDEX IF EXISTS idx_vapi_calls_assistant_id;
DROP INDEX IF EXISTS idx_vapi_call_logs_merchant_id;

-- Video
DROP INDEX IF EXISTS idx_video_content_merchant_id;
DROP INDEX IF EXISTS idx_video_analytics_video_id;