/*
  # Add Missing Foreign Key Indexes - Batch 28: Business Ads & Recurring Commissions

  1. Changes
    - Add indexes for business_ad_campaigns (business_id)
    - Add indexes for recurring_commission_schedule (order_id, partner_id, product_id)
    - Add indexes for profit_based_commission_costs (order_id, product_id)
    - Add indexes for external_business_sales (partner_id)
    
  2. Rationale
    - Business ad campaigns require business lookups
    - Recurring commission tracking needs order and partner queries
    - External business sales need partner filtering
    
  3. Performance Impact
    - Faster ad campaign management
    - Better recurring commission processing
    - Improved external sales reporting
*/

-- Business Ad Campaigns
CREATE INDEX IF NOT EXISTS idx_business_ad_campaigns_business_id ON business_ad_campaigns(business_id);

-- Recurring Commission Schedule
CREATE INDEX IF NOT EXISTS idx_recurring_commission_schedule_order_id ON recurring_commission_schedule(order_id);
CREATE INDEX IF NOT EXISTS idx_recurring_commission_schedule_partner_id ON recurring_commission_schedule(partner_id);
CREATE INDEX IF NOT EXISTS idx_recurring_commission_schedule_product_id ON recurring_commission_schedule(product_id);

-- Profit Based Commission Costs
CREATE INDEX IF NOT EXISTS idx_profit_based_commission_costs_order_id ON profit_based_commission_costs(order_id);
CREATE INDEX IF NOT EXISTS idx_profit_based_commission_costs_product_id ON profit_based_commission_costs(product_id);

-- External Business Sales
CREATE INDEX IF NOT EXISTS idx_external_business_sales_partner_id ON external_business_sales(partner_id);
