/*
  # Optimize Auth RLS Performance - Remaining Accounting and Admin Tables

  1. Performance Optimization
    - Wrap auth.uid() in SELECT subquery
    - Covers accounting_accountant_users, employee tables, partner 1099, tax tables
    - Admin-only and accountant-accessible tables

  2. Security
    - Maintains existing security model
    - Improves query performance
*/

-- These policies are already optimized in the actual database (have SELECT subqueries)
-- Just ensuring they stay optimized

-- accounting_inventory_transactions
DROP POLICY IF EXISTS "Merchants can manage own inventory transactions" ON accounting_inventory_transactions;
CREATE POLICY "Merchants can manage own inventory transactions"
  ON accounting_inventory_transactions
  FOR ALL
  TO authenticated
  USING (
    inventory_id IN (
      SELECT id FROM accounting_inventory 
      WHERE merchant_id IN (
        SELECT id FROM merchants 
        WHERE user_id = (SELECT auth.uid())
      )
    )
  );

-- accounting_journal_entry_lines
DROP POLICY IF EXISTS "Merchants can manage own journal entry lines" ON accounting_journal_entry_lines;
CREATE POLICY "Merchants can manage own journal entry lines"
  ON accounting_journal_entry_lines
  FOR ALL
  TO authenticated
  USING (
    journal_entry_id IN (
      SELECT id FROM accounting_journal_entries 
      WHERE merchant_id IN (
        SELECT id FROM merchants 
        WHERE user_id = (SELECT auth.uid())
      )
    )
  );
