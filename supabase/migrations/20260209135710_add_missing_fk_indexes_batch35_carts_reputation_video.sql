/*
  # Add Missing Foreign Key Indexes - Batch 35: Shopping Carts, Reputation & Video

  1. Changes
    - Add indexes for shopping_carts (customer_id, merchant_id)
    - Add indexes for cart_items (cart_id, product_id, variant_id)
    - Add indexes for reputation_reviews (merchant_id, platform_id)
    - Add indexes for reputation_responses (merchant_id, review_id, posted_by)
    - Add indexes for reputation_campaigns (merchant_id)
    - Add indexes for reputation_alerts (merchant_id)
    - Add indexes for video_service_orders (merchant_id)
    - Add indexes for video_scripts (order_id, approved_by)
    - Add indexes for video_deliverables (order_id)
    - Add indexes for video_revisions (order_id, requested_by)
    
  2. Rationale
    - Shopping cart operations require customer and merchant lookups
    - Reputation management needs merchant and review filtering
    - Video services need order tracking
    
  3. Performance Impact
    - Faster cart operations
    - Better reputation monitoring
    - Improved video order management
*/

-- Shopping Carts
CREATE INDEX IF NOT EXISTS idx_shopping_carts_customer_id ON shopping_carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_merchant_id ON shopping_carts(merchant_id);

-- Cart Items
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_variant_id ON cart_items(variant_id);

-- Reputation Reviews
CREATE INDEX IF NOT EXISTS idx_reputation_reviews_merchant_id ON reputation_reviews(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reputation_reviews_platform_id ON reputation_reviews(platform_id);

-- Reputation Responses
CREATE INDEX IF NOT EXISTS idx_reputation_responses_merchant_id ON reputation_responses(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reputation_responses_review_id ON reputation_responses(review_id);
CREATE INDEX IF NOT EXISTS idx_reputation_responses_posted_by ON reputation_responses(posted_by);

-- Reputation Campaigns
CREATE INDEX IF NOT EXISTS idx_reputation_campaigns_merchant_id ON reputation_campaigns(merchant_id);

-- Reputation Alerts
CREATE INDEX IF NOT EXISTS idx_reputation_alerts_merchant_id ON reputation_alerts(merchant_id);

-- Video Service Orders
CREATE INDEX IF NOT EXISTS idx_video_service_orders_merchant_id ON video_service_orders(merchant_id);

-- Video Scripts
CREATE INDEX IF NOT EXISTS idx_video_scripts_order_id ON video_scripts(order_id);
CREATE INDEX IF NOT EXISTS idx_video_scripts_approved_by ON video_scripts(approved_by);

-- Video Deliverables
CREATE INDEX IF NOT EXISTS idx_video_deliverables_order_id ON video_deliverables(order_id);

-- Video Revisions
CREATE INDEX IF NOT EXISTS idx_video_revisions_order_id ON video_revisions(order_id);
CREATE INDEX IF NOT EXISTS idx_video_revisions_requested_by ON video_revisions(requested_by);
