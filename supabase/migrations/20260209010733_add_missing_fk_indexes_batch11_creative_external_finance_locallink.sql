/*
  # Add Missing Foreign Key Indexes - Batch 11 Part 2
  
  1. Tables Covered
    - Creative tables (creative_events, creative_tests)
    - Creator tables (creator_agreement_signatures)
    - Credit ledger table
    - Dashboard metrics table
    - Ecommerce tables (ecommerce_orders)
    - Enrollments table
    - Expansion requests table
    - Expenses table
    - External tables (external_business_sales, external_business_webhooks, external_sale_commissions, external_sales_events)
    - Feature flags table
    - Finance tables (finance_tasks, financial_reports, financial_subscriptions)
    - Lead list tables (lead_list_orders)
    - Lesson progress table
    - LocalLink (ll_) tables (autoscale, books, brand, circuit_breakers, comm_outbox, crm)
    
  2. Performance Impact
    - Adds indexes on foreign key columns to prevent N+1 queries
    - Improves JOIN performance for creative tracking, external integrations, and LocalLink CRM
    
  3. Security
    - No security changes, only performance optimization
*/

-- Creative tables
CREATE INDEX IF NOT EXISTS idx_creative_events_creative_id ON creative_events(creative_id);
CREATE INDEX IF NOT EXISTS idx_creative_events_partner_id ON creative_events(partner_id);
CREATE INDEX IF NOT EXISTS idx_creative_events_profile_id ON creative_events(profile_id);
CREATE INDEX IF NOT EXISTS idx_creative_tests_partner_id ON creative_tests(partner_id);
CREATE INDEX IF NOT EXISTS idx_creative_tests_winner_creative_id ON creative_tests(winner_creative_id);

-- Creator tables
CREATE INDEX IF NOT EXISTS idx_creator_agreement_signatures_agreement_id ON creator_agreement_signatures(agreement_id);

-- Credit ledger
CREATE INDEX IF NOT EXISTS idx_credit_ledger_user_id ON credit_ledger(user_id);

-- Dashboard metrics
CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_merchant_id ON dashboard_metrics(merchant_id);

-- Ecommerce tables
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_customer_id ON ecommerce_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_merchant_id ON ecommerce_orders(merchant_id);

-- Enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);

-- Expansion requests
CREATE INDEX IF NOT EXISTS idx_expansion_requests_partner_id ON expansion_requests(partner_id);

-- Expenses
CREATE INDEX IF NOT EXISTS idx_expenses_merchant_id ON expenses(merchant_id);

-- External tables
CREATE INDEX IF NOT EXISTS idx_external_business_sales_partner_id ON external_business_sales(partner_id);
CREATE INDEX IF NOT EXISTS idx_external_business_webhooks_business_unit_id ON external_business_webhooks(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_external_sale_commissions_external_sales_event_id ON external_sale_commissions(external_sales_event_id);
CREATE INDEX IF NOT EXISTS idx_external_sale_commissions_external_system_id ON external_sale_commissions(external_system_id);
CREATE INDEX IF NOT EXISTS idx_external_sale_commissions_partner_id ON external_sale_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_external_sales_events_external_system_id ON external_sales_events(external_system_id);
CREATE INDEX IF NOT EXISTS idx_external_sales_events_partner_id ON external_sales_events(partner_id);

-- Feature flags
CREATE INDEX IF NOT EXISTS idx_feature_flags_plan_id ON feature_flags(plan_id);

-- Finance tables
CREATE INDEX IF NOT EXISTS idx_finance_tasks_merchant_id ON finance_tasks(merchant_id);
CREATE INDEX IF NOT EXISTS idx_financial_reports_merchant_id ON financial_reports(merchant_id);
CREATE INDEX IF NOT EXISTS idx_financial_subscriptions_merchant_id ON financial_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_financial_subscriptions_partner_id ON financial_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_financial_subscriptions_plan_id ON financial_subscriptions(plan_id);

-- Lead list orders
CREATE INDEX IF NOT EXISTS idx_lead_list_orders_merchant_id ON lead_list_orders(merchant_id);

-- Lesson progress
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);

-- LocalLink autoscale tables
CREATE INDEX IF NOT EXISTS idx_ll_autoscale_bot_runs_client_id ON ll_autoscale_bot_runs(client_id);
CREATE INDEX IF NOT EXISTS idx_ll_autoscale_clients_brand_profile_id ON ll_autoscale_clients(brand_profile_id);
CREATE INDEX IF NOT EXISTS idx_ll_autoscale_clients_partner_id ON ll_autoscale_clients(partner_id);
CREATE INDEX IF NOT EXISTS idx_ll_autoscale_subscriptions_client_id ON ll_autoscale_subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_ll_autoscale_workflows_client_id ON ll_autoscale_workflows(client_id);

-- LocalLink books tables
CREATE INDEX IF NOT EXISTS idx_ll_books_expenses_created_by ON ll_books_expenses(created_by);
CREATE INDEX IF NOT EXISTS idx_ll_books_expenses_merchant_id ON ll_books_expenses(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ll_books_income_invoice_id ON ll_books_income(invoice_id);
CREATE INDEX IF NOT EXISTS idx_ll_books_income_merchant_id ON ll_books_income(merchant_id);

-- LocalLink brand profiles
CREATE INDEX IF NOT EXISTS idx_ll_brand_profiles_partner_id ON ll_brand_profiles(partner_id);

-- LocalLink circuit breakers
CREATE INDEX IF NOT EXISTS idx_ll_circuit_breakers_client_id ON ll_circuit_breakers(client_id);

-- LocalLink comm outbox
CREATE INDEX IF NOT EXISTS idx_ll_comm_outbox_client_id ON ll_comm_outbox(client_id);

-- LocalLink CRM tables
CREATE INDEX IF NOT EXISTS idx_ll_crm_activities_assigned_to ON ll_crm_activities(assigned_to);
CREATE INDEX IF NOT EXISTS idx_ll_crm_activities_contact_id ON ll_crm_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_activities_created_by ON ll_crm_activities(created_by);
CREATE INDEX IF NOT EXISTS idx_ll_crm_activities_deal_id ON ll_crm_activities(deal_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_activities_merchant_id ON ll_crm_activities(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_ai_usage_contact_id ON ll_crm_ai_usage(contact_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_ai_usage_deal_id ON ll_crm_ai_usage(deal_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_ai_usage_feature_id ON ll_crm_ai_usage(feature_id);
CREATE INDEX IF NOT EXISTS idx_ll_crm_ai_usage_merchant_id ON ll_crm_ai_usage(merchant_id);
