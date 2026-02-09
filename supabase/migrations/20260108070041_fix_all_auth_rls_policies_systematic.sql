/*
  # Fix All Auth RLS Policies - Systematic Optimization
  
  1. Performance Fix
    - Uses PL/pgSQL to systematically update all policies
    - Replaces auth.uid() with (select auth.uid()) 
    - Prevents re-evaluation for each row
    
  2. Approach
    - Recreates each policy with optimized auth calls
    - Handles both USING and WITH CHECK clauses
*/

DO $$
DECLARE
  pol RECORD;
  new_qual TEXT;
  new_with_check TEXT;
BEGIN
  -- Loop through all policies that need optimization
  FOR pol IN 
    SELECT 
      schemaname,
      tablename,
      policyname,
      cmd,
      permissive,
      roles,
      qual,
      with_check
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (
        (qual LIKE '%auth.uid()%' AND qual NOT LIKE '%(select auth.uid())%' AND qual NOT LIKE '%(SELECT auth.uid()%')
        OR (with_check LIKE '%auth.uid()%' AND with_check NOT LIKE '%(select auth.uid())%' AND with_check NOT LIKE '%(SELECT auth.uid()%')
      )
  LOOP
    -- Replace auth.uid() with (select auth.uid()) in qual
    IF pol.qual IS NOT NULL THEN
      new_qual := REPLACE(pol.qual, 'auth.uid()', '(select auth.uid())');
    ELSE
      new_qual := NULL;
    END IF;
    
    -- Replace auth.uid() in with_check  
    IF pol.with_check IS NOT NULL THEN
      new_with_check := REPLACE(pol.with_check, 'auth.uid()', '(select auth.uid())');
    ELSE
      new_with_check := NULL;
    END IF;
    
    -- Drop and recreate the policy
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
      pol.policyname, pol.schemaname, pol.tablename);
    
    -- Recreate policy with optimized auth calls
    IF pol.cmd = 'ALL' THEN
      EXECUTE format(
        'CREATE POLICY %I ON %I.%I FOR ALL TO %s USING (%s)',
        pol.policyname, pol.schemaname, pol.tablename,
        array_to_string(pol.roles, ', '),
        COALESCE(new_qual, 'true')
      );
    ELSIF pol.cmd IN ('SELECT', 'DELETE') THEN
      EXECUTE format(
        'CREATE POLICY %I ON %I.%I FOR %s TO %s USING (%s)',
        pol.policyname, pol.schemaname, pol.tablename, pol.cmd,
        array_to_string(pol.roles, ', '),
        COALESCE(new_qual, 'true')
      );
    ELSIF pol.cmd = 'INSERT' THEN
      IF new_with_check IS NOT NULL THEN
        EXECUTE format(
          'CREATE POLICY %I ON %I.%I FOR INSERT TO %s WITH CHECK (%s)',
          pol.policyname, pol.schemaname, pol.tablename,
          array_to_string(pol.roles, ', '),
          new_with_check
        );
      ELSE
        EXECUTE format(
          'CREATE POLICY %I ON %I.%I FOR INSERT TO %s',
          pol.policyname, pol.schemaname, pol.tablename,
          array_to_string(pol.roles, ', ')
        );
      END IF;
    ELSIF pol.cmd = 'UPDATE' THEN
      IF new_qual IS NOT NULL AND new_with_check IS NOT NULL THEN
        EXECUTE format(
          'CREATE POLICY %I ON %I.%I FOR UPDATE TO %s USING (%s) WITH CHECK (%s)',
          pol.policyname, pol.schemaname, pol.tablename,
          array_to_string(pol.roles, ', '),
          new_qual, new_with_check
        );
      ELSIF new_qual IS NOT NULL THEN
        EXECUTE format(
          'CREATE POLICY %I ON %I.%I FOR UPDATE TO %s USING (%s)',
          pol.policyname, pol.schemaname, pol.tablename,
          array_to_string(pol.roles, ', '),
          new_qual
        );
      ELSIF new_with_check IS NOT NULL THEN
        EXECUTE format(
          'CREATE POLICY %I ON %I.%I FOR UPDATE TO %s WITH CHECK (%s)',
          pol.policyname, pol.schemaname, pol.tablename,
          array_to_string(pol.roles, ', '),
          new_with_check
        );
      END IF;
    END IF;
    
  END LOOP;
END $$;
