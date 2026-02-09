/*
  # Add Missing Foreign Key Indexes - Batch 16: Internal Communications & API

  1. Changes
    - Add indexes for customer_impersonation_log (business_unit_id, customer_id, team_member_id)
    - Add indexes for email_communications (business_unit_id, customer_id, sent_by)
    - Add indexes for external_business_webhooks (business_unit_id)
    - Add indexes for business_api_keys (business_unit_id, created_by)
    - Add indexes for customer_email_segments (business_unit_id, created_by)
    - Add indexes for marketing_email_campaigns (business_unit_id, created_by, segment_id)
    
  2. Rationale
    - Internal communications need efficient filtering
    - API key management requires business unit lookups
    - Email campaigns need segment and business unit queries
    
  3. Performance Impact
    - Faster communication log queries
    - Better webhook delivery tracking
    - Improved email campaign management
*/

-- Customer Impersonation Log
CREATE INDEX IF NOT EXISTS idx_customer_impersonation_log_business_unit_id ON customer_impersonation_log(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_impersonation_log_customer_id ON customer_impersonation_log(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_impersonation_log_team_member_id ON customer_impersonation_log(team_member_id);

-- Email Communications
CREATE INDEX IF NOT EXISTS idx_email_communications_business_unit_id ON email_communications(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_email_communications_customer_id ON email_communications(customer_id);
CREATE INDEX IF NOT EXISTS idx_email_communications_sent_by ON email_communications(sent_by);

-- External Business Webhooks
CREATE INDEX IF NOT EXISTS idx_external_business_webhooks_business_unit_id ON external_business_webhooks(business_unit_id);

-- Business API Keys
CREATE INDEX IF NOT EXISTS idx_business_api_keys_business_unit_id ON business_api_keys(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_business_api_keys_created_by ON business_api_keys(created_by);

-- Customer Email Segments
CREATE INDEX IF NOT EXISTS idx_customer_email_segments_business_unit_id ON customer_email_segments(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_email_segments_created_by ON customer_email_segments(created_by);

-- Marketing Email Campaigns
CREATE INDEX IF NOT EXISTS idx_marketing_email_campaigns_business_unit_id ON marketing_email_campaigns(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_marketing_email_campaigns_created_by ON marketing_email_campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_marketing_email_campaigns_segment_id ON marketing_email_campaigns(segment_id);
