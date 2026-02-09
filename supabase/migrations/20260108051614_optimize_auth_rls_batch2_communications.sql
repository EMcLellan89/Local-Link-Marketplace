/*
  # Optimize Auth RLS Performance - Batch 2: Communications & Webhooks
  
  1. Performance Optimization
    - Replace `auth.jwt()` and `auth.uid()` with `(select auth.jwt())` and `(select auth.uid())`
    - Affects 4 policies across communication and webhook tables
  
  2. Affected Tables & Policies
    - email_communications: Internal team can manage emails
    - external_business_webhooks: Internal team can manage webhooks
    - product_commission_rules: product_commission_rules_manage_admin
    - partner_onboarding_steps: partner_onboarding_steps_manage_admin
*/

-- email_communications
DROP POLICY IF EXISTS "Internal team can manage emails" ON email_communications;
CREATE POLICY "Internal team can manage emails"
  ON email_communications
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = ANY (ARRAY['admin', 'internal_team']));

-- external_business_webhooks
DROP POLICY IF EXISTS "Internal team can manage webhooks" ON external_business_webhooks;
CREATE POLICY "Internal team can manage webhooks"
  ON external_business_webhooks
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = ANY (ARRAY['admin', 'internal_team']));

-- product_commission_rules
DROP POLICY IF EXISTS "product_commission_rules_manage_admin" ON product_commission_rules;
CREATE POLICY "product_commission_rules_manage_admin"
  ON product_commission_rules
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = 'admin');

-- partner_onboarding_steps
DROP POLICY IF EXISTS "partner_onboarding_steps_manage_admin" ON partner_onboarding_steps;
CREATE POLICY "partner_onboarding_steps_manage_admin"
  ON partner_onboarding_steps
  FOR ALL
  TO authenticated
  USING ((select auth.jwt() ->> 'role') = 'admin');
