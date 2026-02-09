/*
  # Drop Unused Indexes - Batch 5 (Paybright to Final)
  
  1. Changes
    - Drop all remaining unused indexes
    - Includes paybright, payout, printing, product, profile, prompt, qr, recruiting
    - redemption, referral, reputation, review, scheduled, service, shopping, sms
    - social, stripe, support, survey, swipe, system, territory, ticket, transaction
    - twilio, ugc, unified, upsell, user, video, website, winback tables
*/

-- Paybright
DROP INDEX IF EXISTS idx_paybright_audit_log_merchant_id;
DROP INDEX IF EXISTS idx_paybright_audit_log_user_id;
DROP INDEX IF EXISTS idx_paybright_refunds_merchant_id;
DROP INDEX IF EXISTS idx_paybright_refunds_requested_by;
DROP INDEX IF EXISTS idx_paybright_refunds_transaction_id;
DROP INDEX IF EXISTS idx_paybright_subscriptions_customer_id;
DROP INDEX IF EXISTS idx_paybright_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_paybright_transactions_customer_id;
DROP INDEX IF EXISTS idx_paybright_transactions_merchant_id;

-- Payout, Printing, Product
DROP INDEX IF EXISTS idx_payout_batches_partner_id;
DROP INDEX IF EXISTS idx_printing_orders_product_id;
DROP INDEX IF EXISTS idx_product_categories_parent_category_id;
DROP INDEX IF EXISTS idx_product_course_map_course_slug;
DROP INDEX IF EXISTS idx_product_variants_product_id;
DROP INDEX IF EXISTS idx_products_category_id;

-- Profile, Prompt, QR, Recruiting
DROP INDEX IF EXISTS idx_profiles_partner_id;
DROP INDEX IF EXISTS idx_prompt_runs_prompt_id;
DROP INDEX IF EXISTS idx_prompt_runs_user_id;
DROP INDEX IF EXISTS idx_prompts_category_id;
DROP INDEX IF EXISTS idx_qr_codes_created_by_partner_id;
DROP INDEX IF EXISTS idx_recruiting_services_merchant_id;

-- Redemption, Referral, Reputation
DROP INDEX IF EXISTS idx_redemptions_purchase_id;
DROP INDEX IF EXISTS idx_referral_conversions_referee_customer_id;
DROP INDEX IF EXISTS idx_referral_conversions_referral_link_id;
DROP INDEX IF EXISTS idx_referral_links_customer_id;
DROP INDEX IF EXISTS idx_referral_links_program_id;
DROP INDEX IF EXISTS idx_referral_programs_merchant_id;
DROP INDEX IF EXISTS idx_referral_rewards_conversion_id;
DROP INDEX IF EXISTS idx_referral_rewards_customer_id;
DROP INDEX IF EXISTS idx_referrals_referred_customer_id;
DROP INDEX IF EXISTS idx_reputation_alerts_merchant_id;
DROP INDEX IF EXISTS idx_reputation_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_reputation_responses_merchant_id;
DROP INDEX IF EXISTS idx_reputation_responses_posted_by;
DROP INDEX IF EXISTS idx_reputation_responses_review_id;
DROP INDEX IF EXISTS idx_reputation_reviews_merchant_id;
DROP INDEX IF EXISTS idx_reputation_reviews_platform_id;

-- Review, Scheduled, Service, Shopping
DROP INDEX IF EXISTS idx_review_helpful_votes_customer_id;
DROP INDEX IF EXISTS idx_review_responses_review_id;
DROP INDEX IF EXISTS idx_reviews_customer_id;
DROP INDEX IF EXISTS idx_reviews_purchase_id;
DROP INDEX IF EXISTS idx_scheduled_deals_template_id;
DROP INDEX IF EXISTS idx_service_bookings_service_id;
DROP INDEX IF EXISTS idx_shopping_carts_customer_id;
DROP INDEX IF EXISTS idx_shopping_carts_merchant_id;

-- SMS, Social, Stripe, Support
DROP INDEX IF EXISTS idx_sms_queue_user_id;
DROP INDEX IF EXISTS idx_social_shares_customer_id;
DROP INDEX IF EXISTS idx_social_ugc_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_social_ugc_subscriptions_package_id;
DROP INDEX IF EXISTS idx_stripe_subscription_map_user_id;
DROP INDEX IF EXISTS idx_support_messages_ticket_id;
DROP INDEX IF EXISTS idx_support_tickets_customer_id;

-- Survey, Swipe, System, Territory
DROP INDEX IF EXISTS idx_survey_responses_customer_id;
DROP INDEX IF EXISTS idx_survey_responses_purchase_id;
DROP INDEX IF EXISTS idx_survey_responses_survey_id;
DROP INDEX IF EXISTS idx_swipe_file_favorites_template_id;
DROP INDEX IF EXISTS idx_system_settings_updated_by;
DROP INDEX IF EXISTS idx_territories_assigned_partner_id;
DROP INDEX IF EXISTS idx_territories_parent_territory_id;
DROP INDEX IF EXISTS idx_territory_licenses_partner_id;
DROP INDEX IF EXISTS idx_territory_licenses_pricing_tier_id;
DROP INDEX IF EXISTS idx_territory_licenses_territory_id;

-- Ticket, Transaction, Twilio
DROP INDEX IF EXISTS idx_ticket_messages_ticket_id;
DROP INDEX IF EXISTS idx_transactions_deal_id;
DROP INDEX IF EXISTS idx_transactions_merchant_id;
DROP INDEX IF EXISTS idx_transactions_partner_id;
DROP INDEX IF EXISTS idx_transactions_territory_id;
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

-- UGC, Unified, Upsell, User
DROP INDEX IF EXISTS idx_ugc_assets_order_id;
DROP INDEX IF EXISTS idx_ugc_orders_creator_id;
DROP INDEX IF EXISTS idx_ugc_orders_package_id;
DROP INDEX IF EXISTS idx_ugc_payouts_creator_id;
DROP INDEX IF EXISTS idx_ugc_payouts_order_id;
DROP INDEX IF EXISTS idx_unified_customers_primary_business_unit_id;
DROP INDEX IF EXISTS idx_unified_sales_business_unit_id;
DROP INDEX IF EXISTS idx_unified_sales_customer_id;
DROP INDEX IF EXISTS idx_unified_sales_invoice_id;
DROP INDEX IF EXISTS idx_upsell_purchases_upsell_offer_id;
DROP INDEX IF EXISTS idx_upsell_purchases_user_id;
DROP INDEX IF EXISTS idx_user_subscriptions_user_id;

-- Video, Website, Winback
DROP INDEX IF EXISTS idx_video_deliverables_order_id;
DROP INDEX IF EXISTS idx_video_revisions_order_id;
DROP INDEX IF EXISTS idx_video_revisions_requested_by;
DROP INDEX IF EXISTS idx_video_scripts_approved_by;
DROP INDEX IF EXISTS idx_video_scripts_order_id;
DROP INDEX IF EXISTS idx_video_service_orders_merchant_id;
DROP INDEX IF EXISTS idx_website_orders_merchant_id;
DROP INDEX IF EXISTS idx_website_orders_template_id;
DROP INDEX IF EXISTS idx_winback_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_winback_conversions_customer_id;
DROP INDEX IF EXISTS idx_winback_conversions_outreach_id;
DROP INDEX IF EXISTS idx_winback_outreach_campaign_id;
DROP INDEX IF EXISTS idx_winback_outreach_customer_id;
DROP INDEX IF EXISTS idx_winback_outreach_trigger_id;
DROP INDEX IF EXISTS idx_winback_triggers_campaign_id;
DROP INDEX IF EXISTS idx_winback_triggers_customer_id;
