/*
  # Add All Foreign Key Indexes - Batch 5 (Gift, Internal, Invoice, Lead, Loyalty, Marketing)
  
  1. Foreign Key Indexes for:
    - Gift card, Internal, Invoice, Lead, Loyalty, Marketing tables
*/

-- gift_card_templates
CREATE INDEX IF NOT EXISTS idx_gift_card_templates_merchant_id 
  ON gift_card_templates(merchant_id);

-- gift_card_transactions
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_gift_card_id 
  ON gift_card_transactions(gift_card_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_purchase_id 
  ON gift_card_transactions(purchase_id);

-- gift_cards
CREATE INDEX IF NOT EXISTS idx_gift_cards_purchased_by_customer_id 
  ON gift_cards(purchased_by_customer_id);

-- internal_accounting_ledger
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_business_unit_id 
  ON internal_accounting_ledger(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_created_by 
  ON internal_accounting_ledger(created_by);
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_customer_id 
  ON internal_accounting_ledger(customer_id);

-- internal_invoices
CREATE INDEX IF NOT EXISTS idx_internal_invoices_business_unit_id 
  ON internal_invoices(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_internal_invoices_created_by 
  ON internal_invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_internal_invoices_customer_id 
  ON internal_invoices(customer_id);

-- invoice_items
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id 
  ON invoice_items(invoice_id);

-- invoice_payments
CREATE INDEX IF NOT EXISTS idx_invoice_payments_invoice_id 
  ON invoice_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_merchant_id 
  ON invoice_payments(merchant_id);

-- invoices
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id 
  ON invoices(customer_id);

-- lead_list_orders
CREATE INDEX IF NOT EXISTS idx_lead_list_orders_merchant_id 
  ON lead_list_orders(merchant_id);

-- loyalty_events
CREATE INDEX IF NOT EXISTS idx_loyalty_events_customer_id 
  ON loyalty_events(customer_id);

-- marketing_campaigns
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_segment_id 
  ON marketing_campaigns(segment_id);

-- marketing_email_campaigns
CREATE INDEX IF NOT EXISTS idx_marketing_email_campaigns_business_unit_id 
  ON marketing_email_campaigns(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_marketing_email_campaigns_created_by 
  ON marketing_email_campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_marketing_email_campaigns_segment_id 
  ON marketing_email_campaigns(segment_id);
