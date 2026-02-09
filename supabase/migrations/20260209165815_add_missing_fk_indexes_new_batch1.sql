/*
  # Add Missing Foreign Key Indexes - New Batch 1
  
  1. New Indexes
    - idx_affiliate_clicks_partner_id on affiliate_clicks(partner_id)
    - idx_affiliate_commissions_partner_id on affiliate_commissions(partner_id)
    - idx_affiliate_commissions_order_id on affiliate_commissions(order_id)
    - idx_affiliate_payouts_partner_id on affiliate_payouts(partner_id)
    - idx_appointments_customer_id on appointments(customer_id)
    - idx_blog_posts_category_id on blog_posts(category_id)
    - idx_cart_items_cart_id on cart_items(cart_id)
    - idx_cart_items_product_id on cart_items(product_id)
  
  2. Performance
    - Improves join and foreign key lookup performance
    - Essential for query optimization
*/

-- affiliate_clicks.partner_id
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_partner_id 
ON affiliate_clicks(partner_id);

-- affiliate_commissions.partner_id
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_partner_id 
ON affiliate_commissions(partner_id);

-- affiliate_commissions.order_id
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_order_id 
ON affiliate_commissions(order_id);

-- affiliate_payouts.partner_id
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_partner_id 
ON affiliate_payouts(partner_id);

-- appointments.customer_id
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id 
ON appointments(customer_id);

-- blog_posts.category_id
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id 
ON blog_posts(category_id);

-- cart_items.cart_id
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id 
ON cart_items(cart_id);

-- cart_items.product_id
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id 
ON cart_items(product_id);