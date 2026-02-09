/*
  # Fix Auth RLS Performance - Batch 9: Accounting Tables

  1. Performance Optimization
    - Optimizes Auth RLS policies on accounting tables
    - Wraps auth.uid() in subquery to prevent re-evaluation
    - Improves query performance by evaluating auth once per query

  2. Tables Modified
    - accounting_accountant_users (2 policies)
    - accounting_categories (4 policies)
    - accounting_chart_of_accounts (2 policies)
    - accounting_employee_payroll (3 policies)
    - accounting_employees (4 policies)
    - accounting_fiscal_periods (2 policies)
    - accounting_inventory (2 policies)
    - accounting_inventory_transactions (2 policies)
    - accounting_journal_entries (2 policies)

  3. Security
    - Maintains existing access control logic
    - No changes to authorization rules
    - Only optimizes performance of existing policies
*/

-- accounting_accountant_users policies
DROP POLICY IF EXISTS "Accountants can view own record" ON accounting_accountant_users;
CREATE POLICY "Accountants can view own record"
  ON accounting_accountant_users FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Admins can manage accountant users" ON accounting_accountant_users;
CREATE POLICY "Admins can manage accountant users"
  ON accounting_accountant_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = (select auth.uid())
    )
  );

-- accounting_categories policies
DROP POLICY IF EXISTS "Merchants can delete own categories" ON accounting_categories;
CREATE POLICY "Merchants can delete own categories"
  ON accounting_categories FOR DELETE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can manage own categories" ON accounting_categories;
CREATE POLICY "Merchants can manage own categories"
  ON accounting_categories FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can update own categories" ON accounting_categories;
CREATE POLICY "Merchants can update own categories"
  ON accounting_categories FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can view own categories" ON accounting_categories;
CREATE POLICY "Merchants can view own categories"
  ON accounting_categories FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- accounting_chart_of_accounts policies
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
  );

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

-- accounting_employee_payroll policies
DROP POLICY IF EXISTS "Admins can manage payroll" ON accounting_employee_payroll;
CREATE POLICY "Admins can manage payroll"
  ON accounting_employee_payroll FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM accounting_employees e
      JOIN team_members tm ON tm.id = e.team_member_id
      WHERE e.id = accounting_employee_payroll.employee_id
        AND tm.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins manage payroll" ON accounting_employee_payroll;
CREATE POLICY "Admins manage payroll"
  ON accounting_employee_payroll FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "View payroll" ON accounting_employee_payroll;
CREATE POLICY "View payroll"
  ON accounting_employee_payroll FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users
      WHERE user_id = (select auth.uid()) AND is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- accounting_employees policies
DROP POLICY IF EXISTS "Admins manage employees" ON accounting_employees;
CREATE POLICY "Admins manage employees"
  ON accounting_employees FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
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
  );

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

DROP POLICY IF EXISTS "View employees" ON accounting_employees;
CREATE POLICY "View employees"
  ON accounting_employees FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users
      WHERE user_id = (select auth.uid()) AND is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- accounting_fiscal_periods policies
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
  );

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

-- accounting_inventory policies
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
  );

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

-- accounting_inventory_transactions policies
DROP POLICY IF EXISTS "Merchants can manage own inventory transactions" ON accounting_inventory_transactions;
CREATE POLICY "Merchants can manage own inventory transactions"
  ON accounting_inventory_transactions FOR ALL
  TO authenticated
  USING (
    inventory_id IN (
      SELECT accounting_inventory.id FROM accounting_inventory
      WHERE accounting_inventory.merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    )
  );

DROP POLICY IF EXISTS "Merchants can view own inventory transactions" ON accounting_inventory_transactions;
CREATE POLICY "Merchants can view own inventory transactions"
  ON accounting_inventory_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM accounting_inventory inv
      JOIN merchants m ON m.id = inv.merchant_id
      WHERE inv.id = accounting_inventory_transactions.inventory_id
        AND m.user_id = (select auth.uid())
    )
  );

-- accounting_journal_entries policies
DROP POLICY IF EXISTS "Merchants can manage own journal entries" ON accounting_journal_entries;
CREATE POLICY "Merchants can manage own journal entries"
  ON accounting_journal_entries FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can view own journal entries" ON accounting_journal_entries;
CREATE POLICY "Merchants can view own journal entries"
  ON accounting_journal_entries FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );