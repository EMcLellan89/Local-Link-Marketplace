/*
  # Optimize Auth RLS Performance - Batch 2

  1. Performance Optimization
    - Wraps direct auth.uid() calls in SELECT subqueries
    - Applies to dfy_*, digital_assets tables
    - Reduces redundant auth function evaluations

  2. Tables Affected
    - dfy_disputes
    - dfy_job_submissions
    - dfy_jobs
    - dfy_services
    - digital_assets

  3. Impact
    - Improved query performance for DFY job system
    - Optimized partner and merchant access checks
*/

-- dfy_disputes
DROP POLICY IF EXISTS "Partners can view assigned job disputes" ON dfy_disputes;
CREATE POLICY "Partners can view assigned job disputes" ON dfy_disputes
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 
            FROM dfy_jobs dj
            JOIN partners p ON p.id = dj.selected_partner_id
            WHERE dj.id = dfy_disputes.job_id 
            AND p.user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Merchants can create job disputes" ON dfy_disputes;
CREATE POLICY "Merchants can create job disputes" ON dfy_disputes
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM dfy_jobs dj
            JOIN merchants m ON m.id = dj.merchant_id
            WHERE dj.id = dfy_disputes.job_id 
            AND m.user_id = (SELECT auth.uid())
        )
    );

-- dfy_job_submissions
DROP POLICY IF EXISTS "Partners can view own submissions" ON dfy_job_submissions;
CREATE POLICY "Partners can view own submissions" ON dfy_job_submissions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM partners p 
            WHERE p.id = dfy_job_submissions.partner_id 
            AND p.user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Partners can create submissions" ON dfy_job_submissions;
CREATE POLICY "Partners can create submissions" ON dfy_job_submissions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM partners p
            JOIN dfy_jobs dj ON dj.selected_partner_id = p.id
            WHERE p.id = dfy_job_submissions.partner_id 
            AND dj.id = dfy_job_submissions.job_id 
            AND p.user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Merchants can view job submissions" ON dfy_job_submissions;
CREATE POLICY "Merchants can view job submissions" ON dfy_job_submissions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 
            FROM dfy_jobs dj
            JOIN merchants m ON m.id = dj.merchant_id
            WHERE dj.id = dfy_job_submissions.job_id 
            AND m.user_id = (SELECT auth.uid())
        )
    );

-- dfy_jobs
DROP POLICY IF EXISTS "dfy_jobs_merchant_partner" ON dfy_jobs;
CREATE POLICY "dfy_jobs_merchant_partner" ON dfy_jobs
    FOR SELECT
    USING (
        merchant_id = (SELECT auth.uid()) 
        OR selected_partner_id = (SELECT auth.uid()) 
        OR (
            status = 'open' 
            AND EXISTS (
                SELECT 1 FROM profiles 
                WHERE profiles.id = (SELECT auth.uid()) 
                AND profiles.role = 'partner'::user_role
            )
        ) 
        OR EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = (SELECT auth.uid()) 
            AND profiles.role = 'admin'::user_role
        )
    );

DROP POLICY IF EXISTS "admin_dfy_jobs_all" ON dfy_jobs;
CREATE POLICY "admin_dfy_jobs_all" ON dfy_jobs
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = (SELECT auth.uid()) 
            AND profiles.role = 'admin'::user_role
        )
    );

-- dfy_services
DROP POLICY IF EXISTS "dfy_services_view_active" ON dfy_services;
CREATE POLICY "dfy_services_view_active" ON dfy_services
    FOR SELECT
    USING (
        is_active = true 
        OR EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = (SELECT auth.uid()) 
            AND profiles.role = 'admin'::user_role
        )
    );

DROP POLICY IF EXISTS "admin_dfy_all" ON dfy_services;
CREATE POLICY "admin_dfy_all" ON dfy_services
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = (SELECT auth.uid()) 
            AND profiles.role = 'admin'::user_role
        )
    );

-- digital_assets
DROP POLICY IF EXISTS "customer_assets_granted" ON digital_assets;
CREATE POLICY "customer_assets_granted" ON digital_assets
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM customer_asset_grants 
            WHERE customer_asset_grants.asset_id = digital_assets.id 
            AND customer_asset_grants.user_id = (SELECT auth.uid())
        )
    );
