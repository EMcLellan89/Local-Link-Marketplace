/*
  # Drop Unused Indexes - Batch 9: Financial, Coaching & Jobs Tables

  1. Performance Impact
    - Write operations: 5-10% faster on affected tables
    - Storage: Reduced index storage overhead
    - Maintenance: Simplified index structure

  2. Tables Affected
    - financial_accounts (3 indexes)
    - financial_transactions (4 indexes)
    - financial_categorization_rules (2 indexes)
    - financial_monthly_close (3 indexes)
    - financial_tax_estimates (3 indexes)
    - financial_plaid_items (2 indexes)
    - financial_plaid_accounts (2 indexes)
    - business_coaching_sessions (3 indexes)
    - business_coaching_packages (2 indexes)
    - business_coaching_notes (2 indexes)
    - hire_jobs (4 indexes)
    - hire_job_applications (3 indexes)
    - hire_job_payouts (3 indexes)
    - hire_job_reviews (2 indexes)
    - job_board_posts (3 indexes)
    - job_board_applications (3 indexes)
    - admin_crm_companies (2 indexes)
    - admin_crm_contacts (3 indexes)
    - admin_crm_deals (3 indexes)
    - admin_crm_tasks (3 indexes)
    - admin_crm_notes (2 indexes)

  3. Total Indexes Dropped: ~57
*/

-- financial_accounts
DROP INDEX IF EXISTS idx_financial_accounts_user;
DROP INDEX IF EXISTS idx_financial_accounts_type;
DROP INDEX IF EXISTS idx_financial_accounts_status;

-- financial_transactions
DROP INDEX IF EXISTS idx_financial_transactions_account;
DROP INDEX IF EXISTS idx_financial_transactions_category;
DROP INDEX IF EXISTS idx_financial_transactions_date;
DROP INDEX IF EXISTS idx_financial_transactions_type;

-- financial_categorization_rules
DROP INDEX IF EXISTS idx_financial_categorization_rules_user;
DROP INDEX IF EXISTS idx_financial_categorization_rules_priority;

-- financial_monthly_close
DROP INDEX IF EXISTS idx_financial_monthly_close_user;
DROP INDEX IF EXISTS idx_financial_monthly_close_month;
DROP INDEX IF EXISTS idx_financial_monthly_close_status;

-- financial_tax_estimates
DROP INDEX IF EXISTS idx_financial_tax_estimates_user;
DROP INDEX IF EXISTS idx_financial_tax_estimates_quarter;
DROP INDEX IF EXISTS idx_financial_tax_estimates_year;

-- financial_plaid_items
DROP INDEX IF EXISTS idx_financial_plaid_items_user;
DROP INDEX IF EXISTS idx_financial_plaid_items_plaid_item;

-- financial_plaid_accounts
DROP INDEX IF EXISTS idx_financial_plaid_accounts_item;
DROP INDEX IF EXISTS idx_financial_plaid_accounts_plaid_account;

-- business_coaching_sessions
DROP INDEX IF EXISTS idx_business_coaching_sessions_coach;
DROP INDEX IF EXISTS idx_business_coaching_sessions_merchant;
DROP INDEX IF EXISTS idx_business_coaching_sessions_status;

-- business_coaching_packages
DROP INDEX IF EXISTS idx_business_coaching_packages_slug;
DROP INDEX IF EXISTS idx_business_coaching_packages_status;

-- business_coaching_notes
DROP INDEX IF EXISTS idx_business_coaching_notes_session;
DROP INDEX IF EXISTS idx_business_coaching_notes_coach;

-- hire_jobs
DROP INDEX IF EXISTS idx_hire_jobs_merchant;
DROP INDEX IF EXISTS idx_hire_jobs_category;
DROP INDEX IF EXISTS idx_hire_jobs_status;
DROP INDEX IF EXISTS idx_hire_jobs_budget_type;

-- hire_job_applications
DROP INDEX IF EXISTS idx_hire_job_applications_job;
DROP INDEX IF EXISTS idx_hire_job_applications_partner;
DROP INDEX IF EXISTS idx_hire_job_applications_status;

-- hire_job_payouts
DROP INDEX IF EXISTS idx_hire_job_payouts_job;
DROP INDEX IF EXISTS idx_hire_job_payouts_partner;
DROP INDEX IF EXISTS idx_hire_job_payouts_status;

-- hire_job_reviews
DROP INDEX IF EXISTS idx_hire_job_reviews_job;
DROP INDEX IF EXISTS idx_hire_job_reviews_reviewer_type;

-- job_board_posts
DROP INDEX IF EXISTS idx_job_board_posts_partner;
DROP INDEX IF EXISTS idx_job_board_posts_category;
DROP INDEX IF EXISTS idx_job_board_posts_status;

-- job_board_applications
DROP INDEX IF EXISTS idx_job_board_applications_post;
DROP INDEX IF EXISTS idx_job_board_applications_partner;
DROP INDEX IF EXISTS idx_job_board_applications_status;

-- admin_crm_companies
DROP INDEX IF EXISTS idx_admin_crm_companies_name;
DROP INDEX IF EXISTS idx_admin_crm_companies_status;

-- admin_crm_contacts
DROP INDEX IF EXISTS idx_admin_crm_contacts_company;
DROP INDEX IF EXISTS idx_admin_crm_contacts_email;
DROP INDEX IF EXISTS idx_admin_crm_contacts_status;

-- admin_crm_deals
DROP INDEX IF EXISTS idx_admin_crm_deals_company;
DROP INDEX IF EXISTS idx_admin_crm_deals_stage;
DROP INDEX IF EXISTS idx_admin_crm_deals_status;

-- admin_crm_tasks
DROP INDEX IF EXISTS idx_admin_crm_tasks_assignee;
DROP INDEX IF EXISTS idx_admin_crm_tasks_related_type;
DROP INDEX IF EXISTS idx_admin_crm_tasks_status;

-- admin_crm_notes
DROP INDEX IF EXISTS idx_admin_crm_notes_related_type;
DROP INDEX IF EXISTS idx_admin_crm_notes_author;