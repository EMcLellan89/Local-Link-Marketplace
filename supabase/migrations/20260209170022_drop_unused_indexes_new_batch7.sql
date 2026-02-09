/*
  # Drop Unused Indexes - New Batch 7
  
  1. Indexes to Drop (Notifications, Orders, Partners, Payments)
    - Notification system
    - Order processing
    - Partner system
    - Payment processing
  
  2. Performance Impact
    - Reduces storage overhead
    - Speeds up INSERT/UPDATE operations
    - All indexes have idx_scan = 0 (never used)
*/

-- Notification indexes
DROP INDEX IF EXISTS idx_notifications_created_at;
DROP INDEX IF EXISTS idx_notifications_read;
DROP INDEX IF EXISTS idx_notifications_type;
DROP INDEX IF EXISTS idx_notifications_user_id;

-- Order indexes
DROP INDEX IF EXISTS idx_merchant_orders_merchant_id;
DROP INDEX IF EXISTS idx_merchant_orders_status;
DROP INDEX IF EXISTS idx_order_items_order_id;
DROP INDEX IF EXISTS idx_order_items_product_id;

-- Partner indexes
DROP INDEX IF EXISTS idx_partner_commissions_partner_id;
DROP INDEX IF EXISTS idx_partner_commissions_status;
DROP INDEX IF EXISTS idx_partner_contracts_partner_id;
DROP INDEX IF EXISTS idx_partner_contracts_status;
DROP INDEX IF EXISTS idx_partner_territories_partner_id;
DROP INDEX IF EXISTS idx_partner_territories_status;
DROP INDEX IF EXISTS idx_partners_email;
DROP INDEX IF EXISTS idx_partners_status;

-- Payment indexes
DROP INDEX IF EXISTS idx_paybright_transactions_merchant_id;
DROP INDEX IF EXISTS idx_paybright_transactions_status;
DROP INDEX IF EXISTS idx_payments_customer_id;
DROP INDEX IF EXISTS idx_payments_merchant_id;
DROP INDEX IF EXISTS idx_payments_status;