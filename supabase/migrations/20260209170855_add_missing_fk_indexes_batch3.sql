/*
  # Add Missing Foreign Key Indexes - Batch 3
  
  Adds covering indexes for unindexed foreign keys to improve query performance.
  
  1. Indexes Added
    - partner_contracts.partner_id
    - shopping_carts.customer_id
    - transactions.merchant_id
*/

CREATE INDEX IF NOT EXISTS idx_partner_contracts_partner_id 
  ON partner_contracts(partner_id);

CREATE INDEX IF NOT EXISTS idx_shopping_carts_customer_id 
  ON shopping_carts(customer_id);

CREATE INDEX IF NOT EXISTS idx_transactions_merchant_id 
  ON transactions(merchant_id);
