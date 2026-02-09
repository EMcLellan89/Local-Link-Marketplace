/*
  # Add Comprehensive AI Bot Suite with Bundle Packages
  
  1. New AI Bot Products (Monthly Subscriptions)
    - AI Appointment Scheduler Bot ($199/month)
    - AI Lead Qualifier Bot ($249/month)
    - AI Follow-Up Automation Bot ($179/month)
    - AI Invoice Reminder Bot ($149/month)
    - AI Customer Retention Bot ($199/month)
    - AI Reputation Monitor Bot ($129/month)
    - AI Proposal Generator Bot ($159/month)
  
  2. AI Bundle Packages (Monthly Subscriptions)
    - Lead Generation Package ($497/month, saves $100)
    - Customer Service Package ($497/month, saves $80)
    - Revenue Maximization Package ($447/month, saves $80)
    - Complete AI Suite (updated to $1,497/month, saves $600+)
  
  3. Features
    - All bots include setup, training, and 24/7 support
    - Bundle packages offer significant discounts
    - Extended category constraint to include ai_bots and ai_packages
*/

-- First, extend the category constraint
ALTER TABLE automation_addons DROP CONSTRAINT IF EXISTS valid_addon_category;
ALTER TABLE automation_addons ADD CONSTRAINT valid_addon_category 
  CHECK (category = ANY (ARRAY['automation'::text, 'compliance'::text, 'analytics'::text, 'global'::text, 'ai_bots'::text, 'ai_packages'::text, 'other'::text]));

-- Insert new individual AI bot products into automation_addons
INSERT INTO automation_addons (name, slug, description, monthly_price_cents, annual_price_cents, feature_flag, category, is_active, sort_order) VALUES
(
  'AI Appointment Scheduler Bot',
  'ai_appointment_scheduler',
  'Fully automated appointment scheduling system that handles bookings, rescheduling, and cancellations 24/7. Syncs with your calendar, sends confirmations, and reduces no-shows by 40%+',
  19900,
  199000,
  'ai_appointment_scheduler',
  'ai_bots',
  true,
  100
),
(
  'AI Lead Qualifier Bot',
  'ai_lead_qualifier',
  'Pre-qualifies all incoming leads before they reach you. Asks about budget, timeline, location, and project details. Scores leads as hot/warm/cold so you only spend time on serious customers.',
  24900,
  249000,
  'ai_lead_qualifier',
  'ai_bots',
  true,
  101
),
(
  'AI Follow-Up Automation Bot',
  'ai_follow_up_automation',
  'Never lose a deal to lack of follow-up. Automatically follows up with quotes, requests reviews after jobs, and re-engages cold leads with seasonal offers. Nurtures leads until they are ready to buy.',
  17900,
  179000,
  'ai_follow_up_automation',
  'ai_bots',
  true,
  102
),
(
  'AI Invoice Reminder Bot',
  'ai_invoice_reminder',
  'Get paid faster without awkward conversations. Automatically sends payment reminders, escalates overdue invoices professionally, and offers payment plan options. Reduces Days Sales Outstanding significantly.',
  14900,
  149000,
  'ai_invoice_reminder',
  'ai_bots',
  true,
  103
),
(
  'AI Customer Retention Bot',
  'ai_customer_retention',
  'Automatically keeps your customers coming back. Sends maintenance reminders, seasonal outreach, anniversary messages, and win-back campaigns. Repeat customers are 5x cheaper than new ones.',
  19900,
  199000,
  'ai_customer_retention',
  'ai_bots',
  true,
  104
),
(
  'AI Reputation Monitor Bot',
  'ai_reputation_monitor',
  'Never miss a review again. Monitors Google, Yelp, Facebook, Angi, and more in real-time. Instant alerts for new reviews with sentiment analysis and suggested responses. Track your reputation score over time.',
  12900,
  129000,
  'ai_reputation_monitor',
  'ai_bots',
  true,
  105
),
(
  'AI Proposal Generator Bot',
  'ai_proposal_generator',
  'Win more business with professional proposals. Automatically creates detailed proposals with scope of work, timeline, payment terms, and company branding. Includes e-signature integration for instant approval.',
  15900,
  159000,
  'ai_proposal_generator',
  'ai_bots',
  true,
  106
)
ON CONFLICT (slug) DO NOTHING;

-- Insert AI Bundle Packages
INSERT INTO automation_addons (name, slug, description, monthly_price_cents, annual_price_cents, feature_flag, category, is_active, sort_order) VALUES
(
  'Lead Generation Package',
  'lead_generation_package',
  'Complete lead generation system. Includes AI Lead Qualifier Bot, plus tools to attract and convert more leads on autopilot. Save $100/month vs buying separately.',
  49700,
  497000,
  'lead_generation_package',
  'ai_packages',
  true,
  200
),
(
  'Customer Service Package',
  'customer_service_package',
  'Ultimate customer experience automation. Includes AI Appointment Scheduler Bot, AI Follow-Up Automation Bot, plus review management tools. Deliver 5-star service 24/7. Save $80/month vs buying separately.',
  49700,
  497000,
  'customer_service_package',
  'ai_packages',
  true,
  201
),
(
  'Revenue Maximization Package',
  'revenue_maximization_package',
  'Maximize cash flow and customer lifetime value. Includes AI Invoice Reminder Bot, AI Customer Retention Bot, plus email automation. Get paid faster and keep customers longer. Save $80/month vs buying separately.',
  44700,
  447000,
  'revenue_maximization_package',
  'ai_packages',
  true,
  202
),
(
  'Complete AI Suite',
  'complete_ai_suite',
  'Every AI bot we offer in one mega package. Complete business automation from lead generation to customer retention. Includes all 12+ AI bots plus priority support. Save over $600/month vs buying separately.',
  149700,
  1497000,
  'complete_ai_suite',
  'ai_packages',
  true,
  203
)
ON CONFLICT (slug) DO NOTHING;

-- Create ai_package_items table to track which bots are in each package
CREATE TABLE IF NOT EXISTS ai_package_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_addon_id uuid NOT NULL REFERENCES automation_addons(id) ON DELETE CASCADE,
  bot_addon_id uuid NOT NULL REFERENCES automation_addons(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(package_addon_id, bot_addon_id)
);

ALTER TABLE ai_package_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view package items"
  ON ai_package_items FOR SELECT
  TO authenticated
  USING (true);

-- Create index
CREATE INDEX IF NOT EXISTS idx_ai_package_items_package ON ai_package_items(package_addon_id);
CREATE INDEX IF NOT EXISTS idx_ai_package_items_bot ON ai_package_items(bot_addon_id);
