/*
  # Fix Auth RLS Performance - Partner Tax Payments
  
  1. Performance
    - Replace direct auth.uid() calls with (select auth.uid()) in RLS policies
  
  2. Tables Updated
    - partner_tax_payments
*/

DROP POLICY IF EXISTS "Partners can delete own tax payments" ON partner_tax_payments;
DROP POLICY IF EXISTS "Partners can insert own tax payments" ON partner_tax_payments;
DROP POLICY IF EXISTS "Partners can update own tax payments" ON partner_tax_payments;
DROP POLICY IF EXISTS "Partners can view own tax payments" ON partner_tax_payments;

CREATE POLICY "Partners can view own tax payments" ON partner_tax_payments
  FOR SELECT TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Partners can insert own tax payments" ON partner_tax_payments
  FOR INSERT TO authenticated
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Partners can update own tax payments" ON partner_tax_payments
  FOR UPDATE TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Partners can delete own tax payments" ON partner_tax_payments
  FOR DELETE TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );
