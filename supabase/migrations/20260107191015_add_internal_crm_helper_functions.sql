/*
  # Internal CRM Helper Functions

  Adds utility functions for managing customer data and LTV calculations
*/

-- Function to increment customer lifetime value
CREATE OR REPLACE FUNCTION increment_customer_ltv(
  p_customer_id uuid,
  p_amount numeric
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE unified_customers
  SET total_lifetime_value = total_lifetime_value + p_amount,
      updated_at = now()
  WHERE id = p_customer_id;
END;
$$;

-- Function to update business relationship LTV
CREATE OR REPLACE FUNCTION update_business_relationship_ltv(
  p_customer_id uuid,
  p_business_id uuid,
  p_amount numeric
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today date := CURRENT_DATE;
BEGIN
  INSERT INTO customer_business_relationships (
    customer_id,
    business_unit_id,
    lifetime_value,
    first_purchase_date,
    last_purchase_date
  ) VALUES (
    p_customer_id,
    p_business_id,
    p_amount,
    v_today,
    v_today
  )
  ON CONFLICT (customer_id, business_unit_id)
  DO UPDATE SET
    lifetime_value = customer_business_relationships.lifetime_value + p_amount,
    last_purchase_date = v_today;
END;
$$;
