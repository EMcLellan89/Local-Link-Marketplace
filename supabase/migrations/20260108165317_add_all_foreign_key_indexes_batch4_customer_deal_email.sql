/*
  # Add All Foreign Key Indexes - Batch 4 (Customer, Deal, Email, Event)
  
  1. Foreign Key Indexes for:
    - Customer, Deal, Ecommerce, Email, Event tables
*/

-- customer_activity_log
CREATE INDEX IF NOT EXISTS idx_customer_activity_log_business_unit_id 
  ON customer_activity_log(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_activity_log_customer_id 
  ON customer_activity_log(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_activity_log_performed_by 
  ON customer_activity_log(performed_by);

-- customer_business_relationships
CREATE INDEX IF NOT EXISTS idx_customer_business_relationships_business_unit_id 
  ON customer_business_relationships(business_unit_id);

-- customer_email_segments
CREATE INDEX IF NOT EXISTS idx_customer_email_segments_business_unit_id 
  ON customer_email_segments(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_email_segments_created_by 
  ON customer_email_segments(created_by);

-- customer_impersonation_log
CREATE INDEX IF NOT EXISTS idx_customer_impersonation_log_business_unit_id 
  ON customer_impersonation_log(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_impersonation_log_customer_id 
  ON customer_impersonation_log(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_impersonation_log_team_member_id 
  ON customer_impersonation_log(team_member_id);

-- customer_memberships
CREATE INDEX IF NOT EXISTS idx_customer_memberships_tier_id 
  ON customer_memberships(tier_id);

-- customer_support_tickets
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_assigned_to 
  ON customer_support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_business_unit_id 
  ON customer_support_tickets(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_customer_id 
  ON customer_support_tickets(customer_id);

-- deal_clicks
CREATE INDEX IF NOT EXISTS idx_deal_clicks_user_id 
  ON deal_clicks(user_id);

-- deal_impressions
CREATE INDEX IF NOT EXISTS idx_deal_impressions_user_id 
  ON deal_impressions(user_id);

-- deal_locations
CREATE INDEX IF NOT EXISTS idx_deal_locations_location_id 
  ON deal_locations(location_id);

-- deals
CREATE INDEX IF NOT EXISTS idx_deals_partner_id 
  ON deals(partner_id);
CREATE INDEX IF NOT EXISTS idx_deals_qr_code_id 
  ON deals(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_deals_territory_id 
  ON deals(territory_id);

-- ecommerce_orders
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_customer_id 
  ON ecommerce_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_merchant_id 
  ON ecommerce_orders(merchant_id);

-- email_automation_sequences
CREATE INDEX IF NOT EXISTS idx_email_automation_sequences_merchant_id 
  ON email_automation_sequences(merchant_id);

-- email_automation_steps
CREATE INDEX IF NOT EXISTS idx_email_automation_steps_template_id 
  ON email_automation_steps(template_id);

-- email_campaigns
CREATE INDEX IF NOT EXISTS idx_email_campaigns_merchant_id 
  ON email_campaigns(merchant_id);

-- email_communications
CREATE INDEX IF NOT EXISTS idx_email_communications_business_unit_id 
  ON email_communications(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_email_communications_customer_id 
  ON email_communications(customer_id);
CREATE INDEX IF NOT EXISTS idx_email_communications_sent_by 
  ON email_communications(sent_by);

-- email_queue
CREATE INDEX IF NOT EXISTS idx_email_queue_user_id 
  ON email_queue(user_id);

-- email_sends
CREATE INDEX IF NOT EXISTS idx_email_sends_campaign_id 
  ON email_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_subscriber_id 
  ON email_sends(subscriber_id);

-- event_attendance
CREATE INDEX IF NOT EXISTS idx_event_attendance_checked_in_by 
  ON event_attendance(checked_in_by);
CREATE INDEX IF NOT EXISTS idx_event_attendance_registration_id 
  ON event_attendance(registration_id);

-- event_registrations
CREATE INDEX IF NOT EXISTS idx_event_registrations_customer_id 
  ON event_registrations(customer_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id 
  ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_ticket_id 
  ON event_registrations(ticket_id);

-- event_series
CREATE INDEX IF NOT EXISTS idx_event_series_merchant_id 
  ON event_series(merchant_id);

-- event_tickets
CREATE INDEX IF NOT EXISTS idx_event_tickets_event_id 
  ON event_tickets(event_id);

-- events
CREATE INDEX IF NOT EXISTS idx_events_merchant_id 
  ON events(merchant_id);
CREATE INDEX IF NOT EXISTS idx_events_series_id 
  ON events(series_id);

-- expansion_requests
CREATE INDEX IF NOT EXISTS idx_expansion_requests_partner_id 
  ON expansion_requests(partner_id);

-- expenses
CREATE INDEX IF NOT EXISTS idx_expenses_merchant_id 
  ON expenses(merchant_id);

-- external_business_webhooks
CREATE INDEX IF NOT EXISTS idx_external_business_webhooks_business_unit_id 
  ON external_business_webhooks(business_unit_id);
