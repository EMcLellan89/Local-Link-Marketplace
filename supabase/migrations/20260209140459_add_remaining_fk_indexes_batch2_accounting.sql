/*
  # Add Missing Foreign Key Indexes - Batch 2: Accounting Tables

  This migration adds B-tree indexes for foreign key columns that lack covering indexes.
  
  ## Tables Updated:
  - accounting_accountant_users (user_id)
  - accounting_employee_payroll (employee_id)
  - accounting_employees (team_member_id)
  - accounting_tax_payments (obligation_id)
  - accounting_partner_1099_data (partner_id)
*/

-- Accounting Tables
CREATE INDEX IF NOT EXISTS idx_accounting_accountant_users_user_id ON accounting_accountant_users(user_id);

CREATE INDEX IF NOT EXISTS idx_accounting_employee_payroll_employee_id ON accounting_employee_payroll(employee_id);

CREATE INDEX IF NOT EXISTS idx_accounting_employees_team_member_id ON accounting_employees(team_member_id);

CREATE INDEX IF NOT EXISTS idx_accounting_tax_payments_obligation_id ON accounting_tax_payments(obligation_id);

CREATE INDEX IF NOT EXISTS idx_accounting_partner_1099_data_partner_id ON accounting_partner_1099_data(partner_id);
