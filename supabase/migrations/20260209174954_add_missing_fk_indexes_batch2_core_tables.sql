/*
  # Add Missing Foreign Key Indexes - Batch 2: Core Business Tables
  
  1. Purpose
    - Add covering indexes for unindexed foreign key constraints
    - Focuses on deals, CRM, reviews, purchases, and referrals
  
  2. Tables Affected
    - deals: merchant_id, partner_id, qr_code_id, territory_id
    - crm_contacts: company_id
    - crm_deals: company_id, contact_id
    - crm_leads: merchant_id
    - favorites: customer_id, deal_id, merchant_id
    - merchant_orders: merchant_id
    - notifications: customer_id, merchant_id
    - purchases: customer_id, deal_id, paybright_transaction_id, stripe_payment_id
    - referrals: referred_customer_id, referrer_customer_id
    - reviews: customer_id, deal_id, merchant_id, purchase_id
  
  3. Security
    - Indexes improve performance of FK constraint checks
    - No RLS changes required
*/

-- Deals
CREATE INDEX IF NOT EXISTS idx_deals_merchant_id 
  ON public.deals(merchant_id);

CREATE INDEX IF NOT EXISTS idx_deals_partner_id 
  ON public.deals(partner_id);

CREATE INDEX IF NOT EXISTS idx_deals_qr_code_id 
  ON public.deals(qr_code_id);

CREATE INDEX IF NOT EXISTS idx_deals_territory_id 
  ON public.deals(territory_id);

-- CRM Tables
CREATE INDEX IF NOT EXISTS idx_crm_contacts_company_id 
  ON public.crm_contacts(company_id);

CREATE INDEX IF NOT EXISTS idx_crm_deals_company_id 
  ON public.crm_deals(company_id);

CREATE INDEX IF NOT EXISTS idx_crm_deals_contact_id 
  ON public.crm_deals(contact_id);

CREATE INDEX IF NOT EXISTS idx_crm_leads_merchant_id 
  ON public.crm_leads(merchant_id);

-- Favorites
CREATE INDEX IF NOT EXISTS idx_favorites_customer_id 
  ON public.favorites(customer_id);

CREATE INDEX IF NOT EXISTS idx_favorites_deal_id 
  ON public.favorites(deal_id);

CREATE INDEX IF NOT EXISTS idx_favorites_merchant_id 
  ON public.favorites(merchant_id);

-- Merchant Orders
CREATE INDEX IF NOT EXISTS idx_merchant_orders_merchant_id 
  ON public.merchant_orders(merchant_id);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_customer_id 
  ON public.notifications(customer_id);

CREATE INDEX IF NOT EXISTS idx_notifications_merchant_id 
  ON public.notifications(merchant_id);

-- Purchases
CREATE INDEX IF NOT EXISTS idx_purchases_customer_id 
  ON public.purchases(customer_id);

CREATE INDEX IF NOT EXISTS idx_purchases_deal_id 
  ON public.purchases(deal_id);

CREATE INDEX IF NOT EXISTS idx_purchases_paybright_transaction_id 
  ON public.purchases(paybright_transaction_id);

CREATE INDEX IF NOT EXISTS idx_purchases_stripe_payment_id 
  ON public.purchases(stripe_payment_id);

-- Referrals
CREATE INDEX IF NOT EXISTS idx_referrals_referred_customer_id 
  ON public.referrals(referred_customer_id);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_customer_id 
  ON public.referrals(referrer_customer_id);

-- Reviews
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id 
  ON public.reviews(customer_id);

CREATE INDEX IF NOT EXISTS idx_reviews_deal_id 
  ON public.reviews(deal_id);

CREATE INDEX IF NOT EXISTS idx_reviews_merchant_id 
  ON public.reviews(merchant_id);

CREATE INDEX IF NOT EXISTS idx_reviews_purchase_id 
  ON public.reviews(purchase_id);