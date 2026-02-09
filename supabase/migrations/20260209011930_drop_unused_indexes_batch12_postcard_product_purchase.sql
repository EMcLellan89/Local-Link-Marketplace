/*
  # Drop Unused Indexes - Batch 12: Postcard, Product, and Purchase Tables
  
  This migration continues dropping unused indexes.
  
  ## Indexes Dropped
  - Postcard campaign indexes
  - Product and pricing indexes
  - Purchase history indexes
  
  ## Impact
  - Reduces storage usage
  - Improves write performance
*/

-- playbook_lessons
DROP INDEX IF EXISTS idx_playbook_lessons_playbook_id;

-- playbook_progress
DROP INDEX IF EXISTS idx_playbook_progress_partner_id;
DROP INDEX IF EXISTS idx_playbook_progress_playbook_id;

-- playbooks
DROP INDEX IF EXISTS idx_playbooks_business_id;

-- postcard_campaigns
DROP INDEX IF EXISTS idx_postcard_campaigns_merchant_id;

-- postcard_orders
DROP INDEX IF EXISTS idx_postcard_orders_merchant_id;

-- pricing_tiers
DROP INDEX IF EXISTS idx_pricing_tiers_merchant_id;

-- printing_orders
DROP INDEX IF EXISTS idx_printing_orders_merchant_id;

-- printing_products
DROP INDEX IF EXISTS idx_printing_products_category;

-- product_categories
DROP INDEX IF EXISTS idx_product_categories_merchant_id;

-- products
DROP INDEX IF EXISTS idx_products_category_id;
DROP INDEX IF EXISTS idx_products_merchant_id;

-- profit_network_businesses
DROP INDEX IF EXISTS idx_profit_network_businesses_slug;

-- profit_network_partner_stats
DROP INDEX IF EXISTS idx_profit_network_partner_stats_business_id;
DROP INDEX IF EXISTS idx_profit_network_partner_stats_partner_id;

-- purchases
DROP INDEX IF EXISTS idx_purchases_customer_id;
DROP INDEX IF EXISTS idx_purchases_deal_id;

-- qr_code_scans
DROP INDEX IF EXISTS idx_qr_code_scans_deal_id;
DROP INDEX IF EXISTS idx_qr_code_scans_qr_code_id;

-- qr_codes
DROP INDEX IF EXISTS idx_qr_codes_deal_id;
