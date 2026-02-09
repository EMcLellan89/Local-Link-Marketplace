/*
  # Add Missing Foreign Key Indexes - Batch 13: DFY Services & Creative System

  1. New Indexes
    - dfy_fulfillment_tasks.order_id
    - dfy_fulfillment_tasks.product_id
    - dfy_order_items.order_id
    - dfy_order_items.product_id
    - dfy_orders.merchant_id
    - dfy_orders.partner_id
    - creative_events.creative_id
    - creative_events.partner_id
    - creative_library.partner_id
    - creative_tracking.creative_id
    - creative_tracking.partner_id

  2. Performance Impact
    - Improves DFY order fulfillment tracking
    - Optimizes creative asset performance queries
*/

-- DFY System Indexes
CREATE INDEX IF NOT EXISTS idx_dfy_fulfillment_tasks_order_id ON dfy_fulfillment_tasks(order_id);
CREATE INDEX IF NOT EXISTS idx_dfy_fulfillment_tasks_product_id ON dfy_fulfillment_tasks(product_id);
CREATE INDEX IF NOT EXISTS idx_dfy_order_items_order_id ON dfy_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_dfy_order_items_product_id ON dfy_order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_dfy_orders_merchant_id ON dfy_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_dfy_orders_partner_id ON dfy_orders(partner_id);

-- Creative System Indexes
CREATE INDEX IF NOT EXISTS idx_creative_events_creative_id ON creative_events(creative_id);
CREATE INDEX IF NOT EXISTS idx_creative_events_partner_id ON creative_events(partner_id);
CREATE INDEX IF NOT EXISTS idx_creative_library_partner_id ON creative_library(partner_id);
CREATE INDEX IF NOT EXISTS idx_creative_tracking_creative_id ON creative_tracking(creative_id);
CREATE INDEX IF NOT EXISTS idx_creative_tracking_partner_id ON creative_tracking(partner_id);
