/*
  # Drop Unused Indexes - Batch 20: Website, Weekly, and Winback Tables (Final)

  1. Changes
    - Drop unused indexes from website_* tables
    - Drop unused indexes from weekly_* tables
    - Drop unused indexes from white_label_* tables
    - Drop unused indexes from winback_* tables
    
  2. Rationale
    - These indexes have idx_scan = 0, never used by queries
    - Final batch to complete unused index cleanup
*/

-- Website tables
DROP INDEX IF EXISTS idx_website_orders_merchant_id;
DROP INDEX IF EXISTS idx_website_orders_template_id;

-- Weekly tables
DROP INDEX IF EXISTS idx_weekly_creative_winners_creative_id;

-- White label tables
DROP INDEX IF EXISTS idx_white_label_licenses_partner_id;
DROP INDEX IF EXISTS idx_white_label_licenses_vertical_product_id;

-- Winback tables
DROP INDEX IF EXISTS idx_winback_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_winback_conversions_customer_id;
DROP INDEX IF EXISTS idx_winback_conversions_outreach_id;
DROP INDEX IF EXISTS idx_winback_outreach_campaign_id;
DROP INDEX IF EXISTS idx_winback_outreach_customer_id;
DROP INDEX IF EXISTS idx_winback_outreach_trigger_id;
DROP INDEX IF EXISTS idx_winback_triggers_campaign_id;
DROP INDEX IF EXISTS idx_winback_triggers_customer_id;
