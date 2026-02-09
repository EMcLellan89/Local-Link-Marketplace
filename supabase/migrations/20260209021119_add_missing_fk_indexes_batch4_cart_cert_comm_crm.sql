/*
  # Add Missing Foreign Key Indexes - Batch 4: Cart, Certificates, Communications & CRM Tables
  
  1. Performance Optimization
    - Adds indexes to unindexed foreign key columns for cart, certificates, communications, and CRM systems
  
  2. Tables Covered
    - cart_items (cart_id, product_id)
    - certificates_issued (user_id)
    - communications_transactions (merchant_id)
    - crm_activities (merchant_id)
    - crm_bot_training_data (validated_by)
    - crm_csv_exports (created_by)
    - crm_deals (contact_id)
    - crm_tasks (assigned_to, merchant_id)
    - customer_referrals (merchant_id)
*/

DO $$
BEGIN
  -- Cart items
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'cart_id') THEN
    CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cart_items' AND column_name = 'product_id') THEN
    CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
  END IF;
  
  -- Certificates
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates_issued' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_certificates_issued_user_id ON certificates_issued(user_id);
  END IF;
  
  -- Communications
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'communications_transactions' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_communications_transactions_merchant_id ON communications_transactions(merchant_id);
  END IF;
  
  -- CRM tables
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crm_activities' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_crm_activities_merchant_id ON crm_activities(merchant_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crm_bot_training_data' AND column_name = 'validated_by') THEN
    CREATE INDEX IF NOT EXISTS idx_crm_bot_training_data_validated_by ON crm_bot_training_data(validated_by);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crm_csv_exports' AND column_name = 'created_by') THEN
    CREATE INDEX IF NOT EXISTS idx_crm_csv_exports_created_by ON crm_csv_exports(created_by);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crm_deals' AND column_name = 'contact_id') THEN
    CREATE INDEX IF NOT EXISTS idx_crm_deals_contact_id ON crm_deals(contact_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crm_tasks' AND column_name = 'assigned_to') THEN
    CREATE INDEX IF NOT EXISTS idx_crm_tasks_assigned_to ON crm_tasks(assigned_to);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crm_tasks' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_crm_tasks_merchant_id ON crm_tasks(merchant_id);
  END IF;
  
  -- Customer referrals
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customer_referrals' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_customer_referrals_merchant_id ON customer_referrals(merchant_id);
  END IF;
END $$;