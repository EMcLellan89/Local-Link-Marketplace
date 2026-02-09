/*
  # Drop Unused Indexes - Batch 8
*/

DROP INDEX IF EXISTS idx_winback_outreach_trigger_id;
DROP INDEX IF EXISTS idx_winback_conversions_customer_id;
DROP INDEX IF EXISTS idx_winback_conversions_outreach_id;
DROP INDEX IF EXISTS idx_orders_customer_account_id;
DROP INDEX IF EXISTS idx_orders_partner_id;
DROP INDEX IF EXISTS idx_twilio_phone_numbers_merchant_id;
DROP INDEX IF EXISTS idx_twilio_call_logs_lead_id;
DROP INDEX IF EXISTS idx_twilio_sms_logs_lead_id;
DROP INDEX IF EXISTS idx_twilio_email_logs_lead_id;
DROP INDEX IF EXISTS idx_twilio_voicemails_merchant_id;
DROP INDEX IF EXISTS idx_twilio_voicemails_lead_id;
DROP INDEX IF EXISTS idx_twilio_call_queues_merchant_id;
DROP INDEX IF EXISTS idx_course_exam_attempts_user_id;
DROP INDEX IF EXISTS idx_user_entitlements_course_id;
DROP INDEX IF EXISTS idx_affiliate_partners_user_id;
DROP INDEX IF EXISTS idx_affiliate_referrals_partner_id;
DROP INDEX IF EXISTS idx_affiliate_referrals_referred_user_id;
DROP INDEX IF EXISTS idx_product_course_map_course_slug;
DROP INDEX IF EXISTS idx_user_subscriptions_user_id;
DROP INDEX IF EXISTS idx_stripe_subscription_map_user_id;
