/*
  # Drop Unused Indexes - Batch 6: DFY and Email Tables

  1. Changes
    - Drop unused indexes from dfy_* (Done-For-You) tables
    - Drop unused indexes from email_* tables
    - Drop unused indexes from ecommerce and event tables
    
  2. Rationale
    - These indexes have idx_scan = 0, never used by queries
    - Reduces database overhead
*/

-- DFY (Done-For-You) tables
DROP INDEX IF EXISTS idx_dfy_ad_vault_product_slug;
DROP INDEX IF EXISTS idx_dfy_campaign_steps_campaign_id;
DROP INDEX IF EXISTS idx_dfy_commission_ledger_order_id;
DROP INDEX IF EXISTS idx_dfy_content_items_pack_id;
DROP INDEX IF EXISTS idx_dfy_disputes_job_id;
DROP INDEX IF EXISTS idx_dfy_fulfillment_tasks_order_id;
DROP INDEX IF EXISTS idx_dfy_intakes_merchant_id;
DROP INDEX IF EXISTS idx_dfy_intakes_provider_id;
DROP INDEX IF EXISTS idx_dfy_job_submissions_job_id;
DROP INDEX IF EXISTS idx_dfy_jobs_merchant_order;
DROP INDEX IF EXISTS idx_dfy_jobs_service_id;
DROP INDEX IF EXISTS idx_dfy_jobs_service_type;
DROP INDEX IF EXISTS idx_dfy_jobs_stripe_session;
DROP INDEX IF EXISTS idx_dfy_onboarding_order_id;
DROP INDEX IF EXISTS idx_dfy_orders_product_id;
DROP INDEX IF EXISTS idx_dfy_orders_referral_partner_id;
DROP INDEX IF EXISTS idx_dfy_orders_user_id;
DROP INDEX IF EXISTS idx_dfy_product_stripe_product_id;
DROP INDEX IF EXISTS idx_dfy_updates_intake_id;

-- Ecommerce tables
DROP INDEX IF EXISTS idx_ecommerce_orders_customer_id;
DROP INDEX IF EXISTS idx_ecommerce_orders_merchant_id;

-- Email automation
DROP INDEX IF EXISTS idx_email_automation_sequences_merchant_id;
DROP INDEX IF EXISTS idx_email_automation_steps_sequence_id;
DROP INDEX IF EXISTS idx_email_automation_steps_template_id;

-- Email campaigns
DROP INDEX IF EXISTS idx_email_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_email_campaigns_template_id;
DROP INDEX IF EXISTS idx_email_communications_business_unit_id;
DROP INDEX IF EXISTS idx_email_communications_customer_id;
DROP INDEX IF EXISTS idx_email_communications_sent_by;
DROP INDEX IF EXISTS idx_email_queue_user_id;
DROP INDEX IF EXISTS idx_email_sends_campaign_id;
DROP INDEX IF EXISTS idx_email_sends_subscriber_id;
DROP INDEX IF EXISTS idx_email_subscribers_merchant_id;
DROP INDEX IF EXISTS idx_email_templates_merchant_id;

-- Enrollments
DROP INDEX IF EXISTS idx_enrollments_course_id;
DROP INDEX IF EXISTS idx_enrollments_user_id;

-- Event tables
DROP INDEX IF EXISTS idx_event_attendance_checked_in_by;
DROP INDEX IF EXISTS idx_event_attendance_registration_id;
DROP INDEX IF EXISTS idx_event_registrations_customer_id;
DROP INDEX IF EXISTS idx_event_registrations_event_id;
DROP INDEX IF EXISTS idx_event_registrations_ticket_id;
DROP INDEX IF EXISTS idx_event_series_merchant_id;
DROP INDEX IF EXISTS idx_event_tickets_event_id;
DROP INDEX IF EXISTS idx_events_merchant_id;
DROP INDEX IF EXISTS idx_events_series_id;

-- Expansion and expenses
DROP INDEX IF EXISTS idx_expansion_requests_partner_id;
DROP INDEX IF EXISTS idx_expenses_merchant_id;
