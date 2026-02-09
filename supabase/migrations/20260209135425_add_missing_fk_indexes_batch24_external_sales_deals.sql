/*
  # Add Missing Foreign Key Indexes - Batch 24: External Sales & Business Deals

  1. Changes
    - Add indexes for external_sales_events (partner_id)
    - Add indexes for external_sale_commissions (partner_id, external_sales_event_id, external_system_id)
    - Add indexes for business_deals (vendor_id)
    - Add indexes for bundle_items (bundle_id, deal_id)
    - Add indexes for deal_transactions (all foreign keys)
    - Add indexes for partner_deal_links (bundle_id, deal_id)
    
  2. Rationale
    - External sales tracking requires efficient partner queries
    - Business deals need vendor and bundle lookups
    - Transaction tracking needs comprehensive indexing
    
  3. Performance Impact
    - Faster external sales reporting
    - Better deal bundle management
    - Improved transaction queries
*/

-- External Sales
CREATE INDEX IF NOT EXISTS idx_external_sales_events_partner_id ON external_sales_events(partner_id);
CREATE INDEX IF NOT EXISTS idx_external_sale_commissions_partner_id ON external_sale_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_external_sale_commissions_external_sales_event_id ON external_sale_commissions(external_sales_event_id);
CREATE INDEX IF NOT EXISTS idx_external_sale_commissions_external_system_id ON external_sale_commissions(external_system_id);

-- Business Deals
CREATE INDEX IF NOT EXISTS idx_business_deals_vendor_id ON business_deals(vendor_id);

-- Bundle Items
CREATE INDEX IF NOT EXISTS idx_bundle_items_bundle_id ON bundle_items(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_items_deal_id ON bundle_items(deal_id);

-- Deal Transactions
CREATE INDEX IF NOT EXISTS idx_deal_transactions_bundle_id ON deal_transactions(bundle_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_campaign_id ON deal_transactions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_customer_id ON deal_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_deal_id ON deal_transactions(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_merchant_id ON deal_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_partner_id ON deal_transactions(partner_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_vendor_id ON deal_transactions(vendor_id);

-- Partner Deal Links
CREATE INDEX IF NOT EXISTS idx_partner_deal_links_bundle_id ON partner_deal_links(bundle_id);
CREATE INDEX IF NOT EXISTS idx_partner_deal_links_deal_id ON partner_deal_links(deal_id);
