/*
  # Add Missing Foreign Key Indexes - Batch 2
  
  Adds covering indexes for unindexed foreign keys to improve query performance.
  
  1. Indexes Added
    - marketplace_orders.product_id
    - partner_badges.badge_id
    - partner_certifications.certification_id
*/

CREATE INDEX IF NOT EXISTS idx_marketplace_orders_product_id 
  ON marketplace_orders(product_id);

CREATE INDEX IF NOT EXISTS idx_partner_badges_badge_id 
  ON partner_badges(badge_id);

CREATE INDEX IF NOT EXISTS idx_partner_certifications_certification_id 
  ON partner_certifications(certification_id);
