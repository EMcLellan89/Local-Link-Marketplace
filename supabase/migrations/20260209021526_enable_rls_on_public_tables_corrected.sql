/*
  # Enable RLS on Public Tables and Add Policies (Corrected)
  
  1. Security Enhancement
    - Enables RLS on tables that currently don't have it
    - Adds appropriate policies based on actual table structure
  
  2. Tables Fixed
    - partner_earnings_simulator: Simulator tool
    - ll_autoscale_bot_runs: Bot execution logs
    - ll_autoscale_clients: Client configurations
    - ll_brand_profiles: Partner branding
    - ll_partners: LocalLink partner registry
*/

-- Enable RLS on partner_earnings_simulator
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'partner_earnings_simulator') THEN
    ALTER TABLE partner_earnings_simulator ENABLE ROW LEVEL SECURITY;
    
    -- This is a calculator tool, allow public read access
    CREATE POLICY "Public can use earnings simulator"
      ON partner_earnings_simulator
      FOR SELECT
      TO public
      USING (true);
      
    -- Partners can insert their own simulations
    CREATE POLICY "Partners can create simulations"
      ON partner_earnings_simulator
      FOR INSERT
      TO authenticated
      WITH CHECK (
        partner_id IN (
          SELECT id FROM partners WHERE user_id = (SELECT auth.uid())
        )
      );
  END IF;
END $$;

-- Enable RLS on ll_autoscale_bot_runs
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'll_autoscale_bot_runs') THEN
    ALTER TABLE ll_autoscale_bot_runs ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Admins can view bot runs"
      ON ll_autoscale_bot_runs
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = (SELECT auth.uid())
          AND profiles.role = 'admin'
        )
      );
      
    CREATE POLICY "System can manage bot runs"
      ON ll_autoscale_bot_runs
      FOR ALL
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Enable RLS on ll_autoscale_clients
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'll_autoscale_clients') THEN
    ALTER TABLE ll_autoscale_clients ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Partners can view own autoscale clients"
      ON ll_autoscale_clients
      FOR SELECT
      TO authenticated
      USING (
        partner_id IN (
          SELECT id FROM partners WHERE user_id = (SELECT auth.uid())
        )
      );
      
    CREATE POLICY "Partners can manage own autoscale clients"
      ON ll_autoscale_clients
      FOR ALL
      TO authenticated
      USING (
        partner_id IN (
          SELECT id FROM partners WHERE user_id = (SELECT auth.uid())
        )
      )
      WITH CHECK (
        partner_id IN (
          SELECT id FROM partners WHERE user_id = (SELECT auth.uid())
        )
      );
  END IF;
END $$;

-- Enable RLS on ll_brand_profiles
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'll_brand_profiles') THEN
    ALTER TABLE ll_brand_profiles ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Partners can view own brand profile"
      ON ll_brand_profiles
      FOR SELECT
      TO authenticated
      USING (
        partner_id IN (
          SELECT id FROM partners WHERE user_id = (SELECT auth.uid())
        )
      );
      
    CREATE POLICY "Partners can manage own brand profile"
      ON ll_brand_profiles
      FOR ALL
      TO authenticated
      USING (
        partner_id IN (
          SELECT id FROM partners WHERE user_id = (SELECT auth.uid())
        )
      )
      WITH CHECK (
        partner_id IN (
          SELECT id FROM partners WHERE user_id = (SELECT auth.uid())
        )
      );
  END IF;
END $$;

-- Enable RLS on ll_partners (LocalLink partner registry - admin only)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'll_partners') THEN
    ALTER TABLE ll_partners ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Public can view active LL partners"
      ON ll_partners
      FOR SELECT
      TO public
      USING (is_active = true);
      
    CREATE POLICY "Admins can manage LL partners"
      ON ll_partners
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = (SELECT auth.uid())
          AND profiles.role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = (SELECT auth.uid())
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;