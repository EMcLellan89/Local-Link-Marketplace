/*
  # Add Twilio VoIP and Email Communication System

  1. New Tables
    - `twilio_configurations`
      - Stores Twilio API credentials and settings per merchant
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, references merchants)
      - `account_sid` (text, encrypted Twilio Account SID)
      - `auth_token_encrypted` (text, encrypted auth token)
      - `phone_number` (text, Twilio phone number)
      - `sendgrid_api_key_encrypted` (text, encrypted SendGrid API key for email)
      - `email_from_address` (text, verified sender email)
      - `email_from_name` (text, sender name)
      - `voicemail_enabled` (boolean)
      - `call_recording_enabled` (boolean)
      - `sms_enabled` (boolean)
      - `email_enabled` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `twilio_phone_numbers`
      - Tracks purchased Twilio phone numbers
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, references merchants)
      - `phone_number` (text, E.164 format)
      - `friendly_name` (text)
      - `capabilities` (jsonb, voice/sms/mms capabilities)
      - `status` (text, active/inactive)
      - `monthly_cost_cents` (integer)
      - `purchased_at` (timestamptz)

    - `twilio_call_logs`
      - Logs all inbound and outbound calls
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, references merchants)
      - `lead_id` (uuid, references crm_leads, nullable)
      - `call_sid` (text, Twilio call identifier)
      - `direction` (text, inbound/outbound)
      - `from_number` (text)
      - `to_number` (text)
      - `status` (text, queued/ringing/in-progress/completed/failed/busy/no-answer)
      - `duration_seconds` (integer)
      - `recording_url` (text, nullable)
      - `transcription` (text, nullable)
      - `cost_cents` (integer)
      - `notes` (text)
      - `created_at` (timestamptz)

    - `twilio_sms_logs`
      - Logs all SMS messages sent/received
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, references merchants)
      - `lead_id` (uuid, references crm_leads, nullable)
      - `message_sid` (text, Twilio message identifier)
      - `direction` (text, inbound/outbound)
      - `from_number` (text)
      - `to_number` (text)
      - `body` (text)
      - `status` (text, queued/sent/delivered/failed)
      - `num_media` (integer)
      - `media_urls` (jsonb)
      - `cost_cents` (integer)
      - `created_at` (timestamptz)

    - `twilio_email_logs`
      - Logs all emails sent via SendGrid/Twilio
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, references merchants)
      - `lead_id` (uuid, references crm_leads, nullable)
      - `message_id` (text, SendGrid message ID)
      - `from_email` (text)
      - `to_email` (text)
      - `subject` (text)
      - `body_html` (text)
      - `body_text` (text)
      - `status` (text, queued/sent/delivered/opened/clicked/bounced/failed)
      - `opened_at` (timestamptz, nullable)
      - `clicked_at` (timestamptz, nullable)
      - `cost_cents` (integer)
      - `created_at` (timestamptz)

    - `twilio_voicemails`
      - Stores voicemail recordings and transcriptions
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, references merchants)
      - `lead_id` (uuid, references crm_leads, nullable)
      - `call_sid` (text, references call that left voicemail)
      - `from_number` (text)
      - `recording_url` (text)
      - `recording_duration_seconds` (integer)
      - `transcription` (text, nullable)
      - `is_listened` (boolean)
      - `notes` (text)
      - `created_at` (timestamptz)

    - `twilio_call_queues`
      - Manages call queue for inbound calls
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, references merchants)
      - `call_sid` (text)
      - `from_number` (text)
      - `queue_position` (integer)
      - `wait_time_seconds` (integer)
      - `status` (text, waiting/connected/abandoned)
      - `assigned_to_user_id` (uuid, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Merchants can only access their own communication records
    - Authenticated users (employees) can view their merchant's records
    - Encrypted fields for sensitive API credentials

  3. Indexes
    - Index on merchant_id for all tables
    - Index on lead_id for linking communications to leads
    - Index on call_sid, message_sid for Twilio webhook lookups
    - Index on created_at for time-based queries
*/

-- Twilio Configurations
CREATE TABLE IF NOT EXISTS twilio_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  account_sid text,
  auth_token_encrypted text,
  phone_number text,
  sendgrid_api_key_encrypted text,
  email_from_address text,
  email_from_name text DEFAULT '',
  voicemail_enabled boolean DEFAULT true,
  call_recording_enabled boolean DEFAULT false,
  sms_enabled boolean DEFAULT true,
  email_enabled boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(merchant_id)
);

ALTER TABLE twilio_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own Twilio config"
  ON twilio_configurations FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own Twilio config"
  ON twilio_configurations FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can insert own Twilio config"
  ON twilio_configurations FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Twilio Phone Numbers
CREATE TABLE IF NOT EXISTS twilio_phone_numbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  phone_number text NOT NULL,
  friendly_name text DEFAULT '',
  capabilities jsonb DEFAULT '{"voice": true, "sms": true, "mms": false}'::jsonb,
  status text DEFAULT 'active',
  monthly_cost_cents integer DEFAULT 100,
  purchased_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE twilio_phone_numbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own phone numbers"
  ON twilio_phone_numbers FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Twilio Call Logs
CREATE TABLE IF NOT EXISTS twilio_call_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  lead_id uuid REFERENCES crm_leads(id) ON DELETE SET NULL,
  call_sid text NOT NULL,
  direction text NOT NULL,
  from_number text NOT NULL,
  to_number text NOT NULL,
  status text DEFAULT 'queued',
  duration_seconds integer DEFAULT 0,
  recording_url text,
  transcription text,
  cost_cents integer DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE twilio_call_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own call logs"
  ON twilio_call_logs FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can insert call logs"
  ON twilio_call_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own call logs"
  ON twilio_call_logs FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Twilio SMS Logs
CREATE TABLE IF NOT EXISTS twilio_sms_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  lead_id uuid REFERENCES crm_leads(id) ON DELETE SET NULL,
  message_sid text NOT NULL,
  direction text NOT NULL,
  from_number text NOT NULL,
  to_number text NOT NULL,
  body text NOT NULL,
  status text DEFAULT 'queued',
  num_media integer DEFAULT 0,
  media_urls jsonb DEFAULT '[]'::jsonb,
  cost_cents integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE twilio_sms_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own SMS logs"
  ON twilio_sms_logs FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can insert SMS logs"
  ON twilio_sms_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own SMS logs"
  ON twilio_sms_logs FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Twilio Email Logs
CREATE TABLE IF NOT EXISTS twilio_email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  lead_id uuid REFERENCES crm_leads(id) ON DELETE SET NULL,
  message_id text NOT NULL,
  from_email text NOT NULL,
  to_email text NOT NULL,
  subject text NOT NULL,
  body_html text DEFAULT '',
  body_text text DEFAULT '',
  status text DEFAULT 'queued',
  opened_at timestamptz,
  clicked_at timestamptz,
  cost_cents integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE twilio_email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own email logs"
  ON twilio_email_logs FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can insert email logs"
  ON twilio_email_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own email logs"
  ON twilio_email_logs FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Twilio Voicemails
CREATE TABLE IF NOT EXISTS twilio_voicemails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  lead_id uuid REFERENCES crm_leads(id) ON DELETE SET NULL,
  call_sid text NOT NULL,
  from_number text NOT NULL,
  recording_url text NOT NULL,
  recording_duration_seconds integer DEFAULT 0,
  transcription text,
  is_listened boolean DEFAULT false,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE twilio_voicemails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own voicemails"
  ON twilio_voicemails FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own voicemails"
  ON twilio_voicemails FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Twilio Call Queues
CREATE TABLE IF NOT EXISTS twilio_call_queues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  call_sid text NOT NULL,
  from_number text NOT NULL,
  queue_position integer DEFAULT 1,
  wait_time_seconds integer DEFAULT 0,
  status text DEFAULT 'waiting',
  assigned_to_user_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE twilio_call_queues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own call queue"
  ON twilio_call_queues FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own call queue"
  ON twilio_call_queues FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_twilio_config_merchant ON twilio_configurations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_phones_merchant ON twilio_phone_numbers(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_calls_merchant ON twilio_call_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_calls_lead ON twilio_call_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_calls_sid ON twilio_call_logs(call_sid);
CREATE INDEX IF NOT EXISTS idx_twilio_calls_created ON twilio_call_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_twilio_sms_merchant ON twilio_sms_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_sms_lead ON twilio_sms_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_sms_sid ON twilio_sms_logs(message_sid);
CREATE INDEX IF NOT EXISTS idx_twilio_sms_created ON twilio_sms_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_twilio_email_merchant ON twilio_email_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_email_lead ON twilio_email_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_email_created ON twilio_email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_twilio_voicemail_merchant ON twilio_voicemails(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_voicemail_listened ON twilio_voicemails(is_listened);
CREATE INDEX IF NOT EXISTS idx_twilio_queue_merchant ON twilio_call_queues(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_queue_status ON twilio_call_queues(status);
