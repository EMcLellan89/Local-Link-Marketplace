/*
  # Consolidate Multiple Permissive Policies - New Batch 3 (Corrected)
  
  1. Policy Consolidation (Engagement Tables)
    - reviews: Multiple SELECT policies
    - notifications: Multiple SELECT policies (merchant-only)
    - favorites: Multiple SELECT policies
    - customer_referrals: Multiple SELECT policies
  
  2. Security
    - Maintains same security guarantees
    - Uses OR logic to preserve all access patterns
*/

-- Consolidate reviews policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "authenticated_select_reviews" ON reviews;
  DROP POLICY IF EXISTS "customers_select_own_reviews" ON reviews;
  DROP POLICY IF EXISTS "merchants_view_reviews" ON reviews;
  DROP POLICY IF EXISTS "public_view_approved_reviews" ON reviews;
END $$;

CREATE POLICY "authenticated_select_reviews_consolidated"
  ON reviews FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = (SELECT auth.uid())
    )
    OR merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
    )
    OR status = 'approved'
  );

-- Consolidate notifications policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "authenticated_select_notifications" ON notifications;
  DROP POLICY IF EXISTS "merchants_select_own_notifications" ON notifications;
END $$;

CREATE POLICY "authenticated_select_notifications_consolidated"
  ON notifications FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
    )
  );

-- Consolidate favorites policies (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'favorites') THEN
    DROP POLICY IF EXISTS "authenticated_select_favorites" ON favorites;
    DROP POLICY IF EXISTS "customers_select_own_favorites" ON favorites;
    
    EXECUTE 'CREATE POLICY "authenticated_select_favorites_consolidated"
      ON favorites FOR SELECT
      TO authenticated
      USING (
        customer_id IN (
          SELECT id FROM customers WHERE user_id = (SELECT auth.uid())
        )
      )';
  END IF;
END $$;

-- Consolidate customer_referrals policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "authenticated_select_customer_referrals" ON customer_referrals;
  DROP POLICY IF EXISTS "customers_select_own_referrals" ON customer_referrals;
  DROP POLICY IF EXISTS "merchants_view_referrals" ON customer_referrals;
END $$;

CREATE POLICY "authenticated_select_customer_referrals_consolidated"
  ON customer_referrals FOR SELECT
  TO authenticated
  USING (
    referrer_customer_id IN (
      SELECT id FROM customers WHERE user_id = (SELECT auth.uid())
    )
    OR merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
    )
  );