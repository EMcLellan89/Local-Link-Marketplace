/*
  # Add Missing Foreign Key Indexes - Batch 9: Remaining Tables

  1. Performance Improvements
    - Adds indexes for all unindexed foreign keys in remaining tables
    - Improves JOIN performance across the platform
    - Optimizes referential integrity checks

  2. Tables Covered
    - Paybright tables (audit, config, rate_limits, refunds, subscriptions, transactions)
    - Budget Buster tables (all)
    - Business tables (api_keys, capital, coaching, webhooks)
    - Deals and related tables
    - DFY tables
    - Profiles, territories, and other core tables
    - Review, reputation, support tables
    - UGC, Vapi, Twilio tables
    - All other miscellaneous tables
*/

-- Paybright tables
CREATE INDEX IF NOT EXISTS idx_paybright_audit_log_merchant_id ON paybright_audit_log(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_audit_log_user_id ON paybright_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_paybright_config_merchant_id ON paybright_config(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_rate_limits_merchant_id ON paybright_rate_limits(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_merchant_id ON paybright_refunds(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_requested_by ON paybright_refunds(requested_by);
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_transaction_id ON paybright_refunds(transaction_id);
CREATE INDEX IF NOT EXISTS idx_paybright_subscriptions_customer_id ON paybright_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_paybright_subscriptions_merchant_id ON paybright_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_customer_id ON paybright_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_merchant_id ON paybright_transactions(merchant_id);

-- Budget Buster tables
CREATE INDEX IF NOT EXISTS idx_budget_buster_accounts_user_id ON budget_buster_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_ai_insights_user_id ON budget_buster_ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_bills_user_id ON budget_buster_bills(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_debt_settings_user_id ON budget_buster_debt_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_debts_user_id ON budget_buster_debts(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_mode_switches_subscription_id ON budget_buster_mode_switches(subscription_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_mode_switches_user_id ON budget_buster_mode_switches(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_momentum_user_id ON budget_buster_momentum(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_savings_goals_user_id ON budget_buster_savings_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_order_id ON budget_buster_subscriptions(order_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_partner_id ON budget_buster_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_subscriptions_user_id ON budget_buster_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_transactions_account_id ON budget_buster_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_transactions_user_id ON budget_buster_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_usage_metrics_subscription_id ON budget_buster_usage_metrics(subscription_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_usage_metrics_user_id ON budget_buster_usage_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_users_profile_id ON budget_buster_users(profile_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_users_referred_by_partner_id ON budget_buster_users(referred_by_partner_id);
CREATE INDEX IF NOT EXISTS idx_budget_buster_users_subscription_id ON budget_buster_users(subscription_id);

-- Business tables
CREATE INDEX IF NOT EXISTS idx_business_api_keys_business_unit_id ON business_api_keys(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_business_api_keys_created_by ON business_api_keys(created_by);
CREATE INDEX IF NOT EXISTS idx_business_capital_applications_merchant_id ON business_capital_applications(merchant_id);
CREATE INDEX IF NOT EXISTS idx_business_coaching_bookings_package_id ON business_coaching_bookings(package_id);
CREATE INDEX IF NOT EXISTS idx_business_coaching_sessions_booking_id ON business_coaching_sessions(booking_id);
CREATE INDEX IF NOT EXISTS idx_external_business_webhooks_business_unit_id ON external_business_webhooks(business_unit_id);

-- DFY tables
CREATE INDEX IF NOT EXISTS idx_dfy_addons_product_id ON dfy_addons(product_id);
CREATE INDEX IF NOT EXISTS idx_dfy_commission_ledger_order_id ON dfy_commission_ledger(order_id);
CREATE INDEX IF NOT EXISTS idx_dfy_fulfillment_tasks_order_id ON dfy_fulfillment_tasks(order_id);
CREATE INDEX IF NOT EXISTS idx_dfy_onboarding_order_id ON dfy_onboarding(order_id);
CREATE INDEX IF NOT EXISTS idx_dfy_orders_product_id ON dfy_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_dfy_orders_user_id ON dfy_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_dfy_product_stripe_product_id ON dfy_product_stripe(product_id);

-- Deals and related
CREATE INDEX IF NOT EXISTS idx_deals_merchant_id ON deals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_deals_partner_id ON deals(partner_id);
CREATE INDEX IF NOT EXISTS idx_deals_qr_code_id ON deals(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_deals_territory_id ON deals(territory_id);
CREATE INDEX IF NOT EXISTS idx_deal_clicks_deal_id ON deal_clicks(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_clicks_user_id ON deal_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_deal_impressions_deal_id ON deal_impressions(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_impressions_user_id ON deal_impressions(user_id);
CREATE INDEX IF NOT EXISTS idx_deal_locations_deal_id ON deal_locations(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_locations_location_id ON deal_locations(location_id);
CREATE INDEX IF NOT EXISTS idx_deal_templates_merchant_id ON deal_templates(merchant_id);

-- Core tables
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_partner_id ON profiles(partner_id);
CREATE INDEX IF NOT EXISTS idx_territories_assigned_partner_id ON territories(assigned_partner_id);
CREATE INDEX IF NOT EXISTS idx_territories_parent_territory_id ON territories(parent_territory_id);
CREATE INDEX IF NOT EXISTS idx_territory_licenses_partner_id ON territory_licenses(partner_id);
CREATE INDEX IF NOT EXISTS idx_territory_licenses_pricing_tier_id ON territory_licenses(pricing_tier_id);
CREATE INDEX IF NOT EXISTS idx_territory_licenses_territory_id ON territory_licenses(territory_id);

-- Twilio tables
CREATE INDEX IF NOT EXISTS idx_twilio_call_logs_lead_id ON twilio_call_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_call_logs_merchant_id ON twilio_call_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_call_queues_merchant_id ON twilio_call_queues(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_configurations_merchant_id ON twilio_configurations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_email_logs_lead_id ON twilio_email_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_email_logs_merchant_id ON twilio_email_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_phone_numbers_merchant_id ON twilio_phone_numbers(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_sms_logs_lead_id ON twilio_sms_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_sms_logs_merchant_id ON twilio_sms_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_voicemails_lead_id ON twilio_voicemails(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_voicemails_merchant_id ON twilio_voicemails(merchant_id);

-- UGC tables
CREATE INDEX IF NOT EXISTS idx_ugc_assets_order_id ON ugc_assets(order_id);
CREATE INDEX IF NOT EXISTS idx_ugc_creators_user_id ON ugc_creators(user_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_creator_id ON ugc_orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_merchant_id ON ugc_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_package_id ON ugc_orders(package_id);
CREATE INDEX IF NOT EXISTS idx_ugc_payouts_creator_id ON ugc_payouts(creator_id);
CREATE INDEX IF NOT EXISTS idx_ugc_payouts_order_id ON ugc_payouts(order_id);

-- Vapi tables
CREATE INDEX IF NOT EXISTS idx_vapi_assistants_merchant_id ON vapi_assistants(merchant_id);
CREATE INDEX IF NOT EXISTS idx_vapi_call_logs_assistant_id ON vapi_call_logs(assistant_id);
CREATE INDEX IF NOT EXISTS idx_vapi_call_logs_customer_id ON vapi_call_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_vapi_call_logs_merchant_id ON vapi_call_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_vapi_configurations_merchant_id ON vapi_configurations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_vapi_tools_assistant_id ON vapi_tools(assistant_id);

-- Reputation and Review tables
CREATE INDEX IF NOT EXISTS idx_reputation_alerts_merchant_id ON reputation_alerts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reputation_campaigns_merchant_id ON reputation_campaigns(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reputation_platforms_merchant_id ON reputation_platforms(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reputation_responses_merchant_id ON reputation_responses(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reputation_responses_posted_by ON reputation_responses(posted_by);
CREATE INDEX IF NOT EXISTS idx_reputation_responses_review_id ON reputation_responses(review_id);
CREATE INDEX IF NOT EXISTS idx_reputation_reviews_merchant_id ON reputation_reviews(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reputation_reviews_platform_id ON reputation_reviews(platform_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_deal_id ON reviews(deal_id);
CREATE INDEX IF NOT EXISTS idx_reviews_merchant_id ON reviews(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_purchase_id ON reviews(purchase_id);

-- Support tables
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id ON support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_merchant_id ON support_tickets(merchant_id);

-- Miscellaneous tables
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_badge_awards_user_id ON badge_awards(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course_id ON certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_issued_user_id ON certificates_issued(user_id);
CREATE INDEX IF NOT EXISTS idx_certifications_partner_id ON certifications(partner_id);
CREATE INDEX IF NOT EXISTS idx_commissions_order_id ON commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_commissions_partner_id ON commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_communications_subscriptions_product_id ON communications_subscriptions(product_id);
CREATE INDEX IF NOT EXISTS idx_communications_transactions_call_log_id ON communications_transactions(call_log_id);
CREATE INDEX IF NOT EXISTS idx_communications_transactions_merchant_id ON communications_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_communications_transactions_sms_log_id ON communications_transactions(sms_log_id);
CREATE INDEX IF NOT EXISTS idx_communications_usage_subscription_id ON communications_usage(subscription_id);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_user_id ON credit_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_expansion_requests_partner_id ON expansion_requests(partner_id);
CREATE INDEX IF NOT EXISTS idx_favorites_customer_id ON favorites(customer_id);
CREATE INDEX IF NOT EXISTS idx_favorites_deal_id ON favorites(deal_id);
CREATE INDEX IF NOT EXISTS idx_favorites_merchant_id ON favorites(merchant_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_events_customer_id ON loyalty_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_user_id ON onboarding_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_payout_batches_partner_id ON payout_batches(partner_id);
CREATE INDEX IF NOT EXISTS idx_purchases_customer_id ON purchases(customer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_deal_id ON purchases(deal_id);
CREATE INDEX IF NOT EXISTS idx_purchases_paybright_transaction_id ON purchases(paybright_transaction_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_by_partner_id ON qr_codes(created_by_partner_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_purchase_id ON redemptions(purchase_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_redeemed_by ON redemptions(redeemed_by);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscription_map_user_id ON stripe_subscription_map(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_deal_id ON transactions(deal_id);
CREATE INDEX IF NOT EXISTS idx_transactions_merchant_id ON transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_partner_id ON transactions(partner_id);
CREATE INDEX IF NOT EXISTS idx_transactions_territory_id ON transactions(territory_id);
CREATE INDEX IF NOT EXISTS idx_user_2fa_user_id ON user_2fa(user_id);
CREATE INDEX IF NOT EXISTS idx_user_entitlements_course_id ON user_entitlements(course_id);
CREATE INDEX IF NOT EXISTS idx_user_entitlements_user_id ON user_entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
