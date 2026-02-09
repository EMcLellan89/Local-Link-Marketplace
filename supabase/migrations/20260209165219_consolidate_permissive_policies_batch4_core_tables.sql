/*
  # Consolidate Multiple Permissive Policies - Batch 4: More Core Tables
  
  Consolidates duplicate policies on commonly used tables with multiple permissive policies.
*/

DO $$
BEGIN
  -- Deals table
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'deals') THEN
    DROP POLICY IF EXISTS "Deals viewable by merchant" ON deals;
    DROP POLICY IF EXISTS "Deals viewable by customers" ON deals;
    DROP POLICY IF EXISTS "Public deals viewable" ON deals;
    DROP POLICY IF EXISTS "authenticated_select_deals" ON deals;
    
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'deals' AND column_name = 'merchant_id'
    ) THEN
      CREATE POLICY "authenticated_select_deals"
        ON deals FOR SELECT
        TO authenticated
        USING (
          merchant_id IN (
            SELECT id FROM merchants WHERE user_id = auth.uid()
          ) OR
          status = 'active'
        );
    END IF;
  END IF;

  -- Notifications table
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notifications') THEN
    DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
    DROP POLICY IF EXISTS "Notifications viewable by user" ON notifications;
    DROP POLICY IF EXISTS "authenticated_select_notifications" ON notifications;
    
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'user_id'
    ) THEN
      CREATE POLICY "authenticated_select_notifications"
        ON notifications FOR SELECT
        TO authenticated
        USING (user_id = auth.uid());
    END IF;
  END IF;

  -- Reviews table
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'reviews') THEN
    DROP POLICY IF EXISTS "Reviews viewable by merchant" ON reviews;
    DROP POLICY IF EXISTS "Reviews viewable by everyone" ON reviews;
    DROP POLICY IF EXISTS "Public reviews viewable" ON reviews;
    DROP POLICY IF EXISTS "authenticated_select_reviews" ON reviews;
    
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'reviews' AND column_name = 'merchant_id'
    ) THEN
      CREATE POLICY "authenticated_select_reviews"
        ON reviews FOR SELECT
        TO authenticated
        USING (true); -- Reviews are public
    END IF;
  END IF;

  -- Purchases table
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'purchases') THEN
    DROP POLICY IF EXISTS "Customers can view own purchases" ON purchases;
    DROP POLICY IF EXISTS "Merchants can view purchases" ON purchases;
    DROP POLICY IF EXISTS "Purchases viewable by customer" ON purchases;
    DROP POLICY IF EXISTS "authenticated_select_purchases" ON purchases;
    
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'purchases' AND column_name = 'customer_id'
    ) THEN
      CREATE POLICY "authenticated_select_purchases"
        ON purchases FOR SELECT
        TO authenticated
        USING (
          customer_id IN (
            SELECT id FROM customers WHERE user_id = auth.uid()
          )
        );
    END IF;
  END IF;
END $$;