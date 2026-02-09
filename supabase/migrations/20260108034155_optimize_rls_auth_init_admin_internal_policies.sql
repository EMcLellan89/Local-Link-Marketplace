/*
  # Optimize RLS Auth Initialization - Admin and Internal Team Policies

  Fixes Auth RLS Initialization Plan issues for admin/internal team policies
  that use auth.jwt() for role checking.

  Tables optimized:
  - customer_activity_log
  - customer_business_relationships
  - customer_support_tickets
  - email_communications
  - internal_accounting_ledger
  - internal_invoices
  - partner_onboarding_steps
  - product_commission_rules
  - swipe_templates
  - system_email_templates
  - ticket_messages
  - unified_sales
*/

-- customer_activity_log
DROP POLICY IF EXISTS "Internal team can manage activity log" ON public.customer_activity_log;
CREATE POLICY "Internal team can manage activity log"
  ON public.customer_activity_log
  FOR ALL
  TO authenticated
  USING (
    (select auth.jwt() ->> 'role') = ANY (ARRAY['admin'::text, 'internal_team'::text])
  )
  WITH CHECK (
    (select auth.jwt() ->> 'role') = ANY (ARRAY['admin'::text, 'internal_team'::text])
  );

-- customer_business_relationships
DROP POLICY IF EXISTS "Internal team can manage relationships" ON public.customer_business_relationships;
CREATE POLICY "Internal team can manage relationships"
  ON public.customer_business_relationships
  FOR ALL
  TO authenticated
  USING (
    (select auth.jwt() ->> 'role') = ANY (ARRAY['admin'::text, 'internal_team'::text])
  )
  WITH CHECK (
    (select auth.jwt() ->> 'role') = ANY (ARRAY['admin'::text, 'internal_team'::text])
  );

-- customer_support_tickets
DROP POLICY IF EXISTS "Internal team can manage tickets" ON public.customer_support_tickets;
CREATE POLICY "Internal team can manage tickets"
  ON public.customer_support_tickets
  FOR ALL
  TO authenticated
  USING (
    (select auth.jwt() ->> 'role') = ANY (ARRAY['admin'::text, 'internal_team'::text])
  )
  WITH CHECK (
    (select auth.jwt() ->> 'role') = ANY (ARRAY['admin'::text, 'internal_team'::text])
  );

-- email_communications
DROP POLICY IF EXISTS "Internal team can manage emails" ON public.email_communications;
CREATE POLICY "Internal team can manage emails"
  ON public.email_communications
  FOR ALL
  TO authenticated
  USING (
    (select auth.jwt() ->> 'role') = ANY (ARRAY['admin'::text, 'internal_team'::text])
  )
  WITH CHECK (
    (select auth.jwt() ->> 'role') = ANY (ARRAY['admin'::text, 'internal_team'::text])
  );

-- internal_accounting_ledger
DROP POLICY IF EXISTS "Accountants can manage ledger" ON public.internal_accounting_ledger;
CREATE POLICY "Accountants can manage ledger"
  ON public.internal_accounting_ledger
  FOR ALL
  TO authenticated
  USING (
    (select auth.jwt() ->> 'role') = ANY (ARRAY['admin'::text, 'accountant'::text])
  )
  WITH CHECK (
    (select auth.jwt() ->> 'role') = ANY (ARRAY['admin'::text, 'accountant'::text])
  );

-- internal_invoices
DROP POLICY IF EXISTS "Internal team can manage invoices" ON public.internal_invoices;
CREATE POLICY "Internal team can manage invoices"
  ON public.internal_invoices
  FOR ALL
  TO authenticated
  USING (
    (select auth.jwt() ->> 'role') = ANY (ARRAY['admin'::text, 'internal_team'::text])
  )
  WITH CHECK (
    (select auth.jwt() ->> 'role') = ANY (ARRAY['admin'::text, 'internal_team'::text])
  );

-- partner_onboarding_steps
DROP POLICY IF EXISTS "partner_onboarding_steps_manage_admin" ON public.partner_onboarding_steps;
CREATE POLICY "partner_onboarding_steps_manage_admin"
  ON public.partner_onboarding_steps
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = 'admin'::text)
  WITH CHECK ((select auth.jwt() ->> 'role') = 'admin'::text);

-- product_commission_rules
DROP POLICY IF EXISTS "product_commission_rules_manage_admin" ON public.product_commission_rules;
CREATE POLICY "product_commission_rules_manage_admin"
  ON public.product_commission_rules
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = 'admin'::text)
  WITH CHECK ((select auth.jwt() ->> 'role') = 'admin'::text);

-- swipe_templates
DROP POLICY IF EXISTS "swipe_templates_manage_admin" ON public.swipe_templates;
CREATE POLICY "swipe_templates_manage_admin"
  ON public.swipe_templates
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = 'admin'::text)
  WITH CHECK ((select auth.jwt() ->> 'role') = 'admin'::text);

-- system_email_templates
DROP POLICY IF EXISTS "system_email_templates_manage_admin" ON public.system_email_templates;
CREATE POLICY "system_email_templates_manage_admin"
  ON public.system_email_templates
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = 'admin'::text)
  WITH CHECK ((select auth.jwt() ->> 'role') = 'admin'::text);

-- ticket_messages
DROP POLICY IF EXISTS "Internal team can manage messages" ON public.ticket_messages;
CREATE POLICY "Internal team can manage messages"
  ON public.ticket_messages
  FOR ALL
  TO authenticated
  USING (
    (select auth.jwt() ->> 'role') = ANY (ARRAY['admin'::text, 'internal_team'::text])
  )
  WITH CHECK (
    (select auth.jwt() ->> 'role') = ANY (ARRAY['admin'::text, 'internal_team'::text])
  );

-- unified_sales
DROP POLICY IF EXISTS "Internal team can manage sales" ON public.unified_sales;
CREATE POLICY "Internal team can manage sales"
  ON public.unified_sales
  FOR ALL
  TO authenticated
  USING (
    (select auth.jwt() ->> 'role') = ANY (ARRAY['admin'::text, 'internal_team'::text])
  )
  WITH CHECK (
    (select auth.jwt() ->> 'role') = ANY (ARRAY['admin'::text, 'internal_team'::text])
  );
