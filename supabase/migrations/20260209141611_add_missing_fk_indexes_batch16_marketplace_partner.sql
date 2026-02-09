/*
  # Add Missing Foreign Key Indexes - Batch 16: Marketplace & Partner System

  1. New Indexes
    - marketplace_affiliate_clicks.affiliate_id
    - marketplace_affiliate_clicks.product_id
    - marketplace_affiliate_commissions.affiliate_id
    - marketplace_affiliate_commissions.order_id
    - marketplace_affiliate_commissions.product_id
    - marketplace_affiliate_links.affiliate_id
    - marketplace_affiliate_links.product_id
    - marketplace_checkout_sessions.partner_id
    - marketplace_checkout_sessions.product_id
    - marketplace_orders.partner_id
    - marketplace_orders.product_id
    - partner_ad_vault_items.partner_id
    - partner_bundles.partner_id
    - partner_certifications.partner_id
    - partner_challenge_participants.challenge_id
    - partner_challenge_participants.partner_id
    - partner_contracts.partner_id
    - partner_crm_contacts.partner_id
    - partner_crm_deals.contact_id
    - partner_crm_deals.partner_id

  2. Performance Impact
    - Improves marketplace affiliate tracking and commission calculations
    - Optimizes partner system queries
*/

-- Marketplace Indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_clicks_affiliate_id ON marketplace_affiliate_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_clicks_product_id ON marketplace_affiliate_clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_commissions_affiliate_id ON marketplace_affiliate_commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_commissions_order_id ON marketplace_affiliate_commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_commissions_product_id ON marketplace_affiliate_commissions(product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_links_affiliate_id ON marketplace_affiliate_links(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_affiliate_links_product_id ON marketplace_affiliate_links(product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_partner_id ON marketplace_checkout_sessions(partner_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_checkout_sessions_product_id ON marketplace_checkout_sessions(product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_partner_id ON marketplace_orders(partner_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_product_id ON marketplace_orders(product_id);

-- Partner System Indexes
CREATE INDEX IF NOT EXISTS idx_partner_ad_vault_items_partner_id ON partner_ad_vault_items(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_bundles_partner_id ON partner_bundles(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_certifications_partner_id ON partner_certifications(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_challenge_participants_challenge_id ON partner_challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_partner_challenge_participants_partner_id ON partner_challenge_participants(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_contracts_partner_id ON partner_contracts(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_contacts_partner_id ON partner_crm_contacts(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_contact_id ON partner_crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_partner_id ON partner_crm_deals(partner_id);
