/*
  # Add Revenue Features - Part 1: Tables

  ## Creates tables for 9 revenue-generating features:
  1. Email Marketing Platform
  2. Digital Gift Card System  
  3. Online Ordering & E-commerce
  4. Reputation Management Suite
  5. Video Marketing Services
  6. Advanced Business Intelligence
  7. Automated Referral Program Management
  8. Class/Workshop/Event Booking
  9. Customer Win-Back Automation

  Note: RLS policies will be added in Part 2
*/

-- EMAIL MARKETING
CREATE TABLE IF NOT EXISTS email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  subject text NOT NULL,
  preview_text text,
  from_name text NOT NULL,
  from_email text NOT NULL,
  template_id uuid,
  content jsonb NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  total_recipients integer DEFAULT 0,
  total_sent integer DEFAULT 0,
  total_delivered integer DEFAULT 0,
  total_opened integer DEFAULT 0,
  total_clicked integer DEFAULT 0,
  total_bounced integer DEFAULT 0,
  total_unsubscribed integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  thumbnail_url text,
  content jsonb NOT NULL,
  is_public boolean DEFAULT false,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  first_name text,
  last_name text,
  phone text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced', 'complained')),
  tags text[] DEFAULT '{}',
  custom_fields jsonb DEFAULT '{}',
  source text,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(merchant_id, email)
);

CREATE TABLE IF NOT EXISTS email_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES email_campaigns(id) ON DELETE CASCADE NOT NULL,
  subscriber_id uuid REFERENCES email_subscribers(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'failed')),
  sent_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  bounced_at timestamptz,
  bounced_reason text,
  click_count integer DEFAULT 0,
  open_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_automation_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  trigger_type text NOT NULL CHECK (trigger_type IN ('welcome', 'abandoned_cart', 'post_purchase', 'birthday', 'anniversary', 'custom')),
  trigger_config jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  total_entered integer DEFAULT 0,
  total_completed integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_automation_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id uuid REFERENCES email_automation_sequences(id) ON DELETE CASCADE NOT NULL,
  step_number integer NOT NULL,
  delay_minutes integer NOT NULL DEFAULT 0,
  template_id uuid REFERENCES email_templates(id) ON DELETE SET NULL,
  subject text NOT NULL,
  content jsonb NOT NULL,
  condition_config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(sequence_id, step_number)
);

-- GIFT CARDS
CREATE TABLE IF NOT EXISTS gift_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  code text NOT NULL UNIQUE,
  purchaser_customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  recipient_email text NOT NULL,
  recipient_name text,
  purchaser_name text,
  initial_amount decimal(10,2) NOT NULL,
  current_balance decimal(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired', 'cancelled')),
  template_id uuid,
  message text,
  delivery_method text NOT NULL DEFAULT 'email' CHECK (delivery_method IN ('email', 'sms', 'print')),
  scheduled_delivery_at timestamptz,
  delivered_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gift_card_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_card_id uuid REFERENCES gift_cards(id) ON DELETE CASCADE NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('purchase', 'redemption', 'refund', 'adjustment')),
  amount decimal(10,2) NOT NULL,
  balance_after decimal(10,2) NOT NULL,
  order_id uuid,
  notes text,
  processed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gift_card_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  design_url text NOT NULL,
  is_default boolean DEFAULT false,
  is_seasonal boolean DEFAULT false,
  season_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- E-COMMERCE
CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  image_url text,
  parent_category_id uuid REFERENCES product_categories(id) ON DELETE SET NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(merchant_id, slug)
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES product_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  short_description text,
  sku text,
  price decimal(10,2) NOT NULL,
  compare_at_price decimal(10,2),
  cost decimal(10,2),
  track_inventory boolean DEFAULT false,
  inventory_quantity integer DEFAULT 0,
  low_stock_threshold integer DEFAULT 10,
  weight decimal(10,2),
  weight_unit text DEFAULT 'lb',
  requires_shipping boolean DEFAULT true,
  is_digital boolean DEFAULT false,
  digital_file_url text,
  images jsonb DEFAULT '[]',
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived', 'out_of_stock')),
  featured boolean DEFAULT false,
  seo_title text,
  seo_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(merchant_id, slug)
);

CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  sku text,
  price decimal(10,2),
  compare_at_price decimal(10,2),
  inventory_quantity integer DEFAULT 0,
  option1_name text,
  option1_value text,
  option2_name text,
  option2_value text,
  option3_name text,
  option3_value text,
  image_url text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ecommerce_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  order_number text NOT NULL UNIQUE,
  email text NOT NULL,
  phone text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'ready', 'completed', 'cancelled', 'refunded')),
  fulfillment_status text DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled', 'partial', 'fulfilled')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partially_refunded', 'refunded', 'failed')),
  subtotal decimal(10,2) NOT NULL,
  tax_amount decimal(10,2) DEFAULT 0,
  shipping_amount decimal(10,2) DEFAULT 0,
  discount_amount decimal(10,2) DEFAULT 0,
  tip_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  payment_method text,
  transaction_id text,
  fulfillment_type text NOT NULL CHECK (fulfillment_type IN ('pickup', 'delivery', 'shipping', 'digital')),
  scheduled_for timestamptz,
  shipping_address jsonb,
  billing_address jsonb,
  customer_notes text,
  merchant_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES ecommerce_orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  variant_id uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  name text NOT NULL,
  sku text,
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  tax_amount decimal(10,2) DEFAULT 0,
  discount_amount decimal(10,2) DEFAULT 0,
  options jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shopping_carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  session_id text,
  subtotal decimal(10,2) DEFAULT 0,
  tax_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid REFERENCES shopping_carts(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  variant_id uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  options jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- REPUTATION MANAGEMENT
CREATE TABLE IF NOT EXISTS reputation_platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  platform_type text NOT NULL CHECK (platform_type IN ('google', 'yelp', 'facebook', 'tripadvisor', 'trustpilot', 'bbb', 'other')),
  platform_name text NOT NULL,
  business_url text NOT NULL,
  api_connected boolean DEFAULT false,
  api_credentials jsonb,
  sync_enabled boolean DEFAULT true,
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(merchant_id, platform_type)
);

CREATE TABLE IF NOT EXISTS reputation_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  platform_id uuid REFERENCES reputation_platforms(id) ON DELETE CASCADE NOT NULL,
  external_review_id text,
  reviewer_name text NOT NULL,
  reviewer_email text,
  rating decimal(3,2) NOT NULL,
  title text,
  content text NOT NULL,
  review_date timestamptz NOT NULL,
  sentiment text CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  sentiment_score decimal(3,2),
  is_responded boolean DEFAULT false,
  is_flagged boolean DEFAULT false,
  flag_reason text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reputation_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES reputation_reviews(id) ON DELETE CASCADE NOT NULL,
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  is_ai_generated boolean DEFAULT false,
  posted_at timestamptz,
  posted_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reputation_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('post_purchase', 'post_service', 'scheduled', 'manual')),
  trigger_config jsonb DEFAULT '{}',
  message_template text NOT NULL,
  platforms text[] NOT NULL,
  is_active boolean DEFAULT true,
  total_sent integer DEFAULT 0,
  total_reviews_received integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reputation_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  alert_type text NOT NULL CHECK (alert_type IN ('new_review', 'negative_review', 'rating_change', 'response_needed')),
  threshold_config jsonb DEFAULT '{}',
  notification_channels text[] NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- VIDEO SERVICES
CREATE TABLE IF NOT EXISTS video_service_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  order_number text NOT NULL UNIQUE,
  video_type text NOT NULL CHECK (video_type IN ('short_form', 'long_form', 'testimonial', 'product', 'ad', 'social', 'custom')),
  title text NOT NULL,
  description text NOT NULL,
  duration_seconds integer,
  style_preferences jsonb DEFAULT '{}',
  brand_guidelines jsonb DEFAULT '{}',
  raw_footage_urls text[] DEFAULT '{}',
  reference_urls text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'script_review', 'in_production', 'review', 'revisions', 'completed', 'cancelled')),
  price decimal(10,2) NOT NULL,
  paid_at timestamptz,
  due_date timestamptz,
  completed_at timestamptz,
  assigned_to uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS video_scripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES video_service_orders(id) ON DELETE CASCADE NOT NULL,
  version integer NOT NULL DEFAULT 1,
  content text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  approved_at timestamptz,
  approved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS video_deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES video_service_orders(id) ON DELETE CASCADE NOT NULL,
  version integer NOT NULL DEFAULT 1,
  file_url text NOT NULL,
  thumbnail_url text,
  duration_seconds integer,
  resolution text,
  file_size_mb decimal(10,2),
  format text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS video_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES video_service_orders(id) ON DELETE CASCADE NOT NULL,
  requested_by uuid REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  notes text NOT NULL,
  timestamp_notes jsonb DEFAULT '[]',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- BUSINESS INTELLIGENCE
CREATE TABLE IF NOT EXISTS bi_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  report_type text NOT NULL CHECK (report_type IN ('revenue', 'customer', 'product', 'marketing', 'custom')),
  config jsonb NOT NULL,
  schedule text CHECK (schedule IN ('daily', 'weekly', 'monthly', 'quarterly')),
  recipients text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  last_generated_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bi_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  metric_date date NOT NULL,
  total_revenue decimal(10,2) DEFAULT 0,
  total_orders integer DEFAULT 0,
  total_customers integer DEFAULT 0,
  new_customers integer DEFAULT 0,
  returning_customers integer DEFAULT 0,
  average_order_value decimal(10,2) DEFAULT 0,
  customer_lifetime_value decimal(10,2) DEFAULT 0,
  customer_acquisition_cost decimal(10,2) DEFAULT 0,
  conversion_rate decimal(5,2) DEFAULT 0,
  cart_abandonment_rate decimal(5,2) DEFAULT 0,
  review_average decimal(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  email_open_rate decimal(5,2) DEFAULT 0,
  email_click_rate decimal(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(merchant_id, metric_date)
);

CREATE TABLE IF NOT EXISTS bi_competitor_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  competitor_name text NOT NULL,
  competitor_url text,
  category text,
  tracking_metrics jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bi_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  prediction_type text NOT NULL CHECK (prediction_type IN ('revenue', 'customers', 'churn', 'inventory', 'seasonal')),
  prediction_date date NOT NULL,
  predicted_value decimal(10,2) NOT NULL,
  confidence_score decimal(3,2),
  actual_value decimal(10,2),
  model_version text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(merchant_id, prediction_type, prediction_date)
);

-- REFERRAL PROGRAMS
CREATE TABLE IF NOT EXISTS referral_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  referrer_reward_type text NOT NULL CHECK (referrer_reward_type IN ('percentage', 'fixed', 'points', 'gift_card')),
  referrer_reward_value decimal(10,2) NOT NULL,
  referee_reward_type text CHECK (referee_reward_type IN ('percentage', 'fixed', 'points', 'gift_card')),
  referee_reward_value decimal(10,2),
  minimum_purchase_amount decimal(10,2) DEFAULT 0,
  maximum_uses_per_customer integer,
  expiration_days integer,
  terms_and_conditions text,
  total_referrals integer DEFAULT 0,
  total_conversions integer DEFAULT 0,
  total_revenue_generated decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS referral_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES referral_programs(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  referral_code text NOT NULL UNIQUE,
  custom_url text,
  clicks integer DEFAULT 0,
  conversions integer DEFAULT 0,
  total_revenue decimal(10,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS referral_conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_link_id uuid REFERENCES referral_links(id) ON DELETE CASCADE NOT NULL,
  referee_customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  order_id uuid,
  conversion_value decimal(10,2) NOT NULL,
  referrer_reward_amount decimal(10,2),
  referee_reward_amount decimal(10,2),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  converted_at timestamptz DEFAULT now(),
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS referral_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  conversion_id uuid REFERENCES referral_conversions(id) ON DELETE CASCADE NOT NULL,
  reward_type text NOT NULL,
  reward_value decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'issued', 'redeemed', 'expired', 'cancelled')),
  issued_at timestamptz,
  redeemed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- EVENTS
CREATE TABLE IF NOT EXISTS event_series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  recurrence_pattern text NOT NULL CHECK (recurrence_pattern IN ('daily', 'weekly', 'biweekly', 'monthly', 'custom')),
  recurrence_config jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  series_id uuid REFERENCES event_series(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('class', 'workshop', 'seminar', 'webinar', 'event', 'appointment', 'other')),
  category text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  timezone text NOT NULL DEFAULT 'America/New_York',
  location_type text NOT NULL CHECK (location_type IN ('physical', 'virtual', 'hybrid')),
  location_address jsonb,
  virtual_link text,
  capacity integer,
  remaining_capacity integer,
  instructor_name text,
  instructor_bio text,
  instructor_photo_url text,
  image_url text,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'cancelled', 'completed')),
  is_published boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  requirements text,
  what_to_bring text,
  cancellation_policy text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  quantity integer NOT NULL,
  remaining_quantity integer NOT NULL,
  min_per_order integer DEFAULT 1,
  max_per_order integer,
  early_bird_price decimal(10,2),
  early_bird_ends_at timestamptz,
  sales_start_at timestamptz,
  sales_end_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  ticket_id uuid REFERENCES event_tickets(id) ON DELETE SET NULL NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  transaction_id text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'refunded', 'no_show')),
  check_in_status text DEFAULT 'pending' CHECK (check_in_status IN ('pending', 'checked_in', 'no_show')),
  confirmation_code text UNIQUE,
  qr_code_url text,
  special_requests text,
  custom_fields jsonb DEFAULT '{}',
  registered_at timestamptz DEFAULT now(),
  cancelled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid REFERENCES event_registrations(id) ON DELETE CASCADE NOT NULL,
  checked_in_at timestamptz NOT NULL DEFAULT now(),
  checked_in_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- WIN-BACK AUTOMATION
CREATE TABLE IF NOT EXISTS winback_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  trigger_days_inactive integer NOT NULL DEFAULT 90,
  offer_type text CHECK (offer_type IN ('percentage', 'fixed', 'gift_card', 'free_item', 'none')),
  offer_value decimal(10,2),
  offer_code text,
  email_subject text NOT NULL,
  email_template text NOT NULL,
  sms_template text,
  send_email boolean DEFAULT true,
  send_sms boolean DEFAULT false,
  max_sends_per_customer integer DEFAULT 3,
  days_between_sends integer DEFAULT 14,
  total_sent integer DEFAULT 0,
  total_opened integer DEFAULT 0,
  total_clicked integer DEFAULT 0,
  total_conversions integer DEFAULT 0,
  total_revenue decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS winback_triggers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES winback_campaigns(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  triggered_at timestamptz DEFAULT now(),
  last_purchase_date timestamptz,
  days_inactive integer,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'sent', 'failed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS winback_outreach (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_id uuid REFERENCES winback_triggers(id) ON DELETE CASCADE NOT NULL,
  campaign_id uuid REFERENCES winback_campaigns(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  channel text NOT NULL CHECK (channel IN ('email', 'sms')),
  sent_at timestamptz DEFAULT now(),
  opened_at timestamptz,
  clicked_at timestamptz,
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS winback_conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  outreach_id uuid REFERENCES winback_outreach(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  order_id uuid,
  conversion_value decimal(10,2) NOT NULL,
  converted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);