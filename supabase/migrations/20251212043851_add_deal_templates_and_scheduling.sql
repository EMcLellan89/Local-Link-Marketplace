/*
  # Add Deal Templates and Automated Scheduling

  1. New Tables
    - `deal_templates`
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, references merchants)
      - `name` (text)
      - `title` (text)
      - `short_description` (text)
      - `description` (text)
      - `original_value_cents` (integer)
      - `price_cents` (integer)
      - `commission_rate` (numeric)
      - `redemption_instructions` (text)
      - `image_url` (text)
      - `tags` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `scheduled_deals`
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, references merchants)
      - `deal_id` (uuid, references deals, nullable)
      - `template_id` (uuid, references deal_templates, nullable)
      - `schedule_type` (text: one_time, recurring)
      - `recurrence_pattern` (jsonb) - for recurring deals
      - `auto_publish_at` (timestamptz)
      - `auto_pause_at` (timestamptz)
      - `status` (text: pending, active, completed, cancelled)
      - `last_executed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `deal_analytics`
      - `id` (uuid, primary key)
      - `deal_id` (uuid, references deals)
      - `date` (date)
      - `views` (integer)
      - `favorites` (integer)
      - `purchases` (integer)
      - `revenue_cents` (integer)
      - `conversion_rate` (numeric)

  2. Security
    - Enable RLS on all tables
    - Merchants can manage their own templates and scheduled deals
    - Read-only access to analytics
*/

-- Create deal templates table
CREATE TABLE IF NOT EXISTS deal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  original_value_cents INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  commission_rate NUMERIC(5,2) DEFAULT 30.00,
  redemption_instructions TEXT,
  image_url TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create scheduled deals table
CREATE TABLE IF NOT EXISTS scheduled_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  template_id UUID REFERENCES deal_templates(id) ON DELETE SET NULL,
  schedule_type TEXT NOT NULL CHECK (schedule_type IN ('one_time', 'recurring')),
  recurrence_pattern JSONB DEFAULT '{}'::jsonb,
  auto_publish_at TIMESTAMPTZ,
  auto_pause_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  last_executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create deal analytics table
CREATE TABLE IF NOT EXISTS deal_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  views INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  purchases INTEGER DEFAULT 0,
  revenue_cents INTEGER DEFAULT 0,
  conversion_rate NUMERIC(5,2) DEFAULT 0,
  UNIQUE(deal_id, date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_deal_templates_merchant_id ON deal_templates(merchant_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_deals_merchant_id ON scheduled_deals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_deals_status ON scheduled_deals(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_deals_auto_publish_at ON scheduled_deals(auto_publish_at);
CREATE INDEX IF NOT EXISTS idx_deal_analytics_deal_id ON deal_analytics(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_analytics_date ON deal_analytics(date);

-- Enable RLS
ALTER TABLE deal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_analytics ENABLE ROW LEVEL SECURITY;

-- Deal templates policies
CREATE POLICY "Merchants can view their own templates"
  ON deal_templates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can create templates"
  ON deal_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update their own templates"
  ON deal_templates FOR UPDATE
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
  ON deal_templates FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

-- Scheduled deals policies
CREATE POLICY "Merchants can view their own scheduled deals"
  ON scheduled_deals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can create scheduled deals"
  ON scheduled_deals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update their own scheduled deals"
  ON scheduled_deals FOR UPDATE
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

CREATE POLICY "Merchants can delete their own scheduled deals"
  ON scheduled_deals FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

-- Deal analytics policies
CREATE POLICY "Merchants can view analytics for their deals"
  ON deal_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deals d
      JOIN merchants m ON m.id = d.merchant_id
      WHERE d.id = deal_id
      AND m.user_id = auth.uid()
    )
  );

-- Function to track deal views
CREATE OR REPLACE FUNCTION increment_deal_view(p_deal_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO deal_analytics (deal_id, date, views)
  VALUES (p_deal_id, CURRENT_DATE, 1)
  ON CONFLICT (deal_id, date)
  DO UPDATE SET views = deal_analytics.views + 1;
END;
$$ LANGUAGE plpgsql;

-- Function to update deal analytics on purchase
CREATE OR REPLACE FUNCTION update_deal_analytics_on_purchase()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO deal_analytics (deal_id, date, purchases, revenue_cents)
  VALUES (NEW.deal_id, CURRENT_DATE, 1, NEW.amount_paid_cents)
  ON CONFLICT (deal_id, date)
  DO UPDATE SET 
    purchases = deal_analytics.purchases + 1,
    revenue_cents = deal_analytics.revenue_cents + NEW.amount_paid_cents,
    conversion_rate = CASE 
      WHEN deal_analytics.views > 0 THEN 
        ((deal_analytics.purchases + 1)::numeric / deal_analytics.views * 100)
      ELSE 0
    END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update analytics on purchase
DROP TRIGGER IF EXISTS trigger_update_deal_analytics_on_purchase ON purchases;
CREATE TRIGGER trigger_update_deal_analytics_on_purchase
  AFTER INSERT ON purchases
  FOR EACH ROW EXECUTE FUNCTION update_deal_analytics_on_purchase();
