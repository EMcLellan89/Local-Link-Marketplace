/*
  # Drop Unused Indexes - New Batch 10
  
  1. Indexes to Drop (Territories, Transactions, Twilio, UGC, VAPI)
    - Territory management
    - Transaction tracking
    - Twilio communication
    - UGC (User Generated Content)
    - VAPI voice AI
  
  2. Performance Impact
    - Reduces storage overhead
    - Speeds up INSERT/UPDATE operations
    - All indexes have idx_scan = 0 (never used)
*/

-- Territory indexes
DROP INDEX IF EXISTS idx_expansion_requests_partner_id;
DROP INDEX IF EXISTS idx_expansion_requests_status;
DROP INDEX IF EXISTS idx_partner_territories_county;
DROP INDEX IF EXISTS idx_partner_territories_state;

-- Transaction indexes
DROP INDEX IF EXISTS idx_transactions_amount;
DROP INDEX IF EXISTS idx_transactions_created_at;
DROP INDEX IF EXISTS idx_transactions_customer_id;
DROP INDEX IF EXISTS idx_transactions_merchant_id;
DROP INDEX IF EXISTS idx_transactions_status;
DROP INDEX IF EXISTS idx_transactions_type;

-- Twilio indexes
DROP INDEX IF EXISTS idx_twilio_calls_merchant_id;
DROP INDEX IF EXISTS idx_twilio_calls_status;
DROP INDEX IF EXISTS idx_twilio_messages_merchant_id;
DROP INDEX IF EXISTS idx_twilio_messages_status;

-- UGC indexes
DROP INDEX IF EXISTS idx_ugc_orders_merchant_id;
DROP INDEX IF EXISTS idx_ugc_orders_status;
DROP INDEX IF EXISTS idx_ugc_videos_creator_id;
DROP INDEX IF EXISTS idx_ugc_videos_status;

-- VAPI indexes
DROP INDEX IF EXISTS idx_vapi_assistants_merchant_id;
DROP INDEX IF EXISTS idx_vapi_calls_assistant_id;
DROP INDEX IF EXISTS idx_vapi_calls_status;