/*
  # Add Missing Foreign Key Indexes - Batch 12: Affiliates & Stripe

  1. Changes
    - Add indexes for user_entitlements (course_id)
    - Add indexes for affiliate_partners (user_id)
    - Add indexes for affiliate_referrals (partner_id, referred_user_id)
    - Add indexes for affiliate_payouts (partner_id)
    - Add indexes for product_course_map (course_slug)
    - Add indexes for user_subscriptions (user_id)
    - Add indexes for stripe_subscription_map (user_id)
    - Add indexes for stripe_customers (user_id)
    - Add indexes for upsell_purchases (user_id, upsell_offer_id)
    
  2. Rationale
    - Affiliate tracking requires fast partner lookups
    - Stripe customer mapping needs efficient queries
    - User subscription management needs fast user lookups
    
  3. Performance Impact
    - Faster affiliate commission calculations
    - Better subscription status checks
    - Improved course access validation
*/

-- User Entitlements
CREATE INDEX IF NOT EXISTS idx_user_entitlements_course_id ON user_entitlements(course_id);

-- Affiliate Partners
CREATE INDEX IF NOT EXISTS idx_affiliate_partners_user_id ON affiliate_partners(user_id);

-- Affiliate Referrals
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_partner_id ON affiliate_referrals(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_referred_user_id ON affiliate_referrals(referred_user_id);

-- Affiliate Payouts
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_partner_id ON affiliate_payouts(partner_id);

-- Product Course Map
CREATE INDEX IF NOT EXISTS idx_product_course_map_course_slug ON product_course_map(course_slug);

-- User Subscriptions
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);

-- Stripe Subscription Map
CREATE INDEX IF NOT EXISTS idx_stripe_subscription_map_user_id ON stripe_subscription_map(user_id);

-- Stripe Customers
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON stripe_customers(user_id);

-- Upsell Purchases
CREATE INDEX IF NOT EXISTS idx_upsell_purchases_user_id ON upsell_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_upsell_purchases_upsell_offer_id ON upsell_purchases(upsell_offer_id);
