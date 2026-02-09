/*
  # Fix Critical Security Issues - Part 5: Fix Function Search Paths
  
  1. Sets immutable search_path for all functions to prevent security vulnerabilities
  2. Affects functions:
     - generate_partner_referral_code
     - create_customer_for_profile
     - get_my_credit_balance
     - create_customer_or_merchant_for_profile
     - create_default_chart_of_accounts
     - update_merchant_comprehensive_stats
     - check_referral_completion
*/

-- Fix generate_partner_referral_code
CREATE OR REPLACE FUNCTION generate_partner_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    SELECT EXISTS (
      SELECT 1 FROM partners WHERE referral_code = code
    ) INTO code_exists;
    
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Fix create_customer_for_profile
CREATE OR REPLACE FUNCTION create_customer_for_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.role = 'customer' THEN
    INSERT INTO customers (id, user_id, points_balance)
    VALUES (gen_random_uuid(), NEW.id, 0)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Fix get_my_credit_balance
CREATE OR REPLACE FUNCTION get_my_credit_balance()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  balance INTEGER;
BEGIN
  SELECT COALESCE(SUM(credits), 0)
  INTO balance
  FROM credit_ledger
  WHERE user_id = auth.uid();
  
  RETURN balance;
END;
$$;

-- Fix create_customer_or_merchant_for_profile
CREATE OR REPLACE FUNCTION create_customer_or_merchant_for_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.role = 'customer' THEN
    INSERT INTO customers (id, user_id, points_balance)
    VALUES (gen_random_uuid(), NEW.id, 0)
    ON CONFLICT (user_id) DO NOTHING;
  ELSIF NEW.role = 'merchant' THEN
    INSERT INTO merchants (id, user_id, business_name, status)
    VALUES (gen_random_uuid(), NEW.id, COALESCE(NEW.full_name, 'New Business'), 'pending')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Fix create_default_chart_of_accounts
CREATE OR REPLACE FUNCTION create_default_chart_of_accounts(p_merchant_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO accounting_chart_of_accounts (merchant_id, account_number, account_name, account_type, description, is_active)
  VALUES
    (p_merchant_id, '1000', 'Cash', 'asset', 'Cash and cash equivalents', true),
    (p_merchant_id, '1200', 'Accounts Receivable', 'asset', 'Money owed by customers', true),
    (p_merchant_id, '1500', 'Inventory', 'asset', 'Inventory on hand', true),
    (p_merchant_id, '2000', 'Accounts Payable', 'liability', 'Money owed to suppliers', true),
    (p_merchant_id, '2500', 'Sales Tax Payable', 'liability', 'Sales tax collected', true),
    (p_merchant_id, '3000', 'Owner Equity', 'equity', 'Owner investment and retained earnings', true),
    (p_merchant_id, '4000', 'Sales Revenue', 'revenue', 'Sales income', true),
    (p_merchant_id, '5000', 'Cost of Goods Sold', 'expense', 'Direct costs of products sold', true),
    (p_merchant_id, '6000', 'Operating Expenses', 'expense', 'General business expenses', true)
  ON CONFLICT DO NOTHING;
END;
$$;

-- Fix update_merchant_comprehensive_stats
CREATE OR REPLACE FUNCTION update_merchant_comprehensive_stats(p_merchant_id UUID)
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
  WHERE m.id = p_merchant_id;

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

-- Fix check_referral_completion
CREATE OR REPLACE FUNCTION check_referral_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.status = 'active' AND OLD.status != 'active' THEN
    UPDATE partner_referrals
    SET 
      status = 'completed',
      completed_at = now()
    WHERE merchant_id = NEW.id
    AND status = 'pending';
  END IF;
  
  RETURN NEW;
END;
$$;
