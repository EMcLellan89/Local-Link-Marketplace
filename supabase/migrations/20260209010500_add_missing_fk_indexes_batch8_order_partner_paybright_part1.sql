/*
  # Add Missing Foreign Key Indexes - Batch 8 Part 1
  
  1. Tables Covered
    - Order tables (order_items, orders)
    - Partner tables (first half: partner_accounting_*, partner_activity_log, partner_ad_budgets, partner_ai_commissions, partner_badge_awards, partner_badges, partner_bank_accounts, partner_bonuses, partner_campaigns, partner_certifications, partner_certs, partner_challenge_*, partner_contracts)
    
  2. Performance Impact
    - Adds indexes on foreign key columns to prevent N+1 queries
    - Improves JOIN performance for order processing and partner management
    - Critical for commission calculations and partner dashboards
    
  3. Security
    - No security changes, only performance optimization
*/

-- Order tables
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON order_items(variant_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_account_id ON orders(customer_account_id);
CREATE INDEX IF NOT EXISTS idx_orders_partner_id ON orders(partner_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Partner accounting tables
CREATE INDEX IF NOT EXISTS idx_partner_accounting_categories_parent_category_id ON partner_accounting_categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_pro_partner_id ON partner_accounting_pro(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_bank_account_id ON partner_accounting_transactions(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_category_id ON partner_accounting_transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_deal_id ON partner_accounting_transactions(deal_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_partner_id ON partner_accounting_transactions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_tax_payment_id ON partner_accounting_transactions(tax_payment_id);

-- Partner activity and badges
CREATE INDEX IF NOT EXISTS idx_partner_activity_log_partner_id ON partner_activity_log(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_ad_budgets_partner_id ON partner_ad_budgets(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_ai_commissions_merchant_id ON partner_ai_commissions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_partner_ai_commissions_partner_id ON partner_ai_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_badge_awards_partner_id ON partner_badge_awards(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_badges_badge_id ON partner_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_partner_badges_partner_id ON partner_badges(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_bank_accounts_partner_id ON partner_bank_accounts(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_bonuses_affiliate_id ON partner_bonuses(affiliate_id);

-- Partner campaigns and certifications
CREATE INDEX IF NOT EXISTS idx_partner_campaigns_creative_id ON partner_campaigns(creative_id);
CREATE INDEX IF NOT EXISTS idx_partner_campaigns_partner_id ON partner_campaigns(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_certifications_certification_id ON partner_certifications(certification_id);
CREATE INDEX IF NOT EXISTS idx_partner_certs_cert_id ON partner_certs(cert_id);
CREATE INDEX IF NOT EXISTS idx_partner_certs_partner_id ON partner_certs(partner_id);

-- Partner challenges
CREATE INDEX IF NOT EXISTS idx_partner_challenge_enrollments_partner_id ON partner_challenge_enrollments(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_challenge_progress_enrollment_id ON partner_challenge_progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_partner_challenge_progress_partner_id ON partner_challenge_progress(partner_id);

-- Partner contracts
CREATE INDEX IF NOT EXISTS idx_partner_contracts_partner_id ON partner_contracts(partner_id);
