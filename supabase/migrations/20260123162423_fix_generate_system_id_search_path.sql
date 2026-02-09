/*
  # Fix Function Search Path for generate_system_id

  This migration fixes the search_path vulnerability in the generate_system_id function
  by setting it to a secure, immutable value.

  Security Issue:
  - Function has role mutable search_path which could allow SQL injection attacks

  Fix:
  - Set search_path to 'public, pg_temp' with SECURITY DEFINER
  - This prevents the function from being affected by caller's search_path
*/

-- Drop and recreate the function with secure search_path
CREATE OR REPLACE FUNCTION generate_system_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  new_id text;
  collision boolean;
BEGIN
  LOOP
    new_id := LPAD(FLOOR(RANDOM() * 1000000000)::text, 9, '0');
    SELECT EXISTS(SELECT 1 FROM merchants WHERE system_id = new_id) INTO collision;
    IF NOT collision THEN
      SELECT EXISTS(SELECT 1 FROM customers WHERE system_id = new_id) INTO collision;
    END IF;
    IF NOT collision THEN
      SELECT EXISTS(SELECT 1 FROM partners WHERE system_id = new_id) INTO collision;
    END IF;
    EXIT WHEN NOT collision;
  END LOOP;
  RETURN new_id;
END;
$$;