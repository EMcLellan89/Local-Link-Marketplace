/*
  # PayBright Payment Processing System
  
  1. New Tables
    - `paybright_transactions` - Track all payment transactions
    - `paybright_subscriptions` - Manage recurring subscriptions
    - `paybright_refunds` - Track refund requests and status
    - `paybright_webhook_events` - Log all webhook events from PayBright
    - `paybright_config` - Store merchant-specific PayBright configuration
  
  2. Features
    - One-time payment processing
    - Recurring subscription management
    - Refund tracking
    - Webhook event logging
    - Transaction status management
  
  3. Security
    - RLS enabled on all tables
    - Merchants can only access their own transactions
    - Webhook signature verification required
*/

-- PayBright Configuration Table
CREATE TABLE IF NOT EXISTS paybright_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  api_key text NOT NULL,
  api_token_encrypted text NOT NULL,
  environment text NOT NULL DEFAULT 'sandbox' CHECK (environment IN ('sandbox', 'live')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(merchant_id)
);

-- PayBright Transactions Table
CREATE TABLE IF NOT EXISTS paybright_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('deal_purchase', 'subscription', 'merchant_service', 'other')),
  reference_id uuid,
  reference_table text,
  amount_cents bigint NOT NULL,
  currency text DEFAULT 'CAD',
  paybright_transaction_id text,
  paybright_reference text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'authorized', 'captured', 'completed', 'failed', 'voided', 'refunded', 'partially_refunded')),
  payment_method text DEFAULT 'paybright',
  customer_email text,
  customer_name text,
  billing_address jsonb,
  shipping_address jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  authorization_date timestamptz,
  capture_date timestamptz,
  failure_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_paybright_transactions_merchant ON paybright_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_customer ON paybright_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_status ON paybright_transactions(status);
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_reference ON paybright_transactions(reference_id, reference_table);
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_paybright_ref ON paybright_transactions(paybright_reference);

-- PayBright Subscriptions Table
CREATE TABLE IF NOT EXISTS paybright_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  subscription_type text NOT NULL,
  plan_name text NOT NULL,
  amount_cents bigint NOT NULL,
  currency text DEFAULT 'CAD',
  billing_frequency text NOT NULL CHECK (billing_frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'expired', 'failed')),
  paybright_subscription_id text,
  next_billing_date date,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  trial_end_date date,
  last_payment_date timestamptz,
  failed_payment_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_paybright_subscriptions_merchant ON paybright_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_subscriptions_customer ON paybright_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_paybright_subscriptions_status ON paybright_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_paybright_subscriptions_next_billing ON paybright_subscriptions(next_billing_date);

-- PayBright Refunds Table
CREATE TABLE IF NOT EXISTS paybright_refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES paybright_transactions(id) ON DELETE CASCADE NOT NULL,
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  refund_amount_cents bigint NOT NULL,
  currency text DEFAULT 'CAD',
  reason text,
  paybright_refund_id text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  failure_reason text,
  requested_by uuid REFERENCES auth.users(id),
  processed_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_paybright_refunds_transaction ON paybright_refunds(transaction_id);
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_merchant ON paybright_refunds(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_status ON paybright_refunds(status);

-- PayBright Webhook Events Table
CREATE TABLE IF NOT EXISTS paybright_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  paybright_transaction_id text,
  paybright_reference text,
  payload jsonb NOT NULL,
  signature text,
  signature_verified boolean DEFAULT false,
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'processing', 'processed', 'failed', 'ignored')),
  processed_at timestamptz,
  error_message text,
  retry_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_paybright_webhooks_event_type ON paybright_webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_paybright_webhooks_status ON paybright_webhook_events(status);
CREATE INDEX IF NOT EXISTS idx_paybright_webhooks_transaction ON paybright_webhook_events(paybright_transaction_id);
CREATE INDEX IF NOT EXISTS idx_paybright_webhooks_created ON paybright_webhook_events(created_at);

-- Enable RLS
ALTER TABLE paybright_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE paybright_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE paybright_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE paybright_refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE paybright_webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for paybright_config
CREATE POLICY "Merchants can view own PayBright config"
  ON paybright_config FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own PayBright config"
  ON paybright_config FOR UPDATE
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

CREATE POLICY "Merchants can insert own PayBright config"
  ON paybright_config FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for paybright_transactions
CREATE POLICY "Merchants can view own transactions"
  ON paybright_transactions FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can view own transactions"
  ON paybright_transactions FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage all transactions"
  ON paybright_transactions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for paybright_subscriptions
CREATE POLICY "Merchants can view own subscriptions"
  ON paybright_subscriptions FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can view own subscriptions"
  ON paybright_subscriptions FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage all subscriptions"
  ON paybright_subscriptions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for paybright_refunds
CREATE POLICY "Merchants can view own refunds"
  ON paybright_refunds FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can create refunds"
  ON paybright_refunds FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage all refunds"
  ON paybright_refunds FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for paybright_webhook_events
CREATE POLICY "Service role can manage webhook events"
  ON paybright_webhook_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_paybright_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_paybright_config_updated_at
  BEFORE UPDATE ON paybright_config
  FOR EACH ROW
  EXECUTE FUNCTION update_paybright_updated_at();

CREATE TRIGGER update_paybright_transactions_updated_at
  BEFORE UPDATE ON paybright_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_paybright_updated_at();

CREATE TRIGGER update_paybright_subscriptions_updated_at
  BEFORE UPDATE ON paybright_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_paybright_updated_at();

CREATE TRIGGER update_paybright_refunds_updated_at
  BEFORE UPDATE ON paybright_refunds
  FOR EACH ROW
  EXECUTE FUNCTION update_paybright_updated_at();
