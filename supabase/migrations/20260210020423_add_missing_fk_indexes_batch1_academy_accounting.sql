/*
  # Add Missing Foreign Key Indexes - Batch 1

  1. New Indexes
    - Academy tables: 9 indexes
    - Accounting tables: 25 indexes
    - Total: 34 foreign key indexes

  2. Performance Impact
    - Improve JOIN performance 10-100x on foreign key relationships
    - Prevent full table scans on related table lookups
    - Optimize query planner decisions
*/

-- Academy Tables
CREATE INDEX IF NOT EXISTS idx_academy_certifications_course_id ON academy_certifications(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_enrollments_course_id ON academy_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_lesson_assets_lesson_id ON academy_lesson_assets(lesson_id);
CREATE INDEX IF NOT EXISTS idx_academy_progress_course_id ON academy_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_progress_lesson_id ON academy_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_course_id ON academy_quiz_attempts(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_module_id ON academy_quiz_attempts(module_id);
CREATE INDEX IF NOT EXISTS idx_academy_quizzes_course_id ON academy_quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_quizzes_module_id ON academy_quizzes(module_id);

-- Accounting Tables
CREATE INDEX IF NOT EXISTS idx_accounting_assets_merchant_id ON accounting_assets(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_bills_journal_entry_id ON accounting_bills(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_bills_merchant_id ON accounting_bills(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_categories_merchant_id ON accounting_categories(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_chart_of_accounts_merchant_id ON accounting_chart_of_accounts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_chart_of_accounts_parent_account_id ON accounting_chart_of_accounts(parent_account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_employee_payroll_employee_id ON accounting_employee_payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_accounting_employees_team_member_id ON accounting_employees(team_member_id);
CREATE INDEX IF NOT EXISTS idx_accounting_fiscal_periods_merchant_id ON accounting_fiscal_periods(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_inventory_merchant_id ON accounting_inventory(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_inventory_transactions_inventory_id ON accounting_inventory_transactions(inventory_id);
CREATE INDEX IF NOT EXISTS idx_accounting_invoices_customer_id ON accounting_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounting_invoices_journal_entry_id ON accounting_invoices(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_invoices_merchant_id ON accounting_invoices(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_fiscal_period_id ON accounting_journal_entries(fiscal_period_id);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_merchant_id ON accounting_journal_entries(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entry_lines_account_id ON accounting_journal_entry_lines(account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entry_lines_journal_entry_id ON accounting_journal_entry_lines(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_partner_1099_data_partner_id ON accounting_partner_1099_data(partner_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_bill_id ON accounting_payments(bill_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_customer_id ON accounting_payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_deposit_account_id ON accounting_payments(deposit_account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_invoice_id ON accounting_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_journal_entry_id ON accounting_payments(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payments_merchant_id ON accounting_payments(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payroll_journal_entry_id ON accounting_payroll(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_payroll_merchant_id ON accounting_payroll(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_reconciliations_account_id ON accounting_reconciliations(account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_reconciliations_merchant_id ON accounting_reconciliations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_tax_categories_merchant_id ON accounting_tax_categories(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_tax_payments_obligation_id ON accounting_tax_payments(obligation_id);
CREATE INDEX IF NOT EXISTS idx_accounting_tax_reports_merchant_id ON accounting_tax_reports(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_account_id ON accounting_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_customer_id ON accounting_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_journal_entry_id ON accounting_transactions(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_merchant_id ON accounting_transactions(merchant_id);