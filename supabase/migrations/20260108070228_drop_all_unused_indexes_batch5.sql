/*
  # Drop All Unused Indexes - Batch 5 (Reputation through End)
  
  1. Performance Improvement
    - Final batch of unused index removal
    
  2. Indexes Dropped
    - Reputation, review indexes
    - Service, shopping cart indexes
    - SMS, social indexes
    - Support, survey indexes
    - Territory, transaction indexes
    - Twilio, UGC indexes
    - Video, website, winback indexes
*/

-- Reputation indexes
DROP INDEX IF EXISTS idx_reputation_alerts_merchant_id;
DROP INDEX IF EXISTS idx_reputation_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_reputation_responses_merchant_id;
DROP INDEX IF EXISTS idx_reputation_responses_posted_by;
DROP INDEX IF EXISTS idx_reputation_responses_review_id;
DROP INDEX IF EXISTS idx_reputation_reviews_merchant_id;
DROP INDEX IF EXISTS idx_reputation_reviews_platform_id;

-- Review indexes
DROP INDEX IF EXISTS idx_review_helpful_votes_customer_id;
DROP INDEX IF EXISTS idx_review_responses_review_id;
DROP INDEX IF EXISTS idx_reviews_customer_id;
DROP INDEX IF EXISTS idx_reviews_purchase_id;

-- Scheduled deal indexes
DROP INDEX IF EXISTS idx_scheduled_deals_template_id;

-- Service indexes
DROP INDEX IF EXISTS idx_service_bookings_service_id;

-- Shopping cart indexes
DROP INDEX IF EXISTS idx_shopping_carts_customer_id;
DROP INDEX IF EXISTS idx_shopping_carts_merchant_id;

-- SMS indexes
DROP INDEX IF EXISTS idx_sms_queue_user_id;

-- Social indexes
DROP INDEX IF EXISTS idx_social_shares_customer_id;
DROP INDEX IF EXISTS idx_social_ugc_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_social_ugc_subscriptions_package_id;

-- Stripe indexes
DROP INDEX IF EXISTS idx_stripe_subscription_map_user_id;

-- Support indexes
DROP INDEX IF EXISTS idx_support_messages_ticket_id;
DROP INDEX IF EXISTS idx_support_tickets_customer_id;

-- Survey indexes
DROP INDEX IF EXISTS idx_survey_responses_customer_id;
DROP INDEX IF EXISTS idx_survey_responses_purchase_id;
DROP INDEX IF EXISTS idx_survey_responses_survey_id;

-- Swipe file indexes
DROP INDEX IF EXISTS idx_swipe_file_favorites_template_id;

-- System indexes
DROP INDEX IF EXISTS idx_system_settings_updated_by;

-- Territory indexes
DROP INDEX IF EXISTS idx_territories_assigned_partner_id;
DROP INDEX IF EXISTS idx_territories_parent_territory_id;
DROP INDEX IF EXISTS idx_territory_licenses_partner_id;
DROP INDEX IF EXISTS idx_territory_licenses_pricing_tier_id;
DROP INDEX IF EXISTS idx_territory_licenses_territory_id;

-- Ticket indexes
DROP INDEX IF EXISTS idx_ticket_messages_ticket_id;

-- Transaction indexes
DROP INDEX IF EXISTS idx_transactions_deal_id;
DROP INDEX IF EXISTS idx_transactions_merchant_id;
DROP INDEX IF EXISTS idx_transactions_partner_id;
DROP INDEX IF EXISTS idx_transactions_territory_id;

-- Twilio indexes
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

-- UGC indexes
DROP INDEX IF EXISTS idx_ugc_assets_order_id;
DROP INDEX IF EXISTS idx_ugc_orders_creator_id;
DROP INDEX IF EXISTS idx_ugc_orders_package_id;
DROP INDEX IF EXISTS idx_ugc_payouts_creator_id;
DROP INDEX IF EXISTS idx_ugc_payouts_order_id;

-- Unified indexes
DROP INDEX IF EXISTS idx_unified_customers_primary_business_unit_id;
DROP INDEX IF EXISTS idx_unified_sales_business_unit_id;
DROP INDEX IF EXISTS idx_unified_sales_customer_id;
DROP INDEX IF EXISTS idx_unified_sales_invoice_id;

-- Upsell indexes
DROP INDEX IF EXISTS idx_upsell_purchases_upsell_offer_id;
DROP INDEX IF EXISTS idx_upsell_purchases_user_id;

-- User subscription indexes
DROP INDEX IF EXISTS idx_user_subscriptions_user_id;

-- Video indexes
DROP INDEX IF EXISTS idx_video_deliverables_order_id;
DROP INDEX IF EXISTS idx_video_revisions_order_id;
DROP INDEX IF EXISTS idx_video_revisions_requested_by;
DROP INDEX IF EXISTS idx_video_scripts_approved_by;
DROP INDEX IF EXISTS idx_video_scripts_order_id;
DROP INDEX IF EXISTS idx_video_service_orders_merchant_id;

-- Website indexes
DROP INDEX IF EXISTS idx_website_orders_merchant_id;
DROP INDEX IF EXISTS idx_website_orders_template_id;

-- Winback indexes
DROP INDEX IF EXISTS idx_winback_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_winback_conversions_customer_id;
DROP INDEX IF EXISTS idx_winback_conversions_outreach_id;
DROP INDEX IF EXISTS idx_winback_outreach_campaign_id;
DROP INDEX IF EXISTS idx_winback_outreach_customer_id;
DROP INDEX IF EXISTS idx_winback_outreach_trigger_id;
DROP INDEX IF EXISTS idx_winback_triggers_campaign_id;
DROP INDEX IF EXISTS idx_winback_triggers_customer_id;
