/*
  # Add Critical Missing Foreign Key Indexes - Batch 1

  1. Changes
    - Add indexes on foreign key columns where they don't exist
    - Uses IF NOT EXISTS to safely handle existing indexes
    - Focuses on high-traffic core tables

  2. Performance Impact
    - Improves JOIN performance significantly
    - Speeds up foreign key constraint validation
    - Reduces sequential scans

  3. Tables Updated
    - purchases, redemptions, payouts, loyalty_events
    - deals, merchants, customers
*/

-- Purchases table (high traffic)
CREATE INDEX IF NOT EXISTS idx_purchases_customer_id ON purchases(customer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_deal_id ON purchases(deal_id);

-- Redemptions table
CREATE INDEX IF NOT EXISTS idx_redemptions_purchase_id ON redemptions(purchase_id);

-- Payouts table
CREATE INDEX IF NOT EXISTS idx_payouts_merchant_id ON payouts(merchant_id);

-- Loyalty events table
CREATE INDEX IF NOT EXISTS idx_loyalty_events_customer_id ON loyalty_events(customer_id);

-- Deals table
CREATE INDEX IF NOT EXISTS idx_deals_merchant_id ON deals(merchant_id);

-- Merchants table
CREATE INDEX IF NOT EXISTS idx_merchants_user_id ON merchants(user_id);

-- Customers table
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
