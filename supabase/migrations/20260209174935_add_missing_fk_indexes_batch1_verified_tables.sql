/*
  # Add Missing Foreign Key Indexes - Batch 1: Verified Tables
  
  1. Purpose
    - Add covering indexes for unindexed foreign key constraints
    - Only includes tables/columns verified to exist
    - Improves query performance and constraint checking
  
  2. Tables Affected
    - affiliate_commissions: partner_id, order_id
    - appointments: customer_id
    - customers: user_id, referred_by_partner_id
    - merchants: user_id, category_id, partner_id, territory_id, referred_by_partner_id
    - partners: user_id
    - profiles: partner_id
  
  3. Security
    - Indexes improve performance of FK constraint checks
    - No RLS changes required
*/

-- Affiliate Commissions
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_partner_id 
  ON public.affiliate_commissions(partner_id);

CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_order_id 
  ON public.affiliate_commissions(order_id);

-- Appointments
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id 
  ON public.appointments(customer_id);

-- Customers
CREATE INDEX IF NOT EXISTS idx_customers_user_id 
  ON public.customers(user_id);

CREATE INDEX IF NOT EXISTS idx_customers_referred_by_partner_id 
  ON public.customers(referred_by_partner_id);

-- Merchants
CREATE INDEX IF NOT EXISTS idx_merchants_user_id 
  ON public.merchants(user_id);

CREATE INDEX IF NOT EXISTS idx_merchants_category_id 
  ON public.merchants(category_id);

CREATE INDEX IF NOT EXISTS idx_merchants_partner_id 
  ON public.merchants(partner_id);

CREATE INDEX IF NOT EXISTS idx_merchants_territory_id 
  ON public.merchants(territory_id);

CREATE INDEX IF NOT EXISTS idx_merchants_referred_by_partner_id 
  ON public.merchants(referred_by_partner_id);

-- Partners
CREATE INDEX IF NOT EXISTS idx_partners_user_id 
  ON public.partners(user_id);

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_partner_id 
  ON public.profiles(partner_id);