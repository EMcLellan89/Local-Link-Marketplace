/*
  # Add Missing Foreign Key Indexes - New Batch 3
  
  1. New Indexes
    - idx_dfy_orders_product_id on dfy_orders(product_id)
    - idx_events_merchant_id on events(merchant_id)
    - idx_financial_subscriptions_merchant_id on financial_subscriptions(merchant_id)
    - idx_invoices_customer_id on invoices(customer_id)
    - idx_ll_crm_contacts_merchant_id on ll_crm_contacts(merchant_id)
    - idx_ll_crm_documents_merchant_id on ll_crm_documents(merchant_id)
    - idx_ll_crm_payments_invoice_id on ll_crm_payments(invoice_id)
    - idx_ll_crm_workflow_executions_deal_id on ll_crm_workflow_executions(deal_id)
  
  2. Performance
    - Improves join and foreign key lookup performance
    - Essential for query optimization
*/

-- dfy_orders.product_id
CREATE INDEX IF NOT EXISTS idx_dfy_orders_product_id 
ON dfy_orders(product_id);

-- events.merchant_id
CREATE INDEX IF NOT EXISTS idx_events_merchant_id 
ON events(merchant_id);

-- financial_subscriptions.merchant_id
CREATE INDEX IF NOT EXISTS idx_financial_subscriptions_merchant_id 
ON financial_subscriptions(merchant_id);

-- invoices.customer_id
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id 
ON invoices(customer_id);

-- ll_crm_contacts.merchant_id
CREATE INDEX IF NOT EXISTS idx_ll_crm_contacts_merchant_id 
ON ll_crm_contacts(merchant_id);

-- ll_crm_documents.merchant_id
CREATE INDEX IF NOT EXISTS idx_ll_crm_documents_merchant_id 
ON ll_crm_documents(merchant_id);

-- ll_crm_payments.invoice_id
CREATE INDEX IF NOT EXISTS idx_ll_crm_payments_invoice_id 
ON ll_crm_payments(invoice_id);

-- ll_crm_workflow_executions.deal_id
CREATE INDEX IF NOT EXISTS idx_ll_crm_workflow_executions_deal_id 
ON ll_crm_workflow_executions(deal_id);