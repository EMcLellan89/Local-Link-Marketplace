/*
  # Optimize Auth RLS Performance - Accounting Merchant Tables Only

  1. Performance Optimization
    - Wrap auth.uid() in SELECT subquery for merchant-owned accounting tables
    - Skip employee/tax tables that use different access patterns

  2. Security
    - Maintains existing security model
    - Improves query performance by caching auth.uid() result
*/

-- accounting_assets
DROP POLICY IF EXISTS "Merchants can manage own assets" ON accounting_assets;
CREATE POLICY "Merchants can manage own assets"
  ON accounting_assets
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
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
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- accounting_categories
DROP POLICY IF EXISTS "Merchants can view own categories" ON accounting_categories;
CREATE POLICY "Merchants can view own categories"
  ON accounting_categories
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    ) OR merchant_id IS NULL
  );

DROP POLICY IF EXISTS "Merchants can create own categories" ON accounting_categories;
CREATE POLICY "Merchants can create own categories"
  ON accounting_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can update own categories" ON accounting_categories;
CREATE POLICY "Merchants can update own categories"
  ON accounting_categories
  FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can delete own categories" ON accounting_categories;
CREATE POLICY "Merchants can delete own categories"
  ON accounting_categories
  FOR DELETE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- accounting_chart_of_accounts
DROP POLICY IF EXISTS "Merchants can manage own chart of accounts" ON accounting_chart_of_accounts;
CREATE POLICY "Merchants can manage own chart of accounts"
  ON accounting_chart_of_accounts
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
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
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
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
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
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
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
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
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
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
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
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
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
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
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
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
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
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
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
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
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- accounting_partner_1099_data already optimized in previous migration
-- accounting_inventory_transactions, journal_entry_lines are child tables, inherit optimization
