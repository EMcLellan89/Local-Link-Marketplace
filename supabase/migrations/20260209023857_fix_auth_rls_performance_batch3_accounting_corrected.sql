/*
  # Fix Auth RLS Performance - Batch 3: Accounting Tables (Corrected)

  This migration optimizes RLS policies on accounting and financial tables
  by wrapping auth function calls in SELECT statements for better performance.

  ## Tables Optimized:
  - accounting_transactions
  - invoices
  - invoice_items
  - bank_connections
  - affiliate_commissions

  ## Performance Impact:
  Auth functions will be evaluated once per query instead of per row.
*/

-- accounting_transactions
DROP POLICY IF EXISTS "Merchants can view own transactions" ON accounting_transactions;
DROP POLICY IF EXISTS "Merchants can insert own transactions" ON accounting_transactions;
DROP POLICY IF EXISTS "Merchants can manage own transactions" ON accounting_transactions;

CREATE POLICY "Merchants can view own transactions"
  ON accounting_transactions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM merchants WHERE id = merchant_id
  ));

CREATE POLICY "Merchants can manage own transactions"
  ON accounting_transactions FOR ALL
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM merchants WHERE id = merchant_id
  ))
  WITH CHECK ((select auth.uid()) IN (
    SELECT user_id FROM merchants WHERE id = merchant_id
  ));

-- invoices
DROP POLICY IF EXISTS "Merchants can view own invoices" ON invoices;
DROP POLICY IF EXISTS "Merchants can manage own invoices" ON invoices;

CREATE POLICY "Merchants can view own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM merchants WHERE id = merchant_id
  ));

CREATE POLICY "Merchants can manage own invoices"
  ON invoices FOR ALL
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM merchants WHERE id = merchant_id
  ))
  WITH CHECK ((select auth.uid()) IN (
    SELECT user_id FROM merchants WHERE id = merchant_id
  ));

-- invoice_items
DROP POLICY IF EXISTS "Merchants can view invoice items" ON invoice_items;
DROP POLICY IF EXISTS "Merchants can manage invoice items" ON invoice_items;

CREATE POLICY "Merchants can view invoice items"
  ON invoice_items FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT m.user_id FROM merchants m
    JOIN invoices i ON i.merchant_id = m.id
    WHERE i.id = invoice_id
  ));

CREATE POLICY "Merchants can manage invoice items"
  ON invoice_items FOR ALL
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT m.user_id FROM merchants m
    JOIN invoices i ON i.merchant_id = m.id
    WHERE i.id = invoice_id
  ))
  WITH CHECK ((select auth.uid()) IN (
    SELECT m.user_id FROM merchants m
    JOIN invoices i ON i.merchant_id = m.id
    WHERE i.id = invoice_id
  ));

-- bank_connections
DROP POLICY IF EXISTS "Merchants can view own bank connections" ON bank_connections;
DROP POLICY IF EXISTS "Merchants can manage own bank connections" ON bank_connections;

CREATE POLICY "Merchants can view own bank connections"
  ON bank_connections FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM merchants WHERE id = merchant_id
  ));

CREATE POLICY "Merchants can manage own bank connections"
  ON bank_connections FOR ALL
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM merchants WHERE id = merchant_id
  ))
  WITH CHECK ((select auth.uid()) IN (
    SELECT user_id FROM merchants WHERE id = merchant_id
  ));

-- affiliate_commissions
DROP POLICY IF EXISTS "Partners can view own commissions" ON affiliate_commissions;
DROP POLICY IF EXISTS "Affiliates can view own commissions" ON affiliate_commissions;

CREATE POLICY "Partners can view own commissions"
  ON affiliate_commissions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ));