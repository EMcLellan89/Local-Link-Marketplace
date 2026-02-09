/*
  # Fix Auth RLS Performance - Batch 14: Partner Playbooks & Marketplace Tables

  1. Changes
    - Optimize Auth RLS policies by wrapping auth.uid() in subqueries
    - Prevents re-evaluation of auth.uid() for each row
    - Maintains exact same access control logic
    
  2. Tables Covered
    - partner_playbook_modules (1 policy)
    - partner_playbook_lessons (1 policy)
    - partner_playbook_completions (2 policies)
    - partner_weekly_deductions (2 policies)
    - partner_special_overrides (1 policy)
    - partner_profit_shares (1 policy)
    - marketplace_order_items (1 policy)
    - marketplace_abandoned_carts (1 policy)
    - marketplace_commissions (2 policies)
    - partner_tiers (1 policy)
*/

-- partner_playbook_modules
DROP POLICY IF EXISTS "Admins can manage modules" ON partner_playbook_modules;
CREATE POLICY "Admins can manage modules"
  ON partner_playbook_modules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- partner_playbook_lessons
DROP POLICY IF EXISTS "Admins can manage lessons" ON partner_playbook_lessons;
CREATE POLICY "Admins can manage lessons"
  ON partner_playbook_lessons FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- partner_playbook_completions (uses user_id directly, not partner_id)
DROP POLICY IF EXISTS "Admins can view all completions" ON partner_playbook_completions;
CREATE POLICY "Admins can view all completions"
  ON partner_playbook_completions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Partners can view own completions" ON partner_playbook_completions;
CREATE POLICY "Partners can view own completions"
  ON partner_playbook_completions FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
  );

-- partner_weekly_deductions
DROP POLICY IF EXISTS "Admins can view all weekly deductions" ON partner_weekly_deductions;
CREATE POLICY "Admins can view all weekly deductions"
  ON partner_weekly_deductions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Partners can view own weekly deductions" ON partner_weekly_deductions;
CREATE POLICY "Partners can view own weekly deductions"
  ON partner_weekly_deductions FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
  );

-- partner_special_overrides
DROP POLICY IF EXISTS "Admin only access" ON partner_special_overrides;
CREATE POLICY "Admin only access"
  ON partner_special_overrides FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- partner_profit_shares
DROP POLICY IF EXISTS "Admin only access" ON partner_profit_shares;
CREATE POLICY "Admin only access"
  ON partner_profit_shares FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- marketplace_order_items
DROP POLICY IF EXISTS "Users can view own order items" ON marketplace_order_items;
CREATE POLICY "Users can view own order items"
  ON marketplace_order_items FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM marketplace_orders
      WHERE user_id = (select auth.uid())
    )
  );

-- marketplace_abandoned_carts (links via checkout_session_id to marketplace_checkout_sessions)
DROP POLICY IF EXISTS "Users can view own abandoned carts" ON marketplace_abandoned_carts;
CREATE POLICY "Users can view own abandoned carts"
  ON marketplace_abandoned_carts FOR SELECT
  TO authenticated
  USING (
    checkout_session_id IN (
      SELECT id FROM marketplace_checkout_sessions
      WHERE user_id = (select auth.uid())
    )
  );

-- marketplace_commissions (uses marketplace_partners, not marketplace_affiliates)
DROP POLICY IF EXISTS "Partners can view own commissions" ON marketplace_commissions;
CREATE POLICY "Partners can view own commissions"
  ON marketplace_commissions FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM marketplace_partners
      WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can manage all commissions" ON marketplace_commissions;
CREATE POLICY "Admins can manage all commissions"
  ON marketplace_commissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- partner_tiers
DROP POLICY IF EXISTS "partner_tiers_admin" ON partner_tiers;
CREATE POLICY "partner_tiers_admin"
  ON partner_tiers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );