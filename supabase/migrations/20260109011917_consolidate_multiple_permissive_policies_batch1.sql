/*
  # Consolidate Multiple Permissive Policies - Batch 1
  
  1. Changes
    - Consolidate multiple SELECT/INSERT/UPDATE policies into single policies per action
    - Improves query planning and performance
    - Affects: certifications, commission_rules, commissions, customer_accounts, deal_locations
    
  2. Tables Updated
    - certifications: Merge 2 SELECT policies
    - commission_rules: Merge 2 SELECT policies
    - commissions: Merge 2 SELECT policies
    - customer_accounts: Merge 2 SELECT policies
    - deal_locations: Merge 2 SELECT policies
*/

-- certifications - Consolidate SELECT policies
DROP POLICY IF EXISTS "Admins can manage certifications" ON public.certifications;
DROP POLICY IF EXISTS "Users can view certifications" ON public.certifications;

CREATE POLICY "Users can view certifications" ON public.certifications
  FOR SELECT TO authenticated
  USING (
    ((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text 
    OR partner_id IN (
      SELECT partners.id FROM partners 
      WHERE partners.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Admins can manage certifications" ON public.certifications
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text)
  WITH CHECK (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- commission_rules - Consolidate SELECT policies
DROP POLICY IF EXISTS "Admin can manage commission rules" ON public.commission_rules;
DROP POLICY IF EXISTS "Users can view commission rules" ON public.commission_rules;

CREATE POLICY "Users can view commission rules" ON public.commission_rules
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage commission rules" ON public.commission_rules
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text)
  WITH CHECK (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- commissions - Consolidate SELECT policies
DROP POLICY IF EXISTS "Admin can manage commissions" ON public.commissions;
DROP POLICY IF EXISTS "Users can view commissions" ON public.commissions;

CREATE POLICY "Users can view commissions" ON public.commissions
  FOR SELECT TO authenticated
  USING (
    ((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text 
    OR partner_id IN (
      SELECT partners.id FROM partners 
      WHERE partners.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Admins can manage commissions" ON public.commissions
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text)
  WITH CHECK (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- customer_accounts - Consolidate SELECT policies
DROP POLICY IF EXISTS "Admin can manage customer accounts" ON public.customer_accounts;
DROP POLICY IF EXISTS "Users can view customer accounts" ON public.customer_accounts;

CREATE POLICY "Users can view customer accounts" ON public.customer_accounts
  FOR SELECT TO authenticated
  USING (
    ((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text 
    OR EXISTS (
      SELECT 1 FROM partner_customer_links pcl
      JOIN partners p ON p.id = pcl.partner_id
      WHERE pcl.customer_account_id = customer_accounts.id 
      AND p.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Admins can manage customer accounts" ON public.customer_accounts
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text)
  WITH CHECK (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- deal_locations - Consolidate SELECT policies
DROP POLICY IF EXISTS "Merchants can manage deal locations" ON public.deal_locations;
DROP POLICY IF EXISTS "Users can view deal locations" ON public.deal_locations;

CREATE POLICY "Users can view deal locations" ON public.deal_locations
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Merchants can manage deal locations" ON public.deal_locations
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deals d
      JOIN merchants m ON m.id = d.merchant_id
      JOIN profiles p ON p.id = m.user_id
      WHERE d.id = deal_locations.deal_id 
      AND p.id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM deals d
      JOIN merchants m ON m.id = d.merchant_id
      JOIN profiles p ON p.id = m.user_id
      WHERE d.id = deal_locations.deal_id 
      AND p.id = (SELECT auth.uid())
    )
  );
