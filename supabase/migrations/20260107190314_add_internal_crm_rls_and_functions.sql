/*
  # Internal CRM RLS Policies and Helper Functions

  Adds row-level security policies and utility functions for the internal CRM system
*/

-- RLS Policies for internal team access
CREATE POLICY "Internal team can view team members"
  ON internal_team_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.email = auth.jwt()->>'email'
      AND itm.is_active = true
    )
  );

CREATE POLICY "Internal team can manage business units"
  ON business_units FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.email = auth.jwt()->>'email'
      AND itm.is_active = true
    )
  );

CREATE POLICY "Internal team can manage customers"
  ON unified_customers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.email = auth.jwt()->>'email'
      AND itm.is_active = true
    )
  );

CREATE POLICY "Internal team can manage relationships"
  ON customer_business_relationships FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.email = auth.jwt()->>'email'
      AND itm.is_active = true
    )
  );

CREATE POLICY "Internal team can manage sales"
  ON unified_sales FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.email = auth.jwt()->>'email'
      AND itm.is_active = true
    )
  );

CREATE POLICY "Internal team can manage invoices"
  ON internal_invoices FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.email = auth.jwt()->>'email'
      AND itm.is_active = true
    )
  );

CREATE POLICY "Accountants can manage ledger"
  ON internal_accounting_ledger FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.email = auth.jwt()->>'email'
      AND itm.is_active = true
      AND itm.role IN ('admin', 'accountant', 'manager')
    )
  );

CREATE POLICY "Internal team can manage tickets"
  ON customer_support_tickets FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.email = auth.jwt()->>'email'
      AND itm.is_active = true
    )
  );

CREATE POLICY "Internal team can manage messages"
  ON ticket_messages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.email = auth.jwt()->>'email'
      AND itm.is_active = true
    )
  );

CREATE POLICY "Internal team can manage activity log"
  ON customer_activity_log FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.email = auth.jwt()->>'email'
      AND itm.is_active = true
    )
  );

CREATE POLICY "Internal team can view impersonation log"
  ON customer_impersonation_log FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.email = auth.jwt()->>'email'
      AND itm.is_active = true
    )
  );

CREATE POLICY "Internal team can manage emails"
  ON email_communications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.email = auth.jwt()->>'email'
      AND itm.is_active = true
    )
  );

CREATE POLICY "Internal team can manage webhooks"
  ON external_business_webhooks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM internal_team_members itm
      WHERE itm.email = auth.jwt()->>'email'
      AND itm.is_active = true
    )
  );

-- Helper function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num integer;
  year_str text;
BEGIN
  year_str := EXTRACT(YEAR FROM CURRENT_DATE)::text;
  
  SELECT COALESCE(MAX(
    SUBSTRING(invoice_number FROM 'INV-' || year_str || '-(\d+)')::integer
  ), 0) + 1
  INTO next_num
  FROM internal_invoices
  WHERE invoice_number LIKE 'INV-' || year_str || '-%';
  
  RETURN 'INV-' || year_str || '-' || LPAD(next_num::text, 5, '0');
END;
$$;

-- Helper function to generate ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num integer;
BEGIN
  SELECT COALESCE(MAX(
    SUBSTRING(ticket_number FROM 'TICKET-(\d+)')::integer
  ), 0) + 1
  INTO next_num
  FROM customer_support_tickets;
  
  RETURN 'TICKET-' || LPAD(next_num::text, 6, '0');
END;
$$;

-- Function to log customer activity
CREATE OR REPLACE FUNCTION log_customer_activity(
  p_customer_id uuid,
  p_business_unit_id uuid,
  p_activity_type text,
  p_activity_description text,
  p_performed_by uuid DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  activity_id uuid;
BEGIN
  INSERT INTO customer_activity_log (
    customer_id,
    business_unit_id,
    activity_type,
    activity_description,
    performed_by,
    metadata
  ) VALUES (
    p_customer_id,
    p_business_unit_id,
    p_activity_type,
    p_activity_description,
    p_performed_by,
    p_metadata
  )
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;

-- Function to find or create unified customer
CREATE OR REPLACE FUNCTION find_or_create_unified_customer(
  p_email text,
  p_full_name text DEFAULT NULL,
  p_business_unit_id uuid DEFAULT NULL,
  p_customer_type text DEFAULT 'individual',
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  customer_id uuid;
BEGIN
  -- Try to find existing customer
  SELECT id INTO customer_id
  FROM unified_customers
  WHERE email = p_email;
  
  -- If not found, create new customer
  IF customer_id IS NULL THEN
    INSERT INTO unified_customers (
      email,
      full_name,
      primary_business_unit_id,
      customer_type,
      metadata
    ) VALUES (
      p_email,
      p_full_name,
      p_business_unit_id,
      p_customer_type,
      p_metadata
    )
    RETURNING id INTO customer_id;
  END IF;
  
  RETURN customer_id;
END;
$$;

-- Function to record sales and update customer LTV
CREATE OR REPLACE FUNCTION record_sale_and_update_ltv(
  p_customer_id uuid,
  p_business_unit_id uuid,
  p_product_name text,
  p_amount numeric,
  p_sale_date date DEFAULT CURRENT_DATE,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sale_id uuid;
BEGIN
  -- Insert sale
  INSERT INTO unified_sales (
    customer_id,
    business_unit_id,
    product_name,
    amount,
    net_amount,
    sale_date,
    payment_status,
    metadata
  ) VALUES (
    p_customer_id,
    p_business_unit_id,
    p_product_name,
    p_amount,
    p_amount,
    p_sale_date,
    'paid',
    p_metadata
  )
  RETURNING id INTO sale_id;
  
  -- Update customer total LTV
  UPDATE unified_customers
  SET total_lifetime_value = total_lifetime_value + p_amount,
      updated_at = now()
  WHERE id = p_customer_id;
  
  -- Update business relationship LTV
  INSERT INTO customer_business_relationships (
    customer_id,
    business_unit_id,
    lifetime_value,
    first_purchase_date,
    last_purchase_date
  ) VALUES (
    p_customer_id,
    p_business_unit_id,
    p_amount,
    p_sale_date,
    p_sale_date
  )
  ON CONFLICT (customer_id, business_unit_id)
  DO UPDATE SET
    lifetime_value = customer_business_relationships.lifetime_value + p_amount,
    last_purchase_date = p_sale_date;
  
  RETURN sale_id;
END;
$$;
