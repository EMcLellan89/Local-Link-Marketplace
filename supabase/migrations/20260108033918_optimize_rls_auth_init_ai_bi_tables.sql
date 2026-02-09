/*
  # Optimize RLS Auth Initialization - AI, BI, and Community Tables

  Fixes Auth RLS Initialization Plan issues for:
  - ai_assistant_conversations
  - ai_bot_setups
  - bi_competitor_tracking
  - bi_reports
  - cart_items
  - community_sponsorships
  - course_affiliates
  - customers (update policy)
  - deals (update policy)
*/

-- ai_assistant_conversations
DROP POLICY IF EXISTS "Users can update own AI conversations" ON public.ai_assistant_conversations;
CREATE POLICY "Users can update own AI conversations"
  ON public.ai_assistant_conversations
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- ai_bot_setups
DROP POLICY IF EXISTS "Merchants can update own bot setups" ON public.ai_bot_setups;
CREATE POLICY "Merchants can update own bot setups"
  ON public.ai_bot_setups
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = ai_bot_setups.merchant_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = ai_bot_setups.merchant_id
    )
  );

-- bi_competitor_tracking
DROP POLICY IF EXISTS "Merchants manage their competitor tracking" ON public.bi_competitor_tracking;
CREATE POLICY "Merchants manage their competitor tracking"
  ON public.bi_competitor_tracking
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- bi_reports
DROP POLICY IF EXISTS "Merchants manage their BI reports" ON public.bi_reports;
CREATE POLICY "Merchants manage their BI reports"
  ON public.bi_reports
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- cart_items
DROP POLICY IF EXISTS "Customers manage their cart items" ON public.cart_items;
CREATE POLICY "Customers manage their cart items"
  ON public.cart_items
  FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT shopping_carts.customer_id
      FROM shopping_carts
      WHERE shopping_carts.id = cart_items.cart_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT shopping_carts.customer_id
      FROM shopping_carts
      WHERE shopping_carts.id = cart_items.cart_id
    )
  );

-- community_sponsorships
DROP POLICY IF EXISTS "Merchants can update own sponsorships" ON public.community_sponsorships;
CREATE POLICY "Merchants can update own sponsorships"
  ON public.community_sponsorships
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = community_sponsorships.merchant_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = community_sponsorships.merchant_id
    )
  );

-- course_affiliates
DROP POLICY IF EXISTS "Users can update their own affiliate account" ON public.course_affiliates;
CREATE POLICY "Users can update their own affiliate account"
  ON public.course_affiliates
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- customers
DROP POLICY IF EXISTS "Customers can update own profile" ON public.customers;
CREATE POLICY "Customers can update own profile"
  ON public.customers
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- deals
DROP POLICY IF EXISTS "Merchants can update own deals" ON public.deals;
CREATE POLICY "Merchants can update own deals"
  ON public.deals
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM merchants
      WHERE merchants.id = deals.merchant_id
        AND merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM merchants
      WHERE merchants.id = deals.merchant_id
        AND merchants.user_id = (select auth.uid())
    )
  );
