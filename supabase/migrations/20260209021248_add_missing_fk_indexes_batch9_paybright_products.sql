/*
  # Add Missing Foreign Key Indexes - Batch 9: PayBright, Products & Profit Network Tables
  
  1. Performance Optimization
    - Adds indexes to unindexed foreign key columns for PayBright, products, and profit network systems
  
  2. Tables Covered
    - paybright_audit_log (user_id)
    - paybright_refunds (requested_by)
    - paybright_subscriptions (merchant_id)
    - paybright_transactions (customer_id, merchant_id)
    - payout_batches (partner_id)
    - printing_orders (product_id)
    - product_commission_rules (product_id)
    - product_variants (product_id)
    - products (category_id)
    - profit_based_commission_costs (product_id)
    - profit_network_ad_costs (partner_id)
    - profit_network_deductions (enrollment_id, partner_id)
    - profit_network_enrollments (approved_by)
    - profit_network_sales (business_id, enrollment_id, partner_id)
*/

DO $$
BEGIN
  -- PayBright
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'paybright_audit_log' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_paybright_audit_log_user_id ON paybright_audit_log(user_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'paybright_refunds' AND column_name = 'requested_by') THEN
    CREATE INDEX IF NOT EXISTS idx_paybright_refunds_requested_by ON paybright_refunds(requested_by);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'paybright_subscriptions' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_paybright_subscriptions_merchant_id ON paybright_subscriptions(merchant_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'paybright_transactions' AND column_name = 'customer_id') THEN
    CREATE INDEX IF NOT EXISTS idx_paybright_transactions_customer_id ON paybright_transactions(customer_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'paybright_transactions' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_paybright_transactions_merchant_id ON paybright_transactions(merchant_id);
  END IF;
  
  -- Payouts
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payout_batches' AND column_name = 'partner_id') THEN
    CREATE INDEX IF NOT EXISTS idx_payout_batches_partner_id ON payout_batches(partner_id);
  END IF;
  
  -- Products
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'printing_orders' AND column_name = 'product_id') THEN
    CREATE INDEX IF NOT EXISTS idx_printing_orders_product_id ON printing_orders(product_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_commission_rules' AND column_name = 'product_id') THEN
    CREATE INDEX IF NOT EXISTS idx_product_commission_rules_product_id ON product_commission_rules(product_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'product_id') THEN
    CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category_id') THEN
    CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
  END IF;
  
  -- Profit network
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profit_based_commission_costs' AND column_name = 'product_id') THEN
    CREATE INDEX IF NOT EXISTS idx_profit_based_commission_costs_product_id ON profit_based_commission_costs(product_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profit_network_ad_costs' AND column_name = 'partner_id') THEN
    CREATE INDEX IF NOT EXISTS idx_profit_network_ad_costs_partner_id ON profit_network_ad_costs(partner_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profit_network_deductions' AND column_name = 'enrollment_id') THEN
    CREATE INDEX IF NOT EXISTS idx_profit_network_deductions_enrollment_id ON profit_network_deductions(enrollment_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profit_network_deductions' AND column_name = 'partner_id') THEN
    CREATE INDEX IF NOT EXISTS idx_profit_network_deductions_partner_id ON profit_network_deductions(partner_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profit_network_enrollments' AND column_name = 'approved_by') THEN
    CREATE INDEX IF NOT EXISTS idx_profit_network_enrollments_approved_by ON profit_network_enrollments(approved_by);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profit_network_sales' AND column_name = 'business_id') THEN
    CREATE INDEX IF NOT EXISTS idx_profit_network_sales_business_id ON profit_network_sales(business_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profit_network_sales' AND column_name = 'enrollment_id') THEN
    CREATE INDEX IF NOT EXISTS idx_profit_network_sales_enrollment_id ON profit_network_sales(enrollment_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profit_network_sales' AND column_name = 'partner_id') THEN
    CREATE INDEX IF NOT EXISTS idx_profit_network_sales_partner_id ON profit_network_sales(partner_id);
  END IF;
END $$;