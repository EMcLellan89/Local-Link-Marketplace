/*
  # Drop Unused Indexes - Batch 4 Final
  
  1. Performance
    - Remove remaining unused indexes
  
  2. Indexes Removed
    - Email, VAPI, team, CRM, accounting, course indexes and more
*/

DROP INDEX IF EXISTS idx_email_subscriptions_merchant_id;
DROP INDEX IF EXISTS idx_vapi_configurations_merchant_id;
DROP INDEX IF EXISTS idx_vapi_assistants_merchant_id;
DROP INDEX IF EXISTS idx_vapi_assistants_active;
DROP INDEX IF EXISTS idx_vapi_tools_assistant_id;
DROP INDEX IF EXISTS idx_vapi_call_logs_merchant_id;
DROP INDEX IF EXISTS idx_vapi_call_logs_customer_id;
DROP INDEX IF EXISTS idx_vapi_call_logs_created_at;
DROP INDEX IF EXISTS idx_vapi_call_logs_status;
DROP INDEX IF EXISTS idx_team_members_user_id;
DROP INDEX IF EXISTS idx_team_members_email;
DROP INDEX IF EXISTS idx_crm_companies_assigned_to;
DROP INDEX IF EXISTS idx_crm_companies_status;
DROP INDEX IF EXISTS idx_crm_contacts_company_id;
DROP INDEX IF EXISTS idx_crm_contacts_assigned_to;
DROP INDEX IF EXISTS idx_crm_notes_company_id;
DROP INDEX IF EXISTS idx_crm_notes_contact_id;
DROP INDEX IF EXISTS idx_crm_tasks_assigned_to;
DROP INDEX IF EXISTS idx_crm_tasks_due_date;
DROP INDEX IF EXISTS idx_crm_tasks_status;
DROP INDEX IF EXISTS idx_crm_deals_assigned_to;
DROP INDEX IF EXISTS idx_crm_deals_company_id;
DROP INDEX IF EXISTS idx_crm_deals_stage;
DROP INDEX IF EXISTS idx_vapi_call_logs_billing;
DROP INDEX IF EXISTS idx_vapi_configurations_active;
DROP INDEX IF EXISTS idx_merchant_accounting_lite_merchant_id;
DROP INDEX IF EXISTS idx_merchant_accounting_lite_month;
DROP INDEX IF EXISTS idx_merchant_accounting_pro_merchant_id;
DROP INDEX IF EXISTS idx_merchant_accounting_pro_month;
DROP INDEX IF EXISTS idx_partner_accounting_pro_partner_id;
DROP INDEX IF EXISTS idx_partner_accounting_pro_month;
DROP INDEX IF EXISTS idx_tax_obligations_quarterly_entity_id;
DROP INDEX IF EXISTS idx_tax_obligations_quarterly_entity_type;
DROP INDEX IF EXISTS idx_tax_obligations_quarterly_due_date;
DROP INDEX IF EXISTS idx_customers_referred_by_partner_id;
DROP INDEX IF EXISTS idx_merchants_referred_by_partner_id;
DROP INDEX IF EXISTS idx_merchants_system_id;
DROP INDEX IF EXISTS idx_courses_target_audience;
DROP INDEX IF EXISTS idx_courses_published_audience;
DROP INDEX IF EXISTS idx_admin_crm_goals_team_member;
DROP INDEX IF EXISTS idx_admin_crm_project_assignments_project;
DROP INDEX IF EXISTS idx_admin_crm_project_assignments_team_member;
DROP INDEX IF EXISTS idx_admin_crm_companies_status;
DROP INDEX IF EXISTS idx_admin_crm_companies_assigned_to;
DROP INDEX IF EXISTS idx_admin_crm_contacts_company;
DROP INDEX IF EXISTS idx_admin_crm_contacts_source;
DROP INDEX IF EXISTS idx_admin_crm_list_members_list;
DROP INDEX IF EXISTS idx_admin_crm_activities_company;
DROP INDEX IF EXISTS idx_admin_crm_activities_date;
DROP INDEX IF EXISTS idx_accounting_tax_obligations_year;
DROP INDEX IF EXISTS idx_accounting_tax_obligations_due_date;
DROP INDEX IF EXISTS idx_accounting_tax_payments_obligation;
DROP INDEX IF EXISTS idx_accounting_partner_1099_partner;
DROP INDEX IF EXISTS idx_accounting_partner_1099_year;
DROP INDEX IF EXISTS idx_accounting_employee_payroll_employee;
DROP INDEX IF EXISTS idx_accounting_employee_payroll_date;
DROP INDEX IF EXISTS idx_accounting_accountant_users_active;
