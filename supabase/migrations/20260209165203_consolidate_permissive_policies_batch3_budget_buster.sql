/*
  # Consolidate Multiple Permissive Policies - Batch 3: Budget Buster and Academy
  
  Consolidates duplicate policies on:
  - academy_enrollments (2 permissive policies)
  - budget_buster_* tables
*/

-- Academy enrollments
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'academy_enrollments') THEN
    -- Drop existing SELECT policies
    DROP POLICY IF EXISTS "Users can view own enrollments" ON academy_enrollments;
    DROP POLICY IF EXISTS "Enrollments viewable by user" ON academy_enrollments;
    DROP POLICY IF EXISTS "authenticated_select_academy_enrollments" ON academy_enrollments;
    
    -- Create consolidated policy
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'academy_enrollments' AND column_name = 'user_id'
    ) THEN
      CREATE POLICY "authenticated_select_academy_enrollments"
        ON academy_enrollments FOR SELECT
        TO authenticated
        USING (user_id = auth.uid());
    END IF;
  END IF;
END $$;

-- Budget Buster tables
DO $$
BEGIN
  -- budget_buster_categories
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'budget_buster_categories') THEN
    DROP POLICY IF EXISTS "Users can view own categories" ON budget_buster_categories;
    DROP POLICY IF EXISTS "Categories viewable by user" ON budget_buster_categories;
    DROP POLICY IF EXISTS "authenticated_select_budget_buster_categories" ON budget_buster_categories;
    
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'budget_buster_categories' AND column_name = 'user_id'
    ) THEN
      CREATE POLICY "authenticated_select_budget_buster_categories"
        ON budget_buster_categories FOR SELECT
        TO authenticated
        USING (user_id = auth.uid());
    END IF;
  END IF;

  -- budget_buster_goals
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'budget_buster_goals') THEN
    DROP POLICY IF EXISTS "Users can view own goals" ON budget_buster_goals;
    DROP POLICY IF EXISTS "Goals viewable by user" ON budget_buster_goals;
    DROP POLICY IF EXISTS "authenticated_select_budget_buster_goals" ON budget_buster_goals;
    
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'budget_buster_goals' AND column_name = 'user_id'
    ) THEN
      CREATE POLICY "authenticated_select_budget_buster_goals"
        ON budget_buster_goals FOR SELECT
        TO authenticated
        USING (user_id = auth.uid());
    END IF;
  END IF;

  -- budget_buster_transactions
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'budget_buster_transactions') THEN
    DROP POLICY IF EXISTS "Users can view own transactions" ON budget_buster_transactions;
    DROP POLICY IF EXISTS "Transactions viewable by user" ON budget_buster_transactions;
    DROP POLICY IF EXISTS "authenticated_select_budget_buster_transactions" ON budget_buster_transactions;
    
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'budget_buster_transactions' AND column_name = 'user_id'
    ) THEN
      CREATE POLICY "authenticated_select_budget_buster_transactions"
        ON budget_buster_transactions FOR SELECT
        TO authenticated
        USING (user_id = auth.uid());
    END IF;
  END IF;
END $$;