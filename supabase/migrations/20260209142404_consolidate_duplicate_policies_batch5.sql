/*
  # Consolidate Duplicate Policies - Batch 5

  1. Changes
    - Consolidate multiple permissive policies granting same access
    - Affects marketplace and partner tables
  
  2. Performance Impact
    - Reduces policy evaluation overhead
    - Simplifies security model
*/

-- Marketplace Orders
DO $$
BEGIN
  DROP POLICY IF EXISTS "Partners view own orders" ON marketplace_orders;
  DROP POLICY IF EXISTS "Partners manage own orders" ON marketplace_orders;
  
  CREATE POLICY "Partners manage own orders"
    ON marketplace_orders FOR ALL
    TO authenticated
    USING (
      partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid()))
    )
    WITH CHECK (
      partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid()))
    );
END $$;

-- Marketplace Affiliate Commissions
DO $$
BEGIN
  DROP POLICY IF EXISTS "Affiliates view own commissions" ON marketplace_affiliate_commissions;
  DROP POLICY IF EXISTS "Affiliates track own commissions" ON marketplace_affiliate_commissions;
  
  CREATE POLICY "Affiliates view own commissions"
    ON marketplace_affiliate_commissions FOR SELECT
    TO authenticated
    USING (
      affiliate_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid()))
    );
END $$;

-- Partner CRM Contacts
DO $$
BEGIN
  DROP POLICY IF EXISTS "Partners view own contacts" ON partner_crm_contacts;
  DROP POLICY IF EXISTS "Partners manage own contacts" ON partner_crm_contacts;
  DROP POLICY IF EXISTS "Partners create contacts" ON partner_crm_contacts;
  
  CREATE POLICY "Partners manage own contacts"
    ON partner_crm_contacts FOR ALL
    TO authenticated
    USING (
      partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid()))
    )
    WITH CHECK (
      partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid()))
    );
END $$;

-- Partner CRM Deals
DO $$
BEGIN
  DROP POLICY IF EXISTS "Partners view own deals" ON partner_crm_deals;
  DROP POLICY IF EXISTS "Partners manage own deals" ON partner_crm_deals;
  DROP POLICY IF EXISTS "Partners create deals" ON partner_crm_deals;
  
  CREATE POLICY "Partners manage own deals"
    ON partner_crm_deals FOR ALL
    TO authenticated
    USING (
      partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid()))
    )
    WITH CHECK (
      partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid()))
    );
END $$;

-- UGC Orders
DO $$
BEGIN
  DROP POLICY IF EXISTS "Merchants view own ugc orders" ON ugc_orders;
  DROP POLICY IF EXISTS "Merchants manage own ugc orders" ON ugc_orders;
  DROP POLICY IF EXISTS "Partners view ugc orders" ON ugc_orders;
  DROP POLICY IF EXISTS "Creators view assigned orders" ON ugc_orders;
  
  CREATE POLICY "Merchants manage own ugc orders"
    ON ugc_orders FOR ALL
    TO authenticated
    USING (
      merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid()))
    )
    WITH CHECK (
      merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid()))
    );
  
  CREATE POLICY "Partners view ugc orders"
    ON ugc_orders FOR SELECT
    TO authenticated
    USING (
      partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid()))
    );
  
  CREATE POLICY "Creators view assigned orders"
    ON ugc_orders FOR SELECT
    TO authenticated
    USING (
      creator_id IN (SELECT id FROM ugc_creator_profiles WHERE user_id = (SELECT auth.uid()))
    );
END $$;
