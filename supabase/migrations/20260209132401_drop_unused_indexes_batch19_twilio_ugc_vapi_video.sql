/*
  # Drop Unused Indexes - Batch 19: Twilio, UGC, VAPI, and Video Tables

  1. Changes
    - Drop unused indexes from twilio_* tables
    - Drop unused indexes from ugc_* tables
    - Drop unused indexes from vapi_* tables
    - Drop unused indexes from video_* tables
    
  2. Rationale
    - These indexes have idx_scan = 0, never used by queries
    - Improves database write performance
*/

-- Twilio tables
DROP INDEX IF EXISTS idx_twilio_call_logs_lead_id;
DROP INDEX IF EXISTS idx_twilio_call_logs_merchant_id;
DROP INDEX IF EXISTS idx_twilio_call_queues_merchant_id;
DROP INDEX IF EXISTS idx_twilio_configurations_merchant_id;
DROP INDEX IF EXISTS idx_twilio_email_logs_lead_id;
DROP INDEX IF EXISTS idx_twilio_email_logs_merchant_id;
DROP INDEX IF EXISTS idx_twilio_phone_numbers_merchant_id;
DROP INDEX IF EXISTS idx_twilio_sms_logs_lead_id;
DROP INDEX IF EXISTS idx_twilio_sms_logs_merchant_id;
DROP INDEX IF EXISTS idx_twilio_voicemails_lead_id;
DROP INDEX IF EXISTS idx_twilio_voicemails_merchant_id;

-- UGC tables
DROP INDEX IF EXISTS idx_ugc_assets_order_id;
DROP INDEX IF EXISTS idx_ugc_orders_creator_id;
DROP INDEX IF EXISTS idx_ugc_orders_merchant_id;
DROP INDEX IF EXISTS idx_ugc_orders_package_id;
DROP INDEX IF EXISTS idx_ugc_payouts_creator_id;
DROP INDEX IF EXISTS idx_ugc_payouts_order_id;

-- Unified tables
DROP INDEX IF EXISTS idx_unified_customers_primary_business_unit_id;
DROP INDEX IF EXISTS idx_unified_sales_business_unit_id;
DROP INDEX IF EXISTS idx_unified_sales_customer_id;
DROP INDEX IF EXISTS idx_unified_sales_invoice_id;

-- Upsell and user tables
DROP INDEX IF EXISTS idx_upsell_purchases_upsell_offer_id;
DROP INDEX IF EXISTS idx_upsell_purchases_user_id;
DROP INDEX IF EXISTS idx_user_entitlements_course_id;
DROP INDEX IF EXISTS idx_user_subscriptions_user_id;

-- VAPI tables
DROP INDEX IF EXISTS idx_vapi_assistants_merchant_id;
DROP INDEX IF EXISTS idx_vapi_call_logs_assistant_id;
DROP INDEX IF EXISTS idx_vapi_call_logs_customer_id;
DROP INDEX IF EXISTS idx_vapi_call_logs_merchant_id;
DROP INDEX IF EXISTS idx_vapi_configurations_merchant_id;
DROP INDEX IF EXISTS idx_vapi_tools_assistant_id;

-- Video tables
DROP INDEX IF EXISTS idx_video_deliverables_order_id;
DROP INDEX IF EXISTS idx_video_revisions_order_id;
DROP INDEX IF EXISTS idx_video_revisions_requested_by;
DROP INDEX IF EXISTS idx_video_scripts_approved_by;
DROP INDEX IF EXISTS idx_video_scripts_order_id;
DROP INDEX IF EXISTS idx_video_service_orders_merchant_id;
