/*
  # Consolidate Multiple Permissive RLS Policies - Tables with 3 Policies

  1. Problem
    - Multiple permissive policies for the same command create query planning overhead
    - PostgreSQL ORs all permissive policies together, but having multiple policies is inefficient
    - Makes security model harder to understand and maintain

  2. Solution
    - Consolidate 3 policies into 1 comprehensive policy per command
    - Use OR logic within single policy for different access patterns
    - Maintain exact same access control behavior

  3. Tables Fixed (9 tables with 3 policies each)
    - profiles (SELECT): 3 → 1
    - merchant_orders (SELECT): 3 → 1
    - deal_transactions (SELECT): 3 → 1
    - jobs (SELECT): 3 → 1
    - creative_events (SELECT): 3 → 1
    - communications_subscriptions (SELECT): 3 → 1
    - business_coaching_bookings (SELECT): 3 → 1
    - accounting_employees (ALL): 3 → 1
    - blog_posts (ALL): 3 → 1

  4. Security
    - No functional change to access control
    - All existing access patterns preserved via OR logic
    - Uses cached auth.uid() for performance: (SELECT auth.uid())
*/

-- profiles: Consolidate 3 SELECT policies
DROP POLICY IF EXISTS "Enable read for all authenticated" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "authenticated_select_profiles_consolidated" ON profiles;

CREATE POLICY "Profiles access consolidated"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);  -- All authenticated users can view all profiles

-- merchant_orders: Consolidate 3 SELECT policies
DROP POLICY IF EXISTS "Admins can view all orders" ON merchant_orders;
DROP POLICY IF EXISTS "Merchants can view own orders" ON merchant_orders;
DROP POLICY IF EXISTS "authenticated_select_merchant_orders_consolidated" ON merchant_orders;

CREATE POLICY "Merchant orders access consolidated"
  ON merchant_orders FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

-- deal_transactions: Consolidate 3 SELECT policies
DROP POLICY IF EXISTS "Merchants view own deal_transactions" ON deal_transactions;
DROP POLICY IF EXISTS "Partners view own deal_transactions" ON deal_transactions;
DROP POLICY IF EXISTS "Users can view deal transactions" ON deal_transactions;

CREATE POLICY "Deal transactions access consolidated"
  ON deal_transactions FOR SELECT
  TO authenticated
  USING (
    deal_id IN (SELECT id FROM deals WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid()))) OR
    deal_id IN (SELECT id FROM deals WHERE partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid()))) OR
    customer_id IN (SELECT id FROM customers WHERE user_id = (SELECT auth.uid())) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

-- jobs: Consolidate 3 SELECT policies
DROP POLICY IF EXISTS "jobs: merchant read own" ON jobs;
DROP POLICY IF EXISTS "jobs: partner read assigned if assigned" ON jobs;
DROP POLICY IF EXISTS "jobs: partner read open only" ON jobs;

CREATE POLICY "Jobs access consolidated"
  ON jobs FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())) OR
    id IN (SELECT job_id FROM job_assignments WHERE partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid()))) OR
    (status = 'open' AND EXISTS (SELECT 1 FROM partners WHERE user_id = (SELECT auth.uid()))) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

-- creative_events: Consolidate 3 SELECT policies
DROP POLICY IF EXISTS "Admins can view all creative events" ON creative_events;
DROP POLICY IF EXISTS "Partners can view own creative events" ON creative_events;
DROP POLICY IF EXISTS "Users can view creative events for their profile" ON creative_events;

CREATE POLICY "Creative events access consolidated"
  ON creative_events FOR SELECT
  TO authenticated
  USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())) OR
    profile_id = (SELECT auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

-- communications_subscriptions: Consolidate 3 SELECT policies
DROP POLICY IF EXISTS "Internal team can view all communications subscriptions" ON communications_subscriptions;
DROP POLICY IF EXISTS "Merchants can view own communications subscription" ON communications_subscriptions;
DROP POLICY IF EXISTS "Partners can view own communications subscription" ON communications_subscriptions;

CREATE POLICY "Communications subscriptions access consolidated"
  ON communications_subscriptions FOR SELECT
  TO authenticated
  USING (
    (entity_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())) AND entity_type = 'merchant') OR
    (entity_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())) AND entity_type = 'partner') OR
    EXISTS (SELECT 1 FROM team_members WHERE user_id = (SELECT auth.uid())) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

-- business_coaching_bookings: Consolidate 3 SELECT policies
DROP POLICY IF EXISTS "Internal team can view all coaching bookings" ON business_coaching_bookings;
DROP POLICY IF EXISTS "Merchants can view own coaching bookings" ON business_coaching_bookings;
DROP POLICY IF EXISTS "Partners can view own coaching bookings" ON business_coaching_bookings;

CREATE POLICY "Business coaching bookings access consolidated"
  ON business_coaching_bookings FOR SELECT
  TO authenticated
  USING (
    (entity_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())) AND entity_type = 'merchant') OR
    (entity_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())) AND entity_type = 'partner') OR
    EXISTS (SELECT 1 FROM team_members WHERE user_id = (SELECT auth.uid())) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

-- accounting_employees: Consolidate 3 ALL policies
DROP POLICY IF EXISTS "Admins can manage employees" ON accounting_employees;
DROP POLICY IF EXISTS "Admins manage employees" ON accounting_employees;
DROP POLICY IF EXISTS "Team members can manage own record" ON accounting_employees;

CREATE POLICY "Accounting employees access consolidated"
  ON accounting_employees FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM team_members tm WHERE tm.id = team_member_id AND tm.user_id = (SELECT auth.uid())) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM team_members tm WHERE tm.id = team_member_id AND tm.user_id = (SELECT auth.uid())) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

-- blog_posts: Consolidate 3 ALL policies
DROP POLICY IF EXISTS "Admin can manage blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can manage own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can manage own posts" ON blog_posts;

CREATE POLICY "Blog posts access consolidated"
  ON blog_posts FOR ALL
  TO authenticated
  USING (
    author_id = (SELECT auth.uid()) OR
    EXISTS (SELECT 1 FROM partners p WHERE p.id = author_id AND p.user_id = (SELECT auth.uid())) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  )
  WITH CHECK (
    author_id = (SELECT auth.uid()) OR
    EXISTS (SELECT 1 FROM partners p WHERE p.id = author_id AND p.user_id = (SELECT auth.uid())) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );
