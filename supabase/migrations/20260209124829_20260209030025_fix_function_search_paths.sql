/*
  # Fix Function Search Paths

  1. Changes
    - Add SET search_path TO '' to functions missing this security setting
    - Prevents search_path injection attacks
    
  2. Functions Fixed
    - generate_referral_slug(name_input text, id_num integer)
    - week_start(d timestamp with time zone)
    - week_start_utc(d date)
    
  3. Security Impact
    - Ensures functions execute with empty search_path
    - Prevents malicious users from injecting schema names
    - All table references must be fully qualified
*/

-- Fix generate_referral_slug(text, integer) - add search_path
CREATE OR REPLACE FUNCTION public.generate_referral_slug(name_input text, id_num integer)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path TO ''
AS $function$
DECLARE
slug_base text;
last4_str text;
BEGIN
-- Slugify name
slug_base := lower(regexp_replace(
regexp_replace(
regexp_replace(name_input, '&', 'and', 'g'),
'[^a-zA-Z0-9\s-]', '', 'g'
),
'\s+', '-', 'g'
));

-- Trim hyphens
slug_base := trim(both '-' from slug_base);

-- Get last 4 digits
last4_str := lpad((id_num % 10000)::text, 4, '0');

RETURN slug_base || '-' || last4_str;
END;
$function$;

-- Fix week_start(timestamp with time zone) - add search_path
CREATE OR REPLACE FUNCTION public.week_start(d timestamp with time zone)
RETURNS date
LANGUAGE sql
IMMUTABLE
SET search_path TO ''
AS $function$
SELECT (d::date - ((EXTRACT(DOW FROM d)::int + 6) % 7))::date;
$function$;

-- Fix week_start_utc(date) - add search_path
CREATE OR REPLACE FUNCTION public.week_start_utc(d date)
RETURNS date
LANGUAGE sql
IMMUTABLE
SET search_path TO ''
AS $function$
SELECT (d - ((EXTRACT(DOW FROM d)::int + 6) % 7) * interval '1 day')::date;
$function$;