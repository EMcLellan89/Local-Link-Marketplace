/*
  # Optimize Auth RLS Policies - Batch 10a: Merchant Subscriptions Only

  1. Performance Improvements
    - Wrap unwrapped auth.uid() calls in (SELECT auth.uid())
    - Prevent re-evaluation of auth functions per row

  2. Tables Optimized
    - merchant_subscriptions (5 policies)

  3. Pattern Applied
    - Replace auth.uid() with (SELECT auth.uid()) in USING and WITH CHECK clauses
*/

-- merchant_subscriptions
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
            AND tablename = 'merchant_subscriptions'
            AND (
                (qual LIKE '%auth.uid()%' AND qual NOT LIKE '%(SELECT auth.uid()%')
                OR (with_check LIKE '%auth.uid()%' AND with_check NOT LIKE '%(SELECT auth.uid()%')
            )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON merchant_subscriptions', policy_rec.policyname);
    END LOOP;
END $$;

CREATE POLICY "Merchants can view own subscriptions" ON merchant_subscriptions
    FOR SELECT
    USING (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Merchants can manage own subscriptions" ON merchant_subscriptions
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

CREATE POLICY "Admin full access to merchant subscriptions" ON merchant_subscriptions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );