/*
  # Add Support System and Multi-Location Support

  1. New Tables
    - `support_tickets`
      - `id` (uuid, primary key)
      - `ticket_number` (text, unique)
      - `customer_id` (uuid, references customers, nullable)
      - `merchant_id` (uuid, references merchants, nullable)
      - `subject` (text)
      - `description` (text)
      - `category` (text)
      - `priority` (text: low, medium, high, urgent)
      - `status` (text: open, in_progress, waiting, resolved, closed)
      - `assigned_to` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `resolved_at` (timestamptz)
    
    - `support_messages`
      - `id` (uuid, primary key)
      - `ticket_id` (uuid, references support_tickets)
      - `sender_type` (text: customer, merchant, support)
      - `sender_id` (uuid)
      - `message` (text)
      - `attachments` (jsonb)
      - `created_at` (timestamptz)
    
    - `merchant_locations`
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, references merchants)
      - `location_name` (text)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `zip_code` (text)
      - `phone` (text)
      - `email` (text)
      - `is_primary` (boolean)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `hours_of_operation` (jsonb)
      - `status` (text: active, inactive)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `deal_locations`
      - `id` (uuid, primary key)
      - `deal_id` (uuid, references deals)
      - `location_id` (uuid, references merchant_locations)
      - `created_at` (timestamptz)
    
    - `help_articles`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `content` (text)
      - `category` (text)
      - `tags` (jsonb)
      - `view_count` (integer)
      - `helpful_count` (integer)
      - `is_published` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Customers and merchants can manage their own support tickets
    - Merchants can manage their own locations
    - Help articles are publicly readable
*/

-- Create support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
  assigned_to TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- Create support messages table
CREATE TABLE IF NOT EXISTS support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'merchant', 'support')),
  sender_id UUID NOT NULL,
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create merchant locations table
CREATE TABLE IF NOT EXISTS merchant_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  location_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  is_primary BOOLEAN DEFAULT false,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  hours_of_operation JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create deal locations table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS deal_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES merchant_locations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(deal_id, location_id)
);

-- Create help articles table
CREATE TABLE IF NOT EXISTS help_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id ON support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_merchant_id ON support_tickets(merchant_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_ticket_number ON support_tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_merchant_locations_merchant_id ON merchant_locations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_locations_city ON merchant_locations(city);
CREATE INDEX IF NOT EXISTS idx_deal_locations_deal_id ON deal_locations(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_locations_location_id ON deal_locations(location_id);
CREATE INDEX IF NOT EXISTS idx_help_articles_slug ON help_articles(slug);
CREATE INDEX IF NOT EXISTS idx_help_articles_category ON help_articles(category);

-- Enable RLS
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;

-- Support tickets policies
CREATE POLICY "Customers can view their own tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can view their own tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create tickets"
  ON support_tickets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can create tickets"
  ON support_tickets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own tickets"
  ON support_tickets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers WHERE customers.id = customer_id AND customers.user_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM merchants WHERE merchants.id = merchant_id AND merchants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers WHERE customers.id = customer_id AND customers.user_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM merchants WHERE merchants.id = merchant_id AND merchants.user_id = auth.uid()
    )
  );

-- Support messages policies
CREATE POLICY "Users can view messages for their tickets"
  ON support_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM support_tickets st
      LEFT JOIN customers c ON c.id = st.customer_id
      LEFT JOIN merchants m ON m.id = st.merchant_id
      WHERE st.id = ticket_id
      AND (c.user_id = auth.uid() OR m.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create messages for their tickets"
  ON support_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM support_tickets st
      LEFT JOIN customers c ON c.id = st.customer_id
      LEFT JOIN merchants m ON m.id = st.merchant_id
      WHERE st.id = ticket_id
      AND (c.user_id = auth.uid() OR m.user_id = auth.uid())
    )
  );

-- Merchant locations policies
CREATE POLICY "Merchants can view their own locations"
  ON merchant_locations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view active merchant locations"
  ON merchant_locations FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Merchants can create their own locations"
  ON merchant_locations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update their own locations"
  ON merchant_locations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

-- Deal locations policies
CREATE POLICY "Merchants can manage locations for their deals"
  ON deal_locations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deals d
      JOIN merchants m ON m.id = d.merchant_id
      WHERE d.id = deal_id
      AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view deal locations"
  ON deal_locations FOR SELECT
  TO authenticated
  USING (true);

-- Help articles policies (public read for published articles)
CREATE POLICY "Anyone can view published help articles"
  ON help_articles FOR SELECT
  TO authenticated
  USING (is_published = true);

-- Function to generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  num TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    num := 'TKT-' || lpad(floor(random() * 999999)::text, 6, '0');
    SELECT EXISTS(SELECT 1 FROM support_tickets WHERE ticket_number = num) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN num;
END;
$$ LANGUAGE plpgsql;

-- Function to ensure only one primary location per merchant
CREATE OR REPLACE FUNCTION ensure_single_primary_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    UPDATE merchant_locations 
    SET is_primary = false 
    WHERE merchant_id = NEW.merchant_id 
    AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to ensure only one primary location
DROP TRIGGER IF EXISTS trigger_ensure_single_primary_location ON merchant_locations;
CREATE TRIGGER trigger_ensure_single_primary_location
  BEFORE INSERT OR UPDATE ON merchant_locations
  FOR EACH ROW 
  WHEN (NEW.is_primary = true)
  EXECUTE FUNCTION ensure_single_primary_location();
