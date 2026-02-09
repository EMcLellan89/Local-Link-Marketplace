/*
  # Fix Function Search Paths (Security Issue)

  1. Security Fix
    - Add stable search_path to SECURITY DEFINER functions
    - Prevents search_path exploits in elevated privilege contexts

  2. Changes
    - Fix generate_system_id() SECURITY DEFINER function
    - Add search_path to generate_system_id(text) for consistency
    - Add search_path to set_updated_at() trigger function
*/

-- Fix the SECURITY DEFINER version (no parameters)
CREATE OR REPLACE FUNCTION public.generate_system_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  new_id text;
  collision boolean;
BEGIN
  LOOP
    -- Generate 9-digit number with leading zeros
    new_id := LPAD(FLOOR(RANDOM() * 1000000000)::text, 9, '0');
    
    -- Check for collisions in merchants table
    SELECT EXISTS(SELECT 1 FROM merchants WHERE system_id = new_id) INTO collision;
    IF NOT collision THEN
      -- Check for collisions in customers table
      SELECT EXISTS(SELECT 1 FROM customers WHERE system_id = new_id) INTO collision;
    END IF;
    IF NOT collision THEN
      -- Check for collisions in partners table
      SELECT EXISTS(SELECT 1 FROM partners WHERE system_id = new_id) INTO collision;
    END IF;
    
    EXIT WHEN NOT collision;
  END LOOP;
  
  RETURN new_id;
END;
$function$;

-- Fix the version with entity_type parameter
CREATE OR REPLACE FUNCTION public.generate_system_id(entity_type text)
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  new_id text;
  prefix text;
  counter int;
BEGIN
  -- Set prefix based on entity type
  prefix := CASE entity_type
    WHEN 'partner' THEN 'PTR'
    WHEN 'merchant' THEN 'MER'
    ELSE 'USR'
  END;
  
  -- Get the next counter value
  SELECT COALESCE(MAX(SUBSTRING(system_id FROM '[0-9]+')::int), 0) + 1
  INTO counter
  FROM (
    SELECT system_id FROM partners WHERE system_id LIKE prefix || '%'
    UNION ALL
    SELECT system_id FROM merchants WHERE system_id LIKE prefix || '%'
  ) AS ids;
  
  -- Generate the new ID with zero padding
  new_id := prefix || '-' || LPAD(counter::text, 6, '0');
  
  RETURN new_id;
END;
$function$;

-- Fix set_updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$function$;
