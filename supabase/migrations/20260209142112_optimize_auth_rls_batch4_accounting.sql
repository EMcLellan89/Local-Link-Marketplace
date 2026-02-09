/*
  # Optimize Auth RLS Performance - Batch 4: Accounting Tables

  1. Changes
    - Wrap auth.uid() in (SELECT auth.uid()) for Accounting tables
    - Affects: accounting_tax_obligations, accounting_tax_payments, 
               accounting_partner_1099_data, accounting_employees, 
               accounting_employee_payroll, accounting_accountant_users
  
  2. Performance Impact
    - Reduces auth function calls from N (rows) to 1 per query
    - Improves accounting system performance
*/

-- Accounting Tax Obligations
DO $$
BEGIN
  DROP POLICY IF EXISTS "Merchants view own tax obligations" ON accounting_tax_obligations;
  
  CREATE POLICY "Merchants view own tax obligations"
    ON accounting_tax_obligations FOR SELECT
    TO authenticated
    USING (
      merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
      )
    );
END $$;

-- Accounting Tax Payments
DO $$
BEGIN
  DROP POLICY IF EXISTS "Merchants manage own tax payments" ON accounting_tax_payments;
  
  CREATE POLICY "Merchants manage own tax payments"
    ON accounting_tax_payments FOR ALL
    TO authenticated
    USING (
      obligation_id IN (
        SELECT id FROM accounting_tax_obligations WHERE merchant_id IN (
          SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
        )
      )
    )
    WITH CHECK (
      obligation_id IN (
        SELECT id FROM accounting_tax_obligations WHERE merchant_id IN (
          SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
        )
      )
    );
END $$;

-- Accounting Partner 1099 Data
DO $$
BEGIN
  DROP POLICY IF EXISTS "Partners view own 1099 data" ON accounting_partner_1099_data;
  
  CREATE POLICY "Partners view own 1099 data"
    ON accounting_partner_1099_data FOR SELECT
    TO authenticated
    USING (
      partner_id IN (
        SELECT id FROM partners WHERE user_id = (SELECT auth.uid())
      )
    );
END $$;

-- Accounting Employees
DO $$
BEGIN
  DROP POLICY IF EXISTS "Team members view own employee data" ON accounting_employees;
  
  CREATE POLICY "Team members view own employee data"
    ON accounting_employees FOR SELECT
    TO authenticated
    USING (
      team_member_id IN (
        SELECT id FROM team_members WHERE user_id = (SELECT auth.uid())
      )
    );
END $$;

-- Accounting Employee Payroll
DO $$
BEGIN
  DROP POLICY IF EXISTS "Employees view own payroll" ON accounting_employee_payroll;
  
  CREATE POLICY "Employees view own payroll"
    ON accounting_employee_payroll FOR SELECT
    TO authenticated
    USING (
      employee_id IN (
        SELECT id FROM accounting_employees WHERE team_member_id IN (
          SELECT id FROM team_members WHERE user_id = (SELECT auth.uid())
        )
      )
    );
END $$;

-- Accounting Accountant Users
DO $$
BEGIN
  DROP POLICY IF EXISTS "Accountants view own data" ON accounting_accountant_users;
  
  CREATE POLICY "Accountants view own data"
    ON accounting_accountant_users FOR SELECT
    TO authenticated
    USING (user_id = (SELECT auth.uid()));
END $$;
