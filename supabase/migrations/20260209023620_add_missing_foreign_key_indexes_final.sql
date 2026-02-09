/*
  # Add Missing Foreign Key Indexes

  This migration adds indexes for 11 unindexed foreign keys identified by Supabase security scan.
  
  ## Tables Affected:
  - ai_bot_subscriptions: bot_product_id
  - campaign_recipients: customer_id
  - course_exam_attempts: user_id
  - favorites: merchant_id
  - job_applications: partner_id
  - org_members: profile_id
  - partner_badges: badge_id
  - profit_network_enrollments: business_id
  - profit_network_statements: enrollment_id
  - reviews: merchant_id
  - user_entitlements: course_id

  ## Performance Impact:
  Adding these indexes will significantly improve query performance for JOIN operations
  and foreign key constraint checks on these columns.
*/

-- ai_bot_subscriptions.bot_product_id
CREATE INDEX IF NOT EXISTS idx_ai_bot_subscriptions_bot_product_id 
ON ai_bot_subscriptions(bot_product_id);

-- campaign_recipients.customer_id
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_customer_id 
ON campaign_recipients(customer_id);

-- course_exam_attempts.user_id
CREATE INDEX IF NOT EXISTS idx_course_exam_attempts_user_id 
ON course_exam_attempts(user_id);

-- favorites.merchant_id
CREATE INDEX IF NOT EXISTS idx_favorites_merchant_id 
ON favorites(merchant_id);

-- job_applications.partner_id
CREATE INDEX IF NOT EXISTS idx_job_applications_partner_id 
ON job_applications(partner_id);

-- org_members.profile_id
CREATE INDEX IF NOT EXISTS idx_org_members_profile_id 
ON org_members(profile_id);

-- partner_badges.badge_id
CREATE INDEX IF NOT EXISTS idx_partner_badges_badge_id 
ON partner_badges(badge_id);

-- profit_network_enrollments.business_id
CREATE INDEX IF NOT EXISTS idx_profit_network_enrollments_business_id 
ON profit_network_enrollments(business_id);

-- profit_network_statements.enrollment_id
CREATE INDEX IF NOT EXISTS idx_profit_network_statements_enrollment_id 
ON profit_network_statements(enrollment_id);

-- reviews.merchant_id
CREATE INDEX IF NOT EXISTS idx_reviews_merchant_id 
ON reviews(merchant_id);

-- user_entitlements.course_id
CREATE INDEX IF NOT EXISTS idx_user_entitlements_course_id 
ON user_entitlements(course_id);