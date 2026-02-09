/*
  # Add Missing Foreign Key Indexes - Batch 6
  
  1. Tables Covered
    - Event tables (event_attendance, event_registrations, event_series, event_tickets, events)
    - Favorites table
    - Gift card tables (gift_card_templates, gift_card_transactions, gift_cards)
    - Internal tables (internal_accounting_ledger, internal_invoices)
    - Invoice tables (invoice_items, invoice_payments, invoices)
    - Job tables (job_applications, job_assignments, job_deliverables, job_payouts, jobs)
    
  2. Performance Impact
    - Adds indexes on foreign key columns to prevent N+1 queries
    - Improves JOIN performance for events, gift cards, invoicing, and job management
    - Critical for event management, payment processing, and partner job workflows
    
  3. Security
    - No security changes, only performance optimization
*/

-- Event tables
CREATE INDEX IF NOT EXISTS idx_event_attendance_checked_in_by ON event_attendance(checked_in_by);
CREATE INDEX IF NOT EXISTS idx_event_attendance_registration_id ON event_attendance(registration_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_customer_id ON event_registrations(customer_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_ticket_id ON event_registrations(ticket_id);
CREATE INDEX IF NOT EXISTS idx_event_series_merchant_id ON event_series(merchant_id);
CREATE INDEX IF NOT EXISTS idx_event_tickets_event_id ON event_tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_events_merchant_id ON events(merchant_id);
CREATE INDEX IF NOT EXISTS idx_events_series_id ON events(series_id);

-- Favorites table
CREATE INDEX IF NOT EXISTS idx_favorites_customer_id ON favorites(customer_id);
CREATE INDEX IF NOT EXISTS idx_favorites_deal_id ON favorites(deal_id);
CREATE INDEX IF NOT EXISTS idx_favorites_merchant_id ON favorites(merchant_id);

-- Gift card tables
CREATE INDEX IF NOT EXISTS idx_gift_card_templates_merchant_id ON gift_card_templates(merchant_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_gift_card_id ON gift_card_transactions(gift_card_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_purchase_id ON gift_card_transactions(purchase_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_merchant_id ON gift_cards(merchant_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_purchased_by_customer_id ON gift_cards(purchased_by_customer_id);

-- Internal tables
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_business_unit_id ON internal_accounting_ledger(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_created_by ON internal_accounting_ledger(created_by);
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_customer_id ON internal_accounting_ledger(customer_id);
CREATE INDEX IF NOT EXISTS idx_internal_invoices_business_unit_id ON internal_invoices(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_internal_invoices_created_by ON internal_invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_internal_invoices_customer_id ON internal_invoices(customer_id);

-- Invoice tables
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_invoice_id ON invoice_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_merchant_id ON invoice_payments(merchant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_merchant_id ON invoices(merchant_id);

-- Job tables
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
