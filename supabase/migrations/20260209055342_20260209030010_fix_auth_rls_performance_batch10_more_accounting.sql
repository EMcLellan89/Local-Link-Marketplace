/*
  # Fix Auth RLS Performance - Batch 10: More Accounting Tables

  1. Performance Optimization
    - Optimizes Auth RLS policies on additional accounting tables
    - Wraps auth.uid() in subquery to prevent re-evaluation
    - Improves query performance by evaluating auth once per query

  2. Tables Modified
    - accounting_journal_entry_lines (2 policies)
    - accounting_partner_1099_data (3 policies)
    - accounting_payments (2 policies)
    - accounting_payroll (2 policies)
    - accounting_reconciliations (2 policies)
    - accounting_tax_categories (2 policies)
    - accounting_tax_obligations (2 policies)
    - accounting_tax_payments (3 policies)
    - accounting_tax_reports (2 policies)

  3. Security
    - Maintains existing access control logic
    - No changes to authorization rules
    - Only optimizes performance of existing policies
*/

-- accounting_journal_entry_lines policies
DROP POLICY IF EXISTS "Merchants can manage own journal entry lines" ON accounting_journal_entry_lines;
CREATE POLICY "Merchants can manage own journal entry lines"
  ON accounting_journal_entry_lines FOR ALL
  TO authenticated
  USING (
    journal_entry_id IN (
      SELECT accounting_journal_entries.id
      FROM accounting_journal_entries
      WHERE accounting_journal_entries.merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    )
  );

DROP POLICY IF EXISTS "Merchants can view own journal entry lines" ON accounting_journal_entry_lines;
CREATE POLICY "Merchants can view own journal entry lines"
  ON accounting_journal_entry_lines FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM accounting_journal_entries je
      JOIN merchants m ON m.id = je.merchant_id
      WHERE je.id = accounting_journal_entry_lines.journal_entry_id
        AND m.user_id = (select auth.uid())
    )
  );

-- accounting_partner_1099_data policies
DROP POLICY IF EXISTS "Admins manage partner 1099 data" ON accounting_partner_1099_data;
CREATE POLICY "Admins manage partner 1099 data"
  ON accounting_partner_1099_data FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

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

DROP POLICY IF EXISTS "View partner 1099 data" ON accounting_partner_1099_data;
CREATE POLICY "View partner 1099 data"
  ON accounting_partner_1099_data FOR SELECT
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

-- accounting_payments policies
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
  );

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

-- accounting_payroll policies
DROP POLICY IF EXISTS "Merchants can manage own payroll" ON accounting_payroll;
CREATE POLICY "Merchants can manage own payroll"
  ON accounting_payroll FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

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
  );

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

-- accounting_tax_categories policies
DROP POLICY IF EXISTS "Merchants can manage own tax categories" ON accounting_tax_categories;
CREATE POLICY "Merchants can manage own tax categories"
  ON accounting_tax_categories FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can view tax categories" ON accounting_tax_categories;
CREATE POLICY "Merchants can view tax categories"
  ON accounting_tax_categories FOR SELECT
  TO authenticated
  USING (
    merchant_id IS NULL
    OR EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = accounting_tax_categories.merchant_id
        AND m.user_id = (select auth.uid())
    )
  );

-- accounting_tax_obligations policies
DROP POLICY IF EXISTS "Admins manage tax obligations" ON accounting_tax_obligations;
CREATE POLICY "Admins manage tax obligations"
  ON accounting_tax_obligations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "View tax obligations" ON accounting_tax_obligations;
CREATE POLICY "View tax obligations"
  ON accounting_tax_obligations FOR SELECT
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

-- accounting_tax_payments policies
DROP POLICY IF EXISTS "Admins manage tax payments" ON accounting_tax_payments;
CREATE POLICY "Admins manage tax payments"
  ON accounting_tax_payments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Partners can view own tax payments" ON accounting_tax_payments;
CREATE POLICY "Partners can view own tax payments"
  ON accounting_tax_payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners p
      WHERE p.id = (
        SELECT accounting_partner_1099_data.partner_id
        FROM accounting_partner_1099_data
        WHERE accounting_partner_1099_data.id = accounting_tax_payments.obligation_id
      )
      AND p.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "View tax payments" ON accounting_tax_payments;
CREATE POLICY "View tax payments"
  ON accounting_tax_payments FOR SELECT
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

-- accounting_tax_reports policies
DROP POLICY IF EXISTS "Merchants can manage own tax reports" ON accounting_tax_reports;
CREATE POLICY "Merchants can manage own tax reports"
  ON accounting_tax_reports FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

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