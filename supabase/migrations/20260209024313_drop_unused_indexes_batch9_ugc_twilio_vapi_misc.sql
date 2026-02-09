/*
  # Drop Unused Indexes - Batch 9: UGC, Twilio, VAPI & Miscellaneous Tables

  This migration drops unused indexes from UGC, communication, voice AI,
  and other miscellaneous tables.

  ## Tables Affected:
  - UGC (User Generated Content) tables
  - Twilio communication tables
  - VAPI voice AI tables
  - Miscellaneous system tables

  ## Impact:
  Removes unused indexes to improve write performance and reduce storage.
*/

-- UGC indexes
DROP INDEX IF EXISTS idx_ugc_orders_creator_id;
DROP INDEX IF EXISTS idx_ugc_orders_merchant_id;
DROP INDEX IF EXISTS idx_ugc_orders_status;
DROP INDEX IF EXISTS idx_ugc_orders_created_at;
DROP INDEX IF EXISTS idx_ugc_content_order_id;
DROP INDEX IF EXISTS idx_ugc_content_status;
DROP INDEX IF EXISTS idx_ugc_creators_status;
DROP INDEX IF EXISTS idx_ugc_creators_created_at;

-- Twilio communication indexes
DROP INDEX IF EXISTS idx_twilio_messages_merchant_id;
DROP INDEX IF EXISTS idx_twilio_messages_direction;
DROP INDEX IF EXISTS idx_twilio_messages_status;
DROP INDEX IF EXISTS idx_twilio_messages_created_at;
DROP INDEX IF EXISTS idx_twilio_calls_merchant_id;
DROP INDEX IF EXISTS idx_twilio_calls_direction;
DROP INDEX IF EXISTS idx_twilio_calls_status;
DROP INDEX IF EXISTS idx_twilio_calls_created_at;

-- VAPI voice AI indexes
DROP INDEX IF EXISTS idx_vapi_configs_merchant_id;
DROP INDEX IF EXISTS idx_vapi_configs_is_active;
DROP INDEX IF EXISTS idx_vapi_call_logs_merchant_id;
DROP INDEX IF EXISTS idx_vapi_call_logs_call_status;
DROP INDEX IF EXISTS idx_vapi_call_logs_created_at;

-- Miscellaneous indexes
DROP INDEX IF EXISTS idx_categories_parent_id;
DROP INDEX IF EXISTS idx_categories_slug;
DROP INDEX IF EXISTS idx_qr_codes_merchant_id;
DROP INDEX IF EXISTS idx_qr_codes_deal_id;
DROP INDEX IF EXISTS idx_qr_codes_created_at;
DROP INDEX IF EXISTS idx_scheduled_posts_merchant_id;
DROP INDEX IF EXISTS idx_scheduled_posts_post_date;
DROP INDEX IF EXISTS idx_scheduled_posts_status;
DROP INDEX IF EXISTS idx_website_templates_category;
DROP INDEX IF EXISTS idx_website_templates_is_active;