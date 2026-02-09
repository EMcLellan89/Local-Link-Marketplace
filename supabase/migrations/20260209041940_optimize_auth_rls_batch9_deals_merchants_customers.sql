/*
  # Optimize Auth RLS Policies - Batch 9: Deals, Merchants, Customers

  1. Performance Improvements
    - Wrap unwrapped auth.uid() calls in (SELECT auth.uid())
    - Prevent re-evaluation of auth functions per row
    - Improve query planner efficiency

  2. Tables Optimized
    - deals (5 policies)
    - merchants (5 policies)
    - customers (5 policies)

  3. Pattern Applied
    - Replace auth.uid() with (SELECT auth.uid()) in USING and WITH CHECK clauses
*/

-- deals
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
            AND tablename = 'deals'
            AND (
                (qual LIKE '%auth.uid()%' AND qual NOT LIKE '%(SELECT auth.uid()%')
                OR (with_check LIKE '%auth.uid()%' AND with_check NOT LIKE '%(SELECT auth.uid()%')
            )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON deals', policy_rec.policyname);
    END LOOP;
END $$;

CREATE POLICY "Merchants can view own deals" ON deals
    FOR SELECT
    USING (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Merchants can manage own deals" ON deals
    FOR ALL
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

CREATE POLICY "Admin full access to deals" ON deals
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

-- merchants
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
            AND tablename = 'merchants'
            AND (
                (qual LIKE '%auth.uid()%' AND qual NOT LIKE '%(SELECT auth.uid()%')
                OR (with_check LIKE '%auth.uid()%' AND with_check NOT LIKE '%(SELECT auth.uid()%')
            )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON merchants', policy_rec.policyname);
    END LOOP;
END $$;

CREATE POLICY "Merchants can view own record" ON merchants
    FOR SELECT
    USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Merchants can update own record" ON merchants
    FOR UPDATE
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Admin full access to merchants" ON merchants
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

-- customers
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
            AND tablename = 'customers'
            AND (
                (qual LIKE '%auth.uid()%' AND qual NOT LIKE '%(SELECT auth.uid()%')
                OR (with_check LIKE '%auth.uid()%' AND with_check NOT LIKE '%(SELECT auth.uid()%')
            )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON customers', policy_rec.policyname);
    END LOOP;
END $$;

CREATE POLICY "Customers can view own record" ON customers
    FOR SELECT
    USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Customers can update own record" ON customers
    FOR UPDATE
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Admin full access to customers" ON customers
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

CREATE POLICY "Merchants can view own customers" ON customers
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM purchases p
            JOIN deals d ON d.id = p.deal_id
            JOIN merchants m ON m.id = d.merchant_id
            WHERE p.customer_id = customers.id
                AND m.user_id = (SELECT auth.uid())
        )
    );