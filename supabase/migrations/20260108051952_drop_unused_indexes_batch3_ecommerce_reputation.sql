/*
  # Drop Unused Indexes - Batch 3: Ecommerce & Reputation Tables
  
  1. Performance Optimization
    - Remove 25 unused indexes from ecommerce and reputation tables
  
  2. Affected Tables
    - ecommerce_orders, order_items, shopping_carts, cart_items
    - reputation_platforms, reputation_reviews, reputation_responses
    - reputation_campaigns, reputation_alerts
    - review_helpful_votes
*/

-- ecommerce_orders
DROP INDEX IF EXISTS idx_ecommerce_orders_merchant;
DROP INDEX IF EXISTS idx_ecommerce_orders_customer;
DROP INDEX IF EXISTS idx_ecommerce_orders_status;

-- order_items
DROP INDEX IF EXISTS idx_order_items_order;
DROP INDEX IF EXISTS idx_order_items_product;
DROP INDEX IF EXISTS idx_order_items_variant_id;

-- shopping_carts
DROP INDEX IF EXISTS idx_shopping_carts_merchant;
DROP INDEX IF EXISTS idx_shopping_carts_customer;

-- cart_items
DROP INDEX IF EXISTS idx_cart_items_cart;
DROP INDEX IF EXISTS idx_cart_items_product_id;
DROP INDEX IF EXISTS idx_cart_items_variant_id;

-- reputation_platforms
DROP INDEX IF EXISTS idx_reputation_platforms_merchant;

-- reputation_reviews
DROP INDEX IF EXISTS idx_reputation_reviews_merchant;
DROP INDEX IF EXISTS idx_reputation_reviews_platform;
DROP INDEX IF EXISTS idx_reputation_reviews_sentiment;
DROP INDEX IF EXISTS idx_reputation_reviews_date;

-- reputation_responses
DROP INDEX IF EXISTS idx_reputation_responses_review;
DROP INDEX IF EXISTS idx_reputation_responses_merchant_id;
DROP INDEX IF EXISTS idx_reputation_responses_posted_by;

-- reputation_campaigns
DROP INDEX IF EXISTS idx_reputation_campaigns_merchant;

-- reputation_alerts
DROP INDEX IF EXISTS idx_reputation_alerts_merchant;

-- review_helpful_votes
DROP INDEX IF EXISTS idx_review_helpful_votes_customer_id;
