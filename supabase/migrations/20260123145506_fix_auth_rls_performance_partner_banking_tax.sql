/*
  # Fix Auth RLS Performance - Partner Banking & Tax Tables
  
  1. Performance
    - Replace direct auth.uid() calls with (select auth.uid()) in RLS policies
  
  2. Tables Updated
    - partner_bank_accounts
    - partner_tax_settings
    - partner_quarterly_taxes
    - partner_accounting_categories
    - partner_accounting_transactions
    - partner_deal_sync_log
*/

-- partner_bank_accounts
DROP POLICY IF EXISTS "Admin can view all bank accounts" ON partner_bank_accounts;
DROP POLICY IF EXISTS "Partners can manage own bank accounts" ON partner_bank_accounts;

CREATE POLICY "Admin can view all bank accounts" ON partner_bank_accounts
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Partners can manage own bank accounts" ON partner_bank_accounts
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

-- partner_tax_settings
DROP POLICY IF EXISTS "Admin can manage all tax settings" ON partner_tax_settings;
DROP POLICY IF EXISTS "Partners can manage own tax settings" ON partner_tax_settings;

CREATE POLICY "Admin can manage all tax settings" ON partner_tax_settings
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
    OR partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
    OR partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- partner_quarterly_taxes
DROP POLICY IF EXISTS "Admin can manage all quarterly taxes" ON partner_quarterly_taxes;
DROP POLICY IF EXISTS "Partners can view own quarterly taxes" ON partner_quarterly_taxes;

CREATE POLICY "Admin can manage all quarterly taxes" ON partner_quarterly_taxes
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Partners can view own quarterly taxes" ON partner_quarterly_taxes
  FOR SELECT TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- partner_accounting_categories
DROP POLICY IF EXISTS "Admin can manage accounting categories" ON partner_accounting_categories;

CREATE POLICY "Admin can manage accounting categories" ON partner_accounting_categories
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- partner_accounting_transactions
DROP POLICY IF EXISTS "Admin can view all transactions" ON partner_accounting_transactions;
DROP POLICY IF EXISTS "Partners can manage own transactions" ON partner_accounting_transactions;

CREATE POLICY "Admin can view all transactions" ON partner_accounting_transactions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Partners can manage own transactions" ON partner_accounting_transactions
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

-- partner_deal_sync_log
DROP POLICY IF EXISTS "Admin can manage all sync logs" ON partner_deal_sync_log;
DROP POLICY IF EXISTS "Partners can view own sync logs" ON partner_deal_sync_log;

CREATE POLICY "Admin can manage all sync logs" ON partner_deal_sync_log
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Partners can view own sync logs" ON partner_deal_sync_log
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partner_crm_deals pcd
      WHERE pcd.id = partner_deal_sync_log.partner_deal_id
      AND pcd.partner_id IN (
        SELECT id FROM partners 
        WHERE user_id = (SELECT auth.uid())
      )
    )
  );
