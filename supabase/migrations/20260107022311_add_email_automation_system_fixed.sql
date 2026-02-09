/*
  # Add Email Automation System

  1. Email Queue Table
    - Stores scheduled emails
    - Worker processes queued emails
    - Status tracking

  2. In-App Nudges Table
    - Progress prompts and banners
    - Dismissible notifications
    - Priority-based ordering

  3. System Email Templates
    - Pre-defined templates for sequences

  4. Security
    - RLS policies for user access
*/

-- Email queue for automation sequences
CREATE TABLE IF NOT EXISTS public.email_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_key text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  send_after timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'queued',
  sent_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_queue_send_after 
  ON public.email_queue(send_after) 
  WHERE status = 'queued';

CREATE INDEX IF NOT EXISTS idx_email_queue_user_status 
  ON public.email_queue(user_id, status);

ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email queue"
  ON public.email_queue FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- In-app nudges/banners
CREATE TABLE IF NOT EXISTS public.in_app_nudges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  cta_label text,
  cta_url text,
  priority int NOT NULL DEFAULT 50,
  is_dismissed boolean DEFAULT false,
  dismissed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, key)
);

CREATE INDEX IF NOT EXISTS idx_nudges_user_active 
  ON public.in_app_nudges(user_id, is_dismissed, priority);

ALTER TABLE public.in_app_nudges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own nudges"
  ON public.in_app_nudges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own nudges"
  ON public.in_app_nudges FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- System email templates (different from merchant email_templates)
CREATE TABLE IF NOT EXISTS public.system_email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  subject_line text NOT NULL,
  category text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seed email templates for Selling Recurring Revenue course
INSERT INTO public.system_email_templates (template_key, name, description, subject_line, category, is_active) VALUES
  ('SRR_PURCHASED_ACCESS', 'Course Access + Start Here', 'Immediate access email with first module link', 'Welcome to Selling Recurring Revenue™', 'course_onboarding', true),
  ('SRR_TOOLKIT_UPSELL', 'Toolkit One-Click Upsell', 'Sent 2 hours after course-only purchase', 'Skip guessing — use the templates', 'upsell', true),
  ('SRR_FIRST_OFFER', 'Your First Recurring Offer', 'Day 2 prompt to build tier ladder', 'Your first recurring offer in 15 minutes', 'engagement', true),
  ('SRR_OBJECTIONS', 'Objection Handling Prompt', 'Day 4 continuation nudge', 'Objections that kill deals (and what to say)', 'engagement', true),
  ('SRR_FINISH_EXAM', 'Finish Course Prompt', 'Day 7 exam reminder', 'Finish course → get certified', 'engagement', true),
  ('SRR_CERTIFIED_CRM', 'Partner CRM Activation', 'Day 8 after exam pass', 'Certified → earn commissions', 'conversion', true),
  ('SRR_BUNDLE_ACCESS', 'Bundle Access + Toolkit', 'Bundle buyer immediate access', 'Access + Toolkit download', 'course_onboarding', true),
  ('SRR_BUNDLE_CALCULATOR', 'Use Pricing Calculator', 'Day 1 toolkit feature highlight', 'Use the pricing calculator today', 'engagement', true),
  ('SRR_BUNDLE_PROPOSAL', 'Send First Proposal', 'Day 3 toolkit template prompt', 'Send your first proposal', 'engagement', true),
  ('SRR_BUNDLE_RETENTION', 'Retention Script', 'Day 5 retention template', 'Retention meeting script', 'engagement', true),
  ('SRR_BUNDLE_EXAM', 'Take the Exam', 'Day 7 exam prompt for bundle buyers', 'Take the exam', 'engagement', true),
  ('SRR_BUNDLE_PARTNER', 'Pre-Approved Partner Program', 'Day 8 after exam for bundle buyers', 'You''re pre-approved for partner program', 'conversion', true),
  ('SRR_INACTIVE_START', 'Quick Win Lesson 1', 'No activity after 48 hours', 'Quick win: do lesson 1 today', 'reengagement', true),
  ('SRR_INACTIVE_MODULE', 'Don''t Lose Momentum', 'Module started but inactive 5 days', 'Don''t lose momentum', 'reengagement', true)
ON CONFLICT (template_key) DO NOTHING;

-- Function to schedule email
CREATE OR REPLACE FUNCTION public.schedule_email(
  p_user_id uuid,
  p_template_key text,
  p_payload jsonb,
  p_delay_interval interval DEFAULT '0 seconds'::interval
)
RETURNS uuid AS $$
DECLARE
  v_email_id uuid;
BEGIN
  INSERT INTO public.email_queue (user_id, template_key, payload, send_after)
  VALUES (p_user_id, p_template_key, p_payload, now() + p_delay_interval)
  RETURNING id INTO v_email_id;
  
  RETURN v_email_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create nudge
CREATE OR REPLACE FUNCTION public.create_nudge(
  p_user_id uuid,
  p_key text,
  p_title text,
  p_body text,
  p_cta_label text DEFAULT NULL,
  p_cta_url text DEFAULT NULL,
  p_priority int DEFAULT 50
)
RETURNS uuid AS $$
DECLARE
  v_nudge_id uuid;
BEGIN
  INSERT INTO public.in_app_nudges (user_id, key, title, body, cta_label, cta_url, priority)
  VALUES (p_user_id, p_key, p_title, p_body, p_cta_label, p_cta_url, p_priority)
  ON CONFLICT (user_id, key) DO UPDATE
  SET 
    title = EXCLUDED.title,
    body = EXCLUDED.body,
    cta_label = EXCLUDED.cta_label,
    cta_url = EXCLUDED.cta_url,
    priority = EXCLUDED.priority,
    is_dismissed = false,
    dismissed_at = NULL
  RETURNING id INTO v_nudge_id;
  
  RETURN v_nudge_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;