/*
  # Add Website Templates Table

  1. New Tables
    - `website_templates`
      - `id` (uuid, primary key)
      - `industry` (text) - Industry category
      - `name` (text) - Template name
      - `description` (text) - Template description
      - `preview_image_url` (text) - URL to preview image
      - `features` (jsonb) - Array of features
      - `price_cents` (integer) - Price in cents
      - `is_active` (boolean) - Whether template is available
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Updates
    - Add `template_id` column to `website_orders` table

  3. Security
    - Enable RLS on website_templates
    - Anyone can view active templates
    - Admins can manage templates
*/

-- Create website_templates table
CREATE TABLE IF NOT EXISTS website_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  industry text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  preview_image_url text,
  features jsonb DEFAULT '[]'::jsonb,
  price_cents integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add template_id column to website_orders if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'website_orders' AND column_name = 'template_id'
  ) THEN
    ALTER TABLE website_orders ADD COLUMN template_id uuid REFERENCES website_templates(id);
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_website_templates_industry ON website_templates(industry);
CREATE INDEX IF NOT EXISTS idx_website_templates_active ON website_templates(is_active);

-- Enable RLS
ALTER TABLE website_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for website_templates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'website_templates' AND policyname = 'Anyone can view active templates'
  ) THEN
    CREATE POLICY "Anyone can view active templates"
      ON website_templates FOR SELECT
      USING (is_active = true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'website_templates' AND policyname = 'Admins can manage templates'
  ) THEN
    CREATE POLICY "Admins can manage templates"
      ON website_templates FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Insert sample website templates (4 per industry)
INSERT INTO website_templates (industry, name, description, preview_image_url, features, price_cents) VALUES
-- Restaurant & Cafe templates
('Restaurant & Cafe', 'Modern Bistro', 'Clean, contemporary design perfect for upscale dining', 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800', '["Full menu display", "Online reservation form", "Photo gallery", "Location map", "Hours & contact", "Mobile optimized"]'::jsonb, 0),
('Restaurant & Cafe', 'Cozy Cafe', 'Warm, inviting layout ideal for coffee shops', 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800', '["Menu showcase", "Daily specials section", "Contact form", "Social media links", "About us page", "Mobile friendly"]'::jsonb, 0),
('Restaurant & Cafe', 'Fast Casual', 'Quick-service restaurant with ordering focus', 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=800', '["Menu with prices", "Order inquiry form", "Location finder", "Delivery info", "Nutrition facts", "Responsive design"]'::jsonb, 0),
('Restaurant & Cafe', 'Fine Dining', 'Elegant, sophisticated design for premium establishments', 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=800', '["Chef menu", "Reservation system", "Wine list", "Private events", "Press & awards", "Premium design"]'::jsonb, 0),

-- Professional Services templates
('Professional Services', 'Legal Pro', 'Professional layout for law firms and attorneys', 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg?auto=compress&cs=tinysrgb&w=800', '["Practice areas", "Attorney profiles", "Case studies", "Contact form", "Consultation booking", "Secure & professional"]'::jsonb, 0),
('Professional Services', 'Consulting Expert', 'Modern design for business consultants', 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800', '["Services overview", "Client testimonials", "Blog section", "Meeting scheduler", "Resources library", "Mobile ready"]'::jsonb, 0),
('Professional Services', 'Financial Advisor', 'Trust-building design for financial services', 'https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg?auto=compress&cs=tinysrgb&w=800', '["Service packages", "Team bios", "Market insights", "Contact system", "Appointment booking", "Professional look"]'::jsonb, 0),
('Professional Services', 'Creative Agency', 'Bold, modern layout for agencies and studios', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800', '["Portfolio gallery", "Service list", "Client logos", "Contact form", "Case studies", "Eye-catching design"]'::jsonb, 0),

-- Retail & E-commerce templates
('Retail & E-commerce', 'Boutique Shop', 'Stylish design for fashion and retail', 'https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?auto=compress&cs=tinysrgb&w=800', '["Product gallery", "Categories", "About page", "Contact form", "Store location", "Shopping-focused"]'::jsonb, 0),
('Retail & E-commerce', 'Artisan Market', 'Handcrafted feel for local makers', 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=800', '["Product showcase", "Story section", "Craft process", "Contact details", "Market hours", "Authentic design"]'::jsonb, 0),
('Retail & E-commerce', 'Tech Store', 'Modern layout for electronics and gadgets', 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800', '["Product catalog", "Specs display", "Tech support", "Contact form", "Location info", "Clean & modern"]'::jsonb, 0),
('Retail & E-commerce', 'Gift Shop', 'Friendly, inviting design for gift stores', 'https://images.pexels.com/photos/3290068/pexels-photo-3290068.jpeg?auto=compress&cs=tinysrgb&w=800', '["Product grid", "Gift guides", "Special occasions", "Contact form", "Store info", "Warm & welcoming"]'::jsonb, 0),

-- Health & Wellness templates
('Health & Wellness', 'Medical Practice', 'Professional healthcare provider layout', 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800', '["Services offered", "Doctor profiles", "Appointment booking", "Insurance info", "Patient forms", "HIPAA compliant"]'::jsonb, 0),
('Health & Wellness', 'Spa & Wellness', 'Calm, relaxing design for spas', 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800', '["Treatment menu", "Pricing", "Booking system", "Gift certificates", "Gallery", "Serene design"]'::jsonb, 0),
('Health & Wellness', 'Fitness Studio', 'Energetic layout for gyms and studios', 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=800', '["Class schedule", "Trainer bios", "Membership plans", "Contact form", "Facility photos", "Dynamic design"]'::jsonb, 0),
('Health & Wellness', 'Holistic Healer', 'Natural, peaceful design for alternative medicine', 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=800', '["Services menu", "Philosophy", "Testimonials", "Booking form", "Resources", "Calming aesthetic"]'::jsonb, 0)
ON CONFLICT DO NOTHING;
