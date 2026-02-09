/*
  # Fix Auth RLS Performance - Accounting & Admin Tables
  
  1. Performance
    - Replace direct auth.uid() calls with (select auth.uid()) in RLS policies
  
  2. Tables Updated
    - merchant_accounting_lite
    - merchant_accounting_pro
    - partner_accounting_pro
    - tax_obligations_quarterly
    - admin_crm tables
    - accounting tables
*/

-- merchant_accounting_lite
DROP POLICY IF EXISTS "Merchants can manage their lite accounting" ON merchant_accounting_lite;

CREATE POLICY "Merchants can manage their lite accounting" ON merchant_accounting_lite
  FOR ALL TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- merchant_accounting_pro
DROP POLICY IF EXISTS "Merchants can manage their pro accounting" ON merchant_accounting_pro;

CREATE POLICY "Merchants can manage their pro accounting" ON merchant_accounting_pro
  FOR ALL TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- partner_accounting_pro
DROP POLICY IF EXISTS "Partners can manage their accounting" ON partner_accounting_pro;

CREATE POLICY "Partners can manage their accounting" ON partner_accounting_pro
  FOR ALL TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- tax_obligations_quarterly
DROP POLICY IF EXISTS "Users can manage their tax obligations" ON tax_obligations_quarterly;
DROP POLICY IF EXISTS "Users can update their tax obligations" ON tax_obligations_quarterly;
DROP POLICY IF EXISTS "Users can view their tax obligations" ON tax_obligations_quarterly;

CREATE POLICY "Users can view their tax obligations" ON tax_obligations_quarterly
  FOR SELECT TO authenticated
  USING (
    (entity_type = 'merchant' AND entity_id IN (
      SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
    ))
    OR
    (entity_type = 'partner' AND entity_id IN (
      SELECT id FROM partners WHERE user_id = (SELECT auth.uid())
    ))
  );

CREATE POLICY "Users can manage their tax obligations" ON tax_obligations_quarterly
  FOR ALL TO authenticated
  USING (
    (entity_type = 'merchant' AND entity_id IN (
      SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
    ))
    OR
    (entity_type = 'partner' AND entity_id IN (
      SELECT id FROM partners WHERE user_id = (SELECT auth.uid())
    ))
  );

CREATE POLICY "Users can update their tax obligations" ON tax_obligations_quarterly
  FOR UPDATE TO authenticated
  USING (
    (entity_type = 'merchant' AND entity_id IN (
      SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
    ))
    OR
    (entity_type = 'partner' AND entity_id IN (
      SELECT id FROM partners WHERE user_id = (SELECT auth.uid())
    ))
  );

-- admin_crm_goals
DROP POLICY IF EXISTS "Admins can manage goals" ON admin_crm_goals;

CREATE POLICY "Admins can manage goals" ON admin_crm_goals
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- admin_crm_projects
DROP POLICY IF EXISTS "Admins can manage projects" ON admin_crm_projects;

CREATE POLICY "Admins can manage projects" ON admin_crm_projects
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- admin_crm_project_assignments
DROP POLICY IF EXISTS "Admins can manage project assignments" ON admin_crm_project_assignments;

CREATE POLICY "Admins can manage project assignments" ON admin_crm_project_assignments
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- admin_crm_companies
DROP POLICY IF EXISTS "Admins can manage companies" ON admin_crm_companies;

CREATE POLICY "Admins can manage companies" ON admin_crm_companies
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- admin_crm_contacts
DROP POLICY IF EXISTS "Admins can manage contacts" ON admin_crm_contacts;

CREATE POLICY "Admins can manage contacts" ON admin_crm_contacts
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- admin_crm_lists
DROP POLICY IF EXISTS "Admins can manage lists" ON admin_crm_lists;

CREATE POLICY "Admins can manage lists" ON admin_crm_lists
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- admin_crm_list_members
DROP POLICY IF EXISTS "Admins can manage list members" ON admin_crm_list_members;

CREATE POLICY "Admins can manage list members" ON admin_crm_list_members
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- admin_crm_activities
DROP POLICY IF EXISTS "Admins can manage activities" ON admin_crm_activities;

CREATE POLICY "Admins can manage activities" ON admin_crm_activities
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- accounting_tax_obligations
DROP POLICY IF EXISTS "Accountants can view tax obligations" ON accounting_tax_obligations;
DROP POLICY IF EXISTS "Admins can manage tax obligations" ON accounting_tax_obligations;

CREATE POLICY "Accountants can view tax obligations" ON accounting_tax_obligations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users 
      WHERE user_id = (SELECT auth.uid()) 
      AND is_active = true
    )
  );

CREATE POLICY "Admins can manage tax obligations" ON accounting_tax_obligations
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- accounting_tax_payments
DROP POLICY IF EXISTS "Accountants can view tax payments" ON accounting_tax_payments;
DROP POLICY IF EXISTS "Admins can manage tax payments" ON accounting_tax_payments;

CREATE POLICY "Accountants can view tax payments" ON accounting_tax_payments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users 
      WHERE user_id = (SELECT auth.uid()) 
      AND is_active = true
    )
  );

CREATE POLICY "Admins can manage tax payments" ON accounting_tax_payments
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- accounting_partner_1099_data
DROP POLICY IF EXISTS "Accountants can view partner 1099 data" ON accounting_partner_1099_data;
DROP POLICY IF EXISTS "Admins can manage partner 1099 data" ON accounting_partner_1099_data;

CREATE POLICY "Accountants can view partner 1099 data" ON accounting_partner_1099_data
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users 
      WHERE user_id = (SELECT auth.uid()) 
      AND is_active = true
    )
  );

CREATE POLICY "Admins can manage partner 1099 data" ON accounting_partner_1099_data
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- accounting_employees
DROP POLICY IF EXISTS "Accountants can view employees" ON accounting_employees;
DROP POLICY IF EXISTS "Admins can manage employees" ON accounting_employees;

CREATE POLICY "Accountants can view employees" ON accounting_employees
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users 
      WHERE user_id = (SELECT auth.uid()) 
      AND is_active = true
    )
  );

CREATE POLICY "Admins can manage employees" ON accounting_employees
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- accounting_employee_payroll
DROP POLICY IF EXISTS "Accountants can view payroll" ON accounting_employee_payroll;
DROP POLICY IF EXISTS "Admins can manage payroll" ON accounting_employee_payroll;

CREATE POLICY "Accountants can view payroll" ON accounting_employee_payroll
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounting_accountant_users 
      WHERE user_id = (SELECT auth.uid()) 
      AND is_active = true
    )
  );

CREATE POLICY "Admins can manage payroll" ON accounting_employee_payroll
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

-- accounting_accountant_users
DROP POLICY IF EXISTS "Admins can manage accountant users" ON accounting_accountant_users;

CREATE POLICY "Admins can manage accountant users" ON accounting_accountant_users
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );
