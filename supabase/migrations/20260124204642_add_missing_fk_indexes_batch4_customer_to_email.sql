/*
  # Add Missing Foreign Key Indexes - Batch 4 (Customer to Email)

  Adds indexes for foreign keys that are missing covering indexes.
  
  Tables covered:
  - Customer activity/business/email/impersonation/membership/support tables
  - Deal tables
  - Ecommerce tables
  - Email tables
*/

-- Customer Tables
CREATE INDEX IF NOT EXISTS idx_customer_activity_log_business_unit_id ON customer_activity_log(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_activity_log_customer_id ON customer_activity_log(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_activity_log_performed_by ON customer_activity_log(performed_by);
CREATE INDEX IF NOT EXISTS idx_customer_business_relationships_business_unit_id ON customer_business_relationships(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_email_segments_business_unit_id ON customer_email_segments(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_email_segments_created_by ON customer_email_segments(created_by);
CREATE INDEX IF NOT EXISTS idx_customer_impersonation_log_business_unit_id ON customer_impersonation_log(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_impersonation_log_customer_id ON customer_impersonation_log(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_impersonation_log_team_member_id ON customer_impersonation_log(team_member_id);
CREATE INDEX IF NOT EXISTS idx_customer_memberships_tier_id ON customer_memberships(tier_id);
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_assigned_to ON customer_support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_business_unit_id ON customer_support_tickets(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_customer_id ON customer_support_tickets(customer_id);

-- Deal Tables
CREATE INDEX IF NOT EXISTS idx_deal_clicks_user_id ON deal_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_deal_impressions_user_id ON deal_impressions(user_id);
CREATE INDEX IF NOT EXISTS idx_deal_locations_location_id ON deal_locations(location_id);
CREATE INDEX IF NOT EXISTS idx_deals_partner_id ON deals(partner_id);
CREATE INDEX IF NOT EXISTS idx_deals_qr_code_id ON deals(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_deals_territory_id ON deals(territory_id);

-- Ecommerce Tables
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_customer_id ON ecommerce_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_merchant_id ON ecommerce_orders(merchant_id);

-- Email Tables
CREATE INDEX IF NOT EXISTS idx_email_automation_sequences_merchant_id ON email_automation_sequences(merchant_id);
CREATE INDEX IF NOT EXISTS idx_email_automation_steps_template_id ON email_automation_steps(template_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_merchant_id ON email_campaigns(merchant_id);
CREATE INDEX IF NOT EXISTS idx_email_communications_business_unit_id ON email_communications(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_email_communications_customer_id ON email_communications(customer_id);
CREATE INDEX IF NOT EXISTS idx_email_communications_sent_by ON email_communications(sent_by);
CREATE INDEX IF NOT EXISTS idx_email_queue_user_id ON email_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_campaign_id ON email_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_subscriber_id ON email_sends(subscriber_id);
