/*
  # Optimize RLS Policies Performance - Part 3
  
  1. Performance Optimization Continued
    - Reviews and feedback tables
    - Favorites and notifications
    - Deal templates and scheduling
    - Surveys and gift cards
    - Support and location tables
*/

-- Drop and recreate policies for reviews
DROP POLICY IF EXISTS "Customers can create reviews for their purchases" ON reviews;
DROP POLICY IF EXISTS "Customers can update their own reviews" ON reviews;
DROP POLICY IF EXISTS "Merchants can view all reviews about their business" ON reviews;

CREATE POLICY "Customers can create reviews for their purchases"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = reviews.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Customers can update their own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = reviews.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view all reviews about their business"
  ON reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = reviews.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for review_responses
DROP POLICY IF EXISTS "Merchants can create responses to their reviews" ON review_responses;
DROP POLICY IF EXISTS "Merchants can update their own responses" ON review_responses;

CREATE POLICY "Merchants can create responses to their reviews"
  ON review_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = review_responses.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update their own responses"
  ON review_responses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = review_responses.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for review_helpful_votes
DROP POLICY IF EXISTS "Customers can delete their own votes" ON review_helpful_votes;
DROP POLICY IF EXISTS "Customers can vote reviews helpful" ON review_helpful_votes;

CREATE POLICY "Customers can delete their own votes"
  ON review_helpful_votes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = review_helpful_votes.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Customers can vote reviews helpful"
  ON review_helpful_votes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = review_helpful_votes.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for favorites
DROP POLICY IF EXISTS "Customers can add favorites" ON favorites;
DROP POLICY IF EXISTS "Customers can remove their own favorites" ON favorites;
DROP POLICY IF EXISTS "Customers can view their own favorites" ON favorites;

CREATE POLICY "Customers can add favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = favorites.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Customers can remove their own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = favorites.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Customers can view their own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = favorites.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for notifications
DROP POLICY IF EXISTS "Customers can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Customers can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Merchants can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Merchants can view their own notifications" ON notifications;

CREATE POLICY "Customers can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = notifications.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Customers can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = notifications.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = notifications.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = notifications.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for notification_preferences
DROP POLICY IF EXISTS "Customers can insert their own notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Customers can update their own notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Customers can view their own notification preferences" ON notification_preferences;

CREATE POLICY "Customers can insert their own notification preferences"
  ON notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = notification_preferences.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Customers can update their own notification preferences"
  ON notification_preferences FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = notification_preferences.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Customers can view their own notification preferences"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = notification_preferences.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for deal_templates
DROP POLICY IF EXISTS "Merchants can create templates" ON deal_templates;
DROP POLICY IF EXISTS "Merchants can delete their own templates" ON deal_templates;
DROP POLICY IF EXISTS "Merchants can update their own templates" ON deal_templates;
DROP POLICY IF EXISTS "Merchants can view their own templates" ON deal_templates;

CREATE POLICY "Merchants can create templates"
  ON deal_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = deal_templates.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can delete their own templates"
  ON deal_templates FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = deal_templates.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update their own templates"
  ON deal_templates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = deal_templates.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view their own templates"
  ON deal_templates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = deal_templates.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for scheduled_deals
DROP POLICY IF EXISTS "Merchants can create scheduled deals" ON scheduled_deals;
DROP POLICY IF EXISTS "Merchants can delete their own scheduled deals" ON scheduled_deals;
DROP POLICY IF EXISTS "Merchants can update their own scheduled deals" ON scheduled_deals;
DROP POLICY IF EXISTS "Merchants can view their own scheduled deals" ON scheduled_deals;

CREATE POLICY "Merchants can create scheduled deals"
  ON scheduled_deals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = scheduled_deals.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can delete their own scheduled deals"
  ON scheduled_deals FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = scheduled_deals.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update their own scheduled deals"
  ON scheduled_deals FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = scheduled_deals.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view their own scheduled deals"
  ON scheduled_deals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = scheduled_deals.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for deal_analytics
DROP POLICY IF EXISTS "Merchants can view analytics for their deals" ON deal_analytics;
CREATE POLICY "Merchants can view analytics for their deals"
  ON deal_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deals d
      JOIN merchants m ON m.id = d.merchant_id
      WHERE d.id = deal_analytics.deal_id
      AND m.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for surveys
DROP POLICY IF EXISTS "Merchants can create surveys" ON surveys;
DROP POLICY IF EXISTS "Merchants can update their own surveys" ON surveys;
DROP POLICY IF EXISTS "Merchants can view their own surveys" ON surveys;

CREATE POLICY "Merchants can create surveys"
  ON surveys FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = surveys.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update their own surveys"
  ON surveys FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = surveys.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view their own surveys"
  ON surveys FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = surveys.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for survey_responses
DROP POLICY IF EXISTS "Customers can submit survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Customers can view their own survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Merchants can view responses to their surveys" ON survey_responses;

CREATE POLICY "Customers can submit survey responses"
  ON survey_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = survey_responses.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Customers can view their own survey responses"
  ON survey_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = survey_responses.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view responses to their surveys"
  ON survey_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM surveys s
      JOIN merchants m ON m.id = s.merchant_id
      WHERE s.id = survey_responses.survey_id
      AND m.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for gift_cards
DROP POLICY IF EXISTS "Customers can view their own gift cards" ON gift_cards;
DROP POLICY IF EXISTS "Merchants can view gift cards for their business" ON gift_cards;

CREATE POLICY "Customers can view their own gift cards"
  ON gift_cards FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = gift_cards.purchased_by_customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view gift cards for their business"
  ON gift_cards FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = gift_cards.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for gift_card_transactions
DROP POLICY IF EXISTS "Customers can view transactions for their gift cards" ON gift_card_transactions;
CREATE POLICY "Customers can view transactions for their gift cards"
  ON gift_card_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM gift_cards gc
      JOIN customers c ON c.id = gc.purchased_by_customer_id
      WHERE gc.id = gift_card_transactions.gift_card_id
      AND c.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for customer_memberships
DROP POLICY IF EXISTS "Customers can update their own membership" ON customer_memberships;
DROP POLICY IF EXISTS "Customers can view their own membership" ON customer_memberships;

CREATE POLICY "Customers can update their own membership"
  ON customer_memberships FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_memberships.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Customers can view their own membership"
  ON customer_memberships FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_memberships.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for support_tickets
DROP POLICY IF EXISTS "Customers can create tickets" ON support_tickets;
DROP POLICY IF EXISTS "Customers can view their own tickets" ON support_tickets;
DROP POLICY IF EXISTS "Merchants can create tickets" ON support_tickets;
DROP POLICY IF EXISTS "Merchants can view their own tickets" ON support_tickets;
DROP POLICY IF EXISTS "Users can update their own tickets" ON support_tickets;

CREATE POLICY "Customers can create tickets"
  ON support_tickets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = support_tickets.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Customers can view their own tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = support_tickets.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can create tickets"
  ON support_tickets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = support_tickets.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view their own tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = support_tickets.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can update their own tickets"
  ON support_tickets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = support_tickets.customer_id
      AND customers.user_id = (select auth.uid())
    )
    OR
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = support_tickets.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for support_messages
DROP POLICY IF EXISTS "Users can create messages for their tickets" ON support_messages;
DROP POLICY IF EXISTS "Users can view messages for their tickets" ON support_messages;

CREATE POLICY "Users can create messages for their tickets"
  ON support_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM support_tickets st
      LEFT JOIN customers c ON c.id = st.customer_id
      LEFT JOIN merchants m ON m.id = st.merchant_id
      WHERE st.id = support_messages.ticket_id
      AND (c.user_id = (select auth.uid()) OR m.user_id = (select auth.uid()))
    )
  );

CREATE POLICY "Users can view messages for their tickets"
  ON support_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM support_tickets st
      LEFT JOIN customers c ON c.id = st.customer_id
      LEFT JOIN merchants m ON m.id = st.merchant_id
      WHERE st.id = support_messages.ticket_id
      AND (c.user_id = (select auth.uid()) OR m.user_id = (select auth.uid()))
    )
  );

-- Drop and recreate policies for merchant_locations
DROP POLICY IF EXISTS "Merchants can create their own locations" ON merchant_locations;
DROP POLICY IF EXISTS "Merchants can update their own locations" ON merchant_locations;
DROP POLICY IF EXISTS "Merchants can view their own locations" ON merchant_locations;

CREATE POLICY "Merchants can create their own locations"
  ON merchant_locations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_locations.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update their own locations"
  ON merchant_locations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_locations.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view their own locations"
  ON merchant_locations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_locations.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for deal_locations
DROP POLICY IF EXISTS "Merchants can manage locations for their deals" ON deal_locations;
CREATE POLICY "Merchants can manage locations for their deals"
  ON deal_locations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deals d
      JOIN merchants m ON m.id = d.merchant_id
      WHERE d.id = deal_locations.deal_id
      AND m.user_id = (select auth.uid())
    )
  );
