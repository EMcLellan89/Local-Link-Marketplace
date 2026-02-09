/*
  # Fix Auth RLS Performance - Communications & Coaching
  
  1. Performance
    - Replace direct auth.uid() calls with (select auth.uid()) in RLS policies
  
  2. Tables Updated
    - communications_subscriptions
    - communications_usage
    - communications_transactions
    - merchant_team_members
    - partner_team_members
    - business_coaching_bookings
    - business_coaching_sessions
    - email_subscriptions
*/

-- communications_subscriptions
DROP POLICY IF EXISTS "Internal team can view all communications subscriptions" ON communications_subscriptions;
DROP POLICY IF EXISTS "Merchants can update own communications subscription" ON communications_subscriptions;
DROP POLICY IF EXISTS "Merchants can view own communications subscription" ON communications_subscriptions;
DROP POLICY IF EXISTS "Partners can update own communications subscription" ON communications_subscriptions;
DROP POLICY IF EXISTS "Partners can view own communications subscription" ON communications_subscriptions;

CREATE POLICY "Internal team can view all communications subscriptions" ON communications_subscriptions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Merchants can view own communications subscription" ON communications_subscriptions
  FOR SELECT TO authenticated
  USING (
    entity_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
    AND entity_type = 'merchant'
  );

CREATE POLICY "Merchants can update own communications subscription" ON communications_subscriptions
  FOR UPDATE TO authenticated
  USING (
    entity_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
    AND entity_type = 'merchant'
  );

CREATE POLICY "Partners can view own communications subscription" ON communications_subscriptions
  FOR SELECT TO authenticated
  USING (
    entity_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
    AND entity_type = 'partner'
  );

CREATE POLICY "Partners can update own communications subscription" ON communications_subscriptions
  FOR UPDATE TO authenticated
  USING (
    entity_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
    AND entity_type = 'partner'
  );

-- communications_usage
DROP POLICY IF EXISTS "Internal team can view all communications usage" ON communications_usage;
DROP POLICY IF EXISTS "Users can view own communications usage" ON communications_usage;

CREATE POLICY "Internal team can view all communications usage" ON communications_usage
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can view own communications usage" ON communications_usage
  FOR SELECT TO authenticated
  USING (
    subscription_id IN (
      SELECT id FROM communications_subscriptions cs
      WHERE (
        (cs.entity_type = 'merchant' AND cs.entity_id IN (
          SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
        ))
        OR
        (cs.entity_type = 'partner' AND cs.entity_id IN (
          SELECT id FROM partners WHERE user_id = (SELECT auth.uid())
        ))
      )
    )
  );

-- communications_transactions
DROP POLICY IF EXISTS "Merchants can view own transactions" ON communications_transactions;
DROP POLICY IF EXISTS "System can insert transactions" ON communications_transactions;

CREATE POLICY "Merchants can view own transactions" ON communications_transactions
  FOR SELECT TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "System can insert transactions" ON communications_transactions
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- merchant_team_members
DROP POLICY IF EXISTS "Merchant owners can manage their team" ON merchant_team_members;
DROP POLICY IF EXISTS "Team members can view their own record" ON merchant_team_members;

CREATE POLICY "Merchant owners can manage their team" ON merchant_team_members
  FOR ALL TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members can view their own record" ON merchant_team_members
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- partner_team_members
DROP POLICY IF EXISTS "Partner owners can manage their team" ON partner_team_members;
DROP POLICY IF EXISTS "Team members can view their own partner record" ON partner_team_members;

CREATE POLICY "Partner owners can manage their team" ON partner_team_members
  FOR ALL TO authenticated
  USING (
    partner_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Team members can view their own partner record" ON partner_team_members
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- business_coaching_bookings
DROP POLICY IF EXISTS "Internal team can view all coaching bookings" ON business_coaching_bookings;
DROP POLICY IF EXISTS "Merchants can insert own coaching bookings" ON business_coaching_bookings;
DROP POLICY IF EXISTS "Merchants can view own coaching bookings" ON business_coaching_bookings;
DROP POLICY IF EXISTS "Partners can insert own coaching bookings" ON business_coaching_bookings;
DROP POLICY IF EXISTS "Partners can view own coaching bookings" ON business_coaching_bookings;

CREATE POLICY "Internal team can view all coaching bookings" ON business_coaching_bookings
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Merchants can view own coaching bookings" ON business_coaching_bookings
  FOR SELECT TO authenticated
  USING (
    entity_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
    AND entity_type = 'merchant'
  );

CREATE POLICY "Merchants can insert own coaching bookings" ON business_coaching_bookings
  FOR INSERT TO authenticated
  WITH CHECK (
    entity_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
    AND entity_type = 'merchant'
  );

CREATE POLICY "Partners can view own coaching bookings" ON business_coaching_bookings
  FOR SELECT TO authenticated
  USING (
    entity_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
    AND entity_type = 'partner'
  );

CREATE POLICY "Partners can insert own coaching bookings" ON business_coaching_bookings
  FOR INSERT TO authenticated
  WITH CHECK (
    entity_id IN (
      SELECT id FROM partners 
      WHERE user_id = (SELECT auth.uid())
    )
    AND entity_type = 'partner'
  );

-- business_coaching_sessions
DROP POLICY IF EXISTS "Internal team can view all coaching sessions" ON business_coaching_sessions;
DROP POLICY IF EXISTS "Users can view own coaching sessions" ON business_coaching_sessions;

CREATE POLICY "Internal team can view all coaching sessions" ON business_coaching_sessions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can view own coaching sessions" ON business_coaching_sessions
  FOR SELECT TO authenticated
  USING (
    booking_id IN (
      SELECT id FROM business_coaching_bookings bcb
      WHERE (
        (bcb.entity_type = 'merchant' AND bcb.entity_id IN (
          SELECT id FROM merchants WHERE user_id = (SELECT auth.uid())
        ))
        OR
        (bcb.entity_type = 'partner' AND bcb.entity_id IN (
          SELECT id FROM partners WHERE user_id = (SELECT auth.uid())
        ))
      )
    )
  );

-- email_subscriptions
DROP POLICY IF EXISTS "Merchants can insert own email subscription" ON email_subscriptions;
DROP POLICY IF EXISTS "Merchants can update own email subscription" ON email_subscriptions;
DROP POLICY IF EXISTS "Merchants can view own email subscription" ON email_subscriptions;

CREATE POLICY "Merchants can view own email subscription" ON email_subscriptions
  FOR SELECT TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Merchants can insert own email subscription" ON email_subscriptions
  FOR INSERT TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Merchants can update own email subscription" ON email_subscriptions
  FOR UPDATE TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );
