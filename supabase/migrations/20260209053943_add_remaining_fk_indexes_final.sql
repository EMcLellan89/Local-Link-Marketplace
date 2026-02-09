/*
  # Add Foreign Key Indexes - Remaining Tables (Final Batch)

  1. Indexes Added
    - paybright_transactions: merchant_id, customer_id, reference_id
    - product_commission_rules: product_id
    - provider_assignments: merchant_id, provider_id
    - receipts: merchant_id, linked_transaction_id
    - referral_rewards: customer_id, conversion_id
    - stripe_customers: user_id
    - support_messages: ticket_id, sender_id
    - support_tickets: customer_id, merchant_id

  2. Performance Impact
    - Completes foreign key indexing across all identified tables
    - Dramatically improves payment transaction lookups
    - Optimizes support ticket queries by merchant/customer

  3. Security Notes
    - Critical for RLS policies on payment and support tables
    - Enables fast customer-specific data filtering
    - Completes the foundation for secure, performant queries
*/

-- Payment tables
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_merchant_id ON paybright_transactions(merchant_id) WHERE merchant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_customer_id ON paybright_transactions(customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_reference_id ON paybright_transactions(reference_id) WHERE reference_id IS NOT NULL;

-- Product commission rules
CREATE INDEX IF NOT EXISTS idx_product_commission_rules_product_id ON product_commission_rules(product_id);

-- Provider assignments
CREATE INDEX IF NOT EXISTS idx_provider_assignments_merchant_id ON provider_assignments(merchant_id);
CREATE INDEX IF NOT EXISTS idx_provider_assignments_provider_id ON provider_assignments(provider_id);

-- Receipts
CREATE INDEX IF NOT EXISTS idx_receipts_merchant_id ON receipts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_receipts_linked_transaction_id ON receipts(linked_transaction_id) WHERE linked_transaction_id IS NOT NULL;

-- Referral rewards
CREATE INDEX IF NOT EXISTS idx_referral_rewards_customer_id ON referral_rewards(customer_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_conversion_id ON referral_rewards(conversion_id) WHERE conversion_id IS NOT NULL;

-- Stripe customers
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON stripe_customers(user_id);

-- Support tables
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_sender_id ON support_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id ON support_tickets(customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_support_tickets_merchant_id ON support_tickets(merchant_id) WHERE merchant_id IS NOT NULL;
