/*
  # Create AI Bot Subscriptions System

  1. New Tables
    - `ai_bot_subscriptions` - Tracks merchant/partner bot subscriptions
      - Links users to specific bot products
      - Manages subscription status and billing
      - Supports trial periods

  2. Updates to ai_bot_products
    - Add price_monthly_cents column
    - Add price_yearly_cents column
    - Add icon column
    - Add demo_url column
    - Migrate setup_price_cents to price_monthly_cents

  3. Security
    - Enable RLS on ai_bot_subscriptions
    - Users can view and manage their own subscriptions
*/

-- Add missing columns to ai_bot_products
ALTER TABLE ai_bot_products 
  ADD COLUMN IF NOT EXISTS price_monthly_cents integer,
  ADD COLUMN IF NOT EXISTS price_yearly_cents integer,
  ADD COLUMN IF NOT EXISTS icon text DEFAULT 'bot',
  ADD COLUMN IF NOT EXISTS demo_url text;

-- Migrate setup_price_cents to price_monthly_cents
UPDATE ai_bot_products 
SET price_monthly_cents = setup_price_cents
WHERE price_monthly_cents IS NULL;

-- Set yearly price as 10x monthly (annual discount)
UPDATE ai_bot_products
SET price_yearly_cents = price_monthly_cents * 10
WHERE price_yearly_cents IS NULL;

-- Update icons based on bot type
UPDATE ai_bot_products SET icon = 'message-circle' WHERE bot_type = 'messenger';
UPDATE ai_bot_products SET icon = 'phone-call' WHERE bot_type = 'sms';
UPDATE ai_bot_products SET icon = 'phone' WHERE bot_type = 'voip';
UPDATE ai_bot_products SET icon = 'bot' WHERE bot_type = 'website';
UPDATE ai_bot_products SET icon = 'check-square' WHERE bot_type = 'full_suite';

-- Create ai_bot_subscriptions table
CREATE TABLE IF NOT EXISTS ai_bot_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_id uuid NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('merchant', 'partner', 'admin')),
  bot_product_id uuid NOT NULL REFERENCES ai_bot_products(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'past_due', 'cancelled', 'expired')),
  billing_cycle text NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  trial_ends_at timestamptz,
  subscription_started_at timestamptz DEFAULT now(),
  subscription_ends_at timestamptz,
  stripe_subscription_id text,
  last_payment_at timestamptz,
  next_payment_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, entity_id, bot_product_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ai_bot_subscriptions_user_id 
  ON ai_bot_subscriptions(user_id);
  
CREATE INDEX IF NOT EXISTS idx_ai_bot_subscriptions_entity_id 
  ON ai_bot_subscriptions(entity_id);
  
CREATE INDEX IF NOT EXISTS idx_ai_bot_subscriptions_bot_product_id 
  ON ai_bot_subscriptions(bot_product_id);
  
CREATE INDEX IF NOT EXISTS idx_ai_bot_subscriptions_status 
  ON ai_bot_subscriptions(status);

-- Enable RLS
ALTER TABLE ai_bot_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own bot subscriptions"
  ON ai_bot_subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own bot subscriptions"
  ON ai_bot_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own bot subscriptions"
  ON ai_bot_subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all bot subscriptions"
  ON ai_bot_subscriptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );
