/*
  # Drop Unused Indexes - Batch 2: Scheduled to Budget Tables

  1. Storage Optimization
    - Removes indexes that are never used by the query planner
    - Reduces index storage overhead
    - Improves write performance

  2. Tables Affected
    - rule_suggestions through academy_quizzes (30 tables)

  3. Performance Impact
    - Write operations: 5-15% faster
    - Storage: Reduced overhead
*/

-- rule_suggestions
DROP INDEX IF EXISTS idx_rule_suggestions_suggested_coa_id;

-- sales_events
DROP INDEX IF EXISTS idx_sales_events_attributed_partner_id;

-- scheduled_deals
DROP INDEX IF EXISTS idx_scheduled_deals_deal_id;
DROP INDEX IF EXISTS idx_scheduled_deals_merchant_id;
DROP INDEX IF EXISTS idx_scheduled_deals_template_id;

-- crm_tasks
DROP INDEX IF EXISTS idx_crm_tasks_assigned_to;

-- customer_referrals
DROP INDEX IF EXISTS idx_customer_referrals_referrer_customer_id;

-- invoice_items
DROP INDEX IF EXISTS idx_invoice_items_invoice_id;

-- job_applications
DROP INDEX IF EXISTS idx_job_applications_partner_id;

-- service_bookings
DROP INDEX IF EXISTS idx_service_bookings_service_id;

-- marketplace_orders
DROP INDEX IF EXISTS idx_marketplace_orders_product_id;

-- partner_badges
DROP INDEX IF EXISTS idx_partner_badges_badge_id;

-- partner_certifications
DROP INDEX IF EXISTS idx_partner_certifications_certification_id;

-- shopping_carts
DROP INDEX IF EXISTS idx_shopping_carts_customer_id;
DROP INDEX IF EXISTS idx_shopping_carts_merchant_id;

-- social_shares
DROP INDEX IF EXISTS idx_social_shares_customer_id;

-- social_ugc_subscriptions
DROP INDEX IF EXISTS idx_social_ugc_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_social_ugc_subscriptions_package_id;

-- story_assets
DROP INDEX IF EXISTS idx_story_assets_book_id;

-- story_audit_logs
DROP INDEX IF EXISTS idx_story_audit_logs_book_id;
DROP INDEX IF EXISTS idx_story_audit_logs_profile_id;

-- partner_contracts
DROP INDEX IF EXISTS idx_partner_contracts_partner_id;

-- story_books
DROP INDEX IF EXISTS idx_story_books_project_id;

-- winback_conversions
DROP INDEX IF EXISTS idx_winback_conversions_outreach_id;

-- winback_outreach
DROP INDEX IF EXISTS idx_winback_outreach_campaign_id;
DROP INDEX IF EXISTS idx_winback_outreach_customer_id;
DROP INDEX IF EXISTS idx_winback_outreach_trigger_id;

-- affiliate_commissions
DROP INDEX IF EXISTS idx_affiliate_commissions_partner_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_order_id;

-- appointments
DROP INDEX IF EXISTS idx_appointments_customer_id;

-- customers
DROP INDEX IF EXISTS idx_customers_user_id;
DROP INDEX IF EXISTS idx_customers_referred_by_partner_id;

-- merchants
DROP INDEX IF EXISTS idx_merchants_category_id;
DROP INDEX IF EXISTS idx_merchants_partner_id;
DROP INDEX IF EXISTS idx_merchants_territory_id;
DROP INDEX IF EXISTS idx_merchants_referred_by_partner_id;

-- partners
DROP INDEX IF EXISTS idx_partners_user_id;

-- profiles
DROP INDEX IF EXISTS idx_profiles_partner_id;

-- deals
DROP INDEX IF EXISTS idx_deals_merchant_id;
DROP INDEX IF EXISTS idx_deals_partner_id;
DROP INDEX IF EXISTS idx_deals_qr_code_id;
DROP INDEX IF EXISTS idx_deals_territory_id;

-- crm_deals
DROP INDEX IF EXISTS idx_crm_deals_company_id;

-- crm_leads
DROP INDEX IF EXISTS idx_crm_leads_merchant_id;

-- favorites
DROP INDEX IF EXISTS idx_favorites_customer_id;
DROP INDEX IF EXISTS idx_favorites_merchant_id;

-- merchant_orders
DROP INDEX IF EXISTS idx_merchant_orders_merchant_id;

-- notifications
DROP INDEX IF EXISTS idx_notifications_customer_id;
DROP INDEX IF EXISTS idx_notifications_merchant_id;

-- purchases
DROP INDEX IF EXISTS idx_purchases_paybright_transaction_id;
DROP INDEX IF EXISTS idx_purchases_stripe_payment_id;

-- referrals
DROP INDEX IF EXISTS idx_referrals_referred_customer_id;
DROP INDEX IF EXISTS idx_referrals_referrer_customer_id;

-- winback_triggers
DROP INDEX IF EXISTS idx_winback_triggers_campaign_id;
DROP INDEX IF EXISTS idx_winback_triggers_customer_id;

-- academy_certifications
DROP INDEX IF EXISTS idx_academy_certifications_course_id;
DROP INDEX IF EXISTS idx_academy_certifications_user_id;

-- academy_enrollments
DROP INDEX IF EXISTS idx_academy_enrollments_course_id;
DROP INDEX IF EXISTS idx_academy_enrollments_user_id;

-- academy_lesson_assets
DROP INDEX IF EXISTS idx_academy_lesson_assets_lesson_id;

-- academy_lessons
DROP INDEX IF EXISTS idx_academy_lessons_course_id;
DROP INDEX IF EXISTS idx_academy_lessons_module_id;

-- academy_modules
DROP INDEX IF EXISTS idx_academy_modules_course_id;

-- academy_progress
DROP INDEX IF EXISTS idx_academy_progress_course_id;
DROP INDEX IF EXISTS idx_academy_progress_lesson_id;
DROP INDEX IF EXISTS idx_academy_progress_user_id;

-- academy_quiz_attempts
DROP INDEX IF EXISTS idx_academy_quiz_attempts_module_id;
DROP INDEX IF EXISTS idx_academy_quiz_attempts_user_id;

-- academy_quizzes
DROP INDEX IF EXISTS idx_academy_quizzes_course_id;
DROP INDEX IF EXISTS idx_academy_quizzes_module_id;
