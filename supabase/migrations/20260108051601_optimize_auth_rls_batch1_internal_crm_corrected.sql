/*
  # Optimize Auth RLS Performance - Batch 1: Internal CRM & Business Tables (Corrected)
  
  1. Performance Optimization
    - Replace `auth.jwt()` and `auth.uid()` with `(select auth.jwt())` and `(select auth.uid())`
    - Prevents re-evaluation per row for better performance at scale
    - Affects 9 policies across internal CRM and business tables
  
  2. Affected Tables & Policies
    - marketplace_affiliate_subscription_locks: marketplace_affiliate_subscription_locks_select_admin
    - customer_business_relationships: Internal team can manage relationships
    - unified_sales: Internal team can manage sales
    - internal_invoices: Internal team can manage invoices
    - internal_accounting_ledger: Accountants can manage ledger
    - customer_support_tickets: Internal team can manage tickets
    - ticket_messages: Internal team can manage messages
    - customer_activity_log: Internal team can manage activity log
    - customer_impersonation_log: Internal team can view impersonation log
  
  3. Important Notes
    - No security impact - same logic, better performance
    - Only optimization of auth function calls
*/

-- marketplace_affiliate_subscription_locks
DROP POLICY IF EXISTS "marketplace_affiliate_subscription_locks_select_admin" ON marketplace_affiliate_subscription_locks;
CREATE POLICY "marketplace_affiliate_subscription_locks_select_admin"
  ON marketplace_affiliate_subscription_locks
  FOR SELECT
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = 'admin');

-- customer_business_relationships
DROP POLICY IF EXISTS "Internal team can manage relationships" ON customer_business_relationships;
CREATE POLICY "Internal team can manage relationships"
  ON customer_business_relationships
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = ANY (ARRAY['admin', 'internal_team']));

-- unified_sales
DROP POLICY IF EXISTS "Internal team can manage sales" ON unified_sales;
CREATE POLICY "Internal team can manage sales"
  ON unified_sales
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = ANY (ARRAY['admin', 'internal_team']));

-- internal_invoices
DROP POLICY IF EXISTS "Internal team can manage invoices" ON internal_invoices;
CREATE POLICY "Internal team can manage invoices"
  ON internal_invoices
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = ANY (ARRAY['admin', 'internal_team']));

-- internal_accounting_ledger
DROP POLICY IF EXISTS "Accountants can manage ledger" ON internal_accounting_ledger;
CREATE POLICY "Accountants can manage ledger"
  ON internal_accounting_ledger
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = ANY (ARRAY['admin', 'accountant', 'internal_team']));

-- customer_support_tickets
DROP POLICY IF EXISTS "Internal team can manage tickets" ON customer_support_tickets;
CREATE POLICY "Internal team can manage tickets"
  ON customer_support_tickets
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = ANY (ARRAY['admin', 'internal_team', 'support']));

-- ticket_messages
DROP POLICY IF EXISTS "Internal team can manage messages" ON ticket_messages;
CREATE POLICY "Internal team can manage messages"
  ON ticket_messages
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = ANY (ARRAY['admin', 'internal_team', 'support']));

-- customer_activity_log
DROP POLICY IF EXISTS "Internal team can manage activity log" ON customer_activity_log;
CREATE POLICY "Internal team can manage activity log"
  ON customer_activity_log
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = ANY (ARRAY['admin', 'internal_team']));

-- customer_impersonation_log
DROP POLICY IF EXISTS "Internal team can view impersonation log" ON customer_impersonation_log;
CREATE POLICY "Internal team can view impersonation log"
  ON customer_impersonation_log
  FOR SELECT
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = ANY (ARRAY['admin', 'internal_team']));
