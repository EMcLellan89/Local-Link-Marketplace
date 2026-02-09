/*
  # Add Missing Foreign Key Indexes - Batch 2
  
  Continues adding indexes for foreign key columns.
  
  ## Tables Covered:
  - dfy_orders
  - invoice_items
  - invoices
  - job_applications
  - ll_crm_deals
  - ll_crm_email_sends
  - ll_crm_payments
  - ll_crm_workflow_executions
  - marketing_campaigns
  - merchants
*/

DO $$
BEGIN
  -- dfy_orders
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'dfy_orders' 
    AND column_name = 'merchant_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_dfy_orders_merchant_id 
      ON dfy_orders(merchant_id);
  END IF;

  -- invoice_items
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'invoice_items' 
    AND column_name = 'invoice_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id 
      ON invoice_items(invoice_id);
  END IF;

  -- invoices
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'invoices' 
    AND column_name = 'merchant_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_invoices_merchant_id 
      ON invoices(merchant_id);
  END IF;

  -- job_applications
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'job_applications' 
    AND column_name = 'partner_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_job_applications_partner_id 
      ON job_applications(partner_id);
  END IF;

  -- ll_crm_deals
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'll_crm_deals' 
    AND column_name = 'contact_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_ll_crm_deals_contact_id 
      ON ll_crm_deals(contact_id);
  END IF;

  -- ll_crm_email_sends
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'll_crm_email_sends' 
    AND column_name = 'contact_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_ll_crm_email_sends_contact_id 
      ON ll_crm_email_sends(contact_id);
  END IF;

  -- ll_crm_payments
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'll_crm_payments' 
    AND column_name = 'merchant_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_ll_crm_payments_merchant_id 
      ON ll_crm_payments(merchant_id);
  END IF;

  -- ll_crm_workflow_executions
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'll_crm_workflow_executions' 
    AND column_name = 'merchant_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_ll_crm_workflow_executions_merchant_id 
      ON ll_crm_workflow_executions(merchant_id);
  END IF;

  -- marketing_campaigns
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'marketing_campaigns' 
    AND column_name = 'merchant_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_merchant_id 
      ON marketing_campaigns(merchant_id);
  END IF;

  -- merchants
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'merchants' 
    AND column_name = 'user_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_merchants_user_id 
      ON merchants(user_id);
  END IF;
END $$;