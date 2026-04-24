/*
  # Fix Security Definer View: intl_contractor_expense_ledger

  ## Problem
  The view `public.intl_contractor_expense_ledger` was created with SECURITY DEFINER
  semantics, which causes it to execute with the privileges of the view owner rather
  than the querying user. This bypasses RLS policies on the underlying tables and is
  a security risk.

  ## Fix
  Recreate the view with SECURITY INVOKER (the default and secure behavior), so that
  row-level security on `intl_contractors`, `intl_contractor_payments`, and
  `intl_contractor_pay_periods` is enforced for whoever queries the view.
*/

DROP VIEW IF EXISTS public.intl_contractor_expense_ledger;

CREATE VIEW public.intl_contractor_expense_ledger
  WITH (security_invoker = true)
AS
SELECT
  pp.period_end                                         AS expense_date,
  EXTRACT(year    FROM pp.period_end)::integer          AS tax_year,
  EXTRACT(quarter FROM pp.period_end)::integer          AS tax_quarter,
  EXTRACT(month   FROM pp.period_end)::integer          AS month,
  c.full_name                                           AS contractor_name,
  c.country                                             AS contractor_country,
  c.role                                                AS contractor_role,
  c.payment_method,
  pp.period_label,
  pp.frequency,
  cp.hours_worked,
  cp.amount_usd_cents,
  ROUND((cp.amount_usd_cents::numeric / 100.0), 2)      AS amount_usd,
  cp.local_currency_amount,
  cp.local_currency,
  cp.exchange_rate,
  cp.payment_reference,
  cp.status                                             AS payment_status,
  pp.status                                             AS period_status,
  pp.expenses_synced_at,
  cp.expense_id,
  cp.id                                                 AS payment_id,
  pp.id                                                 AS pay_period_id
FROM intl_contractor_payments  cp
JOIN intl_contractors           c  ON c.id  = cp.contractor_id
JOIN intl_contractor_pay_periods pp ON pp.id = cp.pay_period_id
ORDER BY pp.period_end DESC, c.full_name;
