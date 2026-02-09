/*
  # Optimize RLS Auth Initialization - Accounting Tables

  Fixes Auth RLS Initialization Plan issues by ensuring auth function calls
  use lowercase 'select' and proper formatting to prevent row-by-row re-evaluation.

  Pattern: Change `( SELECT auth.uid() AS uid)` to `(select auth.uid())`
  
  Tables optimized:
  - accounting_assets
  - accounting_bills  
  - accounting_categories
  - accounting_chart_of_accounts
  - accounting_fiscal_periods
  - accounting_inventory
  - accounting_inventory_transactions
  - accounting_invoices
  - accounting_journal_entries
  - accounting_journal_entry_lines
  - accounting_payments
  - accounting_payroll
  - accounting_reconciliations
  - accounting_tax_categories
  - accounting_tax_reports
  - accounting_transactions
*/

-- accounting_assets
DROP POLICY IF EXISTS "Merchants can manage own assets" ON public.accounting_assets;
CREATE POLICY "Merchants can manage own assets"
  ON public.accounting_assets
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- accounting_bills
DROP POLICY IF EXISTS "Merchants can manage own bills" ON public.accounting_bills;
CREATE POLICY "Merchants can manage own bills"
  ON public.accounting_bills
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- accounting_categories
DROP POLICY IF EXISTS "Merchants can update own categories" ON public.accounting_categories;
CREATE POLICY "Merchants can update own categories"
  ON public.accounting_categories
  FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- accounting_chart_of_accounts
DROP POLICY IF EXISTS "Merchants can manage own chart of accounts" ON public.accounting_chart_of_accounts;
CREATE POLICY "Merchants can manage own chart of accounts"
  ON public.accounting_chart_of_accounts
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- accounting_fiscal_periods
DROP POLICY IF EXISTS "Merchants can manage own fiscal periods" ON public.accounting_fiscal_periods;
CREATE POLICY "Merchants can manage own fiscal periods"
  ON public.accounting_fiscal_periods
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- accounting_inventory
DROP POLICY IF EXISTS "Merchants can manage own inventory" ON public.accounting_inventory;
CREATE POLICY "Merchants can manage own inventory"
  ON public.accounting_inventory
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- accounting_inventory_transactions
DROP POLICY IF EXISTS "Merchants can manage own inventory transactions" ON public.accounting_inventory_transactions;
CREATE POLICY "Merchants can manage own inventory transactions"
  ON public.accounting_inventory_transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM accounting_inventory
      WHERE accounting_inventory.id = accounting_inventory_transactions.inventory_id
        AND accounting_inventory.merchant_id IN (
          SELECT merchants.id
          FROM merchants
          WHERE merchants.user_id = (select auth.uid())
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM accounting_inventory
      WHERE accounting_inventory.id = accounting_inventory_transactions.inventory_id
        AND accounting_inventory.merchant_id IN (
          SELECT merchants.id
          FROM merchants
          WHERE merchants.user_id = (select auth.uid())
        )
    )
  );

-- accounting_invoices
DROP POLICY IF EXISTS "Merchants can manage own invoices" ON public.accounting_invoices;
CREATE POLICY "Merchants can manage own invoices"
  ON public.accounting_invoices
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- accounting_journal_entries
DROP POLICY IF EXISTS "Merchants can manage own journal entries" ON public.accounting_journal_entries;
CREATE POLICY "Merchants can manage own journal entries"
  ON public.accounting_journal_entries
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- accounting_journal_entry_lines
DROP POLICY IF EXISTS "Merchants can manage own journal entry lines" ON public.accounting_journal_entry_lines;
CREATE POLICY "Merchants can manage own journal entry lines"
  ON public.accounting_journal_entry_lines
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM accounting_journal_entries
      WHERE accounting_journal_entries.id = accounting_journal_entry_lines.journal_entry_id
        AND accounting_journal_entries.merchant_id IN (
          SELECT merchants.id
          FROM merchants
          WHERE merchants.user_id = (select auth.uid())
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM accounting_journal_entries
      WHERE accounting_journal_entries.id = accounting_journal_entry_lines.journal_entry_id
        AND accounting_journal_entries.merchant_id IN (
          SELECT merchants.id
          FROM merchants
          WHERE merchants.user_id = (select auth.uid())
        )
    )
  );

-- accounting_payments
DROP POLICY IF EXISTS "Merchants can manage own payments" ON public.accounting_payments;
CREATE POLICY "Merchants can manage own payments"
  ON public.accounting_payments
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- accounting_payroll
DROP POLICY IF EXISTS "Merchants can manage own payroll" ON public.accounting_payroll;
CREATE POLICY "Merchants can manage own payroll"
  ON public.accounting_payroll
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- accounting_reconciliations
DROP POLICY IF EXISTS "Merchants can manage own reconciliations" ON public.accounting_reconciliations;
CREATE POLICY "Merchants can manage own reconciliations"
  ON public.accounting_reconciliations
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- accounting_tax_categories
DROP POLICY IF EXISTS "Merchants can manage own tax categories" ON public.accounting_tax_categories;
CREATE POLICY "Merchants can manage own tax categories"
  ON public.accounting_tax_categories
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- accounting_tax_reports
DROP POLICY IF EXISTS "Merchants can manage own tax reports" ON public.accounting_tax_reports;
CREATE POLICY "Merchants can manage own tax reports"
  ON public.accounting_tax_reports
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- accounting_transactions
DROP POLICY IF EXISTS "Merchants can manage own transactions" ON public.accounting_transactions;
CREATE POLICY "Merchants can manage own transactions"
  ON public.accounting_transactions
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );
