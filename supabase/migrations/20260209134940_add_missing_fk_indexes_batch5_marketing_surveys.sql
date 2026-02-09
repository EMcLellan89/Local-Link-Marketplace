/*
  # Add Missing Foreign Key Indexes - Batch 5: Marketing & Surveys

  1. Changes
    - Add indexes for marketing_campaigns (segment_id)
    - Add indexes for campaign_recipients (customer_id)
    - Add indexes for email_templates (merchant_id)
    - Add indexes for deal_templates (merchant_id)
    - Add indexes for scheduled_deals (template_id)
    - Add indexes for surveys (merchant_id)
    - Add indexes for survey_responses (survey_id, customer_id, purchase_id)
    
  2. Rationale
    - Marketing campaigns need efficient customer targeting
    - Survey results require fast aggregation
    
  3. Performance Impact
    - Faster campaign recipient queries
    - Better survey analytics performance
*/

-- Marketing Campaigns
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_segment_id ON marketing_campaigns(segment_id);

-- Campaign Recipients
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_customer_id ON campaign_recipients(customer_id);

-- Email Templates
CREATE INDEX IF NOT EXISTS idx_email_templates_merchant_id ON email_templates(merchant_id);

-- Deal Templates
CREATE INDEX IF NOT EXISTS idx_deal_templates_merchant_id ON deal_templates(merchant_id);

-- Scheduled Deals
CREATE INDEX IF NOT EXISTS idx_scheduled_deals_template_id ON scheduled_deals(template_id);

-- Surveys
CREATE INDEX IF NOT EXISTS idx_surveys_merchant_id ON surveys(merchant_id);

-- Survey Responses
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_customer_id ON survey_responses(customer_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_purchase_id ON survey_responses(purchase_id);
