/*
  # Optimize Auth RLS Performance - Budget Buster Tables

  1. Performance Optimization
    - Wrap auth.uid() in SELECT subquery for all Budget Buster tables
    - Most tables use user_id directly
    - budget_buster_users uses profile_id
    - budget_buster_subscriptions has admin and partner policies

  2. Security
    - Maintains existing security model
    - Improves query performance by caching auth.uid() result
*/

-- budget_buster_accounts
DROP POLICY IF EXISTS "Users view own accounts" ON budget_buster_accounts;
CREATE POLICY "Users view own accounts"
  ON budget_buster_accounts
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users manage own accounts" ON budget_buster_accounts;
CREATE POLICY "Users manage own accounts"
  ON budget_buster_accounts
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- budget_buster_ai_insights
DROP POLICY IF EXISTS "Users view own insights" ON budget_buster_ai_insights;
CREATE POLICY "Users view own insights"
  ON budget_buster_ai_insights
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users update own insights" ON budget_buster_ai_insights;
CREATE POLICY "Users update own insights"
  ON budget_buster_ai_insights
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- budget_buster_bills
DROP POLICY IF EXISTS "Users view own bills" ON budget_buster_bills;
CREATE POLICY "Users view own bills"
  ON budget_buster_bills
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users manage own bills" ON budget_buster_bills;
CREATE POLICY "Users manage own bills"
  ON budget_buster_bills
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- budget_buster_debt_settings
DROP POLICY IF EXISTS "Users view own debt settings" ON budget_buster_debt_settings;
CREATE POLICY "Users view own debt settings"
  ON budget_buster_debt_settings
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users manage own debt settings" ON budget_buster_debt_settings;
CREATE POLICY "Users manage own debt settings"
  ON budget_buster_debt_settings
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- budget_buster_debts
DROP POLICY IF EXISTS "Users view own debts" ON budget_buster_debts;
CREATE POLICY "Users view own debts"
  ON budget_buster_debts
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users manage own debts" ON budget_buster_debts;
CREATE POLICY "Users manage own debts"
  ON budget_buster_debts
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- budget_buster_mode_switches
DROP POLICY IF EXISTS "Users view own mode switches" ON budget_buster_mode_switches;
CREATE POLICY "Users view own mode switches"
  ON budget_buster_mode_switches
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Admins view all switches" ON budget_buster_mode_switches;
CREATE POLICY "Admins view all switches"
  ON budget_buster_mode_switches
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (SELECT auth.uid()) 
        AND profiles.role = 'admin'
    )
  );

-- budget_buster_momentum
DROP POLICY IF EXISTS "Users view own momentum" ON budget_buster_momentum;
CREATE POLICY "Users view own momentum"
  ON budget_buster_momentum
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users manage own momentum" ON budget_buster_momentum;
CREATE POLICY "Users manage own momentum"
  ON budget_buster_momentum
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- budget_buster_savings_goals
DROP POLICY IF EXISTS "Users view own savings goals" ON budget_buster_savings_goals;
CREATE POLICY "Users view own savings goals"
  ON budget_buster_savings_goals
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users manage own savings goals" ON budget_buster_savings_goals;
CREATE POLICY "Users manage own savings goals"
  ON budget_buster_savings_goals
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- budget_buster_subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON budget_buster_subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON budget_buster_subscriptions
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Partners can view their customer subscriptions" ON budget_buster_subscriptions;
CREATE POLICY "Partners can view their customer subscriptions"
  ON budget_buster_subscriptions
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = partner_id);

DROP POLICY IF EXISTS "Admins can view all subscriptions" ON budget_buster_subscriptions;
CREATE POLICY "Admins can view all subscriptions"
  ON budget_buster_subscriptions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (SELECT auth.uid()) 
        AND profiles.role = 'admin'
    )
  );

-- budget_buster_transactions
DROP POLICY IF EXISTS "Users view own transactions" ON budget_buster_transactions;
CREATE POLICY "Users view own transactions"
  ON budget_buster_transactions
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users manage own transactions" ON budget_buster_transactions;
CREATE POLICY "Users manage own transactions"
  ON budget_buster_transactions
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- budget_buster_usage_metrics
DROP POLICY IF EXISTS "Users view own usage" ON budget_buster_usage_metrics;
CREATE POLICY "Users view own usage"
  ON budget_buster_usage_metrics
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Admins view all usage" ON budget_buster_usage_metrics;
CREATE POLICY "Admins view all usage"
  ON budget_buster_usage_metrics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (SELECT auth.uid()) 
        AND profiles.role = 'admin'
    )
  );

-- budget_buster_users (uses profile_id)
DROP POLICY IF EXISTS "Users can update own account" ON budget_buster_users;
CREATE POLICY "Users can update own account"
  ON budget_buster_users
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = profile_id);
