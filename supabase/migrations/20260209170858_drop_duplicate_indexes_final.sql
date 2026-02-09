/*
  # Drop Duplicate Indexes
  
  Removes duplicate indexes that provide no additional value.
  
  1. Indexes Dropped
    - Duplicate partner_id index on creative_events
    - Duplicate indexes on dfy_job_submissions
    - Duplicate merchant_id indexes on ll_crm tables
    - Duplicate user_id index on merchants
    - Duplicate company_id index on partner_crm_deals
    - Duplicate deal_id index on scheduled_deals
*/

DROP INDEX IF EXISTS idx_creative_events_partner_id_fk;
DROP INDEX IF EXISTS idx_dfy_job_submissions_partner_id;
DROP INDEX IF EXISTS idx_ll_crm_payments_merchant_id_fk;
DROP INDEX IF EXISTS idx_ll_crm_workflow_executions_merchant_id_fk;
DROP INDEX IF EXISTS idx_merchants_user_id_fk;
DROP INDEX IF EXISTS idx_partner_crm_deals_company_id_fk;
DROP INDEX IF EXISTS idx_scheduled_deals_deal_id_fk;
