/*
  # Add Missing Foreign Key Indexes - Batch 4: Reviews & Engagement

  1. Changes
    - Add indexes for reviews (customer_id, merchant_id, purchase_id)
    - Add indexes for review_responses (review_id, merchant_id)
    - Add indexes for review_helpful_votes
    - Add indexes for favorites
    - Add indexes for notifications  
    - Add indexes for referrals
    - Add indexes for social_shares
    - Add indexes for deal impressions and clicks
    
  2. Rationale
    - Customer engagement features require fast lookups
    - Review queries are common in merchant and customer views
    
  3. Performance Impact
    - Faster review page loading
    - Better notification delivery
    - Improved referral tracking
*/

-- Reviews
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_merchant_id ON reviews(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_purchase_id ON reviews(purchase_id);

-- Review Responses
CREATE INDEX IF NOT EXISTS idx_review_responses_review_id ON review_responses(review_id);
CREATE INDEX IF NOT EXISTS idx_review_responses_merchant_id ON review_responses(merchant_id);

-- Review Helpful Votes
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_customer_id ON review_helpful_votes(customer_id);

-- Favorites
CREATE INDEX IF NOT EXISTS idx_favorites_merchant_id ON favorites(merchant_id);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_customer_id ON notifications(customer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_merchant_id ON notifications(merchant_id);

-- Referrals
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_customer_id ON referrals(referrer_customer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_customer_id ON referrals(referred_customer_id);

-- Social Shares
CREATE INDEX IF NOT EXISTS idx_social_shares_customer_id ON social_shares(customer_id);

-- Deal Analytics
CREATE INDEX IF NOT EXISTS idx_deal_impressions_user_id ON deal_impressions(user_id);
CREATE INDEX IF NOT EXISTS idx_deal_clicks_user_id ON deal_clicks(user_id);
