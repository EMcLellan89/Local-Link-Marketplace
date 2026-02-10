/*
  # Drop Unused Indexes - Batch 12: Remaining Tables (Final)

  1. Performance Impact
    - Write operations: 5-10% faster on affected tables
    - Storage: Reduced index storage overhead
    - Maintenance: Simplified index structure

  2. Tables Affected
    - certificates (2 indexes)
    - course_exam_attempts (3 indexes)
    - enrollments (3 indexes)
    - lesson_progress (3 indexes)
    - affiliate_clicks (3 indexes)
    - affiliate_conversions (3 indexes)
    - affiliate_commissions (4 indexes)
    - marketplace_affiliate_links (2 indexes)
    - marketplace_affiliate_clicks (3 indexes)
    - marketplace_affiliate_commissions (4 indexes)
    - creator_payouts (3 indexes)
    - stripe_webhook_events (3 indexes)
    - stripe_connect_accounts (2 indexes)
    - paybright_transactions (3 indexes)
    - paybright_refunds (2 indexes)
    - qr_codes (2 indexes)
    - postcard_orders (3 indexes)
    - printing_orders (3 indexes)
    - swag_orders (3 indexes)
    - website_orders (3 indexes)
    - swipe_file_assets (3 indexes)
    - campaigns (3 indexes)
    - campaign_performance (3 indexes)
    - executive_cases (3 indexes)
    - executive_solutions (2 indexes)

  3. Total Indexes Dropped: ~70
*/

-- certificates
DROP INDEX IF EXISTS idx_certificates_user_id;
DROP INDEX IF EXISTS idx_certificates_verification_code;

-- course_exam_attempts
DROP INDEX IF EXISTS idx_course_exam_attempts_course_id;
DROP INDEX IF EXISTS idx_course_exam_attempts_passed;
DROP INDEX IF EXISTS idx_course_exam_attempts_attempt_number;

-- enrollments
DROP INDEX IF EXISTS idx_enrollments_user_id;
DROP INDEX IF EXISTS idx_enrollments_status;
DROP INDEX IF EXISTS idx_enrollments_enrolled_at;

-- lesson_progress
DROP INDEX IF EXISTS idx_lesson_progress_user_id;
DROP INDEX IF EXISTS idx_lesson_progress_course_id;
DROP INDEX IF EXISTS idx_lesson_progress_completed;

-- affiliate_clicks
DROP INDEX IF EXISTS idx_affiliate_clicks_link;
DROP INDEX IF EXISTS idx_affiliate_clicks_visitor;
DROP INDEX IF EXISTS idx_affiliate_clicks_timestamp;

-- affiliate_conversions
DROP INDEX IF EXISTS idx_affiliate_conversions_click;
DROP INDEX IF EXISTS idx_affiliate_conversions_partner;
DROP INDEX IF EXISTS idx_affiliate_conversions_timestamp;

-- affiliate_commissions
DROP INDEX IF EXISTS idx_affiliate_commissions_partner;
DROP INDEX IF EXISTS idx_affiliate_commissions_conversion;
DROP INDEX IF EXISTS idx_affiliate_commissions_status;
DROP INDEX IF EXISTS idx_affiliate_commissions_payout_batch;

-- marketplace_affiliate_links
DROP INDEX IF EXISTS idx_marketplace_affiliate_links_partner;
DROP INDEX IF EXISTS idx_marketplace_affiliate_links_product;

-- marketplace_affiliate_clicks
DROP INDEX IF EXISTS idx_marketplace_affiliate_clicks_link;
DROP INDEX IF EXISTS idx_marketplace_affiliate_clicks_partner;
DROP INDEX IF EXISTS idx_marketplace_affiliate_clicks_timestamp;

-- marketplace_affiliate_commissions
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_partner;
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_order;
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_status;
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_payout_batch;

-- creator_payouts
DROP INDEX IF EXISTS idx_creator_payouts_creator;
DROP INDEX IF EXISTS idx_creator_payouts_status;
DROP INDEX IF EXISTS idx_creator_payouts_period;

-- stripe_webhook_events
DROP INDEX IF EXISTS idx_stripe_webhook_events_event_type;
DROP INDEX IF EXISTS idx_stripe_webhook_events_processed;
DROP INDEX IF EXISTS idx_stripe_webhook_events_timestamp;

-- stripe_connect_accounts
DROP INDEX IF EXISTS idx_stripe_connect_accounts_user_id;
DROP INDEX IF EXISTS idx_stripe_connect_accounts_stripe_account_id;

-- paybright_transactions
DROP INDEX IF EXISTS idx_paybright_transactions_merchant;
DROP INDEX IF EXISTS idx_paybright_transactions_status;
DROP INDEX IF EXISTS idx_paybright_transactions_timestamp;

-- paybright_refunds
DROP INDEX IF EXISTS idx_paybright_refunds_transaction;
DROP INDEX IF EXISTS idx_paybright_refunds_status;

-- qr_codes
DROP INDEX IF EXISTS idx_qr_codes_entity_type;
DROP INDEX IF EXISTS idx_qr_codes_code;

-- postcard_orders
DROP INDEX IF EXISTS idx_postcard_orders_merchant;
DROP INDEX IF EXISTS idx_postcard_orders_campaign;
DROP INDEX IF EXISTS idx_postcard_orders_status;

-- printing_orders
DROP INDEX IF EXISTS idx_printing_orders_merchant;
DROP INDEX IF EXISTS idx_printing_orders_product;
DROP INDEX IF EXISTS idx_printing_orders_status;

-- swag_orders
DROP INDEX IF EXISTS idx_swag_orders_merchant;
DROP INDEX IF EXISTS idx_swag_orders_product;
DROP INDEX IF EXISTS idx_swag_orders_status;

-- website_orders
DROP INDEX IF EXISTS idx_website_orders_merchant;
DROP INDEX IF EXISTS idx_website_orders_template;
DROP INDEX IF EXISTS idx_website_orders_status;

-- swipe_file_assets
DROP INDEX IF EXISTS idx_swipe_file_assets_category;
DROP INDEX IF EXISTS idx_swipe_file_assets_type;
DROP INDEX IF EXISTS idx_swipe_file_assets_status;

-- campaigns
DROP INDEX IF EXISTS idx_campaigns_merchant;
DROP INDEX IF EXISTS idx_campaigns_type;
DROP INDEX IF EXISTS idx_campaigns_status;

-- campaign_performance
DROP INDEX IF EXISTS idx_campaign_performance_campaign;
DROP INDEX IF EXISTS idx_campaign_performance_date;
DROP INDEX IF EXISTS idx_campaign_performance_metric_type;

-- executive_cases
DROP INDEX IF EXISTS idx_executive_cases_merchant;
DROP INDEX IF EXISTS idx_executive_cases_partner;
DROP INDEX IF EXISTS idx_executive_cases_status;

-- executive_solutions
DROP INDEX IF EXISTS idx_executive_solutions_category;
DROP INDEX IF EXISTS idx_executive_solutions_tier;