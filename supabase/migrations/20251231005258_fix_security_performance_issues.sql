/*
  # Fix Security and Performance Issues

  1. Add Missing Foreign Key Indexes
    - Add indexes for all unindexed foreign keys in accounting tables
    - Improves query performance significantly

  2. Optimize RLS Policies
    - Replace auth.uid() with (select auth.uid()) to prevent re-evaluation per row
    - Dramatically improves query performance at scale

  3. Fix Function Security
    - Set search_path for security definer functions to prevent search path attacks
*/

-- ============================================================================
-- 1. ADD MISSING FOREIGN KEY INDEXES
-- ============================================================================

-- Accounting bills indexes
CREATE INDEX IF NOT EXISTS idx_accounting_bills_journal_entry_id 
  ON accounting_bills(journal_entry_id);

-- Accounting chart of accounts indexes
CREATE INDEX IF NOT EXISTS idx_accounting_chart_of_accounts_parent_account_id 
  ON accounting_chart_of_accounts(parent_account_id);

-- Accounting invoices indexes
CREATE INDEX IF NOT EXISTS idx_accounting_invoices_journal_entry_id 
  ON accounting_invoices(journal_entry_id);

-- Accounting journal entries indexes
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_created_by 
  ON accounting_journal_entries(created_by);

CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_posted_by 
  ON accounting_journal_entries(posted_by);

-- Accounting payments indexes
CREATE INDEX IF NOT EXISTS idx_accounting_payments_customer_id 
  ON accounting_payments(customer_id);

CREATE INDEX IF NOT EXISTS idx_accounting_payments_deposit_account_id 
  ON accounting_payments(deposit_account_id);

CREATE INDEX IF NOT EXISTS idx_accounting_payments_journal_entry_id 
  ON accounting_payments(journal_entry_id);

-- Accounting payroll indexes
CREATE INDEX IF NOT EXISTS idx_accounting_payroll_journal_entry_id 
  ON accounting_payroll(journal_entry_id);

-- Accounting reconciliations indexes
CREATE INDEX IF NOT EXISTS idx_accounting_reconciliations_reconciled_by 
  ON accounting_reconciliations(reconciled_by);

-- Accounting transactions indexes
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_account_id 
  ON accounting_transactions(account_id);

CREATE INDEX IF NOT EXISTS idx_accounting_transactions_journal_entry_id 
  ON accounting_transactions(journal_entry_id);

-- ============================================================================
-- 2. OPTIMIZE RLS POLICIES - INVOICING TABLES
-- ============================================================================

-- Drop and recreate invoices policies with optimized auth.uid() calls
DROP POLICY IF EXISTS "Merchants can view own invoices" ON invoices;
DROP POLICY IF EXISTS "Merchants can create own invoices" ON invoices;
DROP POLICY IF EXISTS "Merchants can update own invoices" ON invoices;
DROP POLICY IF EXISTS "Merchants can delete own invoices" ON invoices;

CREATE POLICY "Merchants can view own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can create own invoices"
  ON invoices FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update own invoices"
  ON invoices FOR UPDATE
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

CREATE POLICY "Merchants can delete own invoices"
  ON invoices FOR DELETE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate invoice_items policies
DROP POLICY IF EXISTS "Merchants can view own invoice items" ON invoice_items;
DROP POLICY IF EXISTS "Merchants can create own invoice items" ON invoice_items;
DROP POLICY IF EXISTS "Merchants can update own invoice items" ON invoice_items;
DROP POLICY IF EXISTS "Merchants can delete own invoice items" ON invoice_items;

CREATE POLICY "Merchants can view own invoice items"
  ON invoice_items FOR SELECT
  TO authenticated
  USING (
    invoice_id IN (
      SELECT id FROM invoices WHERE merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    )
  );

CREATE POLICY "Merchants can create own invoice items"
  ON invoice_items FOR INSERT
  TO authenticated
  WITH CHECK (
    invoice_id IN (
      SELECT id FROM invoices WHERE merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    )
  );

CREATE POLICY "Merchants can update own invoice items"
  ON invoice_items FOR UPDATE
  TO authenticated
  USING (
    invoice_id IN (
      SELECT id FROM invoices WHERE merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    )
  )
  WITH CHECK (
    invoice_id IN (
      SELECT id FROM invoices WHERE merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    )
  );

CREATE POLICY "Merchants can delete own invoice items"
  ON invoice_items FOR DELETE
  TO authenticated
  USING (
    invoice_id IN (
      SELECT id FROM invoices WHERE merchant_id IN (
        SELECT id FROM merchants WHERE user_id = (select auth.uid())
      )
    )
  );

-- Drop and recreate invoice_payments policies
DROP POLICY IF EXISTS "Merchants can view own payments" ON invoice_payments;
DROP POLICY IF EXISTS "Merchants can create own payments" ON invoice_payments;
DROP POLICY IF EXISTS "Merchants can update own payments" ON invoice_payments;

CREATE POLICY "Merchants can view own payments"
  ON invoice_payments FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can create own payments"
  ON invoice_payments FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update own payments"
  ON invoice_payments FOR UPDATE
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

-- Drop and recreate expenses policies
DROP POLICY IF EXISTS "Merchants can view own expenses" ON expenses;
DROP POLICY IF EXISTS "Merchants can create own expenses" ON expenses;
DROP POLICY IF EXISTS "Merchants can update own expenses" ON expenses;
DROP POLICY IF EXISTS "Merchants can delete own expenses" ON expenses;

CREATE POLICY "Merchants can view own expenses"
  ON expenses FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can create own expenses"
  ON expenses FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update own expenses"
  ON expenses FOR UPDATE
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

CREATE POLICY "Merchants can delete own expenses"
  ON expenses FOR DELETE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- Drop and recreate accounting_categories policies
DROP POLICY IF EXISTS "Merchants can view own categories" ON accounting_categories;
DROP POLICY IF EXISTS "Merchants can create own categories" ON accounting_categories;
DROP POLICY IF EXISTS "Merchants can update own categories" ON accounting_categories;
DROP POLICY IF EXISTS "Merchants can delete own categories" ON accounting_categories;

CREATE POLICY "Merchants can view own categories"
  ON accounting_categories FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
    OR merchant_id IS NULL
  );

CREATE POLICY "Merchants can create own categories"
  ON accounting_categories FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update own categories"
  ON accounting_categories FOR UPDATE
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

CREATE POLICY "Merchants can delete own categories"
  ON accounting_categories FOR DELETE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = (select auth.uid())
    )
  );

-- ============================================================================
-- 3. FIX FUNCTION SECURITY - SET IMMUTABLE SEARCH PATH
-- ============================================================================

-- Fix generate_invoice_number function
CREATE OR REPLACE FUNCTION generate_invoice_number(merchant_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  next_number integer;
  invoice_num text;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM '[0-9]+$') AS integer)), 0) + 1
  INTO next_number
  FROM invoices
  WHERE merchant_id = merchant_uuid
  AND invoice_number ~ '^INV-[0-9]+$';

  invoice_num := 'INV-' || LPAD(next_number::text, 5, '0');

  RETURN invoice_num;
END;
$$;

-- Fix update_invoice_totals function
CREATE OR REPLACE FUNCTION update_invoice_totals()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  invoice_subtotal bigint;
  invoice_tax bigint;
  invoice_total bigint;
BEGIN
  SELECT
    COALESCE(SUM(line_total_cents), 0),
    COALESCE(SUM(tax_cents), 0)
  INTO invoice_subtotal, invoice_tax
  FROM invoice_items
  WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id);

  invoice_total := invoice_subtotal + invoice_tax;

  UPDATE invoices
  SET
    subtotal_cents = invoice_subtotal,
    tax_cents = invoice_tax,
    total_cents = invoice_total - COALESCE(discount_cents, 0),
    balance_due_cents = invoice_total - COALESCE(discount_cents, 0) - COALESCE(amount_paid_cents, 0),
    updated_at = now()
  WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Fix update_invoice_payment_status function
CREATE OR REPLACE FUNCTION update_invoice_payment_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  total_paid bigint;
  invoice_total bigint;
BEGIN
  SELECT COALESCE(SUM(amount_cents), 0)
  INTO total_paid
  FROM invoice_payments
  WHERE invoice_id = NEW.invoice_id;

  SELECT total_cents INTO invoice_total
  FROM invoices
  WHERE id = NEW.invoice_id;

  UPDATE invoices
  SET
    amount_paid_cents = total_paid,
    balance_due_cents = invoice_total - total_paid,
    status = CASE
      WHEN total_paid >= invoice_total THEN 'paid'::invoice_status
      WHEN status = 'draft' THEN 'sent'::invoice_status
      ELSE status
    END,
    paid_at = CASE
      WHEN total_paid >= invoice_total AND paid_at IS NULL THEN now()
      ELSE paid_at
    END,
    updated_at = now()
  WHERE id = NEW.invoice_id;

  RETURN NEW;
END;
$$;
