/*
  # Add Missing Foreign Key Indexes - Batch 12: Communications System

  1. New Indexes
    - communications_line_assignments.merchant_id
    - communications_line_assignments.phone_number_id
    - communications_prepay_orders.merchant_id
    - communications_prepay_orders.partner_id
    - communications_subscriptions.merchant_id
    - communications_subscriptions.partner_id
    - communications_subscriptions.plan_id
    - communications_transactions.merchant_id
    - communications_transactions.subscription_id
    - communications_usage.merchant_id
    - communications_usage.subscription_id

  2. Performance Impact
    - Improves communications subscription and usage queries
    - Optimizes phone number assignment lookups
*/

-- Communications System Indexes
CREATE INDEX IF NOT EXISTS idx_communications_line_assignments_merchant_id ON communications_line_assignments(merchant_id);
CREATE INDEX IF NOT EXISTS idx_communications_line_assignments_phone_number_id ON communications_line_assignments(phone_number_id);
CREATE INDEX IF NOT EXISTS idx_communications_prepay_orders_merchant_id ON communications_prepay_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_communications_prepay_orders_partner_id ON communications_prepay_orders(partner_id);
CREATE INDEX IF NOT EXISTS idx_communications_subscriptions_merchant_id ON communications_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_communications_subscriptions_partner_id ON communications_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_communications_subscriptions_plan_id ON communications_subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_communications_transactions_merchant_id ON communications_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_communications_transactions_subscription_id ON communications_transactions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_communications_usage_merchant_id ON communications_usage(merchant_id);
CREATE INDEX IF NOT EXISTS idx_communications_usage_subscription_id ON communications_usage(subscription_id);
