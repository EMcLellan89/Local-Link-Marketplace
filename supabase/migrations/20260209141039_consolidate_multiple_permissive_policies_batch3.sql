/*
  # Consolidate Multiple Permissive Policies - Batch 3

  This migration consolidates duplicate policies for budget buster and merchant tables.
  
  ## Tables Fixed:
  - budget_buster_accounts
  - budget_buster_bills
  - budget_buster_debts
  - budget_buster_transactions
  - budget_buster_users
  - merchants
  - customers
  - partners
*/

-- Budget Buster Accounts
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users view own accounts" ON budget_buster_accounts;
  DROP POLICY IF EXISTS "Users manage own accounts" ON budget_buster_accounts;
  
  CREATE POLICY "Users manage own accounts"
    ON budget_buster_accounts FOR ALL
    TO authenticated
    USING (user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid()))
    WITH CHECK (user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid()));
END $$;

-- Budget Buster Bills
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users view own bills" ON budget_buster_bills;
  DROP POLICY IF EXISTS "Users manage own bills" ON budget_buster_bills;
  
  CREATE POLICY "Users manage own bills"
    ON budget_buster_bills FOR ALL
    TO authenticated
    USING (user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid()))
    WITH CHECK (user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid()));
END $$;

-- Budget Buster Debts
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users view own debts" ON budget_buster_debts;
  DROP POLICY IF EXISTS "Users manage own debts" ON budget_buster_debts;
  
  CREATE POLICY "Users manage own debts"
    ON budget_buster_debts FOR ALL
    TO authenticated
    USING (user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid()))
    WITH CHECK (user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid()));
END $$;

-- Budget Buster Transactions
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users view own transactions" ON budget_buster_transactions;
  DROP POLICY IF EXISTS "Users manage own transactions" ON budget_buster_transactions;
  
  CREATE POLICY "Users manage own transactions"
    ON budget_buster_transactions FOR ALL
    TO authenticated
    USING (user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid()))
    WITH CHECK (user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid()));
END $$;

-- Budget Buster Users
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own account" ON budget_buster_users;
  DROP POLICY IF EXISTS "Users can update own account" ON budget_buster_users;
  
  CREATE POLICY "Users manage own account"
    ON budget_buster_users FOR ALL
    TO authenticated
    USING (profile_id = auth.uid())
    WITH CHECK (profile_id = auth.uid());
END $$;

-- Merchants
DO $$
BEGIN
  DROP POLICY IF EXISTS "Merchants can view own data" ON merchants;
  DROP POLICY IF EXISTS "Merchants can update own data" ON merchants;
  DROP POLICY IF EXISTS "Merchants view own profile" ON merchants;
  DROP POLICY IF EXISTS "Merchants update own profile" ON merchants;
  
  CREATE POLICY "Merchants manage own data"
    ON merchants FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
END $$;

-- Customers
DO $$
BEGIN
  DROP POLICY IF EXISTS "Customers can view own data" ON customers;
  DROP POLICY IF EXISTS "Customers can update own data" ON customers;
  DROP POLICY IF EXISTS "Customers view own profile" ON customers;
  DROP POLICY IF EXISTS "Customers update own profile" ON customers;
  
  CREATE POLICY "Customers manage own data"
    ON customers FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
END $$;

-- Partners
DO $$
BEGIN
  DROP POLICY IF EXISTS "Partners can view own data" ON partners;
  DROP POLICY IF EXISTS "Partners can update own data" ON partners;
  DROP POLICY IF EXISTS "Partners view own profile" ON partners;
  DROP POLICY IF EXISTS "Partners update own profile" ON partners;
  
  CREATE POLICY "Partners manage own data"
    ON partners FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
END $$;
