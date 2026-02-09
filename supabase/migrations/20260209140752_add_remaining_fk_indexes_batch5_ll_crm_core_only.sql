/*
  # Add Missing Foreign Key Indexes - Batch 5: LocalLink CRM Core Tables

  This migration adds B-tree indexes for foreign key columns in core ll_crm tables.
  
  ## Tables Updated:
  - ll_crm_subscriptions (tier_id)
  - ll_crm_deals (contact_id, pipeline_id)
  - ll_crm_activities (contact_id, deal_id)
*/

-- LocalLink CRM Tables
CREATE INDEX IF NOT EXISTS idx_ll_crm_subscriptions_tier_id ON ll_crm_subscriptions(tier_id);

CREATE INDEX IF NOT EXISTS idx_ll_crm_deals_contact_id ON ll_crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_deals_pipeline_id ON ll_crm_deals(pipeline_id);

CREATE INDEX IF NOT EXISTS idx_ll_crm_activities_contact_id ON ll_crm_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_activities_deal_id ON ll_crm_activities(deal_id);
