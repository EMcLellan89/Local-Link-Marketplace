/*
  # Drop Unused Indexes - Final Batch 10 (Paybright and Payout)

  This migration removes unused indexes from payment-related tables.

  Tables covered:
  - paybright_refunds
  - paybright_subscriptions
  - paybright_audit_log
  - paybright_transactions
  - payout_batches
  - printing_orders
  - product_categories
  - product_course_map
  - product_variants
  - products
  - profiles
  - prompt_runs
  - prompts
  - qr_codes
  - recruiting_services
  - redemptions
*/

-- Paybright Tables
DROP INDEX IF EXISTS idx_paybright_refunds_transaction_id;
DROP INDEX IF EXISTS idx_paybright_subscriptions_customer_id;
DROP INDEX IF EXISTS idx_paybright_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_paybright_audit_log_merchant_id;
DROP INDEX IF EXISTS idx_paybright_audit_log_user_id;
DROP INDEX IF EXISTS idx_paybright_transactions_customer_id;
DROP INDEX IF EXISTS idx_paybright_transactions_merchant_id;
DROP INDEX IF EXISTS idx_payout_batches_partner_id;
DROP INDEX IF EXISTS idx_paybright_refunds_merchant_id;
DROP INDEX IF EXISTS idx_paybright_refunds_requested_by;

-- Printing and Products
DROP INDEX IF EXISTS idx_printing_orders_product_id;
DROP INDEX IF EXISTS idx_product_categories_parent_category_id;
DROP INDEX IF EXISTS idx_product_course_map_course_slug;
DROP INDEX IF EXISTS idx_product_variants_product_id;
DROP INDEX IF EXISTS idx_products_category_id;

-- Other Tables
DROP INDEX IF EXISTS idx_profiles_partner_id;
DROP INDEX IF EXISTS idx_prompt_runs_prompt_id;
DROP INDEX IF EXISTS idx_prompt_runs_user_id;
DROP INDEX IF EXISTS idx_prompts_category_id;
DROP INDEX IF EXISTS idx_qr_codes_created_by_partner_id;
DROP INDEX IF EXISTS idx_recruiting_services_merchant_id;
DROP INDEX IF EXISTS idx_redemptions_purchase_id;