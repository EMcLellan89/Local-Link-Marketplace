/*
  # Fix Auth RLS Performance - Batch 6: Business Coaching through Creator Tables

  Optimizes RLS policies to use (SELECT auth.<function>()) pattern.

  ## Tables Modified
  - business_coaching_bookings (3 policies)
  - business_coaching_sessions (2 policies)
  - business_deals (1 policy)
  - business_units (1 policy)
  - campaign_recipients (1 policy)
  - cart_items (1 policy)
  - certificates (1 policy)
  - certificates_issued (1 policy)
  - certifications (1 policy)
  - cleanup_quote_requests (1 policy)
  - comm_outbox (1 policy)
  - comm_outbox_dead (1 policy)
  - commission_ledger (2 policies)
  - commission_payout_batches (2 policies)
  - commission_payout_queue (2 policies)
  - commission_rules (1 policy)
  - commissions (1 policy)
  - communications_subscriptions (5 policies)
  - communications_transactions (2 policies)
  - communications_usage (2 policies)
  - community_sponsorships (2 policies)
  - contact_suppressions (1 policy)
  - course_affiliate_payouts (1 policy)
  - course_affiliate_referrals (1 policy)
  - course_affiliates (2 policies)
  - course_exam_attempts (1 policy)
  - course_lessons (1 policy)
  - course_modules (1 policy)
  - course_pricing (1 policy - duplicate)
  - course_webinar_content (1 policy - duplicate)
  - creative_events (2 policies)
  - creative_tests (2 policies)
  - creator_agreement_signatures (2 policies)

  Total: 52 policies optimized
*/

-- business_coaching_bookings
DROP POLICY IF EXISTS "Internal team can view all coaching bookings" ON business_coaching_bookings;
CREATE POLICY "Internal team can view all coaching bookings"
  ON business_coaching_bookings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can view own coaching bookings" ON business_coaching_bookings;
CREATE POLICY "Merchants can view own coaching bookings"
  ON business_coaching_bookings
  FOR SELECT
  TO authenticated
  USING (
    entity_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
    AND entity_type = 'merchant'
  );

DROP POLICY IF EXISTS "Partners can view own coaching bookings" ON business_coaching_bookings;
CREATE POLICY "Partners can view own coaching bookings"
  ON business_coaching_bookings
  FOR SELECT
  TO authenticated
  USING (
    entity_id IN (
      SELECT partners.id FROM partners
      WHERE partners.user_id = (SELECT auth.uid())
    )
    AND entity_type = 'partner'
  );

-- business_coaching_sessions
DROP POLICY IF EXISTS "Internal team can view all coaching sessions" ON business_coaching_sessions;
CREATE POLICY "Internal team can view all coaching sessions"
  ON business_coaching_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can view own coaching sessions" ON business_coaching_sessions;
CREATE POLICY "Users can view own coaching sessions"
  ON business_coaching_sessions
  FOR SELECT
  TO authenticated
  USING (
    booking_id IN (
      SELECT bcb.id FROM business_coaching_bookings bcb
      WHERE (
        bcb.entity_type = 'merchant'
        AND bcb.entity_id IN (
          SELECT merchants.id FROM merchants
          WHERE merchants.user_id = (SELECT auth.uid())
        )
      )
      OR (
        bcb.entity_type = 'partner'
        AND bcb.entity_id IN (
          SELECT partners.id FROM partners
          WHERE partners.user_id = (SELECT auth.uid())
        )
      )
    )
  );

-- business_deals
DROP POLICY IF EXISTS "Admin full access to business_deals" ON business_deals;
CREATE POLICY "Admin full access to business_deals"
  ON business_deals
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- business_units
DROP POLICY IF EXISTS "Internal team can manage business units" ON business_units;
CREATE POLICY "Internal team can manage business units"
  ON business_units
  FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt())->>'role' = ANY(ARRAY['admin', 'internal_team']));

-- campaign_recipients
DROP POLICY IF EXISTS "Users can view relevant campaign recipients" ON campaign_recipients;
CREATE POLICY "Users can view relevant campaign recipients"
  ON campaign_recipients
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customers.id FROM customers
      WHERE customers.user_id = (SELECT auth.uid())
    )
    OR
    campaign_id IN (
      SELECT email_campaigns.id FROM email_campaigns
      WHERE email_campaigns.merchant_id IN (
        SELECT merchants.id FROM merchants
        WHERE merchants.user_id = (SELECT auth.uid())
      )
    )
  );

-- cart_items
DROP POLICY IF EXISTS "Customers manage their cart items" ON cart_items;
CREATE POLICY "Customers manage their cart items"
  ON cart_items
  FOR ALL
  TO authenticated
  USING (
    (SELECT auth.uid()) IN (
      SELECT shopping_carts.customer_id FROM shopping_carts
      WHERE shopping_carts.id = cart_items.cart_id
    )
  );

-- certificates
DROP POLICY IF EXISTS "Users can view their own certificates" ON certificates;
CREATE POLICY "Users can view their own certificates"
  ON certificates
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- certificates_issued
DROP POLICY IF EXISTS "Users can view certificates" ON certificates_issued;
CREATE POLICY "Users can view certificates"
  ON certificates_issued
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()) OR true);

-- certifications
DROP POLICY IF EXISTS "certifications_admin_all" ON certifications;
CREATE POLICY "certifications_admin_all"
  ON certifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

-- cleanup_quote_requests
DROP POLICY IF EXISTS "partners can select their quotes" ON cleanup_quote_requests;
CREATE POLICY "partners can select their quotes"
  ON cleanup_quote_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners p
      WHERE p.id = cleanup_quote_requests.partner_id
      AND p.user_id = (SELECT auth.uid())
    )
  );

-- comm_outbox
DROP POLICY IF EXISTS "Admin full access to comm_outbox" ON comm_outbox;
CREATE POLICY "Admin full access to comm_outbox"
  ON comm_outbox
  FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt())->>'role' = 'admin');

-- comm_outbox_dead
DROP POLICY IF EXISTS "Admin access to dead letter queue" ON comm_outbox_dead;
CREATE POLICY "Admin access to dead letter queue"
  ON comm_outbox_dead
  FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt())->>'role' = 'admin');

-- commission_ledger
DROP POLICY IF EXISTS "Admins can manage all commissions" ON commission_ledger;
CREATE POLICY "Admins can manage all commissions"
  ON commission_ledger
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "Partners can view their own commissions" ON commission_ledger;
CREATE POLICY "Partners can view their own commissions"
  ON commission_ledger
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = commission_ledger.recipient_partner_id
      AND partners.user_id = (SELECT auth.uid())
    )
  );

-- commission_payout_batches
DROP POLICY IF EXISTS "Admin can manage payout batches" ON commission_payout_batches;
CREATE POLICY "Admin can manage payout batches"
  ON commission_payout_batches
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "Admins can view all payout batches" ON commission_payout_batches;
CREATE POLICY "Admins can view all payout batches"
  ON commission_payout_batches
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- commission_payout_queue
DROP POLICY IF EXISTS "Admins can manage payout queue" ON commission_payout_queue;
CREATE POLICY "Admins can manage payout queue"
  ON commission_payout_queue
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "Partners can view their own payout queue" ON commission_payout_queue;
CREATE POLICY "Partners can view their own payout queue"
  ON commission_payout_queue
  FOR SELECT
  TO authenticated
  USING (
    partner_id = (SELECT auth.uid())
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- commission_rules
DROP POLICY IF EXISTS "Admins can manage commission rules" ON commission_rules;
CREATE POLICY "Admins can manage commission rules"
  ON commission_rules
  FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt())->>'role' = 'admin');

-- commissions
DROP POLICY IF EXISTS "partners can view own commissions" ON commissions;
CREATE POLICY "partners can view own commissions"
  ON commissions
  FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT p.id FROM partners p
      WHERE p.user_id = (SELECT auth.uid())
    )
  );

-- communications_subscriptions
DROP POLICY IF EXISTS "Internal team can view all communications subscriptions" ON communications_subscriptions;
CREATE POLICY "Internal team can view all communications subscriptions"
  ON communications_subscriptions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can update own communications subscription" ON communications_subscriptions;
CREATE POLICY "Merchants can update own communications subscription"
  ON communications_subscriptions
  FOR UPDATE
  TO authenticated
  USING (
    entity_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
    AND entity_type = 'merchant'
  );

DROP POLICY IF EXISTS "Merchants can view own communications subscription" ON communications_subscriptions;
CREATE POLICY "Merchants can view own communications subscription"
  ON communications_subscriptions
  FOR SELECT
  TO authenticated
  USING (
    entity_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
    AND entity_type = 'merchant'
  );

DROP POLICY IF EXISTS "Partners can update own communications subscription" ON communications_subscriptions;
CREATE POLICY "Partners can update own communications subscription"
  ON communications_subscriptions
  FOR UPDATE
  TO authenticated
  USING (
    entity_id IN (
      SELECT partners.id FROM partners
      WHERE partners.user_id = (SELECT auth.uid())
    )
    AND entity_type = 'partner'
  );

DROP POLICY IF EXISTS "Partners can view own communications subscription" ON communications_subscriptions;
CREATE POLICY "Partners can view own communications subscription"
  ON communications_subscriptions
  FOR SELECT
  TO authenticated
  USING (
    entity_id IN (
      SELECT partners.id FROM partners
      WHERE partners.user_id = (SELECT auth.uid())
    )
    AND entity_type = 'partner'
  );

-- communications_transactions
DROP POLICY IF EXISTS "Admins can view all communications transactions" ON communications_transactions;
CREATE POLICY "Admins can view all communications transactions"
  ON communications_transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "Merchants can view own transactions" ON communications_transactions;
CREATE POLICY "Merchants can view own transactions"
  ON communications_transactions
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id FROM merchants
      WHERE merchants.user_id = (SELECT auth.uid())
    )
  );

-- communications_usage
DROP POLICY IF EXISTS "Internal team can view all communications usage" ON communications_usage;
CREATE POLICY "Internal team can view all communications usage"
  ON communications_usage
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can view own communications usage" ON communications_usage;
CREATE POLICY "Users can view own communications usage"
  ON communications_usage
  FOR SELECT
  TO authenticated
  USING (
    subscription_id IN (
      SELECT cs.id FROM communications_subscriptions cs
      WHERE (
        cs.entity_type = 'merchant'
        AND cs.entity_id IN (
          SELECT merchants.id FROM merchants
          WHERE merchants.user_id = (SELECT auth.uid())
        )
      )
      OR (
        cs.entity_type = 'partner'
        AND cs.entity_id IN (
          SELECT partners.id FROM partners
          WHERE partners.user_id = (SELECT auth.uid())
        )
      )
    )
  );

-- community_sponsorships
DROP POLICY IF EXISTS "Merchants can update own sponsorships" ON community_sponsorships;
CREATE POLICY "Merchants can update own sponsorships"
  ON community_sponsorships
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.uid()) IN (
      SELECT merchants.user_id FROM merchants
      WHERE merchants.id = community_sponsorships.merchant_id
    )
  );

DROP POLICY IF EXISTS "Merchants can view own sponsorships" ON community_sponsorships;
CREATE POLICY "Merchants can view own sponsorships"
  ON community_sponsorships
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) IN (
      SELECT merchants.user_id FROM merchants
      WHERE merchants.id = community_sponsorships.merchant_id
    )
  );

-- contact_suppressions
DROP POLICY IF EXISTS "contact_suppressions_admin" ON contact_suppressions;
CREATE POLICY "contact_suppressions_admin"
  ON contact_suppressions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- course_affiliate_payouts
DROP POLICY IF EXISTS "Users can view their affiliate payouts" ON course_affiliate_payouts;
CREATE POLICY "Users can view their affiliate payouts"
  ON course_affiliate_payouts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_affiliates
      WHERE course_affiliates.id = course_affiliate_payouts.affiliate_id
      AND course_affiliates.user_id = (SELECT auth.uid())
    )
  );

-- course_affiliate_referrals
DROP POLICY IF EXISTS "Users can view their affiliate referrals" ON course_affiliate_referrals;
CREATE POLICY "Users can view their affiliate referrals"
  ON course_affiliate_referrals
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_affiliates
      WHERE course_affiliates.id = course_affiliate_referrals.affiliate_id
      AND course_affiliates.user_id = (SELECT auth.uid())
    )
  );

-- course_affiliates
DROP POLICY IF EXISTS "Users can update their own affiliate account" ON course_affiliates;
CREATE POLICY "Users can update their own affiliate account"
  ON course_affiliates
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view their own affiliate account" ON course_affiliates;
CREATE POLICY "Users can view their own affiliate account"
  ON course_affiliates
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- course_exam_attempts
DROP POLICY IF EXISTS "Users can read their own exam attempts" ON course_exam_attempts;
CREATE POLICY "Users can read their own exam attempts"
  ON course_exam_attempts
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- course_lessons
DROP POLICY IF EXISTS "Users can view lessons for accessible courses" ON course_lessons;
CREATE POLICY "Users can view lessons for accessible courses"
  ON course_lessons
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN courses c ON c.id = cm.course_id
      WHERE cm.id = course_lessons.module_id
      AND c.is_published = true
      AND user_has_course_access((SELECT auth.uid()), c.id)
    )
  );

-- course_modules
DROP POLICY IF EXISTS "Users can view course modules for accessible courses" ON course_modules;
CREATE POLICY "Users can view course modules for accessible courses"
  ON course_modules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = course_modules.course_id
      AND c.is_published = true
      AND user_has_course_access((SELECT auth.uid()), c.id)
    )
  );

-- course_pricing (duplicate - already fixed)
DROP POLICY IF EXISTS "Only admins can modify course pricing" ON course_pricing;
CREATE POLICY "Only admins can modify course pricing"
  ON course_pricing
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- course_webinar_content (duplicate - already fixed)
DROP POLICY IF EXISTS "Only admins can modify webinar content" ON course_webinar_content;
CREATE POLICY "Only admins can modify webinar content"
  ON course_webinar_content
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

-- creative_events
DROP POLICY IF EXISTS "Admins view all" ON creative_events;
CREATE POLICY "Admins view all"
  ON creative_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "Partners view own" ON creative_events;
CREATE POLICY "Partners view own"
  ON creative_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = creative_events.partner_id
      AND partners.user_id = (SELECT auth.uid())
    )
  );

-- creative_tests
DROP POLICY IF EXISTS "Admins view tests" ON creative_tests;
CREATE POLICY "Admins view tests"
  ON creative_tests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'::user_role
    )
  );

DROP POLICY IF EXISTS "Partners manage own" ON creative_tests;
CREATE POLICY "Partners manage own"
  ON creative_tests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = creative_tests.partner_id
      AND partners.user_id = (SELECT auth.uid())
    )
  );

-- creator_agreement_signatures
DROP POLICY IF EXISTS "sigs_admin" ON creator_agreement_signatures;
CREATE POLICY "sigs_admin"
  ON creator_agreement_signatures
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "sigs_select" ON creator_agreement_signatures;
CREATE POLICY "sigs_select"
  ON creator_agreement_signatures
  FOR SELECT
  TO authenticated
  USING (
    creator_id = (SELECT auth.uid())
    OR
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (SELECT auth.uid())
    )
  );