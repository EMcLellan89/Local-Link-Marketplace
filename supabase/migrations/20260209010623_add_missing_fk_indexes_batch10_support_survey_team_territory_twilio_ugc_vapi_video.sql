/*
  # Add Missing Foreign Key Indexes - Batch 10
  
  1. Tables Covered
    - Support tables (support_messages, support_tickets)
    - Survey tables (survey_responses, surveys)
    - Territory tables (territory_licenses)
    - Transaction tables (transaction_categorizations, transactions)
    - Twilio tables (twilio_call_logs, twilio_call_queues, twilio_configurations, twilio_email_logs, twilio_phone_numbers, twilio_sms_logs, twilio_voicemails)
    - UGC tables (ugc_assets, ugc_orders, ugc_payouts)
    - VAPI tables (vapi_assistants, vapi_call_logs, vapi_configurations, vapi_tools)
    - Video tables (video_deliverables, video_revisions, video_scripts, video_service_orders)
    
  2. Performance Impact
    - Adds indexes on foreign key columns to prevent N+1 queries
    - Improves JOIN performance for support, communications, and media services
    - Critical for customer support, UGC orders, and video production workflows
    
  3. Security
    - No security changes, only performance optimization
*/

-- Support tables
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id ON support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_merchant_id ON support_tickets(merchant_id);

-- Survey tables
CREATE INDEX IF NOT EXISTS idx_survey_responses_customer_id ON survey_responses(customer_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_purchase_id ON survey_responses(purchase_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_surveys_merchant_id ON surveys(merchant_id);

-- Territory tables
CREATE INDEX IF NOT EXISTS idx_territory_licenses_partner_id ON territory_licenses(partner_id);
CREATE INDEX IF NOT EXISTS idx_territory_licenses_pricing_tier_id ON territory_licenses(pricing_tier_id);
CREATE INDEX IF NOT EXISTS idx_territory_licenses_territory_id ON territory_licenses(territory_id);

-- Transaction tables
CREATE INDEX IF NOT EXISTS idx_transaction_categorizations_coa_id ON transaction_categorizations(coa_id);
CREATE INDEX IF NOT EXISTS idx_transaction_categorizations_merchant_id ON transaction_categorizations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_transaction_categorizations_transaction_id ON transaction_categorizations(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_merchant_id ON transactions(merchant_id);

-- Twilio tables
CREATE INDEX IF NOT EXISTS idx_twilio_call_logs_lead_id ON twilio_call_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_call_logs_merchant_id ON twilio_call_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_call_queues_merchant_id ON twilio_call_queues(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_configurations_merchant_id ON twilio_configurations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_email_logs_lead_id ON twilio_email_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_email_logs_merchant_id ON twilio_email_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_phone_numbers_merchant_id ON twilio_phone_numbers(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_sms_logs_lead_id ON twilio_sms_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_sms_logs_merchant_id ON twilio_sms_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_twilio_voicemails_lead_id ON twilio_voicemails(lead_id);
CREATE INDEX IF NOT EXISTS idx_twilio_voicemails_merchant_id ON twilio_voicemails(merchant_id);

-- UGC tables
CREATE INDEX IF NOT EXISTS idx_ugc_assets_order_id ON ugc_assets(order_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_creator_id ON ugc_orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_merchant_id ON ugc_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_package_id ON ugc_orders(package_id);
CREATE INDEX IF NOT EXISTS idx_ugc_payouts_creator_id ON ugc_payouts(creator_id);
CREATE INDEX IF NOT EXISTS idx_ugc_payouts_order_id ON ugc_payouts(order_id);

-- VAPI tables
CREATE INDEX IF NOT EXISTS idx_vapi_assistants_merchant_id ON vapi_assistants(merchant_id);
CREATE INDEX IF NOT EXISTS idx_vapi_call_logs_assistant_id ON vapi_call_logs(assistant_id);
CREATE INDEX IF NOT EXISTS idx_vapi_call_logs_customer_id ON vapi_call_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_vapi_call_logs_merchant_id ON vapi_call_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_vapi_configurations_merchant_id ON vapi_configurations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_vapi_tools_assistant_id ON vapi_tools(assistant_id);

-- Video tables
CREATE INDEX IF NOT EXISTS idx_video_deliverables_order_id ON video_deliverables(order_id);
CREATE INDEX IF NOT EXISTS idx_video_revisions_order_id ON video_revisions(order_id);
CREATE INDEX IF NOT EXISTS idx_video_revisions_requested_by ON video_revisions(requested_by);
CREATE INDEX IF NOT EXISTS idx_video_scripts_approved_by ON video_scripts(approved_by);
CREATE INDEX IF NOT EXISTS idx_video_scripts_order_id ON video_scripts(order_id);
CREATE INDEX IF NOT EXISTS idx_video_service_orders_merchant_id ON video_service_orders(merchant_id);
