/*
  # Fix Auth RLS Performance - Batch 11: Blog, Bot, and BI Systems (Corrected)

  1. Purpose
    - Optimize RLS policies for blog, bot, and business intelligence tables
    - Wrap auth.uid() in subquery for performance
  
  2. Tables Affected
    - blog_posts (author_id), blog_categories, blog_post_tags
    - bot_channels (bot_profile_id), bot_conversations (user_id), bot_deployments
    - bi_metrics, bi_reports, bi_predictions, bi_competitor_tracking (all merchant_id)
    - batch_transactions
  
  3. Performance Impact
    - Improves content management system performance
    - Reduces overhead in bot and analytics queries
*/

-- blog_posts policies
DROP POLICY IF EXISTS "Authors can manage own posts" ON blog_posts;
CREATE POLICY "Authors can manage own posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners p
      WHERE p.id = blog_posts.author_id
        AND p.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM partners p
      WHERE p.id = blog_posts.author_id
        AND p.user_id = (select auth.uid())
    )
  );

-- blog_categories policies (public read)
DROP POLICY IF EXISTS "Anyone can view categories" ON blog_categories;
CREATE POLICY "Anyone can view categories"
  ON blog_categories FOR SELECT
  TO authenticated
  USING (true);

-- blog_post_tags policies (public read)
DROP POLICY IF EXISTS "Anyone can view post tags" ON blog_post_tags;
CREATE POLICY "Anyone can view post tags"
  ON blog_post_tags FOR SELECT
  TO authenticated
  USING (true);

-- bot_channels policies (uses bot_profile_id, need to trace to owner)
DROP POLICY IF EXISTS "Bot owners can view channels" ON bot_channels;
CREATE POLICY "Bot owners can view channels"
  ON bot_channels FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_bot_setups abs
      JOIN merchants m ON m.id = abs.merchant_id
      WHERE abs.id = bot_channels.bot_profile_id
        AND m.user_id = (select auth.uid())
    )
  );

-- bot_conversations policies (uses user_id directly)
DROP POLICY IF EXISTS "Users can view own bot conversations" ON bot_conversations;
CREATE POLICY "Users can view own bot conversations"
  ON bot_conversations FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- bot_deployments policies (uses bot_profile_id)
DROP POLICY IF EXISTS "Bot owners can view deployments" ON bot_deployments;
CREATE POLICY "Bot owners can view deployments"
  ON bot_deployments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_bot_setups abs
      JOIN merchants m ON m.id = abs.merchant_id
      WHERE abs.id = bot_deployments.bot_profile_id
        AND m.user_id = (select auth.uid())
    )
  );

-- bi_metrics policies
DROP POLICY IF EXISTS "Merchants can view own BI metrics" ON bi_metrics;
CREATE POLICY "Merchants can view own BI metrics"
  ON bi_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = bi_metrics.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

-- bi_reports policies
DROP POLICY IF EXISTS "Merchants can view own BI reports" ON bi_reports;
CREATE POLICY "Merchants can view own BI reports"
  ON bi_reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = bi_reports.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

-- bi_predictions policies
DROP POLICY IF EXISTS "Merchants can view own predictions" ON bi_predictions;
CREATE POLICY "Merchants can view own predictions"
  ON bi_predictions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = bi_predictions.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

-- bi_competitor_tracking policies
DROP POLICY IF EXISTS "Merchants can view own competitor tracking" ON bi_competitor_tracking;
CREATE POLICY "Merchants can view own competitor tracking"
  ON bi_competitor_tracking FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = bi_competitor_tracking.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

-- batch_transactions policies (no direct owner, skip for now)
DROP POLICY IF EXISTS "Admin can view batch transactions" ON batch_transactions;
CREATE POLICY "Admin can view batch transactions"
  ON batch_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au WHERE au.id = (select auth.uid())
    )
  );
