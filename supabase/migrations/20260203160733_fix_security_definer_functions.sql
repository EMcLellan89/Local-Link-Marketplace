/*
  # Fix Security Definer Functions

  1. Security Improvements
    - Sets explicit search_path on SECURITY DEFINER functions
    - Prevents search path injection attacks
    - Ensures functions only access intended schemas
    
  2. Strategy
    - Add "SET search_path = public, pg_temp" to all SECURITY DEFINER functions
    - This ensures functions only look in public schema and temp schema
    - Prevents malicious users from shadowing functions/tables
    
  3. Notes
    - SECURITY DEFINER functions run with owner's privileges
    - Without explicit search_path, they're vulnerable to injection
    - This is a critical security fix for production databases
*/

-- Fix search_path for all SECURITY DEFINER functions
DO $$
DECLARE
  func_record RECORD;
  fixed_count INTEGER := 0;
BEGIN
  -- Loop through all SECURITY DEFINER functions in public schema
  FOR func_record IN
    SELECT 
      n.nspname as schema_name,
      p.proname as function_name,
      pg_get_function_identity_arguments(p.oid) as arguments,
      p.oid as function_oid
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef = true
  LOOP
    BEGIN
      -- Set search_path for the function
      EXECUTE format(
        'ALTER FUNCTION %I.%I(%s) SET search_path = public, pg_temp',
        func_record.schema_name,
        func_record.function_name,
        func_record.arguments
      );
      
      fixed_count := fixed_count + 1;
      RAISE NOTICE 'Fixed search_path for function: %.%(%)',
        func_record.schema_name,
        func_record.function_name,
        func_record.arguments;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE NOTICE 'Could not fix function %.%: %',
          func_record.schema_name,
          func_record.function_name,
          SQLERRM;
    END;
  END LOOP;
  
  RAISE NOTICE 'Total SECURITY DEFINER functions fixed: %', fixed_count;
END $$;
