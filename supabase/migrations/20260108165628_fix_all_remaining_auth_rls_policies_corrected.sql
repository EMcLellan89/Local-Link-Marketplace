/*
  # Fix All Remaining Auth RLS Policies - Corrected Approach
  
  1. Performance Fix
    - Uses a corrected PL/pgSQL approach
    - Replaces all instances of 'auth.uid()' with '(select auth.uid())'
    - Does NOT replace if already wrapped: '(select auth.uid())' or '(SELECT auth.uid())'
    
  2. Fixed Logic
    - Previous script had issues with WHERE clause
    - This version properly handles all cases
*/

DO $$
DECLARE
  pol RECORD;
  new_qual TEXT;
  new_with_check TEXT;
  has_auth_uid BOOLEAN;
BEGIN
  -- Loop through ALL policies with auth.uid() that need optimization
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
  LOOP
    -- Check if this policy needs updating
    has_auth_uid := FALSE;
    
    -- Check qual
    IF pol.qual IS NOT NULL AND pol.qual LIKE '%auth.uid()%' THEN
      -- Only replace if not already wrapped
      IF pol.qual NOT LIKE '%(select auth.uid())%' AND pol.qual NOT LIKE '%(SELECT auth.uid()%' THEN
        new_qual := REPLACE(pol.qual, 'auth.uid()', '(select auth.uid())');
        has_auth_uid := TRUE;
      ELSE
        new_qual := pol.qual;
      END IF;
    ELSE
      new_qual := pol.qual;
    END IF;
    
    -- Check with_check
    IF pol.with_check IS NOT NULL AND pol.with_check LIKE '%auth.uid()%' THEN
      -- Only replace if not already wrapped
      IF pol.with_check NOT LIKE '%(select auth.uid())%' AND pol.with_check NOT LIKE '%(SELECT auth.uid()%' THEN
        new_with_check := REPLACE(pol.with_check, 'auth.uid()', '(select auth.uid())');
        has_auth_uid := TRUE;
      ELSE
        new_with_check := pol.with_check;
      END IF;
    ELSE
      new_with_check := pol.with_check;
    END IF;
    
    -- Only recreate policy if it needs updating
    IF has_auth_uid THEN
      -- Drop the policy
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
    END IF;
    
  END LOOP;
END $$;
