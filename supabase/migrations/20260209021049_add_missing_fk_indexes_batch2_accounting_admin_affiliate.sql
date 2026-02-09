/*
  # Add Missing Foreign Key Indexes - Batch 2: Accounting, Admin & Affiliate Tables
  
  1. Performance Optimization
    - Adds indexes to unindexed foreign key columns
    - Based on actual database schema analysis
  
  2. Tables Covered
    - accounting_fiscal_periods (merchant_id)
    - accounting_invoices (customer_id)
    - accounting_journal_entries (created_by, posted_by)
    - admin_sessions (admin_user_id)
    - affiliate_clicks (partner_id)
    - affiliate_commissions (partner_id)
    - affiliate_partners (user_id)
    - affiliate_payouts (partner_id)
    - affiliate_referrals (partner_id)
*/

DO $$
BEGIN
  -- Accounting tables
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accounting_fiscal_periods' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_accounting_fiscal_periods_merchant_id ON accounting_fiscal_periods(merchant_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accounting_invoices' AND column_name = 'customer_id') THEN
    CREATE INDEX IF NOT EXISTS idx_accounting_invoices_customer_id ON accounting_invoices(customer_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accounting_journal_entries' AND column_name = 'created_by') THEN
    CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_created_by ON accounting_journal_entries(created_by);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accounting_journal_entries' AND column_name = 'posted_by') THEN
    CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_posted_by ON accounting_journal_entries(posted_by);
  END IF;
  
  -- Admin tables
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_sessions' AND column_name = 'admin_user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);
  END IF;
  
  -- Affiliate tables
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_clicks' AND column_name = 'partner_id') THEN
    CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_partner_id ON affiliate_clicks(partner_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_commissions' AND column_name = 'partner_id') THEN
    CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_partner_id ON affiliate_commissions(partner_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_partners' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_affiliate_partners_user_id ON affiliate_partners(user_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_payouts' AND column_name = 'partner_id') THEN
    CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_partner_id ON affiliate_payouts(partner_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_referrals' AND column_name = 'partner_id') THEN
    CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_partner_id ON affiliate_referrals(partner_id);
  END IF;
END $$;