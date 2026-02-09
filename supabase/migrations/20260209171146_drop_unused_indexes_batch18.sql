/*
  # Drop Unused Indexes - Batch 18
*/

DROP INDEX IF EXISTS idx_ll_brand_profiles_partner_id;
DROP INDEX IF EXISTS idx_ll_autoscale_clients_brand_profile_id;
DROP INDEX IF EXISTS idx_ll_autoscale_clients_partner_id;
DROP INDEX IF EXISTS idx_ll_autoscale_workflows_client_id;
DROP INDEX IF EXISTS idx_ll_autoscale_bot_runs_client_id;
DROP INDEX IF EXISTS idx_ll_comm_outbox_client_id;
DROP INDEX IF EXISTS idx_ll_circuit_breakers_client_id;
DROP INDEX IF EXISTS idx_ll_partner_commission_rules_partner_id;
DROP INDEX IF EXISTS idx_partner_special_overrides_approved_by;
DROP INDEX IF EXISTS idx_business_ad_campaigns_business_id;
DROP INDEX IF EXISTS idx_recurring_commission_schedule_order_id;
DROP INDEX IF EXISTS idx_recurring_commission_schedule_partner_id;
DROP INDEX IF EXISTS idx_recurring_commission_schedule_product_id;
DROP INDEX IF EXISTS idx_profit_based_commission_costs_order_id;
DROP INDEX IF EXISTS idx_profit_based_commission_costs_product_id;
DROP INDEX IF EXISTS idx_external_business_sales_partner_id;
DROP INDEX IF EXISTS idx_ll_crm_subscriptions_tier_id;
DROP INDEX IF EXISTS idx_ll_crm_contacts_assigned_to;
DROP INDEX IF EXISTS idx_ll_crm_contacts_created_by;
DROP INDEX IF EXISTS idx_ll_crm_pipelines_merchant_id;
