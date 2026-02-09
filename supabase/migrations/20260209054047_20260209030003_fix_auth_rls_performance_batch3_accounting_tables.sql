/*
  # Optimize Auth RLS Performance - Batch 3 (Accounting Tables)

  1. Changes
    - Wraps all auth.uid() calls in subqueries for accounting tables
    - Applies to: accounting_assets, accounting_bills, accounting_invoices, accounting_transactions

  2. Performance Impact
    - Improves financial data queries significantly
    - Reduces overhead for merchant accounting lookups
    - Optimizes transaction history queries

  3. Security Notes
    - Maintains merchant-specific access control
    - No functional security changes
*/

-- Accounting assets
DROP POLICY IF EXISTS "Merchants can view own assets" ON accounting_assets;
CREATE POLICY "Merchants can view own assets"
  ON accounting_assets FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- Accounting bills
DROP POLICY IF EXISTS "Merchants can view own bills" ON accounting_bills;
CREATE POLICY "Merchants can view own bills"
  ON accounting_bills FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can manage own bills" ON accounting_bills;
CREATE POLICY "Merchants can manage own bills"
  ON accounting_bills FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- Accounting invoices
DROP POLICY IF EXISTS "Merchants can view own invoices" ON accounting_invoices;
CREATE POLICY "Merchants can view own invoices"
  ON accounting_invoices FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can manage own invoices" ON accounting_invoices;
CREATE POLICY "Merchants can manage own invoices"
  ON accounting_invoices FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- Accounting transactions
DROP POLICY IF EXISTS "Merchants can view own transactions" ON accounting_transactions;
CREATE POLICY "Merchants can view own transactions"
  ON accounting_transactions FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can manage own transactions" ON accounting_transactions;
CREATE POLICY "Merchants can manage own transactions"
  ON accounting_transactions FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );
