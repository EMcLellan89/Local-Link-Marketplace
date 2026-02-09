/*
  # Fix Auth RLS Performance - Batch 4: Partner Tables (Corrected)

  This migration optimizes RLS policies on partner-related tables by wrapping
  auth function calls in SELECT statements for better performance.

  ## Tables Optimized:
  - partner_certifications
  - partner_crm_contacts
  - partner_crm_deals
  - partner_crm_subscriptions
  - partner_outreach_logs
  - partner_referral_links
  - partner_tracking_links
  - partner_tax_payments
  - partner_subscriptions

  ## Performance Impact:
  Auth functions will be evaluated once per query instead of per row.
*/

-- partner_certifications
DROP POLICY IF EXISTS "Partners can view own certifications" ON partner_certifications;

CREATE POLICY "Partners can view own certifications"
  ON partner_certifications FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ));

-- partner_crm_contacts
DROP POLICY IF EXISTS "Partners can view own CRM contacts" ON partner_crm_contacts;
DROP POLICY IF EXISTS "Partners can manage own CRM contacts" ON partner_crm_contacts;

CREATE POLICY "Partners can view own CRM contacts"
  ON partner_crm_contacts FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ));

CREATE POLICY "Partners can manage own CRM contacts"
  ON partner_crm_contacts FOR ALL
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ))
  WITH CHECK ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ));

-- partner_crm_deals
DROP POLICY IF EXISTS "Partners can view own CRM deals" ON partner_crm_deals;
DROP POLICY IF EXISTS "Partners can manage own CRM deals" ON partner_crm_deals;

CREATE POLICY "Partners can view own CRM deals"
  ON partner_crm_deals FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ));

CREATE POLICY "Partners can manage own CRM deals"
  ON partner_crm_deals FOR ALL
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ))
  WITH CHECK ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ));

-- partner_crm_subscriptions
DROP POLICY IF EXISTS "Partners can view own CRM subscription" ON partner_crm_subscriptions;
DROP POLICY IF EXISTS "Partners can manage own CRM subscription" ON partner_crm_subscriptions;

CREATE POLICY "Partners can view own CRM subscription"
  ON partner_crm_subscriptions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ));

CREATE POLICY "Partners can manage own CRM subscription"
  ON partner_crm_subscriptions FOR ALL
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ))
  WITH CHECK ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ));

-- partner_outreach_logs
DROP POLICY IF EXISTS "Partners can view own outreach logs" ON partner_outreach_logs;
DROP POLICY IF EXISTS "Partners can manage own outreach logs" ON partner_outreach_logs;

CREATE POLICY "Partners can view own outreach logs"
  ON partner_outreach_logs FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ));

CREATE POLICY "Partners can manage own outreach logs"
  ON partner_outreach_logs FOR ALL
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ))
  WITH CHECK ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ));

-- partner_referral_links
DROP POLICY IF EXISTS "Partners can view own referral links" ON partner_referral_links;

CREATE POLICY "Partners can view own referral links"
  ON partner_referral_links FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ));

-- partner_tracking_links
DROP POLICY IF EXISTS "Partners can view own tracking links" ON partner_tracking_links;
DROP POLICY IF EXISTS "Partners can manage own tracking links" ON partner_tracking_links;

CREATE POLICY "Partners can view own tracking links"
  ON partner_tracking_links FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ));

CREATE POLICY "Partners can manage own tracking links"
  ON partner_tracking_links FOR ALL
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ))
  WITH CHECK ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ));

-- partner_tax_payments
DROP POLICY IF EXISTS "Partners can view own tax payments" ON partner_tax_payments;
DROP POLICY IF EXISTS "Partners can manage own tax payments" ON partner_tax_payments;

CREATE POLICY "Partners can view own tax payments"
  ON partner_tax_payments FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ));

CREATE POLICY "Partners can manage own tax payments"
  ON partner_tax_payments FOR ALL
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ))
  WITH CHECK ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ));

-- partner_subscriptions
DROP POLICY IF EXISTS "Partners can view own subscriptions" ON partner_subscriptions;

CREATE POLICY "Partners can view own subscriptions"
  ON partner_subscriptions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ));