/*
  # Fix Remaining Function Search Paths (Corrected)
  
  1. Fixes function search paths for trigger functions
  2. Handles the trigger dependency properly
*/

-- Drop the trigger first
DROP TRIGGER IF EXISTS trigger_create_default_chart_of_accounts ON merchants;

-- Drop the parameterless version
DROP FUNCTION IF EXISTS create_default_chart_of_accounts();

-- Create a proper trigger function version with search_path
CREATE OR REPLACE FUNCTION create_default_chart_of_accounts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO accounting_chart_of_accounts (merchant_id, account_number, account_name, account_type, description, is_active)
  VALUES
    (NEW.id, '1000', 'Cash', 'asset', 'Cash and cash equivalents', true),
    (NEW.id, '1200', 'Accounts Receivable', 'asset', 'Money owed by customers', true),
    (NEW.id, '1500', 'Inventory', 'asset', 'Inventory on hand', true),
    (NEW.id, '2000', 'Accounts Payable', 'liability', 'Money owed to suppliers', true),
    (NEW.id, '2500', 'Sales Tax Payable', 'liability', 'Sales tax collected', true),
    (NEW.id, '3000', 'Owner Equity', 'equity', 'Owner investment and retained earnings', true),
    (NEW.id, '4000', 'Sales Revenue', 'revenue', 'Sales income', true),
    (NEW.id, '5000', 'Cost of Goods Sold', 'expense', 'Direct costs of products sold', true),
    (NEW.id, '6000', 'Operating Expenses', 'expense', 'General business expenses', true)
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER trigger_create_default_chart_of_accounts
  AFTER INSERT ON merchants
  FOR EACH ROW
  EXECUTE FUNCTION create_default_chart_of_accounts();

-- Drop and recreate the two-parameter version of update_merchant_comprehensive_stats
DROP FUNCTION IF EXISTS update_merchant_comprehensive_stats(uuid, date);

-- Recreate it with proper search_path
CREATE OR REPLACE FUNCTION update_merchant_comprehensive_stats(
  p_merchant_id UUID,
  p_stat_date DATE DEFAULT CURRENT_DATE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_stats RECORD;
BEGIN
  SELECT
    COUNT(DISTINCT d.id) as total_deals,
    COUNT(DISTINCT CASE WHEN d.status = 'active' THEN d.id END) as active_deals,
    COUNT(DISTINCT p.id) as total_purchases,
    COALESCE(SUM(p.price), 0) as total_revenue,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(DISTINCT r.id) as total_reviews,
    COUNT(DISTINCT p.customer_id) as unique_customers
  INTO v_stats
  FROM merchants m
  LEFT JOIN deals d ON d.merchant_id = m.id
  LEFT JOIN purchases p ON p.deal_id = d.id
  LEFT JOIN reviews r ON r.merchant_id = m.id
  WHERE m.id = p_merchant_id
  AND (p_stat_date IS NULL OR DATE(p.created_at) <= p_stat_date);

  INSERT INTO merchant_comprehensive_stats (
    merchant_id,
    total_deals,
    active_deals,
    total_purchases,
    total_revenue,
    average_rating,
    total_reviews,
    unique_customers,
    last_updated
  ) VALUES (
    p_merchant_id,
    v_stats.total_deals,
    v_stats.active_deals,
    v_stats.total_purchases,
    v_stats.total_revenue,
    v_stats.average_rating,
    v_stats.total_reviews,
    v_stats.unique_customers,
    now()
  )
  ON CONFLICT (merchant_id) DO UPDATE SET
    total_deals = EXCLUDED.total_deals,
    active_deals = EXCLUDED.active_deals,
    total_purchases = EXCLUDED.total_purchases,
    total_revenue = EXCLUDED.total_revenue,
    average_rating = EXCLUDED.average_rating,
    total_reviews = EXCLUDED.total_reviews,
    unique_customers = EXCLUDED.unique_customers,
    last_updated = now();
END;
$$;
