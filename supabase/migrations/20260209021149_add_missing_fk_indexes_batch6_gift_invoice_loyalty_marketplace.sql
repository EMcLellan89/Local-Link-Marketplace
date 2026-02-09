/*
  # Add Missing Foreign Key Indexes - Batch 6: Gift Cards, Invoices, Loyalty & Marketplace Tables
  
  1. Performance Optimization
    - Adds indexes to unindexed foreign key columns for gift cards, invoices, loyalty, and marketplace systems
  
  2. Tables Covered
    - gift_cards (merchant_id)
    - invoice_items (invoice_id)
    - invoices (customer_id)
    - loyalty_events (customer_id)
    - marketplace_checkout_sessions (user_id)
*/

DO $$
BEGIN
  -- Gift cards
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gift_cards' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_gift_cards_merchant_id ON gift_cards(merchant_id);
  END IF;
  
  -- Invoicing
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoice_items' AND column_name = 'invoice_id') THEN
    CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'customer_id') THEN
    CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
  END IF;
  
  -- Loyalty
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'loyalty_events' AND column_name = 'customer_id') THEN
    CREATE INDEX IF NOT EXISTS idx_loyalty_events_customer_id ON loyalty_events(customer_id);
  END IF;
  
  -- Marketplace
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_checkout_sessions' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_user_id ON marketplace_checkout_sessions(user_id);
  END IF;
END $$;