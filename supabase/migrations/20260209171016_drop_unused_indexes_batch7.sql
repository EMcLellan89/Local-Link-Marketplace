/*
  # Drop Unused Indexes - Batch 7
*/

DROP INDEX IF EXISTS idx_ll_crm_payments_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_workflow_executions_workflow_id;
DROP INDEX IF EXISTS idx_ll_crm_workflow_executions_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_workflows_merchant_id;
DROP INDEX IF EXISTS idx_admin_sessions_admin_user_id;
DROP INDEX IF EXISTS idx_swipe_file_favorites_template_id;
DROP INDEX IF EXISTS idx_loyalty_contract_uploads_merchant_id;
DROP INDEX IF EXISTS idx_audit_logs_actor_user_id;
DROP INDEX IF EXISTS idx_merchant_addon_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_merchant_addon_subscriptions_addon_id;
DROP INDEX IF EXISTS idx_loyalty_events_customer_id;
DROP INDEX IF EXISTS idx_event_series_merchant_id;
DROP INDEX IF EXISTS idx_events_series_id;
DROP INDEX IF EXISTS idx_event_registrations_ticket_id;
DROP INDEX IF EXISTS idx_event_attendance_registration_id;
DROP INDEX IF EXISTS idx_event_attendance_checked_in_by;
DROP INDEX IF EXISTS idx_winback_triggers_campaign_id;
DROP INDEX IF EXISTS idx_winback_triggers_customer_id;
DROP INDEX IF EXISTS idx_winback_outreach_campaign_id;
DROP INDEX IF EXISTS idx_winback_outreach_customer_id;
