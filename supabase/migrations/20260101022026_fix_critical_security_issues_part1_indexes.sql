/*
  # Fix Critical Security Issues - Part 1: Missing Indexes
  
  1. Adds missing foreign key indexes for optimal query performance
     - partner_ai_commissions.merchant_id
     - ugc_orders.package_id
     - ugc_payouts.order_id
*/

-- Add missing foreign key indexes
CREATE INDEX IF NOT EXISTS idx_partner_ai_commissions_merchant_id 
  ON partner_ai_commissions(merchant_id);

CREATE INDEX IF NOT EXISTS idx_ugc_orders_package_id 
  ON ugc_orders(package_id);

CREATE INDEX IF NOT EXISTS idx_ugc_payouts_order_id 
  ON ugc_payouts(order_id);
