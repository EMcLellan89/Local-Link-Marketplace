/*
  # Consolidate Multiple Permissive Policies - Batch 1 (Safe): Core Tables
  
  Consolidates multiple permissive policies on core tables.
  Uses conditional logic to avoid errors with non-existent columns.
  
  ## Tables Addressed:
  - profiles
  - customers
  - merchants
  - partners
*/

-- Profiles table - simple policy
DO $$
BEGIN
  -- Drop existing SELECT policies if they exist
  DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
  DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;
  DROP POLICY IF EXISTS "authenticated_select_profiles" ON profiles;
  
  -- Create simple consolidated SELECT policy
  CREATE POLICY "authenticated_select_profiles"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);
END $$;

-- Customers table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'customers') THEN
    -- Drop existing SELECT policies
    DROP POLICY IF EXISTS "Customers can view own data" ON customers;
    DROP POLICY IF EXISTS "Customers viewable by merchants" ON customers;
    DROP POLICY IF EXISTS "Customers viewable by partners" ON customers;
    DROP POLICY IF EXISTS "authenticated_select_customers" ON customers;
    
    -- Check if user_id column exists
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'customers' AND column_name = 'user_id'
    ) THEN
      -- Create consolidated SELECT policy
      CREATE POLICY "authenticated_select_customers"
        ON customers FOR SELECT
        TO authenticated
        USING (user_id = auth.uid());
    END IF;
  END IF;
END $$;

-- Merchants table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'merchants') THEN
    -- Drop existing SELECT policies
    DROP POLICY IF EXISTS "Merchants can view own data" ON merchants;
    DROP POLICY IF EXISTS "Merchants viewable by partners" ON merchants;
    DROP POLICY IF EXISTS "authenticated_select_merchants" ON merchants;
    
    -- Check if user_id column exists
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'merchants' AND column_name = 'user_id'
    ) THEN
      -- Create consolidated SELECT policy
      CREATE POLICY "authenticated_select_merchants"
        ON merchants FOR SELECT
        TO authenticated
        USING (user_id = auth.uid());
    END IF;
  END IF;
END $$;

-- Partners table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'partners') THEN
    -- Drop existing SELECT policies
    DROP POLICY IF EXISTS "Partners can view own data" ON partners;
    DROP POLICY IF EXISTS "Partners viewable by admins" ON partners;
    DROP POLICY IF EXISTS "authenticated_select_partners" ON partners;
    
    -- Check if user_id column exists
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'partners' AND column_name = 'user_id'
    ) THEN
      -- Create consolidated SELECT policy
      CREATE POLICY "authenticated_select_partners"
        ON partners FOR SELECT
        TO authenticated
        USING (user_id = auth.uid());
    END IF;
  END IF;
END $$;