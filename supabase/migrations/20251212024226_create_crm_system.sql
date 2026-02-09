/*
  # CRM System for Lead Management

  ## Overview
  Complete CRM system for businesses to manage leads from all platform services including:
  - Website inquiries
  - Printing services
  - Postcard campaigns
  - Swag orders
  - Any other service leads

  ## New Tables

  ### 1. crm_leads
  Main leads table tracking potential customers
  - `id` (uuid, primary key)
  - `merchant_id` (uuid, references merchants) - which merchant owns this lead
  - `first_name` (text) - lead's first name
  - `last_name` (text) - lead's last name
  - `email` (text) - contact email
  - `phone` (text) - contact phone
  - `company` (text) - lead's company name
  - `status` (text) - pipeline stage: new, contacted, qualified, proposal, negotiation, won, lost
  - `lead_source` (text) - where the lead came from: website, printing, postcards, swag, referral, other
  - `lead_value` (decimal) - estimated deal value
  - `priority` (text) - hot, warm, cold
  - `assigned_to` (uuid, references profiles) - team member assigned to this lead
  - `notes` (text) - general notes about the lead
  - `next_follow_up` (timestamptz) - when to follow up next
  - `converted_date` (timestamptz) - when lead was won
  - `lost_reason` (text) - why lead was lost
  - `tags` (text array) - custom tags for categorization
  - `custom_fields` (jsonb) - flexible custom data
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. crm_activities
  Track all interactions and notes with leads
  - `id` (uuid, primary key)
  - `merchant_id` (uuid, references merchants)
  - `lead_id` (uuid, references crm_leads)
  - `user_id` (uuid, references profiles) - who logged this activity
  - `activity_type` (text) - call, email, meeting, note, task_completed
  - `subject` (text) - activity subject/title
  - `description` (text) - detailed description
  - `activity_date` (timestamptz) - when activity occurred
  - `duration_minutes` (integer) - how long it took
  - `outcome` (text) - result of the activity
  - `created_at` (timestamptz)

  ### 3. crm_tasks
  Follow-up tasks for leads
  - `id` (uuid, primary key)
  - `merchant_id` (uuid, references merchants)
  - `lead_id` (uuid, references crm_leads)
  - `assigned_to` (uuid, references profiles)
  - `created_by` (uuid, references profiles)
  - `title` (text) - task title
  - `description` (text) - task details
  - `due_date` (timestamptz) - when task is due
  - `priority` (text) - high, medium, low
  - `status` (text) - pending, completed, cancelled
  - `completed_at` (timestamptz)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can only access CRM data for their own merchant account
  - Proper policies for team collaboration

  ## Notes
  1. Flexible lead tracking with customizable fields
  2. Complete activity history for each lead
  3. Task management for follow-ups
  4. Pipeline stages to track progress
  5. Lead source tracking to measure marketing effectiveness
*/

-- Create crm_leads table
CREATE TABLE IF NOT EXISTS crm_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  company text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  lead_source text DEFAULT 'other' CHECK (lead_source IN ('website', 'printing', 'postcards', 'swag', 'referral', 'direct', 'other')),
  lead_value decimal(10,2) DEFAULT 0,
  priority text DEFAULT 'warm' CHECK (priority IN ('hot', 'warm', 'cold')),
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  notes text DEFAULT '',
  next_follow_up timestamptz,
  converted_date timestamptz,
  lost_reason text,
  tags text[] DEFAULT '{}',
  custom_fields jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_crm_leads_merchant_id ON crm_leads(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_assigned_to ON crm_leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_leads_next_follow_up ON crm_leads(next_follow_up);

-- Create crm_activities table
CREATE TABLE IF NOT EXISTS crm_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  lead_id uuid REFERENCES crm_leads(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  activity_type text DEFAULT 'note' CHECK (activity_type IN ('call', 'email', 'meeting', 'note', 'task_completed')),
  subject text NOT NULL,
  description text DEFAULT '',
  activity_date timestamptz DEFAULT now(),
  duration_minutes integer DEFAULT 0,
  outcome text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_crm_activities_lead_id ON crm_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_merchant_id ON crm_activities(merchant_id);

-- Create crm_tasks table
CREATE TABLE IF NOT EXISTS crm_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  lead_id uuid REFERENCES crm_leads(id) ON DELETE CASCADE NOT NULL,
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text DEFAULT '',
  due_date timestamptz NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_crm_tasks_lead_id ON crm_tasks(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_assigned_to ON crm_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_due_date ON crm_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_status ON crm_tasks(status);

-- Enable RLS
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crm_leads
CREATE POLICY "Merchants can view their leads"
  ON crm_leads FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can create leads"
  ON crm_leads FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update their leads"
  ON crm_leads FOR UPDATE
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

CREATE POLICY "Merchants can delete their leads"
  ON crm_leads FOR DELETE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for crm_activities
CREATE POLICY "Merchants can view lead activities"
  ON crm_activities FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can create activities"
  ON crm_activities FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update activities"
  ON crm_activities FOR UPDATE
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

CREATE POLICY "Merchants can delete activities"
  ON crm_activities FOR DELETE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for crm_tasks
CREATE POLICY "Merchants can view tasks"
  ON crm_tasks FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can create tasks"
  ON crm_tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update tasks"
  ON crm_tasks FOR UPDATE
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

CREATE POLICY "Merchants can delete tasks"
  ON crm_tasks FOR DELETE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_crm_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_crm_leads_updated_at_trigger ON crm_leads;
CREATE TRIGGER update_crm_leads_updated_at_trigger
  BEFORE UPDATE ON crm_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_crm_leads_updated_at();