/*
  # Add Missing Foreign Key Indexes - Batch 3: Academy & Marketplace Tables
  
  1. Purpose
    - Add covering indexes for unindexed foreign key constraints
    - Focuses on academy and marketplace tables
  
  2. Tables Affected
    - academy_certifications: course_id, user_id
    - academy_enrollments: course_id, user_id
    - academy_lesson_assets: lesson_id
    - academy_lessons: course_id, module_id
    - academy_modules: course_id
    - academy_progress: course_id, lesson_id, user_id
    - academy_quiz_attempts: course_id, module_id, user_id
    - academy_quizzes: course_id, module_id
    - marketplace tables: various FKs
  
  3. Security
    - Indexes improve performance of FK constraint checks
    - No RLS changes required
*/

-- Academy Tables
CREATE INDEX IF NOT EXISTS idx_academy_certifications_course_id 
  ON public.academy_certifications(course_id);

CREATE INDEX IF NOT EXISTS idx_academy_certifications_user_id 
  ON public.academy_certifications(user_id);

CREATE INDEX IF NOT EXISTS idx_academy_enrollments_course_id 
  ON public.academy_enrollments(course_id);

CREATE INDEX IF NOT EXISTS idx_academy_enrollments_user_id 
  ON public.academy_enrollments(user_id);

CREATE INDEX IF NOT EXISTS idx_academy_lesson_assets_lesson_id 
  ON public.academy_lesson_assets(lesson_id);

CREATE INDEX IF NOT EXISTS idx_academy_lessons_course_id 
  ON public.academy_lessons(course_id);

CREATE INDEX IF NOT EXISTS idx_academy_lessons_module_id 
  ON public.academy_lessons(module_id);

CREATE INDEX IF NOT EXISTS idx_academy_modules_course_id 
  ON public.academy_modules(course_id);

CREATE INDEX IF NOT EXISTS idx_academy_progress_course_id 
  ON public.academy_progress(course_id);

CREATE INDEX IF NOT EXISTS idx_academy_progress_lesson_id 
  ON public.academy_progress(lesson_id);

CREATE INDEX IF NOT EXISTS idx_academy_progress_user_id 
  ON public.academy_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_course_id 
  ON public.academy_quiz_attempts(course_id);

CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_module_id 
  ON public.academy_quiz_attempts(module_id);

CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_user_id 
  ON public.academy_quiz_attempts(user_id);

CREATE INDEX IF NOT EXISTS idx_academy_quizzes_course_id 
  ON public.academy_quizzes(course_id);

CREATE INDEX IF NOT EXISTS idx_academy_quizzes_module_id 
  ON public.academy_quizzes(module_id);

-- Marketplace Tables
CREATE INDEX IF NOT EXISTS idx_marketplace_abandoned_carts_checkout_session_id 
  ON public.marketplace_abandoned_carts(checkout_session_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_badges_marketplace_affiliate_id 
  ON public.marketplace_affiliate_badges(marketplace_affiliate_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_commissions_marketplace_affiliate_id 
  ON public.marketplace_affiliate_commissions(marketplace_affiliate_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_commissions_order_id 
  ON public.marketplace_affiliate_commissions(order_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_commissions_referral_id 
  ON public.marketplace_affiliate_commissions(referral_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_payouts_marketplace_affiliate_id 
  ON public.marketplace_affiliate_payouts(marketplace_affiliate_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_products_stripe_price_id 
  ON public.marketplace_affiliate_products(stripe_price_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_referrals_marketplace_affiliate_id 
  ON public.marketplace_affiliate_referrals(marketplace_affiliate_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_referrals_referred_user_id 
  ON public.marketplace_affiliate_referrals(referred_user_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_subscription_locks_commission_id 
  ON public.marketplace_affiliate_subscription_locks(commission_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_subscription_locks_marketplace_affiliate_id 
  ON public.marketplace_affiliate_subscription_locks(marketplace_affiliate_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_subscription_locks_subscription_id 
  ON public.marketplace_affiliate_subscription_locks(subscription_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_training_progress_marketplace_affiliate_id 
  ON public.marketplace_affiliate_training_progress(marketplace_affiliate_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_affiliates_user_id 
  ON public.marketplace_affiliates(user_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_configs_order_bump_product_id 
  ON public.marketplace_checkout_configs(order_bump_product_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_configs_product_id 
  ON public.marketplace_checkout_configs(product_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_configs_upsell_product_id 
  ON public.marketplace_checkout_configs(upsell_product_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_bump_product_id 
  ON public.marketplace_checkout_sessions(bump_product_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_partner_id 
  ON public.marketplace_checkout_sessions(partner_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_price_id 
  ON public.marketplace_checkout_sessions(price_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_product_id 
  ON public.marketplace_checkout_sessions(product_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_referral_id 
  ON public.marketplace_checkout_sessions(referral_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_user_id 
  ON public.marketplace_checkout_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_commissions_order_id 
  ON public.marketplace_commissions(order_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_commissions_partner_id 
  ON public.marketplace_commissions(partner_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_order_items_order_id 
  ON public.marketplace_order_items(order_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_order_items_product_id 
  ON public.marketplace_order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_orders_checkout_session_id 
  ON public.marketplace_orders(checkout_session_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_orders_partner_id 
  ON public.marketplace_orders(partner_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_orders_price_id 
  ON public.marketplace_orders(price_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_orders_product_id 
  ON public.marketplace_orders(product_id);