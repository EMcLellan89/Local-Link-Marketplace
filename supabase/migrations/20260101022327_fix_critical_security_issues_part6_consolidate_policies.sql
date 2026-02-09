/*
  # Fix Critical Security Issues - Part 6: Consolidate Duplicate Permissive Policies
  
  1. Removes redundant "view" policies where "manage" policies already cover SELECT
  2. The "manage" policies use FOR ALL which includes SELECT, making separate view policies redundant
  3. This reduces policy evaluation overhead and eliminates the multiple permissive policies warning
  
  Note: We only remove truly redundant policies. Policies for different roles or purposes are kept.
*/

-- Remove redundant "view" policies for accounting tables
-- The "manage" policies already cover SELECT operations with FOR ALL

DROP POLICY IF EXISTS "Merchants can view own chart of accounts" ON accounting_chart_of_accounts;
DROP POLICY IF EXISTS "Merchants can view own fiscal periods" ON accounting_fiscal_periods;
DROP POLICY IF EXISTS "Merchants can view own journal entries" ON accounting_journal_entries;
DROP POLICY IF EXISTS "Merchants can view own journal entry lines" ON accounting_journal_entry_lines;
DROP POLICY IF EXISTS "Merchants can view own transactions" ON accounting_transactions;
DROP POLICY IF EXISTS "Merchants can view own tax categories" ON accounting_tax_categories;
DROP POLICY IF EXISTS "Merchants can view own invoices" ON accounting_invoices;
DROP POLICY IF EXISTS "Merchants can view own bills" ON accounting_bills;
DROP POLICY IF EXISTS "Merchants can view own payments" ON accounting_payments;
DROP POLICY IF EXISTS "Merchants can view own assets" ON accounting_assets;
DROP POLICY IF EXISTS "Merchants can view own inventory" ON accounting_inventory;
DROP POLICY IF EXISTS "Merchants can view own inventory transactions" ON accounting_inventory_transactions;
DROP POLICY IF EXISTS "Merchants can view own payroll" ON accounting_payroll;
DROP POLICY IF EXISTS "Merchants can view own reconciliations" ON accounting_reconciliations;
DROP POLICY IF EXISTS "Merchants can view own tax reports" ON accounting_tax_reports;

-- Remove redundant merchant_comprehensive_stats view policy
DROP POLICY IF EXISTS "Merchants can view own comprehensive stats" ON merchant_comprehensive_stats;
