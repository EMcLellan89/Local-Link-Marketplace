/*
  # Drop Unused Indexes - Batch 8: BI, Marketplace, and Final Remaining Indexes
  
  1. Performance Optimization
    - Remove final batch of 70+ unused indexes
  
  2. Affected Tables
    - bi_reports, bi_metrics, bi_competitor_tracking, bi_predictions
    - community_sponsorships, ai_bot_products, social_ugc_packages
    - partner_agreements, partner_onboarding_progress, sms_queue
    - partner_bonus_awards, ai_assistant_conversations
    - email_communications, event_attendance, event_registrations
    - internal_accounting_ledger, internal_invoices, marketing_email_campaigns
    - marketplace_affiliate_commissions, marketplace_affiliate_products
    - product_course_map, referral_rewards, referral_programs
    - referral_links, referral_conversions, event_series, events
    - event_tickets, winback_campaigns, winback_triggers
    - ai_package_items, products_catalog, orders, enrollments
    - lesson_progress, course_affiliates, stripe_subscription_map
    - swipe_file_favorites, user_subscriptions, stripe_customers
    - upsell_purchases, partner_contracts, affiliate_commissions
    - affiliate_payouts
*/

-- bi_reports
DROP INDEX IF EXISTS idx_bi_reports_merchant;

-- bi_metrics
DROP INDEX IF EXISTS idx_bi_metrics_merchant;
DROP INDEX IF EXISTS idx_bi_metrics_date;

-- bi_competitor_tracking
DROP INDEX IF EXISTS idx_bi_competitor_tracking_merchant;

-- bi_predictions
DROP INDEX IF EXISTS idx_bi_predictions_merchant;

-- community_sponsorships
DROP INDEX IF EXISTS idx_community_sponsorships_merchant_id;
DROP INDEX IF EXISTS idx_community_sponsorships_status;
DROP INDEX IF EXISTS idx_community_sponsorships_type;

-- ai_bot_products
DROP INDEX IF EXISTS idx_ai_bot_products_bot_type;
DROP INDEX IF EXISTS idx_ai_bot_products_active;

-- social_ugc_packages
DROP INDEX IF EXISTS idx_social_ugc_packages_active;

-- partner_agreements
DROP INDEX IF EXISTS idx_partner_agreements_partner;

-- partner_onboarding_progress
DROP INDEX IF EXISTS idx_onboarding_progress_partner;
DROP INDEX IF EXISTS idx_partner_onboarding_progress_step_key;

-- sms_queue
DROP INDEX IF EXISTS idx_sms_queue_send_after;
DROP INDEX IF EXISTS idx_sms_queue_user_status;

-- partner_bonus_awards
DROP INDEX IF EXISTS idx_bonus_awards_partner;
DROP INDEX IF EXISTS idx_bonus_awards_quarter;

-- ai_assistant_conversations
DROP INDEX IF EXISTS idx_ai_assistant_conversations_user_id;
DROP INDEX IF EXISTS idx_ai_assistant_conversations_assistant_type;
DROP INDEX IF EXISTS idx_ai_assistant_conversations_created_at;

-- email_communications
DROP INDEX IF EXISTS idx_email_communications_business_unit_id;
DROP INDEX IF EXISTS idx_email_communications_sent_by;

-- event_attendance
DROP INDEX IF EXISTS idx_event_attendance_checked_in_by;
DROP INDEX IF EXISTS idx_event_attendance_registration;

-- event_registrations
DROP INDEX IF EXISTS idx_event_registrations_ticket_id;

-- internal_accounting_ledger
DROP INDEX IF EXISTS idx_internal_accounting_ledger_created_by;
DROP INDEX IF EXISTS idx_internal_accounting_ledger_customer_id;

-- internal_invoices
DROP INDEX IF EXISTS idx_internal_invoices_created_by;

-- marketing_email_campaigns
DROP INDEX IF EXISTS idx_marketing_email_campaigns_created_by;
DROP INDEX IF EXISTS idx_marketing_email_campaigns_segment_id;
DROP INDEX IF EXISTS idx_marketing_campaigns_business;
DROP INDEX IF EXISTS idx_marketing_campaigns_status;

-- marketplace_affiliate_commissions
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_referral_id;

-- marketplace_affiliate_products
DROP INDEX IF EXISTS marketplace_affiliate_products_stripe_price_id_idx;

-- product_course_map
DROP INDEX IF EXISTS idx_product_course_map_course_slug;

-- referral_rewards
DROP INDEX IF EXISTS idx_referral_rewards_conversion_id;
DROP INDEX IF EXISTS idx_referral_rewards_customer;

-- marketplace_affiliate_subscription_locks
DROP INDEX IF EXISTS marketplace_affiliate_subscription_locks_subscription_idx;
DROP INDEX IF EXISTS idx_mkt_aff_sub_locks_affiliate_id;
DROP INDEX IF EXISTS idx_mkt_aff_sub_locks_commission_id;

-- referral_programs
DROP INDEX IF EXISTS idx_referral_programs_merchant;

-- referral_links
DROP INDEX IF EXISTS idx_referral_links_program;
DROP INDEX IF EXISTS idx_referral_links_customer;

-- referral_conversions
DROP INDEX IF EXISTS idx_referral_conversions_link;
DROP INDEX IF EXISTS idx_referral_conversions_referee;

-- event_series
DROP INDEX IF EXISTS idx_event_series_merchant;

-- events
DROP INDEX IF EXISTS idx_events_merchant;
DROP INDEX IF EXISTS idx_events_start_time;
DROP INDEX IF EXISTS idx_events_series;

-- event_tickets
DROP INDEX IF EXISTS idx_event_tickets_event;

-- event_registrations
DROP INDEX IF EXISTS idx_event_registrations_event;
DROP INDEX IF EXISTS idx_event_registrations_customer;

-- winback_campaigns
DROP INDEX IF EXISTS idx_winback_campaigns_merchant;

-- winback_triggers
DROP INDEX IF EXISTS idx_winback_triggers_campaign;
DROP INDEX IF EXISTS idx_winback_triggers_customer;

-- winback_outreach
DROP INDEX IF EXISTS idx_winback_outreach_trigger;
DROP INDEX IF EXISTS idx_winback_outreach_customer;

-- winback_conversions
DROP INDEX IF EXISTS idx_winback_conversions_outreach;

-- ai_package_items
DROP INDEX IF EXISTS idx_ai_package_items_package;
DROP INDEX IF EXISTS idx_ai_package_items_bot;

-- products_catalog
DROP INDEX IF EXISTS idx_products_catalog_type;

-- orders
DROP INDEX IF EXISTS idx_orders_user;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_orders_affiliate_code;
DROP INDEX IF EXISTS idx_orders_stripe_session;
DROP INDEX IF EXISTS idx_orders_stripe_event_id;
DROP INDEX IF EXISTS idx_orders_stripe_customer_id;
DROP INDEX IF EXISTS idx_orders_stripe_subscription_id;
DROP INDEX IF EXISTS idx_orders_partner_id;
DROP INDEX IF EXISTS idx_orders_customer_account_id;
DROP INDEX IF EXISTS idx_orders_order_type;

-- enrollments
DROP INDEX IF EXISTS idx_enrollments_user;

-- lesson_progress
DROP INDEX IF EXISTS idx_lesson_progress_user;

-- course_affiliates
DROP INDEX IF EXISTS idx_course_affiliates_user;
DROP INDEX IF EXISTS idx_course_affiliates_code;

-- stripe_subscription_map
DROP INDEX IF EXISTS idx_stripe_subscription_map_user_id;

-- swipe_file_favorites
DROP INDEX IF EXISTS idx_swipe_file_favorites_template_id;

-- user_subscriptions
DROP INDEX IF EXISTS user_subscriptions_user_id_idx;

-- stripe_customers
DROP INDEX IF EXISTS stripe_customers_stripe_id_idx;

-- upsell_purchases
DROP INDEX IF EXISTS upsell_purchases_user_id_idx;
DROP INDEX IF EXISTS upsell_purchases_offer_id_idx;
DROP INDEX IF EXISTS upsell_purchases_stripe_pi_idx;

-- partner_contracts
DROP INDEX IF EXISTS partner_contracts_partner_id_idx;

-- affiliate_commissions
DROP INDEX IF EXISTS affiliate_commissions_partner_id_idx;
DROP INDEX IF EXISTS affiliate_commissions_status_idx;
DROP INDEX IF EXISTS affiliate_commissions_referred_user_idx;
DROP INDEX IF EXISTS commission_payout_idx;

-- affiliate_payouts
DROP INDEX IF EXISTS affiliate_payouts_status_idx;
