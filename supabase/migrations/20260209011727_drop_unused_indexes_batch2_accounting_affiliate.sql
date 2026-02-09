/*
  # Drop Unused Indexes - Batch 2: Accounting & Affiliate Tables
  
  This migration drops more unused indexes to improve write performance.
  
  ## Indexes Dropped
  - Accounting table indexes with 0 scans
  - Affiliate table indexes with 0 scans
  
  ## Impact
  - Reduces storage usage
  - Improves write performance
*/

-- accounting_bills
DROP INDEX IF EXISTS idx_accounting_bills_journal_entry_id;
DROP INDEX IF EXISTS idx_accounting_bills_merchant_id;
DROP INDEX IF EXISTS idx_accounting_bills_vendor_id;

-- accounting_categories
DROP INDEX IF EXISTS idx_accounting_categories_merchant_id;

-- accounting_chart_of_accounts
DROP INDEX IF EXISTS idx_accounting_chart_of_accounts_merchant_id;

-- accounting_closing_entries
DROP INDEX IF EXISTS idx_accounting_closing_entries_merchant_id;

-- accounting_journal_entries
DROP INDEX IF EXISTS idx_accounting_journal_entries_merchant_id;

-- accounting_ledger_balances
DROP INDEX IF EXISTS idx_accounting_ledger_balances_account_merchant;
DROP INDEX IF EXISTS idx_accounting_ledger_balances_merchant_id;

-- accounting_line_items
DROP INDEX IF EXISTS idx_accounting_line_items_account_id;
DROP INDEX IF EXISTS idx_accounting_line_items_journal_entry_id;

-- accounting_reports
DROP INDEX IF EXISTS idx_accounting_reports_merchant_id;

-- affiliate_clicks
DROP INDEX IF EXISTS idx_affiliate_clicks_link_id;
DROP INDEX IF EXISTS idx_affiliate_clicks_partner_id;

-- affiliate_commissions
DROP INDEX IF EXISTS idx_affiliate_commissions_partner_id;

-- affiliate_partners
DROP INDEX IF EXISTS idx_affiliate_partners_user_id;

-- affiliate_payouts
DROP INDEX IF EXISTS idx_affiliate_payouts_partner_id;

-- affiliate_referrals
DROP INDEX IF EXISTS idx_affiliate_referrals_partner_id;
