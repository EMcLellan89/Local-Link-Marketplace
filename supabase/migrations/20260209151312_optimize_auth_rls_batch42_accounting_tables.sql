/*
  # Optimize Auth RLS Performance - Accounting Tables

  1. Performance Optimization
    - Wrap auth.uid() in (SELECT auth.uid()) to reduce function calls from N to 1 per query
    - Apply to policies with direct auth.uid() calls
  
  2. Tables Updated
    - accounting_accountant_users
    - accounting_employee_payroll
    - accounting_employees
    - accounting_partner_1099_data
    - accounting_tax_obligations
    - accounting_tax_payments
  
  3. Impact
    - Reduces auth overhead for accounting operations
    - Improves query performance
    - Maintains same security guarantees
*/

-- Accounting Accountant Users
DROP POLICY IF EXISTS "Accountants can view own profile" ON accounting_accountant_users;

CREATE POLICY "Accountants can view own profile"
ON accounting_accountant_users FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

-- Accounting Employee Payroll
DROP POLICY IF EXISTS "Admins can manage payroll" ON accounting_employee_payroll;

CREATE POLICY "Admins can manage payroll"
ON accounting_employee_payroll FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = (SELECT auth.uid()) 
  AND role = 'admin'::user_role
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = (SELECT auth.uid()) 
  AND role = 'admin'::user_role
));

-- Accounting Employees
DROP POLICY IF EXISTS "Admins can manage employees" ON accounting_employees;

CREATE POLICY "Admins can manage employees"
ON accounting_employees FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = (SELECT auth.uid()) 
  AND role = 'admin'::user_role
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = (SELECT auth.uid()) 
  AND role = 'admin'::user_role
));

-- Accounting Partner 1099 Data
DROP POLICY IF EXISTS "Admins can manage 1099 data" ON accounting_partner_1099_data;

CREATE POLICY "Admins can manage 1099 data"
ON accounting_partner_1099_data FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = (SELECT auth.uid()) 
  AND role = 'admin'::user_role
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = (SELECT auth.uid()) 
  AND role = 'admin'::user_role
));

-- Accounting Tax Obligations
DROP POLICY IF EXISTS "Admins can manage tax obligations" ON accounting_tax_obligations;

CREATE POLICY "Admins can manage tax obligations"
ON accounting_tax_obligations FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = (SELECT auth.uid()) 
  AND role = 'admin'::user_role
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = (SELECT auth.uid()) 
  AND role = 'admin'::user_role
));

-- Accounting Tax Payments
DROP POLICY IF EXISTS "Admins can manage tax payments" ON accounting_tax_payments;

CREATE POLICY "Admins can manage tax payments"
ON accounting_tax_payments FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = (SELECT auth.uid()) 
  AND role = 'admin'::user_role
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = (SELECT auth.uid()) 
  AND role = 'admin'::user_role
));