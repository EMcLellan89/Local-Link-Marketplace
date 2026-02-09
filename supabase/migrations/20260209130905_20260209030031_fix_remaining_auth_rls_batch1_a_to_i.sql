/*
  # Optimize Remaining Auth RLS - Batch 1: Tables A-I
  
  1. Tables Optimized (Alphabetically A-I)
    - academy_progress
    - ai_assistant_conversations (2 policies → 1, consolidated)
    - ai_bot_subscriptions
    - appointments
    - bank_connections
    - blog_posts
    - budget_buster_users
    - client_vault_artifacts
    - crm_activities
    - crm_companies
    - crm_deals
    - crm_leads
    - crm_migration_requests
    - crm_subscriptions
    - crm_tasks
    - customer_asset_grants
    - customers
    - deal_locations
    - dev_mode_config
    - dfy_job_submissions
    - dfy_jobs
    - dfy_onboarding
    - ecommerce_orders
    - email_campaigns
    - email_templates
    - expenses
    - financial_plans
    - gift_card_templates
    - in_app_nudges
    - invoice_items
    - invoice_payments
    - invoices
  
  2. Changes
    - Wrap all auth.uid() calls in (select auth.uid())
    - Remove nested SELECT auth.uid() calls
    - Maintain exact same access control logic
*/

-- academy_progress
DROP POLICY IF EXISTS "Users can manage own progress" ON academy_progress;
CREATE POLICY "Users can manage own progress"
  ON academy_progress FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ai_assistant_conversations (consolidate 2 → 1)
DROP POLICY IF EXISTS "Users can manage own conversations" ON ai_assistant_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can manage own conversations"
  ON ai_assistant_conversations FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ai_bot_subscriptions
DROP POLICY IF EXISTS "Users can manage own bot subscriptions" ON ai_bot_subscriptions;
CREATE POLICY "Users can manage own bot subscriptions"
  ON ai_bot_subscriptions FOR ALL
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- appointments
DROP POLICY IF EXISTS "Customers can manage own appointments" ON appointments;
CREATE POLICY "Customers can manage own appointments"
  ON appointments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = appointments.customer_id
        AND c.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = appointments.customer_id
        AND c.user_id = (select auth.uid())
    )
  );

-- bank_connections
DROP POLICY IF EXISTS "Merchants can manage own bank connections" ON bank_connections;
CREATE POLICY "Merchants can manage own bank connections"
  ON bank_connections FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT user_id FROM merchants
      WHERE id = bank_connections.merchant_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT user_id FROM merchants
      WHERE id = bank_connections.merchant_id
    )
  );

-- blog_posts
DROP POLICY IF EXISTS "Authors can manage own posts" ON blog_posts;
CREATE POLICY "Authors can manage own posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners p
      WHERE p.id = blog_posts.author_id
        AND p.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM partners p
      WHERE p.id = blog_posts.author_id
        AND p.user_id = (select auth.uid())
    )
  );

-- budget_buster_users
DROP POLICY IF EXISTS "Users can update own budget data" ON budget_buster_users;
CREATE POLICY "Users can update own budget data"
  ON budget_buster_users FOR UPDATE
  TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

-- client_vault_artifacts
DROP POLICY IF EXISTS "Admin can manage vault artifacts" ON client_vault_artifacts;
CREATE POLICY "Admin can manage vault artifacts"
  ON client_vault_artifacts FOR ALL
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

-- crm_activities
DROP POLICY IF EXISTS "Merchants can manage own CRM activities" ON crm_activities;
CREATE POLICY "Merchants can manage own CRM activities"
  ON crm_activities FOR ALL
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

-- crm_companies
DROP POLICY IF EXISTS "Team members can manage their assigned companies" ON crm_companies;
CREATE POLICY "Team members can manage their assigned companies"
  ON crm_companies FOR ALL
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

-- crm_deals
DROP POLICY IF EXISTS "Team members can manage their assigned deals" ON crm_deals;
CREATE POLICY "Team members can manage their assigned deals"
  ON crm_deals FOR ALL
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

-- crm_leads
DROP POLICY IF EXISTS "Merchants can manage own leads" ON crm_leads;
CREATE POLICY "Merchants can manage own leads"
  ON crm_leads FOR ALL
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

-- crm_migration_requests
DROP POLICY IF EXISTS "Merchants can update own migration requests" ON crm_migration_requests;
CREATE POLICY "Merchants can update own migration requests"
  ON crm_migration_requests FOR UPDATE
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

-- crm_subscriptions
DROP POLICY IF EXISTS "Merchants can update their subscription" ON crm_subscriptions;
CREATE POLICY "Merchants can update their subscription"
  ON crm_subscriptions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE id = crm_subscriptions.merchant_id
        AND user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE id = crm_subscriptions.merchant_id
        AND user_id = (select auth.uid())
    )
  );

-- crm_tasks
DROP POLICY IF EXISTS "Merchants can manage own tasks" ON crm_tasks;
CREATE POLICY "Merchants can manage own tasks"
  ON crm_tasks FOR ALL
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

-- customer_asset_grants
DROP POLICY IF EXISTS "customer_grants_own" ON customer_asset_grants;
CREATE POLICY "customer_grants_own"
  ON customer_asset_grants FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- customers
DROP POLICY IF EXISTS "Customers can manage own data" ON customers;
CREATE POLICY "Customers can manage own data"
  ON customers FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- deal_locations
DROP POLICY IF EXISTS "Merchants can manage deal locations" ON deal_locations;
CREATE POLICY "Merchants can manage deal locations"
  ON deal_locations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM deals d
      JOIN merchants m ON m.id = d.merchant_id
      WHERE d.id = deal_locations.deal_id
        AND m.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM deals d
      JOIN merchants m ON m.id = d.merchant_id
      WHERE d.id = deal_locations.deal_id
        AND m.user_id = (select auth.uid())
    )
  );

-- dev_mode_config
DROP POLICY IF EXISTS "Admin full access to dev mode config" ON dev_mode_config;
CREATE POLICY "Admin full access to dev mode config"
  ON dev_mode_config FOR ALL
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

-- dfy_job_submissions
DROP POLICY IF EXISTS "Admins can manage submissions" ON dfy_job_submissions;
CREATE POLICY "Admins can manage submissions"
  ON dfy_job_submissions FOR ALL
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

-- dfy_jobs (bug fix: was checking selected_partner_id = auth.uid() directly)
DROP POLICY IF EXISTS "Partners can update their assigned jobs" ON dfy_jobs;
CREATE POLICY "Partners can update their assigned jobs"
  ON dfy_jobs FOR UPDATE
  TO authenticated
  USING (
    selected_partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    selected_partner_id IN (
      SELECT id FROM partners
      WHERE user_id = (select auth.uid())
    )
  );

-- dfy_onboarding
DROP POLICY IF EXISTS "Users can update own onboarding" ON dfy_onboarding;
CREATE POLICY "Users can update own onboarding"
  ON dfy_onboarding FOR UPDATE
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM dfy_orders
      WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    order_id IN (
      SELECT id FROM dfy_orders
      WHERE user_id = (select auth.uid())
    )
  );

-- ecommerce_orders (fix nested auth.uid())
DROP POLICY IF EXISTS "Merchants update their orders" ON ecommerce_orders;
CREATE POLICY "Merchants update their orders"
  ON ecommerce_orders FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT user_id FROM merchants
      WHERE id = ecommerce_orders.merchant_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT user_id FROM merchants
      WHERE id = ecommerce_orders.merchant_id
    )
  );

-- email_campaigns
DROP POLICY IF EXISTS "Merchants can manage own campaigns" ON email_campaigns;
CREATE POLICY "Merchants can manage own campaigns"
  ON email_campaigns FOR ALL
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

-- email_templates
DROP POLICY IF EXISTS "Merchants can manage own templates" ON email_templates;
CREATE POLICY "Merchants can manage own templates"
  ON email_templates FOR ALL
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

-- expenses (fix nested auth.uid())
DROP POLICY IF EXISTS "Merchants can update own expenses" ON expenses;
CREATE POLICY "Merchants can update own expenses"
  ON expenses FOR UPDATE
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

-- financial_plans
DROP POLICY IF EXISTS "Admin can manage financial plans" ON financial_plans;
CREATE POLICY "Admin can manage financial plans"
  ON financial_plans FOR ALL
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

-- gift_card_templates (fix nested auth.uid())
DROP POLICY IF EXISTS "gift_card_templates_update_merchant" ON gift_card_templates;
CREATE POLICY "gift_card_templates_update_merchant"
  ON gift_card_templates FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT user_id FROM merchants
      WHERE id = gift_card_templates.merchant_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT user_id FROM merchants
      WHERE id = gift_card_templates.merchant_id
    )
  );

-- in_app_nudges (fix nested auth.uid())
DROP POLICY IF EXISTS "Users can update their own nudges" ON in_app_nudges;
CREATE POLICY "Users can update their own nudges"
  ON in_app_nudges FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- invoice_items
DROP POLICY IF EXISTS "Merchants can manage own invoice items" ON invoice_items;
CREATE POLICY "Merchants can manage own invoice items"
  ON invoice_items FOR ALL
  TO authenticated
  USING (
    invoice_id IN (
      SELECT i.id
      FROM invoices i
      JOIN merchants m ON m.id = i.merchant_id
      WHERE m.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    invoice_id IN (
      SELECT i.id
      FROM invoices i
      JOIN merchants m ON m.id = i.merchant_id
      WHERE m.user_id = (select auth.uid())
    )
  );

-- invoice_payments (fix nested auth.uid())
DROP POLICY IF EXISTS "Merchants can update own payments" ON invoice_payments;
CREATE POLICY "Merchants can update own payments"
  ON invoice_payments FOR UPDATE
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

-- invoices
DROP POLICY IF EXISTS "Merchants can manage own invoices" ON invoices;
CREATE POLICY "Merchants can manage own invoices"
  ON invoices FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT user_id FROM merchants
      WHERE id = invoices.merchant_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT user_id FROM merchants
      WHERE id = invoices.merchant_id
    )
  );
