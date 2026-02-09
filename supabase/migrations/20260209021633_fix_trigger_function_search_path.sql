/*
  # Fix Trigger Function Search Path
  
  1. Security Enhancement
    - Adds search_path to trigger functions that don't have it
    - Prevents potential security issues with function execution context
  
  2. Functions Fixed
    - set_updated_at: Add search_path = public
*/

-- Fix set_updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;