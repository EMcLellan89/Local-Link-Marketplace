/*
  # Fix Critical Security: Function Search Path Vulnerabilities
  
  1. Security Fixes
    - Set explicit search_path for 8 functions to prevent SQL injection
    - Functions affected:
      - schedule_email
      - create_nudge
      - sync_free_course_access
      - quarter_date_range
      - schedule_srr_sequence
      - deliver_swipe_assets_to_partner
      - schedule_sms
      - get_partner_quarterly_revenue
  
  2. Important Notes
    - Setting search_path = '' prevents role-based search path manipulation
    - This is a critical security fix to prevent privilege escalation
    - Functions will only search in explicitly qualified schemas
*/

-- Fix schedule_email function
DROP FUNCTION IF EXISTS schedule_email(uuid, text, text, text, timestamptz);
CREATE OR REPLACE FUNCTION schedule_email(
  p_user_id uuid,
  p_template_key text,
  p_subject text,
  p_body text,
  p_send_after timestamptz DEFAULT now()
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_queue_id uuid;
BEGIN
  INSERT INTO public.email_queue (user_id, template_key, subject, body, send_after, status)
  VALUES (p_user_id, p_template_key, p_subject, p_body, p_send_after, 'pending')
  RETURNING id INTO v_queue_id;
  
  RETURN v_queue_id;
END;
$$;

-- Fix create_nudge function
DROP FUNCTION IF EXISTS create_nudge(uuid, text, text, text, jsonb);
CREATE OR REPLACE FUNCTION create_nudge(
  p_user_id uuid,
  p_title text,
  p_message text,
  p_cta_text text DEFAULT NULL,
  p_cta_action jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_nudge_id uuid;
BEGIN
  INSERT INTO public.in_app_nudges (user_id, title, message, cta_text, cta_action, status)
  VALUES (p_user_id, p_title, p_message, p_cta_text, p_cta_action, 'active')
  RETURNING id INTO v_nudge_id;
  
  RETURN v_nudge_id;
END;
$$;

-- Fix sync_free_course_access function
DROP FUNCTION IF EXISTS sync_free_course_access();
CREATE OR REPLACE FUNCTION sync_free_course_access()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Sync free course access for all users
  INSERT INTO public.user_entitlements (user_id, product_slug, source, granted_at)
  SELECT DISTINCT 
    u.id,
    pe.product_slug,
    'free_tier',
    now()
  FROM auth.users u
  CROSS JOIN public.product_entitlements pe
  WHERE pe.tier_required = 'free'
    AND NOT EXISTS (
      SELECT 1 FROM public.user_entitlements ue
      WHERE ue.user_id = u.id 
        AND ue.product_slug = pe.product_slug
    );
END;
$$;

-- Fix quarter_date_range function
DROP FUNCTION IF EXISTS quarter_date_range(int, int);
CREATE OR REPLACE FUNCTION quarter_date_range(year int, quarter int)
RETURNS TABLE(start_date date, end_date date)
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE quarter
      WHEN 1 THEN make_date(year, 1, 1)
      WHEN 2 THEN make_date(year, 4, 1)
      WHEN 3 THEN make_date(year, 7, 1)
      WHEN 4 THEN make_date(year, 10, 1)
    END AS start_date,
    CASE quarter
      WHEN 1 THEN make_date(year, 3, 31)
      WHEN 2 THEN make_date(year, 6, 30)
      WHEN 3 THEN make_date(year, 9, 30)
      WHEN 4 THEN make_date(year, 12, 31)
    END AS end_date;
END;
$$;

-- Fix schedule_srr_sequence function  
DROP FUNCTION IF EXISTS schedule_srr_sequence(uuid);
CREATE OR REPLACE FUNCTION schedule_srr_sequence(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Schedule email sequence for Selling Recurring Revenue course
  PERFORM public.schedule_email(
    p_user_id,
    'srr_welcome',
    'Welcome to Selling Recurring Revenue',
    'Your journey begins now...',
    now()
  );
  
  PERFORM public.schedule_email(
    p_user_id,
    'srr_day2',
    'Day 2: Understanding Value',
    'Let''s dive into value creation...',
    now() + interval '1 day'
  );
END;
$$;

-- Fix deliver_swipe_assets_to_partner function
DROP FUNCTION IF EXISTS deliver_swipe_assets_to_partner(uuid, text);
CREATE OR REPLACE FUNCTION deliver_swipe_assets_to_partner(
  p_partner_id uuid,
  p_product_sku text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Insert partner assets from templates
  INSERT INTO public.partner_assets (partner_id, product_sku, asset_type, asset_url, title, description)
  SELECT 
    p_partner_id,
    p_product_sku,
    st.asset_type,
    st.asset_url,
    st.title,
    st.description
  FROM public.swipe_templates st
  WHERE st.product_sku = p_product_sku
    AND st.is_active = true
    AND NOT EXISTS (
      SELECT 1 FROM public.partner_assets pa
      WHERE pa.partner_id = p_partner_id
        AND pa.product_sku = p_product_sku
        AND pa.asset_url = st.asset_url
    );
END;
$$;

-- Fix schedule_sms function
DROP FUNCTION IF EXISTS schedule_sms(uuid, text, text, timestamptz);
CREATE OR REPLACE FUNCTION schedule_sms(
  p_user_id uuid,
  p_phone_number text,
  p_message text,
  p_send_after timestamptz DEFAULT now()
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_queue_id uuid;
BEGIN
  INSERT INTO public.sms_queue (user_id, phone_number, message, send_after, status)
  VALUES (p_user_id, p_phone_number, p_message, p_send_after, 'pending')
  RETURNING id INTO v_queue_id;
  
  RETURN v_queue_id;
END;
$$;

-- Fix get_partner_quarterly_revenue function
DROP FUNCTION IF EXISTS get_partner_quarterly_revenue(uuid, int, int);
CREATE OR REPLACE FUNCTION get_partner_quarterly_revenue(
  p_partner_id uuid,
  p_year int,
  p_quarter int
)
RETURNS numeric
LANGUAGE plpgsql
STABLE
SET search_path = ''
AS $$
DECLARE
  v_total numeric;
  v_start_date date;
  v_end_date date;
BEGIN
  SELECT start_date, end_date INTO v_start_date, v_end_date
  FROM public.quarter_date_range(p_year, p_quarter);
  
  SELECT COALESCE(SUM(amount), 0) INTO v_total
  FROM public.affiliate_commissions
  WHERE partner_id = p_partner_id
    AND status = 'paid'
    AND paid_at >= v_start_date
    AND paid_at <= v_end_date;
  
  RETURN v_total;
END;
$$;
