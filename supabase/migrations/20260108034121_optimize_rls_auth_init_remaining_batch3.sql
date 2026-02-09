/*
  # Optimize RLS Auth Initialization - Remaining Batch 3

  Fixes Auth RLS Initialization Plan issues for:
  - reputation_alerts
  - reputation_campaigns
  - reputation_platforms
  - reputation_responses
  - reputation_reviews
  - shopping_carts
  - twilio_call_logs
  - twilio_call_queues
  - twilio_configurations
  - twilio_email_logs
  - twilio_sms_logs
  - twilio_voicemails
  - ugc_assets
  - ugc_creators
  - ugc_orders
  - ugc_packages
  - ugc_payouts
  - video_revisions
  - video_service_orders
  - winback_campaigns
*/

-- reputation_alerts
DROP POLICY IF EXISTS "Merchants manage their reputation alerts" ON public.reputation_alerts;
CREATE POLICY "Merchants manage their reputation alerts"
  ON public.reputation_alerts
  FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = reputation_alerts.merchant_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = reputation_alerts.merchant_id
    )
  );

-- reputation_campaigns
DROP POLICY IF EXISTS "Merchants manage their reputation campaigns" ON public.reputation_campaigns;
CREATE POLICY "Merchants manage their reputation campaigns"
  ON public.reputation_campaigns
  FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = reputation_campaigns.merchant_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = reputation_campaigns.merchant_id
    )
  );

-- reputation_platforms
DROP POLICY IF EXISTS "Merchants manage their reputation platforms" ON public.reputation_platforms;
CREATE POLICY "Merchants manage their reputation platforms"
  ON public.reputation_platforms
  FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = reputation_platforms.merchant_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = reputation_platforms.merchant_id
    )
  );

-- reputation_responses
DROP POLICY IF EXISTS "Merchants manage their review responses" ON public.reputation_responses;
CREATE POLICY "Merchants manage their review responses"
  ON public.reputation_responses
  FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT m.user_id
      FROM merchants m
      JOIN reputation_reviews rr ON m.id = rr.merchant_id
      WHERE rr.id = reputation_responses.review_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT m.user_id
      FROM merchants m
      JOIN reputation_reviews rr ON m.id = rr.merchant_id
      WHERE rr.id = reputation_responses.review_id
    )
  );

-- reputation_reviews
DROP POLICY IF EXISTS "Merchants manage reviews for their business" ON public.reputation_reviews;
CREATE POLICY "Merchants manage reviews for their business"
  ON public.reputation_reviews
  FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = reputation_reviews.merchant_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = reputation_reviews.merchant_id
    )
  );

-- shopping_carts
DROP POLICY IF EXISTS "Customers manage their cart" ON public.shopping_carts;
CREATE POLICY "Customers manage their cart"
  ON public.shopping_carts
  FOR ALL
  TO authenticated
  USING (customer_id = (select auth.uid()))
  WITH CHECK (customer_id = (select auth.uid()));

-- twilio_call_logs
DROP POLICY IF EXISTS "Merchants can update own call logs" ON public.twilio_call_logs;
CREATE POLICY "Merchants can update own call logs"
  ON public.twilio_call_logs
  FOR UPDATE
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

-- twilio_call_queues
DROP POLICY IF EXISTS "Merchants can update own call queue" ON public.twilio_call_queues;
CREATE POLICY "Merchants can update own call queue"
  ON public.twilio_call_queues
  FOR UPDATE
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

-- twilio_configurations
DROP POLICY IF EXISTS "Merchants can update own Twilio config" ON public.twilio_configurations;
CREATE POLICY "Merchants can update own Twilio config"
  ON public.twilio_configurations
  FOR UPDATE
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

-- twilio_email_logs
DROP POLICY IF EXISTS "Merchants can update own email logs" ON public.twilio_email_logs;
CREATE POLICY "Merchants can update own email logs"
  ON public.twilio_email_logs
  FOR UPDATE
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

-- twilio_sms_logs
DROP POLICY IF EXISTS "Merchants can update own SMS logs" ON public.twilio_sms_logs;
CREATE POLICY "Merchants can update own SMS logs"
  ON public.twilio_sms_logs
  FOR UPDATE
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

-- twilio_voicemails
DROP POLICY IF EXISTS "Merchants can update own voicemails" ON public.twilio_voicemails;
CREATE POLICY "Merchants can update own voicemails"
  ON public.twilio_voicemails
  FOR UPDATE
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

-- ugc_assets
DROP POLICY IF EXISTS "Admins can manage all assets" ON public.ugc_assets;
CREATE POLICY "Admins can manage all assets"
  ON public.ugc_assets
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'::user_role
    )
  );

-- ugc_creators (admin policy)
DROP POLICY IF EXISTS "Admins can manage all creators" ON public.ugc_creators;
CREATE POLICY "Admins can manage all creators"
  ON public.ugc_creators
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'::user_role
    )
  );

-- ugc_creators (self update)
DROP POLICY IF EXISTS "Creators can update own profile" ON public.ugc_creators;
CREATE POLICY "Creators can update own profile"
  ON public.ugc_creators
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ugc_orders (admin policy)
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.ugc_orders;
CREATE POLICY "Admins can manage all orders"
  ON public.ugc_orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'::user_role
    )
  );

-- ugc_orders (creator update)
DROP POLICY IF EXISTS "Creators can update assigned orders" ON public.ugc_orders;
CREATE POLICY "Creators can update assigned orders"
  ON public.ugc_orders
  FOR UPDATE
  TO authenticated
  USING (
    creator_id IN (
      SELECT ugc_creators.id
      FROM ugc_creators
      WHERE ugc_creators.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    creator_id IN (
      SELECT ugc_creators.id
      FROM ugc_creators
      WHERE ugc_creators.user_id = (select auth.uid())
    )
  );

-- ugc_packages
DROP POLICY IF EXISTS "Admins can manage packages" ON public.ugc_packages;
CREATE POLICY "Admins can manage packages"
  ON public.ugc_packages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'::user_role
    )
  );

-- ugc_payouts
DROP POLICY IF EXISTS "Admins can manage all payouts" ON public.ugc_payouts;
CREATE POLICY "Admins can manage all payouts"
  ON public.ugc_payouts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'::user_role
    )
  );

-- video_revisions
DROP POLICY IF EXISTS "Merchants manage their video revisions" ON public.video_revisions;
CREATE POLICY "Merchants manage their video revisions"
  ON public.video_revisions
  FOR ALL
  TO authenticated
  USING (
    order_id IN (
      SELECT video_service_orders.id
      FROM video_service_orders
      WHERE video_service_orders.merchant_id IN (
        SELECT merchants.id
        FROM merchants
        WHERE merchants.user_id = (select auth.uid())
      )
    )
  )
  WITH CHECK (
    order_id IN (
      SELECT video_service_orders.id
      FROM video_service_orders
      WHERE video_service_orders.merchant_id IN (
        SELECT merchants.id
        FROM merchants
        WHERE merchants.user_id = (select auth.uid())
      )
    )
  );

-- video_service_orders
DROP POLICY IF EXISTS "Merchants manage their video orders" ON public.video_service_orders;
CREATE POLICY "Merchants manage their video orders"
  ON public.video_service_orders
  FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = video_service_orders.merchant_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = video_service_orders.merchant_id
    )
  );

-- winback_campaigns
DROP POLICY IF EXISTS "Merchants manage their winback campaigns" ON public.winback_campaigns;
CREATE POLICY "Merchants manage their winback campaigns"
  ON public.winback_campaigns
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
