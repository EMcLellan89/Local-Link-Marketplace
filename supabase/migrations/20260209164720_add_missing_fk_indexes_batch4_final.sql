/*
  # Add Missing Foreign Key Indexes - Batch 4 (Final)
  
  Final batch of indexes for foreign key columns.
  
  ## Tables Covered:
  - transactions
  - twilio_call_logs
  - twilio_email_logs
  - twilio_sms_logs
  - ugc_orders
*/

DO $$
BEGIN
  -- transactions
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'transactions' 
    AND column_name = 'merchant_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_transactions_merchant_id 
      ON transactions(merchant_id);
  END IF;

  -- twilio_call_logs
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'twilio_call_logs' 
    AND column_name = 'merchant_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_twilio_call_logs_merchant_id 
      ON twilio_call_logs(merchant_id);
  END IF;

  -- twilio_email_logs
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'twilio_email_logs' 
    AND column_name = 'merchant_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_twilio_email_logs_merchant_id 
      ON twilio_email_logs(merchant_id);
  END IF;

  -- twilio_sms_logs
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'twilio_sms_logs' 
    AND column_name = 'merchant_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_twilio_sms_logs_merchant_id 
      ON twilio_sms_logs(merchant_id);
  END IF;

  -- ugc_orders
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'ugc_orders' 
    AND column_name = 'merchant_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_ugc_orders_merchant_id 
      ON ugc_orders(merchant_id);
  END IF;
END $$;