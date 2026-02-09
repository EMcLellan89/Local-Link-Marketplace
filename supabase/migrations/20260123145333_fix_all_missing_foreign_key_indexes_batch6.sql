/*
  # Fix Missing Foreign Key Indexes - Batch 6 (Deal, Ecommerce, Email, Event Tables)
  
  1. Performance
    - Add indexes on all unindexed foreign keys
  
  2. Tables Updated
    - deal tables
    - ecommerce_orders
    - email tables
    - event tables
*/

CREATE INDEX IF NOT EXISTS idx_deal_clicks_user_id ON deal_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_deal_impressions_user_id ON deal_impressions(user_id);
CREATE INDEX IF NOT EXISTS idx_deal_locations_location_id ON deal_locations(location_id);
CREATE INDEX IF NOT EXISTS idx_deals_partner_id ON deals(partner_id);
CREATE INDEX IF NOT EXISTS idx_deals_qr_code_id ON deals(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_deals_territory_id ON deals(territory_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_customer_id ON ecommerce_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_merchant_id ON ecommerce_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_email_automation_sequences_merchant_id ON email_automation_sequences(merchant_id);
CREATE INDEX IF NOT EXISTS idx_email_automation_steps_template_id ON email_automation_steps(template_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_merchant_id ON email_campaigns(merchant_id);
CREATE INDEX IF NOT EXISTS idx_email_communications_business_unit_id ON email_communications(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_email_communications_customer_id ON email_communications(customer_id);
CREATE INDEX IF NOT EXISTS idx_email_communications_sent_by ON email_communications(sent_by);
CREATE INDEX IF NOT EXISTS idx_email_queue_user_id ON email_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_campaign_id ON email_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_subscriber_id ON email_sends(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_checked_in_by ON event_attendance(checked_in_by);
CREATE INDEX IF NOT EXISTS idx_event_attendance_registration_id ON event_attendance(registration_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_customer_id ON event_registrations(customer_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_ticket_id ON event_registrations(ticket_id);
CREATE INDEX IF NOT EXISTS idx_event_series_merchant_id ON event_series(merchant_id);
CREATE INDEX IF NOT EXISTS idx_event_tickets_event_id ON event_tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_events_merchant_id ON events(merchant_id);
CREATE INDEX IF NOT EXISTS idx_events_series_id ON events(series_id);
