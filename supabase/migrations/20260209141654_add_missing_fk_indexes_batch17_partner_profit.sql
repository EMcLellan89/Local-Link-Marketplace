/*
  # Add Missing Foreign Key Indexes - Batch 17: Partner System & Profit Network

  1. New Indexes
    - partner_crm_subscriptions.partner_id
    - partner_crm_tasks.contact_id
    - partner_crm_tasks.deal_id
    - partner_crm_tasks.partner_id
    - partner_milestones.partner_id
    - partner_outreach_log.partner_id
    - partner_overrides.partner_id
    - partner_playbook_progress.partner_id
    - partner_playbook_progress.playbook_id
    - partner_prompts.partner_id
    - partner_referral_links.partner_id
    - partner_share_kit_items.partner_id
    - partner_tax_payments.partner_id
    - partner_territories.partner_id
    - partner_tier_history.partner_id
    - partner_tier_history.tier_id
    - partner_training_progress.partner_id
    - profit_network_orders.business_id
    - profit_network_orders.partner_id
    - profit_network_profit_shares.business_id
    - profit_network_profit_shares.partner_id

  2. Performance Impact
    - Improves partner tracking and territory management
    - Optimizes profit network commission calculations
*/

-- Partner System Indexes (continued)
CREATE INDEX IF NOT EXISTS idx_partner_crm_subscriptions_partner_id ON partner_crm_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_tasks_contact_id ON partner_crm_tasks(contact_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_tasks_deal_id ON partner_crm_tasks(deal_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_tasks_partner_id ON partner_crm_tasks(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_milestones_partner_id ON partner_milestones(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_outreach_log_partner_id ON partner_outreach_log(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_overrides_partner_id ON partner_overrides(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_playbook_progress_partner_id ON partner_playbook_progress(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_playbook_progress_playbook_id ON partner_playbook_progress(playbook_id);
CREATE INDEX IF NOT EXISTS idx_partner_prompts_partner_id ON partner_prompts(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_referral_links_partner_id ON partner_referral_links(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_share_kit_items_partner_id ON partner_share_kit_items(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_tax_payments_partner_id ON partner_tax_payments(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_territories_partner_id ON partner_territories(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_tier_history_partner_id ON partner_tier_history(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_tier_history_tier_id ON partner_tier_history(tier_id);
CREATE INDEX IF NOT EXISTS idx_partner_training_progress_partner_id ON partner_training_progress(partner_id);

-- Profit Network Indexes
CREATE INDEX IF NOT EXISTS idx_profit_network_orders_business_id ON profit_network_orders(business_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_orders_partner_id ON profit_network_orders(partner_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_profit_shares_business_id ON profit_network_profit_shares(business_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_profit_shares_partner_id ON profit_network_profit_shares(partner_id);
