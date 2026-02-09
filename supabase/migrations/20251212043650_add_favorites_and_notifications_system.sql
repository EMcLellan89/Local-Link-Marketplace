/*
  # Add Favorites/Wishlist and Notifications System

  1. New Tables
    - `favorites`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, references customers)
      - `deal_id` (uuid, references deals, nullable)
      - `merchant_id` (uuid, references merchants, nullable)
      - `created_at` (timestamptz)
    
    - `notifications`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, references customers, nullable)
      - `merchant_id` (uuid, references merchants, nullable)
      - `title` (text)
      - `message` (text)
      - `type` (text: deal_expiring, new_deal, loyalty_earned, purchase_reminder, etc.)
      - `data` (jsonb) - extra data like deal_id, etc.
      - `is_read` (boolean)
      - `sent_at` (timestamptz)
      - `read_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `notification_preferences`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, references customers)
      - `email_new_deals` (boolean)
      - `email_deal_expiring` (boolean)
      - `email_favorite_merchant` (boolean)
      - `email_loyalty_updates` (boolean)
      - `sms_new_deals` (boolean)
      - `sms_deal_expiring` (boolean)
      - `push_new_deals` (boolean)
      - `push_deal_expiring` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Customers can manage their own favorites
    - Customers can manage their own notifications
    - Customers can manage their own notification preferences
*/

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT check_favorite_type CHECK (
    (deal_id IS NOT NULL AND merchant_id IS NULL) OR
    (deal_id IS NULL AND merchant_id IS NOT NULL)
  ),
  UNIQUE(customer_id, deal_id),
  UNIQUE(customer_id, merchant_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE UNIQUE,
  email_new_deals BOOLEAN DEFAULT true,
  email_deal_expiring BOOLEAN DEFAULT true,
  email_favorite_merchant BOOLEAN DEFAULT true,
  email_loyalty_updates BOOLEAN DEFAULT true,
  sms_new_deals BOOLEAN DEFAULT false,
  sms_deal_expiring BOOLEAN DEFAULT false,
  push_new_deals BOOLEAN DEFAULT true,
  push_deal_expiring BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_favorites_customer_id ON favorites(customer_id);
CREATE INDEX IF NOT EXISTS idx_favorites_deal_id ON favorites(deal_id);
CREATE INDEX IF NOT EXISTS idx_favorites_merchant_id ON favorites(merchant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_customer_id ON notifications(customer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_merchant_id ON notifications(merchant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_customer_id ON notification_preferences(customer_id);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Favorites policies
CREATE POLICY "Customers can view their own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can add favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can remove their own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

-- Notifications policies
CREATE POLICY "Customers can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update their own notifications"
  ON notifications FOR UPDATE
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

-- Notification preferences policies
CREATE POLICY "Customers can view their own notification preferences"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can insert their own notification preferences"
  ON notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can update their own notification preferences"
  ON notification_preferences FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

-- Function to create default notification preferences for new customers
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (customer_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default notification preferences
DROP TRIGGER IF EXISTS trigger_create_default_notification_preferences ON customers;
CREATE TRIGGER trigger_create_default_notification_preferences
  AFTER INSERT ON customers
  FOR EACH ROW EXECUTE FUNCTION create_default_notification_preferences();
