/*
  # Fix Auth RLS Performance - Batch 19: Accounting Tables (Remaining)

  1. Changes
    - Optimize Auth RLS policies by wrapping auth.uid() in subqueries
    - Prevents re-evaluation of auth.uid() for each row
    - Maintains exact same access control logic
    
  2. Tables Covered
    - accounting_assets (2 policies - consolidate)
    - accounting_bills (2 policies - consolidate)
    - accounting_invoices (2 policies - consolidate)
*/

-- accounting_assets (consolidate 2 policies)
DROP POLICY IF EXISTS "Merchants can manage own assets" ON accounting_assets;
DROP POLICY IF EXISTS "Merchants can view own assets" ON accounting_assets;
CREATE POLICY "Merchants can manage own assets"
  ON accounting_assets FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- accounting_bills (consolidate 2 policies)
DROP POLICY IF EXISTS "Merchants can manage own bills" ON accounting_bills;
DROP POLICY IF EXISTS "Merchants can view own bills" ON accounting_bills;
CREATE POLICY "Merchants can manage own bills"
  ON accounting_bills FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- accounting_invoices (consolidate 2 policies)
DROP POLICY IF EXISTS "Merchants can manage own invoices" ON accounting_invoices;
DROP POLICY IF EXISTS "Merchants can view own invoices" ON accounting_invoices;
CREATE POLICY "Merchants can manage own invoices"
  ON accounting_invoices FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );