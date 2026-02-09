/*
  # Drop Unused Indexes - Batch 15: Twilio, UGC, VAPI, and Final Tables
  
  This migration completes dropping all unused indexes.
  
  ## Indexes Dropped
  - Twilio communication indexes
  - UGC creator and video indexes
  - VAPI voice AI indexes
  - Remaining unused indexes
  
  ## Impact
  - Reduces storage usage
  - Improves write performance
  - Completes unused index cleanup
*/

-- transactions
DROP INDEX IF EXISTS idx_transactions_customer_id;
DROP INDEX IF EXISTS idx_transactions_merchant_id;
DROP INDEX IF EXISTS idx_transactions_user_id;

-- twilio_call_logs
DROP INDEX IF EXISTS idx_twilio_call_logs_merchant_id;

-- twilio_email_logs
DROP INDEX IF EXISTS idx_twilio_email_logs_merchant_id;

-- twilio_sms_logs
DROP INDEX IF EXISTS idx_twilio_sms_logs_merchant_id;

-- ugc_creator_applications
DROP INDEX IF EXISTS idx_ugc_creator_applications_user_id;

-- ugc_creator_profiles
DROP INDEX IF EXISTS idx_ugc_creator_profiles_user_id;

-- ugc_orders
DROP INDEX IF EXISTS idx_ugc_orders_creator_id;
DROP INDEX IF EXISTS idx_ugc_orders_merchant_id;

-- ugc_video_deliverables
DROP INDEX IF EXISTS idx_ugc_video_deliverables_order_id;

-- user_subscriptions
DROP INDEX IF EXISTS idx_user_subscriptions_user_id;

-- vapi_assistants
DROP INDEX IF EXISTS idx_vapi_assistants_merchant_id;

-- vapi_call_logs
DROP INDEX IF EXISTS idx_vapi_call_logs_assistant_id;
DROP INDEX IF EXISTS idx_vapi_call_logs_merchant_id;

-- vapi_phone_numbers
DROP INDEX IF EXISTS idx_vapi_phone_numbers_merchant_id;

-- video_products
DROP INDEX IF EXISTS idx_video_products_creator_id;

-- webhook_events
DROP INDEX IF EXISTS idx_webhook_events_entity_id;
DROP INDEX IF EXISTS idx_webhook_events_event_type;

-- website_intake_forms
DROP INDEX IF EXISTS idx_website_intake_forms_merchant_id;

-- website_templates
DROP INDEX IF EXISTS idx_website_templates_category;

-- weekly_winners
DROP INDEX IF EXISTS idx_weekly_winners_partner_id;
DROP INDEX IF EXISTS idx_weekly_winners_week_year;

-- winback_campaigns
DROP INDEX IF EXISTS idx_winback_campaigns_merchant_id;

-- winback_results
DROP INDEX IF EXISTS idx_winback_results_campaign_id;
DROP INDEX IF EXISTS idx_winback_results_customer_id;
