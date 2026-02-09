/*
  # Add Vapi Voice AI Integration System

  1. New Tables
    - `vapi_configurations` - Store Vapi API keys and settings per merchant
    - `vapi_assistants` - Store AI assistant configurations (prompts, tools, voice settings)
    - `vapi_call_logs` - Track all voice calls made through Vapi
    - `vapi_tools` - Define available tool/function calls for assistants

  2. Security
    - Enable RLS on all tables
    - Merchants can only access their own data
    - Admin can access all data

  3. Indexes
    - Add indexes for merchant_id lookups
    - Add indexes for call tracking
*/

-- Vapi Configurations Table
CREATE TABLE IF NOT EXISTS vapi_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL UNIQUE,
  vapi_api_key text,
  vapi_public_key text,
  phone_number_id text,
  is_active boolean DEFAULT false,
  max_concurrent_calls integer DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vapi_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own vapi configuration"
  ON vapi_configurations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = vapi_configurations.merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own vapi configuration"
  ON vapi_configurations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = vapi_configurations.merchant_id
      AND merchants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = vapi_configurations.merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can insert own vapi configuration"
  ON vapi_configurations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = vapi_configurations.merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE INDEX idx_vapi_configurations_merchant_id ON vapi_configurations(merchant_id);

-- Vapi Assistants Table
CREATE TABLE IF NOT EXISTS vapi_assistants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  vapi_assistant_id text,
  name text NOT NULL,
  description text,
  system_prompt text NOT NULL,
  first_message text DEFAULT 'Hello! How can I help you today?',
  voice_provider text DEFAULT 'playht' CHECK (voice_provider IN ('playht', 'elevenlabs', 'deepgram', 'azure')),
  voice_id text,
  model text DEFAULT 'gpt-4' CHECK (model IN ('gpt-4', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet')),
  temperature numeric(3,2) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens integer DEFAULT 500,
  interruptions_enabled boolean DEFAULT true,
  background_sound text DEFAULT 'off' CHECK (background_sound IN ('off', 'office')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vapi_assistants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own vapi assistants"
  ON vapi_assistants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = vapi_assistants.merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can manage own vapi assistants"
  ON vapi_assistants FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = vapi_assistants.merchant_id
      AND merchants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = vapi_assistants.merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE INDEX idx_vapi_assistants_merchant_id ON vapi_assistants(merchant_id);
CREATE INDEX idx_vapi_assistants_active ON vapi_assistants(is_active) WHERE is_active = true;

-- Vapi Tools Table (Function definitions)
CREATE TABLE IF NOT EXISTS vapi_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assistant_id uuid REFERENCES vapi_assistants(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  endpoint_url text NOT NULL,
  parameters jsonb DEFAULT '[]'::jsonb,
  is_async boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vapi_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view tools for their assistants"
  ON vapi_tools FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vapi_assistants
      JOIN merchants ON merchants.id = vapi_assistants.merchant_id
      WHERE vapi_assistants.id = vapi_tools.assistant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can manage tools for their assistants"
  ON vapi_tools FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vapi_assistants
      JOIN merchants ON merchants.id = vapi_assistants.merchant_id
      WHERE vapi_assistants.id = vapi_tools.assistant_id
      AND merchants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vapi_assistants
      JOIN merchants ON merchants.id = vapi_assistants.merchant_id
      WHERE vapi_assistants.id = vapi_tools.assistant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE INDEX idx_vapi_tools_assistant_id ON vapi_tools(assistant_id);

-- Vapi Call Logs Table
CREATE TABLE IF NOT EXISTS vapi_call_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  assistant_id uuid REFERENCES vapi_assistants(id) ON DELETE SET NULL,
  vapi_call_id text,
  customer_phone text,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  direction text CHECK (direction IN ('inbound', 'outbound')),
  status text CHECK (status IN ('queued', 'ringing', 'in-progress', 'completed', 'failed', 'busy', 'no-answer')) DEFAULT 'queued',
  duration_seconds integer,
  cost_cents integer,
  transcript text,
  summary text,
  metadata jsonb DEFAULT '{}'::jsonb,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vapi_call_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own vapi call logs"
  ON vapi_call_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = vapi_call_logs.merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can insert own vapi call logs"
  ON vapi_call_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = vapi_call_logs.merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE INDEX idx_vapi_call_logs_merchant_id ON vapi_call_logs(merchant_id);
CREATE INDEX idx_vapi_call_logs_customer_id ON vapi_call_logs(customer_id);
CREATE INDEX idx_vapi_call_logs_created_at ON vapi_call_logs(created_at DESC);
CREATE INDEX idx_vapi_call_logs_status ON vapi_call_logs(status);

-- Function to get merchant's active assistant
CREATE OR REPLACE FUNCTION get_merchant_active_assistant(p_merchant_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_assistant record;
  v_tools jsonb;
BEGIN
  -- Get active assistant
  SELECT * INTO v_assistant
  FROM vapi_assistants
  WHERE merchant_id = p_merchant_id
  AND is_active = true
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'No active assistant found');
  END IF;

  -- Get tools for this assistant
  SELECT jsonb_agg(
    jsonb_build_object(
      'name', name,
      'description', description,
      'endpoint', endpoint_url,
      'parameters', parameters
    )
  ) INTO v_tools
  FROM vapi_tools
  WHERE assistant_id = v_assistant.id;

  RETURN jsonb_build_object(
    'assistant_id', v_assistant.id,
    'vapi_assistant_id', v_assistant.vapi_assistant_id,
    'name', v_assistant.name,
    'system_prompt', v_assistant.system_prompt,
    'first_message', v_assistant.first_message,
    'voice_provider', v_assistant.voice_provider,
    'voice_id', v_assistant.voice_id,
    'model', v_assistant.model,
    'temperature', v_assistant.temperature,
    'tools', COALESCE(v_tools, '[]'::jsonb)
  );
END;
$$;

-- Function to log tool call from Vapi
CREATE OR REPLACE FUNCTION log_vapi_tool_call(
  p_merchant_id uuid,
  p_call_id text,
  p_tool_name text,
  p_parameters jsonb,
  p_result jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO vapi_call_logs (
    merchant_id,
    vapi_call_id,
    metadata
  ) VALUES (
    p_merchant_id,
    p_call_id,
    jsonb_build_object(
      'tool_calls', jsonb_build_array(
        jsonb_build_object(
          'tool', p_tool_name,
          'parameters', p_parameters,
          'result', p_result,
          'timestamp', now()
        )
      )
    )
  )
  ON CONFLICT (vapi_call_id) DO UPDATE
  SET metadata = vapi_call_logs.metadata || jsonb_build_object(
    'tool_calls', 
    COALESCE(vapi_call_logs.metadata->'tool_calls', '[]'::jsonb) || 
    jsonb_build_array(
      jsonb_build_object(
        'tool', p_tool_name,
        'parameters', p_parameters,
        'result', p_result,
        'timestamp', now()
      )
    )
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;
