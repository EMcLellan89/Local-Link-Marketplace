/*
  # Fix Function Search Path Mutable Issue
  
  1. Security
    - Fix function with role mutable search_path
    - Set explicit search_path to prevent SQL injection
  
  2. Function Updated
    - generate_system_id
*/

-- Drop and recreate the function with proper search_path
DROP FUNCTION IF EXISTS generate_system_id();

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
$$;
