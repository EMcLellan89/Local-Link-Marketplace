/*
  # Drop Unused Indexes - Batch 7: UGC, Video, Courses, and Related Tables
  
  1. Performance Optimization
    - Remove 40+ unused indexes from UGC, video services, and course tables
  
  2. Affected Tables
    - ugc_assets, ugc_orders, ugc_payouts, ugc_creators
    - website_orders, course_affiliate_referrals, course_affiliate_payouts
    - course_exam_attempts, customer_activity_log, customer_email_segments
    - customer_impersonation_log, twilio_voicemails, video_revisions
    - video_scripts, winback_conversions, winback_outreach
    - video_service_orders, video_deliverables, social_ugc_subscriptions
*/

-- ugc_assets
DROP INDEX IF EXISTS idx_ugc_assets_order_id;

-- ugc_orders
DROP INDEX IF EXISTS idx_ugc_orders_creator_id;
DROP INDEX IF EXISTS idx_ugc_orders_package_id;

-- ugc_payouts
DROP INDEX IF EXISTS idx_ugc_payouts_creator_id;
DROP INDEX IF EXISTS idx_ugc_payouts_order_id;

-- ugc_creators
DROP INDEX IF EXISTS idx_ugc_creators_stripe_connect;

-- website_orders
DROP INDEX IF EXISTS idx_website_orders_merchant_id;
DROP INDEX IF EXISTS idx_website_orders_template_id;

-- course_affiliate_referrals
DROP INDEX IF EXISTS idx_course_affiliate_referrals_order_id;
DROP INDEX IF EXISTS idx_course_affiliate_referrals_affiliate;
DROP INDEX IF EXISTS idx_course_affiliate_referrals_referred_user;

-- course_affiliate_payouts
DROP INDEX IF EXISTS idx_course_affiliate_payouts_affiliate;

-- course_exam_attempts
DROP INDEX IF EXISTS idx_course_exam_attempts_user_id;

-- customer_activity_log
DROP INDEX IF EXISTS idx_customer_activity_log_performed_by;

-- customer_email_segments
DROP INDEX IF EXISTS idx_customer_email_segments_created_by;
DROP INDEX IF EXISTS idx_customer_email_segments_business;

-- customer_impersonation_log
DROP INDEX IF EXISTS idx_customer_impersonation_log_business_unit_id;

-- twilio_voicemails
DROP INDEX IF EXISTS idx_twilio_voicemails_lead_id;

-- unified_sales
DROP INDEX IF EXISTS idx_unified_sales_invoice_id;

-- video_revisions
DROP INDEX IF EXISTS idx_video_revisions_requested_by;
DROP INDEX IF EXISTS idx_video_revisions_order;

-- video_scripts
DROP INDEX IF EXISTS idx_video_scripts_approved_by;
DROP INDEX IF EXISTS idx_video_scripts_order;

-- winback_conversions
DROP INDEX IF EXISTS idx_winback_conversions_customer_id;

-- winback_outreach
DROP INDEX IF EXISTS idx_winback_outreach_campaign_id;

-- video_service_orders
DROP INDEX IF EXISTS idx_video_orders_merchant;
DROP INDEX IF EXISTS idx_video_orders_status;

-- video_deliverables
DROP INDEX IF EXISTS idx_video_deliverables_order;

-- social_ugc_subscriptions
DROP INDEX IF EXISTS idx_social_ugc_subscriptions_package_id;
DROP INDEX IF EXISTS idx_social_ugc_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_social_ugc_subscriptions_status;
