/*
  # Drop Unused Indexes - Batch 15: PayBright, Product, and Profit Network Tables

  1. Changes
    - Drop unused indexes from paybright_* tables
    - Drop unused indexes from payout, printing, and product tables
    - Drop unused indexes from profit_network_* tables
    
  2. Rationale
    - These indexes have idx_scan = 0, never used by queries
    - Improves write performance
*/

-- PayBright tables
DROP INDEX IF EXISTS idx_paybright_audit_log_merchant_id;
DROP INDEX IF EXISTS idx_paybright_audit_log_user_id;
DROP INDEX IF EXISTS idx_paybright_rate_limits_merchant_id;
DROP INDEX IF EXISTS idx_paybright_refunds_merchant_id;
DROP INDEX IF EXISTS idx_paybright_refunds_requested_by;
DROP INDEX IF EXISTS idx_paybright_refunds_transaction_id;
DROP INDEX IF EXISTS idx_paybright_subscriptions_customer_id;
DROP INDEX IF EXISTS idx_paybright_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_paybright_transactions_customer_id;
DROP INDEX IF EXISTS idx_paybright_transactions_merchant_id;
DROP INDEX IF EXISTS idx_paybright_transactions_reference_id;

-- Payout and printing
DROP INDEX IF EXISTS idx_payout_batches_partner_id;
DROP INDEX IF EXISTS idx_printing_orders_product_id;

-- Product tables
DROP INDEX IF EXISTS idx_product_asset_access_asset_id;
DROP INDEX IF EXISTS idx_product_categories_parent_category_id;
DROP INDEX IF EXISTS idx_product_commission_rules_product_id;
DROP INDEX IF EXISTS idx_product_course_map_course_slug;
DROP INDEX IF EXISTS idx_product_variants_product_id;
DROP INDEX IF EXISTS idx_products_category_id;

-- Profiles and profit
DROP INDEX IF EXISTS idx_profiles_partner_id;
DROP INDEX IF EXISTS idx_profiles_referral_id;
DROP INDEX IF EXISTS idx_profit_based_commission_costs_product_id;
DROP INDEX IF EXISTS idx_profit_based_order;

-- Profit Network tables
DROP INDEX IF EXISTS idx_profit_network_ad_costs_partner_id;
DROP INDEX IF EXISTS idx_profit_network_deductions_enrollment_id;
DROP INDEX IF EXISTS idx_profit_network_deductions_partner_id;
DROP INDEX IF EXISTS idx_profit_network_deductions_sale_id;
DROP INDEX IF EXISTS idx_profit_network_enrollments_approved_by;
DROP INDEX IF EXISTS idx_profit_network_enrollments_business_id;
DROP INDEX IF EXISTS idx_profit_network_sales_business_id;
DROP INDEX IF EXISTS idx_profit_network_sales_enrollment_id;
DROP INDEX IF EXISTS idx_profit_network_sales_partner_id;
DROP INDEX IF EXISTS idx_profit_network_statements_enrollment_id;
