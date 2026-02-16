/*
  # Security Audit - Drop Unused Indexes (Batch 1)

  Removes unused indexes identified in security audit to improve database performance.
  This batch covers academy and accounting tables.
*/

-- Academy tables
DROP INDEX IF EXISTS idx_academy_certifications_course_id;
DROP INDEX IF EXISTS idx_academy_enrollments_course_id;
DROP INDEX IF EXISTS idx_academy_lesson_assets_lesson_id;
DROP INDEX IF EXISTS idx_academy_progress_course_id;
DROP INDEX IF EXISTS idx_academy_progress_lesson_id;
DROP INDEX IF EXISTS idx_academy_quiz_attempts_module_id;
DROP INDEX IF EXISTS idx_academy_quiz_attempts_course_id;
DROP INDEX IF EXISTS idx_academy_quiz_attempts_user_id;
DROP INDEX IF EXISTS idx_academy_quizzes_course_id;
DROP INDEX IF EXISTS idx_academy_quizzes_module_id;

-- Accounting tables
DROP INDEX IF EXISTS idx_accounting_categories_merchant_id;
DROP INDEX IF EXISTS idx_accounting_chart_of_accounts_merchant_id;
DROP INDEX IF EXISTS idx_accounting_chart_of_accounts_parent_account_id;
DROP INDEX IF EXISTS idx_accounting_inventory_merchant_id;
DROP INDEX IF EXISTS idx_accounting_inventory_transactions_inventory_id;
DROP INDEX IF EXISTS idx_accounting_invoices_merchant_id;
DROP INDEX IF EXISTS idx_accounting_invoices_customer_id;
DROP INDEX IF EXISTS idx_accounting_invoices_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_journal_entries_merchant_id;
DROP INDEX IF EXISTS idx_accounting_journal_entries_fiscal_period_id;
DROP INDEX IF EXISTS idx_accounting_journal_entries_created_by;
DROP INDEX IF EXISTS idx_accounting_journal_entries_posted_by;
DROP INDEX IF EXISTS idx_accounting_journal_entry_lines_account_id;
DROP INDEX IF EXISTS idx_accounting_journal_entry_lines_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_partner_1099_data_partner_id;
DROP INDEX IF EXISTS idx_accounting_payments_bill_id;
DROP INDEX IF EXISTS idx_accounting_payments_customer_id;
DROP INDEX IF EXISTS idx_accounting_payments_deposit_account_id;
DROP INDEX IF EXISTS idx_accounting_payments_invoice_id;
DROP INDEX IF EXISTS idx_accounting_payments_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_payments_merchant_id;
DROP INDEX IF EXISTS idx_accounting_payroll_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_payroll_merchant_id;
DROP INDEX IF EXISTS idx_accounting_reconciliations_account_id;
DROP INDEX IF EXISTS idx_accounting_reconciliations_merchant_id;
DROP INDEX IF EXISTS idx_accounting_reconciliations_reconciled_by;
DROP INDEX IF EXISTS idx_accounting_tax_categories_merchant_id;
DROP INDEX IF EXISTS idx_accounting_tax_payments_obligation_id;
DROP INDEX IF EXISTS idx_accounting_tax_reports_merchant_id;
DROP INDEX IF EXISTS idx_accounting_transactions_account_id;
DROP INDEX IF EXISTS idx_accounting_transactions_customer_id;
DROP INDEX IF EXISTS idx_accounting_transactions_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_transactions_merchant_id;
DROP INDEX IF EXISTS idx_accounting_bills_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_bills_merchant_id;
DROP INDEX IF EXISTS idx_accounting_employee_payroll_employee_id;
DROP INDEX IF EXISTS idx_accounting_employees_team_member_id;
DROP INDEX IF EXISTS idx_accounting_fiscal_periods_merchant_id;
DROP INDEX IF EXISTS idx_accounting_accountant_users_user_id;
DROP INDEX IF EXISTS idx_accounting_assets_merchant_id;
