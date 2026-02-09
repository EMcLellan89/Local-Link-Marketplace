/*
  # Add Missing Foreign Key Indexes - Batch 34: Email Campaigns & Products

  1. Changes
    - Add indexes for email_campaigns (merchant_id)
    - Add indexes for email_sends (campaign_id, subscriber_id)
    - Add indexes for email_automation_sequences (merchant_id)
    - Add indexes for email_automation_steps (template_id)
    - Add indexes for gift_card_templates (merchant_id)
    - Add indexes for product_categories (parent_category_id)
    - Add indexes for products (category_id)
    - Add indexes for product_variants (product_id)
    - Add indexes for ecommerce_orders (customer_id, merchant_id)
    - Add indexes for order_items (order_id, product_id, variant_id)
    
  2. Rationale
    - Email campaigns need merchant filtering
    - Product catalog requires category lookups
    - Ecommerce orders need customer and merchant queries
    
  3. Performance Impact
    - Faster email campaign management
    - Better product catalog browsing
    - Improved order processing
*/

-- Email Campaigns
CREATE INDEX IF NOT EXISTS idx_email_campaigns_merchant_id ON email_campaigns(merchant_id);

-- Email Sends
CREATE INDEX IF NOT EXISTS idx_email_sends_campaign_id ON email_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_subscriber_id ON email_sends(subscriber_id);

-- Email Automation
CREATE INDEX IF NOT EXISTS idx_email_automation_sequences_merchant_id ON email_automation_sequences(merchant_id);
CREATE INDEX IF NOT EXISTS idx_email_automation_steps_template_id ON email_automation_steps(template_id);

-- Gift Card Templates
CREATE INDEX IF NOT EXISTS idx_gift_card_templates_merchant_id ON gift_card_templates(merchant_id);

-- Product Categories
CREATE INDEX IF NOT EXISTS idx_product_categories_parent_category_id ON product_categories(parent_category_id);

-- Products
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Product Variants
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);

-- Ecommerce Orders
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_customer_id ON ecommerce_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_merchant_id ON ecommerce_orders(merchant_id);

-- Order Items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON order_items(variant_id);
