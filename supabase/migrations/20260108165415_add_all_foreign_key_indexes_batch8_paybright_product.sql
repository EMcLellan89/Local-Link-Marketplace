/*
  # Add All Foreign Key Indexes - Batch 8 (PayBright, Payout, Printing, Product, Profile, Prompt)
  
  1. Foreign Key Indexes for:
    - PayBright, Payout, Printing, Product, Profile, Prompt tables
*/

-- paybright_audit_log
CREATE INDEX IF NOT EXISTS idx_paybright_audit_log_merchant_id 
  ON paybright_audit_log(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_audit_log_user_id 
  ON paybright_audit_log(user_id);

-- paybright_refunds
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_merchant_id 
  ON paybright_refunds(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_requested_by 
  ON paybright_refunds(requested_by);
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_transaction_id 
  ON paybright_refunds(transaction_id);

-- paybright_subscriptions
CREATE INDEX IF NOT EXISTS idx_paybright_subscriptions_customer_id 
  ON paybright_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_paybright_subscriptions_merchant_id 
  ON paybright_subscriptions(merchant_id);

-- paybright_transactions
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_customer_id 
  ON paybright_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_merchant_id 
  ON paybright_transactions(merchant_id);

-- payout_batches
CREATE INDEX IF NOT EXISTS idx_payout_batches_partner_id 
  ON payout_batches(partner_id);

-- printing_orders
CREATE INDEX IF NOT EXISTS idx_printing_orders_product_id 
  ON printing_orders(product_id);

-- product_categories
CREATE INDEX IF NOT EXISTS idx_product_categories_parent_category_id 
  ON product_categories(parent_category_id);

-- product_course_map
CREATE INDEX IF NOT EXISTS idx_product_course_map_course_slug 
  ON product_course_map(course_slug);

-- product_variants
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id 
  ON product_variants(product_id);

-- products
CREATE INDEX IF NOT EXISTS idx_products_category_id 
  ON products(category_id);

-- profiles
CREATE INDEX IF NOT EXISTS idx_profiles_partner_id 
  ON profiles(partner_id);

-- prompt_runs
CREATE INDEX IF NOT EXISTS idx_prompt_runs_prompt_id 
  ON prompt_runs(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_runs_user_id 
  ON prompt_runs(user_id);

-- prompts
CREATE INDEX IF NOT EXISTS idx_prompts_category_id 
  ON prompts(category_id);
