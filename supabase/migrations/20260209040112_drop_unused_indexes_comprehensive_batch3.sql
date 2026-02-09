/*
  # Drop Unused Indexes - Comprehensive Batch 3 (Final)

  1. Purpose
    - Final cleanup of unused indexes
    - Focus on tracking, CRM, and communications tables

  2. Categories Removed
    - Unused tracking event indexes
    - Redundant CRM indexes
    - Unused communications indexes
    - Rarely queried timestamp ranges

  3. Performance Impact
    - Maximize write performance
    - Complete index optimization
*/

DO $$
BEGIN
  -- Unused tracking/analytics indexes
  DROP INDEX IF EXISTS idx_creative_events_event_type;
  DROP INDEX IF EXISTS idx_affiliate_clicks_clicked_at;
  DROP INDEX IF EXISTS idx_marketplace_clicks_clicked_at;
  DROP INDEX IF EXISTS idx_campaign_events_event_type;
  
  -- Unused CRM priority/stage indexes (low cardinality)
  DROP INDEX IF EXISTS idx_crm_leads_priority;
  DROP INDEX IF EXISTS idx_crm_tasks_priority;
  DROP INDEX IF EXISTS idx_crm_deals_stage;
  DROP INDEX IF EXISTS idx_crm_deals_probability;
  
  -- Redundant CRM indexes
  DROP INDEX IF EXISTS idx_crm_activities_activity_type;
  DROP INDEX IF EXISTS idx_crm_activities_activity_date;
  DROP INDEX IF EXISTS idx_crm_tasks_status;
  DROP INDEX IF EXISTS idx_crm_tasks_due_date;
  
  -- Unused communications indexes
  DROP INDEX IF EXISTS idx_email_sends_sent_at;
  DROP INDEX IF EXISTS idx_email_sends_status;
  DROP INDEX IF EXISTS idx_sms_messages_sent_at;
  DROP INDEX IF EXISTS idx_sms_messages_status;
  DROP INDEX IF EXISTS idx_twilio_calls_created_at;
  
  -- Unused notification indexes
  DROP INDEX IF EXISTS idx_notifications_read;
  DROP INDEX IF EXISTS idx_notifications_created_at;
  DROP INDEX IF EXISTS idx_partner_notifications_read;
  DROP INDEX IF EXISTS idx_merchant_notifications_read;
  
  -- Unused review/rating indexes
  DROP INDEX IF EXISTS idx_reviews_rating;
  DROP INDEX IF EXISTS idx_reviews_created_at;
  DROP INDEX IF EXISTS idx_review_responses_created_at;
  
  -- Unused loyalty/reward indexes
  DROP INDEX IF EXISTS idx_loyalty_cards_points;
  DROP INDEX IF EXISTS idx_referral_rewards_points;
  DROP INDEX IF EXISTS idx_customer_rewards_redeemed;
  
  -- Unused billing/payment indexes
  DROP INDEX IF EXISTS idx_invoices_due_date;
  DROP INDEX IF EXISTS idx_invoices_paid_date;
  DROP INDEX IF EXISTS idx_payments_payment_date;
  DROP INDEX IF EXISTS idx_subscriptions_billing_cycle;
  
  -- Unused application/onboarding indexes
  DROP INDEX IF EXISTS idx_partner_applications_submitted_at;
  DROP INDEX IF EXISTS idx_merchant_applications_submitted_at;
  DROP INDEX IF EXISTS idx_dfy_onboarding_submitted_at;
  
  -- Unused tag/label indexes
  DROP INDEX IF EXISTS idx_crm_leads_tags;
  DROP INDEX IF EXISTS idx_products_tags;
  DROP INDEX IF EXISTS idx_deals_tags;
  
  -- Unused location/geography indexes (not using spatial queries)
  DROP INDEX IF EXISTS idx_merchants_latitude;
  DROP INDEX IF EXISTS idx_merchants_longitude;
  DROP INDEX IF EXISTS idx_merchant_locations_latitude;
  DROP INDEX IF EXISTS idx_merchant_locations_longitude;
  
  -- Unused version/audit indexes
  DROP INDEX IF EXISTS idx_audit_log_created_at;
  DROP INDEX IF EXISTS idx_audit_log_action;
  DROP INDEX IF EXISTS idx_version_history_created_at;
  
EXCEPTION
  WHEN undefined_object THEN
    NULL; -- Index doesn't exist, skip
END $$;
