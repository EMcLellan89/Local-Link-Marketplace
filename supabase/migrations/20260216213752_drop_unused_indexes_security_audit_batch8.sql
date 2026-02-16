/*
  # Drop Unused Indexes - Security Audit Batch 8
  
  Drops unused indexes from postcard, product, profit network, purchase, and QR code tables.
  
  These indexes have not been used and are safe to remove for improved database performance.
  
  Tables affected:
  - postcard_campaigns, postcard_orders
  - printing_products, product_categories, products
  - profit_network_businesses, profit_network_playbooks
  - purchase_history, purchases
  - qr_codes
*/

-- Postcard tables
DROP INDEX IF EXISTS idx_postcard_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_postcard_campaigns_status;
DROP INDEX IF EXISTS idx_postcard_orders_merchant_id;
DROP INDEX IF EXISTS idx_postcard_orders_status;

-- Product tables
DROP INDEX IF EXISTS idx_printing_products_category;
DROP INDEX IF EXISTS idx_product_categories_parent_id;
DROP INDEX IF EXISTS idx_products_merchant_id;
DROP INDEX IF EXISTS idx_products_category_id;

-- Profit network tables
DROP INDEX IF EXISTS idx_profit_network_businesses_slug;
DROP INDEX IF EXISTS idx_profit_network_playbooks_business_id;

-- Purchase tables
DROP INDEX IF EXISTS idx_purchase_history_customer_id;
DROP INDEX IF EXISTS idx_purchase_history_merchant_id;
DROP INDEX IF EXISTS idx_purchases_customer_id;
DROP INDEX IF EXISTS idx_purchases_deal_id;

-- QR code tables
DROP INDEX IF EXISTS idx_qr_codes_merchant_id;
DROP INDEX IF EXISTS idx_qr_codes_deal_id;