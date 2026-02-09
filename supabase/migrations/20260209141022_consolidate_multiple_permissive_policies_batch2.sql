/*
  # Consolidate Multiple Permissive Policies - Batch 2

  This migration consolidates duplicate policies for accounting and admin tables.
  
  ## Tables Fixed:
  - accounting_accountant_users
  - accounting_employee_payroll
  - accounting_employees
  - accounting_partner_1099_data
  - accounting_tax_obligations
  - accounting_tax_payments
  - admin_crm_activities
  - admin_crm_companies
  - admin_crm_contacts
  - admin_crm_goals
*/

-- Accounting Accountant Users
DO $$
BEGIN
  DROP POLICY IF EXISTS "Accountants can view own profile" ON accounting_accountant_users;
  DROP POLICY IF EXISTS "Accountants view own account" ON accounting_accountant_users;
  
  CREATE POLICY "Accountants can view own profile"
    ON accounting_accountant_users FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
END $$;

-- Accounting Employee Payroll
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can manage payroll" ON accounting_employee_payroll;
  DROP POLICY IF EXISTS "Admin full access to payroll" ON accounting_employee_payroll;
  
  CREATE POLICY "Admins can manage payroll"
    ON accounting_employee_payroll FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

-- Accounting Employees
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can manage employees" ON accounting_employees;
  DROP POLICY IF EXISTS "Admin full access to employees" ON accounting_employees;
  
  CREATE POLICY "Admins can manage employees"
    ON accounting_employees FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

-- Accounting Partner 1099 Data
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can manage 1099 data" ON accounting_partner_1099_data;
  DROP POLICY IF EXISTS "Admin full access to 1099" ON accounting_partner_1099_data;
  
  CREATE POLICY "Admins can manage 1099 data"
    ON accounting_partner_1099_data FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

-- Accounting Tax Obligations
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can manage tax obligations" ON accounting_tax_obligations;
  DROP POLICY IF EXISTS "Admin full access to tax obligations" ON accounting_tax_obligations;
  
  CREATE POLICY "Admins can manage tax obligations"
    ON accounting_tax_obligations FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

-- Accounting Tax Payments
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can manage tax payments" ON accounting_tax_payments;
  DROP POLICY IF EXISTS "Admin full access to tax payments" ON accounting_tax_payments;
  
  CREATE POLICY "Admins can manage tax payments"
    ON accounting_tax_payments FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

-- Admin CRM Activities
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can manage activities" ON admin_crm_activities;
  DROP POLICY IF EXISTS "Admin full access to activities" ON admin_crm_activities;
  
  CREATE POLICY "Admins can manage activities"
    ON admin_crm_activities FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

-- Admin CRM Companies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can manage companies" ON admin_crm_companies;
  DROP POLICY IF EXISTS "Admin full access to companies" ON admin_crm_companies;
  
  CREATE POLICY "Admins can manage companies"
    ON admin_crm_companies FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

-- Admin CRM Contacts
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can manage contacts" ON admin_crm_contacts;
  DROP POLICY IF EXISTS "Admin full access to contacts" ON admin_crm_contacts;
  
  CREATE POLICY "Admins can manage contacts"
    ON admin_crm_contacts FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

-- Admin CRM Goals
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can manage goals" ON admin_crm_goals;
  DROP POLICY IF EXISTS "Admin full access to goals" ON admin_crm_goals;
  
  CREATE POLICY "Admins can manage goals"
    ON admin_crm_goals FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;
