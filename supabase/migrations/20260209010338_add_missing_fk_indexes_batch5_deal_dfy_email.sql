/*
  # Add Missing Foreign Key Indexes - Batch 5
  
  1. Tables Covered
    - Deal tables (deal_analytics, deal_clicks, deal_impressions, deal_locations, deal_performance_stats, deal_templates, deal_transactions, deals)
    - DFY (Done For You) tables (dfy_ad_vault, dfy_addons, dfy_campaign_steps, dfy_commission_ledger, dfy_content_items, dfy_disputes, dfy_fulfillment_tasks, dfy_intakes, dfy_job_submissions, dfy_jobs, dfy_onboarding, dfy_orders, dfy_product_stripe, dfy_updates)
    - Email tables (email_automation_sequences, email_automation_steps, email_campaigns, email_communications, email_sends, email_subscribers, email_subscriptions, email_templates)
    
  2. Performance Impact
    - Adds indexes on foreign key columns to prevent N+1 queries
    - Improves JOIN performance for deals, fulfillment workflows, and email campaigns
    - Critical for deal tracking, order processing, and marketing operations
    
  3. Security
    - No security changes, only performance optimization
*/

-- Deal tables
CREATE INDEX IF NOT EXISTS idx_deal_analytics_deal_id ON deal_analytics(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_clicks_deal_id ON deal_clicks(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_impressions_deal_id ON deal_impressions(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_locations_deal_id ON deal_locations(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_locations_location_id ON deal_locations(location_id);
CREATE INDEX IF NOT EXISTS idx_deal_performance_stats_deal_id ON deal_performance_stats(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_templates_merchant_id ON deal_templates(merchant_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_bundle_id ON deal_transactions(bundle_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_campaign_id ON deal_transactions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_customer_id ON deal_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_deal_id ON deal_transactions(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_merchant_id ON deal_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_partner_id ON deal_transactions(partner_id);
CREATE INDEX IF NOT EXISTS idx_deal_transactions_vendor_id ON deal_transactions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_deals_merchant_id ON deals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_deals_partner_id ON deals(partner_id);
CREATE INDEX IF NOT EXISTS idx_deals_qr_code_id ON deals(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_deals_territory_id ON deals(territory_id);

-- DFY tables
CREATE INDEX IF NOT EXISTS idx_dfy_ad_vault_product_slug ON dfy_ad_vault(product_slug);
CREATE INDEX IF NOT EXISTS idx_dfy_addons_product_id ON dfy_addons(product_id);
CREATE INDEX IF NOT EXISTS idx_dfy_campaign_steps_campaign_id ON dfy_campaign_steps(campaign_id);
CREATE INDEX IF NOT EXISTS idx_dfy_commission_ledger_order_id ON dfy_commission_ledger(order_id);
CREATE INDEX IF NOT EXISTS idx_dfy_content_items_pack_id ON dfy_content_items(pack_id);
CREATE INDEX IF NOT EXISTS idx_dfy_disputes_job_id ON dfy_disputes(job_id);
CREATE INDEX IF NOT EXISTS idx_dfy_fulfillment_tasks_order_id ON dfy_fulfillment_tasks(order_id);
CREATE INDEX IF NOT EXISTS idx_dfy_intakes_merchant_id ON dfy_intakes(merchant_id);
CREATE INDEX IF NOT EXISTS idx_dfy_intakes_provider_id ON dfy_intakes(provider_id);
CREATE INDEX IF NOT EXISTS idx_dfy_job_submissions_job_id ON dfy_job_submissions(job_id);
CREATE INDEX IF NOT EXISTS idx_dfy_jobs_service_id ON dfy_jobs(service_id);
CREATE INDEX IF NOT EXISTS idx_dfy_onboarding_order_id ON dfy_onboarding(order_id);
CREATE INDEX IF NOT EXISTS idx_dfy_orders_product_id ON dfy_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_dfy_product_stripe_product_id ON dfy_product_stripe(product_id);
CREATE INDEX IF NOT EXISTS idx_dfy_updates_intake_id ON dfy_updates(intake_id);

-- Email tables
CREATE INDEX IF NOT EXISTS idx_email_automation_sequences_merchant_id ON email_automation_sequences(merchant_id);
CREATE INDEX IF NOT EXISTS idx_email_automation_steps_sequence_id ON email_automation_steps(sequence_id);
CREATE INDEX IF NOT EXISTS idx_email_automation_steps_template_id ON email_automation_steps(template_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_merchant_id ON email_campaigns(merchant_id);
CREATE INDEX IF NOT EXISTS idx_email_communications_business_unit_id ON email_communications(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_email_communications_customer_id ON email_communications(customer_id);
CREATE INDEX IF NOT EXISTS idx_email_communications_sent_by ON email_communications(sent_by);
CREATE INDEX IF NOT EXISTS idx_email_sends_campaign_id ON email_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_subscriber_id ON email_sends(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_merchant_id ON email_subscribers(merchant_id);
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_merchant_id ON email_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_merchant_id ON email_templates(merchant_id);
