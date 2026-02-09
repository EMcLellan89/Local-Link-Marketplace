/*
  # Drop Unused Indexes - Batch 29
*/

DROP INDEX IF EXISTS idx_crm_tasks_merchant_id_fk;
DROP INDEX IF EXISTS idx_deal_templates_merchant_id_fk;
DROP INDEX IF EXISTS idx_deals_merchant_id_fk;
DROP INDEX IF EXISTS idx_email_campaigns_merchant_id_fk;
DROP INDEX IF EXISTS idx_email_sends_campaign_id_fk;
DROP INDEX IF EXISTS idx_email_templates_merchant_id_fk;
DROP INDEX IF EXISTS idx_event_registrations_customer_id_fk;
DROP INDEX IF EXISTS idx_event_registrations_event_id_fk;
DROP INDEX IF EXISTS idx_event_tickets_event_id_fk;
DROP INDEX IF EXISTS idx_expansion_requests_partner_id_fk;
DROP INDEX IF EXISTS idx_team_members_manager_id;
DROP INDEX IF EXISTS idx_gift_cards_merchant_id_fk;
DROP INDEX IF EXISTS idx_invoices_merchant_id_fk;
DROP INDEX IF EXISTS idx_job_applications_job_id_fk;
DROP INDEX IF EXISTS idx_jobs_merchant_id_fk;
DROP INDEX IF EXISTS idx_ll_crm_deals_merchant_id_fk;
DROP INDEX IF EXISTS idx_ll_crm_email_sends_merchant_id_fk;
DROP INDEX IF EXISTS idx_ll_crm_payments_merchant_id_fk;
DROP INDEX IF EXISTS idx_ll_crm_workflow_executions_merchant_id_fk;
DROP INDEX IF EXISTS idx_admin_crm_activities_company_id;
