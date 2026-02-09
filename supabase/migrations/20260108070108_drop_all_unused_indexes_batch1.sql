/*
  # Drop All Unused Indexes - Batch 1 (Accounting & Affiliate)
  
  1. Performance Improvement
    - Removes indexes that have never been used
    - Reduces storage overhead
    - Improves write performance (INSERT/UPDATE/DELETE)
    - Reduces maintenance overhead
    
  2. Indexes Dropped
    - All unused accounting table indexes
    - All unused affiliate table indexes
    - All unused admin & AI table indexes
*/

-- Accounting table indexes
DROP INDEX IF EXISTS idx_accounting_assets_merchant_id;
DROP INDEX IF EXISTS idx_accounting_bills_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_bills_merchant_id;
DROP INDEX IF EXISTS idx_accounting_chart_of_accounts_parent_account_id;
DROP INDEX IF EXISTS idx_accounting_fiscal_periods_merchant_id;
DROP INDEX IF EXISTS idx_accounting_inventory_transactions_inventory_id;
DROP INDEX IF EXISTS idx_accounting_invoices_customer_id;
DROP INDEX IF EXISTS idx_accounting_invoices_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_journal_entries_created_by;
DROP INDEX IF EXISTS idx_accounting_journal_entries_fiscal_period_id;
DROP INDEX IF EXISTS idx_accounting_journal_entries_posted_by;
DROP INDEX IF EXISTS idx_accounting_journal_entry_lines_account_id;
DROP INDEX IF EXISTS idx_accounting_journal_entry_lines_journal_entry_id;
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
DROP INDEX IF EXISTS idx_accounting_tax_reports_merchant_id;
DROP INDEX IF EXISTS idx_accounting_transactions_account_id;
DROP INDEX IF EXISTS idx_accounting_transactions_customer_id;
DROP INDEX IF EXISTS idx_accounting_transactions_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_transactions_merchant_id;

-- Admin & Affiliate indexes
DROP INDEX IF EXISTS idx_admin_sessions_admin_user_id;
DROP INDEX IF EXISTS idx_affiliate_clicks_converted_user_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_partner_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_referred_user_id;
DROP INDEX IF EXISTS idx_affiliate_partners_user_id;
DROP INDEX IF EXISTS idx_affiliate_referrals_partner_id;
DROP INDEX IF EXISTS idx_affiliate_referrals_referred_user_id;

-- AI & Appointment indexes
DROP INDEX IF EXISTS idx_ai_assistant_conversations_user_id;
DROP INDEX IF EXISTS idx_ai_package_items_bot_addon_id;
DROP INDEX IF EXISTS idx_appointment_setting_bookings_merchant_id;
DROP INDEX IF EXISTS idx_appointments_customer_id;

-- Audit & Badge indexes
DROP INDEX IF EXISTS idx_audit_logs_actor_user_id;
DROP INDEX IF EXISTS idx_badge_awards_user_id;
DROP INDEX IF EXISTS idx_batch_transactions_transaction_id;

-- BI indexes
DROP INDEX IF EXISTS idx_bi_competitor_tracking_merchant_id;
DROP INDEX IF EXISTS idx_bi_reports_merchant_id;

-- Business & Capital indexes
DROP INDEX IF EXISTS idx_business_api_keys_business_unit_id;
DROP INDEX IF EXISTS idx_business_api_keys_created_by;
DROP INDEX IF EXISTS idx_business_capital_applications_merchant_id;
