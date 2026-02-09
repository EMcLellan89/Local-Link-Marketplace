/*
  # Add Missing Foreign Key Indexes - Batch 6: Gift Cards & Support

  1. Changes
    - Add indexes for gift_cards (merchant_id, purchased_by_customer_id)
    - Add indexes for gift_card_transactions (gift_card_id, purchase_id)
    - Add indexes for customer_memberships (tier_id)
    - Add indexes for support_tickets (customer_id, merchant_id)
    - Add indexes for support_messages (ticket_id)
    
  2. Rationale
    - Gift card lookups and transactions need fast queries
    - Support ticket management requires efficient filtering
    
  3. Performance Impact
    - Faster gift card balance checks
    - Better support dashboard performance
*/

-- Gift Cards
CREATE INDEX IF NOT EXISTS idx_gift_cards_merchant_id ON gift_cards(merchant_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_purchased_by_customer_id ON gift_cards(purchased_by_customer_id);

-- Gift Card Transactions
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_gift_card_id ON gift_card_transactions(gift_card_id);
CREATE INDEX IF NOT EXISTS idx_gift_card_transactions_purchase_id ON gift_card_transactions(purchase_id);

-- Customer Memberships
CREATE INDEX IF NOT EXISTS idx_customer_memberships_tier_id ON customer_memberships(tier_id);

-- Support Tickets
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id ON support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_merchant_id ON support_tickets(merchant_id);

-- Support Messages
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);
