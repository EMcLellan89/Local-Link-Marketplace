/*
  # Optimize Auth RLS Policies - Batch 11: Simple User ID Tables

  1. Performance Improvements
    - Wrap unwrapped auth.uid() calls in (SELECT auth.uid())
    - Prevent re-evaluation of auth functions per row

  2. Tables Optimized
    - favorites
    - reviews
    - ai_assistant_conversations

  3. Pattern Applied
    - Replace auth.uid() with (SELECT auth.uid()) in USING and WITH CHECK clauses
*/

-- favorites
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
            AND tablename = 'favorites'
            AND (
                (qual LIKE '%auth.uid()%' AND qual NOT LIKE '%(SELECT auth.uid()%')
                OR (with_check LIKE '%auth.uid()%' AND with_check NOT LIKE '%(SELECT auth.uid()%')
            )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON favorites', policy_rec.policyname);
    END LOOP;
END $$;

CREATE POLICY "Customers can view own favorites" ON favorites
    FOR SELECT
    USING (
        customer_id IN (
            SELECT customers.id
            FROM customers
            WHERE customers.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Customers can manage own favorites" ON favorites
    FOR ALL
    USING (
        customer_id IN (
            SELECT customers.id
            FROM customers
            WHERE customers.user_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        customer_id IN (
            SELECT customers.id
            FROM customers
            WHERE customers.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Admin full access to favorites" ON favorites
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

-- reviews
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
            AND tablename = 'reviews'
            AND (
                (qual LIKE '%auth.uid()%' AND qual NOT LIKE '%(SELECT auth.uid()%')
                OR (with_check LIKE '%auth.uid()%' AND with_check NOT LIKE '%(SELECT auth.uid()%')
            )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON reviews', policy_rec.policyname);
    END LOOP;
END $$;

CREATE POLICY "Customers can view own reviews" ON reviews
    FOR SELECT
    USING (
        customer_id IN (
            SELECT customers.id
            FROM customers
            WHERE customers.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Customers can manage own reviews" ON reviews
    FOR ALL
    USING (
        customer_id IN (
            SELECT customers.id
            FROM customers
            WHERE customers.user_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        customer_id IN (
            SELECT customers.id
            FROM customers
            WHERE customers.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Merchants can view own business reviews" ON reviews
    FOR SELECT
    USING (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Admin full access to reviews" ON reviews
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

-- ai_assistant_conversations
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
            AND tablename = 'ai_assistant_conversations'
            AND (
                (qual LIKE '%auth.uid()%' AND qual NOT LIKE '%(SELECT auth.uid()%')
                OR (with_check LIKE '%auth.uid()%' AND with_check NOT LIKE '%(SELECT auth.uid()%')
            )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON ai_assistant_conversations', policy_rec.policyname);
    END LOOP;
END $$;

CREATE POLICY "Users can view own conversations" ON ai_assistant_conversations
    FOR SELECT
    USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can manage own conversations" ON ai_assistant_conversations
    FOR ALL
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Admin full access to conversations" ON ai_assistant_conversations
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );