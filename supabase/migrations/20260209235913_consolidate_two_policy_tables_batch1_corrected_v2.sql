/*
  # Consolidate RLS Policies - Batch 1: Simple Duplicate Policies

  1. Problem
    - Multiple identical or very similar permissive policies
    - Need to remove duplicates

  2. Tables Fixed (10 tables)
    - accounting_accountant_users (SELECT): 2 duplicate → 1
    - accounting_employee_payroll (ALL): 2 duplicate → 1
    - accounting_tax_obligations (ALL): 2 duplicate → 1
    - admin_sessions (SELECT): 2 similar → 1
    - admin_users (SELECT): 2 similar → 1
    - appointment_setting_bookings (SELECT): 2 duplicate → 1
    - bi_metrics (SELECT): 2 duplicate → 1
    - bi_predictions (SELECT): 2 duplicate → 1
    - commissions (SELECT): 2 duplicate → 1
    - communications_transactions (SELECT): 2 duplicate → 1

  3. Security
    - No functional changes - removing exact duplicates or consolidating similar ones
*/

-- accounting_accountant_users: Remove duplicate
DROP POLICY IF EXISTS "Accountants can view own profile" ON accounting_accountant_users;
DROP POLICY IF EXISTS "Accountants can view own record" ON accounting_accountant_users;

CREATE POLICY "Accountants access consolidated"
  ON accounting_accountant_users FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- accounting_employee_payroll: Remove duplicate
DROP POLICY IF EXISTS "Admins can manage payroll" ON accounting_employee_payroll;
DROP POLICY IF EXISTS "Admins manage payroll" ON accounting_employee_payroll;

CREATE POLICY "Payroll access consolidated"
  ON accounting_employee_payroll FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- accounting_tax_obligations: Remove duplicate
DROP POLICY IF EXISTS "Admins can manage tax obligations" ON accounting_tax_obligations;
DROP POLICY IF EXISTS "Admins manage tax obligations" ON accounting_tax_obligations;

CREATE POLICY "Tax obligations access consolidated"
  ON accounting_tax_obligations FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- admin_sessions: Consolidate - join through admin_users
DROP POLICY IF EXISTS "Admin users can view own sessions" ON admin_sessions;
DROP POLICY IF EXISTS "Admins can view own sessions" ON admin_sessions;

CREATE POLICY "Admin sessions access consolidated"
  ON admin_sessions FOR SELECT
  TO authenticated
  USING (
    admin_user_id = (SELECT auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

-- admin_users: Consolidate similar policies - admin_users.id is the auth.users id
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can view own record" ON admin_users;

CREATE POLICY "Admin users access consolidated"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    id = (SELECT auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

-- appointment_setting_bookings: Remove duplicate
DROP POLICY IF EXISTS "Merchants can view own appointment bookings" ON appointment_setting_bookings;
DROP POLICY IF EXISTS "Merchants can view own bookings" ON appointment_setting_bookings;

CREATE POLICY "Appointment bookings access consolidated"
  ON appointment_setting_bookings FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

-- bi_metrics: Remove duplicate
DROP POLICY IF EXISTS "Merchants can view own BI metrics" ON bi_metrics;
DROP POLICY IF EXISTS "Merchants view their BI metrics" ON bi_metrics;

CREATE POLICY "BI metrics access consolidated"
  ON bi_metrics FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

-- bi_predictions: Remove duplicate
DROP POLICY IF EXISTS "Merchants can view own predictions" ON bi_predictions;
DROP POLICY IF EXISTS "Merchants view their BI predictions" ON bi_predictions;

CREATE POLICY "BI predictions access consolidated"
  ON bi_predictions FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

-- commissions: Remove duplicate
DROP POLICY IF EXISTS "Partners can view own commissions" ON commissions;
DROP POLICY IF EXISTS "partners can view own commissions" ON commissions;

CREATE POLICY "Commissions access consolidated"
  ON commissions FOR SELECT
  TO authenticated
  USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = (SELECT auth.uid())) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

-- communications_transactions: Remove duplicate
DROP POLICY IF EXISTS "Merchants can view own communications" ON communications_transactions;
DROP POLICY IF EXISTS "Merchants can view own transactions" ON communications_transactions;

CREATE POLICY "Communications transactions access consolidated"
  ON communications_transactions FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );
