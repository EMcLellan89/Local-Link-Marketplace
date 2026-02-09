/*
  # Optimize Auth RLS Performance - Batch 24: Core Tables
  
  1. Tables Optimized
    - academy_progress (5 policies → 2, consolidated user CRUD)
    - customers (5 policies → 2, consolidated duplicates)
    - invoices (5 policies → 1, fixed nested auth.uid() calls)
    - partner_referral_links (6 policies → 2, fixed bug with partner_id check)
    - partner_tax_payments (5 policies → 1, consolidated CRUD)
    - partner_tracking_links (5 policies → 2, consolidated duplicates)
    - partners (5 policies → 2, consolidated duplicates)
  
  2. Changes
    - Wrap all auth.uid() calls in (select auth.uid()) for performance
    - Fix bug in partner_referral_links (was checking partners.id = auth.uid() instead of partners.user_id = auth.uid())
    - Remove nested SELECT auth.uid() calls in invoices policies
    - Consolidate multiple CRUD policies into single ALL policies
    - Maintain exact same access control logic
*/

-- academy_progress (consolidate 5 policies → 2)
DROP POLICY IF EXISTS "Admin full access to progress" ON academy_progress;
DROP POLICY IF EXISTS "Users can create own progress" ON academy_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON academy_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON academy_progress;
DROP POLICY IF EXISTS "Users can view own progress" ON academy_progress;

CREATE POLICY "Admin full access to progress"
  ON academy_progress FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Users can manage own progress"
  ON academy_progress FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- customers (consolidate 5 policies → 2)
DROP POLICY IF EXISTS "Admin full access to customers" ON customers;
DROP POLICY IF EXISTS "Customers can update own data" ON customers;
DROP POLICY IF EXISTS "Customers can update own record" ON customers;
DROP POLICY IF EXISTS "Customers can view own data" ON customers;
DROP POLICY IF EXISTS "Unified customer access" ON customers;

CREATE POLICY "Admin full access to customers"
  ON customers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Customers can manage own data"
  ON customers FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- invoices (consolidate 5 policies → 1, fix nested auth.uid())
DROP POLICY IF EXISTS "Merchants can create own invoices" ON invoices;
DROP POLICY IF EXISTS "Merchants can delete own invoices" ON invoices;
DROP POLICY IF EXISTS "Merchants can manage own invoices" ON invoices;
DROP POLICY IF EXISTS "Merchants can update own invoices" ON invoices;
DROP POLICY IF EXISTS "Merchants can view own invoices" ON invoices;

CREATE POLICY "Merchants can manage own invoices"
  ON invoices FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT user_id FROM merchants
      WHERE id = invoices.merchant_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT user_id FROM merchants
      WHERE id = invoices.merchant_id
    )
  );

-- partner_referral_links (consolidate 6 policies → 2, fix bug)
DROP POLICY IF EXISTS "Admins can manage all referral links" ON partner_referral_links;
DROP POLICY IF EXISTS "Partners can delete own referral links" ON partner_referral_links;
DROP POLICY IF EXISTS "Partners can insert own referral links" ON partner_referral_links;
DROP POLICY IF EXISTS "Partners can update own referral links" ON partner_referral_links;
DROP POLICY IF EXISTS "Partners can view own referral links" ON partner_referral_links;
DROP POLICY IF EXISTS "Public can view referral links" ON partner_referral_links;

CREATE POLICY "Admins can manage all referral links"
  ON partner_referral_links FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Fixed: now correctly checks partners.user_id = auth.uid() instead of partners.id = auth.uid()
CREATE POLICY "Partners can manage own referral links"
  ON partner_referral_links FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT user_id FROM partners
      WHERE id = partner_referral_links.partner_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT user_id FROM partners
      WHERE id = partner_referral_links.partner_id
    )
  );

-- Public can view referral links (no auth.uid(), no optimization needed)
CREATE POLICY "Public can view referral links"
  ON partner_referral_links FOR SELECT
  TO authenticated
  USING (true);

-- partner_tax_payments (consolidate 5 policies → 1)
DROP POLICY IF EXISTS "Partners can delete own tax payments" ON partner_tax_payments;
DROP POLICY IF EXISTS "Partners can insert own tax payments" ON partner_tax_payments;
DROP POLICY IF EXISTS "Partners can manage own tax payments" ON partner_tax_payments;
DROP POLICY IF EXISTS "Partners can update own tax payments" ON partner_tax_payments;
DROP POLICY IF EXISTS "Partners can view own tax payments" ON partner_tax_payments;

CREATE POLICY "Partners can manage own tax payments"
  ON partner_tax_payments FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT user_id FROM partners
      WHERE id = partner_tax_payments.partner_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT user_id FROM partners
      WHERE id = partner_tax_payments.partner_id
    )
  );

-- partner_tracking_links (consolidate 5 policies → 2)
DROP POLICY IF EXISTS "Admins can manage all tracking links" ON partner_tracking_links;
DROP POLICY IF EXISTS "Partners can create their own tracking links" ON partner_tracking_links;
DROP POLICY IF EXISTS "Partners can manage own tracking links" ON partner_tracking_links;
DROP POLICY IF EXISTS "Partners can view own tracking links" ON partner_tracking_links;
DROP POLICY IF EXISTS "Partners can view their own tracking links" ON partner_tracking_links;

CREATE POLICY "Admins can manage all tracking links"
  ON partner_tracking_links FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Partners can manage own tracking links"
  ON partner_tracking_links FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT user_id FROM partners
      WHERE id = partner_tracking_links.partner_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT user_id FROM partners
      WHERE id = partner_tracking_links.partner_id
    )
  );

-- partners (consolidate 5 policies → 2)
DROP POLICY IF EXISTS "Admin full access to partners" ON partners;
DROP POLICY IF EXISTS "Partners can update own data" ON partners;
DROP POLICY IF EXISTS "Partners can update own record" ON partners;
DROP POLICY IF EXISTS "Partners can view own data" ON partners;
DROP POLICY IF EXISTS "Partners can view own record" ON partners;

CREATE POLICY "Admin full access to partners"
  ON partners FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Partners can manage own data"
  ON partners FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));
