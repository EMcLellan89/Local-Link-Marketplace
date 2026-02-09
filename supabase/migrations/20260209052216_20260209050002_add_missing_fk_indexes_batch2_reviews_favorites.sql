/*
  # Add Missing Foreign Key Indexes - Batch 2: Reviews, Favorites, Notifications

  1. Changes
    - Add indexes on foreign key columns for customer engagement features
    - Improves query performance for reviews, favorites, and notifications

  2. Tables Updated
    - reviews: merchant_id, customer_id, deal_id
    - favorites: customer_id, merchant_id, deal_id
    - notifications: customer_id, merchant_id
    - customer_preferences: customer_id
*/

-- Reviews table
CREATE INDEX IF NOT EXISTS idx_reviews_merchant_id ON reviews(merchant_id) WHERE merchant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reviews_deal_id ON reviews(deal_id) WHERE deal_id IS NOT NULL;

-- Favorites table
CREATE INDEX IF NOT EXISTS idx_favorites_customer_id ON favorites(customer_id);
CREATE INDEX IF NOT EXISTS idx_favorites_merchant_id ON favorites(merchant_id) WHERE merchant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_favorites_deal_id ON favorites(deal_id) WHERE deal_id IS NOT NULL;

-- Notifications table
CREATE INDEX IF NOT EXISTS idx_notifications_customer_id ON notifications(customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_merchant_id ON notifications(merchant_id) WHERE merchant_id IS NOT NULL;

-- Customer preferences table
CREATE INDEX IF NOT EXISTS idx_customer_preferences_customer_id ON customer_preferences(customer_id);
