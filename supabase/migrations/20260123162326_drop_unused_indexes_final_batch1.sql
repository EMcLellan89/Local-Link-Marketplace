/*
  # Drop Unused Indexes - Final Batch 1 (Transactions, Twilio, UGC)

  This migration removes unused indexes that degrade write performance.

  Tables covered:
  - transactions
  - twilio_call_logs
  - twilio_call_queues
  - twilio_email_logs
  - twilio_phone_numbers
  - twilio_sms_logs
  - twilio_voicemails
  - ugc_assets
  - ugc_orders
  - ugc_payouts
  - unified_customers
  - unified_sales
  - upsell_purchases
  - user_subscriptions
  - vapi_call_logs
  - video_deliverables
  - video_revisions
  - video_scripts
  - video_service_orders
  - website_orders
  - winback_campaigns
  - winback_conversions
  - winback_outreach
  - winback_triggers
*/

-- Transactions
DROP INDEX IF EXISTS idx_transactions_deal_id;
DROP INDEX IF EXISTS idx_transactions_merchant_id;
DROP INDEX IF EXISTS idx_transactions_partner_id;
DROP INDEX IF EXISTS idx_transactions_territory_id;

-- Twilio Tables
DROP INDEX IF EXISTS idx_twilio_call_logs_lead_id;
DROP INDEX IF EXISTS idx_twilio_call_logs_merchant_id;
DROP INDEX IF EXISTS idx_twilio_call_queues_merchant_id;
DROP INDEX IF EXISTS idx_twilio_email_logs_lead_id;
DROP INDEX IF EXISTS idx_twilio_email_logs_merchant_id;
DROP INDEX IF EXISTS idx_twilio_phone_numbers_merchant_id;
DROP INDEX IF EXISTS idx_twilio_sms_logs_lead_id;
DROP INDEX IF EXISTS idx_twilio_sms_logs_merchant_id;
DROP INDEX IF EXISTS idx_twilio_voicemails_lead_id;
DROP INDEX IF EXISTS idx_twilio_voicemails_merchant_id;

-- UGC Tables
DROP INDEX IF EXISTS idx_ugc_assets_order_id;
DROP INDEX IF EXISTS idx_ugc_orders_creator_id;
DROP INDEX IF EXISTS idx_ugc_orders_package_id;
DROP INDEX IF EXISTS idx_ugc_payouts_creator_id;
DROP INDEX IF EXISTS idx_ugc_payouts_order_id;

-- Unified Tables
DROP INDEX IF EXISTS idx_unified_customers_primary_business_unit_id;
DROP INDEX IF EXISTS idx_unified_sales_business_unit_id;
DROP INDEX IF EXISTS idx_unified_sales_customer_id;
DROP INDEX IF EXISTS idx_unified_sales_invoice_id;

-- Upsell Tables
DROP INDEX IF EXISTS idx_upsell_purchases_upsell_offer_id;
DROP INDEX IF EXISTS idx_upsell_purchases_user_id;

-- User Subscriptions
DROP INDEX IF EXISTS idx_user_subscriptions_user_id;

-- VAPI
DROP INDEX IF EXISTS idx_vapi_call_logs_assistant_id;

-- Video Tables
DROP INDEX IF EXISTS idx_video_deliverables_order_id;
DROP INDEX IF EXISTS idx_video_revisions_order_id;
DROP INDEX IF EXISTS idx_video_revisions_requested_by;
DROP INDEX IF EXISTS idx_video_scripts_approved_by;
DROP INDEX IF EXISTS idx_video_scripts_order_id;
DROP INDEX IF EXISTS idx_video_service_orders_merchant_id;

-- Website Orders
DROP INDEX IF EXISTS idx_website_orders_merchant_id;
DROP INDEX IF EXISTS idx_website_orders_template_id;

-- Winback Tables
DROP INDEX IF EXISTS idx_winback_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_winback_conversions_customer_id;
DROP INDEX IF EXISTS idx_winback_conversions_outreach_id;
DROP INDEX IF EXISTS idx_winback_outreach_campaign_id;
DROP INDEX IF EXISTS idx_winback_outreach_customer_id;
DROP INDEX IF EXISTS idx_winback_outreach_trigger_id;
DROP INDEX IF EXISTS idx_winback_triggers_campaign_id;
DROP INDEX IF EXISTS idx_winback_triggers_customer_id;