/*
  # Drop Unused Indexes - Batch 25
*/

DROP INDEX IF EXISTS idx_ll_crm_payments_created_by;
DROP INDEX IF EXISTS idx_ll_crm_workflow_executions_contact_id;
DROP INDEX IF EXISTS idx_academy_certifications_course_id;
DROP INDEX IF EXISTS idx_academy_certifications_user_id;
DROP INDEX IF EXISTS idx_academy_lesson_assets_lesson_id;
DROP INDEX IF EXISTS idx_academy_progress_course_id;
DROP INDEX IF EXISTS idx_academy_progress_lesson_id;
DROP INDEX IF EXISTS idx_academy_progress_user_id;
DROP INDEX IF EXISTS idx_academy_quiz_attempts_module_id;
DROP INDEX IF EXISTS idx_academy_quizzes_course_id;
DROP INDEX IF EXISTS idx_milestone_badge_audit_log_badge_id;
DROP INDEX IF EXISTS idx_partner_accounting_categories_parent_category_id;
DROP INDEX IF EXISTS idx_partner_accounting_transactions_bank_account_id;
DROP INDEX IF EXISTS idx_partner_accounting_transactions_category_id;
DROP INDEX IF EXISTS idx_partner_accounting_transactions_deal_id;
DROP INDEX IF EXISTS idx_partner_accounting_transactions_tax_payment_id;
DROP INDEX IF EXISTS idx_partner_certs_cert_id;
DROP INDEX IF EXISTS idx_partner_crm_contacts_company_id;
DROP INDEX IF EXISTS idx_partner_crm_deal_notes_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_deal_products_partner_id;
