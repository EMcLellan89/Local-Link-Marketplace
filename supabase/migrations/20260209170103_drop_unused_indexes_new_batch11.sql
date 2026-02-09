/*
  # Drop Unused Indexes - New Batch 11
  
  1. Indexes to Drop (Websites, Winback, Additional Tables)
    - Website templates
    - Winback campaigns
    - Additional business logic tables
  
  2. Performance Impact
    - Reduces storage overhead
    - Speeds up INSERT/UPDATE operations
    - All indexes have idx_scan = 0 (never used)
*/

-- Website indexes
DROP INDEX IF EXISTS idx_website_templates_category;
DROP INDEX IF EXISTS idx_website_templates_type;
DROP INDEX IF EXISTS idx_websites_merchant_id;
DROP INDEX IF EXISTS idx_websites_status;

-- Winback indexes
DROP INDEX IF EXISTS idx_winback_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_winback_campaigns_status;
DROP INDEX IF EXISTS idx_winback_targets_campaign_id;
DROP INDEX IF EXISTS idx_winback_targets_customer_id;

-- Additional indexes
DROP INDEX IF EXISTS idx_qr_codes_merchant_id;
DROP INDEX IF EXISTS idx_qr_codes_type;
DROP INDEX IF EXISTS idx_survey_responses_customer_id;
DROP INDEX IF EXISTS idx_survey_responses_survey_id;
DROP INDEX IF EXISTS idx_surveys_merchant_id;
DROP INDEX IF EXISTS idx_surveys_status;
DROP INDEX IF EXISTS idx_memberships_customer_id;
DROP INDEX IF EXISTS idx_memberships_merchant_id;
DROP INDEX IF EXISTS idx_memberships_status;
DROP INDEX IF EXISTS idx_shopping_carts_customer_id;
DROP INDEX IF EXISTS idx_shopping_carts_updated_at;