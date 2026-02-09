/*
  # Add Profit Network Playbooks System

  1. New Tables
    - `profit_network_playbooks`
      - `id` (uuid, primary key)
      - `business_id` (uuid, foreign key to profit_network_businesses)
      - `title` (text)
      - `description` (text) - Full description of what the business is
      - `target_audience` (text) - Who would benefit from this product
      - `selling_strategy` (text) - How to sell it manually
      - `fb_advertising_info` (text) - How FB advertising works
      - `commission_info` (text) - Commission structure details
      - `year_one_projection` (jsonb) - Projected revenue scenarios
      - `key_benefits` (text[]) - Array of key benefits
      - `common_objections` (text[]) - Array of common objections and responses
      - `sales_scripts` (jsonb) - Sample scripts and talking points
      - `content` (text) - Full playbook content in markdown
      - `created_at`, `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `profit_network_playbooks` table
    - Add policy for partners to read playbooks for businesses they're enrolled in
    - Add policy for admins to manage playbooks
*/

-- Create profit_network_playbooks table
CREATE TABLE IF NOT EXISTS profit_network_playbooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES profit_network_businesses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  target_audience text NOT NULL,
  selling_strategy text NOT NULL,
  fb_advertising_info text NOT NULL,
  commission_info text NOT NULL,
  year_one_projection jsonb NOT NULL DEFAULT '{
    "conservative": {"monthly_sales": 5, "avg_sale": 500, "annual_revenue": 30000, "annual_commission": 7500},
    "moderate": {"monthly_sales": 15, "avg_sale": 750, "annual_revenue": 135000, "annual_commission": 33750},
    "aggressive": {"monthly_sales": 30, "avg_sale": 1000, "annual_revenue": 360000, "annual_commission": 90000}
  }'::jsonb,
  key_benefits text[] DEFAULT ARRAY[]::text[],
  common_objections jsonb DEFAULT '[]'::jsonb,
  sales_scripts jsonb DEFAULT '[]'::jsonb,
  content text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(business_id)
);

-- Add index
CREATE INDEX IF NOT EXISTS idx_profit_network_playbooks_business_id ON profit_network_playbooks(business_id);

-- Enable RLS
ALTER TABLE profit_network_playbooks ENABLE ROW LEVEL SECURITY;

-- Policy: Partners can view playbooks for enrolled businesses
CREATE POLICY "Partners can view playbooks for enrolled businesses"
  ON profit_network_playbooks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners p
      INNER JOIN profit_network_enrollments e ON e.partner_id = p.id
      WHERE p.user_id = auth.uid()
      AND e.business_id = profit_network_playbooks.business_id
      AND e.status IN ('approved', 'active')
    )
  );

-- Policy: Admins can manage all playbooks
CREATE POLICY "Admins can manage all playbooks"
  ON profit_network_playbooks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Anyone can view playbooks for active businesses (preview)
CREATE POLICY "Anyone can view playbooks for active businesses"
  ON profit_network_playbooks
  FOR SELECT
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM profit_network_businesses b
      WHERE b.id = profit_network_playbooks.business_id
      AND b.is_active = true
    )
  );
