/*
  # Add Missing Foreign Key Indexes - Batch 3: Purchases & Referrals (Corrected)

  1. Purpose
    - Add missing foreign key indexes for purchase and referral tracking
    - Essential for revenue and attribution reporting
  
  2. Tables Affected
    - purchases (customer_id, deal_id, paybright_transaction_id)
    - referrals (referred_customer_id, referrer_customer_id)
    - reviews (customer_id, merchant_id, deal_id, purchase_id)
    - support_tickets (customer_id, merchant_id)
  
  3. Performance Impact
    - Faster purchase history queries
    - Improved referral tracking performance
*/

-- Purchase indexes
CREATE INDEX IF NOT EXISTS idx_purchases_customer_id ON purchases(customer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_deal_id ON purchases(deal_id);
CREATE INDEX IF NOT EXISTS idx_purchases_paybright_transaction_id ON purchases(paybright_transaction_id);

-- Referral indexes (using actual column names)
CREATE INDEX IF NOT EXISTS idx_referrals_referred_customer_id ON referrals(referred_customer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_customer_id ON referrals(referrer_customer_id);

-- Review indexes
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_merchant_id ON reviews(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_deal_id ON reviews(deal_id);
CREATE INDEX IF NOT EXISTS idx_reviews_purchase_id ON reviews(purchase_id);

-- Support ticket indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id ON support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_merchant_id ON support_tickets(merchant_id);
