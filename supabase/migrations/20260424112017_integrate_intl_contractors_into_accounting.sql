/*
  # Integrate International Contractor Payments into Accounting System

  ## Summary
  Connects the international contractor payroll system to the platform's bookkeeping
  and tax reporting infrastructure. Contractor payments are recorded as deductible
  business expenses and flow into monthly P&L closes, quarterly tax estimates, and
  CPA-ready expense reports.

  ## Changes

  ### 1. New Columns
  - `intl_contractor_payments.expense_id` — FK → expenses, set when synced
  - `intl_contractor_pay_periods.expenses_synced_at` — prevents double-posting

  ### 2. Accounting Category Seed
  - Inserts 'International Contractor' expense category (name-uniqueness checked
    at application level, not via constraint)

  ### 3. Functions
  - `sync_contractor_payments_to_expenses(pay_period_id)` — posts paid contractor
    payments to the expenses table as deductible business expenses
  - `get_intl_contractor_expense_summary(year)` — quarterly breakdown for tax pages
  - `get_intl_contractor_ytd(year)` — scalar totals for dashboard stats

  ### 4. View: intl_contractor_expense_ledger
  - CPA-ready view joining payments + contractors + pay periods with all columns
    needed for end-of-year expense reporting

  ## Security
  - All functions SECURITY DEFINER with fixed search_path = public
  - expenses.merchant_id is nullable; platform-level contractor expenses have NULL merchant_id
*/

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Add linkage columns
-- ─────────────────────────────────────────────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'intl_contractor_payments' AND column_name = 'expense_id'
  ) THEN
    ALTER TABLE intl_contractor_payments
      ADD COLUMN expense_id uuid REFERENCES expenses(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'intl_contractor_pay_periods' AND column_name = 'expenses_synced_at'
  ) THEN
    ALTER TABLE intl_contractor_pay_periods
      ADD COLUMN expenses_synced_at timestamptz;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Seed the accounting category (insert only if name doesn't exist yet)
-- ─────────────────────────────────────────────────────────────────────────────

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'accounting_categories'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM accounting_categories WHERE name = 'International Contractor'
    ) THEN
      INSERT INTO accounting_categories (name, type, is_default, is_active)
      VALUES ('International Contractor', 'expense', false, true);
    END IF;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. sync_contractor_payments_to_expenses
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION sync_contractor_payments_to_expenses(p_pay_period_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_period        intl_contractor_pay_periods%ROWTYPE;
  v_payment       intl_contractor_payments%ROWTYPE;
  v_contractor    intl_contractors%ROWTYPE;
  v_expense_id    uuid;
  v_synced_count  int := 0;
BEGIN
  SELECT * INTO v_period FROM intl_contractor_pay_periods WHERE id = p_pay_period_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Pay period not found');
  END IF;

  IF v_period.status != 'paid' THEN
    RETURN jsonb_build_object('error', 'Pay period must be paid before syncing expenses');
  END IF;

  IF v_period.expenses_synced_at IS NOT NULL THEN
    RETURN jsonb_build_object('already_synced', true, 'synced_at', v_period.expenses_synced_at);
  END IF;

  FOR v_payment IN
    SELECT * FROM intl_contractor_payments
    WHERE pay_period_id = p_pay_period_id
      AND status IN ('confirmed', 'sent')
      AND expense_id IS NULL
  LOOP
    SELECT * INTO v_contractor FROM intl_contractors WHERE id = v_payment.contractor_id;

    INSERT INTO expenses (
      expense_date,
      amount_cents,
      category,
      vendor,
      description,
      is_tax_deductible,
      created_at
    ) VALUES (
      v_period.period_end,
      v_payment.amount_usd_cents,
      'International Contractor',
      COALESCE(v_contractor.full_name, 'Unknown Contractor'),
      'Contractor payment – ' || v_period.period_label
        || CASE WHEN v_payment.hours_worked IS NOT NULL
                THEN ' (' || v_payment.hours_worked || ' hrs)'
                ELSE '' END,
      true,
      now()
    )
    RETURNING id INTO v_expense_id;

    UPDATE intl_contractor_payments
    SET expense_id = v_expense_id
    WHERE id = v_payment.id;

    v_synced_count := v_synced_count + 1;
  END LOOP;

  UPDATE intl_contractor_pay_periods
  SET expenses_synced_at = now()
  WHERE id = p_pay_period_id;

  RETURN jsonb_build_object(
    'synced', v_synced_count,
    'pay_period_id', p_pay_period_id,
    'period_label', v_period.period_label
  );
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. get_intl_contractor_expense_summary
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_intl_contractor_expense_summary(p_year int DEFAULT NULL)
RETURNS TABLE (
  year_val              int,
  total_paid_usd_cents  bigint,
  q1_cents              bigint,
  q2_cents              bigint,
  q3_cents              bigint,
  q4_cents              bigint,
  contractor_count      int,
  pay_period_count      int
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_year int := COALESCE(p_year, EXTRACT(YEAR FROM now())::int);
BEGIN
  RETURN QUERY
  SELECT
    v_year,
    COALESCE(SUM(cp.amount_usd_cents), 0)::bigint,
    COALESCE(SUM(cp.amount_usd_cents) FILTER (
      WHERE EXTRACT(QUARTER FROM pp.period_end) = 1), 0)::bigint,
    COALESCE(SUM(cp.amount_usd_cents) FILTER (
      WHERE EXTRACT(QUARTER FROM pp.period_end) = 2), 0)::bigint,
    COALESCE(SUM(cp.amount_usd_cents) FILTER (
      WHERE EXTRACT(QUARTER FROM pp.period_end) = 3), 0)::bigint,
    COALESCE(SUM(cp.amount_usd_cents) FILTER (
      WHERE EXTRACT(QUARTER FROM pp.period_end) = 4), 0)::bigint,
    COUNT(DISTINCT cp.contractor_id)::int,
    COUNT(DISTINCT pp.id)::int
  FROM intl_contractor_payments cp
  JOIN intl_contractor_pay_periods pp ON pp.id = cp.pay_period_id
  WHERE pp.status IN ('approved', 'paid')
    AND EXTRACT(YEAR FROM pp.period_end) = v_year
    AND cp.status IN ('confirmed', 'sent', 'pending');
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. get_intl_contractor_ytd
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_intl_contractor_ytd(p_year int DEFAULT NULL)
RETURNS TABLE (
  ytd_contractor_expense_cents  bigint,
  active_contractor_count       int,
  pending_sync_count            int
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_year int := COALESCE(p_year, EXTRACT(YEAR FROM now())::int);
BEGIN
  RETURN QUERY
  SELECT
    COALESCE((
      SELECT SUM(cp.amount_usd_cents)
      FROM intl_contractor_payments cp
      JOIN intl_contractor_pay_periods pp ON pp.id = cp.pay_period_id
      WHERE pp.status = 'paid'
        AND EXTRACT(YEAR FROM pp.period_end) = v_year
        AND cp.status IN ('confirmed', 'sent')
    ), 0)::bigint,
    (SELECT COUNT(*)::int FROM intl_contractors WHERE status = 'active'),
    (SELECT COUNT(*)::int FROM intl_contractor_pay_periods
     WHERE status = 'paid' AND expenses_synced_at IS NULL);
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. CPA-ready expense ledger view
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW intl_contractor_expense_ledger AS
SELECT
  pp.period_end::date                                       AS expense_date,
  EXTRACT(YEAR    FROM pp.period_end)::int                  AS tax_year,
  EXTRACT(QUARTER FROM pp.period_end)::int                  AS tax_quarter,
  EXTRACT(MONTH   FROM pp.period_end)::int                  AS month,
  c.full_name                                               AS contractor_name,
  c.country                                                 AS contractor_country,
  c.role                                                    AS contractor_role,
  c.payment_method                                          AS payment_method,
  pp.period_label,
  pp.frequency,
  cp.hours_worked,
  cp.amount_usd_cents,
  ROUND(cp.amount_usd_cents / 100.0, 2)                    AS amount_usd,
  cp.local_currency_amount,
  cp.local_currency,
  cp.exchange_rate,
  cp.payment_reference,
  cp.status                                                 AS payment_status,
  pp.status                                                 AS period_status,
  pp.expenses_synced_at,
  cp.expense_id,
  cp.id                                                     AS payment_id,
  pp.id                                                     AS pay_period_id
FROM intl_contractor_payments cp
JOIN intl_contractors c ON c.id = cp.contractor_id
JOIN intl_contractor_pay_periods pp ON pp.id = cp.pay_period_id
ORDER BY pp.period_end DESC, c.full_name;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Index
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_intl_contractor_payments_expense_id
  ON intl_contractor_payments(expense_id)
  WHERE expense_id IS NOT NULL;
