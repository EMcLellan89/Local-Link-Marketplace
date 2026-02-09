/*
  # Drop Unused Indexes - Part 3: Payment Systems
  
  1. Removes unused indexes from payment-related tables
  2. Tables affected:
     - paybright_transactions, paybright_subscriptions, paybright_refunds
     - paybright_webhook_events, paybright_rate_limits, paybright_audit_log
*/

-- Drop unused indexes on paybright_transactions
DROP INDEX IF EXISTS idx_paybright_transactions_merchant;
DROP INDEX IF EXISTS idx_paybright_transactions_customer;
DROP INDEX IF EXISTS idx_paybright_transactions_status;
DROP INDEX IF EXISTS idx_paybright_transactions_reference;
DROP INDEX IF EXISTS idx_paybright_transactions_paybright_ref;
DROP INDEX IF EXISTS idx_paybright_transactions_merchant_status;
DROP INDEX IF EXISTS idx_paybright_transactions_customer_created;

-- Drop unused indexes on paybright_subscriptions
DROP INDEX IF EXISTS idx_paybright_subscriptions_merchant;
DROP INDEX IF EXISTS idx_paybright_subscriptions_customer;
DROP INDEX IF EXISTS idx_paybright_subscriptions_status;
DROP INDEX IF EXISTS idx_paybright_subscriptions_next_billing;

-- Drop unused indexes on paybright_refunds
DROP INDEX IF EXISTS idx_paybright_refunds_transaction;
DROP INDEX IF EXISTS idx_paybright_refunds_merchant;
DROP INDEX IF EXISTS idx_paybright_refunds_status;
DROP INDEX IF EXISTS idx_paybright_refunds_requested_by;

-- Drop unused indexes on paybright_webhook_events
DROP INDEX IF EXISTS idx_paybright_webhooks_event_type;
DROP INDEX IF EXISTS idx_paybright_webhooks_status;
DROP INDEX IF EXISTS idx_paybright_webhooks_transaction;
DROP INDEX IF EXISTS idx_paybright_webhooks_created;

-- Drop unused indexes on paybright_rate_limits
DROP INDEX IF EXISTS idx_rate_limits_merchant_endpoint;

-- Drop unused indexes on paybright_audit_log
DROP INDEX IF EXISTS idx_audit_log_user;
DROP INDEX IF EXISTS idx_audit_log_merchant;
DROP INDEX IF EXISTS idx_audit_log_resource;
