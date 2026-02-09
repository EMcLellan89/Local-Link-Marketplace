/*
  # Fix Auth RLS Initialization Plan Issues

  1. Issue
    - 12 RLS policies re-evaluate auth functions for each row
    - This causes performance degradation on large result sets
    - Auth functions should be evaluated once per query, not per row

  2. Changes
    - Wrap auth.uid() calls in subqueries: (SELECT auth.uid())
    - Forces single evaluation per query instead of per-row evaluation
    - Affected policies:
      * external_systems: "Admins can view external systems"
      * profit_network_enrollments: "Admin can manage all enrollments"
      * profit_network_sales: "Admin can manage all sales", "Partners can view own sales"
      * profit_network_ad_costs: "Admin can manage all ad costs"
      * profit_network_businesses: "Admin can manage profit network businesses"
      * profit_network_deductions: "Admin can manage all deductions"
      * profit_network_statements: "Admin can manage all statements"
      * dfy_disputes: "Partners can create assigned job disputes"
      * dfy_jobs: "Partners can view open and assigned jobs"
      * profit_network_playbooks: "Admins can manage all playbooks", "Partners can view playbooks for enrolled businesses"

  3. Performance Impact
    - Reduces auth function calls from O(n) to O(1) per query
    - Improves query performance on tables with many rows
*/

-- external_systems: Admins can view external systems
DROP POLICY IF EXISTS "Admins can view external systems" ON external_systems;
CREATE POLICY "Admins can view external systems" ON external_systems
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
    )
  );

-- profit_network_enrollments: Admin can manage all enrollments
DROP POLICY IF EXISTS "Admin can manage all enrollments" ON profit_network_enrollments;
CREATE POLICY "Admin can manage all enrollments" ON profit_network_enrollments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
    )
  );

-- profit_network_sales: Admin can manage all sales
DROP POLICY IF EXISTS "Admin can manage all sales" ON profit_network_sales;
CREATE POLICY "Admin can manage all sales" ON profit_network_sales
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
    )
  );

-- profit_network_sales: Partners can view own sales
DROP POLICY IF EXISTS "Partners can view own sales" ON profit_network_sales;
CREATE POLICY "Partners can view own sales" ON profit_network_sales
  FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT partners.id
      FROM partners
      WHERE partners.user_id = (SELECT auth.uid())
    )
  );

-- profit_network_ad_costs: Admin can manage all ad costs
DROP POLICY IF EXISTS "Admin can manage all ad costs" ON profit_network_ad_costs;
CREATE POLICY "Admin can manage all ad costs" ON profit_network_ad_costs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
    )
  );

-- profit_network_businesses: Admin can manage profit network businesses
DROP POLICY IF EXISTS "Admin can manage profit network businesses" ON profit_network_businesses;
CREATE POLICY "Admin can manage profit network businesses" ON profit_network_businesses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
    )
  );

-- profit_network_deductions: Admin can manage all deductions
DROP POLICY IF EXISTS "Admin can manage all deductions" ON profit_network_deductions;
CREATE POLICY "Admin can manage all deductions" ON profit_network_deductions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
    )
  );

-- profit_network_statements: Admin can manage all statements
DROP POLICY IF EXISTS "Admin can manage all statements" ON profit_network_statements;
CREATE POLICY "Admin can manage all statements" ON profit_network_statements
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
    )
  );

-- dfy_disputes: Partners can create assigned job disputes
DROP POLICY IF EXISTS "Partners can create assigned job disputes" ON dfy_disputes;
CREATE POLICY "Partners can create assigned job disputes" ON dfy_disputes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM dfy_jobs dj
      JOIN partners p ON p.id = dj.selected_partner_id
      WHERE dj.id = dfy_disputes.job_id
        AND p.user_id = (SELECT auth.uid())
    )
  );

-- dfy_jobs: Partners can view open and assigned jobs
DROP POLICY IF EXISTS "Partners can view open and assigned jobs" ON dfy_jobs;
CREATE POLICY "Partners can view open and assigned jobs" ON dfy_jobs
  FOR SELECT
  TO authenticated
  USING (
    status = ANY (ARRAY['open', 'assigned', 'in_progress', 'submitted'])
    OR selected_partner_id = (SELECT auth.uid())
  );

-- profit_network_playbooks: Admins can manage all playbooks
DROP POLICY IF EXISTS "Admins can manage all playbooks" ON profit_network_playbooks;
CREATE POLICY "Admins can manage all playbooks" ON profit_network_playbooks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
    )
  );

-- profit_network_playbooks: Partners can view playbooks for enrolled businesses
DROP POLICY IF EXISTS "Partners can view playbooks for enrolled businesses" ON profit_network_playbooks;
CREATE POLICY "Partners can view playbooks for enrolled businesses" ON profit_network_playbooks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM partners p
      JOIN profit_network_enrollments e ON e.partner_id = p.id
      WHERE p.user_id = (SELECT auth.uid())
        AND e.business_id = profit_network_playbooks.business_id
        AND e.status = ANY (ARRAY['approved', 'active'])
    )
  );