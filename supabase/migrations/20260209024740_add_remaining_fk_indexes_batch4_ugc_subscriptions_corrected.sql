/*
  # Add Missing Foreign Key Indexes - Batch 4: UGC & Subscriptions (Corrected)

  1. Purpose
    - Add missing foreign key indexes for UGC orders and subscription tracking
    - Improve content creator and subscription queries
  
  2. Tables Affected
    - ugc_orders (creator_id, merchant_id, package_id)
    - user_subscriptions (user_id)
    - vapi_call_logs (merchant_id, customer_id, assistant_id)
  
  3. Performance Impact
    - Faster UGC order lookups
    - Improved subscription management queries
*/

-- UGC order indexes (has creator_id and merchant_id, not customer_id)
CREATE INDEX IF NOT EXISTS idx_ugc_orders_creator_id ON ugc_orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_merchant_id ON ugc_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_package_id ON ugc_orders(package_id);

-- User subscription indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);

-- VAPI call log indexes
CREATE INDEX IF NOT EXISTS idx_vapi_call_logs_merchant_id ON vapi_call_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_vapi_call_logs_customer_id ON vapi_call_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_vapi_call_logs_assistant_id ON vapi_call_logs(assistant_id);
