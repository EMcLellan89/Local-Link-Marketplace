/*
  # Optimize Auth RLS Policies - Batch 8: Partners, CRM Activities, Invoice Items

  1. Performance Improvements
    - Wrap unwrapped auth.uid() calls in (SELECT auth.uid())
    - Prevent re-evaluation of auth functions per row
    - Improve query planner efficiency

  2. Tables Optimized
    - partners (6 policies)
    - crm_activities (6 policies)
    - invoice_items (6 policies)

  3. Pattern Applied
    - Replace auth.uid() with (SELECT auth.uid()) in USING and WITH CHECK clauses
*/

-- Get and optimize partners policies
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
            AND tablename = 'partners'
            AND (
                (qual LIKE '%auth.uid()%' AND qual NOT LIKE '%(SELECT auth.uid()%')
                OR (with_check LIKE '%auth.uid()%' AND with_check NOT LIKE '%(SELECT auth.uid()%')
            )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON partners', policy_rec.policyname);
    END LOOP;
END $$;

CREATE POLICY "Partners can view own record" ON partners
    FOR SELECT
    USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Partners can update own record" ON partners
    FOR UPDATE
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Admin full access to partners" ON partners
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

-- Get and optimize crm_activities policies
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
            AND tablename = 'crm_activities'
            AND (
                (qual LIKE '%auth.uid()%' AND qual NOT LIKE '%(SELECT auth.uid()%')
                OR (with_check LIKE '%auth.uid()%' AND with_check NOT LIKE '%(SELECT auth.uid()%')
            )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON crm_activities', policy_rec.policyname);
    END LOOP;
END $$;

CREATE POLICY "Merchants can view own activities" ON crm_activities
    FOR SELECT
    USING (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Merchants can insert own activities" ON crm_activities
    FOR INSERT
    WITH CHECK (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Merchants can update own activities" ON crm_activities
    FOR UPDATE
    USING (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Merchants can delete own activities" ON crm_activities
    FOR DELETE
    USING (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Admin full access to CRM activities" ON crm_activities
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

-- Get and optimize invoice_items policies
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
            AND tablename = 'invoice_items'
            AND (
                (qual LIKE '%auth.uid()%' AND qual NOT LIKE '%(SELECT auth.uid()%')
                OR (with_check LIKE '%auth.uid()%' AND with_check NOT LIKE '%(SELECT auth.uid()%')
            )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON invoice_items', policy_rec.policyname);
    END LOOP;
END $$;

CREATE POLICY "Merchants can view own invoice items" ON invoice_items
    FOR SELECT
    USING (
        invoice_id IN (
            SELECT invoices.id
            FROM invoices
            JOIN merchants ON merchants.id = invoices.merchant_id
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Merchants can manage own invoice items" ON invoice_items
    FOR ALL
    USING (
        invoice_id IN (
            SELECT invoices.id
            FROM invoices
            JOIN merchants ON merchants.id = invoices.merchant_id
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        invoice_id IN (
            SELECT invoices.id
            FROM invoices
            JOIN merchants ON merchants.id = invoices.merchant_id
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Admin full access to invoice items" ON invoice_items
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );