/*
  # Fix Missing Foreign Key Indexes - Batch 7 (Expansion, Gift Cards, Internal, Invoice Tables)
  
  1. Performance
    - Add indexes on all unindexed foreign keys
  
  2. Tables Updated
    - expansion_requests
    - expenses
    - external_business_webhooks
    - gift card tables
    - internal tables
    - invoice tables
*/

CREATE INDEX IF NOT EXISTS idx_expansion_requests_partner_id ON expansion_requests(partner_id);
CREATE INDEX IF NOT EXISTS idx_expenses_merchant_id ON expenses(merchant_id);
CREATE INDEX IF NOT EXISTS idx_external_business_webhooks_business_unit_id ON external_business_webhooks(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_templates_merchant_id ON gift_card_templates(merchant_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_gift_card_id ON gift_card_transactions(gift_card_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_purchase_id ON gift_card_transactions(purchase_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_purchased_by_customer_id ON gift_cards(purchased_by_customer_id);
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_business_unit_id ON internal_accounting_ledger(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_created_by ON internal_accounting_ledger(created_by);
CREATE INDEX IF NOT EXISTS idx_internal_accounting_ledger_customer_id ON internal_accounting_ledger(customer_id);
CREATE INDEX IF NOT EXISTS idx_internal_invoices_business_unit_id ON internal_invoices(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_internal_invoices_created_by ON internal_invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_internal_invoices_customer_id ON internal_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_invoice_id ON invoice_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_merchant_id ON invoice_payments(merchant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
