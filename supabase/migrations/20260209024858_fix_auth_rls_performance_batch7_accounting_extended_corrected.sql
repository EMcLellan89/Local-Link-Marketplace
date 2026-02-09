/*
  # Fix Auth RLS Performance - Batch 7: Accounting Extended Tables (Corrected)

  1. Purpose
    - Optimize RLS policies for accounting system tables
    - Wrap auth.uid() in subquery for performance
  
  2. Tables Affected
    - accounting_accountant_users
    - accounting_assets
    - accounting_bills
    - accounting_categories
    - accounting_chart_of_accounts
    - accounting_employees (uses team_member_id)
    - accounting_invoices
    - accounting_journal_entries
    - accounting_fiscal_periods
    - accounting_inventory
  
  3. Performance Impact
    - Reduces auth function overhead
    - Improves accounting dashboard performance
*/

-- accounting_accountant_users policies
DROP POLICY IF EXISTS "Accountants can view own record" ON accounting_accountant_users;
CREATE POLICY "Accountants can view own record"
  ON accounting_accountant_users FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- accounting_assets policies
DROP POLICY IF EXISTS "Merchants can view own assets" ON accounting_assets;
CREATE POLICY "Merchants can view own assets"
  ON accounting_assets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_assets.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can manage own assets" ON accounting_assets;
CREATE POLICY "Merchants can manage own assets"
  ON accounting_assets FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_assets.merchant_id
        AND m.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_assets.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

-- accounting_bills policies
DROP POLICY IF EXISTS "Merchants can view own bills" ON accounting_bills;
CREATE POLICY "Merchants can view own bills"
  ON accounting_bills FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_bills.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can manage own bills" ON accounting_bills;
CREATE POLICY "Merchants can manage own bills"
  ON accounting_bills FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_bills.merchant_id
        AND m.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_bills.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

-- accounting_categories policies
DROP POLICY IF EXISTS "Merchants can view own categories" ON accounting_categories;
CREATE POLICY "Merchants can view own categories"
  ON accounting_categories FOR SELECT
  TO authenticated
  USING (
    merchant_id IS NULL OR
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_categories.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can manage own categories" ON accounting_categories;
CREATE POLICY "Merchants can manage own categories"
  ON accounting_categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_categories.merchant_id
        AND m.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_categories.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

-- accounting_chart_of_accounts policies
DROP POLICY IF EXISTS "Merchants can view own chart of accounts" ON accounting_chart_of_accounts;
CREATE POLICY "Merchants can view own chart of accounts"
  ON accounting_chart_of_accounts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_chart_of_accounts.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can manage own chart of accounts" ON accounting_chart_of_accounts;
CREATE POLICY "Merchants can manage own chart of accounts"
  ON accounting_chart_of_accounts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_chart_of_accounts.merchant_id
        AND m.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_chart_of_accounts.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

-- accounting_employees policies (uses team_member_id)
DROP POLICY IF EXISTS "Team members can view own record" ON accounting_employees;
CREATE POLICY "Team members can view own record"
  ON accounting_employees FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.id = accounting_employees.team_member_id
        AND tm.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Team members can manage own record" ON accounting_employees;
CREATE POLICY "Team members can manage own record"
  ON accounting_employees FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.id = accounting_employees.team_member_id
        AND tm.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.id = accounting_employees.team_member_id
        AND tm.user_id = (select auth.uid())
    )
  );

-- accounting_invoices policies
DROP POLICY IF EXISTS "Merchants can view own invoices" ON accounting_invoices;
CREATE POLICY "Merchants can view own invoices"
  ON accounting_invoices FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_invoices.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can manage own invoices" ON accounting_invoices;
CREATE POLICY "Merchants can manage own invoices"
  ON accounting_invoices FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_invoices.merchant_id
        AND m.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_invoices.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

-- accounting_journal_entries policies
DROP POLICY IF EXISTS "Merchants can view own journal entries" ON accounting_journal_entries;
CREATE POLICY "Merchants can view own journal entries"
  ON accounting_journal_entries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_journal_entries.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can manage own journal entries" ON accounting_journal_entries;
CREATE POLICY "Merchants can manage own journal entries"
  ON accounting_journal_entries FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_journal_entries.merchant_id
        AND m.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_journal_entries.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

-- accounting_fiscal_periods policies
DROP POLICY IF EXISTS "Merchants can view own fiscal periods" ON accounting_fiscal_periods;
CREATE POLICY "Merchants can view own fiscal periods"
  ON accounting_fiscal_periods FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_fiscal_periods.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can manage own fiscal periods" ON accounting_fiscal_periods;
CREATE POLICY "Merchants can manage own fiscal periods"
  ON accounting_fiscal_periods FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_fiscal_periods.merchant_id
        AND m.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_fiscal_periods.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

-- accounting_inventory policies
DROP POLICY IF EXISTS "Merchants can view own inventory" ON accounting_inventory;
CREATE POLICY "Merchants can view own inventory"
  ON accounting_inventory FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_inventory.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can manage own inventory" ON accounting_inventory;
CREATE POLICY "Merchants can manage own inventory"
  ON accounting_inventory FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_inventory.merchant_id
        AND m.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_inventory.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );
