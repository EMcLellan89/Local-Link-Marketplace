/*
  # Add Revenue Features - Part 2: Indexes and RLS (Fixed)

  ## Adds performance indexes and Row Level Security policies for new feature tables
  
  ## Security Approach:
  - Merchants can only access their own data
  - Customers can view public data and their own transactions
  - All tables have restrictive RLS enabled
*/

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Email Marketing
CREATE INDEX IF NOT EXISTS idx_email_campaigns_merchant ON email_campaigns(merchant_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_merchant ON email_subscribers(merchant_id);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_sends_campaign ON email_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_subscriber ON email_sends(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_email_automation_sequences_merchant ON email_automation_sequences(merchant_id);
CREATE INDEX IF NOT EXISTS idx_email_automation_steps_sequence ON email_automation_steps(sequence_id);

-- E-commerce
CREATE INDEX IF NOT EXISTS idx_product_categories_merchant ON product_categories(merchant_id);
CREATE INDEX IF NOT EXISTS idx_products_merchant_new ON products(merchant_id);
CREATE INDEX IF NOT EXISTS idx_products_category_new ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status_new ON products(status);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_merchant ON ecommerce_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_customer ON ecommerce_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_status ON ecommerce_orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_merchant ON shopping_carts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_customer ON shopping_carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);

-- Reputation Management
CREATE INDEX IF NOT EXISTS idx_reputation_platforms_merchant ON reputation_platforms(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reputation_reviews_merchant ON reputation_reviews(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reputation_reviews_platform ON reputation_reviews(platform_id);
CREATE INDEX IF NOT EXISTS idx_reputation_reviews_sentiment ON reputation_reviews(sentiment);
CREATE INDEX IF NOT EXISTS idx_reputation_reviews_date ON reputation_reviews(review_date);
CREATE INDEX IF NOT EXISTS idx_reputation_responses_review ON reputation_responses(review_id);
CREATE INDEX IF NOT EXISTS idx_reputation_campaigns_merchant ON reputation_campaigns(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reputation_alerts_merchant ON reputation_alerts(merchant_id);

-- Video Services
CREATE INDEX IF NOT EXISTS idx_video_orders_merchant ON video_service_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_video_orders_status ON video_service_orders(status);
CREATE INDEX IF NOT EXISTS idx_video_scripts_order ON video_scripts(order_id);
CREATE INDEX IF NOT EXISTS idx_video_deliverables_order ON video_deliverables(order_id);
CREATE INDEX IF NOT EXISTS idx_video_revisions_order ON video_revisions(order_id);

-- Business Intelligence
CREATE INDEX IF NOT EXISTS idx_bi_reports_merchant ON bi_reports(merchant_id);
CREATE INDEX IF NOT EXISTS idx_bi_metrics_merchant ON bi_metrics(merchant_id);
CREATE INDEX IF NOT EXISTS idx_bi_metrics_date ON bi_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_bi_competitor_tracking_merchant ON bi_competitor_tracking(merchant_id);
CREATE INDEX IF NOT EXISTS idx_bi_predictions_merchant ON bi_predictions(merchant_id);

-- Referral Programs
CREATE INDEX IF NOT EXISTS idx_referral_programs_merchant ON referral_programs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_referral_links_program ON referral_links(program_id);
CREATE INDEX IF NOT EXISTS idx_referral_links_customer ON referral_links(customer_id);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_link ON referral_conversions(referral_link_id);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_referee ON referral_conversions(referee_customer_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_customer ON referral_rewards(customer_id);

-- Events
CREATE INDEX IF NOT EXISTS idx_event_series_merchant ON event_series(merchant_id);
CREATE INDEX IF NOT EXISTS idx_events_merchant ON events(merchant_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_series ON events(series_id);
CREATE INDEX IF NOT EXISTS idx_event_tickets_event ON event_tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_customer ON event_registrations(customer_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_registration ON event_attendance(registration_id);

-- Win-back
CREATE INDEX IF NOT EXISTS idx_winback_campaigns_merchant ON winback_campaigns(merchant_id);
CREATE INDEX IF NOT EXISTS idx_winback_triggers_campaign ON winback_triggers(campaign_id);
CREATE INDEX IF NOT EXISTS idx_winback_triggers_customer ON winback_triggers(customer_id);
CREATE INDEX IF NOT EXISTS idx_winback_outreach_trigger ON winback_outreach(trigger_id);
CREATE INDEX IF NOT EXISTS idx_winback_outreach_customer ON winback_outreach(customer_id);
CREATE INDEX IF NOT EXISTS idx_winback_conversions_outreach ON winback_conversions(outreach_id);

-- =====================================================
-- ROW LEVEL SECURITY - EMAIL MARKETING
-- =====================================================

ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_automation_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_automation_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants manage their email campaigns"
  ON email_campaigns FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Merchants manage their email templates"
  ON email_templates FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()) OR merchant_id IS NULL)
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Merchants manage their subscribers"
  ON email_subscribers FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Merchants view their email sends"
  ON email_sends FOR SELECT TO authenticated
  USING (campaign_id IN (SELECT id FROM email_campaigns WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())));

CREATE POLICY "Merchants manage their automation sequences"
  ON email_automation_sequences FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Merchants manage their automation steps"
  ON email_automation_steps FOR ALL TO authenticated
  USING (sequence_id IN (SELECT id FROM email_automation_sequences WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())))
  WITH CHECK (sequence_id IN (SELECT id FROM email_automation_sequences WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())));

-- =====================================================
-- ROW LEVEL SECURITY - E-COMMERCE
-- =====================================================

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone views published products"
  ON products FOR SELECT TO authenticated
  USING (status = 'active');

CREATE POLICY "Merchants manage their products"
  ON products FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Anyone views product categories"
  ON product_categories FOR SELECT TO authenticated
  USING (is_active = true);

CREATE POLICY "Merchants manage their categories"
  ON product_categories FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Anyone views active product variants"
  ON product_variants FOR SELECT TO authenticated
  USING (product_id IN (SELECT id FROM products WHERE status = 'active'));

CREATE POLICY "Merchants manage their product variants"
  ON product_variants FOR ALL TO authenticated
  USING (product_id IN (SELECT id FROM products WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())))
  WITH CHECK (product_id IN (SELECT id FROM products WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())));

CREATE POLICY "Merchants view their orders"
  ON ecommerce_orders FOR SELECT TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Customers view their orders"
  ON ecommerce_orders FOR SELECT TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Merchants update their orders"
  ON ecommerce_orders FOR UPDATE TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Merchants view order items"
  ON order_items FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM ecommerce_orders WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())));

CREATE POLICY "Customers view their order items"
  ON order_items FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM ecommerce_orders WHERE customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())));

CREATE POLICY "Customers manage their cart"
  ON shopping_carts FOR ALL TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()))
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Customers manage their cart items"
  ON cart_items FOR ALL TO authenticated
  USING (cart_id IN (SELECT id FROM shopping_carts WHERE customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())))
  WITH CHECK (cart_id IN (SELECT id FROM shopping_carts WHERE customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())));

-- =====================================================
-- ROW LEVEL SECURITY - REPUTATION MANAGEMENT
-- =====================================================

ALTER TABLE reputation_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reputation_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE reputation_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reputation_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE reputation_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants manage their reputation platforms"
  ON reputation_platforms FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Anyone views public reviews"
  ON reputation_reviews FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Merchants manage reviews for their business"
  ON reputation_reviews FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Merchants manage their review responses"
  ON reputation_responses FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Merchants manage their reputation campaigns"
  ON reputation_campaigns FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Merchants manage their reputation alerts"
  ON reputation_alerts FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

-- =====================================================
-- ROW LEVEL SECURITY - VIDEO SERVICES
-- =====================================================

ALTER TABLE video_service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants manage their video orders"
  ON video_service_orders FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Merchants view their video scripts"
  ON video_scripts FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM video_service_orders WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())));

CREATE POLICY "Merchants view their video deliverables"
  ON video_deliverables FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM video_service_orders WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())));

CREATE POLICY "Merchants manage their video revisions"
  ON video_revisions FOR ALL TO authenticated
  USING (order_id IN (SELECT id FROM video_service_orders WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())))
  WITH CHECK (order_id IN (SELECT id FROM video_service_orders WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())));

-- =====================================================
-- ROW LEVEL SECURITY - BUSINESS INTELLIGENCE
-- =====================================================

ALTER TABLE bi_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE bi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE bi_competitor_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE bi_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants manage their BI reports"
  ON bi_reports FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Merchants view their BI metrics"
  ON bi_metrics FOR SELECT TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Merchants manage their competitor tracking"
  ON bi_competitor_tracking FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Merchants view their BI predictions"
  ON bi_predictions FOR SELECT TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

-- =====================================================
-- ROW LEVEL SECURITY - REFERRAL PROGRAMS
-- =====================================================

ALTER TABLE referral_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants manage their referral programs"
  ON referral_programs FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Customers view their referral links"
  ON referral_links FOR SELECT TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Merchants view all referral links"
  ON referral_links FOR SELECT TO authenticated
  USING (program_id IN (SELECT id FROM referral_programs WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())));

CREATE POLICY "Customers view their referral conversions"
  ON referral_conversions FOR SELECT TO authenticated
  USING (referral_link_id IN (SELECT id FROM referral_links WHERE customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())));

CREATE POLICY "Merchants view all referral conversions"
  ON referral_conversions FOR SELECT TO authenticated
  USING (referral_link_id IN (SELECT id FROM referral_links WHERE program_id IN (SELECT id FROM referral_programs WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))));

CREATE POLICY "Customers view their referral rewards"
  ON referral_rewards FOR SELECT TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

-- =====================================================
-- ROW LEVEL SECURITY - EVENTS
-- =====================================================

ALTER TABLE event_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants manage their event series"
  ON event_series FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Anyone views published events"
  ON events FOR SELECT TO authenticated
  USING (is_published = true AND status = 'scheduled');

CREATE POLICY "Merchants manage their events"
  ON events FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Anyone views available event tickets"
  ON event_tickets FOR SELECT TO authenticated
  USING (is_active = true AND event_id IN (SELECT id FROM events WHERE is_published = true));

CREATE POLICY "Merchants manage their event tickets"
  ON event_tickets FOR ALL TO authenticated
  USING (event_id IN (SELECT id FROM events WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())))
  WITH CHECK (event_id IN (SELECT id FROM events WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())));

CREATE POLICY "Merchants view their event registrations"
  ON event_registrations FOR SELECT TO authenticated
  USING (event_id IN (SELECT id FROM events WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())));

CREATE POLICY "Customers view their event registrations"
  ON event_registrations FOR SELECT TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Customers create event registrations"
  ON event_registrations FOR INSERT TO authenticated
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()) OR customer_id IS NULL);

CREATE POLICY "Merchants manage event attendance"
  ON event_attendance FOR ALL TO authenticated
  USING (registration_id IN (SELECT id FROM event_registrations WHERE event_id IN (SELECT id FROM events WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))))
  WITH CHECK (registration_id IN (SELECT id FROM event_registrations WHERE event_id IN (SELECT id FROM events WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))));

-- =====================================================
-- ROW LEVEL SECURITY - WIN-BACK AUTOMATION
-- =====================================================

ALTER TABLE winback_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE winback_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE winback_outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE winback_conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants manage their winback campaigns"
  ON winback_campaigns FOR ALL TO authenticated
  USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))
  WITH CHECK (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));

CREATE POLICY "Merchants view their winback triggers"
  ON winback_triggers FOR SELECT TO authenticated
  USING (campaign_id IN (SELECT id FROM winback_campaigns WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())));

CREATE POLICY "Merchants view their winback outreach"
  ON winback_outreach FOR SELECT TO authenticated
  USING (campaign_id IN (SELECT id FROM winback_campaigns WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())));

CREATE POLICY "Merchants view their winback conversions"
  ON winback_conversions FOR SELECT TO authenticated
  USING (outreach_id IN (SELECT id FROM winback_outreach WHERE campaign_id IN (SELECT id FROM winback_campaigns WHERE merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()))));