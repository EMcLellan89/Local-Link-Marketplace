/*
  # Fix generate_system_id Function Search Path

  Fixes the mutable search_path issue by using fully qualified table names.
  
  Changes:
  - Removes search_path setting from function
  - Uses fully qualified table names (public.merchants, public.customers, public.partners)
  - Ensures function is secure against search_path exploits
*/

DROP FUNCTION IF EXISTS generate_system_id();

CREATE OR REPLACE FUNCTION generate_system_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id text;
  collision boolean;
BEGIN
  LOOP
    -- Generate 9-digit number with leading zeros
    new_id := LPAD(FLOOR(RANDOM() * 1000000000)::text, 9, '0');
    
    -- Check for collisions in merchants table (fully qualified)
    SELECT EXISTS(SELECT 1 FROM public.merchants WHERE system_id = new_id) INTO collision;
    IF NOT collision THEN
      -- Check for collisions in customers table (fully qualified)
      SELECT EXISTS(SELECT 1 FROM public.customers WHERE system_id = new_id) INTO collision;
    END IF;
    IF NOT collision THEN
      -- Check for collisions in partners table (fully qualified)
      SELECT EXISTS(SELECT 1 FROM public.partners WHERE system_id = new_id) INTO collision;
    END IF;
    
    EXIT WHEN NOT collision;
  END LOOP;
  
  RETURN new_id;
END;
$$;
