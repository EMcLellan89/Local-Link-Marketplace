/*
  # Drop Unused Indexes - New Batch 15 (Final)
  
  1. Indexes to Drop (Platform Features)
    - Playbooks system
    - Profit Network
    - StoryLab integration
    - White label licensing
    - Partner system advanced
  
  2. Performance Impact
    - Reduces storage overhead
    - Speeds up INSERT/UPDATE operations
    - All indexes have idx_scan = 0 (never used)
  
  3. Summary
    - Total 700+ unused indexes dropped across all batches
*/

-- Playbooks indexes
DROP INDEX IF EXISTS idx_partner_playbooks_partner_id;
DROP INDEX IF EXISTS idx_partner_playbooks_status;
DROP INDEX IF EXISTS idx_playbook_lessons_playbook_id;
DROP INDEX IF EXISTS idx_playbook_progress_partner_id;

-- Profit Network indexes
DROP INDEX IF EXISTS idx_profit_network_businesses_status;
DROP INDEX IF EXISTS idx_profit_network_enrollments_partner_id;
DROP INDEX IF EXISTS idx_profit_network_enrollments_status;

-- StoryLab indexes
DROP INDEX IF EXISTS idx_storylab_orders_partner_id;
DROP INDEX IF EXISTS idx_storylab_orders_status;
DROP INDEX IF EXISTS idx_storylab_videos_status;

-- White Label indexes
DROP INDEX IF EXISTS idx_white_label_licenses_partner_id;
DROP INDEX IF EXISTS idx_white_label_licenses_status;

-- Partner system advanced
DROP INDEX IF EXISTS idx_partner_crm_contacts_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_status;
DROP INDEX IF EXISTS idx_partner_tracking_links_partner_id;
DROP INDEX IF EXISTS idx_partner_ad_vault_category;
DROP INDEX IF EXISTS idx_partner_ad_vault_industry;