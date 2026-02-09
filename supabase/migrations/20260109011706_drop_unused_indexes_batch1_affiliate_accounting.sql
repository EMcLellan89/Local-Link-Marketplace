/*
  # Drop Unused Indexes - Batch 1 (Affiliate & Accounting)
  
  1. Changes
    - Drop unused indexes on affiliate and accounting tables
    - These indexes have not been used and consume storage/maintenance overhead
    
  2. Indexes Dropped
    - affiliate_clicks, affiliate_payouts, affiliate_commissions, affiliate_referrals, affiliate_partners
    - accounting_* tables (assets, bills, chart_of_accounts, fiscal_periods, etc.)
*/

-- Affiliate tables
DROP INDEX IF EXISTS idx_affiliate_clicks_partner_id;
DROP INDEX IF EXISTS idx_affiliate_clicks_converted_user_id;
DROP INDEX IF EXISTS idx_affiliate_payouts_partner_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_partner_id;
DROP INDEX IF EXISTS idx_affiliate_commissions_referred_user_id;
DROP INDEX IF EXISTS idx_affiliate_partners_user_id;
DROP INDEX IF EXISTS idx_affiliate_referrals_partner_id;
DROP INDEX IF EXISTS idx_affiliate_referrals_referred_user_id;

-- Accounting tables
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
