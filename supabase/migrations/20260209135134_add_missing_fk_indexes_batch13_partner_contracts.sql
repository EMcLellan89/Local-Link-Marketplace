/*
  # Add Missing Foreign Key Indexes - Batch 13: Partner Contracts & Commissions

  1. Changes
    - Add indexes for partner_contracts (partner_id)
    - Add indexes for affiliate_commissions (partner_id, referred_user_id)
    - Add indexes for affiliate_clicks (partner_id, converted_user_id)
    - Add indexes for partner_agreement_acceptances (user_id)
    - Add indexes for certificates_issued (user_id)
    - Add indexes for badge_awards (user_id)
    - Add indexes for partner_bonuses (affiliate_id)
    - Add indexes for partner_customer_links (customer_account_id)
    - Add indexes for partner_crm_subscriptions (partner_id)
    
  2. Rationale
    - Partner management requires efficient contract lookups
    - Commission tracking needs fast partner queries
    - Badge and certificate systems need user lookups
    
  3. Performance Impact
    - Faster commission calculations
    - Better partner dashboard performance
    - Improved badge and certificate queries
*/

-- Partner Contracts
CREATE INDEX IF NOT EXISTS idx_partner_contracts_partner_id ON partner_contracts(partner_id);

-- Affiliate Commissions
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_partner_id ON affiliate_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_referred_user_id ON affiliate_commissions(referred_user_id);

-- Affiliate Clicks
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_partner_id ON affiliate_clicks(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_converted_user_id ON affiliate_clicks(converted_user_id);

-- Partner Agreement Acceptances
CREATE INDEX IF NOT EXISTS idx_partner_agreement_acceptances_user_id ON partner_agreement_acceptances(user_id);

-- Certificates Issued
CREATE INDEX IF NOT EXISTS idx_certificates_issued_user_id ON certificates_issued(user_id);

-- Badge Awards
CREATE INDEX IF NOT EXISTS idx_badge_awards_user_id ON badge_awards(user_id);

-- Partner Bonuses
CREATE INDEX IF NOT EXISTS idx_partner_bonuses_affiliate_id ON partner_bonuses(affiliate_id);

-- Partner Customer Links
CREATE INDEX IF NOT EXISTS idx_partner_customer_links_customer_account_id ON partner_customer_links(customer_account_id);

-- Partner CRM Subscriptions
CREATE INDEX IF NOT EXISTS idx_partner_crm_subscriptions_partner_id ON partner_crm_subscriptions(partner_id);
