/*
  # Optimize Auth RLS Policies - Batch 5: Accounting Tables

  1. Performance Improvements
    - Wrap unwrapped auth.uid() calls in (SELECT auth.uid())
    - Prevent re-evaluation of auth functions per row
    - Improve query planner efficiency

  2. Tables Optimized (10 policies)
    - accounting_accountant_users
    - accounting_assets
    - accounting_bills
    - accounting_categories

  3. Pattern Applied
    - Replace auth.uid() with (SELECT auth.uid()) in USING and WITH CHECK clauses
*/

-- accounting_accountant_users
DROP POLICY IF EXISTS "Admins can manage accountant users" ON accounting_accountant_users;
CREATE POLICY "Admins can manage accountant users" ON accounting_accountant_users
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM admin_users
            WHERE admin_users.id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Accountants can view own record" ON accounting_accountant_users;
CREATE POLICY "Accountants can view own record" ON accounting_accountant_users
    FOR SELECT
    USING (user_id = (SELECT auth.uid()));

-- accounting_assets
DROP POLICY IF EXISTS "Merchants can view own assets" ON accounting_assets;
CREATE POLICY "Merchants can view own assets" ON accounting_assets
    FOR SELECT
    USING (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Merchants can manage own assets" ON accounting_assets;
CREATE POLICY "Merchants can manage own assets" ON accounting_assets
    FOR ALL
    USING (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

-- accounting_bills
DROP POLICY IF EXISTS "Merchants can view own bills" ON accounting_bills;
CREATE POLICY "Merchants can view own bills" ON accounting_bills
    FOR SELECT
    USING (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Merchants can manage own bills" ON accounting_bills;
CREATE POLICY "Merchants can manage own bills" ON accounting_bills
    FOR ALL
    USING (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

-- accounting_categories
DROP POLICY IF EXISTS "Merchants can view own categories" ON accounting_categories;
CREATE POLICY "Merchants can view own categories" ON accounting_categories
    FOR SELECT
    USING (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Merchants can manage own categories" ON accounting_categories;
CREATE POLICY "Merchants can manage own categories" ON accounting_categories
    FOR ALL
    USING (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Merchants can update own categories" ON accounting_categories;
CREATE POLICY "Merchants can update own categories" ON accounting_categories
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

DROP POLICY IF EXISTS "Merchants can delete own categories" ON accounting_categories;
CREATE POLICY "Merchants can delete own categories" ON accounting_categories
    FOR DELETE
    USING (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );