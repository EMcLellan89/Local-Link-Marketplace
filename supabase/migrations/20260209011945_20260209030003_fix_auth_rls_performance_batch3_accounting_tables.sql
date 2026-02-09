/*
  # Fix Auth RLS Performance - Batch 3: Accounting Tables

  Optimizes RLS policies for accounting tables to use (SELECT auth.<function>()) pattern.

  ## Tables Modified
  - accounting_accountant_users (1 policy)
  - accounting_assets (1 policy)
  - accounting_bills (1 policy)
  - accounting_categories (3 policies)
  - accounting_chart_of_accounts (1 policy)
  - accounting_employee_payroll (2 policies)
  - accounting_employees (2 policies)
  - accounting_fiscal_periods (1 policy)
  - accounting_inventory (1 policy)
  - accounting_inventory_transactions (1 policy)
  - accounting_invoices (1 policy)
  - accounting_journal_entries (1 policy)
  - accounting_journal_entry_lines (1 policy)
  - accounting_partner_1099_data (2 policies)
  - accounting_payments (1 policy)
  - accounting_payroll (1 policy)
  - accounting_reconciliations (1 policy)
  - accounting_tax_categories (1 policy)
  - accounting_tax_obligations (2 policies)
  - accounting_tax_payments (2 policies)
  - accounting_tax_reports (1 policy)
  - accounting_transactions (1 policy)

  Total: 29 policies optimized
*/

-- accounting_accountant_users
DROP POLICY IF EXISTS "Admins can manage accountant users" ON accounting_accountant_users;
CREATE POLICY "Admins can manage accountant users"
  ON accounting_accountant_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- accounting_assets
DROP POLICY IF EXISTS "Merchants can manage own assets" ON accounting_assets;
CREATE POLICY "Merchants can manage own assets"
  ON accounting_assets
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

-- accounting_bills
DROP POLICY IF EXISTS "Merchants can manage own bills" ON accounting_bills;
CREATE POLICY "Merchants can manage own bills"
  ON accounting_bills
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

-- accounting_categories
DROP POLICY IF EXISTS "Merchants can delete own categories" ON accounting_categories;
CREATE POLICY "Merchants can delete own categories"
  ON accounting_categories
  FOR DELETE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can update own categories" ON accounting_categories;
CREATE POLICY "Merchants can update own categories"
  ON accounting_categories
  FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can view own categories" ON accounting_categories;
CREATE POLICY "Merchants can view own categories"
  ON accounting_categories
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
    OR merchant_id IS NULL
  );

-- accounting_chart_of_accounts
DROP POLICY IF EXISTS "Merchants can manage own chart of accounts" ON accounting_chart_of_accounts;
CREATE POLICY "Merchants can manage own chart of accounts"
  ON accounting_chart_of_accounts
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

-- accounting_employee_payroll
DROP POLICY IF EXISTS "Admins manage payroll" ON accounting_employee_payroll;
CREATE POLICY "Admins manage payroll"
  ON accounting_employee_payroll
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "View payroll" ON accounting_employee_payroll;
CREATE POLICY "View payroll"
  ON accounting_employee_payroll
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users
      WHERE accounting_accountant_users.user_id = (SELECT auth.uid())
      AND accounting_accountant_users.is_active = true
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- accounting_employees
DROP POLICY IF EXISTS "Admins manage employees" ON accounting_employees;
CREATE POLICY "Admins manage employees"
  ON accounting_employees
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "View employees" ON accounting_employees;
CREATE POLICY "View employees"
  ON accounting_employees
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users
      WHERE accounting_accountant_users.user_id = (SELECT auth.uid())
      AND accounting_accountant_users.is_active = true
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- accounting_fiscal_periods
DROP POLICY IF EXISTS "Merchants can manage own fiscal periods" ON accounting_fiscal_periods;
CREATE POLICY "Merchants can manage own fiscal periods"
  ON accounting_fiscal_periods
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

-- accounting_inventory
DROP POLICY IF EXISTS "Merchants can manage own inventory" ON accounting_inventory;
CREATE POLICY "Merchants can manage own inventory"
  ON accounting_inventory
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

-- accounting_inventory_transactions
DROP POLICY IF EXISTS "Merchants can manage own inventory transactions" ON accounting_inventory_transactions;
CREATE POLICY "Merchants can manage own inventory transactions"
  ON accounting_inventory_transactions
  FOR ALL
  TO authenticated
  USING (
    inventory_id IN (
      SELECT accounting_inventory.id FROM accounting_inventory
      WHERE accounting_inventory.merchant_id IN (
        SELECT merchants.id FROM merchants
        WHERE merchants.user_id = (SELECT auth.uid())
      )
    )
  );

-- accounting_invoices
DROP POLICY IF EXISTS "Merchants can manage own invoices" ON accounting_invoices;
CREATE POLICY "Merchants can manage own invoices"
  ON accounting_invoices
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

-- accounting_journal_entries
DROP POLICY IF EXISTS "Merchants can manage own journal entries" ON accounting_journal_entries;
CREATE POLICY "Merchants can manage own journal entries"
  ON accounting_journal_entries
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

-- accounting_journal_entry_lines
DROP POLICY IF EXISTS "Merchants can manage own journal entry lines" ON accounting_journal_entry_lines;
CREATE POLICY "Merchants can manage own journal entry lines"
  ON accounting_journal_entry_lines
  FOR ALL
  TO authenticated
  USING (
    journal_entry_id IN (
      SELECT accounting_journal_entries.id FROM accounting_journal_entries
      WHERE accounting_journal_entries.merchant_id IN (
        SELECT merchants.id FROM merchants
        WHERE merchants.user_id = (SELECT auth.uid())
      )
    )
  );

-- accounting_partner_1099_data
DROP POLICY IF EXISTS "Admins manage partner 1099 data" ON accounting_partner_1099_data;
CREATE POLICY "Admins manage partner 1099 data"
  ON accounting_partner_1099_data
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "View partner 1099 data" ON accounting_partner_1099_data;
CREATE POLICY "View partner 1099 data"
  ON accounting_partner_1099_data
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users
      WHERE accounting_accountant_users.user_id = (SELECT auth.uid())
      AND accounting_accountant_users.is_active = true
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- accounting_payments
DROP POLICY IF EXISTS "Merchants can manage own payments" ON accounting_payments;
CREATE POLICY "Merchants can manage own payments"
  ON accounting_payments
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

-- accounting_payroll
DROP POLICY IF EXISTS "Merchants can manage own payroll" ON accounting_payroll;
CREATE POLICY "Merchants can manage own payroll"
  ON accounting_payroll
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

-- accounting_reconciliations
DROP POLICY IF EXISTS "Merchants can manage own reconciliations" ON accounting_reconciliations;
CREATE POLICY "Merchants can manage own reconciliations"
  ON accounting_reconciliations
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

-- accounting_tax_categories
DROP POLICY IF EXISTS "Merchants can manage own tax categories" ON accounting_tax_categories;
CREATE POLICY "Merchants can manage own tax categories"
  ON accounting_tax_categories
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

-- accounting_tax_obligations
DROP POLICY IF EXISTS "Admins manage tax obligations" ON accounting_tax_obligations;
CREATE POLICY "Admins manage tax obligations"
  ON accounting_tax_obligations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "View tax obligations" ON accounting_tax_obligations;
CREATE POLICY "View tax obligations"
  ON accounting_tax_obligations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users
      WHERE accounting_accountant_users.user_id = (SELECT auth.uid())
      AND accounting_accountant_users.is_active = true
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- accounting_tax_payments
DROP POLICY IF EXISTS "Admins manage tax payments" ON accounting_tax_payments;
CREATE POLICY "Admins manage tax payments"
  ON accounting_tax_payments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "View tax payments" ON accounting_tax_payments;
CREATE POLICY "View tax payments"
  ON accounting_tax_payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users
      WHERE accounting_accountant_users.user_id = (SELECT auth.uid())
      AND accounting_accountant_users.is_active = true
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- accounting_tax_reports
DROP POLICY IF EXISTS "Merchants can manage own tax reports" ON accounting_tax_reports;
CREATE POLICY "Merchants can manage own tax reports"
  ON accounting_tax_reports
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

-- accounting_transactions
DROP POLICY IF EXISTS "Merchants can manage own transactions" ON accounting_transactions;
CREATE POLICY "Merchants can manage own transactions"
  ON accounting_transactions
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );