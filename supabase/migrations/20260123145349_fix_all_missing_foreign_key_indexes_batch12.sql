/*
  # Fix Missing Foreign Key Indexes - Batch 12 (Paybright, Payout, Printing, Product Tables)
  
  1. Performance
    - Add indexes on all unindexed foreign keys
  
  2. Tables Updated
    - paybright tables
    - payout_batches
    - printing tables
    - product tables
*/

CREATE INDEX IF NOT EXISTS idx_paybright_audit_log_merchant_id ON paybright_audit_log(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_audit_log_user_id ON paybright_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_merchant_id ON paybright_refunds(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_requested_by ON paybright_refunds(requested_by);
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_transaction_id ON paybright_refunds(transaction_id);
CREATE INDEX IF NOT EXISTS idx_paybright_subscriptions_customer_id ON paybright_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_paybright_subscriptions_merchant_id ON paybright_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_customer_id ON paybright_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_merchant_id ON paybright_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_payout_batches_partner_id ON payout_batches(partner_id);
CREATE INDEX IF NOT EXISTS idx_printing_orders_product_id ON printing_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_parent_category_id ON product_categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_product_course_map_course_slug ON product_course_map(course_slug);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_profiles_partner_id ON profiles(partner_id);
