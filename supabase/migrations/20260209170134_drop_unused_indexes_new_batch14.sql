/*
  # Drop Unused Indexes - New Batch 14
  
  1. Indexes to Drop (Advanced Features)
    - Creative tracking and moat system
    - External sales ingest
    - Financial engine advanced
    - Partner milestones
  
  2. Performance Impact
    - Reduces storage overhead
    - Speeds up INSERT/UPDATE operations
    - All indexes have idx_scan = 0 (never used)
*/

-- Creative tracking indexes
DROP INDEX IF EXISTS idx_creatives_campaign_id;
DROP INDEX IF EXISTS idx_creatives_status;
DROP INDEX IF EXISTS idx_creative_events_event_type;
DROP INDEX IF EXISTS idx_creative_events_timestamp;
DROP INDEX IF EXISTS idx_moat_creatives_partner_id;
DROP INDEX IF EXISTS idx_moat_creatives_status;

-- External sales indexes
DROP INDEX IF EXISTS idx_external_sales_ingests_partner_id;
DROP INDEX IF EXISTS idx_external_sales_ingests_processed_at;
DROP INDEX IF EXISTS idx_external_sales_ingests_status;

-- Financial engine indexes
DROP INDEX IF EXISTS idx_financial_rules_merchant_id;
DROP INDEX IF EXISTS idx_financial_rules_type;
DROP INDEX IF EXISTS idx_financial_documents_merchant_id;
DROP INDEX IF EXISTS idx_financial_documents_type;
DROP INDEX IF EXISTS idx_financial_vault_items_merchant_id;

-- Partner milestone indexes
DROP INDEX IF EXISTS idx_partner_milestones_partner_id;
DROP INDEX IF EXISTS idx_partner_milestones_achieved_at;
DROP INDEX IF EXISTS idx_partner_milestones_type;