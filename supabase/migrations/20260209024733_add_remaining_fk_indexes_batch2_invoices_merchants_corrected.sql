/*
  # Add Missing Foreign Key Indexes - Batch 2: Invoices & Merchants (Corrected)

  1. Purpose
    - Add missing foreign key indexes for invoice and merchant tables
    - Improve query performance for business transactions
  
  2. Tables Affected
    - invoices (customer_id, merchant_id)
    - merchant_orders (merchant_id)
    - notifications (customer_id, merchant_id)
    - partners (user_id)
  
  3. Performance Impact
    - Faster invoice lookups
    - Improved merchant dashboard queries
*/

-- Invoice indexes
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_merchant_id ON invoices(merchant_id);

-- Merchant order indexes (only has merchant_id, not customer_id)
CREATE INDEX IF NOT EXISTS idx_merchant_orders_merchant_id ON merchant_orders(merchant_id);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_customer_id ON notifications(customer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_merchant_id ON notifications(merchant_id);

-- Partner indexes
CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);
