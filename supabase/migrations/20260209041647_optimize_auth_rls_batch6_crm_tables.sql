/*
  # Optimize Auth RLS Policies - Batch 6: CRM Tables

  1. Performance Improvements
    - Wrap unwrapped auth.uid() calls in (SELECT auth.uid())
    - Prevent re-evaluation of auth functions per row
    - Improve query planner efficiency

  2. Tables Optimized (13 policies)
    - crm_tasks (8 policies)
    - crm_leads (5 policies)

  3. Pattern Applied
    - Replace auth.uid() with (SELECT auth.uid()) in USING and WITH CHECK clauses
*/

-- crm_tasks: Get all policies first
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
            AND tablename = 'crm_tasks'
            AND (qual LIKE '%auth.uid()%' OR with_check LIKE '%auth.uid()%')
            AND (
                (qual IS NOT NULL AND qual NOT LIKE '%(SELECT auth.uid())%')
                OR (with_check IS NOT NULL AND with_check NOT LIKE '%(SELECT auth.uid())%')
            )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON crm_tasks', policy_rec.policyname);
    END LOOP;
END $$;

-- Recreate crm_tasks policies with optimized auth calls
CREATE POLICY "Merchants can view own tasks" ON crm_tasks
    FOR SELECT
    USING (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Merchants can insert own tasks" ON crm_tasks
    FOR INSERT
    WITH CHECK (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Merchants can update own tasks" ON crm_tasks
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

CREATE POLICY "Merchants can delete own tasks" ON crm_tasks
    FOR DELETE
    USING (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Assigned users can view tasks" ON crm_tasks
    FOR SELECT
    USING (assigned_to = (SELECT auth.uid()));

CREATE POLICY "Admin full access to CRM tasks" ON crm_tasks
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

-- crm_leads: Get all policies first
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
            AND tablename = 'crm_leads'
            AND (qual LIKE '%auth.uid()%' OR with_check LIKE '%auth.uid()%')
            AND (
                (qual IS NOT NULL AND qual NOT LIKE '%(SELECT auth.uid())%')
                OR (with_check IS NOT NULL AND with_check NOT LIKE '%(SELECT auth.uid())%')
            )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON crm_leads', policy_rec.policyname);
    END LOOP;
END $$;

-- Recreate crm_leads policies with optimized auth calls
CREATE POLICY "Merchants can view own leads" ON crm_leads
    FOR SELECT
    USING (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Merchants can insert own leads" ON crm_leads
    FOR INSERT
    WITH CHECK (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Merchants can update own leads" ON crm_leads
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

CREATE POLICY "Merchants can delete own leads" ON crm_leads
    FOR DELETE
    USING (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Admin full access to CRM leads" ON crm_leads
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );