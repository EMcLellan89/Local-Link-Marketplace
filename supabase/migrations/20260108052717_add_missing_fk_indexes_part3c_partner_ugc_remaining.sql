/*
  # Add Missing Foreign Key Indexes - Part 3C: Partner-UGC and Remaining Tables
  
  1. Performance Optimization
    - Adds indexes to unindexed foreign keys in partner through ugc and other remaining tables
    - Improves query performance for joins and foreign key lookups
    
  2. Tables Affected
    - notifications
    - order_items
    - orders
    - partner_agreement_acceptances
    - partner_agreements
    - partner_ai_commissions
    - partner_applications
    - partner_assets
    - partner_bonuses
    - partner_contracts
    - partner_crm_subscriptions
    - partner_customer_links
    - partner_onboarding_progress
    - partner_referrals
    - partner_subscriptions
    - partner_warning_logs
    - partners
    - paybright_audit_log
    - paybright_refunds
    - paybright_subscriptions
    - paybright_transactions
    - payout_batches
    - printing_orders
    - product_categories
    - product_course_map
    - product_variants
    - products
    - profiles
    - prompt_runs
    - prompts
    - qr_codes
    - recruiting_services
    - redemptions
    - referral_conversions
    - referral_links
    - referral_programs
    - referral_rewards
    - referrals
    - reputation_alerts
    - reputation_campaigns
    - reputation_responses
    - reputation_reviews
    - review_helpful_votes
    - review_responses
    - reviews
    - scheduled_deals
    - service_bookings
    - shopping_carts
    - sms_queue
    - social_shares
    - social_ugc_subscriptions
    - stripe_subscription_map
    - support_messages
    - support_tickets
    - survey_responses
    - swipe_file_favorites
    - system_settings
    - territories
    - territory_licenses
    - ticket_messages
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

-- notifications
CREATE INDEX IF NOT EXISTS idx_notifications_customer_id 
  ON notifications(customer_id);

-- order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id 
  ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id 
  ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id 
  ON order_items(variant_id);

-- orders
CREATE INDEX IF NOT EXISTS idx_orders_customer_account_id 
  ON orders(customer_account_id);
CREATE INDEX IF NOT EXISTS idx_orders_partner_id 
  ON orders(partner_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id 
  ON orders(user_id);

-- partner_agreement_acceptances
CREATE INDEX IF NOT EXISTS idx_partner_agreement_acceptances_user_id 
  ON partner_agreement_acceptances(user_id);

-- partner_agreements
CREATE INDEX IF NOT EXISTS idx_partner_agreements_partner_id 
  ON partner_agreements(partner_id);

-- partner_ai_commissions
CREATE INDEX IF NOT EXISTS idx_partner_ai_commissions_merchant_id 
  ON partner_ai_commissions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_partner_ai_commissions_partner_id 
  ON partner_ai_commissions(partner_id);

-- partner_applications
CREATE INDEX IF NOT EXISTS idx_partner_applications_reviewed_by 
  ON partner_applications(reviewed_by);

-- partner_assets
CREATE INDEX IF NOT EXISTS idx_partner_assets_partner_id 
  ON partner_assets(partner_id);

-- partner_bonuses
CREATE INDEX IF NOT EXISTS idx_partner_bonuses_affiliate_id 
  ON partner_bonuses(affiliate_id);

-- partner_contracts
CREATE INDEX IF NOT EXISTS idx_partner_contracts_partner_id 
  ON partner_contracts(partner_id);

-- partner_crm_subscriptions
CREATE INDEX IF NOT EXISTS idx_partner_crm_subscriptions_partner_id 
  ON partner_crm_subscriptions(partner_id);

-- partner_customer_links
CREATE INDEX IF NOT EXISTS idx_partner_customer_links_customer_account_id 
  ON partner_customer_links(customer_account_id);

-- partner_onboarding_progress
CREATE INDEX IF NOT EXISTS idx_partner_onboarding_progress_step_key 
  ON partner_onboarding_progress(step_key);

-- partner_referrals
CREATE INDEX IF NOT EXISTS idx_partner_referrals_merchant_id 
  ON partner_referrals(merchant_id);

-- partner_subscriptions
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_partner_id 
  ON partner_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_tier_id 
  ON partner_subscriptions(tier_id);

-- partner_warning_logs
CREATE INDEX IF NOT EXISTS idx_partner_warning_logs_partner_id 
  ON partner_warning_logs(partner_id);

-- partners
CREATE INDEX IF NOT EXISTS idx_partners_user_id 
  ON partners(user_id);

-- paybright_audit_log
CREATE INDEX IF NOT EXISTS idx_paybright_audit_log_merchant_id 
  ON paybright_audit_log(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_audit_log_user_id 
  ON paybright_audit_log(user_id);

-- paybright_refunds
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_merchant_id 
  ON paybright_refunds(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_requested_by 
  ON paybright_refunds(requested_by);
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_transaction_id 
  ON paybright_refunds(transaction_id);

-- paybright_subscriptions
CREATE INDEX IF NOT EXISTS idx_paybright_subscriptions_customer_id 
  ON paybright_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_paybright_subscriptions_merchant_id 
  ON paybright_subscriptions(merchant_id);

-- paybright_transactions
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_customer_id 
  ON paybright_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_merchant_id 
  ON paybright_transactions(merchant_id);

-- payout_batches
CREATE INDEX IF NOT EXISTS idx_payout_batches_partner_id 
  ON payout_batches(partner_id);

-- printing_orders
CREATE INDEX IF NOT EXISTS idx_printing_orders_product_id 
  ON printing_orders(product_id);

-- product_categories
CREATE INDEX IF NOT EXISTS idx_product_categories_parent_category_id 
  ON product_categories(parent_category_id);

-- product_course_map
CREATE INDEX IF NOT EXISTS idx_product_course_map_course_slug 
  ON product_course_map(course_slug);

-- product_variants
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id 
  ON product_variants(product_id);

-- products
CREATE INDEX IF NOT EXISTS idx_products_category_id 
  ON products(category_id);

-- profiles
CREATE INDEX IF NOT EXISTS idx_profiles_partner_id 
  ON profiles(partner_id);

-- prompt_runs
CREATE INDEX IF NOT EXISTS idx_prompt_runs_prompt_id 
  ON prompt_runs(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_runs_user_id 
  ON prompt_runs(user_id);

-- prompts
CREATE INDEX IF NOT EXISTS idx_prompts_category_id 
  ON prompts(category_id);

-- qr_codes
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_by_partner_id 
  ON qr_codes(created_by_partner_id);

-- recruiting_services
CREATE INDEX IF NOT EXISTS idx_recruiting_services_merchant_id 
  ON recruiting_services(merchant_id);

-- redemptions
CREATE INDEX IF NOT EXISTS idx_redemptions_purchase_id 
  ON redemptions(purchase_id);

-- referral_conversions
CREATE INDEX IF NOT EXISTS idx_referral_conversions_referee_customer_id 
  ON referral_conversions(referee_customer_id);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_referral_link_id 
  ON referral_conversions(referral_link_id);

-- referral_links
CREATE INDEX IF NOT EXISTS idx_referral_links_customer_id 
  ON referral_links(customer_id);
CREATE INDEX IF NOT EXISTS idx_referral_links_program_id 
  ON referral_links(program_id);

-- referral_programs
CREATE INDEX IF NOT EXISTS idx_referral_programs_merchant_id 
  ON referral_programs(merchant_id);

-- referral_rewards
CREATE INDEX IF NOT EXISTS idx_referral_rewards_conversion_id 
  ON referral_rewards(conversion_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_customer_id 
  ON referral_rewards(customer_id);

-- referrals
CREATE INDEX IF NOT EXISTS idx_referrals_referred_customer_id 
  ON referrals(referred_customer_id);

-- reputation_alerts
CREATE INDEX IF NOT EXISTS idx_reputation_alerts_merchant_id 
  ON reputation_alerts(merchant_id);

-- reputation_campaigns
CREATE INDEX IF NOT EXISTS idx_reputation_campaigns_merchant_id 
  ON reputation_campaigns(merchant_id);

-- reputation_responses
CREATE INDEX IF NOT EXISTS idx_reputation_responses_merchant_id 
  ON reputation_responses(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reputation_responses_posted_by 
  ON reputation_responses(posted_by);
CREATE INDEX IF NOT EXISTS idx_reputation_responses_review_id 
  ON reputation_responses(review_id);

-- reputation_reviews
CREATE INDEX IF NOT EXISTS idx_reputation_reviews_merchant_id 
  ON reputation_reviews(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reputation_reviews_platform_id 
  ON reputation_reviews(platform_id);

-- review_helpful_votes
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_customer_id 
  ON review_helpful_votes(customer_id);

-- review_responses
CREATE INDEX IF NOT EXISTS idx_review_responses_review_id 
  ON review_responses(review_id);

-- reviews
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id 
  ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_purchase_id 
  ON reviews(purchase_id);

-- scheduled_deals
CREATE INDEX IF NOT EXISTS idx_scheduled_deals_template_id 
  ON scheduled_deals(template_id);

-- service_bookings
CREATE INDEX IF NOT EXISTS idx_service_bookings_service_id 
  ON service_bookings(service_id);

-- shopping_carts
CREATE INDEX IF NOT EXISTS idx_shopping_carts_customer_id 
  ON shopping_carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_merchant_id 
  ON shopping_carts(merchant_id);

-- sms_queue
CREATE INDEX IF NOT EXISTS idx_sms_queue_user_id 
  ON sms_queue(user_id);

-- social_shares
CREATE INDEX IF NOT EXISTS idx_social_shares_customer_id 
  ON social_shares(customer_id);

-- social_ugc_subscriptions
CREATE INDEX IF NOT EXISTS idx_social_ugc_subscriptions_merchant_id 
  ON social_ugc_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_social_ugc_subscriptions_package_id 
  ON social_ugc_subscriptions(package_id);

-- stripe_subscription_map
CREATE INDEX IF NOT EXISTS idx_stripe_subscription_map_user_id 
  ON stripe_subscription_map(user_id);

-- support_messages
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id 
  ON support_messages(ticket_id);

-- support_tickets
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id 
  ON support_tickets(customer_id);

-- survey_responses
CREATE INDEX IF NOT EXISTS idx_survey_responses_customer_id 
  ON survey_responses(customer_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_purchase_id 
  ON survey_responses(purchase_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id 
  ON survey_responses(survey_id);

-- swipe_file_favorites
CREATE INDEX IF NOT EXISTS idx_swipe_file_favorites_template_id 
  ON swipe_file_favorites(template_id);

-- system_settings
CREATE INDEX IF NOT EXISTS idx_system_settings_updated_by 
  ON system_settings(updated_by);

-- territories
CREATE INDEX IF NOT EXISTS idx_territories_assigned_partner_id 
  ON territories(assigned_partner_id);
CREATE INDEX IF NOT EXISTS idx_territories_parent_territory_id 
  ON territories(parent_territory_id);

-- territory_licenses
CREATE INDEX IF NOT EXISTS idx_territory_licenses_partner_id 
  ON territory_licenses(partner_id);
CREATE INDEX IF NOT EXISTS idx_territory_licenses_pricing_tier_id 
  ON territory_licenses(pricing_tier_id);
CREATE INDEX IF NOT EXISTS idx_territory_licenses_territory_id 
  ON territory_licenses(territory_id);

-- ticket_messages
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id 
  ON ticket_messages(ticket_id);

-- transactions
CREATE INDEX IF NOT EXISTS idx_transactions_deal_id 
  ON transactions(deal_id);
CREATE INDEX IF NOT EXISTS idx_transactions_merchant_id 
  ON transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_partner_id 
  ON transactions(partner_id);
CREATE INDEX IF NOT EXISTS idx_transactions_territory_id 
  ON transactions(territory_id);

-- twilio_call_logs
CREATE INDEX IF NOT EXISTS idx_twilio_call_logs_lead_id 
  ON twilio_call_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_call_logs_merchant_id 
  ON twilio_call_logs(merchant_id);

-- twilio_call_queues
CREATE INDEX IF NOT EXISTS idx_twilio_call_queues_merchant_id 
  ON twilio_call_queues(merchant_id);

-- twilio_email_logs
CREATE INDEX IF NOT EXISTS idx_twilio_email_logs_lead_id 
  ON twilio_email_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_email_logs_merchant_id 
  ON twilio_email_logs(merchant_id);

-- twilio_phone_numbers
CREATE INDEX IF NOT EXISTS idx_twilio_phone_numbers_merchant_id 
  ON twilio_phone_numbers(merchant_id);

-- twilio_sms_logs
CREATE INDEX IF NOT EXISTS idx_twilio_sms_logs_lead_id 
  ON twilio_sms_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_sms_logs_merchant_id 
  ON twilio_sms_logs(merchant_id);

-- twilio_voicemails
CREATE INDEX IF NOT EXISTS idx_twilio_voicemails_lead_id 
  ON twilio_voicemails(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_voicemails_merchant_id 
  ON twilio_voicemails(merchant_id);

-- ugc_assets
CREATE INDEX IF NOT EXISTS idx_ugc_assets_order_id 
  ON ugc_assets(order_id);

-- ugc_orders
CREATE INDEX IF NOT EXISTS idx_ugc_orders_creator_id 
  ON ugc_orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_package_id 
  ON ugc_orders(package_id);

-- ugc_payouts
CREATE INDEX IF NOT EXISTS idx_ugc_payouts_creator_id 
  ON ugc_payouts(creator_id);
CREATE INDEX IF NOT EXISTS idx_ugc_payouts_order_id 
  ON ugc_payouts(order_id);

-- unified_customers
CREATE INDEX IF NOT EXISTS idx_unified_customers_primary_business_unit_id 
  ON unified_customers(primary_business_unit_id);

-- unified_sales
CREATE INDEX IF NOT EXISTS idx_unified_sales_business_unit_id 
  ON unified_sales(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_unified_sales_customer_id 
  ON unified_sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_unified_sales_invoice_id 
  ON unified_sales(invoice_id);

-- upsell_purchases
CREATE INDEX IF NOT EXISTS idx_upsell_purchases_upsell_offer_id 
  ON upsell_purchases(upsell_offer_id);
CREATE INDEX IF NOT EXISTS idx_upsell_purchases_user_id 
  ON upsell_purchases(user_id);

-- user_subscriptions
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id 
  ON user_subscriptions(user_id);

-- video_deliverables
CREATE INDEX IF NOT EXISTS idx_video_deliverables_order_id 
  ON video_deliverables(order_id);

-- video_revisions
CREATE INDEX IF NOT EXISTS idx_video_revisions_order_id 
  ON video_revisions(order_id);
CREATE INDEX IF NOT EXISTS idx_video_revisions_requested_by 
  ON video_revisions(requested_by);

-- video_scripts
CREATE INDEX IF NOT EXISTS idx_video_scripts_approved_by 
  ON video_scripts(approved_by);
CREATE INDEX IF NOT EXISTS idx_video_scripts_order_id 
  ON video_scripts(order_id);

-- video_service_orders
CREATE INDEX IF NOT EXISTS idx_video_service_orders_merchant_id 
  ON video_service_orders(merchant_id);

-- website_orders
CREATE INDEX IF NOT EXISTS idx_website_orders_merchant_id 
  ON website_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_website_orders_template_id 
  ON website_orders(template_id);

-- winback_campaigns
CREATE INDEX IF NOT EXISTS idx_winback_campaigns_merchant_id 
  ON winback_campaigns(merchant_id);

-- winback_conversions
CREATE INDEX IF NOT EXISTS idx_winback_conversions_customer_id 
  ON winback_conversions(customer_id);
CREATE INDEX IF NOT EXISTS idx_winback_conversions_outreach_id 
  ON winback_conversions(outreach_id);

-- winback_outreach
CREATE INDEX IF NOT EXISTS idx_winback_outreach_campaign_id 
  ON winback_outreach(campaign_id);
CREATE INDEX IF NOT EXISTS idx_winback_outreach_customer_id 
  ON winback_outreach(customer_id);
CREATE INDEX IF NOT EXISTS idx_winback_outreach_trigger_id 
  ON winback_outreach(trigger_id);

-- winback_triggers
CREATE INDEX IF NOT EXISTS idx_winback_triggers_campaign_id 
  ON winback_triggers(campaign_id);
CREATE INDEX IF NOT EXISTS idx_winback_triggers_customer_id 
  ON winback_triggers(customer_id);
