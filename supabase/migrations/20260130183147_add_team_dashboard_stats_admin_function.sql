/*
  # Add Admin Team Dashboard Stats Function

  1. New Function
    - get_team_dashboard_stats_admin() - Returns aggregate stats for all teams
    - Similar to get_team_dashboard_stats but without team member filter
    - Used by admin users to view overall team performance

  2. Returns
    - tasks_today: count of tasks due today
    - tasks_overdue: count of overdue tasks
    - deals_to_close: count of deals to close this month
    - companies_count: total companies
    - contacts_count: total contacts
    - deals_value_cents: total value of open deals
*/

CREATE OR REPLACE FUNCTION public.get_team_dashboard_stats_admin()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result jsonb;
  v_tasks_today integer;
  v_tasks_overdue integer;
  v_deals_to_close integer;
  v_companies_count integer;
  v_contacts_count integer;
  v_deals_value_cents bigint;
BEGIN
  -- Verify caller is admin
  IF NOT EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Tasks due today across all teams
  SELECT COUNT(*) INTO v_tasks_today
  FROM crm_tasks
  WHERE status != 'completed'
    AND DATE(due_date) = CURRENT_DATE;

  -- Overdue tasks across all teams
  SELECT COUNT(*) INTO v_tasks_overdue
  FROM crm_tasks
  WHERE status != 'completed'
    AND due_date < now();

  -- Deals to close this month across all teams
  SELECT COUNT(*) INTO v_deals_to_close
  FROM crm_deals
  WHERE status = 'open'
    AND DATE_TRUNC('month', expected_close_date) = DATE_TRUNC('month', CURRENT_DATE);

  -- Total companies
  SELECT COUNT(*) INTO v_companies_count
  FROM crm_companies;

  -- Total contacts
  SELECT COUNT(*) INTO v_contacts_count
  FROM crm_contacts;

  -- Total deal value
  SELECT COALESCE(SUM(deal_value_cents), 0) INTO v_deals_value_cents
  FROM crm_deals
  WHERE status = 'open';

  v_result := jsonb_build_object(
    'tasks_today', v_tasks_today,
    'tasks_overdue', v_tasks_overdue,
    'deals_to_close', v_deals_to_close,
    'companies_count', v_companies_count,
    'contacts_count', v_contacts_count,
    'deals_value_cents', v_deals_value_cents
  );

  RETURN v_result;
END;
$$;
