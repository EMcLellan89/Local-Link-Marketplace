/*
  # Add Customer Hub & Fulfillment Center (Digital Only)
  
  Customer Hub:
  - Downloads center
  - Purchase history integration
  - Asset access tracking
  
  Fulfillment Center:
  - Digital asset library
  - Product to asset mapping
  - Post-purchase pages
  - Email templates
  
  Express Checkout toggles
*/

-- Digital Assets (downloads, course materials, etc.)
CREATE TABLE IF NOT EXISTS digital_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid,
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text CHECK (file_type IN ('pdf', 'video', 'audio', 'zip', 'image', 'document')),
  file_size_bytes bigint,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_digital_assets_org ON digital_assets(org_id);
CREATE INDEX IF NOT EXISTS idx_digital_assets_active ON digital_assets(is_active);

-- Product to Asset Access Rules  
CREATE TABLE IF NOT EXISTS product_asset_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug text NOT NULL,
  asset_id uuid NOT NULL REFERENCES digital_assets(id) ON DELETE CASCADE,
  grant_timing text NOT NULL DEFAULT 'immediate' CHECK (grant_timing IN ('immediate', 'after_payment', 'after_completion')),
  access_duration_days integer, -- null = lifetime access
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(product_slug, asset_id)
);

CREATE INDEX IF NOT EXISTS idx_product_asset_product ON product_asset_access(product_slug);
CREATE INDEX IF NOT EXISTS idx_product_asset_asset ON product_asset_access(asset_id);

-- Customer Asset Grants (what customers have access to)
CREATE TABLE IF NOT EXISTS customer_asset_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_id uuid NOT NULL REFERENCES digital_assets(id) ON DELETE CASCADE,
  order_id uuid,
  granted_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  download_count integer NOT NULL DEFAULT 0,
  last_accessed_at timestamptz,
  UNIQUE(user_id, asset_id)
);

CREATE INDEX IF NOT EXISTS idx_customer_grants_user ON customer_asset_grants(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_grants_asset ON customer_asset_grants(asset_id);

-- Post-Purchase Pages (Thank You, Next Steps)
CREATE TABLE IF NOT EXISTS post_purchase_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid,
  product_slug text, -- null = default for all products
  page_type text NOT NULL CHECK (page_type IN ('thank_you', 'access_instructions', 'next_steps')),
  title text NOT NULL,
  content text NOT NULL,
  show_download_links boolean NOT NULL DEFAULT true,
  show_course_access boolean NOT NULL DEFAULT true,
  redirect_url text,
  redirect_delay_seconds integer,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_post_purchase_org ON post_purchase_pages(org_id);
CREATE INDEX IF NOT EXISTS idx_post_purchase_product ON post_purchase_pages(product_slug);

-- Email Templates (Receipt, Access, Welcome)
CREATE TABLE IF NOT EXISTS fulfillment_email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid,
  template_type text NOT NULL CHECK (template_type IN ('receipt', 'access', 'welcome', 'course_enrollment', 'download_ready')),
  product_slug text, -- null = default for all
  subject_line text NOT NULL,
  body_html text NOT NULL,
  body_text text NOT NULL,
  include_receipt boolean NOT NULL DEFAULT true,
  include_download_links boolean NOT NULL DEFAULT false,
  include_course_access boolean NOT NULL DEFAULT false,
  send_delay_minutes integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fulfillment_templates_org ON fulfillment_email_templates(org_id);
CREATE INDEX IF NOT EXISTS idx_fulfillment_templates_type ON fulfillment_email_templates(template_type);

-- RLS Policies
ALTER TABLE digital_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_asset_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_asset_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_purchase_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE fulfillment_email_templates ENABLE ROW LEVEL SECURITY;

-- Customers see their own grants
DROP POLICY IF EXISTS customer_grants_own ON customer_asset_grants;
CREATE POLICY customer_grants_own ON customer_asset_grants
  FOR SELECT
  USING (user_id = auth.uid());

-- Customers see assets they have access to
DROP POLICY IF EXISTS customer_assets_granted ON digital_assets;
CREATE POLICY customer_assets_granted ON digital_assets
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM customer_asset_grants
      WHERE customer_asset_grants.asset_id = digital_assets.id
        AND customer_asset_grants.user_id = auth.uid()
    )
  );

-- Admin can manage everything
DROP POLICY IF EXISTS admin_digital_assets_all ON digital_assets;
CREATE POLICY admin_digital_assets_all ON digital_assets
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS admin_post_purchase_all ON post_purchase_pages;
CREATE POLICY admin_post_purchase_all ON post_purchase_pages
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS admin_fulfillment_templates_all ON fulfillment_email_templates;
CREATE POLICY admin_fulfillment_templates_all ON fulfillment_email_templates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS admin_product_asset_all ON product_asset_access;
CREATE POLICY admin_product_asset_all ON product_asset_access
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

COMMENT ON TABLE digital_assets IS 'Digital assets for fulfillment - NO PHYSICAL PRODUCTS EVER';
COMMENT ON TABLE customer_asset_grants IS 'Customer access to digital downloads and course materials';
COMMENT ON TABLE post_purchase_pages IS 'Post-purchase experience pages';
COMMENT ON TABLE fulfillment_email_templates IS 'Automated email templates for fulfillment';
