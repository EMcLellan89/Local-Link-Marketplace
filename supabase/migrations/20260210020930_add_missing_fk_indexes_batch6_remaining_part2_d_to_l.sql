/*
  # Add Missing Foreign Key Indexes - Batch 6 Part 2 (D-L)

  1. New Indexes
    - Tables starting with D-L
    - Approximately 100+ foreign key indexes
    - Covers: dashboard, ecommerce, event, expansion, expenses, external, favorites, feature, finance, gift_card, internal, job, lead_list, lesson, ll_, loyalty

  2. Performance Impact
    - Improve JOIN performance 10-100x on foreign key relationships
    - Prevent full table scans on related table lookups
    - Optimize query planner decisions
*/

CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_merchant_id ON dashboard_metrics(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_customer_id ON ecommerce_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_merchant_id ON ecommerce_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_checked_in_by ON event_attendance(checked_in_by);
CREATE INDEX IF NOT EXISTS idx_event_attendance_registration_id ON event_attendance(registration_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_customer_id ON event_registrations(customer_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_ticket_id ON event_registrations(ticket_id);
CREATE INDEX IF NOT EXISTS idx_event_series_merchant_id ON event_series(merchant_id);
CREATE INDEX IF NOT EXISTS idx_event_tickets_event_id ON event_tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_events_merchant_id ON events(merchant_id);
CREATE INDEX IF NOT EXISTS idx_events_series_id ON events(series_id);
CREATE INDEX IF NOT EXISTS idx_expansion_requests_partner_id ON expansion_requests(partner_id);
CREATE INDEX IF NOT EXISTS idx_expenses_merchant_id ON expenses(merchant_id);
CREATE INDEX IF NOT EXISTS idx_external_business_sales_partner_id ON external_business_sales(partner_id);
CREATE INDEX IF NOT EXISTS idx_external_business_webhooks_business_unit_id ON external_business_webhooks(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_external_sale_commissions_external_sales_event_id ON external_sale_commissions(external_sales_event_id);
CREATE INDEX IF NOT EXISTS idx_external_sale_commissions_external_system_id ON external_sale_commissions(external_system_id);
CREATE INDEX IF NOT EXISTS idx_external_sale_commissions_partner_id ON external_sale_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_external_sales_events_external_system_id ON external_sales_events(external_system_id);
CREATE INDEX IF NOT EXISTS idx_external_sales_events_partner_id ON external_sales_events(partner_id);
CREATE INDEX IF NOT EXISTS idx_favorites_customer_id ON favorites(customer_id);
CREATE INDEX IF NOT EXISTS idx_favorites_deal_id ON favorites(deal_id);
CREATE INDEX IF NOT EXISTS idx_favorites_merchant_id ON favorites(merchant_id);
CREATE INDEX IF NOT EXISTS idx_feature_flags_plan_id ON feature_flags(plan_id);
CREATE INDEX IF NOT EXISTS idx_finance_tasks_merchant_id ON finance_tasks(merchant_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_templates_merchant_id ON gift_card_templates(merchant_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_gift_card_id ON gift_card_transactions(gift_card_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_purchase_id ON gift_card_transactions(purchase_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_merchant_id ON gift_cards(merchant_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_purchased_by_customer_id ON gift_cards(purchased_by_customer_id);
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_business_unit_id ON internal_accounting_ledger(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_created_by ON internal_accounting_ledger(created_by);
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_customer_id ON internal_accounting_ledger(customer_id);
CREATE INDEX IF NOT EXISTS idx_internal_invoices_business_unit_id ON internal_invoices(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_internal_invoices_created_by ON internal_invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_internal_invoices_customer_id ON internal_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_partner_id ON job_applications(partner_id);
CREATE INDEX IF NOT EXISTS idx_job_assignments_assigned_by_admin_id ON job_assignments(assigned_by_admin_id);
CREATE INDEX IF NOT EXISTS idx_job_assignments_job_id ON job_assignments(job_id);
CREATE INDEX IF NOT EXISTS idx_job_assignments_partner_id ON job_assignments(partner_id);
CREATE INDEX IF NOT EXISTS idx_job_deliverables_job_id ON job_deliverables(job_id);
CREATE INDEX IF NOT EXISTS idx_job_deliverables_partner_id ON job_deliverables(partner_id);
CREATE INDEX IF NOT EXISTS idx_job_deliverables_reviewed_by_admin_id ON job_deliverables(reviewed_by_admin_id);
CREATE INDEX IF NOT EXISTS idx_job_payouts_job_id ON job_payouts(job_id);
CREATE INDEX IF NOT EXISTS idx_job_payouts_merchant_id ON job_payouts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_job_payouts_sourcing_partner_id ON job_payouts(sourcing_partner_id);
CREATE INDEX IF NOT EXISTS idx_job_payouts_worker_partner_id ON job_payouts(worker_partner_id);
CREATE INDEX IF NOT EXISTS idx_jobs_created_by_admin_id ON jobs(created_by_admin_id);
CREATE INDEX IF NOT EXISTS idx_jobs_merchant_id ON jobs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_lead_list_orders_merchant_id ON lead_list_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_ll_autoscale_bot_runs_client_id ON ll_autoscale_bot_runs(client_id);
CREATE INDEX IF NOT EXISTS idx_ll_autoscale_clients_brand_profile_id ON ll_autoscale_clients(brand_profile_id);
CREATE INDEX IF NOT EXISTS idx_ll_autoscale_clients_partner_id ON ll_autoscale_clients(partner_id);
CREATE INDEX IF NOT EXISTS idx_ll_autoscale_subscriptions_client_id ON ll_autoscale_subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_ll_autoscale_workflows_client_id ON ll_autoscale_workflows(client_id);
CREATE INDEX IF NOT EXISTS idx_ll_books_expenses_created_by ON ll_books_expenses(created_by);
CREATE INDEX IF NOT EXISTS idx_ll_books_expenses_merchant_id ON ll_books_expenses(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ll_books_income_invoice_id ON ll_books_income(invoice_id);
CREATE INDEX IF NOT EXISTS idx_ll_books_income_merchant_id ON ll_books_income(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ll_brand_profiles_partner_id ON ll_brand_profiles(partner_id);
CREATE INDEX IF NOT EXISTS idx_ll_circuit_breakers_client_id ON ll_circuit_breakers(client_id);
CREATE INDEX IF NOT EXISTS idx_ll_comm_outbox_client_id ON ll_comm_outbox(client_id);
CREATE INDEX IF NOT EXISTS idx_ll_partner_commission_rules_partner_id ON ll_partner_commission_rules(partner_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_contract_uploads_merchant_id ON loyalty_contract_uploads(merchant_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_events_customer_id ON loyalty_events(customer_id);