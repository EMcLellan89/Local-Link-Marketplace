/*
  # Add Missing Foreign Key Indexes - New Batch 4
  
  1. New Indexes
    - idx_merchants_partner_id on merchants(partner_id)
    - idx_notifications_merchant_id on notifications(merchant_id)
    - idx_partner_crm_deals_contact_id on partner_crm_deals(contact_id)
    - idx_partner_crm_subscriptions_partner_id on partner_crm_subscriptions(partner_id)
    - idx_partner_tax_payments_partner_id on partner_tax_payments(partner_id)
    - idx_partners_user_id on partners(user_id)
    - idx_paybright_transactions_customer_id on paybright_transactions(customer_id)
    - idx_purchases_deal_id on purchases(deal_id)
  
  2. Performance
    - Improves join and foreign key lookup performance
    - Essential for query optimization
*/

-- merchants.partner_id
CREATE INDEX IF NOT EXISTS idx_merchants_partner_id 
ON merchants(partner_id);

-- notifications.merchant_id
CREATE INDEX IF NOT EXISTS idx_notifications_merchant_id 
ON notifications(merchant_id);

-- partner_crm_deals.contact_id
CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_contact_id 
ON partner_crm_deals(contact_id);

-- partner_crm_subscriptions.partner_id
CREATE INDEX IF NOT EXISTS idx_partner_crm_subscriptions_partner_id 
ON partner_crm_subscriptions(partner_id);

-- partner_tax_payments.partner_id
CREATE INDEX IF NOT EXISTS idx_partner_tax_payments_partner_id 
ON partner_tax_payments(partner_id);

-- partners.user_id
CREATE INDEX IF NOT EXISTS idx_partners_user_id 
ON partners(user_id);

-- paybright_transactions.customer_id
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_customer_id 
ON paybright_transactions(customer_id);

-- purchases.deal_id
CREATE INDEX IF NOT EXISTS idx_purchases_deal_id 
ON purchases(deal_id);