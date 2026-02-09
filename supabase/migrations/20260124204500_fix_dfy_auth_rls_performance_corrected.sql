/*
  # Fix DFY Auth RLS Performance Issues (Corrected)

  Fixes RLS policies on DFY tables that re-evaluate auth functions for each row.
  
  Changes:
  - Replaces `auth.uid()` with `(select auth.uid())` in all DFY RLS policies
  - Improves query performance at scale
  - Uses correct column relationships
  
  Tables affected:
  - dfy_orders
  - dfy_onboarding
  - dfy_fulfillment_tasks
  - partner_dfy_tracking_links
  - dfy_commission_ledger
*/

-- Drop and recreate policies for dfy_orders
DROP POLICY IF EXISTS "Users can create own DFY orders" ON dfy_orders;
DROP POLICY IF EXISTS "Users can view own DFY orders" ON dfy_orders;

CREATE POLICY "Users can create own DFY orders"
  ON dfy_orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can view own DFY orders"
  ON dfy_orders FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Drop and recreate policies for dfy_onboarding
DROP POLICY IF EXISTS "Users can submit own onboarding" ON dfy_onboarding;
DROP POLICY IF EXISTS "Users can update own onboarding" ON dfy_onboarding;
DROP POLICY IF EXISTS "Users can view own onboarding" ON dfy_onboarding;

CREATE POLICY "Users can submit own onboarding"
  ON dfy_onboarding FOR INSERT
  TO authenticated
  WITH CHECK (
    order_id IN (
      SELECT id FROM dfy_orders WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can update own onboarding"
  ON dfy_onboarding FOR UPDATE
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM dfy_orders WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    order_id IN (
      SELECT id FROM dfy_orders WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can view own onboarding"
  ON dfy_onboarding FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM dfy_orders WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for dfy_fulfillment_tasks
DROP POLICY IF EXISTS "Admins can manage fulfillment tasks" ON dfy_fulfillment_tasks;

CREATE POLICY "Admins can manage fulfillment tasks"
  ON dfy_fulfillment_tasks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- Drop and recreate policies for partner_dfy_tracking_links
DROP POLICY IF EXISTS "Partners can create own tracking links" ON partner_dfy_tracking_links;
DROP POLICY IF EXISTS "Partners can view own tracking links" ON partner_dfy_tracking_links;

CREATE POLICY "Partners can create own tracking links"
  ON partner_dfy_tracking_links FOR INSERT
  TO authenticated
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Partners can view own tracking links"
  ON partner_dfy_tracking_links FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for dfy_commission_ledger
DROP POLICY IF EXISTS "Partners can view own commissions" ON dfy_commission_ledger;

CREATE POLICY "Partners can view own commissions"
  ON dfy_commission_ledger FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
  );
