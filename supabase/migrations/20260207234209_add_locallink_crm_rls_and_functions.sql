/*
  # Local-Link CRM - RLS Policies and Helper Functions

  1. Row Level Security for all CRM tables
  2. Helper functions for common operations
  3. Triggers for automated updates
*/

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS on all CRM tables
ALTER TABLE ll_crm_pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ll_crm_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ll_crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ll_crm_pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE ll_crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ll_crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE ll_crm_email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ll_crm_email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE ll_crm_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE ll_crm_workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ll_crm_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ll_crm_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE ll_crm_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ll_crm_ai_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE ll_crm_ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE ll_books_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ll_books_income ENABLE ROW LEVEL SECURITY;

-- Pricing tiers: Public read, admin only write
CREATE POLICY "Anyone can view CRM pricing tiers"
  ON ll_crm_pricing_tiers FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Subscriptions: Users can view their own
CREATE POLICY "Merchants can view own CRM subscription"
  ON ll_crm_subscriptions FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own CRM subscription"
  ON ll_crm_subscriptions FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Contacts: Full access to own contacts
CREATE POLICY "Merchants can manage own CRM contacts"
  ON ll_crm_contacts FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Pipelines: Full access to own pipelines
CREATE POLICY "Merchants can manage own CRM pipelines"
  ON ll_crm_pipelines FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Deals: Full access to own deals
CREATE POLICY "Merchants can manage own CRM deals"
  ON ll_crm_deals FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Activities: Full access to own activities
CREATE POLICY "Merchants can manage own CRM activities"
  ON ll_crm_activities FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Email campaigns: Full access to own campaigns
CREATE POLICY "Merchants can manage own email campaigns"
  ON ll_crm_email_campaigns FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Email sends: Full access to own sends
CREATE POLICY "Merchants can manage own email sends"
  ON ll_crm_email_sends FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Workflows: Full access to own workflows
CREATE POLICY "Merchants can manage own workflows"
  ON ll_crm_workflows FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Workflow executions: Full access to own executions
CREATE POLICY "Merchants can view own workflow executions"
  ON ll_crm_workflow_executions FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Documents: Full access to own documents
CREATE POLICY "Merchants can manage own documents"
  ON ll_crm_documents FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Invoices: Full access to own invoices
CREATE POLICY "Merchants can manage own invoices"
  ON ll_crm_invoices FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Payments: Full access to own payments
CREATE POLICY "Merchants can manage own payments"
  ON ll_crm_payments FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- AI Features: Public read
CREATE POLICY "Anyone can view AI features"
  ON ll_crm_ai_features FOR SELECT
  TO authenticated
  USING (is_active = true);

-- AI Usage: Full access to own usage
CREATE POLICY "Merchants can view own AI usage"
  ON ll_crm_ai_usage FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can insert own AI usage"
  ON ll_crm_ai_usage FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Books expenses: Full access to own expenses
CREATE POLICY "Merchants can manage own expenses"
  ON ll_books_expenses FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- Books income: Full access to own income
CREATE POLICY "Merchants can manage own income"
  ON ll_books_income FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to check CRM subscription status
CREATE OR REPLACE FUNCTION get_ll_crm_subscription_status(merchant_id_input UUID)
RETURNS TABLE(
  is_active BOOLEAN,
  tier_name TEXT,
  contact_limit INTEGER,
  contacts_used INTEGER,
  ai_enabled BOOLEAN,
  ai_credits INTEGER,
  books_tier TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (s.status = 'active') as is_active,
    t.tier_name,
    t.contact_limit,
    s.contact_count as contacts_used,
    s.ai_addon_enabled as ai_enabled,
    s.ai_credits_remaining as ai_credits,
    t.books_tier
  FROM ll_crm_subscriptions s
  JOIN ll_crm_pricing_tiers t ON s.tier_id = t.id
  WHERE s.merchant_id = merchant_id_input;
END;
$$;

-- Function to update contact count
CREATE OR REPLACE FUNCTION update_ll_crm_contact_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE ll_crm_subscriptions
    SET contact_count = contact_count + 1
    WHERE merchant_id = NEW.merchant_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE ll_crm_subscriptions
    SET contact_count = GREATEST(0, contact_count - 1)
    WHERE merchant_id = OLD.merchant_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger to update contact count
DROP TRIGGER IF EXISTS trigger_update_ll_crm_contact_count ON ll_crm_contacts;
CREATE TRIGGER trigger_update_ll_crm_contact_count
  AFTER INSERT OR DELETE ON ll_crm_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_ll_crm_contact_count();

-- Function to check if AI feature is available
CREATE OR REPLACE FUNCTION can_use_ll_crm_ai_feature(
  merchant_id_input UUID,
  feature_name_input TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  subscription_tier INTEGER;
  feature_min_tier INTEGER;
  ai_enabled BOOLEAN;
  ai_credits INTEGER;
  credits_needed INTEGER;
BEGIN
  -- Get subscription info
  SELECT 
    t.tier_level,
    s.ai_addon_enabled,
    s.ai_credits_remaining
  INTO subscription_tier, ai_enabled, ai_credits
  FROM ll_crm_subscriptions s
  JOIN ll_crm_pricing_tiers t ON s.tier_id = t.id
  WHERE s.merchant_id = merchant_id_input
    AND s.status = 'active';
  
  -- Get feature requirements
  SELECT 
    min_tier_required,
    credits_per_use
  INTO feature_min_tier, credits_needed
  FROM ll_crm_ai_features
  WHERE feature_name = feature_name_input
    AND is_active = true;
  
  -- Check if feature is available
  RETURN (
    subscription_tier >= feature_min_tier AND
    ai_enabled = true AND
    ai_credits >= credits_needed
  );
END;
$$;

-- Function to use AI credits
CREATE OR REPLACE FUNCTION use_ll_crm_ai_credits(
  merchant_id_input UUID,
  feature_id_input UUID,
  credits_to_use INTEGER DEFAULT 1
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  -- Get current credits
  SELECT ai_credits_remaining INTO current_credits
  FROM ll_crm_subscriptions
  WHERE merchant_id = merchant_id_input;
  
  -- Check if enough credits
  IF current_credits < credits_to_use THEN
    RETURN FALSE;
  END IF;
  
  -- Deduct credits
  UPDATE ll_crm_subscriptions
  SET ai_credits_remaining = ai_credits_remaining - credits_to_use
  WHERE merchant_id = merchant_id_input;
  
  RETURN TRUE;
END;
$$;

-- Function to generate CRM invoice number
CREATE OR REPLACE FUNCTION generate_ll_crm_invoice_number(merchant_id_input UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
  invoice_num TEXT;
BEGIN
  -- Get the next invoice number for this merchant
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(invoice_number FROM '[0-9]+$') AS INTEGER)
  ), 0) + 1
  INTO next_number
  FROM ll_crm_invoices
  WHERE merchant_id = merchant_id_input;
  
  -- Format as INV-XXXXX
  invoice_num := 'INV-' || LPAD(next_number::TEXT, 5, '0');
  
  RETURN invoice_num;
END;
$$;

-- Function to update invoice amounts when paid
CREATE OR REPLACE FUNCTION update_ll_crm_invoice_on_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.invoice_id IS NOT NULL THEN
    UPDATE ll_crm_invoices
    SET 
      amount_paid = amount_paid + NEW.payment_amount,
      amount_due = total_amount - (amount_paid + NEW.payment_amount),
      status = CASE 
        WHEN (total_amount - (amount_paid + NEW.payment_amount)) <= 0 THEN 'paid'
        ELSE status
      END,
      paid_at = CASE 
        WHEN (total_amount - (amount_paid + NEW.payment_amount)) <= 0 THEN now()
        ELSE paid_at
      END
    WHERE id = NEW.invoice_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to update invoice when payment received
DROP TRIGGER IF EXISTS trigger_update_ll_crm_invoice_on_payment ON ll_crm_payments;
CREATE TRIGGER trigger_update_ll_crm_invoice_on_payment
  AFTER INSERT ON ll_crm_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_ll_crm_invoice_on_payment();

-- Function to update contact lifetime value
CREATE OR REPLACE FUNCTION update_ll_crm_contact_ltv()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.contact_id IS NOT NULL THEN
    UPDATE ll_crm_contacts
    SET 
      lifetime_value = lifetime_value + NEW.payment_amount,
      total_purchases = total_purchases + 1
    WHERE id = NEW.contact_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to update contact LTV
DROP TRIGGER IF EXISTS trigger_update_ll_crm_contact_ltv ON ll_crm_payments;
CREATE TRIGGER trigger_update_ll_crm_contact_ltv
  AFTER INSERT ON ll_crm_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_ll_crm_contact_ltv();

COMMENT ON FUNCTION get_ll_crm_subscription_status IS 'Get comprehensive CRM subscription status for a merchant';
COMMENT ON FUNCTION can_use_ll_crm_ai_feature IS 'Check if merchant can use a specific AI feature based on tier and credits';
COMMENT ON FUNCTION use_ll_crm_ai_credits IS 'Deduct AI credits when feature is used';
COMMENT ON FUNCTION generate_ll_crm_invoice_number IS 'Generate next sequential invoice number for merchant';
