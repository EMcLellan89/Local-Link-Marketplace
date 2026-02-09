/*
  # Fix Critical Security Issues - Part 3: Optimize RLS Policies (Accounting System)
  
  1. Updates all accounting table RLS policies to use (select auth.uid()) pattern
     for better performance at scale
  2. Affects tables:
     - accounting_chart_of_accounts
     - accounting_fiscal_periods
     - accounting_journal_entries
     - accounting_journal_entry_lines
     - accounting_transactions
     - accounting_tax_categories
     - accounting_invoices
     - accounting_bills
     - accounting_payments
     - accounting_assets
     - accounting_inventory
     - accounting_inventory_transactions
     - accounting_payroll
     - accounting_reconciliations
     - accounting_tax_reports
*/

-- accounting_chart_of_accounts
DROP POLICY IF EXISTS "Merchants can manage own chart of accounts" ON accounting_chart_of_accounts;
DROP POLICY IF EXISTS "Merchants can view own chart of accounts" ON accounting_chart_of_accounts;

CREATE POLICY "Merchants can manage own chart of accounts" 
  ON accounting_chart_of_accounts FOR ALL 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view own chart of accounts" 
  ON accounting_chart_of_accounts FOR SELECT 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- accounting_fiscal_periods
DROP POLICY IF EXISTS "Merchants can manage own fiscal periods" ON accounting_fiscal_periods;
DROP POLICY IF EXISTS "Merchants can view own fiscal periods" ON accounting_fiscal_periods;

CREATE POLICY "Merchants can manage own fiscal periods" 
  ON accounting_fiscal_periods FOR ALL 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view own fiscal periods" 
  ON accounting_fiscal_periods FOR SELECT 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- accounting_journal_entries
DROP POLICY IF EXISTS "Merchants can manage own journal entries" ON accounting_journal_entries;
DROP POLICY IF EXISTS "Merchants can view own journal entries" ON accounting_journal_entries;

CREATE POLICY "Merchants can manage own journal entries" 
  ON accounting_journal_entries FOR ALL 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view own journal entries" 
  ON accounting_journal_entries FOR SELECT 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- accounting_journal_entry_lines
DROP POLICY IF EXISTS "Merchants can manage own journal entry lines" ON accounting_journal_entry_lines;
DROP POLICY IF EXISTS "Merchants can view own journal entry lines" ON accounting_journal_entry_lines;

CREATE POLICY "Merchants can manage own journal entry lines" 
  ON accounting_journal_entry_lines FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM accounting_journal_entries 
      WHERE accounting_journal_entries.id = journal_entry_id 
      AND accounting_journal_entries.merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM accounting_journal_entries 
      WHERE accounting_journal_entries.id = journal_entry_id 
      AND accounting_journal_entries.merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    )
  );

CREATE POLICY "Merchants can view own journal entry lines" 
  ON accounting_journal_entry_lines FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM accounting_journal_entries 
      WHERE accounting_journal_entries.id = journal_entry_id 
      AND accounting_journal_entries.merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    )
  );

-- accounting_transactions
DROP POLICY IF EXISTS "Merchants can manage own transactions" ON accounting_transactions;
DROP POLICY IF EXISTS "Merchants can view own transactions" ON accounting_transactions;

CREATE POLICY "Merchants can manage own transactions" 
  ON accounting_transactions FOR ALL 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view own transactions" 
  ON accounting_transactions FOR SELECT 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- accounting_tax_categories
DROP POLICY IF EXISTS "Merchants can manage own tax categories" ON accounting_tax_categories;
DROP POLICY IF EXISTS "Merchants can view own tax categories" ON accounting_tax_categories;

CREATE POLICY "Merchants can manage own tax categories" 
  ON accounting_tax_categories FOR ALL 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view own tax categories" 
  ON accounting_tax_categories FOR SELECT 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- accounting_invoices
DROP POLICY IF EXISTS "Merchants can manage own invoices" ON accounting_invoices;
DROP POLICY IF EXISTS "Merchants can view own invoices" ON accounting_invoices;

CREATE POLICY "Merchants can manage own invoices" 
  ON accounting_invoices FOR ALL 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view own invoices" 
  ON accounting_invoices FOR SELECT 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- accounting_bills
DROP POLICY IF EXISTS "Merchants can manage own bills" ON accounting_bills;
DROP POLICY IF EXISTS "Merchants can view own bills" ON accounting_bills;

CREATE POLICY "Merchants can manage own bills" 
  ON accounting_bills FOR ALL 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view own bills" 
  ON accounting_bills FOR SELECT 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- accounting_payments
DROP POLICY IF EXISTS "Merchants can manage own payments" ON accounting_payments;
DROP POLICY IF EXISTS "Merchants can view own payments" ON accounting_payments;

CREATE POLICY "Merchants can manage own payments" 
  ON accounting_payments FOR ALL 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view own payments" 
  ON accounting_payments FOR SELECT 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- accounting_assets
DROP POLICY IF EXISTS "Merchants can manage own assets" ON accounting_assets;
DROP POLICY IF EXISTS "Merchants can view own assets" ON accounting_assets;

CREATE POLICY "Merchants can manage own assets" 
  ON accounting_assets FOR ALL 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view own assets" 
  ON accounting_assets FOR SELECT 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- accounting_inventory
DROP POLICY IF EXISTS "Merchants can manage own inventory" ON accounting_inventory;
DROP POLICY IF EXISTS "Merchants can view own inventory" ON accounting_inventory;

CREATE POLICY "Merchants can manage own inventory" 
  ON accounting_inventory FOR ALL 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view own inventory" 
  ON accounting_inventory FOR SELECT 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- accounting_inventory_transactions
DROP POLICY IF EXISTS "Merchants can manage own inventory transactions" ON accounting_inventory_transactions;
DROP POLICY IF EXISTS "Merchants can view own inventory transactions" ON accounting_inventory_transactions;

CREATE POLICY "Merchants can manage own inventory transactions" 
  ON accounting_inventory_transactions FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM accounting_inventory 
      WHERE accounting_inventory.id = inventory_id 
      AND accounting_inventory.merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM accounting_inventory 
      WHERE accounting_inventory.id = inventory_id 
      AND accounting_inventory.merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    )
  );

CREATE POLICY "Merchants can view own inventory transactions" 
  ON accounting_inventory_transactions FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM accounting_inventory 
      WHERE accounting_inventory.id = inventory_id 
      AND accounting_inventory.merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    )
  );

-- accounting_payroll
DROP POLICY IF EXISTS "Merchants can manage own payroll" ON accounting_payroll;
DROP POLICY IF EXISTS "Merchants can view own payroll" ON accounting_payroll;

CREATE POLICY "Merchants can manage own payroll" 
  ON accounting_payroll FOR ALL 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view own payroll" 
  ON accounting_payroll FOR SELECT 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- accounting_reconciliations
DROP POLICY IF EXISTS "Merchants can manage own reconciliations" ON accounting_reconciliations;
DROP POLICY IF EXISTS "Merchants can view own reconciliations" ON accounting_reconciliations;

CREATE POLICY "Merchants can manage own reconciliations" 
  ON accounting_reconciliations FOR ALL 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view own reconciliations" 
  ON accounting_reconciliations FOR SELECT 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- accounting_tax_reports
DROP POLICY IF EXISTS "Merchants can manage own tax reports" ON accounting_tax_reports;
DROP POLICY IF EXISTS "Merchants can view own tax reports" ON accounting_tax_reports;

CREATE POLICY "Merchants can manage own tax reports" 
  ON accounting_tax_reports FOR ALL 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view own tax reports" 
  ON accounting_tax_reports FOR SELECT 
  TO authenticated 
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );
