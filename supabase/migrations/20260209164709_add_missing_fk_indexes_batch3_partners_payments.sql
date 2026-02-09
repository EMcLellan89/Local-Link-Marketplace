/*
  # Add Missing Foreign Key Indexes - Batch 3
  
  Continues adding indexes for foreign key columns.
  
  ## Tables Covered:
  - notifications
  - partner_contracts
  - partner_crm_deals
  - partner_outreach_logs
  - paybright_transactions
  - purchases
  - referral_rewards
  - reviews
  - scheduled_deals
  - support_tickets
*/

DO $$
BEGIN
  -- notifications
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'notifications' 
    AND column_name = 'user_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_notifications_user_id 
      ON notifications(user_id);
  END IF;

  -- partner_contracts
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'partner_contracts' 
    AND column_name = 'partner_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_partner_contracts_partner_id 
      ON partner_contracts(partner_id);
  END IF;

  -- partner_crm_deals
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'partner_crm_deals' 
    AND column_name = 'partner_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_partner_id 
      ON partner_crm_deals(partner_id);
  END IF;

  -- partner_outreach_logs
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'partner_outreach_logs' 
    AND column_name = 'partner_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_partner_outreach_logs_partner_id 
      ON partner_outreach_logs(partner_id);
  END IF;

  -- paybright_transactions
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'paybright_transactions' 
    AND column_name = 'merchant_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_paybright_transactions_merchant_id 
      ON paybright_transactions(merchant_id);
  END IF;

  -- purchases
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'purchases' 
    AND column_name = 'customer_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_purchases_customer_id 
      ON purchases(customer_id);
  END IF;

  -- referral_rewards
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'referral_rewards' 
    AND column_name = 'customer_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_referral_rewards_customer_id 
      ON referral_rewards(customer_id);
  END IF;

  -- reviews
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'reviews' 
    AND column_name = 'merchant_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_reviews_merchant_id 
      ON reviews(merchant_id);
  END IF;

  -- scheduled_deals
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'scheduled_deals' 
    AND column_name = 'merchant_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_scheduled_deals_merchant_id 
      ON scheduled_deals(merchant_id);
  END IF;

  -- support_tickets
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'support_tickets' 
    AND column_name = 'user_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id 
      ON support_tickets(user_id);
  END IF;
END $$;