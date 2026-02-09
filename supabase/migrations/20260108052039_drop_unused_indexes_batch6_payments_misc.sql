/*
  # Drop Unused Indexes - Batch 6: Payments & Miscellaneous Tables
  
  1. Performance Optimization
    - Remove 60+ unused indexes from payment and miscellaneous tables
  
  2. Affected Tables
    - paybright_audit_log, paybright_refunds, paybright_subscriptions
    - paybright_transactions, payout_batches, printing_orders
    - printing_products, profiles, prompt_runs, prompts
    - qr_codes, recruiting_services, redemptions, referrals
    - review_responses, reviews, scheduled_deals, service_bookings
    - social_shares, support_messages, support_tickets
    - survey_responses, system_settings, territories
    - territory_licenses, transactions
*/

-- paybright_audit_log
DROP INDEX IF EXISTS idx_paybright_audit_log_merchant_id;
DROP INDEX IF EXISTS idx_paybright_audit_log_user_id;

-- paybright_refunds
DROP INDEX IF EXISTS idx_paybright_refunds_merchant_id;
DROP INDEX IF EXISTS idx_paybright_refunds_requested_by;
DROP INDEX IF EXISTS idx_paybright_refunds_transaction_id;

-- paybright_subscriptions
DROP INDEX IF EXISTS idx_paybright_subscriptions_customer_id;
DROP INDEX IF EXISTS idx_paybright_subscriptions_merchant_id;

-- paybright_transactions
DROP INDEX IF EXISTS idx_paybright_transactions_customer_id;
DROP INDEX IF EXISTS idx_paybright_transactions_merchant_id;

-- payout_batches
DROP INDEX IF EXISTS idx_payout_batches_partner_id;

-- printing_orders
DROP INDEX IF EXISTS idx_printing_orders_product_id;

-- profiles
DROP INDEX IF EXISTS idx_profiles_partner_id;

-- prompt_runs
DROP INDEX IF EXISTS idx_prompt_runs_prompt_id;
DROP INDEX IF EXISTS idx_prompt_runs_user_id;

-- prompts
DROP INDEX IF EXISTS idx_prompts_category_id;

-- qr_codes
DROP INDEX IF EXISTS idx_qr_codes_created_by_partner_id;

-- recruiting_services
DROP INDEX IF EXISTS idx_recruiting_services_merchant_id;

-- redemptions
DROP INDEX IF EXISTS idx_redemptions_purchase_id;

-- referrals
DROP INDEX IF EXISTS idx_referrals_referred_customer_id;

-- review_responses
DROP INDEX IF EXISTS idx_review_responses_review_id;

-- reviews
DROP INDEX IF EXISTS idx_reviews_customer_id;
DROP INDEX IF EXISTS idx_reviews_purchase_id;

-- scheduled_deals
DROP INDEX IF EXISTS idx_scheduled_deals_template_id;

-- service_bookings
DROP INDEX IF EXISTS idx_service_bookings_service_id;

-- social_shares
DROP INDEX IF EXISTS idx_social_shares_customer_id;

-- support_messages
DROP INDEX IF EXISTS idx_support_messages_ticket_id;

-- support_tickets
DROP INDEX IF EXISTS idx_support_tickets_customer_id;

-- survey_responses
DROP INDEX IF EXISTS idx_survey_responses_customer_id;
DROP INDEX IF EXISTS idx_survey_responses_purchase_id;
DROP INDEX IF EXISTS idx_survey_responses_survey_id;

-- system_settings
DROP INDEX IF EXISTS idx_system_settings_updated_by;

-- territories
DROP INDEX IF EXISTS idx_territories_assigned_partner_id;
DROP INDEX IF EXISTS idx_territories_parent_territory_id;

-- territory_licenses
DROP INDEX IF EXISTS idx_territory_licenses_partner_id;
DROP INDEX IF EXISTS idx_territory_licenses_pricing_tier_id;
DROP INDEX IF EXISTS idx_territory_licenses_territory_id;

-- transactions
DROP INDEX IF EXISTS idx_transactions_deal_id;
DROP INDEX IF EXISTS idx_transactions_merchant_id;
DROP INDEX IF EXISTS idx_transactions_partner_id;
DROP INDEX IF EXISTS idx_transactions_territory_id;
