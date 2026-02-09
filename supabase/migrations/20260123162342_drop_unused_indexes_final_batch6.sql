/*
  # Drop Unused Indexes - Final Batch 6 (Email and Event Tables)

  This migration removes unused indexes from email and event-related tables.

  Tables covered:
  - email_automation_sequences
  - email_automation_steps
  - email_campaigns
  - email_communications
  - email_queue
  - email_sends
  - event_attendance
  - event_registrations
  - event_series
  - event_tickets
  - events
  - expansion_requests
  - expenses
  - external_business_webhooks
*/

-- Email Tables
DROP INDEX IF EXISTS idx_email_automation_sequences_merchant_id;
DROP INDEX IF EXISTS idx_email_automation_steps_template_id;
DROP INDEX IF EXISTS idx_email_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_email_communications_business_unit_id;
DROP INDEX IF EXISTS idx_email_communications_customer_id;
DROP INDEX IF EXISTS idx_email_communications_sent_by;
DROP INDEX IF EXISTS idx_email_queue_user_id;
DROP INDEX IF EXISTS idx_email_sends_campaign_id;
DROP INDEX IF EXISTS idx_email_sends_subscriber_id;

-- Event Tables
DROP INDEX IF EXISTS idx_event_attendance_checked_in_by;
DROP INDEX IF EXISTS idx_event_attendance_registration_id;
DROP INDEX IF EXISTS idx_event_registrations_customer_id;
DROP INDEX IF EXISTS idx_event_registrations_event_id;
DROP INDEX IF EXISTS idx_event_registrations_ticket_id;
DROP INDEX IF EXISTS idx_event_series_merchant_id;
DROP INDEX IF EXISTS idx_event_tickets_event_id;
DROP INDEX IF EXISTS idx_events_merchant_id;
DROP INDEX IF EXISTS idx_events_series_id;

-- Other Tables
DROP INDEX IF EXISTS idx_expansion_requests_partner_id;
DROP INDEX IF EXISTS idx_expenses_merchant_id;
DROP INDEX IF EXISTS idx_external_business_webhooks_business_unit_id;