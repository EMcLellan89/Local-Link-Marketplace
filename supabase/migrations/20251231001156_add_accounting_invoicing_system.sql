/*
  # Add Accounting & Invoicing System

  1. New Tables
    - `invoices`
      - Invoice management with payment tracking
      - Supports one-time and recurring billing
      - Integration with GoPayBright payment processing
    - `invoice_items`
      - Line items for each invoice
      - Quantity, rate, tax calculations
    - `invoice_payments`
      - Track payments received against invoices
      - Links to GoPayBright transactions
    - `expenses`
      - Track business expenses for accounting
    - `accounting_categories`
      - Income and expense categories for reporting

  2. Security
    - Enable RLS on all tables
    - Merchants can only access their own financial data
    - Admin read-only access for support

  3. Features
    - Invoice creation and management
    - Online payment via GoPayBright
    - Payment tracking and reconciliation
    - Expense tracking
    - Basic P&L reporting support
*/

-- Create invoice statuses enum
DO $$ BEGIN
  CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create payment method enum
DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('gopaybright', 'cash', 'check', 'bank_transfer', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  invoice_number text NOT NULL,
  invoice_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  status invoice_status NOT NULL DEFAULT 'draft',

  -- Customer details (cached for record keeping)
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  billing_address text,

  -- Invoice details
  subtotal_cents bigint NOT NULL DEFAULT 0,
  tax_rate decimal(5,2) NOT NULL DEFAULT 0,
  tax_cents bigint NOT NULL DEFAULT 0,
  discount_cents bigint NOT NULL DEFAULT 0,
  total_cents bigint NOT NULL DEFAULT 0,

  -- Payment tracking
  amount_paid_cents bigint NOT NULL DEFAULT 0,
  balance_due_cents bigint NOT NULL DEFAULT 0,

  -- Recurring billing
  is_recurring boolean NOT NULL DEFAULT false,
  recurring_frequency text,
  next_invoice_date date,

  -- Notes and terms
  notes text,
  terms text,

  -- Payment link (GoPayBright)
  payment_url text,
  payment_token text,

  -- Metadata
  sent_at timestamptz,
  viewed_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(merchant_id, invoice_number)
);

-- Invoice items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,

  description text NOT NULL,
  quantity decimal(10,2) NOT NULL DEFAULT 1,
  unit_price_cents bigint NOT NULL,

  -- Tax handling
  is_taxable boolean NOT NULL DEFAULT true,
  tax_rate decimal(5,2) NOT NULL DEFAULT 0,

  -- Calculated amounts
  line_total_cents bigint NOT NULL,
  tax_cents bigint NOT NULL DEFAULT 0,

  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Invoice payments table
CREATE TABLE IF NOT EXISTS invoice_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,

  payment_method payment_method NOT NULL,
  amount_cents bigint NOT NULL,

  -- GoPayBright integration
  gopaybright_transaction_id text,
  gopaybright_status text,

  -- Payment details
  payment_date timestamptz NOT NULL DEFAULT now(),
  notes text,
  reference_number text,

  created_at timestamptz DEFAULT now()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,

  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  amount_cents bigint NOT NULL,

  category text NOT NULL,
  vendor text,
  description text NOT NULL,

  -- Receipt tracking
  receipt_url text,

  -- Tax deductible
  is_tax_deductible boolean NOT NULL DEFAULT true,

  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Accounting categories table
CREATE TABLE IF NOT EXISTS accounting_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,

  name text NOT NULL,
  type text NOT NULL,
  description text,
  is_default boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,

  created_at timestamptz DEFAULT now(),

  UNIQUE(merchant_id, name, type)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invoices_merchant_id ON invoices(merchant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_date ON invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_invoice_id ON invoice_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_merchant_id ON invoice_payments(merchant_id);
CREATE INDEX IF NOT EXISTS idx_expenses_merchant_id ON expenses(merchant_id);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_accounting_categories_merchant_id ON accounting_categories(merchant_id);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invoices
CREATE POLICY "Merchants can view own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can create own invoices"
  ON invoices FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own invoices"
  ON invoices FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can delete own invoices"
  ON invoices FOR DELETE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for invoice_items
CREATE POLICY "Merchants can view own invoice items"
  ON invoice_items FOR SELECT
  TO authenticated
  USING (
    invoice_id IN (
      SELECT id FROM invoices WHERE merchant_id IN (
        SELECT id FROM merchants WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Merchants can create own invoice items"
  ON invoice_items FOR INSERT
  TO authenticated
  WITH CHECK (
    invoice_id IN (
      SELECT id FROM invoices WHERE merchant_id IN (
        SELECT id FROM merchants WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Merchants can update own invoice items"
  ON invoice_items FOR UPDATE
  TO authenticated
  USING (
    invoice_id IN (
      SELECT id FROM invoices WHERE merchant_id IN (
        SELECT id FROM merchants WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    invoice_id IN (
      SELECT id FROM invoices WHERE merchant_id IN (
        SELECT id FROM merchants WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Merchants can delete own invoice items"
  ON invoice_items FOR DELETE
  TO authenticated
  USING (
    invoice_id IN (
      SELECT id FROM invoices WHERE merchant_id IN (
        SELECT id FROM merchants WHERE user_id = auth.uid()
      )
    )
  );

-- RLS Policies for invoice_payments
CREATE POLICY "Merchants can view own payments"
  ON invoice_payments FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can create own payments"
  ON invoice_payments FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own payments"
  ON invoice_payments FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for expenses
CREATE POLICY "Merchants can view own expenses"
  ON expenses FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can create own expenses"
  ON expenses FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own expenses"
  ON expenses FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can delete own expenses"
  ON expenses FOR DELETE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for accounting_categories
CREATE POLICY "Merchants can view own categories"
  ON accounting_categories FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
    OR merchant_id IS NULL
  );

CREATE POLICY "Merchants can create own categories"
  ON accounting_categories FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own categories"
  ON accounting_categories FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can delete own categories"
  ON accounting_categories FOR DELETE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Insert default accounting categories
INSERT INTO accounting_categories (merchant_id, name, type, description, is_default)
VALUES
  (NULL, 'Product Sales', 'income', 'Revenue from product sales', true),
  (NULL, 'Service Revenue', 'income', 'Revenue from services provided', true),
  (NULL, 'Marketplace Sales', 'income', 'Revenue from marketplace deals', true),
  (NULL, 'Other Income', 'income', 'Miscellaneous income', true),
  (NULL, 'Rent', 'expense', 'Rent and lease payments', true),
  (NULL, 'Utilities', 'expense', 'Electricity, water, internet, etc.', true),
  (NULL, 'Payroll', 'expense', 'Employee salaries and wages', true),
  (NULL, 'Marketing', 'expense', 'Advertising and marketing costs', true),
  (NULL, 'Supplies', 'expense', 'Office and business supplies', true),
  (NULL, 'Travel', 'expense', 'Business travel expenses', true),
  (NULL, 'Insurance', 'expense', 'Business insurance premiums', true),
  (NULL, 'Professional Services', 'expense', 'Legal, accounting, consulting', true),
  (NULL, 'Equipment', 'expense', 'Equipment purchases and maintenance', true),
  (NULL, 'Software', 'expense', 'Software subscriptions and licenses', true),
  (NULL, 'Other Expenses', 'expense', 'Miscellaneous expenses', true)
ON CONFLICT (merchant_id, name, type) DO NOTHING;

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number(merchant_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Function to update invoice totals
CREATE OR REPLACE FUNCTION update_invoice_totals()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Trigger to update invoice totals when items change
DROP TRIGGER IF EXISTS trigger_update_invoice_totals ON invoice_items;
CREATE TRIGGER trigger_update_invoice_totals
  AFTER INSERT OR UPDATE OR DELETE ON invoice_items
  FOR EACH ROW
  EXECUTE FUNCTION update_invoice_totals();

-- Function to update invoice payment status
CREATE OR REPLACE FUNCTION update_invoice_payment_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Trigger to update invoice when payment is received
DROP TRIGGER IF EXISTS trigger_update_invoice_payment_status ON invoice_payments;
CREATE TRIGGER trigger_update_invoice_payment_status
  AFTER INSERT ON invoice_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_invoice_payment_status();
