/*
  # Drop Unused Indexes - Batch 14: Playbooks, Profit Network, StoryLab & White Label Tables
  
  1. Tables Affected
    - playbook_* tables
    - profit_network_* tables
    - storylab_* tables
    - white_label_* tables
  
  2. Performance Impact
    - Removes unused indexes on partner and business network tables
    - Improves write performance
  
  3. Safety
    - All indexes have idx_scan = 0
*/

-- Playbooks
DROP INDEX IF EXISTS idx_playbooks_partner_id;
DROP INDEX IF EXISTS idx_playbook_steps_playbook_id;
DROP INDEX IF EXISTS idx_playbook_progress_partner_id;
DROP INDEX IF EXISTS idx_partner_playbook_progress_partner_id;
DROP INDEX IF EXISTS idx_profit_network_playbooks_business_id;

-- Profit Network
DROP INDEX IF EXISTS idx_profit_network_businesses_partner_id;
DROP INDEX IF EXISTS idx_profit_network_enrollments_partner_id;
DROP INDEX IF EXISTS idx_profit_network_enrollments_business_id;
DROP INDEX IF EXISTS idx_profit_network_commissions_partner_id;

-- StoryLab
DROP INDEX IF EXISTS idx_storylab_projects_merchant_id;
DROP INDEX IF EXISTS idx_storylab_orders_merchant_id;
DROP INDEX IF EXISTS idx_storylab_content_project_id;
DROP INDEX IF EXISTS idx_storylab_statements_merchant_id;

-- White Label
DROP INDEX IF EXISTS idx_white_label_licenses_partner_id;
DROP INDEX IF EXISTS idx_white_label_configs_license_id;
DROP INDEX IF EXISTS idx_white_label_subscriptions_license_id;