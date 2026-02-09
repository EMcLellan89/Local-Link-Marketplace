/*
  # Add Marketing Campaigns and Customer Segmentation

  1. New Tables
    - `customer_segments`
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, references merchants)
      - `name` (text)
      - `description` (text)
      - `filters` (jsonb) - JSON object with filter criteria
      - `customer_count` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `marketing_campaigns`
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, references merchants)
      - `name` (text)
      - `type` (text: email, sms, push)
      - `subject` (text)
      - `message` (text)
      - `segment_id` (uuid, references customer_segments, nullable)
      - `status` (text: draft, scheduled, sending, sent, failed)
      - `scheduled_at` (timestamptz)
      - `sent_at` (timestamptz)
      - `recipient_count` (integer)
      - `opened_count` (integer)
      - `clicked_count` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `campaign_recipients`
      - `id` (uuid, primary key)
      - `campaign_id` (uuid, references marketing_campaigns)
      - `customer_id` (uuid, references customers)
      - `status` (text: pending, sent, failed, opened, clicked)
      - `sent_at` (timestamptz)
      - `opened_at` (timestamptz)
      - `clicked_at` (timestamptz)
      - `error_message` (text)
    
    - `email_templates`
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, references merchants)
      - `name` (text)
      - `subject` (text)
      - `body` (text)
      - `template_type` (text: promotion, reminder, welcome, thank_you)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Merchants can manage their own segments and campaigns
    - Customers can view campaigns sent to them
*/

-- Create customer segments table
CREATE TABLE IF NOT EXISTS customer_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  filters JSONB DEFAULT '{}'::jsonb,
  customer_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create marketing campaigns table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'push')),
  subject TEXT,
  message TEXT NOT NULL,
  segment_id UUID REFERENCES customer_segments(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  recipient_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create campaign recipients table
CREATE TABLE IF NOT EXISTS campaign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'opened', 'clicked')),
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  error_message TEXT,
  UNIQUE(campaign_id, customer_id)
);

-- Create email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('promotion', 'reminder', 'welcome', 'thank_you', 'custom')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_customer_segments_merchant_id ON customer_segments(merchant_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_merchant_id ON marketing_campaigns(merchant_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_status ON marketing_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_scheduled_at ON marketing_campaigns(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_campaign_id ON campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_customer_id ON campaign_recipients(customer_id);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_status ON campaign_recipients(status);
CREATE INDEX IF NOT EXISTS idx_email_templates_merchant_id ON email_templates(merchant_id);

-- Enable RLS
ALTER TABLE customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Customer segments policies
CREATE POLICY "Merchants can view their own segments"
  ON customer_segments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can create segments"
  ON customer_segments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update their own segments"
  ON customer_segments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can delete their own segments"
  ON customer_segments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

-- Marketing campaigns policies
CREATE POLICY "Merchants can view their own campaigns"
  ON marketing_campaigns FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can create campaigns"
  ON marketing_campaigns FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update their own campaigns"
  ON marketing_campaigns FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can delete their own campaigns"
  ON marketing_campaigns FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

-- Campaign recipients policies
CREATE POLICY "Merchants can view recipients of their campaigns"
  ON campaign_recipients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM marketing_campaigns mc
      JOIN merchants m ON m.id = mc.merchant_id
      WHERE mc.id = campaign_id
      AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can view campaigns sent to them"
  ON campaign_recipients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

-- Email templates policies
CREATE POLICY "Merchants can view their own templates"
  ON email_templates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can create templates"
  ON email_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update their own templates"
  ON email_templates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can delete their own templates"
  ON email_templates FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

-- Function to update campaign stats when recipients are updated
CREATE OR REPLACE FUNCTION update_campaign_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.status = 'opened' AND OLD.status != 'opened' THEN
      UPDATE marketing_campaigns 
      SET opened_count = opened_count + 1 
      WHERE id = NEW.campaign_id;
    END IF;
    
    IF NEW.status = 'clicked' AND OLD.status != 'clicked' THEN
      UPDATE marketing_campaigns 
      SET clicked_count = clicked_count + 1 
      WHERE id = NEW.campaign_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update campaign stats
DROP TRIGGER IF EXISTS trigger_update_campaign_stats ON campaign_recipients;
CREATE TRIGGER trigger_update_campaign_stats
  AFTER UPDATE ON campaign_recipients
  FOR EACH ROW EXECUTE FUNCTION update_campaign_stats();
