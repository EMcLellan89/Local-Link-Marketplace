/*
  # Add Missing Foreign Key Indexes - Batch 2: Core Tables

  1. Changes
    - Add indexes for profiles.partner_id
    - Add indexes for merchant foreign keys (category_id, partner_id, territory_id, etc.)
    - Add indexes for customer foreign keys (referred_by_partner_id)
    - Add indexes for deal foreign keys (partner_id, qr_code_id, territory_id)
    - Add indexes for purchase foreign keys (paybright_transaction_id)
    
  2. Rationale
    - Foreign keys without indexes cause poor JOIN performance
    - These are high-traffic tables with frequent joins
    
  3. Performance Impact
    - Significant improvement for merchant and deal queries
    - Better partner attribution tracking performance
*/

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_partner_id ON profiles(partner_id);

-- Merchants
CREATE INDEX IF NOT EXISTS idx_merchants_category_id ON merchants(category_id);
CREATE INDEX IF NOT EXISTS idx_merchants_current_subscription_id ON merchants(current_subscription_id);
CREATE INDEX IF NOT EXISTS idx_merchants_partner_id ON merchants(partner_id);
CREATE INDEX IF NOT EXISTS idx_merchants_referred_by_partner_id ON merchants(referred_by_partner_id);
CREATE INDEX IF NOT EXISTS idx_merchants_territory_id ON merchants(territory_id);

-- Customers
CREATE INDEX IF NOT EXISTS idx_customers_referred_by_partner_id ON customers(referred_by_partner_id);

-- Deals - note: deals_merchant_id already exists from main schema
CREATE INDEX IF NOT EXISTS idx_deals_partner_id ON deals(partner_id);
CREATE INDEX IF NOT EXISTS idx_deals_qr_code_id ON deals(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_deals_territory_id ON deals(territory_id);

-- Purchases - note: some indexes already exist from main schema
CREATE INDEX IF NOT EXISTS idx_purchases_paybright_transaction_id ON purchases(paybright_transaction_id);

-- Merchant Subscriptions
CREATE INDEX IF NOT EXISTS idx_merchant_subscriptions_tier_id ON merchant_subscriptions(tier_id);
