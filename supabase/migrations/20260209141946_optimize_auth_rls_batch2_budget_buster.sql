/*
  # Optimize Auth RLS Performance - Batch 2: Budget Buster

  1. Changes
    - Wrap auth.uid() in (SELECT auth.uid()) for Budget Buster tables
    - Affects: budget_buster_users, budget_buster_accounts, 
               budget_buster_transactions, budget_buster_bills, budget_buster_debts
  
  2. Performance Impact
    - Reduces auth function calls from N (rows) to 1 per query
    - Improves Budget Buster app performance
*/

-- Budget Buster Users
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own data" ON budget_buster_users;
  DROP POLICY IF EXISTS "Users can update own data" ON budget_buster_users;
  
  CREATE POLICY "Users can view own data"
    ON budget_buster_users FOR SELECT
    TO authenticated
    USING (profile_id = (SELECT auth.uid()));
  
  CREATE POLICY "Users can update own data"
    ON budget_buster_users FOR UPDATE
    TO authenticated
    USING (profile_id = (SELECT auth.uid()))
    WITH CHECK (profile_id = (SELECT auth.uid()));
END $$;

-- Budget Buster Accounts
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can manage own accounts" ON budget_buster_accounts;
  
  CREATE POLICY "Users can manage own accounts"
    ON budget_buster_accounts FOR ALL
    TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));
END $$;

-- Budget Buster Transactions
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can manage own transactions" ON budget_buster_transactions;
  
  CREATE POLICY "Users can manage own transactions"
    ON budget_buster_transactions FOR ALL
    TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));
END $$;

-- Budget Buster Bills
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can manage own bills" ON budget_buster_bills;
  
  CREATE POLICY "Users can manage own bills"
    ON budget_buster_bills FOR ALL
    TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));
END $$;

-- Budget Buster Debts
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can manage own debts" ON budget_buster_debts;
  
  CREATE POLICY "Users can manage own debts"
    ON budget_buster_debts FOR ALL
    TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));
END $$;
