/*
  # Drop Unused Indexes - Batch 5: Events, Gifts, Internal, Invoices & Jobs Tables
  
  1. Tables Affected
    - event_* tables
    - gift_* tables
    - internal_* tables (CRM, team, etc.)
    - invoice_* tables
    - jobs and job_* tables
  
  2. Performance Impact
    - Removes unused indexes reducing storage and maintenance overhead
    - No impact on queries as these indexes have 0 scans
  
  3. Safety
    - All indexes verified as unused through pg_stat_user_indexes
*/

-- Event tables
DROP INDEX IF EXISTS idx_event_tickets_event_id;
DROP INDEX IF EXISTS idx_event_registrations_event_id;
DROP INDEX IF EXISTS idx_event_registrations_customer_id;
DROP INDEX IF EXISTS idx_creative_events_creative_id;

-- Gift cards
DROP INDEX IF EXISTS idx_gift_cards_merchant_id;
DROP INDEX IF EXISTS idx_gift_card_transactions_card_id;
DROP INDEX IF EXISTS idx_gift_card_transactions_customer_id;

-- Internal CRM
DROP INDEX IF EXISTS idx_internal_crm_contacts_assigned_to;
DROP INDEX IF EXISTS idx_internal_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_internal_crm_tasks_assigned_to;
DROP INDEX IF EXISTS idx_internal_crm_notes_contact_id;

-- Invoices
DROP INDEX IF EXISTS idx_invoices_merchant_id;
DROP INDEX IF EXISTS idx_invoices_customer_id;
DROP INDEX IF EXISTS idx_invoice_line_items_invoice_id;
DROP INDEX IF EXISTS idx_ll_crm_invoices_company_id;

-- Jobs
DROP INDEX IF EXISTS idx_jobs_partner_id;
DROP INDEX IF EXISTS idx_jobs_merchant_id;
DROP INDEX IF EXISTS idx_jobs_created_by;
DROP INDEX IF EXISTS idx_dfy_jobs_order_id;
DROP INDEX IF EXISTS idx_job_applications_job_id;
DROP INDEX IF EXISTS idx_job_applications_partner_id;