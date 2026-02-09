/*
  # CRM Subscriptions and Automatic Lead Capture

  ## Overview
  Adds CRM subscription management and automatic lead capture from marketplace purchases

  ## New Tables

  ### 1. crm_subscriptions
  Track merchant CRM subscriptions and access
  - `id` (uuid, primary key)
  - `merchant_id` (uuid, references merchants) - merchant who owns the subscription
  - `plan_name` (text) - Starter, Professional, or Enterprise
  - `plan_price` (decimal) - monthly price
  - `status` (text) - active, cancelled, suspended, trial
  - `lead_limit` (integer) - maximum leads allowed
  - `user_limit` (integer) - maximum users allowed
  - `trial_ends_at` (timestamptz) - when trial period ends
  - `current_period_start` (timestamptz) - billing period start
  - `current_period_end` (timestamptz) - billing period end
  - `cancelled_at` (timestamptz) - when subscription was cancelled
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## New Functions

  ### auto_create_lead_from_purchase
  Automatically creates a CRM lead when a customer purchases a deal
  - Captures customer information from purchase
  - Creates lead with 'new' status
  - Tags lead source as 'marketplace'
  - Links to the purchased deal

  ## Security
  - RLS enabled on crm_subscriptions
  - Merchants can only view their own subscription
  - Trigger runs with security definer to bypass RLS for automatic lead creation

  ## Notes
  1. 14-day free trial for all new subscriptions
  2. Automatic lead capture from marketplace purchases
  3. Lead source automatically tagged as 'marketplace'
  4. Deal value captured from purchase amount
*/

-- Create crm_subscriptions table
CREATE TABLE IF NOT EXISTS crm_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  plan_name text DEFAULT 'Starter' CHECK (plan_name IN ('Starter', 'Professional', 'Enterprise')),
  plan_price decimal(10,2) DEFAULT 29.00,
  status text DEFAULT 'trial' CHECK (status IN ('active', 'trial', 'cancelled', 'suspended')),
  lead_limit integer DEFAULT 500,
  user_limit integer DEFAULT 1,
  trial_ends_at timestamptz DEFAULT (now() + interval '14 days'),
  current_period_start timestamptz DEFAULT now(),
  current_period_end timestamptz DEFAULT (now() + interval '1 month'),
  cancelled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_crm_subscriptions_merchant_id ON crm_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_subscriptions_status ON crm_subscriptions(status);

-- Enable RLS
ALTER TABLE crm_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crm_subscriptions
CREATE POLICY "Merchants can view their subscription"
  ON crm_subscriptions FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update their subscription"
  ON crm_subscriptions FOR UPDATE
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

-- Function to automatically create CRM lead from purchase
CREATE OR REPLACE FUNCTION auto_create_lead_from_purchase()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deal_title text;
  v_deal_merchant_id uuid;
  v_customer_email text;
  v_customer_phone text;
  v_customer_first_name text;
  v_customer_last_name text;
  v_has_crm_subscription boolean;
BEGIN
  -- Get deal information
  SELECT title, merchant_id INTO v_deal_title, v_deal_merchant_id
  FROM deals
  WHERE id = NEW.deal_id;

  -- Check if merchant has CRM subscription
  SELECT EXISTS(
    SELECT 1 FROM crm_subscriptions
    WHERE merchant_id = v_deal_merchant_id
    AND status IN ('active', 'trial')
  ) INTO v_has_crm_subscription;

  -- Only create lead if merchant has active CRM subscription
  IF v_has_crm_subscription THEN
    -- Get customer information
    SELECT p.first_name, p.last_name, u.email, p.phone
    INTO v_customer_first_name, v_customer_last_name, v_customer_email, v_customer_phone
    FROM customers c
    JOIN profiles p ON c.user_id = p.id
    JOIN auth.users u ON p.id = u.id
    WHERE c.id = NEW.customer_id;

    -- Create CRM lead
    INSERT INTO crm_leads (
      merchant_id,
      first_name,
      last_name,
      email,
      phone,
      company,
      status,
      lead_source,
      lead_value,
      priority,
      notes,
      custom_fields
    ) VALUES (
      v_deal_merchant_id,
      COALESCE(v_customer_first_name, 'Customer'),
      COALESCE(v_customer_last_name, ''),
      v_customer_email,
      v_customer_phone,
      '',
      'new',
      'marketplace',
      (NEW.amount_paid_cents::decimal / 100),
      'warm',
      'Customer purchased: ' || v_deal_title,
      jsonb_build_object(
        'purchase_id', NEW.id,
        'deal_id', NEW.deal_id,
        'deal_title', v_deal_title,
        'purchase_date', NEW.purchased_at,
        'quantity', NEW.quantity
      )
    );

    -- Log activity
    INSERT INTO crm_activities (
      merchant_id,
      lead_id,
      activity_type,
      subject,
      description,
      activity_date
    )
    SELECT
      v_deal_merchant_id,
      cl.id,
      'note',
      'Marketplace Purchase',
      'Customer purchased ' || NEW.quantity || 'x ' || v_deal_title || ' for $' || (NEW.amount_paid_cents::decimal / 100),
      NEW.purchased_at
    FROM crm_leads cl
    WHERE cl.merchant_id = v_deal_merchant_id
      AND cl.email = v_customer_email
      AND cl.custom_fields->>'purchase_id' = NEW.id::text;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create leads from purchases
DROP TRIGGER IF EXISTS trigger_auto_create_lead_from_purchase ON purchases;
CREATE TRIGGER trigger_auto_create_lead_from_purchase
  AFTER INSERT ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_lead_from_purchase();

-- Function to update subscription updated_at
CREATE OR REPLACE FUNCTION update_crm_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_crm_subscriptions_updated_at_trigger ON crm_subscriptions;
CREATE TRIGGER update_crm_subscriptions_updated_at_trigger
  BEFORE UPDATE ON crm_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_crm_subscriptions_updated_at();

-- Create function to activate CRM trial for new merchants
CREATE OR REPLACE FUNCTION activate_crm_trial_for_merchant(p_merchant_id uuid)
RETURNS void
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO crm_subscriptions (
    merchant_id,
    plan_name,
    plan_price,
    status,
    lead_limit,
    user_limit,
    trial_ends_at
  ) VALUES (
    p_merchant_id,
    'Professional',
    79.00,
    'trial',
    2500,
    5,
    now() + interval '14 days'
  )
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;