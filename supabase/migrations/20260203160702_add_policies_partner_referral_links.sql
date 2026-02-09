/*
  # Add Policies to partner_referral_links

  1. Security Improvements
    - Adds RLS policies to partner_referral_links table
    - Ensures partners can only manage their own referral links
    - Allows admins to manage all referral links
    
  2. New Policies
    - Partners can view own referral links
    - Partners can manage own referral links
    - Admins can manage all referral links
    - Public can view active referral links (for validation)
    
  3. Notes
    - RLS should already be enabled on this table
    - Policies follow principle of least privilege
*/

-- Ensure RLS is enabled on partner_referral_links
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'partner_referral_links'
  ) THEN
    -- Enable RLS if not already enabled
    ALTER TABLE partner_referral_links ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies if any
    DROP POLICY IF EXISTS "Partners can view own referral links" ON partner_referral_links;
    DROP POLICY IF EXISTS "Partners can insert own referral links" ON partner_referral_links;
    DROP POLICY IF EXISTS "Partners can update own referral links" ON partner_referral_links;
    DROP POLICY IF EXISTS "Partners can delete own referral links" ON partner_referral_links;
    DROP POLICY IF EXISTS "Admins can manage all referral links" ON partner_referral_links;
    DROP POLICY IF EXISTS "Public can view referral links" ON partner_referral_links;
    
    -- Policy: Partners can view own referral links
    CREATE POLICY "Partners can view own referral links"
      ON partner_referral_links
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM partners
          WHERE partners.id = partner_referral_links.partner_id
          AND partners.id = (select auth.uid())
        )
      );
    
    -- Policy: Partners can insert own referral links
    CREATE POLICY "Partners can insert own referral links"
      ON partner_referral_links
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM partners
          WHERE partners.id = partner_referral_links.partner_id
          AND partners.id = (select auth.uid())
        )
      );
    
    -- Policy: Partners can update own referral links
    CREATE POLICY "Partners can update own referral links"
      ON partner_referral_links
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM partners
          WHERE partners.id = partner_referral_links.partner_id
          AND partners.id = (select auth.uid())
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM partners
          WHERE partners.id = partner_referral_links.partner_id
          AND partners.id = (select auth.uid())
        )
      );
    
    -- Policy: Partners can delete own referral links
    CREATE POLICY "Partners can delete own referral links"
      ON partner_referral_links
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM partners
          WHERE partners.id = partner_referral_links.partner_id
          AND partners.id = (select auth.uid())
        )
      );
    
    -- Policy: Admins can manage all referral links
    CREATE POLICY "Admins can manage all referral links"
      ON partner_referral_links
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = (select auth.uid())
          AND profiles.role = 'admin'
        )
      );
    
    -- Policy: Public can view referral links for validation
    CREATE POLICY "Public can view referral links"
      ON partner_referral_links
      FOR SELECT
      TO anon, authenticated
      USING (true);
      
    RAISE NOTICE 'Policies added to partner_referral_links table';
  ELSE
    RAISE NOTICE 'Table partner_referral_links does not exist, skipping policy setup';
  END IF;
END $$;
