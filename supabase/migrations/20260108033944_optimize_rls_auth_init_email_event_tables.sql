/*
  # Optimize RLS Auth Initialization - Email and Event Tables

  Fixes Auth RLS Initialization Plan issues for:
  - ecommerce_orders
  - email_automation_sequences
  - email_automation_steps
  - email_campaigns
  - email_subscribers
  - email_templates
  - event_attendance
  - event_series
  - event_tickets
  - events
*/

-- ecommerce_orders
DROP POLICY IF EXISTS "Merchants update their orders" ON public.ecommerce_orders;
CREATE POLICY "Merchants update their orders"
  ON public.ecommerce_orders
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = ecommerce_orders.merchant_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = ecommerce_orders.merchant_id
    )
  );

-- email_automation_sequences
DROP POLICY IF EXISTS "Merchants manage their automation sequences" ON public.email_automation_sequences;
CREATE POLICY "Merchants manage their automation sequences"
  ON public.email_automation_sequences
  FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = email_automation_sequences.merchant_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = email_automation_sequences.merchant_id
    )
  );

-- email_automation_steps
DROP POLICY IF EXISTS "Merchants manage their automation steps" ON public.email_automation_steps;
CREATE POLICY "Merchants manage their automation steps"
  ON public.email_automation_steps
  FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT m.user_id
      FROM merchants m
      JOIN email_automation_sequences eas ON m.id = eas.merchant_id
      WHERE eas.id = email_automation_steps.sequence_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT m.user_id
      FROM merchants m
      JOIN email_automation_sequences eas ON m.id = eas.merchant_id
      WHERE eas.id = email_automation_steps.sequence_id
    )
  );

-- email_campaigns
DROP POLICY IF EXISTS "Merchants manage their email campaigns" ON public.email_campaigns;
CREATE POLICY "Merchants manage their email campaigns"
  ON public.email_campaigns
  FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = email_campaigns.merchant_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = email_campaigns.merchant_id
    )
  );

-- email_subscribers
DROP POLICY IF EXISTS "Merchants manage their subscribers" ON public.email_subscribers;
CREATE POLICY "Merchants manage their subscribers"
  ON public.email_subscribers
  FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = email_subscribers.merchant_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = email_subscribers.merchant_id
    )
  );

-- email_templates
DROP POLICY IF EXISTS "Merchants manage their email templates" ON public.email_templates;
CREATE POLICY "Merchants manage their email templates"
  ON public.email_templates
  FOR ALL
  TO authenticated
  USING (
    (merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )) OR (merchant_id IS NULL)
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- event_attendance
DROP POLICY IF EXISTS "Merchants manage event attendance" ON public.event_attendance;
CREATE POLICY "Merchants manage event attendance"
  ON public.event_attendance
  FOR ALL
  TO authenticated
  USING (
    registration_id IN (
      SELECT event_registrations.id
      FROM event_registrations
      WHERE event_registrations.event_id IN (
        SELECT events.id
        FROM events
        WHERE events.merchant_id IN (
          SELECT merchants.id
          FROM merchants
          WHERE merchants.user_id = (select auth.uid())
        )
      )
    )
  )
  WITH CHECK (
    registration_id IN (
      SELECT event_registrations.id
      FROM event_registrations
      WHERE event_registrations.event_id IN (
        SELECT events.id
        FROM events
        WHERE events.merchant_id IN (
          SELECT merchants.id
          FROM merchants
          WHERE merchants.user_id = (select auth.uid())
        )
      )
    )
  );

-- event_series
DROP POLICY IF EXISTS "Merchants manage their event series" ON public.event_series;
CREATE POLICY "Merchants manage their event series"
  ON public.event_series
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- event_tickets
DROP POLICY IF EXISTS "Merchants manage their event tickets" ON public.event_tickets;
CREATE POLICY "Merchants manage their event tickets"
  ON public.event_tickets
  FOR ALL
  TO authenticated
  USING (
    event_id IN (
      SELECT events.id
      FROM events
      WHERE events.merchant_id IN (
        SELECT merchants.id
        FROM merchants
        WHERE merchants.user_id = (select auth.uid())
      )
    )
  )
  WITH CHECK (
    event_id IN (
      SELECT events.id
      FROM events
      WHERE events.merchant_id IN (
        SELECT merchants.id
        FROM merchants
        WHERE merchants.user_id = (select auth.uid())
      )
    )
  );

-- events
DROP POLICY IF EXISTS "Merchants manage their events" ON public.events;
CREATE POLICY "Merchants manage their events"
  ON public.events
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );
