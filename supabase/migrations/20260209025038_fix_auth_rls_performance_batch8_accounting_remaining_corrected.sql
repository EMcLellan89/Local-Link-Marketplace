/*
  # Fix Auth RLS Performance - Batch 8: Remaining Accounting Tables (Corrected)

  1. Purpose
    - Optimize remaining accounting system RLS policies
    - Wrap auth.uid() in subquery for performance
  
  2. Tables Affected
    - accounting_employee_payroll
    - accounting_inventory_transactions
    - accounting_journal_entry_lines
    - accounting_partner_1099_data
    - accounting_payments
    - accounting_payroll
    - accounting_reconciliations
    - accounting_tax_categories
    - accounting_tax_payments (no merchant_id, uses obligation_id)
    - accounting_tax_reports
  
  3. Note
    - Skipped accounting_tax_obligations (has state_tax_id, not merchant_id)
  
  3. Performance Impact
    - Completes accounting system RLS optimization
*/

-- accounting_employee_payroll policies
DROP POLICY IF EXISTS "Admins can manage payroll" ON accounting_employee_payroll;
CREATE POLICY "Admins can manage payroll"
  ON accounting_employee_payroll FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_employees e
      JOIN team_members tm ON tm.id = e.team_member_id
      WHERE e.id = accounting_employee_payroll.employee_id
        AND tm.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM accounting_employees e
      JOIN team_members tm ON tm.id = e.team_member_id
      WHERE e.id = accounting_employee_payroll.employee_id
        AND tm.user_id = (select auth.uid())
    )
  );

-- accounting_inventory_transactions policies
DROP POLICY IF EXISTS "Merchants can view own inventory transactions" ON accounting_inventory_transactions;
CREATE POLICY "Merchants can view own inventory transactions"
  ON accounting_inventory_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_inventory inv
      JOIN merchants m ON m.id = inv.merchant_id
      WHERE inv.id = accounting_inventory_transactions.inventory_id
        AND m.user_id = (select auth.uid())
    )
  );

-- accounting_journal_entry_lines policies
DROP POLICY IF EXISTS "Merchants can view own journal entry lines" ON accounting_journal_entry_lines;
CREATE POLICY "Merchants can view own journal entry lines"
  ON accounting_journal_entry_lines FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_journal_entries je
      JOIN merchants m ON m.id = je.merchant_id
      WHERE je.id = accounting_journal_entry_lines.journal_entry_id
        AND m.user_id = (select auth.uid())
    )
  );

-- accounting_partner_1099_data policies
DROP POLICY IF EXISTS "Partners can view own 1099 data" ON accounting_partner_1099_data;
CREATE POLICY "Partners can view own 1099 data"
  ON accounting_partner_1099_data FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners p
      WHERE p.id = accounting_partner_1099_data.partner_id
        AND p.user_id = (select auth.uid())
    )
  );

-- accounting_payments policies
DROP POLICY IF EXISTS "Merchants can view own payments" ON accounting_payments;
CREATE POLICY "Merchants can view own payments"
  ON accounting_payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_payments.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can manage own payments" ON accounting_payments;
CREATE POLICY "Merchants can manage own payments"
  ON accounting_payments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_payments.merchant_id
        AND m.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_payments.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

-- accounting_payroll policies
DROP POLICY IF EXISTS "Merchants can view own payroll" ON accounting_payroll;
CREATE POLICY "Merchants can view own payroll"
  ON accounting_payroll FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_payroll.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

-- accounting_reconciliations policies
DROP POLICY IF EXISTS "Merchants can view own reconciliations" ON accounting_reconciliations;
CREATE POLICY "Merchants can view own reconciliations"
  ON accounting_reconciliations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_reconciliations.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can manage own reconciliations" ON accounting_reconciliations;
CREATE POLICY "Merchants can manage own reconciliations"
  ON accounting_reconciliations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_reconciliations.merchant_id
        AND m.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_reconciliations.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

-- accounting_tax_categories policies
DROP POLICY IF EXISTS "Merchants can view tax categories" ON accounting_tax_categories;
CREATE POLICY "Merchants can view tax categories"
  ON accounting_tax_categories FOR SELECT
  TO authenticated
  USING (
    merchant_id IS NULL OR
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_tax_categories.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

-- accounting_tax_payments policies (uses obligation_id, not merchant_id)
DROP POLICY IF EXISTS "Partners can view own tax payments" ON accounting_tax_payments;
CREATE POLICY "Partners can view own tax payments"
  ON accounting_tax_payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners p
      WHERE p.id = (
        SELECT partner_id FROM accounting_partner_1099_data 
        WHERE id = accounting_tax_payments.obligation_id
      )
      AND p.user_id = (select auth.uid())
    )
  );

-- accounting_tax_reports policies
DROP POLICY IF EXISTS "Merchants can view own tax reports" ON accounting_tax_reports;
CREATE POLICY "Merchants can view own tax reports"
  ON accounting_tax_reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_tax_reports.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );
