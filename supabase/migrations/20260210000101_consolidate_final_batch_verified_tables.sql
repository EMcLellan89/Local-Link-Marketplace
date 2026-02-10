/*
  # Consolidate RLS Policies - Final Batch: Verified Simple Cases

  1. Problem
    - Multiple similar permissive policies need consolidation
    
  2. Tables Fixed (12 tables)
    - academy_progress (ALL): 2 → 1
    - email_campaigns (ALL): 2 → 1
    - email_templates (ALL): 2 → 1
    - course_lessons (SELECT): 2 → 1  
    - course_modules (SELECT): 2 → 1
    - crm_activities (ALL): 2 → 1
    - crm_leads (ALL): 2 → 1
    - crm_tasks (ALL): 2 → 1
    - customers (SELECT): 2 → 1
    - partners (SELECT): 2 → 1
    - merchants (SELECT): 2 → 1
    - customer_referrals (SELECT): 2 → 1 (keep more comprehensive)

  3. Security
    - No functional changes
*/

-- academy_progress
DROP POLICY IF EXISTS "Admins have full access to progress" ON academy_progress;
DROP POLICY IF EXISTS "Users can manage own progress" ON academy_progress;

CREATE POLICY "Academy progress access consolidated"
  ON academy_progress FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'))
  WITH CHECK (user_id = (SELECT auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- email_campaigns
DROP POLICY IF EXISTS "Merchants can manage own campaigns" ON email_campaigns;
DROP POLICY IF EXISTS "Merchants manage their email campaigns" ON email_campaigns;

CREATE POLICY "Email campaigns access consolidated"
  ON email_campaigns FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())) OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())) OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- email_templates
DROP POLICY IF EXISTS "Merchants can manage own templates" ON email_templates;
DROP POLICY IF EXISTS "Merchants manage their email templates" ON email_templates;

CREATE POLICY "Email templates access consolidated"
  ON email_templates FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())) OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())) OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- course_lessons
DROP POLICY IF EXISTS "Anyone can view course lessons" ON course_lessons;
DROP POLICY IF EXISTS "Users can view lessons for accessible courses" ON course_lessons;

CREATE POLICY "Course lessons access consolidated"
  ON course_lessons FOR SELECT TO authenticated USING (true);

-- course_modules
DROP POLICY IF EXISTS "Anyone can view course modules" ON course_modules;
DROP POLICY IF EXISTS "Users can view course modules for accessible courses" ON course_modules;

CREATE POLICY "Course modules access consolidated"
  ON course_modules FOR SELECT TO authenticated USING (true);

-- crm_activities
DROP POLICY IF EXISTS "Admin full access to CRM activities" ON crm_activities;
DROP POLICY IF EXISTS "Merchants can manage own CRM activities" ON crm_activities;

CREATE POLICY "CRM activities access consolidated"
  ON crm_activities FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())) OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())) OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- crm_leads
DROP POLICY IF EXISTS "Admin full access to CRM leads" ON crm_leads;
DROP POLICY IF EXISTS "Merchants can manage own leads" ON crm_leads;

CREATE POLICY "CRM leads access consolidated"
  ON crm_leads FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())) OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())) OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- crm_tasks
DROP POLICY IF EXISTS "Admin full access to CRM tasks" ON crm_tasks;
DROP POLICY IF EXISTS "Merchants can manage own tasks" ON crm_tasks;

CREATE POLICY "CRM tasks access consolidated"
  ON crm_tasks FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())) OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())) OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- customers
DROP POLICY IF EXISTS "Customers can view own data" ON customers;
DROP POLICY IF EXISTS "authenticated_select_customers_consolidated" ON customers;

CREATE POLICY "Customers access consolidated"
  ON customers FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- partners
DROP POLICY IF EXISTS "Partners can view own data" ON partners;
DROP POLICY IF EXISTS "authenticated_select_partners_consolidated" ON partners;

CREATE POLICY "Partners access consolidated"
  ON partners FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- merchants
DROP POLICY IF EXISTS "Merchants can view own data" ON merchants;
DROP POLICY IF EXISTS "Unified merchant access" ON merchants;

CREATE POLICY "Merchants access consolidated"
  ON merchants FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- customer_referrals - keep the more comprehensive "Unified" policy, drop the other
DROP POLICY IF EXISTS "authenticated_select_customer_referrals_consolidated" ON customer_referrals;
