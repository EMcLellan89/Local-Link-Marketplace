/*
  # Add Missing Foreign Key Indexes - Batch 19: UGC & Miscellaneous Tables

  1. New Indexes
    - ugc_creator_applications.partner_id
    - ugc_creator_profiles.partner_id
    - ugc_orders.creator_id
    - ugc_orders.merchant_id
    - ugc_orders.partner_id
    - video_courses.creator_id
    - video_course_enrollments.course_id
    - customer_referral_campaigns.merchant_id
    - customer_referral_links.campaign_id
    - customer_referral_links.customer_id
    - customer_referral_rewards.campaign_id
    - customer_referral_rewards.customer_id
    - customer_referral_tracking.campaign_id
    - customer_referral_tracking.referrer_id

  2. Performance Impact
    - Improves UGC creator and order tracking
    - Optimizes customer referral program queries
*/

-- UGC System Indexes
CREATE INDEX IF NOT EXISTS idx_ugc_creator_applications_partner_id ON ugc_creator_applications(partner_id);
CREATE INDEX IF NOT EXISTS idx_ugc_creator_profiles_partner_id ON ugc_creator_profiles(partner_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_creator_id ON ugc_orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_merchant_id ON ugc_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_partner_id ON ugc_orders(partner_id);

-- Video Course Indexes
CREATE INDEX IF NOT EXISTS idx_video_courses_creator_id ON video_courses(creator_id);
CREATE INDEX IF NOT EXISTS idx_video_course_enrollments_course_id ON video_course_enrollments(course_id);

-- Customer Referral Indexes
CREATE INDEX IF NOT EXISTS idx_customer_referral_campaigns_merchant_id ON customer_referral_campaigns(merchant_id);
CREATE INDEX IF NOT EXISTS idx_customer_referral_links_campaign_id ON customer_referral_links(campaign_id);
CREATE INDEX IF NOT EXISTS idx_customer_referral_links_customer_id ON customer_referral_links(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_referral_rewards_campaign_id ON customer_referral_rewards(campaign_id);
CREATE INDEX IF NOT EXISTS idx_customer_referral_rewards_customer_id ON customer_referral_rewards(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_referral_tracking_campaign_id ON customer_referral_tracking(campaign_id);
CREATE INDEX IF NOT EXISTS idx_customer_referral_tracking_referrer_id ON customer_referral_tracking(referrer_id);
