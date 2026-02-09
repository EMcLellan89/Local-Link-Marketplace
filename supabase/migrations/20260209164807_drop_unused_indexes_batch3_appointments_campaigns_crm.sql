/*
  # Drop Unused Indexes - Batch 3: Appointments, Campaigns, and CRM
  
  ## Tables Covered:
  - appointments
  - audit_log
  - badges
  - blog_* tables
  - bot_* tables
  - business_* tables
  - bundle_* tables
  - campaign_* tables
  - cart
  - certificates
  - coaching_* tables
  - communications_* tables
  - crm_* tables
*/

-- Appointments and Audit
DROP INDEX IF EXISTS idx_appointments_created_at;
DROP INDEX IF EXISTS idx_appointments_scheduled_at;
DROP INDEX IF EXISTS idx_audit_log_created_at;
DROP INDEX IF EXISTS idx_audit_log_user_id;

-- Badges
DROP INDEX IF EXISTS idx_badges_created_at;
DROP INDEX IF EXISTS idx_partner_badges_awarded_at;
DROP INDEX IF EXISTS idx_partner_badges_partner_id;

-- Blog tables
DROP INDEX IF EXISTS idx_blog_categories_created_at;
DROP INDEX IF EXISTS idx_blog_posts_author_id;
DROP INDEX IF EXISTS idx_blog_posts_category_id;
DROP INDEX IF EXISTS idx_blog_posts_created_at;
DROP INDEX IF EXISTS idx_blog_posts_published_at;

-- Bot tables
DROP INDEX IF EXISTS idx_bot_tool_permissions_bot_id;

-- Business tables
DROP INDEX IF EXISTS idx_business_ad_orders_created_at;
DROP INDEX IF EXISTS idx_business_ad_orders_merchant_id;
DROP INDEX IF EXISTS idx_business_deal_orders_created_at;
DROP INDEX IF EXISTS idx_business_deals_business_id;
DROP INDEX IF EXISTS idx_business_deals_created_at;

-- Bundle tables
DROP INDEX IF EXISTS idx_bundle_products_bundle_id;

-- Campaign tables
DROP INDEX IF EXISTS idx_campaign_creatives_campaign_id;
DROP INDEX IF EXISTS idx_campaign_creatives_created_at;

-- Cart
DROP INDEX IF EXISTS idx_cart_items_cart_id;
DROP INDEX IF EXISTS idx_cart_items_product_id;

-- Certificates
DROP INDEX IF EXISTS idx_certificates_created_at;
DROP INDEX IF EXISTS idx_certificates_issued_at;

-- Coaching
DROP INDEX IF EXISTS idx_coaching_sessions_coach_id;
DROP INDEX IF EXISTS idx_coaching_sessions_created_at;
DROP INDEX IF EXISTS idx_coaching_sessions_merchant_id;

-- Communications
DROP INDEX IF EXISTS idx_communications_credits_merchant_id;
DROP INDEX IF EXISTS idx_communications_transactions_created_at;
DROP INDEX IF EXISTS idx_communications_transactions_merchant_id;

-- CRM tables
DROP INDEX IF EXISTS idx_crm_activities_created_at;
DROP INDEX IF EXISTS idx_crm_contacts_created_at;
DROP INDEX IF EXISTS idx_crm_deals_created_at;
DROP INDEX IF EXISTS idx_crm_deals_merchant_id;
DROP INDEX IF EXISTS idx_crm_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_crm_tasks_created_at;
DROP INDEX IF EXISTS idx_crm_tasks_due_date;