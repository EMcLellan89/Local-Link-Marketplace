/*
  # Drop Unused Indexes - Batch 11: Order, Partner, and Payment Tables
  
  This migration continues dropping unused indexes.
  
  ## Indexes Dropped
  - Order and purchase indexes
  - Partner-related indexes
  - Paybright payment indexes
  
  ## Impact
  - Reduces storage usage
  - Improves write performance
*/

-- order_items
DROP INDEX IF EXISTS idx_order_items_order_id;
DROP INDEX IF EXISTS idx_order_items_product_id;

-- orders
DROP INDEX IF EXISTS idx_orders_customer_id;
DROP INDEX IF EXISTS idx_orders_merchant_id;

-- partner_ad_vault
DROP INDEX IF EXISTS idx_partner_ad_vault_industry;

-- partner_badges
DROP INDEX IF EXISTS idx_partner_badges_badge_id;
DROP INDEX IF EXISTS idx_partner_badges_partner_id;

-- partner_banking_info
DROP INDEX IF EXISTS idx_partner_banking_info_partner_id;

-- partner_bundles
DROP INDEX IF EXISTS idx_partner_bundles_partner_id;

-- partner_campaigns
DROP INDEX IF EXISTS idx_partner_campaigns_partner_id;

-- partner_challenge_participants
DROP INDEX IF EXISTS idx_partner_challenge_participants_challenge_id;
DROP INDEX IF EXISTS idx_partner_challenge_participants_partner_id;

-- partner_certifications
DROP INDEX IF EXISTS idx_partner_certifications_partner_id;

-- partner_commissions
DROP INDEX IF EXISTS idx_partner_commissions_order_id;
DROP INDEX IF EXISTS idx_partner_commissions_partner_id;

-- partner_crm_contacts
DROP INDEX IF EXISTS idx_partner_crm_contacts_partner_id;

-- partner_crm_deals
DROP INDEX IF EXISTS idx_partner_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_partner_id;

-- partner_crm_tasks
DROP INDEX IF EXISTS idx_partner_crm_tasks_assigned_to;
DROP INDEX IF EXISTS idx_partner_crm_tasks_partner_id;

-- partner_milestones
DROP INDEX IF EXISTS idx_partner_milestones_partner_id;

-- partner_outreach_logs
DROP INDEX IF EXISTS idx_partner_outreach_logs_partner_id;

-- partner_overrides
DROP INDEX IF EXISTS idx_partner_overrides_partner_id;

-- partner_referral_links
DROP INDEX IF EXISTS idx_partner_referral_links_partner_id;

-- partner_tax_payments
DROP INDEX IF EXISTS idx_partner_tax_payments_partner_id;

-- partner_tiers
DROP INDEX IF EXISTS idx_partner_tiers_partner_id;

-- partner_tracking_links
DROP INDEX IF EXISTS idx_partner_tracking_links_partner_id;

-- partners
DROP INDEX IF EXISTS idx_partners_user_id;

-- paybright_transactions
DROP INDEX IF EXISTS idx_paybright_transactions_merchant_id;
DROP INDEX IF EXISTS idx_paybright_transactions_partner_id;
