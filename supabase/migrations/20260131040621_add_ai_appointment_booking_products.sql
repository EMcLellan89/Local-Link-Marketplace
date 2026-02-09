/*
  # AI Appointment Booking Products
  
  1. New Products
    - AI Appointment Booking DFY Setup ($397 one-time)
    - AI Appointment Booking Monthly Optimization ($297/month)
  
  2. Changes
    - Both products are commissionable for partners
    - Products replace old cold-calling/hourly appointment setting model
    - Ad spend ($20/day) is NOT included as a product (merchant-paid, pass-through)
    - Commission rate set to 1500 basis points (15%)
  
  3. Product Details
    - Setup includes: campaign setup, message sequences, calendar integration, qualification rules, go-live testing
    - Optimization includes: copy optimization, sequence tuning, performance review, monthly improvements
*/

-- Insert AI Appointment Booking DFY Setup
INSERT INTO marketplace_affiliate_products (
  sku,
  name,
  type,
  price_cents,
  currency,
  commission_rate_bp,
  active,
  recurring,
  metadata,
  description,
  category,
  stripe_price_id
) VALUES (
  'LL_AI_APPT_DFY_SETUP',
  'AI Appointment Booking - DFY Setup',
  'service',
  39700, -- $397
  'USD',
  1500, -- 15% commission
  true,
  false, -- one-time
  jsonb_build_object(
    'includes', jsonb_build_array(
      'Campaign setup and configuration',
      'Message sequences (email, SMS, DMs)',
      'Calendar integration',
      'AI qualification rules',
      'Go-live testing',
      'Complete system setup'
    ),
    'delivery_days', 5,
    'service_category', 'ai_automation'
  ),
  'We build and launch your AI appointment booking system. Includes campaign setup, message sequences, calendar integration, qualification rules, and go-live testing. No cold calls, no hourly fees, just automated appointment booking.',
  'ai_services',
  NULL
) ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  active = EXCLUDED.active,
  recurring = EXCLUDED.recurring,
  metadata = EXCLUDED.metadata,
  description = EXCLUDED.description,
  category = EXCLUDED.category;

-- Insert AI Appointment Booking Monthly Optimization
INSERT INTO marketplace_affiliate_products (
  sku,
  name,
  type,
  price_cents,
  currency,
  commission_rate_bp,
  active,
  recurring,
  metadata,
  description,
  category,
  stripe_price_id
) VALUES (
  'LL_AI_APPT_OPTIMIZATION',
  'AI Appointment Booking - Monthly Optimization',
  'subscription',
  29700, -- $297/month
  'USD',
  1500, -- 15% commission
  true,
  true, -- monthly subscription
  jsonb_build_object(
    'includes', jsonb_build_array(
      'Monthly performance review',
      'Copy and message optimization',
      'Sequence tuning',
      'A/B testing',
      'Strategy recommendations',
      'Ongoing support'
    ),
    'billing_period', 'monthly',
    'cancel_anytime', true,
    'service_category', 'ai_automation'
  ),
  'Ongoing AI campaign management and optimization. Our team continuously improves your campaigns, tests new approaches, and refines your system to book more qualified appointments. Optional but recommended.',
  'ai_services',
  NULL
) ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  active = EXCLUDED.active,
  recurring = EXCLUDED.recurring,
  metadata = EXCLUDED.metadata,
  description = EXCLUDED.description,
  category = EXCLUDED.category;