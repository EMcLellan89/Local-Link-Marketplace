/*
  # Add Missing Foreign Key Indexes - Batch 1: Accounting & Affiliate Tables (Corrected)

  1. Purpose
    - Add missing foreign key indexes to improve JOIN performance
    - Focus on accounting and affiliate-related tables
  
  2. Tables Affected
    - accounting_transactions (customer_id, merchant_id, account_id, journal_entry_id)
    - affiliate_clicks (partner_id, converted_user_id)
    - affiliate_commissions (partner_id, order_id, payout_id, referred_user_id)
    - crm_activities (lead_id, merchant_id, user_id)
    - deal_transactions (customer_id, merchant_id, deal_id, partner_id, vendor_id, campaign_id, bundle_id)
  
  3. Performance Impact
    - Significantly improves JOIN query performance
    - Reduces table scan overhead
*/

-- Accounting transactions indexes
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_customer_id ON accounting_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_merchant_id ON accounting_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_account_id ON accounting_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_transactions_journal_entry_id ON accounting_transactions(journal_entry_id);

-- Affiliate clicks indexes
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_partner_id ON affiliate_clicks(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_converted_user_id ON affiliate_clicks(converted_user_id);

-- Affiliate commissions indexes
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_partner_id ON affiliate_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_order_id ON affiliate_commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_payout_id ON affiliate_commissions(payout_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_referred_user_id ON affiliate_commissions(referred_user_id);

-- CRM activity indexes
CREATE INDEX IF NOT EXISTS idx_crm_activities_lead_id ON crm_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_merchant_id ON crm_activities(merchant_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_user_id ON crm_activities(user_id);

-- Deal transaction indexes
CREATE INDEX IF NOT EXISTS idx_deal_transactions_customer_id ON deal_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_merchant_id ON deal_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_deal_id ON deal_transactions(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_partner_id ON deal_transactions(partner_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_vendor_id ON deal_transactions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_campaign_id ON deal_transactions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_bundle_id ON deal_transactions(bundle_id);
