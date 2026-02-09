/*
  # Add Partner System (Final)

  Complete partner system implementation.
*/

-- Drop existing view to recreate
DROP VIEW IF EXISTS public.partner_leaderboard CASCADE;

-- Product commission rules
CREATE TABLE IF NOT EXISTS public.product_commission_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text UNIQUE NOT NULL,
  product_name text NOT NULL,
  commission_rate_bps int NOT NULL,
  order_type text,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

INSERT INTO public.product_commission_rules (sku, product_name, commission_rate_bps, order_type, notes) VALUES
  ('selling-recurring-revenue-bundle', 'Selling Recurring Revenue Bundle', 3000, 'course', '$349 bundle - 30% commission = $104.70'),
  ('selling-recurring-revenue-course', 'Selling Recurring Revenue Course', 3000, 'course', 'Course only - 30% commission'),
  ('selling-recurring-revenue-pro-toolkit', 'Pro Toolkit Addon', 3000, 'course', 'Toolkit upsell - 30% commission'),
  ('partner-accelerator-bundle', 'Partner Accelerator Bundle', 3000, 'course', '30% commission on partner training'),
  ('online-sales-without-ads', 'Online Sales Without Ads', 4000, 'course', '40% launch rate'),
  ('partner-crm-monthly', 'Partner CRM Monthly', 2000, 'subscription', '20% recurring commission'),
  ('partner-crm-annual', 'Partner CRM Annual', 2000, 'subscription', '20% recurring commission')
ON CONFLICT (sku) DO NOTHING;

-- Partner agreements
CREATE TABLE IF NOT EXISTS public.partner_agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_version text NOT NULL DEFAULT 'v1.0',
  signed_name text NOT NULL,
  signed_title text,
  signed_email text NOT NULL,
  signed_at timestamptz NOT NULL DEFAULT now(),
  signer_ip text,
  signer_user_agent text,
  signature_hash text NOT NULL,
  agreement_pdf_url text,
  raw_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partner_agreements_partner ON public.partner_agreements(partner_id);

ALTER TABLE public.partner_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own agreements"
  ON public.partner_agreements FOR SELECT
  TO authenticated
  USING (auth.uid() = partner_id);

-- Partner onboarding steps
CREATE TABLE IF NOT EXISTS public.partner_onboarding_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  section text NOT NULL,
  is_required boolean DEFAULT true,
  sort_order int NOT NULL,
  created_at timestamptz DEFAULT now()
);

INSERT INTO public.partner_onboarding_steps (key, title, description, section, is_required, sort_order) VALUES
  ('profile_confirmed', 'Confirm Profile', 'Verify name, email, and contact info', 'account_setup', true, 1),
  ('agreement_signed', 'Accept Partner Agreement', 'E-sign the partner terms', 'account_setup', true, 2),
  ('partner_crm_activated', 'Activate Partner CRM', 'Subscribe to Partner CRM ($49/mo)', 'account_setup', true, 3),
  ('payout_method_set', 'Set Payout Method', 'Configure Stripe payout details', 'account_setup', false, 4),
  ('affiliate_link_generated', 'Generate Affiliate Link', 'Create your unique tracking link', 'tracking_setup', true, 5),
  ('partner_code_set', 'Set Partner Code', 'Choose your partner identifier', 'tracking_setup', true, 6),
  ('test_referral_click', 'Test Referral Click', 'Verify tracking works', 'tracking_setup', true, 7),
  ('watch_welcome_video', 'Watch Welcome Video', 'Learn about the partner program', 'sales_readiness', true, 8),
  ('watch_payment_video', 'Watch How You Get Paid', 'Understand commission flow', 'sales_readiness', true, 9),
  ('download_swipe_files', 'Download Swipe Files', 'Access promotional copy', 'sales_readiness', true, 10),
  ('first_outreach_sent', 'Send First Outreach', 'Use email or DM template', 'sales_readiness', true, 11),
  ('add_25_leads', 'Add 25 Leads to Pipeline', 'Import starter lead list', 'first_deal_sprint', false, 12),
  ('book_3_calls', 'Book 3 Calls', 'Schedule discovery calls', 'first_deal_sprint', false, 13),
  ('confirm_disclosure_usage', 'Confirm Disclosure Usage', 'Agree to use affiliate disclosures', 'compliance', true, 14),
  ('confirm_no_guarantees', 'No Income Guarantees Policy', 'Acknowledge no earnings claims', 'compliance', true, 15)
ON CONFLICT (key) DO NOTHING;

-- Partner onboarding progress
CREATE TABLE IF NOT EXISTS public.partner_onboarding_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  step_key text NOT NULL REFERENCES public.partner_onboarding_steps(key),
  completed boolean DEFAULT false,
  completed_at timestamptz,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, step_key)
);

CREATE INDEX IF NOT EXISTS idx_onboarding_progress_partner ON public.partner_onboarding_progress(partner_id, completed);

ALTER TABLE public.partner_onboarding_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own progress"
  ON public.partner_onboarding_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = partner_id);

CREATE POLICY "Partners can update own progress"
  ON public.partner_onboarding_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = partner_id);

CREATE POLICY "Partners can modify own progress"
  ON public.partner_onboarding_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = partner_id)
  WITH CHECK (auth.uid() = partner_id);

-- SMS queue
CREATE TABLE IF NOT EXISTS public.sms_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number text NOT NULL,
  body text NOT NULL,
  template_key text,
  send_after timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'queued',
  sent_at timestamptz,
  twilio_sid text,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sms_queue_send_after ON public.sms_queue(send_after) WHERE status = 'queued';
CREATE INDEX IF NOT EXISTS idx_sms_queue_user_status ON public.sms_queue(user_id, status);

ALTER TABLE public.sms_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own SMS queue"
  ON public.sms_queue FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Partner bonus awards
CREATE TABLE IF NOT EXISTS public.partner_bonus_awards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quarter text NOT NULL,
  tier text NOT NULL,
  threshold_cents int NOT NULL,
  bonus_cents int NOT NULL,
  awarded_at timestamptz DEFAULT now(),
  email_sent boolean DEFAULT false,
  paid_at timestamptz,
  payout_id uuid,
  created_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, quarter, tier)
);

CREATE INDEX IF NOT EXISTS idx_bonus_awards_partner ON public.partner_bonus_awards(partner_id);
CREATE INDEX IF NOT EXISTS idx_bonus_awards_quarter ON public.partner_bonus_awards(quarter);

ALTER TABLE public.partner_bonus_awards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own bonuses"
  ON public.partner_bonus_awards FOR SELECT
  TO authenticated
  USING (auth.uid() = partner_id);

-- Partner leaderboard view
CREATE VIEW public.partner_leaderboard AS
SELECT 
  ca.user_id as partner_id,
  u.email as partner_email,
  COALESCE(pr.first_name || ' ' || pr.last_name, u.email) as partner_name,
  ca.total_referrals,
  COALESCE(SUM(car.order_amount_cents), 0) as total_revenue_cents,
  ca.total_earned_cents as total_commission_cents,
  ca.total_paid_cents as paid_commission_cents,
  ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(car.order_amount_cents), 0) DESC) as rank
FROM course_affiliates ca
JOIN auth.users u ON u.id = ca.user_id
LEFT JOIN profiles pr ON pr.id = ca.user_id
LEFT JOIN course_affiliate_referrals car ON car.affiliate_id = ca.id
WHERE ca.is_active = true
GROUP BY ca.user_id, u.email, pr.first_name, pr.last_name, ca.total_referrals, ca.total_earned_cents, ca.total_paid_cents
ORDER BY total_revenue_cents DESC;

-- Helper functions
CREATE OR REPLACE FUNCTION public.is_partner_crm_active(p_partner_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM partner_crm_subscriptions
    WHERE partner_id = p_partner_id
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_partner_onboarding_completion(p_partner_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_total int;
  v_completed int;
  v_required_total int;
  v_required_completed int;
  v_percentage int;
BEGIN
  SELECT COUNT(*) INTO v_total FROM partner_onboarding_steps;
  SELECT COUNT(*) INTO v_required_total FROM partner_onboarding_steps WHERE is_required = true;
  
  SELECT COUNT(*) INTO v_completed 
  FROM partner_onboarding_progress
  WHERE partner_id = p_partner_id AND completed = true;
  
  SELECT COUNT(*) INTO v_required_completed
  FROM partner_onboarding_progress pop
  JOIN partner_onboarding_steps pos ON pos.key = pop.step_key
  WHERE pop.partner_id = p_partner_id 
  AND pop.completed = true 
  AND pos.is_required = true;
  
  v_percentage := CASE 
    WHEN v_required_total > 0 THEN (v_required_completed * 100 / v_required_total)
    ELSE 0
  END;
  
  RETURN jsonb_build_object(
    'total_steps', v_total,
    'completed_steps', v_completed,
    'required_steps', v_required_total,
    'required_completed', v_required_completed,
    'completion_percentage', v_percentage,
    'is_complete', v_required_completed >= v_required_total
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.schedule_sms(
  p_user_id uuid,
  p_phone_number text,
  p_body text,
  p_template_key text DEFAULT NULL,
  p_delay_interval interval DEFAULT '0 seconds'::interval
)
RETURNS uuid AS $$
DECLARE
  v_sms_id uuid;
BEGIN
  INSERT INTO public.sms_queue (user_id, phone_number, body, template_key, send_after)
  VALUES (p_user_id, p_phone_number, p_body, p_template_key, now() + p_delay_interval)
  RETURNING id INTO v_sms_id;
  
  RETURN v_sms_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;