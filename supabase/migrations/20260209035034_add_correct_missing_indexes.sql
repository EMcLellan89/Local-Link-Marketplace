/*
  # Add Correct Missing Foreign Key Indexes

  1. Purpose
    - Add indexes using correct column names from schema
    - Improves query performance for foreign key lookups

  2. Indexes Added (verified column names)
    - customer_referrals: referrer_customer_id, referee_customer_id
    - marketplace_affiliate_commissions: marketplace_affiliate_id, referral_id
    - marketplace_commissions: partner_id, order_id
    - marketplace_orders: user_id, partner_id, product_id
*/

-- Customer referrals indexes (correct column names)
CREATE INDEX IF NOT EXISTS idx_customer_referrals_referrer_customer_id 
  ON customer_referrals(referrer_customer_id);

CREATE INDEX IF NOT EXISTS idx_customer_referrals_referee_customer_id 
  ON customer_referrals(referee_customer_id);

-- Marketplace affiliate commissions indexes (correct column names)
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_commissions_marketplace_affiliate_id 
  ON marketplace_affiliate_commissions(marketplace_affiliate_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_commissions_referral_id 
  ON marketplace_affiliate_commissions(referral_id);

-- Marketplace commissions indexes  
CREATE INDEX IF NOT EXISTS idx_marketplace_commissions_partner_id 
  ON marketplace_commissions(partner_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_commissions_order_id 
  ON marketplace_commissions(order_id);

-- Marketplace orders indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_user_id 
  ON marketplace_orders(user_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_orders_partner_id 
  ON marketplace_orders(partner_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_orders_product_id 
  ON marketplace_orders(product_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_orders_price_id 
  ON marketplace_orders(price_id);

-- Other critical foreign key indexes
CREATE INDEX IF NOT EXISTS idx_ll_crm_contacts_merchant_id 
  ON ll_crm_contacts(merchant_id);

CREATE INDEX IF NOT EXISTS idx_ll_crm_deals_merchant_id 
  ON ll_crm_deals(merchant_id);

CREATE INDEX IF NOT EXISTS idx_ll_crm_deals_contact_id 
  ON ll_crm_deals(contact_id);

CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_partner_id 
  ON partner_crm_deals(partner_id);

CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_contact_id 
  ON partner_crm_deals(contact_id);

CREATE INDEX IF NOT EXISTS idx_partner_crm_contacts_partner_id 
  ON partner_crm_contacts(partner_id);
