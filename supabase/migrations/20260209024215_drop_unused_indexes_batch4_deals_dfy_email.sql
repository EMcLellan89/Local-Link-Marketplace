/*
  # Drop Unused Indexes - Batch 4: Deals, DFY, Email & Event Tables

  This migration drops unused indexes from deals, done-for-you services,
  email, and event-related tables.

  ## Tables Affected:
  - Deals tables
  - DFY tables (orders, jobs, fulfillment)
  - Email tables (campaigns, tracking)
  - Event tables (system events, analytics)

  ## Impact:
  Removes unused indexes to improve write performance and reduce storage.
*/

-- Deals indexes
DROP INDEX IF EXISTS idx_deals_merchant_id;
DROP INDEX IF EXISTS idx_deals_status;
DROP INDEX IF EXISTS idx_deals_start_date;
DROP INDEX IF EXISTS idx_deals_end_date;
DROP INDEX IF EXISTS idx_deals_created_at;
DROP INDEX IF EXISTS idx_deal_transactions_deal_id;
DROP INDEX IF EXISTS idx_deal_transactions_customer_id;
DROP INDEX IF EXISTS idx_deal_transactions_purchased_at;
DROP INDEX IF EXISTS idx_deal_templates_merchant_id;
DROP INDEX IF EXISTS idx_deal_templates_is_active;

-- DFY indexes
DROP INDEX IF EXISTS idx_dfy_orders_merchant_id;
DROP INDEX IF EXISTS idx_dfy_orders_status;
DROP INDEX IF EXISTS idx_dfy_orders_created_at;
DROP INDEX IF EXISTS idx_dfy_jobs_status;
DROP INDEX IF EXISTS idx_dfy_jobs_priority;
DROP INDEX IF EXISTS idx_dfy_jobs_assigned_to;
DROP INDEX IF EXISTS idx_dfy_jobs_created_at;
DROP INDEX IF EXISTS idx_dfy_fulfillment_tasks_order_id;
DROP INDEX IF EXISTS idx_dfy_fulfillment_tasks_status;

-- Email indexes
DROP INDEX IF EXISTS idx_email_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_email_campaigns_status;
DROP INDEX IF EXISTS idx_email_campaigns_sent_at;
DROP INDEX IF EXISTS idx_email_tracking_campaign_id;
DROP INDEX IF EXISTS idx_email_tracking_customer_id;
DROP INDEX IF EXISTS idx_email_tracking_opened_at;
DROP INDEX IF EXISTS idx_email_tracking_clicked_at;

-- Event indexes
DROP INDEX IF EXISTS idx_event_logs_merchant_id;
DROP INDEX IF EXISTS idx_event_logs_event_type;
DROP INDEX IF EXISTS idx_event_logs_created_at;
DROP INDEX IF EXISTS idx_system_events_event_type;
DROP INDEX IF EXISTS idx_system_events_severity;
DROP INDEX IF EXISTS idx_system_events_created_at;