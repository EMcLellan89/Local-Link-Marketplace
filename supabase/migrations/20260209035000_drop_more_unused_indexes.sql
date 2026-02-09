/*
  # Drop More Unused Indexes - Batch 2

  1. Purpose
    - Continue removing unused indexes to improve write performance
    - Free up database storage space

  2. Indexes Removed
    - Unused status indexes
    - Unused composite indexes
    - Redundant foreign key indexes
*/

-- Drop unused status/type indexes
DROP INDEX IF EXISTS idx_deals_status;
DROP INDEX IF EXISTS idx_purchases_status;
DROP INDEX IF EXISTS idx_merchant_applications_status;
DROP INDEX IF EXISTS idx_partner_applications_status;

-- Drop unused created_at/updated_at indexes (RLS doesn't need these)
DROP INDEX IF EXISTS idx_academy_courses_created_at;
DROP INDEX IF EXISTS idx_academy_modules_created_at;
DROP INDEX IF EXISTS idx_academy_lessons_created_at;
DROP INDEX IF EXISTS idx_orders_created_at;
DROP INDEX IF EXISTS idx_subscriptions_created_at;

-- Drop redundant composite indexes
DROP INDEX IF EXISTS idx_affiliate_clicks_composite;
DROP INDEX IF EXISTS idx_affiliate_referrals_composite;
DROP INDEX IF EXISTS idx_creative_events_composite;

-- Drop unused slug indexes (already have unique constraints)
DROP INDEX IF EXISTS idx_deals_slug;
DROP INDEX IF EXISTS idx_courses_slug;
DROP INDEX IF EXISTS idx_merchants_slug;
