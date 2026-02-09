/*
  # Fix Auth RLS Performance - Batch 5: Badges, Blog, Bot, Budget Buster, Business Tables

  Optimizes RLS policies to use (SELECT auth.<function>()) pattern.

  ## Tables Modified
  - badge_rules (1 policy)
  - badges (1 policy)
  - batch_transactions (1 policy)
  - bi_competitor_tracking (1 policy)
  - bi_metrics (1 policy)
  - bi_predictions (1 policy)
  - bi_reports (1 policy)
  - blog_categories (1 policy)
  - blog_post_tags (1 policy)
  - blog_posts (2 policies)
  - bot_channels (1 policy)
  - bot_conversations (2 policies)
  - bot_deployments (1 policy)
  - bot_knowledge_links (1 policy)
  - bot_profiles (1 policy)
  - bot_runs (1 policy)
  - bot_tool_permissions (1 policy)
  - budget_buster_accounts (2 policies)
  - budget_buster_ai_insights (2 policies)
  - budget_buster_bills (2 policies)
  - budget_buster_debt_settings (2 policies)
  - budget_buster_debts (2 policies)
  - budget_buster_mode_switches (2 policies)
  - budget_buster_momentum (2 policies)
  - budget_buster_savings_goals (2 policies)
  - budget_buster_subscriptions (3 policies)
  - budget_buster_transactions (2 policies)
  - budget_buster_usage_metrics (2 policies)
  - budget_buster_users (2 policies)
  - bundle_items (1 policy)
  - business_accounting_snapshots (1 policy)
  - business_ad_campaigns (2 policies)
  - business_capital_applications (2 policies)

  Total: 50 policies optimized
*/

-- badge_rules
DROP POLICY IF EXISTS "badge_rules_admin_all" ON badge_rules;
CREATE POLICY "badge_rules_admin_all"
  ON badge_rules
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

-- badges
DROP POLICY IF EXISTS "badges_admin_all" ON badges;
CREATE POLICY "badges_admin_all"
  ON badges
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

-- batch_transactions
DROP POLICY IF EXISTS "Admins can manage batch transactions" ON batch_transactions;
CREATE POLICY "Admins can manage batch transactions"
  ON batch_transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- bi_competitor_tracking
DROP POLICY IF EXISTS "Merchants manage their competitor tracking" ON bi_competitor_tracking;
CREATE POLICY "Merchants manage their competitor tracking"
  ON bi_competitor_tracking
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

-- bi_metrics
DROP POLICY IF EXISTS "Merchants view their BI metrics" ON bi_metrics;
CREATE POLICY "Merchants view their BI metrics"
  ON bi_metrics
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

-- bi_predictions
DROP POLICY IF EXISTS "Merchants view their BI predictions" ON bi_predictions;
CREATE POLICY "Merchants view their BI predictions"
  ON bi_predictions
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

-- bi_reports
DROP POLICY IF EXISTS "Merchants manage their BI reports" ON bi_reports;
CREATE POLICY "Merchants manage their BI reports"
  ON bi_reports
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

-- blog_categories
DROP POLICY IF EXISTS "Admin can manage blog categories" ON blog_categories;
CREATE POLICY "Admin can manage blog categories"
  ON blog_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- blog_post_tags
DROP POLICY IF EXISTS "Admin can manage blog tags" ON blog_post_tags;
CREATE POLICY "Admin can manage blog tags"
  ON blog_post_tags
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- blog_posts
DROP POLICY IF EXISTS "Admin can manage blog posts" ON blog_posts;
CREATE POLICY "Admin can manage blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts
  FOR SELECT
  USING (
    status = 'published'
    OR (SELECT auth.uid()) IS NOT NULL
  );

-- bot_channels
DROP POLICY IF EXISTS "Admins can manage bot channels" ON bot_channels;
CREATE POLICY "Admins can manage bot channels"
  ON bot_channels
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

-- bot_conversations
DROP POLICY IF EXISTS "Admins can view all conversations" ON bot_conversations;
CREATE POLICY "Admins can view all conversations"
  ON bot_conversations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can view own conversations" ON bot_conversations;
CREATE POLICY "Users can view own conversations"
  ON bot_conversations
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- bot_deployments
DROP POLICY IF EXISTS "Admins can manage bot deployments" ON bot_deployments;
CREATE POLICY "Admins can manage bot deployments"
  ON bot_deployments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

-- bot_knowledge_links
DROP POLICY IF EXISTS "Admins can manage knowledge links" ON bot_knowledge_links;
CREATE POLICY "Admins can manage knowledge links"
  ON bot_knowledge_links
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

-- bot_profiles
DROP POLICY IF EXISTS "Admins can manage bot profiles" ON bot_profiles;
CREATE POLICY "Admins can manage bot profiles"
  ON bot_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

-- bot_runs
DROP POLICY IF EXISTS "bot_runs_own" ON bot_runs;
CREATE POLICY "bot_runs_own"
  ON bot_runs
  FOR ALL
  TO authenticated
  USING (profile_id = (SELECT auth.uid()));

-- bot_tool_permissions
DROP POLICY IF EXISTS "Admins can manage tool permissions" ON bot_tool_permissions;
CREATE POLICY "Admins can manage tool permissions"
  ON bot_tool_permissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

-- budget_buster_accounts
DROP POLICY IF EXISTS "Users manage own accounts" ON budget_buster_accounts;
CREATE POLICY "Users manage own accounts"
  ON budget_buster_accounts
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users view own accounts" ON budget_buster_accounts;
CREATE POLICY "Users view own accounts"
  ON budget_buster_accounts
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- budget_buster_ai_insights
DROP POLICY IF EXISTS "Users update own insights" ON budget_buster_ai_insights;
CREATE POLICY "Users update own insights"
  ON budget_buster_ai_insights
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users view own insights" ON budget_buster_ai_insights;
CREATE POLICY "Users view own insights"
  ON budget_buster_ai_insights
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- budget_buster_bills
DROP POLICY IF EXISTS "Users manage own bills" ON budget_buster_bills;
CREATE POLICY "Users manage own bills"
  ON budget_buster_bills
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users view own bills" ON budget_buster_bills;
CREATE POLICY "Users view own bills"
  ON budget_buster_bills
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- budget_buster_debt_settings
DROP POLICY IF EXISTS "Users manage own debt settings" ON budget_buster_debt_settings;
CREATE POLICY "Users manage own debt settings"
  ON budget_buster_debt_settings
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users view own debt settings" ON budget_buster_debt_settings;
CREATE POLICY "Users view own debt settings"
  ON budget_buster_debt_settings
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- budget_buster_debts
DROP POLICY IF EXISTS "Users manage own debts" ON budget_buster_debts;
CREATE POLICY "Users manage own debts"
  ON budget_buster_debts
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users view own debts" ON budget_buster_debts;
CREATE POLICY "Users view own debts"
  ON budget_buster_debts
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- budget_buster_mode_switches
DROP POLICY IF EXISTS "Admins view all switches" ON budget_buster_mode_switches;
CREATE POLICY "Admins view all switches"
  ON budget_buster_mode_switches
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "Users view own mode switches" ON budget_buster_mode_switches;
CREATE POLICY "Users view own mode switches"
  ON budget_buster_mode_switches
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- budget_buster_momentum
DROP POLICY IF EXISTS "Users manage own momentum" ON budget_buster_momentum;
CREATE POLICY "Users manage own momentum"
  ON budget_buster_momentum
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users view own momentum" ON budget_buster_momentum;
CREATE POLICY "Users view own momentum"
  ON budget_buster_momentum
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- budget_buster_savings_goals
DROP POLICY IF EXISTS "Users manage own savings goals" ON budget_buster_savings_goals;
CREATE POLICY "Users manage own savings goals"
  ON budget_buster_savings_goals
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users view own savings goals" ON budget_buster_savings_goals;
CREATE POLICY "Users view own savings goals"
  ON budget_buster_savings_goals
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- budget_buster_subscriptions
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON budget_buster_subscriptions;
CREATE POLICY "Admins can view all subscriptions"
  ON budget_buster_subscriptions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "Partners can view their customer subscriptions" ON budget_buster_subscriptions;
CREATE POLICY "Partners can view their customer subscriptions"
  ON budget_buster_subscriptions
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = partner_id);

DROP POLICY IF EXISTS "Users can view own subscriptions" ON budget_buster_subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON budget_buster_subscriptions
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- budget_buster_transactions
DROP POLICY IF EXISTS "Users manage own transactions" ON budget_buster_transactions;
CREATE POLICY "Users manage own transactions"
  ON budget_buster_transactions
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users view own transactions" ON budget_buster_transactions;
CREATE POLICY "Users view own transactions"
  ON budget_buster_transactions
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- budget_buster_usage_metrics
DROP POLICY IF EXISTS "Admins view all usage" ON budget_buster_usage_metrics;
CREATE POLICY "Admins view all usage"
  ON budget_buster_usage_metrics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "Users view own usage" ON budget_buster_usage_metrics;
CREATE POLICY "Users view own usage"
  ON budget_buster_usage_metrics
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- budget_buster_users
DROP POLICY IF EXISTS "Users can update own account" ON budget_buster_users;
CREATE POLICY "Users can update own account"
  ON budget_buster_users
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = profile_id);

DROP POLICY IF EXISTS "Users can view own account" ON budget_buster_users;
CREATE POLICY "Users can view own account"
  ON budget_buster_users
  FOR SELECT
  TO authenticated
  USING (profile_id = (SELECT auth.uid()));

-- bundle_items
DROP POLICY IF EXISTS "Admin full access to bundle_items" ON bundle_items;
CREATE POLICY "Admin full access to bundle_items"
  ON bundle_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- business_accounting_snapshots
DROP POLICY IF EXISTS "Admins can view all business snapshots" ON business_accounting_snapshots;
CREATE POLICY "Admins can view all business snapshots"
  ON business_accounting_snapshots
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- business_ad_campaigns
DROP POLICY IF EXISTS "Admin full access to business ad campaigns" ON business_ad_campaigns;
CREATE POLICY "Admin full access to business ad campaigns"
  ON business_ad_campaigns
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "Partners can view business ad campaigns" ON business_ad_campaigns;
CREATE POLICY "Partners can view business ad campaigns"
  ON business_ad_campaigns
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.user_id = (SELECT auth.uid())
      AND partners.status = 'Active'::partner_status
    )
  );

-- business_capital_applications
DROP POLICY IF EXISTS "Merchants can update own capital applications" ON business_capital_applications;
CREATE POLICY "Merchants can update own capital applications"
  ON business_capital_applications
  FOR UPDATE
  TO authenticated
  USING (merchant_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Merchants can view own capital applications" ON business_capital_applications;
CREATE POLICY "Merchants can view own capital applications"
  ON business_capital_applications
  FOR SELECT
  TO authenticated
  USING (merchant_id = (SELECT auth.uid()));