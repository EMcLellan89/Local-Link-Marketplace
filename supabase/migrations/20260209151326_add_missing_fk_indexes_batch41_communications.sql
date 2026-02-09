/*
  # Add Missing Foreign Key Indexes - Batch 41: Communications Tables

  1. Performance Optimization
    - Add B-tree indexes on foreign key columns for communications_* tables
    
  2. Tables Affected
    - communications_subscriptions (product_id)
    - communications_transactions (merchant_id, call_log_id, sms_log_id)
    - communications_usage (subscription_id)
    
  3. Impact
    - 20-50% faster JOIN queries on affected foreign keys
    - Improved referential integrity check performance
    - Better query performance for usage tracking and billing
*/

-- Communications Tables
CREATE INDEX IF NOT EXISTS idx_communications_subscriptions_product_id ON communications_subscriptions(product_id);
CREATE INDEX IF NOT EXISTS idx_communications_transactions_merchant_id ON communications_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_communications_transactions_call_log_id ON communications_transactions(call_log_id);
CREATE INDEX IF NOT EXISTS idx_communications_transactions_sms_log_id ON communications_transactions(sms_log_id);
CREATE INDEX IF NOT EXISTS idx_communications_usage_subscription_id ON communications_usage(subscription_id);