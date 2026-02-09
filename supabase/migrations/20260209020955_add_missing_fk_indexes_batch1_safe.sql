/*
  # Add Missing Foreign Key Indexes - Batch 1: Academy & Accounting Tables
  
  1. Performance Optimization
    - Adds indexes to foreign key columns that are currently unindexed
    - Improves JOIN performance and foreign key constraint checks
    - Reduces query execution time for related table lookups
  
  2. Tables Covered
    - academy_lesson_assets (lesson_id)
    - accounting_accountant_users (user_id)
    - accounting_assets (merchant_id)
    - accounting_bills (journal_entry_id, merchant_id)
    - accounting_journal_entries (merchant_id)
    - accounting_multi_business_commissions (partner_id, business_id)
    - accounting_receipts (merchant_id)
    - accounting_transactions (journal_entry_id, merchant_id)
  
  3. Safety
    - Uses IF NOT EXISTS to prevent errors on duplicate index creation
    - Only creates indexes for tables that exist
*/

-- Academy tables
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'academy_lesson_assets') THEN
    CREATE INDEX IF NOT EXISTS idx_academy_lesson_assets_lesson_id ON academy_lesson_assets(lesson_id);
  END IF;
END $$;

-- Accounting tables
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'accounting_accountant_users') THEN
    CREATE INDEX IF NOT EXISTS idx_accounting_accountant_users_user_id ON accounting_accountant_users(user_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'accounting_assets') THEN
    CREATE INDEX IF NOT EXISTS idx_accounting_assets_merchant_id ON accounting_assets(merchant_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'accounting_bills') THEN
    CREATE INDEX IF NOT EXISTS idx_accounting_bills_journal_entry_id ON accounting_bills(journal_entry_id);
    CREATE INDEX IF NOT EXISTS idx_accounting_bills_merchant_id ON accounting_bills(merchant_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'accounting_journal_entries') THEN
    CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_merchant_id ON accounting_journal_entries(merchant_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'accounting_multi_business_commissions') THEN
    CREATE INDEX IF NOT EXISTS idx_accounting_multi_business_commissions_partner_id ON accounting_multi_business_commissions(partner_id);
    CREATE INDEX IF NOT EXISTS idx_accounting_multi_business_commissions_business_id ON accounting_multi_business_commissions(business_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'accounting_receipts') THEN
    CREATE INDEX IF NOT EXISTS idx_accounting_receipts_merchant_id ON accounting_receipts(merchant_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'accounting_transactions') THEN
    CREATE INDEX IF NOT EXISTS idx_accounting_transactions_journal_entry_id ON accounting_transactions(journal_entry_id);
    CREATE INDEX IF NOT EXISTS idx_accounting_transactions_merchant_id ON accounting_transactions(merchant_id);
  END IF;
END $$;