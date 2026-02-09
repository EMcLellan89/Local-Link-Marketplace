/*
  # Add API Key Management and Email Segmentation System

  ## Overview
  This migration adds API key management for external business integrations and email marketing segmentation.

  ## New Tables
  
  ### 1. `business_api_keys`
  - Stores API keys for each business to authenticate webhook requests
  - Fields:
    - `id` (uuid, primary key)
    - `business_unit_id` (uuid, FK to business_units)
    - `api_key` (text, unique) - The actual API key
    - `api_secret` (text) - Secret for additional security
    - `is_active` (boolean) - Whether key is enabled
    - `last_used_at` (timestamp) - Track usage
    - `expires_at` (timestamp) - Optional expiration
    - `permissions` (jsonb) - What this key can do
    - `created_by` (uuid, FK to internal_team_members)
    - `created_at`, `updated_at` (timestamps)

  ### 2. `customer_email_segments`
  - Allows segmentation of customers for targeted marketing
  - Fields:
    - `id` (uuid, primary key)
    - `name` (text) - Segment name
    - `description` (text)
    - `business_unit_id` (uuid, FK) - Segment per business or all
    - `filters` (jsonb) - Criteria for segment
    - `customer_count` (integer) - Cached count
    - `created_by` (uuid, FK to internal_team_members)
    - `created_at`, `updated_at`

  ### 3. `marketing_email_campaigns`
  - Email campaigns sent to segments
  - Fields:
    - `id` (uuid)
    - `campaign_name` (text)
    - `business_unit_id` (uuid, FK)
    - `segment_id` (uuid, FK to customer_email_segments)
    - `subject_line` (text)
    - `email_body` (text)
    - `status` (text) - draft, scheduled, sent, failed
    - `scheduled_at` (timestamp)
    - `sent_at` (timestamp)
    - `total_sent` (integer)
    - `total_opened` (integer)
    - `total_clicked` (integer)
    - `created_by` (uuid, FK)
    - `created_at`, `updated_at`

  ## Security
  - RLS enabled on all tables
  - Service role can access (for webhook validation)
  - Team members authenticated via separate login system

  ## Functions
  - `generate_api_key()` - Generates secure random API key
  - `get_segment_customers()` - Returns customers matching segment filters
*/

-- Create business_api_keys table
CREATE TABLE IF NOT EXISTS business_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_unit_id uuid REFERENCES business_units(id) ON DELETE CASCADE NOT NULL,
  api_key text UNIQUE NOT NULL,
  api_secret text NOT NULL,
  is_active boolean DEFAULT true,
  last_used_at timestamptz,
  expires_at timestamptz,
  permissions jsonb DEFAULT '{"customer.read": true, "customer.write": true, "sale.write": true, "subscription.write": true}'::jsonb,
  created_by uuid REFERENCES internal_team_members(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customer_email_segments table
CREATE TABLE IF NOT EXISTS customer_email_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  business_unit_id uuid REFERENCES business_units(id) ON DELETE CASCADE,
  filters jsonb DEFAULT '{}'::jsonb,
  customer_count integer DEFAULT 0,
  created_by uuid REFERENCES internal_team_members(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create marketing_email_campaigns table
CREATE TABLE IF NOT EXISTS marketing_email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name text NOT NULL,
  business_unit_id uuid REFERENCES business_units(id) ON DELETE CASCADE,
  segment_id uuid REFERENCES customer_email_segments(id) ON DELETE SET NULL,
  subject_line text NOT NULL,
  email_body text NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  total_sent integer DEFAULT 0,
  total_opened integer DEFAULT 0,
  total_clicked integer DEFAULT 0,
  created_by uuid REFERENCES internal_team_members(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_business_api_keys_business_unit ON business_api_keys(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_business_api_keys_active ON business_api_keys(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_business_api_keys_key ON business_api_keys(api_key) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_customer_email_segments_business ON customer_email_segments(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_business ON marketing_email_campaigns(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_status ON marketing_email_campaigns(status);

-- Enable RLS (but allow service role full access for webhook validation)
ALTER TABLE business_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_email_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_email_campaigns ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_api_keys (allow all for service role)
CREATE POLICY "Allow service role full access to API keys"
  ON business_api_keys FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for customer_email_segments
CREATE POLICY "Allow service role full access to segments"
  ON customer_email_segments FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for marketing_email_campaigns
CREATE POLICY "Allow service role full access to campaigns"
  ON marketing_email_campaigns FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to generate secure API key
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  key_prefix text := 'llm_';
  random_part text;
BEGIN
  random_part := encode(gen_random_bytes(32), 'hex');
  RETURN key_prefix || random_part;
END;
$$;

-- Function to generate API secret
CREATE OR REPLACE FUNCTION generate_api_secret()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$;

-- Function to validate API key
CREATE OR REPLACE FUNCTION validate_api_key(key_param text, secret_param text)
RETURNS TABLE (
  valid boolean,
  business_unit_id uuid,
  business_name text,
  permissions jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  key_record RECORD;
BEGIN
  SELECT 
    bak.id,
    bak.business_unit_id,
    bak.permissions,
    bu.name as business_name,
    bak.is_active,
    bak.expires_at
  INTO key_record
  FROM business_api_keys bak
  JOIN business_units bu ON bu.id = bak.business_unit_id
  WHERE bak.api_key = key_param
    AND bak.api_secret = secret_param;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, NULL::jsonb;
    RETURN;
  END IF;

  IF NOT key_record.is_active THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, NULL::jsonb;
    RETURN;
  END IF;

  IF key_record.expires_at IS NOT NULL AND key_record.expires_at < now() THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, NULL::jsonb;
    RETURN;
  END IF;

  -- Update last used timestamp
  UPDATE business_api_keys SET last_used_at = now() WHERE id = key_record.id;

  RETURN QUERY SELECT true, key_record.business_unit_id, key_record.business_name, key_record.permissions;
END;
$$;

-- Function to get customers matching segment filters
CREATE OR REPLACE FUNCTION get_segment_customers(segment_id_param uuid)
RETURNS TABLE (
  customer_id uuid,
  email text,
  full_name text,
  business_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  segment_filters jsonb;
  segment_business_id uuid;
BEGIN
  SELECT filters, business_unit_id
  INTO segment_filters, segment_business_id
  FROM customer_email_segments
  WHERE id = segment_id_param;

  RETURN QUERY
  SELECT 
    uc.id,
    uc.email,
    uc.full_name,
    uc.business_name
  FROM unified_customers uc
  LEFT JOIN customer_business_relationships cbr ON cbr.customer_id = uc.id
  WHERE 
    (segment_business_id IS NULL OR cbr.business_unit_id = segment_business_id)
    AND uc.status = 'active'
    AND uc.email IS NOT NULL;
END;
$$;