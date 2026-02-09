/*
  # Optimize Auth RLS Performance - Batch 4 (Admin, Affiliate, AI Tables)

  1. Changes
    - Wraps all auth.uid() calls in subqueries
    - Applies to: admin_users, affiliate_commissions, affiliate_referrals, ai_assistant_conversations, ai_runs

  2. Performance Impact
    - Improves admin dashboard queries
    - Speeds up affiliate commission calculations
    - Optimizes AI conversation lookups

  3. Security Notes
    - Maintains role-based and user-specific access control
    - No functional security changes
*/

-- Admin users
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Affiliate commissions
DROP POLICY IF EXISTS "Partners can view own commissions" ON affiliate_commissions;
CREATE POLICY "Partners can view own commissions"
  ON affiliate_commissions FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
  );

-- Affiliate referrals
DROP POLICY IF EXISTS "Partners can view own referrals" ON affiliate_referrals;
CREATE POLICY "Partners can view own referrals"
  ON affiliate_referrals FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Partners can create referrals" ON affiliate_referrals;
CREATE POLICY "Partners can create referrals"
  ON affiliate_referrals FOR INSERT
  TO authenticated
  WITH CHECK (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = (select auth.uid())
    )
  );

-- AI assistant conversations
DROP POLICY IF EXISTS "Users can view own conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can view own conversations"
  ON ai_assistant_conversations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can create own conversations"
  ON ai_assistant_conversations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can update own conversations"
  ON ai_assistant_conversations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- AI runs (system table - admin only)
DROP POLICY IF EXISTS "Admins can view AI runs" ON ai_runs;
CREATE POLICY "Admins can view AI runs"
  ON ai_runs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );
