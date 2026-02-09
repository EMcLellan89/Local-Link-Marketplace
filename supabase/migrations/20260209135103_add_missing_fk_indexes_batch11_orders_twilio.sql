/*
  # Add Missing Foreign Key Indexes - Batch 11: Orders & Twilio Communications

  1. Changes
    - Add indexes for orders (customer_account_id, partner_id)
    - Add indexes for twilio_phone_numbers (merchant_id)
    - Add indexes for twilio_call_logs (merchant_id, lead_id)
    - Add indexes for twilio_sms_logs (merchant_id, lead_id)
    - Add indexes for twilio_email_logs (merchant_id, lead_id)
    - Add indexes for twilio_voicemails (merchant_id, lead_id)
    - Add indexes for twilio_call_queues (merchant_id)
    - Add indexes for course_exam_attempts (user_id)
    
  2. Rationale
    - Order tracking requires fast customer lookups
    - Twilio communication logs need efficient merchant filtering
    - Course exam tracking needs user lookups
    
  3. Performance Impact
    - Faster order history queries
    - Better communication log filtering
    - Improved exam result lookups
*/

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_customer_account_id ON orders(customer_account_id);
CREATE INDEX IF NOT EXISTS idx_orders_partner_id ON orders(partner_id);

-- Twilio Phone Numbers
CREATE INDEX IF NOT EXISTS idx_twilio_phone_numbers_merchant_id ON twilio_phone_numbers(merchant_id);

-- Twilio Call Logs
CREATE INDEX IF NOT EXISTS idx_twilio_call_logs_merchant_id ON twilio_call_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_call_logs_lead_id ON twilio_call_logs(lead_id);

-- Twilio SMS Logs
CREATE INDEX IF NOT EXISTS idx_twilio_sms_logs_merchant_id ON twilio_sms_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_sms_logs_lead_id ON twilio_sms_logs(lead_id);

-- Twilio Email Logs
CREATE INDEX IF NOT EXISTS idx_twilio_email_logs_merchant_id ON twilio_email_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_email_logs_lead_id ON twilio_email_logs(lead_id);

-- Twilio Voicemails
CREATE INDEX IF NOT EXISTS idx_twilio_voicemails_merchant_id ON twilio_voicemails(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_voicemails_lead_id ON twilio_voicemails(lead_id);

-- Twilio Call Queues
CREATE INDEX IF NOT EXISTS idx_twilio_call_queues_merchant_id ON twilio_call_queues(merchant_id);

-- Course Exam Attempts
CREATE INDEX IF NOT EXISTS idx_course_exam_attempts_user_id ON course_exam_attempts(user_id);
