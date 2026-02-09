/*
  # Optimize RLS Direct Auth Calls - Final Batch

  Fixes remaining policies with direct auth.uid() calls (not wrapped in SELECT).
  This prevents row-by-row re-evaluation of auth functions.

  Tables optimized:
  - affiliate_partners
  - ai_assistant_conversations (INSERT, DELETE, SELECT)
  - badge_awards
  - certificates
  - certificates_issued
  - course_affiliates (SELECT)
  - course_exam_attempts
  - email_queue
  - enrollments
  - in_app_nudges (SELECT)
  - lesson_progress (INSERT, SELECT)
  - orders
  - partner_agreement_acceptances
  - partner_assets
  - partner_bonus_awards
  - stripe_customers
  - upsell_purchases
  - user_entitlements
  - user_subscriptions
*/

-- affiliate_partners
DROP POLICY IF EXISTS "Partners can read their own profile" ON public.affiliate_partners;
CREATE POLICY "Partners can read their own profile"
  ON public.affiliate_partners
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ai_assistant_conversations (INSERT)
DROP POLICY IF EXISTS "Users can create own AI conversations" ON public.ai_assistant_conversations;
CREATE POLICY "Users can create own AI conversations"
  ON public.ai_assistant_conversations
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- ai_assistant_conversations (DELETE)
DROP POLICY IF EXISTS "Users can delete own AI conversations" ON public.ai_assistant_conversations;
CREATE POLICY "Users can delete own AI conversations"
  ON public.ai_assistant_conversations
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ai_assistant_conversations (SELECT)
DROP POLICY IF EXISTS "Users can view own AI conversations" ON public.ai_assistant_conversations;
CREATE POLICY "Users can view own AI conversations"
  ON public.ai_assistant_conversations
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- badge_awards
DROP POLICY IF EXISTS "Users can view own badges" ON public.badge_awards;
CREATE POLICY "Users can view own badges"
  ON public.badge_awards
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- certificates
DROP POLICY IF EXISTS "Users can view their own certificates" ON public.certificates;
CREATE POLICY "Users can view their own certificates"
  ON public.certificates
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- certificates_issued
DROP POLICY IF EXISTS "Users can view own certificates" ON public.certificates_issued;
CREATE POLICY "Users can view own certificates"
  ON public.certificates_issued
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- course_affiliates (SELECT)
DROP POLICY IF EXISTS "Users can view their own affiliate account" ON public.course_affiliates;
CREATE POLICY "Users can view their own affiliate account"
  ON public.course_affiliates
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- course_exam_attempts
DROP POLICY IF EXISTS "Users can read their own exam attempts" ON public.course_exam_attempts;
CREATE POLICY "Users can read their own exam attempts"
  ON public.course_exam_attempts
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- email_queue
DROP POLICY IF EXISTS "Users can view their own email queue" ON public.email_queue;
CREATE POLICY "Users can view their own email queue"
  ON public.email_queue
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- enrollments
DROP POLICY IF EXISTS "Users can view their own enrollments" ON public.enrollments;
CREATE POLICY "Users can view their own enrollments"
  ON public.enrollments
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- in_app_nudges (SELECT)
DROP POLICY IF EXISTS "Users can view their own nudges" ON public.in_app_nudges;
CREATE POLICY "Users can view their own nudges"
  ON public.in_app_nudges
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- lesson_progress (INSERT)
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.lesson_progress;
CREATE POLICY "Users can insert their own progress"
  ON public.lesson_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- lesson_progress (SELECT)
DROP POLICY IF EXISTS "Users can view their own progress" ON public.lesson_progress;
CREATE POLICY "Users can view their own progress"
  ON public.lesson_progress
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- partner_agreement_acceptances (INSERT)
DROP POLICY IF EXISTS "Users can insert own agreement acceptances" ON public.partner_agreement_acceptances;
CREATE POLICY "Users can insert own agreement acceptances"
  ON public.partner_agreement_acceptances
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- partner_agreement_acceptances (SELECT)
DROP POLICY IF EXISTS "Users can view own agreement acceptances" ON public.partner_agreement_acceptances;
CREATE POLICY "Users can view own agreement acceptances"
  ON public.partner_agreement_acceptances
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- partner_assets
DROP POLICY IF EXISTS "Partners can view their own assets" ON public.partner_assets;
CREATE POLICY "Partners can view their own assets"
  ON public.partner_assets
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = partner_id);

-- partner_bonus_awards
DROP POLICY IF EXISTS "Partners can view own bonuses" ON public.partner_bonus_awards;
CREATE POLICY "Partners can view own bonuses"
  ON public.partner_bonus_awards
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = partner_id);

-- stripe_customers
DROP POLICY IF EXISTS "Users can view own stripe customer data" ON public.stripe_customers;
CREATE POLICY "Users can view own stripe customer data"
  ON public.stripe_customers
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- upsell_purchases
DROP POLICY IF EXISTS "Users can view own upsell purchases" ON public.upsell_purchases;
CREATE POLICY "Users can view own upsell purchases"
  ON public.upsell_purchases
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- user_entitlements
DROP POLICY IF EXISTS "Users can read their own entitlements" ON public.user_entitlements;
CREATE POLICY "Users can read their own entitlements"
  ON public.user_entitlements
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- user_subscriptions
DROP POLICY IF EXISTS "subscriptions_self_read" ON public.user_subscriptions;
CREATE POLICY "subscriptions_self_read"
  ON public.user_subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));
