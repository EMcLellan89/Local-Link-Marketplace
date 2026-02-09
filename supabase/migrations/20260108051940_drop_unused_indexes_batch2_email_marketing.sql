/*
  # Drop Unused Indexes - Batch 2: Email & Marketing Tables
  
  1. Performance Optimization
    - Remove 15 unused indexes from email and marketing tables
    - Reduces storage overhead and improves write performance
  
  2. Affected Tables
    - email_campaigns, email_subscribers, email_sends
    - email_automation_sequences, email_automation_steps
    - product_categories, products, product_variants
    - marketing_campaigns
*/

-- email_campaigns
DROP INDEX IF EXISTS idx_email_campaigns_merchant;
DROP INDEX IF EXISTS idx_email_campaigns_status;

-- email_subscribers
DROP INDEX IF EXISTS idx_email_subscribers_merchant;
DROP INDEX IF EXISTS idx_email_subscribers_email;

-- email_sends
DROP INDEX IF EXISTS idx_email_sends_campaign;
DROP INDEX IF EXISTS idx_email_sends_subscriber;

-- email_automation_sequences
DROP INDEX IF EXISTS idx_email_automation_sequences_merchant;

-- email_automation_steps
DROP INDEX IF EXISTS idx_email_automation_steps_sequence;

-- product_categories
DROP INDEX IF EXISTS idx_product_categories_merchant;

-- products
DROP INDEX IF EXISTS idx_products_merchant_new;
DROP INDEX IF EXISTS idx_products_category_new;

-- product_variants
DROP INDEX IF EXISTS idx_product_variants_product;

-- marketing_campaigns
DROP INDEX IF EXISTS idx_marketing_campaigns_segment_id;

-- email_automation_steps (additional)
DROP INDEX IF EXISTS idx_email_automation_steps_template_id;
