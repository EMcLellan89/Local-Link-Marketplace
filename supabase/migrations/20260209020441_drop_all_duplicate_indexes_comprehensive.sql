/*
  # Drop All Duplicate Indexes

  1. Changes
    - Drops 70+ duplicate indexes across all tables
    - Keeps primary indexes, removes redundant duplicates
    - Improves database performance by reducing index maintenance overhead

  2. Index Categories
    - Foreign key indexes (duplicate coverage)
    - Composite indexes (overlapping columns)
    - Single column indexes (already covered by other indexes)

  3. Performance Impact
    - Reduces index storage requirements
    - Speeds up write operations (INSERT, UPDATE, DELETE)
    - Simplifies query planner decisions
*/

-- Academy tables duplicate indexes
DROP INDEX IF EXISTS idx_academy_courses_target_audience_duplicate;
DROP INDEX IF EXISTS idx_academy_lesson_assets_lesson_id_duplicate;
DROP INDEX IF EXISTS idx_academy_lessons_module_id_duplicate;
DROP INDEX IF EXISTS idx_academy_modules_course_id_duplicate;

-- Accounting tables duplicate indexes
DROP INDEX IF EXISTS idx_accounting_bank_accounts_user_id_duplicate;
DROP INDEX IF EXISTS idx_accounting_categories_user_id_duplicate;
DROP INDEX IF EXISTS idx_accounting_invoices_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_accounting_transactions_user_id_duplicate;

-- Affiliate tables duplicate indexes
DROP INDEX IF EXISTS idx_affiliate_clicks_affiliate_id_duplicate;
DROP INDEX IF EXISTS idx_affiliate_commissions_affiliate_id_duplicate;
DROP INDEX IF EXISTS idx_affiliate_products_affiliate_id_duplicate;
DROP INDEX IF EXISTS idx_marketplace_affiliate_clicks_affiliate_id_dup;
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_affiliate_id_dup;

-- AI and Bot tables duplicate indexes
DROP INDEX IF EXISTS idx_ai_assistant_conversations_user_id_duplicate;
DROP INDEX IF EXISTS idx_ai_bot_subscriptions_user_id_duplicate;
DROP INDEX IF EXISTS idx_ai_events_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_bot_tool_permissions_bot_id_duplicate;

-- Badge and Bundle tables duplicate indexes
DROP INDEX IF EXISTS idx_partner_badges_partner_id_duplicate;
DROP INDEX IF EXISTS idx_partner_bundles_partner_id_duplicate;
DROP INDEX IF EXISTS idx_partner_challenge_progress_partner_id_dup;

-- Blog tables duplicate indexes
DROP INDEX IF EXISTS idx_blog_articles_author_id_duplicate;
DROP INDEX IF EXISTS idx_blog_categories_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_blog_posts_merchant_id_duplicate;

-- Budget Buster duplicate indexes
DROP INDEX IF EXISTS idx_budget_buster_expenses_user_id_duplicate;
DROP INDEX IF EXISTS idx_budget_buster_goals_user_id_duplicate;
DROP INDEX IF EXISTS idx_budget_buster_subscriptions_user_id_duplicate;

-- Business and Campaign tables duplicate indexes
DROP INDEX IF EXISTS idx_business_units_parent_id_duplicate;
DROP INDEX IF EXISTS idx_campaigns_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_campaign_performance_campaign_id_duplicate;

-- Cart and Checkout duplicate indexes
DROP INDEX IF EXISTS idx_cart_items_user_id_duplicate;
DROP INDEX IF EXISTS idx_checkout_sessions_user_id_duplicate;

-- Communications duplicate indexes
DROP INDEX IF EXISTS idx_communications_transactions_merchant_id_dup;
DROP INDEX IF EXISTS idx_email_logs_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_sms_logs_merchant_id_duplicate;

-- Course and CRM tables duplicate indexes
DROP INDEX IF EXISTS idx_course_enrollments_user_id_duplicate;
DROP INDEX IF EXISTS idx_course_progress_user_id_duplicate;
DROP INDEX IF EXISTS idx_crm_contacts_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_crm_deals_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_crm_tasks_merchant_id_duplicate;

-- Customer tables duplicate indexes
DROP INDEX IF EXISTS idx_customer_preferences_customer_id_duplicate;
DROP INDEX IF EXISTS idx_customer_referrals_customer_id_duplicate;
DROP INDEX IF EXISTS idx_customer_rewards_customer_id_duplicate;

-- Deal and DFY tables duplicate indexes
DROP INDEX IF EXISTS idx_deals_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_deal_purchases_customer_id_duplicate;
DROP INDEX IF EXISTS idx_dfy_orders_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_dfy_tasks_order_id_duplicate;

-- Financial Engine duplicate indexes
DROP INDEX IF EXISTS idx_financial_accounts_user_id_duplicate;
DROP INDEX IF EXISTS idx_financial_transactions_user_id_duplicate;
DROP INDEX IF EXISTS idx_financial_receipts_user_id_duplicate;

-- Internal CRM duplicate indexes
DROP INDEX IF EXISTS idx_internal_crm_contacts_owner_id_duplicate;
DROP INDEX IF EXISTS idx_internal_crm_deals_owner_id_duplicate;
DROP INDEX IF EXISTS idx_internal_crm_tasks_owner_id_duplicate;

-- Invoice and Job duplicate indexes
DROP INDEX IF EXISTS idx_invoices_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_jobs_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_job_applications_job_id_duplicate;

-- LocalLink CRM duplicate indexes
DROP INDEX IF EXISTS idx_ll_crm_contacts_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_ll_crm_deals_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_ll_crm_tasks_merchant_id_duplicate;

-- Marketplace duplicate indexes
DROP INDEX IF EXISTS idx_marketplace_orders_user_id_duplicate;
DROP INDEX IF EXISTS idx_marketplace_products_category_duplicate;

-- Merchant tables duplicate indexes
DROP INDEX IF EXISTS idx_merchant_orders_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_merchant_services_merchant_id_duplicate;

-- Notification and Order duplicate indexes
DROP INDEX IF EXISTS idx_notifications_user_id_duplicate;
DROP INDEX IF EXISTS idx_orders_customer_id_duplicate;
DROP INDEX IF EXISTS idx_orders_merchant_id_duplicate;

-- Partner tables duplicate indexes
DROP INDEX IF EXISTS idx_partner_commissions_partner_id_duplicate;
DROP INDEX IF EXISTS idx_partner_earnings_partner_id_duplicate;
DROP INDEX IF EXISTS idx_partner_outreach_logs_partner_id_duplicate;
DROP INDEX IF EXISTS idx_partner_territories_partner_id_duplicate;

-- PayBright duplicate indexes
DROP INDEX IF EXISTS idx_paybright_transactions_merchant_id_duplicate;

-- Product and Purchase duplicate indexes
DROP INDEX IF EXISTS idx_products_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_purchases_customer_id_duplicate;
DROP INDEX IF EXISTS idx_purchases_merchant_id_duplicate;

-- Referral duplicate indexes
DROP INDEX IF EXISTS idx_referrals_referrer_id_duplicate;
DROP INDEX IF EXISTS idx_referrals_referee_id_duplicate;
DROP INDEX IF EXISTS idx_referral_rewards_customer_id_duplicate;

-- Review and Reputation duplicate indexes
DROP INDEX IF EXISTS idx_reviews_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_reviews_customer_id_duplicate;
DROP INDEX IF EXISTS idx_reputation_scores_merchant_id_duplicate;

-- Support and Survey duplicate indexes
DROP INDEX IF EXISTS idx_support_tickets_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_surveys_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_survey_responses_survey_id_duplicate;

-- Team tables duplicate indexes
DROP INDEX IF EXISTS idx_team_members_team_id_duplicate;
DROP INDEX IF EXISTS idx_team_projects_team_id_duplicate;

-- Territory and Transaction duplicate indexes
DROP INDEX IF EXISTS idx_territories_partner_id_duplicate;
DROP INDEX IF EXISTS idx_transactions_merchant_id_duplicate;

-- Twilio duplicate indexes
DROP INDEX IF EXISTS idx_twilio_calls_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_twilio_messages_merchant_id_duplicate;

-- UGC duplicate indexes
DROP INDEX IF EXISTS idx_ugc_orders_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_ugc_requests_merchant_id_duplicate;

-- VAPI duplicate indexes
DROP INDEX IF EXISTS idx_vapi_calls_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_vapi_transcripts_call_id_duplicate;

-- Video and Website duplicate indexes
DROP INDEX IF EXISTS idx_video_content_merchant_id_duplicate;
DROP INDEX IF EXISTS idx_websites_merchant_id_duplicate;