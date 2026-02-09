/*
  # Add Missing Foreign Key Indexes - Batch 10: Events & Winback

  1. Changes
    - Add indexes for referral_rewards (customer_id)
    - Add indexes for event_series, events, event_tickets (merchant_id, series_id, event_id)
    - Add indexes for event_registrations (customer_id, event_id, ticket_id)
    - Add indexes for event_attendance (registration_id, checked_in_by)
    - Add indexes for winback_campaigns (merchant_id)
    - Add indexes for winback_triggers (campaign_id, customer_id)
    - Add indexes for winback_outreach (campaign_id, customer_id, trigger_id)
    - Add indexes for winback_conversions (customer_id, outreach_id)
    
  2. Rationale
    - Event management requires efficient registration queries
    - Winback campaigns need fast customer targeting
    
  3. Performance Impact
    - Faster event registration lookups
    - Better winback campaign performance
*/

-- Referral Rewards
CREATE INDEX IF NOT EXISTS idx_referral_rewards_customer_id ON referral_rewards(customer_id);

-- Event Series
CREATE INDEX IF NOT EXISTS idx_event_series_merchant_id ON event_series(merchant_id);

-- Events
CREATE INDEX IF NOT EXISTS idx_events_merchant_id ON events(merchant_id);
CREATE INDEX IF NOT EXISTS idx_events_series_id ON events(series_id);

-- Event Tickets
CREATE INDEX IF NOT EXISTS idx_event_tickets_event_id ON event_tickets(event_id);

-- Event Registrations
CREATE INDEX IF NOT EXISTS idx_event_registrations_customer_id ON event_registrations(customer_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_ticket_id ON event_registrations(ticket_id);

-- Event Attendance
CREATE INDEX IF NOT EXISTS idx_event_attendance_registration_id ON event_attendance(registration_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_checked_in_by ON event_attendance(checked_in_by);

-- Winback Campaigns
CREATE INDEX IF NOT EXISTS idx_winback_campaigns_merchant_id ON winback_campaigns(merchant_id);

-- Winback Triggers
CREATE INDEX IF NOT EXISTS idx_winback_triggers_campaign_id ON winback_triggers(campaign_id);
CREATE INDEX IF NOT EXISTS idx_winback_triggers_customer_id ON winback_triggers(customer_id);

-- Winback Outreach
CREATE INDEX IF NOT EXISTS idx_winback_outreach_campaign_id ON winback_outreach(campaign_id);
CREATE INDEX IF NOT EXISTS idx_winback_outreach_customer_id ON winback_outreach(customer_id);
CREATE INDEX IF NOT EXISTS idx_winback_outreach_trigger_id ON winback_outreach(trigger_id);

-- Winback Conversions
CREATE INDEX IF NOT EXISTS idx_winback_conversions_customer_id ON winback_conversions(customer_id);
CREATE INDEX IF NOT EXISTS idx_winback_conversions_outreach_id ON winback_conversions(outreach_id);
