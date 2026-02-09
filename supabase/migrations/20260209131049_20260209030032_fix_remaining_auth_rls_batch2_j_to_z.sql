/*
  # Optimize Remaining Auth RLS - Batch 2: Tables J-Z
  
  1. Tables Optimized (Alphabetically J-Z)
    - job_assignments
    - lesson_progress
    - ll_autoscale_clients
    - ll_brand_profiles
    - ll_partners
    - loyalty_contract_uploads
    - marketplace_affiliate_commissions
    - marketplace_affiliates
    - merchant_applications
    - merchant_campaign_installs
    - merchant_content_installs
    - merchant_crm_preferences
    - merchant_locations
    - merchant_orders
    - merchant_subscriptions
    - merchants (2 policies → 1, consolidated)
    - milestone_badge_audit_log
    - milestone_badge_rules
    - milestone_system_events
    - notifications
    - onboarding_progress
    - outreach_logs
    - partner_accounting_transactions
    - partner_badges
    - partner_bank_accounts
    - partner_campaigns
    - partner_certifications
    - partner_certs
    - partner_crm_* (7 tables)
    - partner_notifications (2 policies → 1, consolidated, fixed bug)
    - partner_onboarding_progress
    - partner_outreach_logs
    - partner_playbook_progress (2 policies → 1, consolidated)
    - partner_referral_links
    - partner_subscriptions
    - partner_tax_payments
    - partner_tax_settings
    - partner_tracking_links
    - partners
    - paybright_config
    - plan_pricing
    - profiles
    - project_assignments (2 policies)
    - reviews
    - story_* (5 tables)
    - team_* (4 tables)
    - twilio_* (6 tables)
    - ugc_creators
    - ugc_orders
    - white_label_licenses
    - white_label_settings (2 policies)
  
  2. Changes
    - Wrap all auth.uid() calls in (select auth.uid())
    - Remove nested SELECT auth.uid() calls
    - Fix bug in partner_notifications (was checking partner_id = auth.uid() directly)
    - Maintain exact same access control logic
*/

-- job_assignments
DROP POLICY IF EXISTS "job_assignments: partner update own status" ON job_assignments;
CREATE POLICY "job_assignments: partner update own status"
  ON job_assignments FOR UPDATE
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- lesson_progress (fix nested auth.uid())
DROP POLICY IF EXISTS "Users can update their own progress" ON lesson_progress;
CREATE POLICY "Users can update their own progress"
  ON lesson_progress FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ll_autoscale_clients
DROP POLICY IF EXISTS "Partners can manage own autoscale clients" ON ll_autoscale_clients;
CREATE POLICY "Partners can manage own autoscale clients"
  ON ll_autoscale_clients FOR ALL
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- ll_brand_profiles
DROP POLICY IF EXISTS "Partners can manage own brand profile" ON ll_brand_profiles;
CREATE POLICY "Partners can manage own brand profile"
  ON ll_brand_profiles FOR ALL
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- ll_partners
DROP POLICY IF EXISTS "Admins can manage LL partners" ON ll_partners;
CREATE POLICY "Admins can manage LL partners"
  ON ll_partners FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- loyalty_contract_uploads (fix nested auth.uid())
DROP POLICY IF EXISTS "Merchants can update own contract uploads" ON loyalty_contract_uploads;
CREATE POLICY "Merchants can update own contract uploads"
  ON loyalty_contract_uploads FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- marketplace_affiliate_commissions (fix nested auth.uid())
DROP POLICY IF EXISTS "Admins can update marketplace commissions" ON marketplace_affiliate_commissions;
CREATE POLICY "Admins can update marketplace commissions"
  ON marketplace_affiliate_commissions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- marketplace_affiliates (fix nested auth.uid())
DROP POLICY IF EXISTS "Marketplace affiliates can update own profile" ON marketplace_affiliates;
CREATE POLICY "Marketplace affiliates can update own profile"
  ON marketplace_affiliates FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- merchant_applications (fix nested auth.uid())
DROP POLICY IF EXISTS "Users can update own pending applications" ON merchant_applications;
CREATE POLICY "Users can update own pending applications"
  ON merchant_applications FOR UPDATE
  TO authenticated
  USING (
    email = (
      SELECT email::text
      FROM auth.users
      WHERE id = (select auth.uid())
    )
    AND status = 'pending'
  )
  WITH CHECK (
    email = (
      SELECT email::text
      FROM auth.users
      WHERE id = (select auth.uid())
    )
    AND status = 'pending'
  );

-- merchant_campaign_installs
DROP POLICY IF EXISTS "Merchants can manage own campaign installs" ON merchant_campaign_installs;
CREATE POLICY "Merchants can manage own campaign installs"
  ON merchant_campaign_installs FOR ALL
  TO authenticated
  USING (
    org_id IN (
      SELECT org_id FROM org_members
      WHERE profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM org_members
      WHERE profile_id = (select auth.uid())
    )
  );

-- merchant_content_installs
DROP POLICY IF EXISTS "Merchants can manage own content installs" ON merchant_content_installs;
CREATE POLICY "Merchants can manage own content installs"
  ON merchant_content_installs FOR ALL
  TO authenticated
  USING (
    org_id IN (
      SELECT org_id FROM org_members
      WHERE profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM org_members
      WHERE profile_id = (select auth.uid())
    )
  );

-- merchant_crm_preferences
DROP POLICY IF EXISTS "Merchants can update own CRM preferences" ON merchant_crm_preferences;
CREATE POLICY "Merchants can update own CRM preferences"
  ON merchant_crm_preferences FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- merchant_locations
DROP POLICY IF EXISTS "Merchants can manage own locations" ON merchant_locations;
CREATE POLICY "Merchants can manage own locations"
  ON merchant_locations FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- merchant_orders
DROP POLICY IF EXISTS "Merchants can manage own orders" ON merchant_orders;
CREATE POLICY "Merchants can manage own orders"
  ON merchant_orders FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- merchant_subscriptions
DROP POLICY IF EXISTS "Merchants can manage own subscriptions" ON merchant_subscriptions;
CREATE POLICY "Merchants can manage own subscriptions"
  ON merchant_subscriptions FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- merchants (consolidate 2 policies → 1)
DROP POLICY IF EXISTS "Merchants can update own data" ON merchants;
DROP POLICY IF EXISTS "Merchants can update own record" ON merchants;
CREATE POLICY "Merchants can update own data"
  ON merchants FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- milestone_badge_audit_log
DROP POLICY IF EXISTS "Admins can manage badge audit" ON milestone_badge_audit_log;
CREATE POLICY "Admins can manage badge audit"
  ON milestone_badge_audit_log FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

-- milestone_badge_rules
DROP POLICY IF EXISTS "Admins can manage badge rules" ON milestone_badge_rules;
CREATE POLICY "Admins can manage badge rules"
  ON milestone_badge_rules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

-- milestone_system_events
DROP POLICY IF EXISTS "Admins can manage system events" ON milestone_system_events;
CREATE POLICY "Admins can manage system events"
  ON milestone_system_events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

-- notifications
DROP POLICY IF EXISTS "Unified notification update" ON notifications;
CREATE POLICY "Unified notification update"
  ON notifications FOR UPDATE
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers
      WHERE user_id = (select auth.uid())
    )
    OR merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    customer_id IN (
      SELECT id FROM customers
      WHERE user_id = (select auth.uid())
    )
    OR merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- onboarding_progress (fix nested auth.uid())
DROP POLICY IF EXISTS "onboarding_update_own" ON onboarding_progress;
CREATE POLICY "onboarding_update_own"
  ON onboarding_progress FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- outreach_logs
DROP POLICY IF EXISTS "outreach_logs_admin_manage" ON outreach_logs;
CREATE POLICY "outreach_logs_admin_manage"
  ON outreach_logs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

-- partner_accounting_transactions
DROP POLICY IF EXISTS "Partners can manage own transactions" ON partner_accounting_transactions;
CREATE POLICY "Partners can manage own transactions"
  ON partner_accounting_transactions FOR ALL
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- partner_badges
DROP POLICY IF EXISTS "partner_badges_admin_manage" ON partner_badges;
CREATE POLICY "partner_badges_admin_manage"
  ON partner_badges FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

-- partner_bank_accounts
DROP POLICY IF EXISTS "Partners can manage own bank accounts" ON partner_bank_accounts;
CREATE POLICY "Partners can manage own bank accounts"
  ON partner_bank_accounts FOR ALL
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- partner_campaigns
DROP POLICY IF EXISTS "Partners can manage own campaigns" ON partner_campaigns;
CREATE POLICY "Partners can manage own campaigns"
  ON partner_campaigns FOR ALL
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- partner_certifications
DROP POLICY IF EXISTS "Admin full access to partner certifications" ON partner_certifications;
CREATE POLICY "Admin full access to partner certifications"
  ON partner_certifications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- partner_certs
DROP POLICY IF EXISTS "partner_certs_admin_manage" ON partner_certs;
CREATE POLICY "partner_certs_admin_manage"
  ON partner_certs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = (select auth.uid())
    )
  );

-- partner_crm_companies
DROP POLICY IF EXISTS "Partners can manage own companies" ON partner_crm_companies;
CREATE POLICY "Partners can manage own companies"
  ON partner_crm_companies FOR ALL
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- partner_crm_contacts
DROP POLICY IF EXISTS "Partners can manage own contacts" ON partner_crm_contacts;
CREATE POLICY "Partners can manage own contacts"
  ON partner_crm_contacts FOR ALL
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- partner_crm_deal_notes
DROP POLICY IF EXISTS "Partners can manage own deal notes" ON partner_crm_deal_notes;
CREATE POLICY "Partners can manage own deal notes"
  ON partner_crm_deal_notes FOR ALL
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- partner_crm_deal_products
DROP POLICY IF EXISTS "Partners can manage own deal products" ON partner_crm_deal_products;
CREATE POLICY "Partners can manage own deal products"
  ON partner_crm_deal_products FOR ALL
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- partner_crm_deals
DROP POLICY IF EXISTS "Partners can manage own deals" ON partner_crm_deals;
CREATE POLICY "Partners can manage own deals"
  ON partner_crm_deals FOR ALL
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- partner_crm_subscriptions
DROP POLICY IF EXISTS "Partners can manage own CRM subscription" ON partner_crm_subscriptions;
CREATE POLICY "Partners can manage own CRM subscription"
  ON partner_crm_subscriptions FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT user_id FROM partners
      WHERE id = partner_crm_subscriptions.partner_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT user_id FROM partners
      WHERE id = partner_crm_subscriptions.partner_id
    )
  );

-- partner_notifications (consolidate 2 policies → 1, fix bug)
DROP POLICY IF EXISTS "Partners can update own notifications" ON partner_notifications;
DROP POLICY IF EXISTS "Partners can update their own notifications" ON partner_notifications;
CREATE POLICY "Partners can update own notifications"
  ON partner_notifications FOR UPDATE
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- partner_onboarding_progress (fix nested auth.uid())
DROP POLICY IF EXISTS "Partners can update own progress" ON partner_onboarding_progress;
CREATE POLICY "Partners can update own progress"
  ON partner_onboarding_progress FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT user_id FROM partners
      WHERE id = partner_onboarding_progress.partner_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT user_id FROM partners
      WHERE id = partner_onboarding_progress.partner_id
    )
  );

-- partner_outreach_logs
DROP POLICY IF EXISTS "Partners can manage own outreach logs" ON partner_outreach_logs;
CREATE POLICY "Partners can manage own outreach logs"
  ON partner_outreach_logs FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT user_id FROM partners
      WHERE id = partner_outreach_logs.partner_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT user_id FROM partners
      WHERE id = partner_outreach_logs.partner_id
    )
  );

-- partner_playbook_progress (consolidate 2 policies → 1)
DROP POLICY IF EXISTS "Partners can modify own progress" ON partner_playbook_progress;
DROP POLICY IF EXISTS "Partners can update own progress" ON partner_playbook_progress;
CREATE POLICY "Partners can update own progress"
  ON partner_playbook_progress FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- partner_referral_links
DROP POLICY IF EXISTS "Partners can manage own referral links" ON partner_referral_links;
CREATE POLICY "Partners can manage own referral links"
  ON partner_referral_links FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT user_id FROM partners
      WHERE id = partner_referral_links.partner_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT user_id FROM partners
      WHERE id = partner_referral_links.partner_id
    )
  );

-- partner_subscriptions
DROP POLICY IF EXISTS "Partners can manage own subscriptions" ON partner_subscriptions;
CREATE POLICY "Partners can manage own subscriptions"
  ON partner_subscriptions FOR ALL
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- partner_tax_payments
DROP POLICY IF EXISTS "Partners can manage own tax payments" ON partner_tax_payments;
CREATE POLICY "Partners can manage own tax payments"
  ON partner_tax_payments FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT user_id FROM partners
      WHERE id = partner_tax_payments.partner_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT user_id FROM partners
      WHERE id = partner_tax_payments.partner_id
    )
  );

-- partner_tax_settings
DROP POLICY IF EXISTS "Admin can manage all tax settings" ON partner_tax_settings;
CREATE POLICY "Admin can manage all tax settings"
  ON partner_tax_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
    OR partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
    OR partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- partner_tracking_links
DROP POLICY IF EXISTS "Partners can manage own tracking links" ON partner_tracking_links;
CREATE POLICY "Partners can manage own tracking links"
  ON partner_tracking_links FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT user_id FROM partners
      WHERE id = partner_tracking_links.partner_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT user_id FROM partners
      WHERE id = partner_tracking_links.partner_id
    )
  );

-- partners
DROP POLICY IF EXISTS "Partners can manage own data" ON partners;
CREATE POLICY "Partners can manage own data"
  ON partners FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- paybright_config (fix nested auth.uid())
DROP POLICY IF EXISTS "Merchants can update own PayBright config" ON paybright_config;
CREATE POLICY "Merchants can update own PayBright config"
  ON paybright_config FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- plan_pricing
DROP POLICY IF EXISTS "Admin can manage plan pricing" ON plan_pricing;
CREATE POLICY "Admin can manage plan pricing"
  ON plan_pricing FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- profiles
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- project_assignments
DROP POLICY IF EXISTS "Managers manage team assignments" ON project_assignments;
DROP POLICY IF EXISTS "Team members update own assignment status" ON project_assignments;

CREATE POLICY "Managers manage team assignments"
  ON project_assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM team_projects tp
      JOIN team_members tm ON tp.manager_id = tm.id
      WHERE tp.id = project_assignments.project_id
        AND tm.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM team_projects tp
      JOIN team_members tm ON tp.manager_id = tm.id
      WHERE tp.id = project_assignments.project_id
        AND tm.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Team members update own assignment status"
  ON project_assignments FOR UPDATE
  TO authenticated
  USING (
    assigned_to IN (
      SELECT id FROM team_members
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    assigned_to IN (
      SELECT id FROM team_members
      WHERE user_id = (select auth.uid())
    )
  );

-- reviews
DROP POLICY IF EXISTS "Customers can manage own reviews" ON reviews;
CREATE POLICY "Customers can manage own reviews"
  ON reviews FOR ALL
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    customer_id IN (
      SELECT id FROM customers
      WHERE user_id = (select auth.uid())
    )
  );

-- story_audit_logs
DROP POLICY IF EXISTS "story_audit_logs_own" ON story_audit_logs;
CREATE POLICY "story_audit_logs_own"
  ON story_audit_logs FOR ALL
  TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

-- story_books
DROP POLICY IF EXISTS "story_books_own" ON story_books;
CREATE POLICY "story_books_own"
  ON story_books FOR ALL
  TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

-- story_jobs
DROP POLICY IF EXISTS "story_jobs_own" ON story_jobs;
CREATE POLICY "story_jobs_own"
  ON story_jobs FOR ALL
  TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

-- story_pages
DROP POLICY IF EXISTS "story_pages_own" ON story_pages;
CREATE POLICY "story_pages_own"
  ON story_pages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM story_books b
      WHERE b.id = story_pages.book_id
        AND b.profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM story_books b
      WHERE b.id = story_pages.book_id
        AND b.profile_id = (select auth.uid())
    )
  );

-- story_projects
DROP POLICY IF EXISTS "story_projects_own" ON story_projects;
CREATE POLICY "story_projects_own"
  ON story_projects FOR ALL
  TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

-- team_member_commissions
DROP POLICY IF EXISTS "Owners can manage own team commissions" ON team_member_commissions;
CREATE POLICY "Owners can manage own team commissions"
  ON team_member_commissions FOR ALL
  TO authenticated
  USING (
    team_member_id IN (
      SELECT tm.id
      FROM team_members tm
      WHERE tm.id IN (
        SELECT tm2.id
        FROM team_members tm2
        WHERE tm2.manager_id IN (
          SELECT id FROM team_members
          WHERE user_id = (select auth.uid())
        )
      )
      OR tm.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    team_member_id IN (
      SELECT tm.id
      FROM team_members tm
      WHERE tm.id IN (
        SELECT tm2.id
        FROM team_members tm2
        WHERE tm2.manager_id IN (
          SELECT id FROM team_members
          WHERE user_id = (select auth.uid())
        )
      )
      OR tm.user_id = (select auth.uid())
    )
  );

-- team_member_goals
DROP POLICY IF EXISTS "Managers can manage team goals" ON team_member_goals;
CREATE POLICY "Managers can manage team goals"
  ON team_member_goals FOR ALL
  TO authenticated
  USING (
    team_member_id IN (
      SELECT tm.id
      FROM team_members tm
      WHERE tm.manager_id IN (
        SELECT id FROM team_members
        WHERE user_id = (select auth.uid())
      )
      OR tm.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    team_member_id IN (
      SELECT tm.id
      FROM team_members tm
      WHERE tm.manager_id IN (
        SELECT id FROM team_members
        WHERE user_id = (select auth.uid())
      )
      OR tm.user_id = (select auth.uid())
    )
  );

-- team_members
DROP POLICY IF EXISTS "Team members can update their own profile" ON team_members;
CREATE POLICY "Team members can update their own profile"
  ON team_members FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- team_monthly_goals
DROP POLICY IF EXISTS "Managers manage team monthly goals" ON team_monthly_goals;
DROP POLICY IF EXISTS "Team members update monthly goal progress" ON team_monthly_goals;

CREATE POLICY "Managers manage team monthly goals"
  ON team_monthly_goals FOR ALL
  TO authenticated
  USING (
    manager_id IN (
      SELECT id FROM team_members
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    manager_id IN (
      SELECT id FROM team_members
      WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Team members update monthly goal progress"
  ON team_monthly_goals FOR UPDATE
  TO authenticated
  USING (
    team_member_id IN (
      SELECT id FROM team_members
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    team_member_id IN (
      SELECT id FROM team_members
      WHERE user_id = (select auth.uid())
    )
  );

-- twilio_call_logs (fix nested auth.uid())
DROP POLICY IF EXISTS "Merchants can update own call logs" ON twilio_call_logs;
CREATE POLICY "Merchants can update own call logs"
  ON twilio_call_logs FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- twilio_call_queues (fix nested auth.uid())
DROP POLICY IF EXISTS "Merchants can update own call queue" ON twilio_call_queues;
CREATE POLICY "Merchants can update own call queue"
  ON twilio_call_queues FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- twilio_configurations (fix nested auth.uid())
DROP POLICY IF EXISTS "Merchants can update own Twilio config" ON twilio_configurations;
CREATE POLICY "Merchants can update own Twilio config"
  ON twilio_configurations FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- twilio_email_logs (fix nested auth.uid())
DROP POLICY IF EXISTS "Merchants can update own email logs" ON twilio_email_logs;
CREATE POLICY "Merchants can update own email logs"
  ON twilio_email_logs FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- twilio_sms_logs (fix nested auth.uid())
DROP POLICY IF EXISTS "Merchants can update own SMS logs" ON twilio_sms_logs;
CREATE POLICY "Merchants can update own SMS logs"
  ON twilio_sms_logs FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- twilio_voicemails (fix nested auth.uid())
DROP POLICY IF EXISTS "Merchants can update own voicemails" ON twilio_voicemails;
CREATE POLICY "Merchants can update own voicemails"
  ON twilio_voicemails FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants
      WHERE user_id = (select auth.uid())
    )
  );

-- ugc_creators (fix nested auth.uid())
DROP POLICY IF EXISTS "Creators can update own profile" ON ugc_creators;
CREATE POLICY "Creators can update own profile"
  ON ugc_creators FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ugc_orders (fix nested auth.uid())
DROP POLICY IF EXISTS "Creators can update assigned orders" ON ugc_orders;
CREATE POLICY "Creators can update assigned orders"
  ON ugc_orders FOR UPDATE
  TO authenticated
  USING (
    creator_id IN (
      SELECT id FROM ugc_creators
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    creator_id IN (
      SELECT id FROM ugc_creators
      WHERE user_id = (select auth.uid())
    )
  );

-- white_label_licenses
DROP POLICY IF EXISTS "Partners can manage own white label licenses" ON white_label_licenses;
CREATE POLICY "Partners can manage own white label licenses"
  ON white_label_licenses FOR ALL
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- white_label_settings
DROP POLICY IF EXISTS "Partners can manage own white label settings" ON white_label_settings;
DROP POLICY IF EXISTS "admin_white_label_all" ON white_label_settings;

CREATE POLICY "admin_white_label_all"
  ON white_label_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Partners can manage own white label settings"
  ON white_label_settings FOR ALL
  TO authenticated
  USING (
    org_id = (select auth.uid())
    AND has_enterprise_tier((select auth.uid()))
  )
  WITH CHECK (
    org_id = (select auth.uid())
    AND has_enterprise_tier((select auth.uid()))
  );
