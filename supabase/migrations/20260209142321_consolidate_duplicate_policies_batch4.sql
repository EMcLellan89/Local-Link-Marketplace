/*
  # Consolidate Duplicate Policies - Batch 4

  1. Changes
    - Consolidate multiple permissive policies granting same access
    - Affects various tables with duplicate SELECT, INSERT, UPDATE policies
  
  2. Performance Impact
    - Reduces policy evaluation overhead
    - Simplifies security model
    - Improves query planning time
*/

-- Communications Subscriptions
DO $$
BEGIN
  DROP POLICY IF EXISTS "Merchants view own subscriptions" ON communications_subscriptions;
  DROP POLICY IF EXISTS "Merchants manage own subscriptions" ON communications_subscriptions;
  DROP POLICY IF EXISTS "Partners view merchant subscriptions" ON communications_subscriptions;
  
  CREATE POLICY "Merchants manage own subscriptions"
    ON communications_subscriptions FOR ALL
    TO authenticated
    USING (
      merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid()))
    )
    WITH CHECK (
      merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid()))
    );
  
  CREATE POLICY "Partners view merchant subscriptions"
    ON communications_subscriptions FOR SELECT
    TO authenticated
    USING (
      partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid()))
    );
END $$;

-- DFY Orders
DO $$
BEGIN
  DROP POLICY IF EXISTS "Merchants view own orders" ON dfy_orders;
  DROP POLICY IF EXISTS "Merchants manage own orders" ON dfy_orders;
  DROP POLICY IF EXISTS "Partners view orders" ON dfy_orders;
  
  CREATE POLICY "Merchants manage own orders"
    ON dfy_orders FOR ALL
    TO authenticated
    USING (
      merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid()))
    )
    WITH CHECK (
      merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid()))
    );
  
  CREATE POLICY "Partners view orders"
    ON dfy_orders FOR SELECT
    TO authenticated
    USING (
      partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid()))
    );
END $$;

-- Job Postings
DO $$
BEGIN
  DROP POLICY IF EXISTS "Merchants view own postings" ON job_postings;
  DROP POLICY IF EXISTS "Merchants manage own postings" ON job_postings;
  DROP POLICY IF EXISTS "Partners view postings" ON job_postings;
  
  CREATE POLICY "Merchants manage own postings"
    ON job_postings FOR ALL
    TO authenticated
    USING (
      merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid()))
    )
    WITH CHECK (
      merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid()))
    );
  
  CREATE POLICY "Partners view postings"
    ON job_postings FOR SELECT
    TO authenticated
    USING (
      partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid()))
    );
END $$;

-- LL CRM Contacts
DO $$
BEGIN
  DROP POLICY IF EXISTS "Merchants view own contacts" ON ll_crm_contacts;
  DROP POLICY IF EXISTS "Merchants manage own contacts" ON ll_crm_contacts;
  DROP POLICY IF EXISTS "Merchants create contacts" ON ll_crm_contacts;
  
  CREATE POLICY "Merchants manage own contacts"
    ON ll_crm_contacts FOR ALL
    TO authenticated
    USING (
      merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid()))
    )
    WITH CHECK (
      merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid()))
    );
END $$;

-- LL CRM Deals
DO $$
BEGIN
  DROP POLICY IF EXISTS "Merchants view own deals" ON ll_crm_deals;
  DROP POLICY IF EXISTS "Merchants manage own deals" ON ll_crm_deals;
  DROP POLICY IF EXISTS "Merchants create deals" ON ll_crm_deals;
  
  CREATE POLICY "Merchants manage own deals"
    ON ll_crm_deals FOR ALL
    TO authenticated
    USING (
      merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid()))
    )
    WITH CHECK (
      merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid()))
    );
END $$;
