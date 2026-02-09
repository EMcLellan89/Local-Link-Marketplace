/*
  # Drop Unused Indexes - Batch 11: Websites, Winback, Additional Tables
  
  ## Tables Covered:
  - website_* tables
  - white_label_* tables
  - winback_* tables
  - Additional unused indexes from various tables
*/

-- Website tables
DROP INDEX IF EXISTS idx_website_templates_category;
DROP INDEX IF EXISTS idx_website_templates_created_at;
DROP INDEX IF EXISTS idx_websites_created_at;
DROP INDEX IF EXISTS idx_websites_merchant_id;

-- White label tables
DROP INDEX IF EXISTS idx_white_label_licenses_created_at;
DROP INDEX IF EXISTS idx_white_label_licenses_partner_id;

-- Winback tables
DROP INDEX IF EXISTS idx_winback_campaigns_created_at;
DROP INDEX IF EXISTS idx_winback_campaigns_merchant_id;

-- Additional unused indexes from various tables
DROP INDEX IF EXISTS idx_academy_enrollments_created_at;
DROP INDEX IF EXISTS idx_academy_enrollments_enrolled_at;
DROP INDEX IF EXISTS idx_academy_quiz_attempts_created_at;
DROP INDEX IF EXISTS idx_badges_badge_type;
DROP INDEX IF EXISTS idx_blog_posts_status;
DROP INDEX IF EXISTS idx_bot_audit_logs_created_at;
DROP INDEX IF EXISTS idx_business_deals_end_date;
DROP INDEX IF EXISTS idx_business_deals_start_date;
DROP INDEX IF EXISTS idx_campaign_creatives_status;
DROP INDEX IF EXISTS idx_cart_abandoned_at;
DROP INDEX IF EXISTS idx_certificates_certificate_type;
DROP INDEX IF EXISTS idx_crm_deals_status;
DROP INDEX IF EXISTS idx_crm_subscriptions_status;
DROP INDEX IF EXISTS idx_customer_referral_campaigns_status;
DROP INDEX IF EXISTS idx_customer_referrals_status;
DROP INDEX IF EXISTS idx_deal_redemptions_redeemed_at;
DROP INDEX IF EXISTS idx_deals_status;
DROP INDEX IF EXISTS idx_dfy_fulfillment_tasks_status;
DROP INDEX IF EXISTS idx_email_sends_status;
DROP INDEX IF EXISTS idx_event_registrations_status;
DROP INDEX IF EXISTS idx_events_end_date;
DROP INDEX IF EXISTS idx_events_start_date;
DROP INDEX IF EXISTS idx_expansion_requests_status;
DROP INDEX IF EXISTS idx_gift_cards_status;
DROP INDEX IF EXISTS idx_job_applications_applied_at;
DROP INDEX IF EXISTS idx_job_postings_status;
DROP INDEX IF EXISTS idx_loyalty_programs_status;
DROP INDEX IF EXISTS idx_marketplace_orders_ordered_at;
DROP INDEX IF EXISTS idx_merchant_subscriptions_created_at;
DROP INDEX IF EXISTS idx_notifications_notification_type;