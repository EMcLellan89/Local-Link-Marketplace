/*
  # Drop Twilio System — Use Retell AI + Brevo

  Twilio has been fully replaced:
  - Voice calls → Retell AI (make-call function)
  - SMS → Brevo transactional SMS (sms-send function)
  - Email → Brevo SMTP (email-send function)
  - Inbound SMS webhook → sms-webhook-inbound function

  ## Changes
  1. Drop all twilio_* tables (configurations, phone_numbers, call_logs, sms_logs, email_logs, voicemails, call_queues)
  2. Drop twilio_sid column from partners table if it exists
  3. Remove any Twilio vendor deals from business_deals by slug pattern
*/

-- Drop Twilio tables
DROP TABLE IF EXISTS twilio_call_queues CASCADE;
DROP TABLE IF EXISTS twilio_voicemails CASCADE;
DROP TABLE IF EXISTS twilio_email_logs CASCADE;
DROP TABLE IF EXISTS twilio_sms_logs CASCADE;
DROP TABLE IF EXISTS twilio_call_logs CASCADE;
DROP TABLE IF EXISTS twilio_phone_numbers CASCADE;
DROP TABLE IF EXISTS twilio_configurations CASCADE;

-- Remove twilio_sid column from partners if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'twilio_sid'
  ) THEN
    ALTER TABLE partners DROP COLUMN twilio_sid;
  END IF;
END $$;

-- Remove Twilio vendor/deal entries from business_deals hub if present
DELETE FROM business_deals WHERE slug ILIKE '%twilio%';

-- Remove Twilio vendor entries if business_vendors table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'business_vendors'
  ) THEN
    EXECUTE 'DELETE FROM business_vendors WHERE slug ILIKE ''%twilio%''';
  END IF;
END $$;
