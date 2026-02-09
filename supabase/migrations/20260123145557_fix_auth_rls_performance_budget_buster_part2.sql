/*
  # Fix Auth RLS Performance - Budget Buster Part 2
  
  1. Performance
    - Replace direct auth.uid() calls with (select auth.uid()) in RLS policies
  
  2. Tables Updated
    - budget_buster_bills
    - budget_buster_debts
    - budget_buster_debt_settings
    - budget_buster_savings_goals
    - budget_buster_momentum
    - budget_buster_ai_insights
*/

-- budget_buster_bills
DROP POLICY IF EXISTS "Users manage own bills" ON budget_buster_bills;
DROP POLICY IF EXISTS "Users view own bills" ON budget_buster_bills;

CREATE POLICY "Users view own bills" ON budget_buster_bills
  FOR SELECT TO authenticated
  USING (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users manage own bills" ON budget_buster_bills
  FOR ALL TO authenticated
  USING (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  );

-- budget_buster_debts
DROP POLICY IF EXISTS "Users manage own debts" ON budget_buster_debts;
DROP POLICY IF EXISTS "Users view own debts" ON budget_buster_debts;

CREATE POLICY "Users view own debts" ON budget_buster_debts
  FOR SELECT TO authenticated
  USING (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users manage own debts" ON budget_buster_debts
  FOR ALL TO authenticated
  USING (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  );

-- budget_buster_debt_settings
DROP POLICY IF EXISTS "Users manage own debt settings" ON budget_buster_debt_settings;
DROP POLICY IF EXISTS "Users view own debt settings" ON budget_buster_debt_settings;

CREATE POLICY "Users view own debt settings" ON budget_buster_debt_settings
  FOR SELECT TO authenticated
  USING (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users manage own debt settings" ON budget_buster_debt_settings
  FOR ALL TO authenticated
  USING (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  );

-- budget_buster_savings_goals
DROP POLICY IF EXISTS "Users manage own savings goals" ON budget_buster_savings_goals;
DROP POLICY IF EXISTS "Users view own savings goals" ON budget_buster_savings_goals;

CREATE POLICY "Users view own savings goals" ON budget_buster_savings_goals
  FOR SELECT TO authenticated
  USING (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users manage own savings goals" ON budget_buster_savings_goals
  FOR ALL TO authenticated
  USING (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  );

-- budget_buster_momentum
DROP POLICY IF EXISTS "Users manage own momentum" ON budget_buster_momentum;
DROP POLICY IF EXISTS "Users view own momentum" ON budget_buster_momentum;

CREATE POLICY "Users view own momentum" ON budget_buster_momentum
  FOR SELECT TO authenticated
  USING (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users manage own momentum" ON budget_buster_momentum
  FOR ALL TO authenticated
  USING (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  );

-- budget_buster_ai_insights
DROP POLICY IF EXISTS "Users update own insights" ON budget_buster_ai_insights;
DROP POLICY IF EXISTS "Users view own insights" ON budget_buster_ai_insights;

CREATE POLICY "Users view own insights" ON budget_buster_ai_insights
  FOR SELECT TO authenticated
  USING (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users update own insights" ON budget_buster_ai_insights
  FOR UPDATE TO authenticated
  USING (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM budget_buster_users 
      WHERE profile_id = (SELECT auth.uid())
    )
  );
