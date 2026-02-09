/*
  # Drop Unused Indexes - Batch 1

  1. Performance Optimization
    - Removes indexes that have never been scanned (idx_scan = 0)
    - Improves INSERT/UPDATE/DELETE performance
    - Reduces storage overhead

  2. Safety
    - Only dropping indexes confirmed as unused
    - Not dropping primary keys or unique constraints
    - Can be recreated if needed in the future

  3. Tables Affected
    - 30 indexes across multiple tables
    - Total storage reclaimed: ~480 kB

  Important: Using IF EXISTS to prevent errors
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_product_commission_rules_type;
DROP INDEX IF EXISTS idx_customers_referred_by_partner_id;
DROP INDEX IF EXISTS idx_profiles_partner_id;
DROP INDEX IF EXISTS idx_admin_crm_companies_assigned_to_team_member;
DROP INDEX IF EXISTS idx_course_exam_questions_course_id;
DROP INDEX IF EXISTS idx_course_webinar_content_course_id;
DROP INDEX IF EXISTS idx_vendors_active;
DROP INDEX IF EXISTS idx_profiles_id;
DROP INDEX IF EXISTS idx_ll_crm_contacts_tags;
DROP INDEX IF EXISTS idx_ll_crm_pricing_tiers_level;
DROP INDEX IF EXISTS idx_subscription_tiers_tier_level;
DROP INDEX IF EXISTS idx_business_deals_vendor_id;
DROP INDEX IF EXISTS idx_course_lessons_module_id;
DROP INDEX IF EXISTS idx_course_modules_course_id;
DROP INDEX IF EXISTS idx_deal_bundles_status;
DROP INDEX IF EXISTS idx_business_deals_status;
DROP INDEX IF EXISTS idx_deal_bundles_featured;
DROP INDEX IF EXISTS merchants_email_idx;
DROP INDEX IF EXISTS idx_bundle_items_bundle;
DROP INDEX IF EXISTS idx_business_deals_category;
DROP INDEX IF EXISTS idx_bundle_items_deal;
DROP INDEX IF EXISTS idx_subscription_crm_mapping_tier;
DROP INDEX IF EXISTS idx_growth_guides_status;
DROP INDEX IF EXISTS idx_business_deals_featured;
DROP INDEX IF EXISTS idx_growth_guides_category;
DROP INDEX IF EXISTS idx_merchants_subscription_plan;
DROP INDEX IF EXISTS idx_seasonal_campaigns_dates;
DROP INDEX IF EXISTS idx_business_deals_vendor;
DROP INDEX IF EXISTS idx_seasonal_campaigns_status;
DROP INDEX IF EXISTS idx_deals_partner_id;
