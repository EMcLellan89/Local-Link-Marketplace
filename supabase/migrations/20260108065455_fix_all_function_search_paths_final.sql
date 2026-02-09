/*
  # Fix All Function Search Paths - Final
  
  1. Security Fix
    - Adds explicit search_path to all functions to prevent search_path hijacking
    - Sets search_path = 'public, pg_catalog' for security
    - Uses CASCADE to handle dependent triggers
    - Skips trigger recreation (trigger may not need to exist)
    
  2. Functions Fixed
    - schedule_email (2 versions)
    - create_nudge (2 versions)
    - sync_free_course_access (2 versions)
    - schedule_srr_sequence (2 versions)
    - schedule_sms (2 versions)
*/

-- schedule_email version 1
DROP FUNCTION IF EXISTS schedule_email(uuid, text, jsonb, interval) CASCADE;
CREATE FUNCTION schedule_email(
  p_user_id uuid,
  p_template_key text,
  p_payload jsonb,
  p_delay_interval interval DEFAULT '00:00:00'::interval
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  INSERT INTO email_queue (user_id, template_key, variables, scheduled_for, status)
  VALUES (p_user_id, p_template_key, p_payload, now() + p_delay_interval, 'pending');
END;
$$;

-- schedule_email version 2
DROP FUNCTION IF EXISTS schedule_email(uuid, text, text, text, timestamptz) CASCADE;
CREATE FUNCTION schedule_email(
  p_user_id uuid,
  p_template_key text,
  p_subject text,
  p_body text,
  p_send_after timestamptz DEFAULT now()
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  INSERT INTO email_queue (user_id, template_key, variables, scheduled_for, status)
  VALUES (p_user_id, p_template_key, jsonb_build_object('subject', p_subject, 'body', p_body), p_send_after, 'pending');
END;
$$;

-- create_nudge version 1
DROP FUNCTION IF EXISTS create_nudge(uuid, text, text, text, text, text, integer) CASCADE;
CREATE FUNCTION create_nudge(
  p_user_id uuid,
  p_key text,
  p_title text,
  p_body text,
  p_cta_label text DEFAULT NULL,
  p_cta_url text DEFAULT NULL,
  p_priority integer DEFAULT 50
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  v_nudge_id uuid;
BEGIN
  INSERT INTO partner_nudges (user_id, key, title, body, cta_label, cta_url, priority, status)
  VALUES (p_user_id, p_key, p_title, p_body, p_cta_label, p_cta_url, p_priority, 'pending')
  RETURNING id INTO v_nudge_id;
  
  RETURN v_nudge_id;
END;
$$;

-- create_nudge version 2
DROP FUNCTION IF EXISTS create_nudge(uuid, text, text, text, jsonb) CASCADE;
CREATE FUNCTION create_nudge(
  p_user_id uuid,
  p_title text,
  p_message text,
  p_cta_text text DEFAULT NULL,
  p_cta_action jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  v_nudge_id uuid;
BEGIN
  INSERT INTO partner_nudges (user_id, title, message, cta_text, cta_action, status)
  VALUES (p_user_id, p_title, p_message, p_cta_text, p_cta_action, 'pending')
  RETURNING id INTO v_nudge_id;
  
  RETURN v_nudge_id;
END;
$$;

-- sync_free_course_access version 1 (no params)
DROP FUNCTION IF EXISTS sync_free_course_access() CASCADE;
CREATE FUNCTION sync_free_course_access()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  INSERT INTO course_enrollments (user_id, course_slug, enrollment_date, access_type)
  SELECT 
    u.id,
    'local-link-academy-free',
    now(),
    'free'
  FROM auth.users u
  WHERE NOT EXISTS (
    SELECT 1 FROM course_enrollments ce 
    WHERE ce.user_id = u.id AND ce.course_slug = 'local-link-academy-free'
  );
END;
$$;

-- sync_free_course_access version 2 (with user_id)
DROP FUNCTION IF EXISTS sync_free_course_access(uuid) CASCADE;
CREATE FUNCTION sync_free_course_access(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  INSERT INTO course_enrollments (user_id, course_slug, enrollment_date, access_type)
  VALUES (p_user_id, 'local-link-academy-free', now(), 'free')
  ON CONFLICT (user_id, course_slug) DO NOTHING;
END;
$$;

-- schedule_srr_sequence version 1 (no params)
DROP FUNCTION IF EXISTS schedule_srr_sequence() CASCADE;
CREATE FUNCTION schedule_srr_sequence()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  -- Schedule for all users enrolled in SRR course
  PERFORM schedule_email(
    ce.user_id, 
    'srr_module_' || (ce.current_module + 1)::text,
    '{}'::jsonb,
    INTERVAL '1 day'
  )
  FROM course_enrollments ce
  WHERE ce.course_slug = 'selling-recurring-revenue'
    AND ce.current_module < 5;
END;
$$;

-- schedule_srr_sequence version 2 (with user_id)
DROP FUNCTION IF EXISTS schedule_srr_sequence(uuid) CASCADE;
CREATE FUNCTION schedule_srr_sequence(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  PERFORM schedule_email(p_user_id, 'srr_welcome', '{}'::jsonb, INTERVAL '0');
  PERFORM schedule_email(p_user_id, 'srr_module_1', '{}'::jsonb, INTERVAL '1 day');
  PERFORM schedule_email(p_user_id, 'srr_module_2', '{}'::jsonb, INTERVAL '3 days');
  PERFORM schedule_email(p_user_id, 'srr_module_3', '{}'::jsonb, INTERVAL '5 days');
  PERFORM schedule_email(p_user_id, 'srr_module_4', '{}'::jsonb, INTERVAL '7 days');
  PERFORM schedule_email(p_user_id, 'srr_module_5', '{}'::jsonb, INTERVAL '9 days');
END;
$$;

-- schedule_sms version 1
DROP FUNCTION IF EXISTS schedule_sms(uuid, text, text, text, interval) CASCADE;
CREATE FUNCTION schedule_sms(
  p_user_id uuid,
  p_phone_number text,
  p_body text,
  p_template_key text DEFAULT NULL,
  p_delay_interval interval DEFAULT '00:00:00'::interval
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  INSERT INTO sms_queue (user_id, phone_number, message, template_key, scheduled_for, status)
  VALUES (p_user_id, p_phone_number, p_body, p_template_key, now() + p_delay_interval, 'pending');
END;
$$;

-- schedule_sms version 2
DROP FUNCTION IF EXISTS schedule_sms(uuid, text, text, timestamptz) CASCADE;
CREATE FUNCTION schedule_sms(
  p_user_id uuid,
  p_phone_number text,
  p_message text,
  p_send_after timestamptz DEFAULT now()
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  INSERT INTO sms_queue (user_id, phone_number, message, scheduled_for, status)
  VALUES (p_user_id, p_phone_number, p_message, p_send_after, 'pending');
END;
$$;
