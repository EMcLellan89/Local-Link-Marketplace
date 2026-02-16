/*
  # Drop Unused Indexes - Security Audit Batch 7
  
  Drops unused indexes from notifications, orders, partner, and paybright tables.
  
  These indexes have not been used and are safe to remove for improved database performance.
  
  Tables affected:
  - notifications
  - order_items, orders
  - partner_ad_vault, partner_badges, partner_banking_info, partner_challenge_entries
  - partner_commissions, partner_contracts, partner_crm_contacts, partner_crm_deals
  - partner_crm_subscriptions, partner_notifications, partner_overrides, partner_outreach_logs
  - partner_playbook_progress, partner_progress, partner_referral_links, partner_tax_payments
  - partner_territories, partner_tier_history, partner_tiers, partner_tracking_links, partners
  - paybright_payments, paybright_subscriptions
*/

-- Notification tables
DROP INDEX IF EXISTS idx_notifications_user_id;
DROP INDEX IF EXISTS idx_notifications_read;

-- Order tables
DROP INDEX IF EXISTS idx_order_items_order_id;
DROP INDEX IF EXISTS idx_order_items_product_id;
DROP INDEX IF EXISTS idx_orders_customer_id;
DROP INDEX IF EXISTS idx_orders_merchant_id;
DROP INDEX IF EXISTS idx_orders_status;

-- Partner tables
DROP INDEX IF EXISTS idx_partner_ad_vault_partner_id;
DROP INDEX IF EXISTS idx_partner_badges_partner_id;
DROP INDEX IF EXISTS idx_partner_badges_badge_id;
DROP INDEX IF EXISTS idx_partner_banking_info_partner_id;
DROP INDEX IF EXISTS idx_partner_challenge_entries_partner_id;
DROP INDEX IF EXISTS idx_partner_challenge_entries_challenge_id;
DROP INDEX IF EXISTS idx_partner_commissions_partner_id;
DROP INDEX IF EXISTS idx_partner_commissions_order_id;
DROP INDEX IF EXISTS idx_partner_contracts_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_contacts_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_partner_id;
DROP INDEX IF EXISTS idx_partner_crm_deals_contact_id;
DROP INDEX IF EXISTS idx_partner_crm_subscriptions_partner_id;
DROP INDEX IF EXISTS idx_partner_notifications_partner_id;
DROP INDEX IF EXISTS idx_partner_overrides_partner_id;
DROP INDEX IF EXISTS idx_partner_outreach_logs_partner_id;
DROP INDEX IF EXISTS idx_partner_playbook_progress_partner_id;
DROP INDEX IF EXISTS idx_partner_playbook_progress_playbook_id;
DROP INDEX IF EXISTS idx_partner_progress_partner_id;
DROP INDEX IF EXISTS idx_partner_referral_links_partner_id;
DROP INDEX IF EXISTS idx_partner_tax_payments_partner_id;
DROP INDEX IF EXISTS idx_partner_territories_partner_id;
DROP INDEX IF EXISTS idx_partner_tier_history_partner_id;
DROP INDEX IF EXISTS idx_partner_tiers_tier_name;
DROP INDEX IF EXISTS idx_partner_tracking_links_partner_id;
DROP INDEX IF EXISTS idx_partners_user_id;
DROP INDEX IF EXISTS idx_partners_territory_id;

-- Paybright tables
DROP INDEX IF EXISTS idx_paybright_payments_merchant_id;
DROP INDEX IF EXISTS idx_paybright_payments_status;
DROP INDEX IF EXISTS idx_paybright_subscriptions_merchant_id;