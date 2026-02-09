/*
  # Commission Rules Update - Recurring, Flat Rate, and Profit-Based

  1. Commission Types
    - **Recurring**: Monthly subscriptions earn commission every month
    - **Flat Rate**: Fixed dollar amount one-time
    - **Profit-Based**: Commission calculated on profit after costs
    - **Tier-Based**: Standard tier commission rate

  2. Special Products
    - Merchant Services: $150 flat one-time
    - Business Capital: $150 flat one-time
    - Drive Repeat Business: $150 flat one-time
    - Printing Services: Commission on profit after cost
    - Postcard Advertising: 50% of profit after printing and postage

  3. Updates
    - Alter `product_commission_rules` to add new fields
    - Create `recurring_commission_schedule` table
    - Create `profit_based_commission_costs` table

  4. Functions
    - `calculate_commission_for_sale()` - Returns commission based on product rules
*/

-- Add new columns to existing table
DO $$ 
BEGIN
  -- Add commission_type column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'product_commission_rules' 
                 AND column_name = 'commission_type') THEN
    ALTER TABLE product_commission_rules 
    ADD COLUMN commission_type text NOT NULL DEFAULT 'tier' 
    CHECK (commission_type IN ('tier', 'flat_rate', 'profit_based', 'recurring_tier', 'none'));
  END IF;

  -- Add flat_rate_cents column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'product_commission_rules' 
                 AND column_name = 'flat_rate_cents') THEN
    ALTER TABLE product_commission_rules 
    ADD COLUMN flat_rate_cents integer CHECK (flat_rate_cents IS NULL OR flat_rate_cents >= 0);
  END IF;

  -- Add profit_percentage_bps column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'product_commission_rules' 
                 AND column_name = 'profit_percentage_bps') THEN
    ALTER TABLE product_commission_rules 
    ADD COLUMN profit_percentage_bps integer CHECK (profit_percentage_bps IS NULL OR (profit_percentage_bps >= 0 AND profit_percentage_bps <= 10000));
  END IF;

  -- Add is_recurring column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'product_commission_rules' 
                 AND column_name = 'is_recurring') THEN
    ALTER TABLE product_commission_rules 
    ADD COLUMN is_recurring boolean NOT NULL DEFAULT false;
  END IF;

  -- Add recurring_frequency column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'product_commission_rules' 
                 AND column_name = 'recurring_frequency') THEN
    ALTER TABLE product_commission_rules 
    ADD COLUMN recurring_frequency text CHECK (recurring_frequency IS NULL OR recurring_frequency IN ('monthly', 'annual', 'quarterly'));
  END IF;

  -- Add product_id column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'product_commission_rules' 
                 AND column_name = 'product_id') THEN
    ALTER TABLE product_commission_rules 
    ADD COLUMN product_id uuid REFERENCES marketplace_products(id) ON DELETE CASCADE;
  END IF;

  -- Rename is_active to active if needed
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'product_commission_rules' 
             AND column_name = 'is_active') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'product_commission_rules' 
                     AND column_name = 'active') THEN
    ALTER TABLE product_commission_rules RENAME COLUMN is_active TO active;
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'product_commission_rules' 
                 AND column_name = 'updated_at') THEN
    ALTER TABLE product_commission_rules 
    ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Recurring commission schedule
CREATE TABLE IF NOT EXISTS recurring_commission_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Original sale
  order_id uuid NOT NULL REFERENCES marketplace_orders(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES marketplace_products(id) ON DELETE CASCADE,
  
  -- Subscription tracking
  subscription_start_date date NOT NULL,
  subscription_end_date date, -- NULL if active
  subscription_status text NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'paused', 'expired')),
  
  -- Commission details
  commission_rate_bps integer NOT NULL CHECK (commission_rate_bps >= 0 AND commission_rate_bps <= 10000),
  base_amount_cents integer NOT NULL CHECK (base_amount_cents >= 0),
  commission_amount_cents integer NOT NULL CHECK (commission_amount_cents >= 0),
  frequency text NOT NULL CHECK (frequency IN ('monthly', 'annual', 'quarterly')),
  
  -- Payment tracking
  next_payment_date date NOT NULL,
  last_payment_date date,
  total_payments_made integer NOT NULL DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Profit-based commission costs (for printing/postcards)
CREATE TABLE IF NOT EXISTS profit_based_commission_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES marketplace_orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES marketplace_products(id) ON DELETE CASCADE,
  
  -- Sale details
  sale_amount_cents integer NOT NULL CHECK (sale_amount_cents >= 0),
  
  -- Cost breakdown
  printing_cost_cents integer NOT NULL DEFAULT 0 CHECK (printing_cost_cents >= 0),
  postage_cost_cents integer NOT NULL DEFAULT 0 CHECK (postage_cost_cents >= 0),
  material_cost_cents integer NOT NULL DEFAULT 0 CHECK (material_cost_cents >= 0),
  labor_cost_cents integer NOT NULL DEFAULT 0 CHECK (labor_cost_cents >= 0),
  other_cost_cents integer NOT NULL DEFAULT 0 CHECK (other_cost_cents >= 0),
  
  -- Calculated profit
  total_cost_cents integer NOT NULL DEFAULT 0 CHECK (total_cost_cents >= 0),
  profit_cents integer NOT NULL DEFAULT 0,
  
  -- Commission calculation
  profit_percentage_bps integer NOT NULL CHECK (profit_percentage_bps >= 0 AND profit_percentage_bps <= 10000),
  commission_cents integer NOT NULL DEFAULT 0 CHECK (commission_cents >= 0),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_commission_rules_type ON product_commission_rules(commission_type);
CREATE INDEX IF NOT EXISTS idx_recurring_commission_partner ON recurring_commission_schedule(partner_id);
CREATE INDEX IF NOT EXISTS idx_recurring_commission_next_payment ON recurring_commission_schedule(next_payment_date) WHERE subscription_status = 'active';
CREATE INDEX IF NOT EXISTS idx_profit_based_order ON profit_based_commission_costs(order_id);

-- Enable RLS on new tables
ALTER TABLE recurring_commission_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE profit_based_commission_costs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for new tables
CREATE POLICY "Partners can view their recurring commission schedule"
  ON recurring_commission_schedule FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE user_id = auth.uid()
      AND partners.id = recurring_commission_schedule.partner_id
    )
  );

CREATE POLICY "Admin full access to recurring commission schedule"
  ON recurring_commission_schedule FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Partners can view their profit based commissions"
  ON profit_based_commission_costs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_orders mo
      JOIN partners p ON p.id = mo.partner_id
      WHERE p.user_id = auth.uid()
      AND mo.id = profit_based_commission_costs.order_id
    )
  );

CREATE POLICY "Admin full access to profit based commissions"
  ON profit_based_commission_costs FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Function to calculate commission based on product rules
CREATE OR REPLACE FUNCTION calculate_commission_for_sale(
  p_partner_id uuid,
  p_product_id uuid,
  p_sale_amount_cents integer,
  p_profit_cents integer DEFAULT NULL
)
RETURNS TABLE (
  commission_type text,
  commission_amount_cents integer,
  commission_rate_bps integer,
  is_recurring boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rule_type text;
  v_flat_rate integer;
  v_profit_pct integer;
  v_partner_tier_rate integer;
  v_calc_commission integer;
BEGIN
  -- Get commission rule for product
  SELECT 
    commission_type, 
    flat_rate_cents, 
    profit_percentage_bps
  INTO 
    v_rule_type, 
    v_flat_rate, 
    v_profit_pct
  FROM product_commission_rules
  WHERE product_id = p_product_id
  AND active = true;

  -- If no rule, use tier-based
  IF v_rule_type IS NULL THEN
    v_partner_tier_rate := get_partner_commission_rate_bps(p_partner_id);
    v_calc_commission := (p_sale_amount_cents * v_partner_tier_rate) / 10000;
    
    RETURN QUERY SELECT
      'tier'::text,
      v_calc_commission,
      v_partner_tier_rate,
      false;
    RETURN;
  END IF;

  -- Handle different commission types
  IF v_rule_type = 'flat_rate' THEN
    -- Fixed dollar amount (e.g., $150 for Merchant Services)
    RETURN QUERY SELECT
      'flat_rate'::text,
      v_flat_rate,
      NULL::integer,
      false;
  
  ELSIF v_rule_type = 'profit_based' THEN
    -- Commission on profit (e.g., printing services)
    IF p_profit_cents IS NULL THEN
      RAISE EXCEPTION 'Profit amount required for profit-based commission';
    END IF;
    v_calc_commission := (p_profit_cents * v_profit_pct) / 10000;
    
    RETURN QUERY SELECT
      'profit_based'::text,
      v_calc_commission,
      v_profit_pct,
      false;
  
  ELSIF v_rule_type = 'recurring_tier' THEN
    -- Recurring tier-based (monthly subscriptions)
    v_partner_tier_rate := get_partner_commission_rate_bps(p_partner_id);
    v_calc_commission := (p_sale_amount_cents * v_partner_tier_rate) / 10000;
    
    RETURN QUERY SELECT
      'recurring_tier'::text,
      v_calc_commission,
      v_partner_tier_rate,
      true;
  
  ELSIF v_rule_type = 'tier' THEN
    -- Standard tier-based (one-time)
    v_partner_tier_rate := get_partner_commission_rate_bps(p_partner_id);
    v_calc_commission := (p_sale_amount_cents * v_partner_tier_rate) / 10000;
    
    RETURN QUERY SELECT
      'tier'::text,
      v_calc_commission,
      v_partner_tier_rate,
      false;
  
  ELSIF v_rule_type = 'none' THEN
    -- No commission
    RETURN QUERY SELECT
      'none'::text,
      0,
      0,
      false;
  END IF;
END;
$$;

COMMENT ON FUNCTION calculate_commission_for_sale IS 'Calculate commission based on product-specific rules: flat rate, profit-based, recurring, or tier-based';
COMMENT ON TABLE recurring_commission_schedule IS 'Tracks recurring commission payments for subscriptions';
COMMENT ON TABLE profit_based_commission_costs IS 'Tracks costs and profit for profit-based commission products';
