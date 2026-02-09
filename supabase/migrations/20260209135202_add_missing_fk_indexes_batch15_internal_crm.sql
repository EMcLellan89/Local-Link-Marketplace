/*
  # Add Missing Foreign Key Indexes - Batch 15: Internal CRM

  1. Changes
    - Add indexes for unified_customers (primary_business_unit_id)
    - Add indexes for customer_business_relationships (business_unit_id)
    - Add indexes for internal_invoices (business_unit_id, customer_id, created_by)
    - Add indexes for unified_sales (business_unit_id, customer_id, invoice_id)
    - Add indexes for internal_accounting_ledger (business_unit_id, customer_id, created_by)
    - Add indexes for customer_support_tickets (business_unit_id, customer_id, assigned_to)
    - Add indexes for ticket_messages (ticket_id)
    - Add indexes for customer_activity_log (business_unit_id, customer_id, performed_by)
    
  2. Rationale
    - Internal CRM requires efficient business unit filtering
    - Customer relationship tracking needs fast queries
    - Support ticket management needs user lookups
    
  3. Performance Impact
    - Faster internal dashboard loading
    - Better customer history queries
    - Improved support ticket tracking
*/

-- Unified Customers
CREATE INDEX IF NOT EXISTS idx_unified_customers_primary_business_unit_id ON unified_customers(primary_business_unit_id);

-- Customer Business Relationships
CREATE INDEX IF NOT EXISTS idx_customer_business_relationships_business_unit_id ON customer_business_relationships(business_unit_id);

-- Internal Invoices
CREATE INDEX IF NOT EXISTS idx_internal_invoices_business_unit_id ON internal_invoices(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_internal_invoices_customer_id ON internal_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_internal_invoices_created_by ON internal_invoices(created_by);

-- Unified Sales
CREATE INDEX IF NOT EXISTS idx_unified_sales_business_unit_id ON unified_sales(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_unified_sales_customer_id ON unified_sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_unified_sales_invoice_id ON unified_sales(invoice_id);

-- Internal Accounting Ledger
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_business_unit_id ON internal_accounting_ledger(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_customer_id ON internal_accounting_ledger(customer_id);
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_created_by ON internal_accounting_ledger(created_by);

-- Customer Support Tickets
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_business_unit_id ON customer_support_tickets(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_customer_id ON customer_support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_assigned_to ON customer_support_tickets(assigned_to);

-- Ticket Messages
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);

-- Customer Activity Log
CREATE INDEX IF NOT EXISTS idx_customer_activity_log_business_unit_id ON customer_activity_log(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_customer_activity_log_customer_id ON customer_activity_log(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_activity_log_performed_by ON customer_activity_log(performed_by);
