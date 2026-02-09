/*
  # Add All Foreign Key Indexes - Batch 11 (Territory, Ticket, Transaction, Twilio)
  
  1. Foreign Key Indexes for:
    - Territory, Ticket, Transaction, Twilio tables
*/

-- territories
CREATE INDEX IF NOT EXISTS idx_territories_assigned_partner_id 
  ON territories(assigned_partner_id);
CREATE INDEX IF NOT EXISTS idx_territories_parent_territory_id 
  ON territories(parent_territory_id);

-- territory_licenses
CREATE INDEX IF NOT EXISTS idx_territory_licenses_partner_id 
  ON territory_licenses(partner_id);
CREATE INDEX IF NOT EXISTS idx_territory_licenses_pricing_tier_id 
  ON territory_licenses(pricing_tier_id);
CREATE INDEX IF NOT EXISTS idx_territory_licenses_territory_id 
  ON territory_licenses(territory_id);

-- ticket_messages
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id 
  ON ticket_messages(ticket_id);

-- transactions
CREATE INDEX IF NOT EXISTS idx_transactions_deal_id 
  ON transactions(deal_id);
CREATE INDEX IF NOT EXISTS idx_transactions_merchant_id 
  ON transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_partner_id 
  ON transactions(partner_id);
CREATE INDEX IF NOT EXISTS idx_transactions_territory_id 
  ON transactions(territory_id);

-- twilio_call_logs
CREATE INDEX IF NOT EXISTS idx_twilio_call_logs_lead_id 
  ON twilio_call_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_call_logs_merchant_id 
  ON twilio_call_logs(merchant_id);

-- twilio_call_queues
CREATE INDEX IF NOT EXISTS idx_twilio_call_queues_merchant_id 
  ON twilio_call_queues(merchant_id);

-- twilio_email_logs
CREATE INDEX IF NOT EXISTS idx_twilio_email_logs_lead_id 
  ON twilio_email_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_email_logs_merchant_id 
  ON twilio_email_logs(merchant_id);

-- twilio_phone_numbers
CREATE INDEX IF NOT EXISTS idx_twilio_phone_numbers_merchant_id 
  ON twilio_phone_numbers(merchant_id);

-- twilio_sms_logs
CREATE INDEX IF NOT EXISTS idx_twilio_sms_logs_lead_id 
  ON twilio_sms_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_sms_logs_merchant_id 
  ON twilio_sms_logs(merchant_id);

-- twilio_voicemails
CREATE INDEX IF NOT EXISTS idx_twilio_voicemails_lead_id 
  ON twilio_voicemails(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_voicemails_merchant_id 
  ON twilio_voicemails(merchant_id);
