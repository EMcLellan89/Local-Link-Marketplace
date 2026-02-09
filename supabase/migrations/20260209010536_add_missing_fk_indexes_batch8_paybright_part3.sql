/*
  # Add Missing Foreign Key Indexes - Batch 8 Part 3
  
  1. Tables Covered
    - Paybright tables (paybright_audit_log, paybright_config, paybright_rate_limits, paybright_refunds, paybright_subscriptions)
    
  2. Performance Impact
    - Adds indexes on foreign key columns to prevent N+1 queries
    - Improves JOIN performance for payment processing
    - Critical for Paybright integration and transaction tracking
    
  3. Security
    - No security changes, only performance optimization
*/

-- Paybright tables
CREATE INDEX IF NOT EXISTS idx_paybright_audit_log_merchant_id ON paybright_audit_log(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_config_merchant_id ON paybright_config(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_rate_limits_merchant_id ON paybright_rate_limits(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_merchant_id ON paybright_refunds(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_transaction_id ON paybright_refunds(transaction_id);
CREATE INDEX IF NOT EXISTS idx_paybright_subscriptions_customer_id ON paybright_subscriptions(customer_id);
