/*
  # Fix Auth RLS Performance - Partner CRM Tables
  
  1. Performance
    - Replace direct auth.uid() calls with (select auth.uid()) in RLS policies
    - This prevents re-evaluation for each row
  
  2. Tables Updated
    - partner_crm_companies
    - partner_crm_contacts
    - partner_crm_deals
    - partner_crm_deal_products
    - partner_crm_deal_notes
*/

-- partner_crm_companies
DROP POLICY IF EXISTS "Admin can view all companies" ON partner_crm_companies;
DROP POLICY IF EXISTS "Partners can manage own companies" ON partner_crm_companies;

CREATE POLICY "Admin can view all companies" ON partner_crm_companies
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Partners can manage own companies" ON partner_crm_companies
  FOR ALL TO authenticated
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

-- partner_crm_contacts
DROP POLICY IF EXISTS "Admin can view all contacts" ON partner_crm_contacts;
DROP POLICY IF EXISTS "Partners can manage own contacts" ON partner_crm_contacts;

CREATE POLICY "Admin can view all contacts" ON partner_crm_contacts
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Partners can manage own contacts" ON partner_crm_contacts
  FOR ALL TO authenticated
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

-- partner_crm_deals
DROP POLICY IF EXISTS "Admin can manage all deals" ON partner_crm_deals;
DROP POLICY IF EXISTS "Partners can manage own deals" ON partner_crm_deals;

CREATE POLICY "Admin can manage all deals" ON partner_crm_deals
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Partners can manage own deals" ON partner_crm_deals
  FOR ALL TO authenticated
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

-- partner_crm_deal_products
DROP POLICY IF EXISTS "Admin can view all deal products" ON partner_crm_deal_products;
DROP POLICY IF EXISTS "Partners can manage own deal products" ON partner_crm_deal_products;

CREATE POLICY "Admin can view all deal products" ON partner_crm_deal_products
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Partners can manage own deal products" ON partner_crm_deal_products
  FOR ALL TO authenticated
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

-- partner_crm_deal_notes
DROP POLICY IF EXISTS "Partners can manage own deal notes" ON partner_crm_deal_notes;

CREATE POLICY "Partners can manage own deal notes" ON partner_crm_deal_notes
  FOR ALL TO authenticated
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
