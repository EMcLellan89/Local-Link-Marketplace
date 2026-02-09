/*
  # Partner & Territory System

  ## Overview
  Adds comprehensive partner management, territory-first rollout, certification tracking,
  QR code system, and payout batching for global marketplace expansion.

  ## New Tables

  1. **partners** - Partner companies managing territories
     - Company info, partner type (Agency/Publisher/Media/SalesTeam)
     - Revenue share %, certification level, white-label settings
     - Status tracking (Active/Suspended/Inactive)

  2. **territories** - Geographic territories assigned to partners
     - Territory name, country, currency
     - Assignment status (Available/Assigned/Recovering/Locked)
     - Revenue tracking per territory

  3. **partner_applications** - Public application pipeline
     - Application submission data
     - Status workflow (New/Reviewing/Approved/Declined/Waitlisted)
     - Admin review notes

  4. **certifications** - Partner certification & compliance
     - Training completion percentage
     - Compliance score, violations count
     - Status (Active/Warning/Suspended/Revoked)

  5. **qr_codes** - QR code tracking with locked URLs
     - Destination locking (Deal/Territory/Category only)
     - Compliance status tracking
     - Scan analytics

  6. **transactions** - Payment transaction ledger
     - Gross amount, fees, net amount
     - Revenue split (partner share, platform share)
     - Payment status, payout status

  7. **payout_batches** - Weekly payout batching
     - Partner payout aggregation by period
     - Status (Scheduled/Processing/Paid/Held)
     - Hold reason tracking

  8. **batch_transactions** - Link transactions to batches
     - Many-to-many relationship

  9. **audit_logs** - Security & compliance audit trail
     - Actor, action, entity tracking
     - Metadata JSON storage
     - IP address logging

  10. **user_2fa** - Two-factor authentication
      - Encrypted TOTP secrets
      - Backup codes (encrypted)

  ## Security
  - RLS enabled on all tables
  - Role-based access policies
  - Encrypted sensitive data (2FA secrets)
*/

-- Partner Types
DO $$ BEGIN
  CREATE TYPE partner_type AS ENUM ('Agency', 'Publisher', 'Media', 'SalesTeam');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Partner Status
DO $$ BEGIN
  CREATE TYPE partner_status AS ENUM ('Active', 'Suspended', 'Inactive');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Territory Status
DO $$ BEGIN
  CREATE TYPE territory_status AS ENUM ('Available', 'Assigned', 'Recovering', 'Locked');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Application Status
DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('New', 'Reviewing', 'Approved', 'Declined', 'Waitlisted');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Certification Status
DO $$ BEGIN
  CREATE TYPE certification_status AS ENUM ('Active', 'Warning', 'Suspended', 'Revoked');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Certification Level
DO $$ BEGIN
  CREATE TYPE certification_level AS ENUM ('Local', 'Regional', 'National', 'Global');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Payment Status
DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('Pending', 'Authorized', 'Paid', 'Failed', 'Refunded', 'PartialRefund', 'Chargeback');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Payout Status
DO $$ BEGIN
  CREATE TYPE payout_status_type AS ENUM ('Unpaid', 'Scheduled', 'Processing', 'Paid', 'Held');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Batch Status
DO $$ BEGIN
  CREATE TYPE batch_status AS ENUM ('Scheduled', 'Processing', 'Paid', 'Held');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 1. Partners Table
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  company_name text NOT NULL,
  primary_contact text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  partner_type partner_type NOT NULL DEFAULT 'Agency',
  status partner_status NOT NULL DEFAULT 'Active',
  certification_level certification_level DEFAULT 'Local',
  rev_share_percent numeric(5,2) DEFAULT 70.00 CHECK (rev_share_percent >= 0 AND rev_share_percent <= 100),
  white_label_enabled boolean DEFAULT false,
  white_label_domain text,
  stripe_connect_id text,
  bank_account_info jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Territories Table
CREATE TABLE IF NOT EXISTS territories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  territory_name text NOT NULL,
  country_code text NOT NULL DEFAULT 'US',
  currency_code text NOT NULL DEFAULT 'USD',
  status territory_status NOT NULL DEFAULT 'Available',
  assigned_partner_id uuid REFERENCES partners(id) ON DELETE SET NULL,
  launch_date timestamptz,
  recovery_date timestamptz,
  gross_revenue_total numeric(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(territory_name, country_code)
);

-- 3. Partner Applications Table
CREATE TABLE IF NOT EXISTS partner_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  partner_type partner_type NOT NULL DEFAULT 'Agency',
  requested_territory text NOT NULL,
  current_coverage text,
  est_merchants_30d integer,
  notes text,
  status application_status NOT NULL DEFAULT 'New',
  admin_notes text,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Certifications Table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid UNIQUE NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  training_completed_percent integer DEFAULT 0 CHECK (training_completed_percent >= 0 AND training_completed_percent <= 100),
  compliance_score integer DEFAULT 100 CHECK (compliance_score >= 0 AND compliance_score <= 100),
  violations_count integer DEFAULT 0,
  status certification_status DEFAULT 'Active',
  last_review_date timestamptz,
  next_review_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. QR Codes Table
CREATE TABLE IF NOT EXISTS qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by_partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  destination_type text NOT NULL CHECK (destination_type IN ('Deal', 'Territory', 'Category')),
  destination_id uuid,
  locked_url text NOT NULL,
  compliance_status text DEFAULT 'Valid' CHECK (compliance_status IN ('Valid', 'Flagged', 'Blocked')),
  scan_count integer DEFAULT 0,
  last_scanned_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. Transactions Table (Payment Ledger)
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE SET NULL,
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE RESTRICT,
  territory_id uuid NOT NULL REFERENCES territories(id) ON DELETE RESTRICT,
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE RESTRICT,
  buyer_email text,
  gross_amount numeric(12,2) NOT NULL,
  processor_fee numeric(12,2) DEFAULT 0,
  net_amount numeric(12,2) NOT NULL,
  partner_share numeric(12,2) DEFAULT 0,
  platform_share numeric(12,2) DEFAULT 0,
  payment_status payment_status DEFAULT 'Pending',
  payout_status payout_status_type DEFAULT 'Unpaid',
  paybright_ref text,
  payment_metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 7. Payout Batches Table
CREATE TABLE IF NOT EXISTS payout_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE RESTRICT,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  total_partner_share numeric(12,2) NOT NULL,
  status batch_status DEFAULT 'Scheduled',
  hold_reason text,
  paid_at timestamptz,
  payment_ref text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 8. Batch Transactions (Join Table)
CREATE TABLE IF NOT EXISTS batch_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payout_batch_id uuid NOT NULL REFERENCES payout_batches(id) ON DELETE CASCADE,
  transaction_id uuid NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(payout_batch_id, transaction_id)
);

-- 9. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata_json jsonb DEFAULT '{}',
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- 10. User 2FA Table
CREATE TABLE IF NOT EXISTS user_2fa (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  secret_enc text NOT NULL,
  backup_codes_enc text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add is_2fa_enabled to profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_2fa_enabled'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_2fa_enabled boolean DEFAULT false;
  END IF;
END $$;

-- Add partner_id to profiles if not exists (for partner users)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'partner_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN partner_id uuid REFERENCES partners(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Update merchants table to link to partners and territories
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'merchants' AND column_name = 'partner_id'
  ) THEN
    ALTER TABLE merchants ADD COLUMN partner_id uuid REFERENCES partners(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'merchants' AND column_name = 'territory_id'
  ) THEN
    ALTER TABLE merchants ADD COLUMN territory_id uuid REFERENCES territories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Update deals table to link to partners and territories
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deals' AND column_name = 'partner_id'
  ) THEN
    ALTER TABLE deals ADD COLUMN partner_id uuid REFERENCES partners(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deals' AND column_name = 'territory_id'
  ) THEN
    ALTER TABLE deals ADD COLUMN territory_id uuid REFERENCES territories(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deals' AND column_name = 'qr_code_id'
  ) THEN
    ALTER TABLE deals ADD COLUMN qr_code_id uuid REFERENCES qr_codes(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deals' AND column_name = 'rejection_reason'
  ) THEN
    ALTER TABLE deals ADD COLUMN rejection_reason text;
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_partners_email ON partners(email);
CREATE INDEX IF NOT EXISTS idx_partners_status ON partners(status);
CREATE INDEX IF NOT EXISTS idx_territories_status ON territories(status);
CREATE INDEX IF NOT EXISTS idx_territories_partner ON territories(assigned_partner_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON partner_applications(status);
CREATE INDEX IF NOT EXISTS idx_certifications_partner ON certifications(partner_id);
CREATE INDEX IF NOT EXISTS idx_certifications_status ON certifications(status);
CREATE INDEX IF NOT EXISTS idx_qr_codes_partner ON qr_codes(created_by_partner_id);
CREATE INDEX IF NOT EXISTS idx_transactions_partner ON transactions(partner_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(payment_status, payout_status);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_payout_batches_partner ON payout_batches(partner_id);
CREATE INDEX IF NOT EXISTS idx_payout_batches_status ON payout_batches(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- Enable RLS on all tables
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_2fa ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Partners: Admins full access, partners see own record
CREATE POLICY "Admins can manage all partners"
  ON partners FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Partners can view own record"
  ON partners FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    id IN (SELECT partner_id FROM profiles WHERE id = auth.uid())
  );

-- Territories: Admins full access, partners see assigned territories
CREATE POLICY "Admins can manage territories"
  ON territories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Partners can view assigned territories"
  ON territories FOR SELECT
  TO authenticated
  USING (
    assigned_partner_id IN (
      SELECT partner_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Public can view available territories"
  ON territories FOR SELECT
  TO anon
  USING (status = 'Available');

-- Partner Applications: Public can create, admins can manage
CREATE POLICY "Anyone can submit application"
  ON partner_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage applications"
  ON partner_applications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Certifications: Admins manage, partners view own
CREATE POLICY "Admins can manage certifications"
  ON certifications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Partners can view own certification"
  ON certifications FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT partner_id FROM profiles WHERE id = auth.uid()
    )
  );

-- QR Codes: Partners manage own, public can scan (read)
CREATE POLICY "Partners can manage own QR codes"
  ON qr_codes FOR ALL
  TO authenticated
  USING (
    created_by_partner_id IN (
      SELECT partner_id FROM profiles WHERE id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Public can scan QR codes"
  ON qr_codes FOR SELECT
  TO anon, authenticated
  USING (compliance_status = 'Valid');

-- Transactions: Admins see all, partners see own
CREATE POLICY "Admins can view all transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Partners can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT partner_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Payout Batches: Admins manage, partners view own
CREATE POLICY "Admins can manage payout batches"
  ON payout_batches FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Partners can view own payouts"
  ON payout_batches FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT partner_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Batch Transactions: Follow payout batch policies
CREATE POLICY "Admins can manage batch transactions"
  ON batch_transactions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Audit Logs: Admin read-only
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- User 2FA: Users manage own
CREATE POLICY "Users can manage own 2FA"
  ON user_2fa FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_territories_updated_at BEFORE UPDATE ON territories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_applications_updated_at BEFORE UPDATE ON partner_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qr_codes_updated_at BEFORE UPDATE ON qr_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payout_batches_updated_at BEFORE UPDATE ON payout_batches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_2fa_updated_at BEFORE UPDATE ON user_2fa
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
