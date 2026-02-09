/*
  # Add Merchant Orders Table

  1. New Tables
    - `merchant_orders`
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, foreign key to profiles)
      - `order_type` (text) - Type of order (landing_page, printing, etc)
      - `status` (text) - Order status (pending, processing, completed, cancelled)
      - `amount` (numeric) - Order amount
      - `details` (jsonb) - Order-specific details
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `merchant_orders` table
    - Add policies for merchants to view and create their own orders
    - Add policies for admins to view and manage all orders
*/

CREATE TABLE IF NOT EXISTS merchant_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_type text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  amount numeric(10, 2) NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE merchant_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own orders"
  ON merchant_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can create own orders"
  ON merchant_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Admins can view all orders"
  ON merchant_orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all orders"
  ON merchant_orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_merchant_orders_merchant_id ON merchant_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_orders_status ON merchant_orders(status);
CREATE INDEX IF NOT EXISTS idx_merchant_orders_created_at ON merchant_orders(created_at DESC);