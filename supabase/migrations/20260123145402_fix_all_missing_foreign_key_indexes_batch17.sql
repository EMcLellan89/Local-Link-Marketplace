/*
  # Fix Missing Foreign Key Indexes - Batch 17 (Video, Website, Winback Tables)
  
  1. Performance
    - Add indexes on all unindexed foreign keys
  
  2. Tables Updated
    - video tables
    - website_orders
    - winback tables
*/

CREATE INDEX IF NOT EXISTS idx_video_deliverables_order_id ON video_deliverables(order_id);
CREATE INDEX IF NOT EXISTS idx_video_revisions_order_id ON video_revisions(order_id);
CREATE INDEX IF NOT EXISTS idx_video_revisions_requested_by ON video_revisions(requested_by);
CREATE INDEX IF NOT EXISTS idx_video_scripts_approved_by ON video_scripts(approved_by);
CREATE INDEX IF NOT EXISTS idx_video_scripts_order_id ON video_scripts(order_id);
CREATE INDEX IF NOT EXISTS idx_video_service_orders_merchant_id ON video_service_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_website_orders_merchant_id ON website_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_website_orders_template_id ON website_orders(template_id);
CREATE INDEX IF NOT EXISTS idx_winback_campaigns_merchant_id ON winback_campaigns(merchant_id);
CREATE INDEX IF NOT EXISTS idx_winback_conversions_customer_id ON winback_conversions(customer_id);
CREATE INDEX IF NOT EXISTS idx_winback_conversions_outreach_id ON winback_conversions(outreach_id);
CREATE INDEX IF NOT EXISTS idx_winback_outreach_campaign_id ON winback_outreach(campaign_id);
CREATE INDEX IF NOT EXISTS idx_winback_outreach_customer_id ON winback_outreach(customer_id);
CREATE INDEX IF NOT EXISTS idx_winback_outreach_trigger_id ON winback_outreach(trigger_id);
CREATE INDEX IF NOT EXISTS idx_winback_triggers_campaign_id ON winback_triggers(campaign_id);
CREATE INDEX IF NOT EXISTS idx_winback_triggers_customer_id ON winback_triggers(customer_id);
