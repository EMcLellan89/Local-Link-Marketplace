/*
  # Add All Foreign Key Indexes - Batch 7 (Notification, Order, Partner)
  
  1. Foreign Key Indexes for:
    - Notification, Order, Partner tables
*/

-- notifications
CREATE INDEX IF NOT EXISTS idx_notifications_customer_id 
  ON notifications(customer_id);

-- order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id 
  ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id 
  ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id 
  ON order_items(variant_id);

-- orders
CREATE INDEX IF NOT EXISTS idx_orders_customer_account_id 
  ON orders(customer_account_id);
CREATE INDEX IF NOT EXISTS idx_orders_partner_id 
  ON orders(partner_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id 
  ON orders(user_id);

-- partner_agreement_acceptances
CREATE INDEX IF NOT EXISTS idx_partner_agreement_acceptances_user_id 
  ON partner_agreement_acceptances(user_id);

-- partner_agreements
CREATE INDEX IF NOT EXISTS idx_partner_agreements_partner_id 
  ON partner_agreements(partner_id);

-- partner_ai_commissions
CREATE INDEX IF NOT EXISTS idx_partner_ai_commissions_merchant_id 
  ON partner_ai_commissions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_partner_ai_commissions_partner_id 
  ON partner_ai_commissions(partner_id);

-- partner_applications
CREATE INDEX IF NOT EXISTS idx_partner_applications_reviewed_by 
  ON partner_applications(reviewed_by);

-- partner_assets
CREATE INDEX IF NOT EXISTS idx_partner_assets_partner_id 
  ON partner_assets(partner_id);

-- partner_bonuses
CREATE INDEX IF NOT EXISTS idx_partner_bonuses_affiliate_id 
  ON partner_bonuses(affiliate_id);

-- partner_contracts
CREATE INDEX IF NOT EXISTS idx_partner_contracts_partner_id 
  ON partner_contracts(partner_id);

-- partner_crm_subscriptions
CREATE INDEX IF NOT EXISTS idx_partner_crm_subscriptions_partner_id 
  ON partner_crm_subscriptions(partner_id);

-- partner_customer_links
CREATE INDEX IF NOT EXISTS idx_partner_customer_links_customer_account_id 
  ON partner_customer_links(customer_account_id);

-- partner_onboarding_progress
CREATE INDEX IF NOT EXISTS idx_partner_onboarding_progress_step_key 
  ON partner_onboarding_progress(step_key);

-- partner_referrals
CREATE INDEX IF NOT EXISTS idx_partner_referrals_merchant_id 
  ON partner_referrals(merchant_id);

-- partner_subscriptions
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_partner_id 
  ON partner_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_tier_id 
  ON partner_subscriptions(tier_id);

-- partner_warning_logs
CREATE INDEX IF NOT EXISTS idx_partner_warning_logs_partner_id 
  ON partner_warning_logs(partner_id);

-- partners
CREATE INDEX IF NOT EXISTS idx_partners_user_id 
  ON partners(user_id);
