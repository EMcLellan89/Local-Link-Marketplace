/*
  # Drop Unused Indexes - Batch 23
*/

DROP INDEX IF EXISTS idx_products_category_id;
DROP INDEX IF EXISTS idx_product_variants_product_id;
DROP INDEX IF EXISTS idx_ecommerce_orders_customer_id;
DROP INDEX IF EXISTS idx_ecommerce_orders_merchant_id;
DROP INDEX IF EXISTS idx_order_items_variant_id;
DROP INDEX IF EXISTS idx_jobs_created_by_admin_id;
DROP INDEX IF EXISTS idx_ll_books_expenses_created_by;
DROP INDEX IF EXISTS idx_ll_books_expenses_merchant_id;
DROP INDEX IF EXISTS idx_ll_books_income_invoice_id;
DROP INDEX IF EXISTS idx_ll_books_income_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_ai_usage_contact_id;
DROP INDEX IF EXISTS idx_ll_crm_ai_usage_deal_id;
DROP INDEX IF EXISTS idx_ll_crm_ai_usage_feature_id;
DROP INDEX IF EXISTS idx_ll_crm_documents_contact_id;
DROP INDEX IF EXISTS idx_ll_crm_documents_deal_id;
DROP INDEX IF EXISTS idx_ll_crm_documents_uploaded_by;
DROP INDEX IF EXISTS idx_shopping_carts_merchant_id;
DROP INDEX IF EXISTS idx_cart_items_variant_id;
DROP INDEX IF EXISTS idx_reputation_reviews_merchant_id;
DROP INDEX IF EXISTS idx_reputation_reviews_platform_id;
