/*
  # Add Missing Foreign Key Indexes - New Batch 5 (Final)
  
  1. New Indexes
    - idx_reviews_customer_id on reviews(customer_id)
    - idx_subscriptions_plan_id on subscriptions(plan_id)
    - idx_support_tickets_customer_id on support_tickets(customer_id)
    - idx_ugc_orders_creator_id on ugc_orders(creator_id)
  
  2. Performance
    - Improves join and foreign key lookup performance
    - Essential for query optimization
  
  3. Summary
    - Total of 35 new foreign key indexes added across all batches
*/

-- reviews.customer_id
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id 
ON reviews(customer_id);

-- subscriptions.plan_id
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id 
ON subscriptions(plan_id);

-- support_tickets.customer_id
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id 
ON support_tickets(customer_id);

-- ugc_orders.creator_id
CREATE INDEX IF NOT EXISTS idx_ugc_orders_creator_id 
ON ugc_orders(creator_id);