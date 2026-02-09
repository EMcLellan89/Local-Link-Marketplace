/*
  # Add All Foreign Key Indexes - Batch 12 (UGC, Unified, Upsell, User, Video, Website, Winback) - FINAL
  
  1. Foreign Key Indexes for:
    - UGC, Unified, Upsell, User, Video, Website, Winback tables (final batch)
*/

-- ugc_assets
CREATE INDEX IF NOT EXISTS idx_ugc_assets_order_id 
  ON ugc_assets(order_id);

-- ugc_orders
CREATE INDEX IF NOT EXISTS idx_ugc_orders_creator_id 
  ON ugc_orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_package_id 
  ON ugc_orders(package_id);

-- ugc_payouts
CREATE INDEX IF NOT EXISTS idx_ugc_payouts_creator_id 
  ON ugc_payouts(creator_id);
CREATE INDEX IF NOT EXISTS idx_ugc_payouts_order_id 
  ON ugc_payouts(order_id);

-- unified_customers
CREATE INDEX IF NOT EXISTS idx_unified_customers_primary_business_unit_id 
  ON unified_customers(primary_business_unit_id);

-- unified_sales
CREATE INDEX IF NOT EXISTS idx_unified_sales_business_unit_id 
  ON unified_sales(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_unified_sales_customer_id 
  ON unified_sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_unified_sales_invoice_id 
  ON unified_sales(invoice_id);

-- upsell_purchases
CREATE INDEX IF NOT EXISTS idx_upsell_purchases_upsell_offer_id 
  ON upsell_purchases(upsell_offer_id);
CREATE INDEX IF NOT EXISTS idx_upsell_purchases_user_id 
  ON upsell_purchases(user_id);

-- user_subscriptions
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id 
  ON user_subscriptions(user_id);

-- video_deliverables
CREATE INDEX IF NOT EXISTS idx_video_deliverables_order_id 
  ON video_deliverables(order_id);

-- video_revisions
CREATE INDEX IF NOT EXISTS idx_video_revisions_order_id 
  ON video_revisions(order_id);
CREATE INDEX IF NOT EXISTS idx_video_revisions_requested_by 
  ON video_revisions(requested_by);

-- video_scripts
CREATE INDEX IF NOT EXISTS idx_video_scripts_approved_by 
  ON video_scripts(approved_by);
CREATE INDEX IF NOT EXISTS idx_video_scripts_order_id 
  ON video_scripts(order_id);

-- video_service_orders
CREATE INDEX IF NOT EXISTS idx_video_service_orders_merchant_id 
  ON video_service_orders(merchant_id);

-- website_orders
CREATE INDEX IF NOT EXISTS idx_website_orders_merchant_id 
  ON website_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_website_orders_template_id 
  ON website_orders(template_id);

-- winback_campaigns
CREATE INDEX IF NOT EXISTS idx_winback_campaigns_merchant_id 
  ON winback_campaigns(merchant_id);

-- winback_conversions
CREATE INDEX IF NOT EXISTS idx_winback_conversions_customer_id 
  ON winback_conversions(customer_id);
CREATE INDEX IF NOT EXISTS idx_winback_conversions_outreach_id 
  ON winback_conversions(outreach_id);

-- winback_outreach
CREATE INDEX IF NOT EXISTS idx_winback_outreach_campaign_id 
  ON winback_outreach(campaign_id);
CREATE INDEX IF NOT EXISTS idx_winback_outreach_customer_id 
  ON winback_outreach(customer_id);
CREATE INDEX IF NOT EXISTS idx_winback_outreach_trigger_id 
  ON winback_outreach(trigger_id);

-- winback_triggers
CREATE INDEX IF NOT EXISTS idx_winback_triggers_campaign_id 
  ON winback_triggers(campaign_id);
CREATE INDEX IF NOT EXISTS idx_winback_triggers_customer_id 
  ON winback_triggers(customer_id);
