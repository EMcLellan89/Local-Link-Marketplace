/*
  # Drop Unused Indexes - Security Audit Batch 12 (Final)
  
  Drops unused indexes from video, website, white label, and winback tables.
  
  These indexes have not been used and are safe to remove for improved database performance.
  
  Tables affected:
  - video_analytics
  - website_templates, websites
  - white_label_licenses
  - winback_campaigns
*/

-- Video tables
DROP INDEX IF EXISTS idx_video_analytics_video_id;
DROP INDEX IF EXISTS idx_video_analytics_merchant_id;

-- Website tables
DROP INDEX IF EXISTS idx_website_templates_category;
DROP INDEX IF EXISTS idx_websites_merchant_id;
DROP INDEX IF EXISTS idx_websites_template_id;

-- White label tables
DROP INDEX IF EXISTS idx_white_label_licenses_partner_id;
DROP INDEX IF EXISTS idx_white_label_licenses_status;

-- Winback tables
DROP INDEX IF EXISTS idx_winback_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_winback_campaigns_status;