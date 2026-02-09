/*
  # Fix Function Search Path Mutability

  1. Purpose
    - Set search_path to empty string for security
    - Prevents search_path manipulation attacks
    - Makes functions IMMUTABLE where appropriate
  
  2. Functions Affected
    - week_start
    - generate_referral_slug
    - normalize_vendor
    - week_start_utc
  
  3. Security Impact
    - CRITICAL: Prevents SQL injection via search_path
    - Ensures functions use fully qualified names
*/

-- Fix week_start function
CREATE OR REPLACE FUNCTION week_start(d date)
RETURNS date
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT (d - ((EXTRACT(DOW FROM d)::integer + 6) % 7 || ' days')::interval)::date;
$$;

-- Fix week_start_utc function
CREATE OR REPLACE FUNCTION week_start_utc(ts timestamptz)
RETURNS timestamptz
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT date_trunc('week', ts AT TIME ZONE 'UTC')::timestamptz;
$$;

-- Fix generate_referral_slug function
CREATE OR REPLACE FUNCTION generate_referral_slug()
RETURNS text
LANGUAGE plpgsql
VOLATILE
SET search_path = ''
AS $$
DECLARE
  new_slug text;
  slug_exists boolean;
BEGIN
  LOOP
    new_slug := lower(substring(md5(random()::text) from 1 for 8));
    
    SELECT EXISTS(
      SELECT 1 FROM public.partners WHERE referral_slug = new_slug
    ) INTO slug_exists;
    
    EXIT WHEN NOT slug_exists;
  END LOOP;
  
  RETURN new_slug;
END;
$$;

-- Fix normalize_vendor function
CREATE OR REPLACE FUNCTION normalize_vendor(v text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT lower(regexp_replace(trim(v), '\s+', ' ', 'g'));
$$;
