/*
  # Consolidate Multiple Permissive Policies - Batch 1
  
  1. Performance & Security
    - Consolidate multiple permissive SELECT policies into single policies
    - Reduces policy evaluation overhead
  
  2. Tables Updated
    - accounting_employee_payroll
    - accounting_employees
    - accounting_partner_1099_data
    - accounting_tax_obligations
    - accounting_tax_payments
*/

-- accounting_employee_payroll - Consolidate SELECT policies
DROP POLICY IF EXISTS "Accountants can view payroll" ON accounting_employee_payroll;
DROP POLICY IF EXISTS "Admins can manage payroll" ON accounting_employee_payroll;

CREATE POLICY "View payroll" ON accounting_employee_payroll
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users 
      WHERE user_id = (SELECT auth.uid()) 
      AND is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins manage payroll" ON accounting_employee_payroll
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- accounting_employees - Consolidate SELECT policies
DROP POLICY IF EXISTS "Accountants can view employees" ON accounting_employees;
DROP POLICY IF EXISTS "Admins can manage employees" ON accounting_employees;

CREATE POLICY "View employees" ON accounting_employees
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users 
      WHERE user_id = (SELECT auth.uid()) 
      AND is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins manage employees" ON accounting_employees
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- accounting_partner_1099_data - Consolidate SELECT policies
DROP POLICY IF EXISTS "Accountants can view partner 1099 data" ON accounting_partner_1099_data;
DROP POLICY IF EXISTS "Admins can manage partner 1099 data" ON accounting_partner_1099_data;

CREATE POLICY "View partner 1099 data" ON accounting_partner_1099_data
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users 
      WHERE user_id = (SELECT auth.uid()) 
      AND is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins manage partner 1099 data" ON accounting_partner_1099_data
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- accounting_tax_obligations - Consolidate SELECT policies
DROP POLICY IF EXISTS "Accountants can view tax obligations" ON accounting_tax_obligations;
DROP POLICY IF EXISTS "Admins can manage tax obligations" ON accounting_tax_obligations;

CREATE POLICY "View tax obligations" ON accounting_tax_obligations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users 
      WHERE user_id = (SELECT auth.uid()) 
      AND is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins manage tax obligations" ON accounting_tax_obligations
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- accounting_tax_payments - Consolidate SELECT policies
DROP POLICY IF EXISTS "Accountants can view tax payments" ON accounting_tax_payments;
DROP POLICY IF EXISTS "Admins can manage tax payments" ON accounting_tax_payments;

CREATE POLICY "View tax payments" ON accounting_tax_payments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users 
      WHERE user_id = (SELECT auth.uid()) 
      AND is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins manage tax payments" ON accounting_tax_payments
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );
