/*
  # Fix Function Security

  1. Issue
    - update_updated_at_column() has mutable search_path
    - Security vulnerability - allows search_path injection attacks

  2. Solution
    - Set immutable search_path: SET search_path = public, pg_temp
    - Prevents attackers from hijacking function behavior
    - Recreate all triggers using this function
*/

-- Drop and recreate the function with immutable search_path
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers for all tables that have updated_at column
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT DISTINCT c.table_name
    FROM information_schema.columns c
    WHERE c.table_schema = 'public'
      AND c.column_name = 'updated_at'
      AND c.table_name NOT IN ('profiles') -- profiles uses its own trigger
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON %I', r.table_name, r.table_name);
    EXECUTE format(
      'CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
      r.table_name,
      r.table_name
    );
  END LOOP;
END;
$$;
