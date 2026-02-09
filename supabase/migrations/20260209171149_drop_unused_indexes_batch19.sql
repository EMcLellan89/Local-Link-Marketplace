/*
  # Drop Unused Indexes - Batch 19
*/

DROP INDEX IF EXISTS idx_ll_crm_deals_pipeline_id;
DROP INDEX IF EXISTS idx_ll_crm_deals_assigned_to;
DROP INDEX IF EXISTS idx_ll_crm_activities_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_activities_contact_id;
DROP INDEX IF EXISTS idx_ll_crm_activities_deal_id;
DROP INDEX IF EXISTS idx_ll_crm_activities_assigned_to;
DROP INDEX IF EXISTS idx_ll_crm_activities_created_by;
DROP INDEX IF EXISTS idx_ll_crm_email_campaigns_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_email_sends_campaign_id;
DROP INDEX IF EXISTS idx_service_bookings_service_id;
DROP INDEX IF EXISTS idx_system_settings_updated_by;
DROP INDEX IF EXISTS idx_merchant_application_equipment_application_id;
DROP INDEX IF EXISTS idx_partner_scores_total_score;
DROP INDEX IF EXISTS idx_partner_scores_active_job_count;
DROP INDEX IF EXISTS idx_partner_scores_last_calculated;
DROP INDEX IF EXISTS idx_crm_install_queue_merchant_id;
DROP INDEX IF EXISTS idx_crm_install_queue_status;
DROP INDEX IF EXISTS idx_crm_install_queue_created_at;
DROP INDEX IF EXISTS idx_job_assignments_auto_assigned;
DROP INDEX IF EXISTS idx_accounting_chart_of_accounts_parent_account_id;
