/*
  # Consolidate Multiple Permissive Policies - Batch 2
  
  1. Security Improvement
    - Continue consolidating multiple permissive policies
  
  2. Affected Tables
    - certificates_issued: Merge 2 SELECT policies
    - certifications: Merge 2 SELECT policies (admin + partner)
    - commission_rules: Merge 2 SELECT policies (admin + public)
    - commissions: Merge 2 SELECT policies (admin + partner)
    - customer_accounts: Merge 2 SELECT policies (admin + partners)
    - deal_locations: Merge 2 SELECT policies
    - ecommerce_orders: Merge 2 SELECT policies
*/

-- certificates_issued: Consolidate SELECT policies
DROP POLICY IF EXISTS "Public can verify certificates by code" ON certificates_issued;
DROP POLICY IF EXISTS "Users can view own certificates" ON certificates_issued;
CREATE POLICY "Users can view certificates"
  ON certificates_issued
  FOR SELECT
  TO authenticated
  USING (
    -- Users can view their own certificates
    user_id = (select auth.uid())
    OR
    -- Public can verify any certificate (read-only verification)
    true
  );

-- certifications: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can manage certifications" ON certifications;
DROP POLICY IF EXISTS "Partners can view own certification" ON certifications;
CREATE POLICY "Users can view certifications"
  ON certifications
  FOR SELECT
  TO authenticated
  USING (
    -- Admins can view all
    (select auth.jwt() ->> 'role') = 'admin'
    OR
    -- Partners can view their own
    partner_id IN (
      SELECT partners.id FROM partners
      WHERE partners.user_id = (select auth.uid())
    )
  );

-- Keep admin's ALL policy separate
CREATE POLICY "Admins can manage certifications"
  ON certifications
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((select auth.jwt() ->> 'role') = 'admin');

-- commission_rules: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admin can manage commission rules" ON commission_rules;
DROP POLICY IF EXISTS "Anyone can view commission rules" ON commission_rules;
CREATE POLICY "Users can view commission rules"
  ON commission_rules
  FOR SELECT
  TO authenticated
  USING (true); -- Anyone authenticated can view

CREATE POLICY "Admin can manage commission rules"
  ON commission_rules
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((select auth.jwt() ->> 'role') = 'admin');

-- commissions: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admin can manage commissions" ON commissions;
DROP POLICY IF EXISTS "Partners can view own commissions" ON commissions;
CREATE POLICY "Users can view commissions"
  ON commissions
  FOR SELECT
  TO authenticated
  USING (
    -- Admins can view all
    (select auth.jwt() ->> 'role') = 'admin'
    OR
    -- Partners can view their own
    partner_id IN (
      SELECT partners.id FROM partners
      WHERE partners.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admin can manage commissions"
  ON commissions
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((select auth.jwt() ->> 'role') = 'admin');

-- customer_accounts: Consolidate SELECT policies
DROP POLICY IF EXISTS "Admin can manage customer accounts" ON customer_accounts;
DROP POLICY IF EXISTS "Partners can view their customers" ON customer_accounts;
CREATE POLICY "Users can view customer accounts"
  ON customer_accounts
  FOR SELECT
  TO authenticated
  USING (
    -- Admins can view all
    (select auth.jwt() ->> 'role') = 'admin'
    OR
    -- Partners can view their linked customers
    EXISTS (
      SELECT 1 FROM partner_customer_links pcl
      JOIN partners p ON p.id = pcl.partner_id
      WHERE pcl.customer_account_id = customer_accounts.id
        AND p.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Admin can manage customer accounts"
  ON customer_accounts
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((select auth.jwt() ->> 'role') = 'admin');

-- deal_locations: Consolidate SELECT policies
DROP POLICY IF EXISTS "Anyone can view deal locations" ON deal_locations;
DROP POLICY IF EXISTS "Merchants can manage locations for their deals" ON deal_locations;
CREATE POLICY "Users can view deal locations"
  ON deal_locations
  FOR SELECT
  TO authenticated
  USING (true); -- Anyone authenticated can view

CREATE POLICY "Merchants can manage deal locations"
  ON deal_locations
  FOR ALL
  TO authenticated
  USING (
    deal_id IN (
      SELECT deals.id FROM deals
      WHERE deals.merchant_id IN (
        SELECT merchants.id FROM merchants
        WHERE merchants.user_id = (select auth.uid())
      )
    )
  );

-- ecommerce_orders: Consolidate SELECT policies
DROP POLICY IF EXISTS "Customers view their orders" ON ecommerce_orders;
DROP POLICY IF EXISTS "Merchants view their orders" ON ecommerce_orders;
CREATE POLICY "Users can view ecommerce orders"
  ON ecommerce_orders
  FOR SELECT
  TO authenticated
  USING (
    -- Customers view their orders
    customer_id IN (
      SELECT customers.id FROM customers
      WHERE customers.user_id = (select auth.uid())
    )
    OR
    -- Merchants view their orders
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );
