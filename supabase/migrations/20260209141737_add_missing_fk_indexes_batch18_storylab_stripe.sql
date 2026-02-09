/*
  # Add Missing Foreign Key Indexes - Batch 18: StoryLab & Stripe

  1. New Indexes
    - storylab_orders.creator_id
    - storylab_orders.package_id
    - storylab_orders.partner_id
    - storylab_profit_shares.creator_id
    - storylab_profit_shares.partner_id
    - storylab_statements.creator_id
    - stripe_connect_accounts.partner_id
    - stripe_webhook_events.partner_id

  2. Performance Impact
    - Improves StoryLab order and creator tracking
    - Optimizes Stripe webhook processing and connect account queries
*/

-- StoryLab Indexes
CREATE INDEX IF NOT EXISTS idx_storylab_orders_creator_id ON storylab_orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_storylab_orders_package_id ON storylab_orders(package_id);
CREATE INDEX IF NOT EXISTS idx_storylab_orders_partner_id ON storylab_orders(partner_id);
CREATE INDEX IF NOT EXISTS idx_storylab_profit_shares_creator_id ON storylab_profit_shares(creator_id);
CREATE INDEX IF NOT EXISTS idx_storylab_profit_shares_partner_id ON storylab_profit_shares(partner_id);
CREATE INDEX IF NOT EXISTS idx_storylab_statements_creator_id ON storylab_statements(creator_id);

-- Stripe Indexes
CREATE INDEX IF NOT EXISTS idx_stripe_connect_accounts_partner_id ON stripe_connect_accounts(partner_id);
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_partner_id ON stripe_webhook_events(partner_id);
