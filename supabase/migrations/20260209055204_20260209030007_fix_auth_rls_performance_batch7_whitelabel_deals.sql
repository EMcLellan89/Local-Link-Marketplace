/*
  # Fix Auth RLS Performance - Batch 7: White Label & Deals Tables

  1. Performance Optimization
    - Optimizes Auth RLS policies on white label and deal tables
    - Wraps auth.uid() in subquery to prevent re-evaluation
    - Improves query performance by evaluating auth once per query

  2. Tables Modified
    - white_label_revenue_tracking (2 policies)
    - white_label_eligible_products (1 policy)
    - deal_transactions (4 policies)
    - partner_deal_links (2 policies)
    - growth_guides (1 policy)

  3. Security
    - Maintains existing access control logic
    - No changes to authorization rules
    - Only optimizes performance of existing policies
*/

-- white_label_revenue_tracking policies
DROP POLICY IF EXISTS "Admins can manage all revenue tracking" ON white_label_revenue_tracking;
CREATE POLICY "Admins can manage all revenue tracking"
  ON white_label_revenue_tracking FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Partners can view own revenue tracking" ON white_label_revenue_tracking;
CREATE POLICY "Partners can view own revenue tracking"
  ON white_label_revenue_tracking FOR SELECT
  TO authenticated
  USING (
    license_id IN (
      SELECT wll.id FROM white_label_licenses wll
      WHERE wll.partner_id IN (
        SELECT id FROM partners WHERE user_id = (select auth.uid())
      )
    )
  );

-- white_label_eligible_products policies
DROP POLICY IF EXISTS "Admins can manage eligible products" ON white_label_eligible_products;
CREATE POLICY "Admins can manage eligible products"
  ON white_label_eligible_products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- deal_transactions policies
DROP POLICY IF EXISTS "Admin full access to deal_transactions" ON deal_transactions;
CREATE POLICY "Admin full access to deal_transactions"
  ON deal_transactions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Merchants view own deal_transactions" ON deal_transactions;
CREATE POLICY "Merchants view own deal_transactions"
  ON deal_transactions FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Partners view own deal_transactions" ON deal_transactions;
CREATE POLICY "Partners view own deal_transactions"
  ON deal_transactions FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can view deal transactions" ON deal_transactions;
CREATE POLICY "Users can view deal transactions"
  ON deal_transactions FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT user_id FROM customers WHERE id = deal_transactions.customer_id
    )
    OR (select auth.uid()) IN (
      SELECT m.user_id FROM merchants m
      JOIN deals d ON d.merchant_id = m.id
      WHERE d.id = deal_transactions.deal_id
    )
  );

-- partner_deal_links policies
DROP POLICY IF EXISTS "Admin full access to partner_deal_links" ON partner_deal_links;
CREATE POLICY "Admin full access to partner_deal_links"
  ON partner_deal_links FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Partners manage own deal_links" ON partner_deal_links;
CREATE POLICY "Partners manage own deal_links"
  ON partner_deal_links FOR ALL
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
  );

-- growth_guides policies
DROP POLICY IF EXISTS "Admin full access to growth_guides" ON growth_guides;
CREATE POLICY "Admin full access to growth_guides"
  ON growth_guides FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );