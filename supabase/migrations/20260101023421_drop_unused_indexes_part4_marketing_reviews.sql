/*
  # Drop Unused Indexes - Part 4: Marketing & Reviews
  
  1. Removes unused indexes from marketing and review tables
  2. Tables affected:
     - marketing_campaigns, campaign_recipients, deal_impressions, deal_clicks
     - reviews, review_responses, review_helpful_votes
     - social_shares, referrals, customer_preferences
*/

-- Drop unused indexes on marketing_campaigns
DROP INDEX IF EXISTS idx_marketing_campaigns_segment_id;
DROP INDEX IF EXISTS idx_marketing_campaigns_status;
DROP INDEX IF EXISTS idx_marketing_campaigns_scheduled_at;

-- Drop unused indexes on campaign_recipients
DROP INDEX IF EXISTS idx_campaign_recipients_campaign_id;
DROP INDEX IF EXISTS idx_campaign_recipients_customer_id;
DROP INDEX IF EXISTS idx_campaign_recipients_status;

-- Drop unused indexes on deal_impressions
DROP INDEX IF EXISTS idx_deal_impressions_user_id;
DROP INDEX IF EXISTS idx_deal_impressions_viewed_at;
DROP INDEX IF EXISTS idx_deal_impressions_session_id;

-- Drop unused indexes on deal_clicks
DROP INDEX IF EXISTS idx_deal_clicks_user_id;
DROP INDEX IF EXISTS idx_deal_clicks_clicked_at;

-- Drop unused indexes on deal_performance_stats
DROP INDEX IF EXISTS idx_deal_performance_stats_roi;
DROP INDEX IF EXISTS idx_deal_performance_stats_revenue;

-- Drop unused indexes on deal_analytics
DROP INDEX IF EXISTS idx_deal_analytics_date;

-- Drop unused indexes on merchant_ad_costs
DROP INDEX IF EXISTS idx_merchant_ad_costs_billing_period;

-- Drop unused indexes on reviews
DROP INDEX IF EXISTS idx_reviews_purchase_id;
DROP INDEX IF EXISTS idx_reviews_customer_id;
DROP INDEX IF EXISTS idx_reviews_rating;

-- Drop unused indexes on review_responses
DROP INDEX IF EXISTS idx_review_responses_review_id;

-- Drop unused indexes on review_helpful_votes
DROP INDEX IF EXISTS idx_review_helpful_votes_customer_id;
DROP INDEX IF EXISTS idx_review_helpful_votes_review_id;

-- Drop unused indexes on social_shares
DROP INDEX IF EXISTS idx_social_shares_customer_id;

-- Drop unused indexes on referrals
DROP INDEX IF EXISTS idx_referrals_referred_id;
DROP INDEX IF EXISTS idx_referrals_code;
DROP INDEX IF EXISTS idx_referrals_referrer_id;

-- Drop unused indexes on customer_preferences
DROP INDEX IF EXISTS idx_customer_preferences_customer_id;
