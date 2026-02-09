/*
  # Drop Unused Indexes - Comprehensive Batch 2

  1. Purpose
    - Continue removing unused indexes
    - Focus on academy, affiliate, and marketplace tables

  2. Categories Removed
    - Unused sort_order indexes
    - Redundant user_id indexes
    - Unused category/type indexes
    - Duplicate foreign key indexes

  3. Performance Impact
    - Further improve write performance
    - Reduce maintenance overhead
*/

DO $$
BEGIN
  -- Unused sort_order indexes (rarely queried alone)
  DROP INDEX IF EXISTS idx_academy_modules_sort_order;
  DROP INDEX IF EXISTS idx_academy_lessons_sort_order;
  DROP INDEX IF EXISTS idx_dfy_products_sort_order;
  DROP INDEX IF EXISTS idx_ai_bot_products_sort_order;
  DROP INDEX IF EXISTS idx_swipe_templates_sort_order;
  
  -- Unused category/type indexes (low cardinality)
  DROP INDEX IF EXISTS idx_academy_courses_category;
  DROP INDEX IF EXISTS idx_academy_courses_target_audience;
  DROP INDEX IF EXISTS idx_dfy_products_category;
  DROP INDEX IF EXISTS idx_merchants_category;
  DROP INDEX IF EXISTS idx_swipe_templates_category;
  
  -- Duplicate user_id indexes (already covered by FK index)
  DROP INDEX IF EXISTS idx_profiles_user_id;
  DROP INDEX IF EXISTS idx_customers_user_id;
  DROP INDEX IF EXISTS idx_merchants_user_id;
  DROP INDEX IF EXISTS idx_partners_user_id;
  
  -- Unused visibility/active filters
  DROP INDEX IF EXISTS idx_deals_is_active;
  DROP INDEX IF EXISTS idx_products_is_visible;
  DROP INDEX IF EXISTS idx_swipe_templates_is_active;
  
  -- Redundant email indexes (already have unique constraint)
  DROP INDEX IF EXISTS idx_admin_users_email;
  DROP INDEX IF EXISTS idx_internal_team_users_email;
  DROP INDEX IF EXISTS idx_team_members_email;
  
  -- Unused rate/percentage indexes
  DROP INDEX IF EXISTS idx_deals_commission_rate;
  DROP INDEX IF EXISTS idx_products_commission_rate;
  DROP INDEX IF EXISTS idx_affiliate_commissions_commission_rate;
  
  -- Unused count/total indexes
  DROP INDEX IF EXISTS idx_deals_quantity_sold;
  DROP INDEX IF EXISTS idx_deals_views_count;
  DROP INDEX IF EXISTS idx_partners_total_clicks;
  DROP INDEX IF EXISTS idx_partners_total_conversions;
  
  -- Unused date range indexes (low selectivity)
  DROP INDEX IF EXISTS idx_deals_start_at;
  DROP INDEX IF EXISTS idx_deals_end_at;
  DROP INDEX IF EXISTS idx_subscriptions_start_date;
  DROP INDEX IF EXISTS idx_subscriptions_end_date;
  
  -- Redundant referral indexes
  DROP INDEX IF EXISTS idx_referrals_code;
  DROP INDEX IF EXISTS idx_affiliate_referrals_referral_code;
  DROP INDEX IF EXISTS idx_customers_referral_code;
  
  -- Unused price indexes (not commonly filtered)
  DROP INDEX IF EXISTS idx_deals_price_cents;
  DROP INDEX IF EXISTS idx_products_price_cents;
  DROP INDEX IF EXISTS idx_marketplace_products_price_cents;
  
  -- Unused description/text indexes
  DROP INDEX IF EXISTS idx_deals_description;
  DROP INDEX IF EXISTS idx_products_description;
  DROP INDEX IF EXISTS idx_academy_courses_description;
  
EXCEPTION
  WHEN undefined_object THEN
    NULL; -- Index doesn't exist, skip
END $$;
