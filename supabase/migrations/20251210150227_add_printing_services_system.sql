/*
  # Add Printing Services System

  1. New Tables
    - `printing_products`
      - `id` (uuid, primary key)
      - `category` (text) - Product category (business_cards, flyers, brochures, etc.)
      - `name` (text) - Product name
      - `description` (text) - Product description
      - `stock_type` (text) - Paper stock type
      - `size` (text) - Product size
      - `turnaround` (text) - Turnaround time
      - `pricing` (jsonb) - Pricing tiers by quantity
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `printing_orders`
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `total_price_cents` (integer)
      - `needs_design` (boolean) - Whether design services are needed
      - `design_notes` (text) - Design requirements
      - `uploaded_file_url` (text) - URL to uploaded logo/artwork
      - `status` (text) - pending, designing, printing, shipped, completed
      - `tracking_number` (text)
      - `order_notes` (text)
      - `shipped_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Anyone can view active products
    - Merchants can view and create their own orders
    - Admins have full access
*/

-- Create printing_products table
CREATE TABLE IF NOT EXISTS printing_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  description text,
  stock_type text,
  size text,
  turnaround text,
  pricing jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create printing_orders table
CREATE TABLE IF NOT EXISTS printing_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES printing_products(id),
  quantity integer NOT NULL,
  total_price_cents integer NOT NULL,
  needs_design boolean DEFAULT false,
  design_notes text,
  uploaded_file_url text,
  status text DEFAULT 'pending',
  tracking_number text,
  order_notes text,
  shipped_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_printing_status CHECK (status IN ('pending', 'designing', 'printing', 'shipped', 'completed', 'cancelled'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_printing_products_category ON printing_products(category);
CREATE INDEX IF NOT EXISTS idx_printing_products_active ON printing_products(is_active);
CREATE INDEX IF NOT EXISTS idx_printing_orders_merchant ON printing_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_printing_orders_status ON printing_orders(status);

-- Enable RLS
ALTER TABLE printing_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE printing_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for printing_products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'printing_products' AND policyname = 'Anyone can view active products'
  ) THEN
    CREATE POLICY "Anyone can view active products"
      ON printing_products FOR SELECT
      USING (is_active = true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'printing_products' AND policyname = 'Admins can manage products'
  ) THEN
    CREATE POLICY "Admins can manage products"
      ON printing_products FOR ALL
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

-- RLS Policies for printing_orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'printing_orders' AND policyname = 'Merchants can view own printing orders'
  ) THEN
    CREATE POLICY "Merchants can view own printing orders"
      ON printing_orders FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM merchants
          WHERE merchants.id = printing_orders.merchant_id
          AND merchants.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'printing_orders' AND policyname = 'Merchants can create printing orders'
  ) THEN
    CREATE POLICY "Merchants can create printing orders"
      ON printing_orders FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM merchants
          WHERE merchants.id = printing_orders.merchant_id
          AND merchants.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'printing_orders' AND policyname = 'Merchants can update own printing orders'
  ) THEN
    CREATE POLICY "Merchants can update own printing orders"
      ON printing_orders FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM merchants
          WHERE merchants.id = printing_orders.merchant_id
          AND merchants.user_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM merchants
          WHERE merchants.id = printing_orders.merchant_id
          AND merchants.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'printing_orders' AND policyname = 'Admins can manage all printing orders'
  ) THEN
    CREATE POLICY "Admins can manage all printing orders"
      ON printing_orders FOR ALL
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

-- Insert printing products based on the pricing tables provided
INSERT INTO printing_products (category, name, description, stock_type, size, turnaround, pricing) VALUES
-- Business Cards
('business_cards', 'Business Cards - 14pt', 'Professional business cards on 14pt stock', '14pt', '3.5x2', '2 Days + Ship', '{"260": 7500, "500": 9500, "1000": 15000, "2500": 28000}'::jsonb),
('business_cards', 'Business Cards - 16pt', 'Premium business cards on 16pt stock', '16pt', '3.5x2', '3 Days + Ship', '{"260": 8500, "500": 12500, "1000": 16500, "2500": 29500}'::jsonb),

-- Flyers
('flyers', 'Flyers 8.5x11', 'Full color glossy flyers', '100lb AQ text', '8.5x11', 'Varies by quantity', '{"250": 19900, "500": 22500, "1000": 25000, "2500": 42500, "5000": 57500, "10000": 82500}'::jsonb),

-- Brochures
('brochures', 'Brochures 8.5x11', 'Full color glossy brochures', '4/4 Color, Glossy', '8.5x11', '2-3 day + ship', '{"250": 19900, "500": 24500, "1000": 30000, "2500": 45000, "5000": 62000, "10000": 102500}'::jsonb),

-- Door Hangers
('door_hangers', 'Door Hangers 4.25x11', 'UV coated door hangers', '14 pt UV', '4.25x11', 'Varies by quantity', '{"1000": 29500, "2500": 45000, "5000": 69500, "10000": 159500}'::jsonb),

-- Rack Cards
('rack_cards', 'Rack Cards 4x9', 'UV coated rack cards', '14 pt UV', '4x9', '2-3 Days + ship', '{"260": 14500, "500": 17500, "1000": 27500, "2500": 57500, "5000": 100000}'::jsonb),

-- Envelopes
('envelopes', 'Envelopes #10', 'Standard #10 envelopes', 'Standard', '#10', '3-4 Days + ship', '{"500": 32500, "1000": 75000, "2500": 147500}'::jsonb),

-- Letterhead
('letterhead', 'Letterhead 8.5x11', 'Professional letterhead on smooth text', '70# Uncoated Offset Smooth Text', '8.5x11', '5-7 Days + ship', '{"500": 45000, "1000": 87500, "2500": 285000, "5000": 570000}'::jsonb),

-- Yard Signs
('yard_signs', 'Yard Signs 24x18', 'Coroplast yard signs with stakes', '4mm coroplast', '24x18', '24 hours + 1-4 day ship', '{"1": 3800, "5": 3200, "10": 2400, "31": 1500}'::jsonb),

-- A-Frame Signs
('a_frame_signs', 'A-Frame Signs 24x36', 'Double-sided plastic sign holder', 'Double-sided plastic', '24x36', 'Next day print + 1-2 day ship', '{"1": 24600, "2": 42000, "3": 60000, "4": 90000, "5": 110600, "10": 199500, "25": 599500, "50": 1250000}'::jsonb),

-- Notepads
('notepads', 'Premium Opaque Notepads 4.25x5.5', '70LB Premium Opaque, 50 sheets per pad', '70LB Premium Opaque', '4.25x5.5', '3-5 Days + ship', '{"50": 24640, "100": 37940, "250": 8854}'::jsonb)
ON CONFLICT DO NOTHING;
