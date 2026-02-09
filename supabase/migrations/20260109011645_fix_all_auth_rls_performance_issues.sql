/*
  # Fix All Auth RLS Performance Issues
  
  1. Changes
    - Optimize all 27 RLS policies by properly wrapping auth function calls
    - Changes `auth.function()` to `(SELECT auth.function())` in policy conditions
    - This prevents re-evaluation of auth functions for each row
    
  2. Tables Updated
    - marketplace_affiliate_subscription_locks, customer_business_relationships, unified_sales
    - certifications (2), internal_invoices, internal_accounting_ledger
    - customer_support_tickets, ticket_messages, customer_activity_log
    - customer_impersonation_log, email_communications
    - product_commission_rules, partner_onboarding_steps, external_business_webhooks
    - customer_accounts (2), commissions (2), commission_rules
    - payment_events, swipe_templates, system_email_templates
    - internal_team_members, business_units, unified_customers
    - marketplace_affiliate_badges, marketplace_affiliate_product_assets
    
  3. Performance Impact
    - Reduces auth function calls from O(n) to O(1) per query
    - Dramatically improves performance at scale
*/

-- marketplace_affiliate_subscription_locks
DROP POLICY IF EXISTS "marketplace_affiliate_subscription_locks_select_admin" ON public.marketplace_affiliate_subscription_locks;
CREATE POLICY "marketplace_affiliate_subscription_locks_select_admin" ON public.marketplace_affiliate_subscription_locks
  FOR SELECT TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- customer_business_relationships
DROP POLICY IF EXISTS "Internal team can manage relationships" ON public.customer_business_relationships;
CREATE POLICY "Internal team can manage relationships" ON public.customer_business_relationships
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = ANY (ARRAY['admin'::text, 'internal_team'::text]));

-- unified_sales
DROP POLICY IF EXISTS "Internal team can manage sales" ON public.unified_sales;
CREATE POLICY "Internal team can manage sales" ON public.unified_sales
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = ANY (ARRAY['admin'::text, 'internal_team'::text]));

-- certifications - Admins
DROP POLICY IF EXISTS "Admins can manage certifications" ON public.certifications;
CREATE POLICY "Admins can manage certifications" ON public.certifications
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- certifications - Users
DROP POLICY IF EXISTS "Users can view certifications" ON public.certifications;
CREATE POLICY "Users can view certifications" ON public.certifications
  FOR SELECT TO authenticated
  USING (
    ((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text 
    OR partner_id IN (
      SELECT partners.id FROM partners 
      WHERE partners.user_id = (SELECT auth.uid())
    )
  );

-- internal_invoices
DROP POLICY IF EXISTS "Internal team can manage invoices" ON public.internal_invoices;
CREATE POLICY "Internal team can manage invoices" ON public.internal_invoices
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = ANY (ARRAY['admin'::text, 'internal_team'::text]));

-- internal_accounting_ledger
DROP POLICY IF EXISTS "Accountants can manage ledger" ON public.internal_accounting_ledger;
CREATE POLICY "Accountants can manage ledger" ON public.internal_accounting_ledger
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = ANY (ARRAY['admin'::text, 'accountant'::text, 'internal_team'::text]));

-- customer_support_tickets
DROP POLICY IF EXISTS "Internal team can manage tickets" ON public.customer_support_tickets;
CREATE POLICY "Internal team can manage tickets" ON public.customer_support_tickets
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = ANY (ARRAY['admin'::text, 'internal_team'::text, 'support'::text]));

-- ticket_messages
DROP POLICY IF EXISTS "Internal team can manage messages" ON public.ticket_messages;
CREATE POLICY "Internal team can manage messages" ON public.ticket_messages
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = ANY (ARRAY['admin'::text, 'internal_team'::text, 'support'::text]));

-- customer_activity_log
DROP POLICY IF EXISTS "Internal team can manage activity log" ON public.customer_activity_log;
CREATE POLICY "Internal team can manage activity log" ON public.customer_activity_log
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = ANY (ARRAY['admin'::text, 'internal_team'::text]));

-- customer_impersonation_log
DROP POLICY IF EXISTS "Internal team can view impersonation log" ON public.customer_impersonation_log;
CREATE POLICY "Internal team can view impersonation log" ON public.customer_impersonation_log
  FOR SELECT TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = ANY (ARRAY['admin'::text, 'internal_team'::text]));

-- email_communications
DROP POLICY IF EXISTS "Internal team can manage emails" ON public.email_communications;
CREATE POLICY "Internal team can manage emails" ON public.email_communications
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = ANY (ARRAY['admin'::text, 'internal_team'::text]));

-- product_commission_rules
DROP POLICY IF EXISTS "product_commission_rules_manage_admin" ON public.product_commission_rules;
CREATE POLICY "product_commission_rules_manage_admin" ON public.product_commission_rules
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- partner_onboarding_steps
DROP POLICY IF EXISTS "partner_onboarding_steps_manage_admin" ON public.partner_onboarding_steps;
CREATE POLICY "partner_onboarding_steps_manage_admin" ON public.partner_onboarding_steps
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- external_business_webhooks
DROP POLICY IF EXISTS "Internal team can manage webhooks" ON public.external_business_webhooks;
CREATE POLICY "Internal team can manage webhooks" ON public.external_business_webhooks
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = ANY (ARRAY['admin'::text, 'internal_team'::text]));

-- customer_accounts - Admin
DROP POLICY IF EXISTS "Admin can manage customer accounts" ON public.customer_accounts;
CREATE POLICY "Admin can manage customer accounts" ON public.customer_accounts
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- customer_accounts - Users
DROP POLICY IF EXISTS "Users can view customer accounts" ON public.customer_accounts;
CREATE POLICY "Users can view customer accounts" ON public.customer_accounts
  FOR SELECT TO authenticated
  USING (
    ((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text 
    OR EXISTS (
      SELECT 1 FROM partner_customer_links pcl
      JOIN partners p ON p.id = pcl.partner_id
      WHERE pcl.customer_account_id = customer_accounts.id 
      AND p.user_id = (SELECT auth.uid())
    )
  );

-- commissions - Admin
DROP POLICY IF EXISTS "Admin can manage commissions" ON public.commissions;
CREATE POLICY "Admin can manage commissions" ON public.commissions
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- commissions - Users
DROP POLICY IF EXISTS "Users can view commissions" ON public.commissions;
CREATE POLICY "Users can view commissions" ON public.commissions
  FOR SELECT TO authenticated
  USING (
    ((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text 
    OR partner_id IN (
      SELECT partners.id FROM partners 
      WHERE partners.user_id = (SELECT auth.uid())
    )
  );

-- commission_rules
DROP POLICY IF EXISTS "Admin can manage commission rules" ON public.commission_rules;
CREATE POLICY "Admin can manage commission rules" ON public.commission_rules
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- payment_events
DROP POLICY IF EXISTS "Admin can manage payment events" ON public.payment_events;
CREATE POLICY "Admin can manage payment events" ON public.payment_events
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- swipe_templates
DROP POLICY IF EXISTS "swipe_templates_manage_admin" ON public.swipe_templates;
CREATE POLICY "swipe_templates_manage_admin" ON public.swipe_templates
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- system_email_templates
DROP POLICY IF EXISTS "system_email_templates_manage_admin" ON public.system_email_templates;
CREATE POLICY "system_email_templates_manage_admin" ON public.system_email_templates
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- internal_team_members
DROP POLICY IF EXISTS "Internal team can view team members" ON public.internal_team_members;
CREATE POLICY "Internal team can view team members" ON public.internal_team_members
  FOR SELECT TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = ANY (ARRAY['admin'::text, 'internal_team'::text]));

-- business_units
DROP POLICY IF EXISTS "Internal team can manage business units" ON public.business_units;
CREATE POLICY "Internal team can manage business units" ON public.business_units
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = ANY (ARRAY['admin'::text, 'internal_team'::text]));

-- unified_customers
DROP POLICY IF EXISTS "Internal team can manage customers" ON public.unified_customers;
CREATE POLICY "Internal team can manage customers" ON public.unified_customers
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = ANY (ARRAY['admin'::text, 'internal_team'::text]));

-- marketplace_affiliate_badges
DROP POLICY IF EXISTS "marketplace_affiliate_badges_select_admin" ON public.marketplace_affiliate_badges;
CREATE POLICY "marketplace_affiliate_badges_select_admin" ON public.marketplace_affiliate_badges
  FOR SELECT TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text);

-- marketplace_affiliate_product_assets
DROP POLICY IF EXISTS "marketplace_affiliate_product_assets_manage_admin" ON public.marketplace_affiliate_product_assets;
CREATE POLICY "marketplace_affiliate_product_assets_manage_admin" ON public.marketplace_affiliate_product_assets
  FOR ALL TO authenticated
  USING (((SELECT auth.jwt()) ->> 'role'::text) = 'admin'::text);
