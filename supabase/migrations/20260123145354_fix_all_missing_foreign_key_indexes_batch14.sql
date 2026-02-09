/*
  # Fix Missing Foreign Key Indexes - Batch 14 (Review, Scheduled, Service, Shopping, SMS, Social Tables)
  
  1. Performance
    - Add indexes on all unindexed foreign keys
  
  2. Tables Updated
    - review tables
    - scheduled_deals
    - service_bookings
    - shopping_carts
    - sms_queue
    - social tables
    - stripe_subscription_map
*/

CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_customer_id ON review_helpful_votes(customer_id);
CREATE INDEX IF NOT EXISTS idx_review_responses_review_id ON review_responses(review_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_purchase_id ON reviews(purchase_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_deals_template_id ON scheduled_deals(template_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_service_id ON service_bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_customer_id ON shopping_carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_merchant_id ON shopping_carts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_sms_queue_user_id ON sms_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_social_shares_customer_id ON social_shares(customer_id);
CREATE INDEX IF NOT EXISTS idx_social_ugc_subscriptions_merchant_id ON social_ugc_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_social_ugc_subscriptions_package_id ON social_ugc_subscriptions(package_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscription_map_user_id ON stripe_subscription_map(user_id);
