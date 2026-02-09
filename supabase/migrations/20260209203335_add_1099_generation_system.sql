/*
  # Add 1099 Generation System

  1. New Tables
    - `partner_1099_documents`
      - `id` (uuid, primary key)
      - `partner_id` (uuid, references partners)
      - `tax_year` (integer, the tax year for this 1099)
      - `form_type` (text, typically '1099-NEC')
      - `total_compensation` (numeric, box 1 - nonemployee compensation)
      - `federal_tax_withheld` (numeric, box 4)
      - `state_tax_withheld` (numeric, box 5)
      - `state_id` (text, state for tax purposes)
      - `w9_document_id` (uuid, references partner_w9_documents)
      - `generated_at` (timestamptz)
      - `generated_by` (uuid, admin user who generated it)
      - `document_url` (text, S3 or storage URL for PDF)
      - `status` (text: 'draft', 'generated', 'sent', 'filed')
      - `sent_at` (timestamptz)
      - `filed_at` (timestamptz)
      - `notes` (text)

    - `partner_1099_corrections`
      - Track amended 1099s if corrections are needed
      - Links to original 1099 and provides correction data

  2. Security
    - Enable RLS on all tables
    - Admin-only access for generating and viewing 1099s
    - Partners can view their own 1099s once sent

  3. Functions
    - `get_partners_eligible_for_1099(tax_year)` - Returns partners who earned $600+
    - `calculate_partner_1099_amount(partner_id, tax_year)` - Calculates total compensation
    - `generate_1099_batch(tax_year)` - Generates 1099s for all eligible partners
    - `get_1099_data(1099_id)` - Gets formatted data for PDF generation
*/

-- Create 1099 documents table
CREATE TABLE IF NOT EXISTS partner_1099_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  tax_year integer NOT NULL,
  form_type text NOT NULL DEFAULT '1099-NEC',
  total_compensation numeric(10, 2) NOT NULL,
  federal_tax_withheld numeric(10, 2) DEFAULT 0,
  state_tax_withheld numeric(10, 2) DEFAULT 0,
  state_id text,
  w9_document_id uuid REFERENCES partner_w9_documents(id),
  generated_at timestamptz DEFAULT now(),
  generated_by uuid REFERENCES profiles(id),
  document_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'sent', 'filed', 'corrected')),
  sent_at timestamptz,
  filed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, tax_year, form_type)
);

-- Create 1099 corrections table
CREATE TABLE IF NOT EXISTS partner_1099_corrections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_1099_id uuid NOT NULL REFERENCES partner_1099_documents(id) ON DELETE CASCADE,
  corrected_1099_id uuid NOT NULL REFERENCES partner_1099_documents(id) ON DELETE CASCADE,
  correction_reason text NOT NULL,
  corrected_at timestamptz DEFAULT now(),
  corrected_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_partner_1099_partner_id ON partner_1099_documents(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_1099_tax_year ON partner_1099_documents(tax_year);
CREATE INDEX IF NOT EXISTS idx_partner_1099_status ON partner_1099_documents(status);
CREATE INDEX IF NOT EXISTS idx_partner_1099_w9_document_id ON partner_1099_documents(w9_document_id);

-- Enable RLS
ALTER TABLE partner_1099_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_1099_corrections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partner_1099_documents

-- Admins can do everything
CREATE POLICY "Admins can manage all 1099s"
  ON partner_1099_documents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Partners can view their own sent/filed 1099s
CREATE POLICY "Partners can view own sent 1099s"
  ON partner_1099_documents
  FOR SELECT
  TO authenticated
  USING (
    partner_id = auth.uid()
    AND status IN ('sent', 'filed')
  );

-- RLS Policies for partner_1099_corrections
CREATE POLICY "Admins can manage all 1099 corrections"
  ON partner_1099_corrections
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to get partners eligible for 1099
CREATE OR REPLACE FUNCTION get_partners_eligible_for_1099(p_tax_year integer)
RETURNS TABLE (
  partner_id uuid,
  partner_email text,
  partner_name text,
  business_name text,
  total_compensation numeric,
  has_w9 boolean,
  w9_document_id uuid,
  w9_status text,
  has_1099 boolean,
  status_1099 text
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS partner_id,
    p.email AS partner_email,
    p.full_name AS partner_name,
    w9.business_name,
    COALESCE(SUM(c.amount), 0) AS total_compensation,
    (w9.id IS NOT NULL AND w9.status = 'completed') AS has_w9,
    w9.id AS w9_document_id,
    w9.status AS w9_status,
    (doc.id IS NOT NULL) AS has_1099,
    doc.status AS status_1099
  FROM partners p
  LEFT JOIN partner_w9_documents w9 ON w9.partner_id = p.id AND w9.status = 'completed'
  LEFT JOIN affiliate_commissions c ON c.partner_id = p.id
    AND c.status = 'paid'
    AND EXTRACT(YEAR FROM c.paid_at) = p_tax_year
  LEFT JOIN partner_1099_documents doc ON doc.partner_id = p.id AND doc.tax_year = p_tax_year
  WHERE p.deleted_at IS NULL
  GROUP BY p.id, p.email, p.full_name, w9.id, w9.business_name, w9.status, doc.id, doc.status
  HAVING COALESCE(SUM(c.amount), 0) >= 600
  ORDER BY total_compensation DESC;
END;
$$;

-- Function to calculate exact 1099 amount for a partner
CREATE OR REPLACE FUNCTION calculate_partner_1099_amount(
  p_partner_id uuid,
  p_tax_year integer
)
RETURNS numeric
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_total numeric;
BEGIN
  SELECT COALESCE(SUM(amount), 0)
  INTO v_total
  FROM affiliate_commissions
  WHERE partner_id = p_partner_id
    AND status = 'paid'
    AND EXTRACT(YEAR FROM paid_at) = p_tax_year;

  RETURN v_total;
END;
$$;

-- Function to generate 1099 batch for all eligible partners
CREATE OR REPLACE FUNCTION generate_1099_batch(
  p_tax_year integer,
  p_generated_by uuid
)
RETURNS TABLE (
  partner_id uuid,
  partner_name text,
  total_compensation numeric,
  status text,
  message text
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_partner RECORD;
  v_1099_id uuid;
BEGIN
  -- Validate that the user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = p_generated_by
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can generate 1099 batches';
  END IF;

  -- Loop through eligible partners
  FOR v_partner IN
    SELECT * FROM get_partners_eligible_for_1099(p_tax_year)
    WHERE has_w9 = true AND has_1099 = false
  LOOP
    BEGIN
      -- Insert 1099 record
      INSERT INTO partner_1099_documents (
        partner_id,
        tax_year,
        form_type,
        total_compensation,
        w9_document_id,
        generated_by,
        status
      ) VALUES (
        v_partner.partner_id,
        p_tax_year,
        '1099-NEC',
        v_partner.total_compensation,
        v_partner.w9_document_id,
        p_generated_by,
        'generated'
      )
      RETURNING id INTO v_1099_id;

      RETURN QUERY SELECT
        v_partner.partner_id,
        v_partner.partner_name,
        v_partner.total_compensation,
        'success'::text,
        'Generated 1099-NEC'::text;

    EXCEPTION WHEN OTHERS THEN
      RETURN QUERY SELECT
        v_partner.partner_id,
        v_partner.partner_name,
        v_partner.total_compensation,
        'error'::text,
        SQLERRM::text;
    END;
  END LOOP;
END;
$$;

-- Function to get 1099 data for PDF generation
CREATE OR REPLACE FUNCTION get_1099_data(p_1099_id uuid)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_data jsonb;
BEGIN
  SELECT jsonb_build_object(
    '1099_id', doc.id,
    'tax_year', doc.tax_year,
    'form_type', doc.form_type,
    'total_compensation', doc.total_compensation,
    'federal_tax_withheld', doc.federal_tax_withheld,
    'state_tax_withheld', doc.state_tax_withheld,
    'state_id', doc.state_id,
    'partner', jsonb_build_object(
      'id', p.id,
      'name', p.full_name,
      'email', p.email,
      'business_name', w9.business_name,
      'address', w9.address,
      'tax_classification', w9.tax_classification,
      'ssn_or_ein', w9.ssn_or_ein
    ),
    'payer', jsonb_build_object(
      'name', 'LocalLink Marketplace LLC',
      'address', '123 Business Street',
      'city_state_zip', 'Los Angeles, CA 90001',
      'phone', '(555) 123-4567',
      'ein', '12-3456789'
    ),
    'generated_at', doc.generated_at,
    'status', doc.status
  )
  INTO v_data
  FROM partner_1099_documents doc
  JOIN partners p ON p.id = doc.partner_id
  LEFT JOIN partner_w9_documents w9 ON w9.id = doc.w9_document_id
  WHERE doc.id = p_1099_id;

  RETURN v_data;
END;
$$;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_partner_1099_documents_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER partner_1099_documents_updated_at
  BEFORE UPDATE ON partner_1099_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_partner_1099_documents_updated_at();
