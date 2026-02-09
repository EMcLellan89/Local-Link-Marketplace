/*
  # Fix Auth RLS Performance - Batch 13: Budget Buster Tables

  1. Performance Optimization
    - Optimizes Auth RLS policies on budget buster tables
    - Wraps auth.uid() in subquery to prevent re-evaluation
    - Improves query performance by evaluating auth once per query

  2. Tables Modified
    - budget_buster_accounts (2 policies)
    - budget_buster_ai_insights (2 policies)
    - budget_buster_bills (2 policies)
    - budget_buster_debt_settings (2 policies)
    - budget_buster_debts (2 policies)
    - budget_buster_mode_switches (2 policies)
    - budget_buster_momentum (2 policies)
    - budget_buster_savings_goals (2 policies)
    - budget_buster_subscriptions (1 policy)
    - budget_buster_transactions (2 policies)
    - budget_buster_usage_metrics (2 policies)

  3. Security
    - Maintains existing access control logic
    - No changes to authorization rules
    - Only optimizes performance of existing policies
*/

-- budget_buster_accounts
DROP POLICY IF EXISTS "Users manage own accounts" ON budget_buster_accounts;
CREATE POLICY "Users manage own accounts"
  ON budget_buster_accounts FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users view own accounts" ON budget_buster_accounts;
CREATE POLICY "Users view own accounts"
  ON budget_buster_accounts FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- budget_buster_ai_insights
DROP POLICY IF EXISTS "Users update own insights" ON budget_buster_ai_insights;
CREATE POLICY "Users update own insights"
  ON budget_buster_ai_insights FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users view own insights" ON budget_buster_ai_insights;
CREATE POLICY "Users view own insights"
  ON budget_buster_ai_insights FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- budget_buster_bills
DROP POLICY IF EXISTS "Users manage own bills" ON budget_buster_bills;
CREATE POLICY "Users manage own bills"
  ON budget_buster_bills FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users view own bills" ON budget_buster_bills;
CREATE POLICY "Users view own bills"
  ON budget_buster_bills FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- budget_buster_debt_settings
DROP POLICY IF EXISTS "Users manage own debt settings" ON budget_buster_debt_settings;
CREATE POLICY "Users manage own debt settings"
  ON budget_buster_debt_settings FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users view own debt settings" ON budget_buster_debt_settings;
CREATE POLICY "Users view own debt settings"
  ON budget_buster_debt_settings FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- budget_buster_debts
DROP POLICY IF EXISTS "Users manage own debts" ON budget_buster_debts;
CREATE POLICY "Users manage own debts"
  ON budget_buster_debts FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users view own debts" ON budget_buster_debts;
CREATE POLICY "Users view own debts"
  ON budget_buster_debts FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- budget_buster_mode_switches
DROP POLICY IF EXISTS "Admins view all switches" ON budget_buster_mode_switches;
CREATE POLICY "Admins view all switches"
  ON budget_buster_mode_switches FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users view own mode switches" ON budget_buster_mode_switches;
CREATE POLICY "Users view own mode switches"
  ON budget_buster_mode_switches FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- budget_buster_momentum
DROP POLICY IF EXISTS "Users manage own momentum" ON budget_buster_momentum;
CREATE POLICY "Users manage own momentum"
  ON budget_buster_momentum FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users view own momentum" ON budget_buster_momentum;
CREATE POLICY "Users view own momentum"
  ON budget_buster_momentum FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- budget_buster_savings_goals
DROP POLICY IF EXISTS "Users manage own savings goals" ON budget_buster_savings_goals;
CREATE POLICY "Users manage own savings goals"
  ON budget_buster_savings_goals FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users view own savings goals" ON budget_buster_savings_goals;
CREATE POLICY "Users view own savings goals"
  ON budget_buster_savings_goals FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- budget_buster_subscriptions
DROP POLICY IF EXISTS "Unified budget buster subscription access" ON budget_buster_subscriptions;
CREATE POLICY "Unified budget buster subscription access"
  ON budget_buster_subscriptions FOR ALL
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- budget_buster_transactions
DROP POLICY IF EXISTS "Users manage own transactions" ON budget_buster_transactions;
CREATE POLICY "Users manage own transactions"
  ON budget_buster_transactions FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users view own transactions" ON budget_buster_transactions;
CREATE POLICY "Users view own transactions"
  ON budget_buster_transactions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- budget_buster_usage_metrics
DROP POLICY IF EXISTS "Admins view all usage" ON budget_buster_usage_metrics;
CREATE POLICY "Admins view all usage"
  ON budget_buster_usage_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users view own usage" ON budget_buster_usage_metrics;
CREATE POLICY "Users view own usage"
  ON budget_buster_usage_metrics FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));