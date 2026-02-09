/*
  # Consolidate Multiple Permissive Policies - Batch 2: External Sales
  
  The external_sales table has 4 permissive policies for role authenticated and command SELECT.
  This migration consolidates them into a single policy.
*/

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'external_sales') THEN
    -- Drop all existing SELECT policies for external_sales
    DROP POLICY IF EXISTS "Partners can view own external sales" ON external_sales;
    DROP POLICY IF EXISTS "Admins can view all external sales" ON external_sales;
    DROP POLICY IF EXISTS "External sales viewable by partner" ON external_sales;
    DROP POLICY IF EXISTS "External sales viewable by admin" ON external_sales;
    DROP POLICY IF EXISTS "authenticated_select_external_sales" ON external_sales;
    
    -- Create single consolidated SELECT policy
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'external_sales' AND column_name = 'partner_id'
    ) THEN
      CREATE POLICY "authenticated_select_external_sales"
        ON external_sales FOR SELECT
        TO authenticated
        USING (
          partner_id IN (
            SELECT id FROM partners WHERE user_id = auth.uid()
          ) OR
          EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
          )
        );
    END IF;
  END IF;
END $$;