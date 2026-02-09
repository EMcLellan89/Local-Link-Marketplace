/*
  # Add Missing Foreign Key Indexes - Batch 5 (Event to Internal)

  Adds indexes for foreign keys that are missing covering indexes.
  
  Tables covered:
  - Event tables
  - Expansion/Expense/External tables
  - Gift card tables
  - Internal accounting/invoice tables
*/

-- Event Tables
CREATE INDEX IF NOT EXISTS idx_event_attendance_checked_in_by ON event_attendance(checked_in_by);
CREATE INDEX IF NOT EXISTS idx_event_attendance_registration_id ON event_attendance(registration_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_customer_id ON event_registrations(customer_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_ticket_id ON event_registrations(ticket_id);
CREATE INDEX IF NOT EXISTS idx_event_series_merchant_id ON event_series(merchant_id);
CREATE INDEX IF NOT EXISTS idx_event_tickets_event_id ON event_tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_events_merchant_id ON events(merchant_id);
CREATE INDEX IF NOT EXISTS idx_events_series_id ON events(series_id);

-- Expansion/Expense/External Tables
CREATE INDEX IF NOT EXISTS idx_expansion_requests_partner_id ON expansion_requests(partner_id);
CREATE INDEX IF NOT EXISTS idx_expenses_merchant_id ON expenses(merchant_id);
CREATE INDEX IF NOT EXISTS idx_external_business_webhooks_business_unit_id ON external_business_webhooks(business_unit_id);

-- Gift Card Tables
CREATE INDEX IF NOT EXISTS idx_gift_card_templates_merchant_id ON gift_card_templates(merchant_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_gift_card_id ON gift_card_transactions(gift_card_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_purchase_id ON gift_card_transactions(purchase_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_purchased_by_customer_id ON gift_cards(purchased_by_customer_id);

-- Internal Accounting Tables
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_business_unit_id ON internal_accounting_ledger(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_created_by ON internal_accounting_ledger(created_by);
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_customer_id ON internal_accounting_ledger(customer_id);

-- Internal Invoice Tables
CREATE INDEX IF NOT EXISTS idx_internal_invoices_business_unit_id ON internal_invoices(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_internal_invoices_created_by ON internal_invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_internal_invoices_customer_id ON internal_invoices(customer_id);
