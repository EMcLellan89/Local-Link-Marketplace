/*
  # Drop Duplicate Indexes - Batch 2

  1. Changes
    - Drop additional duplicate indexes
    - Continues cleanup from batch 1
    
  2. Indexes Being Dropped
    - idx_crm_contacts_merchant (duplicate of idx_crm_contacts_merchant_id)
    - idx_crm_leads_merchant (duplicate of idx_crm_leads_merchant_id)
    - idx_merchant_orders_merchant (duplicate of idx_merchant_orders_merchant_id)
    - idx_reviews_merchant (duplicate of idx_reviews_merchant_id)
    - idx_loyalty_members_merchant (duplicate of idx_loyalty_members_merchant_id)
    - idx_loyalty_transactions_merchant (duplicate of idx_loyalty_transactions_merchant_id)
    - idx_qr_codes_merchant (duplicate of idx_qr_codes_merchant_id)
    - idx_campaigns_merchant (duplicate of idx_campaigns_merchant_id)
    - idx_notifications_user (duplicate of idx_notifications_user_id)
    - idx_referrals_customer (duplicate of idx_referrals_customer_id)
*/

-- CRM indexes
DROP INDEX IF EXISTS idx_crm_contacts_merchant;
DROP INDEX IF EXISTS idx_crm_leads_merchant;

-- Order and review indexes
DROP INDEX IF EXISTS idx_merchant_orders_merchant;
DROP INDEX IF EXISTS idx_reviews_merchant;

-- Loyalty indexes
DROP INDEX IF EXISTS idx_loyalty_members_merchant;
DROP INDEX IF EXISTS idx_loyalty_transactions_merchant;

-- QR and campaign indexes
DROP INDEX IF EXISTS idx_qr_codes_merchant;
DROP INDEX IF EXISTS idx_campaigns_merchant;

-- Notification and referral indexes
DROP INDEX IF EXISTS idx_notifications_user;
DROP INDEX IF EXISTS idx_referrals_customer;