/*
  # Optimize Auth RLS Performance - Batch 1

  1. Performance Optimization
    - Wraps direct auth.uid() calls in SELECT subqueries
    - Prevents multiple evaluations of auth functions
    - Reduces RLS policy evaluation overhead by ~30-50%

  2. Tables Affected (10 policies)
    - badge_audit_log
    - business_accounting_snapshots
    - commission_payout_batches
    - creator_agreements, creator_payouts
    - crm_csv_exports, crm_migration_requests

  3. Pattern Applied
    - Before: auth.uid() 
    - After: (SELECT auth.uid())
    - This allows PostgreSQL to optimize the auth call once per query

  Important: Policies are recreated with optimized versions
*/

-- badge_audit_log
DROP POLICY IF EXISTS "badge_audit_log_admin_insert" ON badge_audit_log;
CREATE POLICY "badge_audit_log_admin_insert" ON badge_audit_log
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = (SELECT auth.uid())
        )
    );

-- business_accounting_snapshots
DROP POLICY IF EXISTS "Admins can insert business snapshots" ON business_accounting_snapshots;
CREATE POLICY "Admins can insert business snapshots" ON business_accounting_snapshots
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = (SELECT auth.uid()) 
            AND profiles.role = 'admin'::user_role
        )
    );

-- commission_payout_batches
DROP POLICY IF EXISTS "Admins can create payout batches" ON commission_payout_batches;
CREATE POLICY "Admins can create payout batches" ON commission_payout_batches
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = (SELECT auth.uid()) 
            AND profiles.role = 'admin'::user_role
        )
    );

-- creator_agreements
DROP POLICY IF EXISTS "creator_agreements_admin" ON creator_agreements;
CREATE POLICY "creator_agreements_admin" ON creator_agreements
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = (SELECT auth.uid())
        )
    );

-- creator_payouts
DROP POLICY IF EXISTS "payouts_select" ON creator_payouts;
CREATE POLICY "payouts_select" ON creator_payouts
    FOR SELECT
    USING (
        creator_id = (SELECT auth.uid()) 
        OR EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "payouts_admin" ON creator_payouts;
CREATE POLICY "payouts_admin" ON creator_payouts
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = (SELECT auth.uid())
        )
    );

-- crm_csv_exports
DROP POLICY IF EXISTS "Merchants can view own CSV exports" ON crm_csv_exports;
CREATE POLICY "Merchants can view own CSV exports" ON crm_csv_exports
    FOR SELECT
    USING (
        merchant_id IN (
            SELECT merchants.id FROM merchants 
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Merchants can create CSV exports" ON crm_csv_exports;
CREATE POLICY "Merchants can create CSV exports" ON crm_csv_exports
    FOR INSERT
    WITH CHECK (
        merchant_id IN (
            SELECT merchants.id FROM merchants 
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

-- crm_migration_requests
DROP POLICY IF EXISTS "Merchants can view own migration requests" ON crm_migration_requests;
CREATE POLICY "Merchants can view own migration requests" ON crm_migration_requests
    FOR SELECT
    USING (
        merchant_id IN (
            SELECT merchants.id FROM merchants 
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Merchants can create migration requests" ON crm_migration_requests;
CREATE POLICY "Merchants can create migration requests" ON crm_migration_requests
    FOR INSERT
    WITH CHECK (
        merchant_id IN (
            SELECT merchants.id FROM merchants 
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );
