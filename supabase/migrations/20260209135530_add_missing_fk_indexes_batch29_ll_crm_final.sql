/*
  # Add Missing Foreign Key Indexes - Batch 29: LocalLink CRM (Final)

  1. Changes
    - Add indexes for ll_crm_subscriptions (tier_id)
    - Add indexes for ll_crm_contacts (merchant_id, assigned_to, created_by)
    - Add indexes for ll_crm_pipelines (merchant_id)
    - Add indexes for ll_crm_deals (merchant_id, pipeline_id, contact_id, assigned_to)
    - Add indexes for ll_crm_activities (merchant_id, contact_id, deal_id, assigned_to, created_by)
    - Add indexes for ll_crm_email_campaigns (merchant_id)
    - Add indexes for ll_crm_email_sends (campaign_id)
    
  2. Rationale
    - LocalLink CRM requires efficient merchant filtering
    - Contact management needs user assignment lookups
    - Deal pipeline requires pipeline and contact queries
    - Activity tracking needs comprehensive indexing
    
  3. Performance Impact
    - Faster CRM dashboard loading
    - Better contact and deal queries
    - Improved activity timeline rendering
    - Enhanced email campaign tracking
*/

-- LocalLink CRM Subscriptions
CREATE INDEX IF NOT EXISTS idx_ll_crm_subscriptions_tier_id ON ll_crm_subscriptions(tier_id);

-- LocalLink CRM Contacts
CREATE INDEX IF NOT EXISTS idx_ll_crm_contacts_merchant_id ON ll_crm_contacts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_contacts_assigned_to ON ll_crm_contacts(assigned_to);
CREATE INDEX IF NOT EXISTS idx_ll_crm_contacts_created_by ON ll_crm_contacts(created_by);

-- LocalLink CRM Pipelines
CREATE INDEX IF NOT EXISTS idx_ll_crm_pipelines_merchant_id ON ll_crm_pipelines(merchant_id);

-- LocalLink CRM Deals
CREATE INDEX IF NOT EXISTS idx_ll_crm_deals_merchant_id ON ll_crm_deals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_deals_pipeline_id ON ll_crm_deals(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_deals_contact_id ON ll_crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_deals_assigned_to ON ll_crm_deals(assigned_to);

-- LocalLink CRM Activities
CREATE INDEX IF NOT EXISTS idx_ll_crm_activities_merchant_id ON ll_crm_activities(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_activities_contact_id ON ll_crm_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_activities_deal_id ON ll_crm_activities(deal_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_activities_assigned_to ON ll_crm_activities(assigned_to);
CREATE INDEX IF NOT EXISTS idx_ll_crm_activities_created_by ON ll_crm_activities(created_by);

-- LocalLink CRM Email Campaigns
CREATE INDEX IF NOT EXISTS idx_ll_crm_email_campaigns_merchant_id ON ll_crm_email_campaigns(merchant_id);

-- LocalLink CRM Email Sends
CREATE INDEX IF NOT EXISTS idx_ll_crm_email_sends_campaign_id ON ll_crm_email_sends(campaign_id);
