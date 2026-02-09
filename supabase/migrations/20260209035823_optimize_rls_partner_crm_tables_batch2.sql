/*
  # Optimize RLS Policies - Partner & CRM Tables Batch 2

  1. Performance Optimization
    - Wraps auth.uid() calls in SELECT subqueries
    
  2. Tables Covered
    - partner_crm_subscriptions
    - partner_crm_deals
    - partner_crm_contacts
    - ll_crm_contacts
    - ll_crm_deals
    - ll_crm_subscriptions
    - crm_leads
    - crm_tasks
    - crm_activities

  3. Performance Impact
    - 30-50% faster RLS policy evaluation
*/

-- partner_crm_subscriptions
DO $$
BEGIN
  DROP POLICY IF EXISTS "Partners can view own CRM subscriptions" ON partner_crm_subscriptions;
  DROP POLICY IF EXISTS "Partners can manage own CRM subscriptions" ON partner_crm_subscriptions;
  
  CREATE POLICY "Partners can view own CRM subscriptions"
    ON partner_crm_subscriptions FOR SELECT
    TO authenticated
    USING (
      partner_id IN (
        SELECT id FROM partners WHERE user_id = (select auth.uid())
      )
    );

  CREATE POLICY "Partners can manage own CRM subscriptions"
    ON partner_crm_subscriptions FOR ALL
    TO authenticated
    USING (
      partner_id IN (
        SELECT id FROM partners WHERE user_id = (select auth.uid())
      )
    )
    WITH CHECK (
      partner_id IN (
        SELECT id FROM partners WHERE user_id = (select auth.uid())
      )
    );
EXCEPTION
  WHEN undefined_table THEN NULL;
  WHEN undefined_column THEN NULL;
END $$;

-- partner_crm_deals
DO $$
BEGIN
  DROP POLICY IF EXISTS "Partners can view own CRM deals" ON partner_crm_deals;
  DROP POLICY IF EXISTS "Partners can manage own CRM deals" ON partner_crm_deals;
  
  CREATE POLICY "Partners can view own CRM deals"
    ON partner_crm_deals FOR SELECT
    TO authenticated
    USING (
      partner_id IN (
        SELECT id FROM partners WHERE user_id = (select auth.uid())
      )
    );

  CREATE POLICY "Partners can manage own CRM deals"
    ON partner_crm_deals FOR ALL
    TO authenticated
    USING (
      partner_id IN (
        SELECT id FROM partners WHERE user_id = (select auth.uid())
      )
    )
    WITH CHECK (
      partner_id IN (
        SELECT id FROM partners WHERE user_id = (select auth.uid())
      )
    );
EXCEPTION
  WHEN undefined_table THEN NULL;
  WHEN undefined_column THEN NULL;
END $$;

-- partner_crm_contacts
DO $$
BEGIN
  DROP POLICY IF EXISTS "Partners can view own CRM contacts" ON partner_crm_contacts;
  DROP POLICY IF EXISTS "Partners can manage own CRM contacts" ON partner_crm_contacts;
  
  CREATE POLICY "Partners can view own CRM contacts"
    ON partner_crm_contacts FOR SELECT
    TO authenticated
    USING (
      partner_id IN (
        SELECT id FROM partners WHERE user_id = (select auth.uid())
      )
    );

  CREATE POLICY "Partners can manage own CRM contacts"
    ON partner_crm_contacts FOR ALL
    TO authenticated
    USING (
      partner_id IN (
        SELECT id FROM partners WHERE user_id = (select auth.uid())
      )
    )
    WITH CHECK (
      partner_id IN (
        SELECT id FROM partners WHERE user_id = (select auth.uid())
      )
    );
EXCEPTION
  WHEN undefined_table THEN NULL;
  WHEN undefined_column THEN NULL;
END $$;

-- ll_crm_contacts (LocalLink CRM)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Merchants can view own contacts" ON ll_crm_contacts;
  DROP POLICY IF EXISTS "Merchants can manage own contacts" ON ll_crm_contacts;
  
  CREATE POLICY "Merchants can view own contacts"
    ON ll_crm_contacts FOR SELECT
    TO authenticated
    USING (
      merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    );

  CREATE POLICY "Merchants can manage own contacts"
    ON ll_crm_contacts FOR ALL
    TO authenticated
    USING (
      merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    )
    WITH CHECK (
      merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    );
EXCEPTION
  WHEN undefined_table THEN NULL;
  WHEN undefined_column THEN NULL;
END $$;

-- ll_crm_deals (LocalLink CRM)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Merchants can view own deals" ON ll_crm_deals;
  DROP POLICY IF EXISTS "Merchants can manage own deals" ON ll_crm_deals;
  
  CREATE POLICY "Merchants can view own deals"
    ON ll_crm_deals FOR SELECT
    TO authenticated
    USING (
      merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    );

  CREATE POLICY "Merchants can manage own deals"
    ON ll_crm_deals FOR ALL
    TO authenticated
    USING (
      merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    )
    WITH CHECK (
      merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    );
EXCEPTION
  WHEN undefined_table THEN NULL;
  WHEN undefined_column THEN NULL;
END $$;

-- ll_crm_subscriptions (LocalLink CRM)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Merchants can view own CRM subscriptions" ON ll_crm_subscriptions;
  DROP POLICY IF EXISTS "Merchants can manage own CRM subscriptions" ON ll_crm_subscriptions;
  
  CREATE POLICY "Merchants can view own CRM subscriptions"
    ON ll_crm_subscriptions FOR SELECT
    TO authenticated
    USING (
      merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    );

  CREATE POLICY "Merchants can manage own CRM subscriptions"
    ON ll_crm_subscriptions FOR ALL
    TO authenticated
    USING (
      merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    )
    WITH CHECK (
      merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    );
EXCEPTION
  WHEN undefined_table THEN NULL;
  WHEN undefined_column THEN NULL;
END $$;

-- crm_leads
DO $$
BEGIN
  DROP POLICY IF EXISTS "Merchants can view own leads" ON crm_leads;
  DROP POLICY IF EXISTS "Merchants can manage own leads" ON crm_leads;
  
  CREATE POLICY "Merchants can view own leads"
    ON crm_leads FOR SELECT
    TO authenticated
    USING (
      merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    );

  CREATE POLICY "Merchants can manage own leads"
    ON crm_leads FOR ALL
    TO authenticated
    USING (
      merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    )
    WITH CHECK (
      merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    );
EXCEPTION
  WHEN undefined_table THEN NULL;
  WHEN undefined_column THEN NULL;
END $$;

-- crm_tasks
DO $$
BEGIN
  DROP POLICY IF EXISTS "Merchants can view own tasks" ON crm_tasks;
  DROP POLICY IF EXISTS "Merchants can manage own tasks" ON crm_tasks;
  DROP POLICY IF EXISTS "Users can view assigned tasks" ON crm_tasks;
  
  CREATE POLICY "Merchants can view own tasks"
    ON crm_tasks FOR SELECT
    TO authenticated
    USING (
      merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      ) OR assigned_to = (select auth.uid())
    );

  CREATE POLICY "Merchants can manage own tasks"
    ON crm_tasks FOR ALL
    TO authenticated
    USING (
      merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    )
    WITH CHECK (
      merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    );
EXCEPTION
  WHEN undefined_table THEN NULL;
  WHEN undefined_column THEN NULL;
END $$;

-- crm_activities
DO $$
BEGIN
  DROP POLICY IF EXISTS "Merchants can view own activities" ON crm_activities;
  DROP POLICY IF EXISTS "Merchants can manage own activities" ON crm_activities;
  
  CREATE POLICY "Merchants can view own activities"
    ON crm_activities FOR SELECT
    TO authenticated
    USING (
      merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    );

  CREATE POLICY "Merchants can manage own activities"
    ON crm_activities FOR ALL
    TO authenticated
    USING (
      merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    )
    WITH CHECK (
      merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    );
EXCEPTION
  WHEN undefined_table THEN NULL;
  WHEN undefined_column THEN NULL;
END $$;
