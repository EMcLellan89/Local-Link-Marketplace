/*
  # Drop Unused Indexes - Batch 8: Job, Lead, and LL CRM Tables

  1. Changes
    - Drop unused indexes from job_* tables
    - Drop unused indexes from lead and lesson tables
    - Drop unused indexes from ll_* (LocalLink) tables
    
  2. Rationale
    - These indexes have idx_scan = 0, never used by queries
    - Reduces maintenance overhead
*/

-- Job tables
DROP INDEX IF EXISTS idx_job_applications_partner_id;
DROP INDEX IF EXISTS idx_job_assignments_assigned_by_admin_id;
DROP INDEX IF EXISTS idx_job_assignments_job_id;
DROP INDEX IF EXISTS idx_job_deliverables_job_id;
DROP INDEX IF EXISTS idx_job_deliverables_partner_id;
DROP INDEX IF EXISTS idx_job_deliverables_reviewed_by_admin_id;
DROP INDEX IF EXISTS idx_job_payouts_job_id;
DROP INDEX IF EXISTS idx_job_payouts_merchant_id;
DROP INDEX IF EXISTS idx_job_payouts_sourcing_partner_id;
DROP INDEX IF EXISTS idx_job_payouts_worker_partner_id;
DROP INDEX IF EXISTS idx_jobs_created_by_admin_id;
DROP INDEX IF EXISTS idx_jobs_merchant_id;

-- Lead and lesson
DROP INDEX IF EXISTS idx_lead_list_orders_merchant_id;
DROP INDEX IF EXISTS idx_lesson_progress_lesson_id;
DROP INDEX IF EXISTS idx_lesson_progress_user_id;

-- LocalLink Autoscale
DROP INDEX IF EXISTS idx_ll_autoscale_bot_runs_client_id;
DROP INDEX IF EXISTS idx_ll_autoscale_clients_brand_profile_id;
DROP INDEX IF EXISTS idx_ll_autoscale_clients_partner_id;
DROP INDEX IF EXISTS idx_ll_autoscale_subscriptions_client_id;
DROP INDEX IF EXISTS idx_ll_autoscale_workflows_client_id;

-- LocalLink Books
DROP INDEX IF EXISTS idx_ll_books_expenses_category;
DROP INDEX IF EXISTS idx_ll_books_expenses_created_by;
DROP INDEX IF EXISTS idx_ll_books_expenses_date;
DROP INDEX IF EXISTS idx_ll_books_expenses_merchant;
DROP INDEX IF EXISTS idx_ll_books_expenses_merchant_id;
DROP INDEX IF EXISTS idx_ll_books_income_date;
DROP INDEX IF EXISTS idx_ll_books_income_invoice_id;
DROP INDEX IF EXISTS idx_ll_books_income_merchant;
DROP INDEX IF EXISTS idx_ll_books_income_merchant_id;

-- LocalLink Brand and Circuit
DROP INDEX IF EXISTS idx_ll_brand_profiles_partner_id;
DROP INDEX IF EXISTS idx_ll_circuit_breakers_client_id;
DROP INDEX IF EXISTS idx_ll_comm_outbox_client_id;

-- LocalLink CRM Activities
DROP INDEX IF EXISTS idx_ll_crm_activities_assigned;
DROP INDEX IF EXISTS idx_ll_crm_activities_assigned_to;
DROP INDEX IF EXISTS idx_ll_crm_activities_completed;
DROP INDEX IF EXISTS idx_ll_crm_activities_contact;
DROP INDEX IF EXISTS idx_ll_crm_activities_contact_id;
DROP INDEX IF EXISTS idx_ll_crm_activities_created_by;
DROP INDEX IF EXISTS idx_ll_crm_activities_deal;
DROP INDEX IF EXISTS idx_ll_crm_activities_deal_id;
DROP INDEX IF EXISTS idx_ll_crm_activities_due;
DROP INDEX IF EXISTS idx_ll_crm_activities_due_date;
DROP INDEX IF EXISTS idx_ll_crm_activities_merchant;
DROP INDEX IF EXISTS idx_ll_crm_activities_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_activities_type;

-- LocalLink CRM AI Usage
DROP INDEX IF EXISTS idx_ll_crm_ai_usage_contact_id;
DROP INDEX IF EXISTS idx_ll_crm_ai_usage_created;
DROP INDEX IF EXISTS idx_ll_crm_ai_usage_deal_id;
DROP INDEX IF EXISTS idx_ll_crm_ai_usage_feature;
DROP INDEX IF EXISTS idx_ll_crm_ai_usage_feature_id;
DROP INDEX IF EXISTS idx_ll_crm_ai_usage_merchant;
DROP INDEX IF EXISTS idx_ll_crm_ai_usage_merchant_id;

-- LocalLink CRM Contacts
DROP INDEX IF EXISTS idx_ll_crm_contacts_assigned;
DROP INDEX IF EXISTS idx_ll_crm_contacts_assigned_to;
DROP INDEX IF EXISTS idx_ll_crm_contacts_created_by;
DROP INDEX IF EXISTS idx_ll_crm_contacts_email;
DROP INDEX IF EXISTS idx_ll_crm_contacts_lead_score;
DROP INDEX IF EXISTS idx_ll_crm_contacts_lead_status;
DROP INDEX IF EXISTS idx_ll_crm_contacts_merchant_id;
DROP INDEX IF EXISTS idx_ll_crm_contacts_phone;
DROP INDEX IF EXISTS idx_ll_crm_contacts_search;
DROP INDEX IF EXISTS idx_ll_crm_contacts_status;
DROP INDEX IF EXISTS idx_ll_crm_contacts_type;
