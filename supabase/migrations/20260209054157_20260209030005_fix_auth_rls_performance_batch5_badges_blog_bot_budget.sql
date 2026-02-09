/*
  # Optimize Auth RLS Performance - Batch 5 (Badges, Blog, Bot, Budget)

  1. Changes
    - Wraps all auth.uid() calls in subqueries
    - Applies to: partner_badges, blog_posts, bot_conversations, budget_buster_users

  2. Performance Impact
    - Improves partner achievement queries
    - Speeds up blog content access
    - Optimizes budget tracker queries

  3. Security Notes
    - Maintains user-specific and role-based access
    - No functional security changes
*/

-- Partner badges
DROP POLICY IF EXISTS "Partners can view own badges" ON partner_badges;
CREATE POLICY "Partners can view own badges"
  ON partner_badges FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
  );

-- Blog posts (author-based access)
DROP POLICY IF EXISTS "Authors can manage own blog posts" ON blog_posts;
CREATE POLICY "Authors can manage own blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (author_id = (select auth.uid()));

-- Bot conversations
DROP POLICY IF EXISTS "Users can view own bot conversations" ON bot_conversations;
CREATE POLICY "Users can view own bot conversations"
  ON bot_conversations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own bot conversations" ON bot_conversations;
CREATE POLICY "Users can create own bot conversations"
  ON bot_conversations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- Budget Buster users (uses profile_id)
DROP POLICY IF EXISTS "Users can view own budget data" ON budget_buster_users;
CREATE POLICY "Users can view own budget data"
  ON budget_buster_users FOR SELECT
  TO authenticated
  USING (profile_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own budget data" ON budget_buster_users;
CREATE POLICY "Users can update own budget data"
  ON budget_buster_users FOR UPDATE
  TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own budget profile" ON budget_buster_users;
CREATE POLICY "Users can create own budget profile"
  ON budget_buster_users FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = (select auth.uid()));
