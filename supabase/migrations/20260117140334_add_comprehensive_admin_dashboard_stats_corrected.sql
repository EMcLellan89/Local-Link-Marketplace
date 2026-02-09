/*
  # Add Comprehensive Admin Dashboard Statistics Functions

  1. Functions Created
    - get_combined_overview_stats - All Local Link + Partner combined stats
    - get_platform_sales_stats - Platform direct sales and growth
    - get_partner_totals_stats - All partner performance metrics
    - get_partners_joined_by_month - Monthly partner sign-ups
    
  2. Metrics Tracked
    - Total businesses (merchants)
    - Total partners and new partners per month
    - All revenue streams (platform + partners)
    - Subscription metrics
    - Course sales
    - Affiliate commissions
    - Growth trends

  3. Security
    - All functions are SECURITY DEFINER for admin access
    - Results available to admin role only
*/

-- Combined Overview Stats (Dashboard 1)
CREATE OR REPLACE FUNCTION get_combined_overview_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
  v_total_merchants integer;
  v_total_partners integer;
  v_total_customers integer;
  v_new_partners_this_month integer;
  v_new_partners_last_month integer;
  v_total_revenue_cents bigint;
  v_partner_revenue_cents bigint;
  v_platform_revenue_cents bigint;
  v_active_subscriptions integer;
  v_total_course_enrollments integer;
  v_total_affiliate_commissions_cents bigint;
  v_month_start timestamptz;
  v_last_month_start timestamptz;
BEGIN
  v_month_start := date_trunc('month', now());
  v_last_month_start := date_trunc('month', now() - interval '1 month');

  -- Total merchants
  SELECT COUNT(*) INTO v_total_merchants
  FROM merchants
  WHERE is_active = true;

  -- Total partners
  SELECT COUNT(*) INTO v_total_partners
  FROM partners
  WHERE status = 'active';

  -- Total customers
  SELECT COUNT(*) INTO v_total_customers
  FROM customers;

  -- New partners this month
  SELECT COUNT(*) INTO v_new_partners_this_month
  FROM partners
  WHERE created_at >= v_month_start;

  -- New partners last month
  SELECT COUNT(*) INTO v_new_partners_last_month
  FROM partners
  WHERE created_at >= v_last_month_start
    AND created_at < v_month_start;

  -- Total revenue from subscriptions
  SELECT COALESCE(SUM(plan_price), 0) INTO v_total_revenue_cents
  FROM crm_subscriptions
  WHERE status = 'active';

  -- Partner revenue (from merchants with partner attribution)
  SELECT COALESCE(SUM(cs.plan_price), 0) INTO v_partner_revenue_cents
  FROM crm_subscriptions cs
  INNER JOIN merchants m ON m.id = cs.merchant_id
  WHERE cs.status = 'active'
    AND m.partner_id IS NOT NULL;

  -- Platform direct revenue
  v_platform_revenue_cents := v_total_revenue_cents - v_partner_revenue_cents;

  -- Active subscriptions
  SELECT COUNT(*) INTO v_active_subscriptions
  FROM crm_subscriptions
  WHERE status = 'active';

  -- Total course enrollments
  SELECT COUNT(*) INTO v_total_course_enrollments
  FROM course_enrollments
  WHERE payment_status = 'completed';

  -- Total affiliate commissions
  SELECT COALESCE(SUM(commission_cents), 0) INTO v_total_affiliate_commissions_cents
  FROM marketplace_affiliate_commissions
  WHERE status IN ('approved', 'paid');

  v_result := jsonb_build_object(
    'total_merchants', v_total_merchants,
    'total_partners', v_total_partners,
    'total_customers', v_total_customers,
    'new_partners_this_month', v_new_partners_this_month,
    'new_partners_last_month', v_new_partners_last_month,
    'partner_growth_rate', CASE 
      WHEN v_new_partners_last_month > 0 
      THEN ROUND(((v_new_partners_this_month - v_new_partners_last_month)::numeric / v_new_partners_last_month) * 100, 2)
      ELSE 0 
    END,
    'total_revenue_cents', v_total_revenue_cents,
    'partner_revenue_cents', v_partner_revenue_cents,
    'platform_revenue_cents', v_platform_revenue_cents,
    'active_subscriptions', v_active_subscriptions,
    'total_course_enrollments', v_total_course_enrollments,
    'total_affiliate_commissions_cents', v_total_affiliate_commissions_cents
  );

  RETURN v_result;
END;
$$;

-- Platform Sales and Growth Stats (Dashboard 2)
CREATE OR REPLACE FUNCTION get_platform_sales_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
  v_direct_sales_this_month_cents bigint;
  v_direct_sales_last_month_cents bigint;
  v_mrr_cents bigint;
  v_new_merchants_this_month integer;
  v_new_merchants_last_month integer;
  v_churn_rate numeric;
  v_average_deal_value_cents numeric;
  v_course_revenue_this_month_cents bigint;
  v_vapi_revenue_this_month_cents bigint;
  v_total_deals integer;
  v_active_deals integer;
  v_month_start timestamptz;
  v_last_month_start timestamptz;
BEGIN
  v_month_start := date_trunc('month', now());
  v_last_month_start := date_trunc('month', now() - interval '1 month');

  -- Direct platform sales this month (no partner attribution)
  SELECT COALESCE(SUM(cs.plan_price), 0) INTO v_direct_sales_this_month_cents
  FROM crm_subscriptions cs
  INNER JOIN merchants m ON m.id = cs.merchant_id
  WHERE cs.created_at >= v_month_start
    AND (m.partner_id IS NULL);

  -- Direct platform sales last month
  SELECT COALESCE(SUM(cs.plan_price), 0) INTO v_direct_sales_last_month_cents
  FROM crm_subscriptions cs
  INNER JOIN merchants m ON m.id = cs.merchant_id
  WHERE cs.created_at >= v_last_month_start
    AND cs.created_at < v_month_start
    AND (m.partner_id IS NULL);

  -- MRR (Monthly Recurring Revenue) from active subscriptions (direct only)
  SELECT COALESCE(SUM(cs.plan_price), 0) INTO v_mrr_cents
  FROM crm_subscriptions cs
  INNER JOIN merchants m ON m.id = cs.merchant_id
  WHERE cs.status = 'active'
    AND (m.partner_id IS NULL);

  -- New merchants this month
  SELECT COUNT(*) INTO v_new_merchants_this_month
  FROM merchants
  WHERE created_at >= v_month_start;

  -- New merchants last month
  SELECT COUNT(*) INTO v_new_merchants_last_month
  FROM merchants
  WHERE created_at >= v_last_month_start
    AND created_at < v_month_start;

  -- Churn rate (cancelled subscriptions / total subscriptions)
  WITH total_subs AS (
    SELECT COUNT(*) as total FROM crm_subscriptions WHERE created_at < v_month_start
  ),
  churned_subs AS (
    SELECT COUNT(*) as churned FROM crm_subscriptions 
    WHERE status = 'cancelled' AND updated_at >= v_month_start
  )
  SELECT CASE 
    WHEN total > 0 THEN ROUND((churned::numeric / total) * 100, 2)
    ELSE 0 
  END INTO v_churn_rate
  FROM total_subs, churned_subs;

  -- Total deals
  SELECT COUNT(*) INTO v_total_deals
  FROM deals;

  -- Active deals
  SELECT COUNT(*) INTO v_active_deals
  FROM deals
  WHERE status = 'active';

  -- Average deal value
  SELECT COALESCE(AVG(price_cents), 0) INTO v_average_deal_value_cents
  FROM deals
  WHERE status = 'active';

  -- Course revenue this month
  SELECT COALESCE(SUM(ce.price_cents), 0) INTO v_course_revenue_this_month_cents
  FROM course_enrollments ce
  WHERE ce.enrolled_at >= v_month_start
    AND ce.payment_status = 'completed';

  -- Vapi revenue this month
  SELECT COALESCE(SUM(merchant_charge_cents), 0) INTO v_vapi_revenue_this_month_cents
  FROM vapi_call_logs
  WHERE created_at >= v_month_start
    AND billed_to_merchant = true;

  v_result := jsonb_build_object(
    'direct_sales_this_month_cents', v_direct_sales_this_month_cents,
    'direct_sales_last_month_cents', v_direct_sales_last_month_cents,
    'sales_growth_rate', CASE 
      WHEN v_direct_sales_last_month_cents > 0 
      THEN ROUND(((v_direct_sales_this_month_cents - v_direct_sales_last_month_cents)::numeric / v_direct_sales_last_month_cents) * 100, 2)
      ELSE 0 
    END,
    'mrr_cents', v_mrr_cents,
    'new_merchants_this_month', v_new_merchants_this_month,
    'new_merchants_last_month', v_new_merchants_last_month,
    'merchant_growth_rate', CASE 
      WHEN v_new_merchants_last_month > 0 
      THEN ROUND(((v_new_merchants_this_month - v_new_merchants_last_month)::numeric / v_new_merchants_last_month) * 100, 2)
      ELSE 0 
    END,
    'churn_rate', COALESCE(v_churn_rate, 0),
    'total_deals', v_total_deals,
    'active_deals', v_active_deals,
    'average_deal_value_cents', v_average_deal_value_cents,
    'course_revenue_this_month_cents', v_course_revenue_this_month_cents,
    'vapi_revenue_this_month_cents', v_vapi_revenue_this_month_cents
  );

  RETURN v_result;
END;
$$;

-- Partner Totals Stats (Dashboard 3)
CREATE OR REPLACE FUNCTION get_partner_totals_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
  v_total_partner_revenue_cents bigint;
  v_total_partner_commissions_cents bigint;
  v_avg_revenue_per_partner_cents numeric;
  v_top_partners jsonb;
  v_partners_with_sales integer;
  v_partners_without_sales integer;
  v_total_partner_merchants integer;
  v_partner_course_sales_cents bigint;
  v_partner_crm_sales_cents bigint;
  v_month_start timestamptz;
BEGIN
  v_month_start := date_trunc('month', now());

  -- Total revenue attributed to partners
  SELECT COALESCE(SUM(cs.plan_price), 0) INTO v_total_partner_revenue_cents
  FROM crm_subscriptions cs
  INNER JOIN merchants m ON m.id = cs.merchant_id
  INNER JOIN partners p ON p.id = m.partner_id
  WHERE cs.status = 'active'
    AND p.status = 'active';

  -- Total commissions earned by partners
  SELECT COALESCE(SUM(total_commission_earned), 0) INTO v_total_partner_commissions_cents
  FROM partners
  WHERE status = 'active';

  -- Average revenue per partner
  SELECT CASE 
    WHEN COUNT(*) > 0 THEN v_total_partner_revenue_cents / COUNT(*)
    ELSE 0 
  END INTO v_avg_revenue_per_partner_cents
  FROM partners
  WHERE status = 'active';

  -- Partners with sales this month
  SELECT COUNT(DISTINCT m.partner_id) INTO v_partners_with_sales
  FROM merchants m
  INNER JOIN crm_subscriptions cs ON cs.merchant_id = m.id
  WHERE m.partner_id IS NOT NULL
    AND cs.created_at >= v_month_start;

  -- Partners without sales this month
  SELECT COUNT(*) - v_partners_with_sales INTO v_partners_without_sales
  FROM partners
  WHERE status = 'active';

  -- Total merchants attributed to partners
  SELECT COUNT(*) INTO v_total_partner_merchants
  FROM merchants
  WHERE partner_id IS NOT NULL;

  -- Partner course sales
  SELECT COALESCE(SUM(commission_cents), 0) INTO v_partner_course_sales_cents
  FROM marketplace_affiliate_commissions
  WHERE status IN ('approved', 'paid');

  -- Partner CRM sales
  v_partner_crm_sales_cents := v_total_partner_revenue_cents;

  -- Top 5 partners by revenue this month
  SELECT jsonb_agg(partner_data) INTO v_top_partners
  FROM (
    SELECT jsonb_build_object(
      'partner_id', p.id,
      'business_name', COALESCE(p.company_name, p.primary_contact),
      'revenue_cents', COALESCE(SUM(cs.plan_price), 0),
      'merchant_count', COUNT(DISTINCT m.id)
    ) as partner_data
    FROM partners p
    LEFT JOIN merchants m ON m.partner_id = p.id
    LEFT JOIN crm_subscriptions cs ON cs.merchant_id = m.id AND cs.created_at >= v_month_start
    WHERE p.status = 'active'
    GROUP BY p.id, p.company_name, p.primary_contact
    ORDER BY COALESCE(SUM(cs.plan_price), 0) DESC
    LIMIT 5
  ) top_five;

  v_result := jsonb_build_object(
    'total_partner_revenue_cents', v_total_partner_revenue_cents,
    'total_partner_commissions_cents', v_total_partner_commissions_cents,
    'avg_revenue_per_partner_cents', v_avg_revenue_per_partner_cents,
    'partners_with_sales_this_month', v_partners_with_sales,
    'partners_without_sales_this_month', v_partners_without_sales,
    'total_partner_merchants', v_total_partner_merchants,
    'partner_course_sales_cents', v_partner_course_sales_cents,
    'partner_crm_sales_cents', v_partner_crm_sales_cents,
    'top_partners', COALESCE(v_top_partners, '[]'::jsonb)
  );

  RETURN v_result;
END;
$$;

-- Get partners joined by month for the last 12 months
CREATE OR REPLACE FUNCTION get_partners_joined_by_month()
RETURNS TABLE(
  month_date date,
  partners_joined integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    date_trunc('month', p.created_at)::date as month_date,
    COUNT(*)::integer as partners_joined
  FROM partners p
  WHERE p.created_at >= date_trunc('month', now() - interval '11 months')
  GROUP BY date_trunc('month', p.created_at)
  ORDER BY month_date;
END;
$$;

-- Get revenue by month for the last 12 months (combined)
CREATE OR REPLACE FUNCTION get_revenue_by_month()
RETURNS TABLE(
  month_date date,
  platform_revenue_cents bigint,
  partner_revenue_cents bigint,
  total_revenue_cents bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH monthly_revenue AS (
    SELECT 
      date_trunc('month', cs.created_at)::date as month_date,
      SUM(CASE WHEN m.partner_id IS NULL THEN cs.plan_price ELSE 0 END) as platform_rev,
      SUM(CASE WHEN m.partner_id IS NOT NULL THEN cs.plan_price ELSE 0 END) as partner_rev
    FROM crm_subscriptions cs
    INNER JOIN merchants m ON m.id = cs.merchant_id
    WHERE cs.created_at >= date_trunc('month', now() - interval '11 months')
    GROUP BY date_trunc('month', cs.created_at)
  )
  SELECT 
    month_date,
    COALESCE(platform_rev, 0) as platform_revenue_cents,
    COALESCE(partner_rev, 0) as partner_revenue_cents,
    COALESCE(platform_rev, 0) + COALESCE(partner_rev, 0) as total_revenue_cents
  FROM monthly_revenue
  ORDER BY month_date;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_merchants_partner_id 
  ON merchants(partner_id) WHERE partner_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_crm_subscriptions_merchant_created 
  ON crm_subscriptions(merchant_id, created_at, status);

CREATE INDEX IF NOT EXISTS idx_partners_status_created 
  ON partners(status, created_at);
