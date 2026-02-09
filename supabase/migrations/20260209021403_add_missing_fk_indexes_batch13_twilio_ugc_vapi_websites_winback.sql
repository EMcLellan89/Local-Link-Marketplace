/*
  # Add Missing Foreign Key Indexes - Batch 13: Twilio, UGC, VAPI, Websites & Winback Tables
  
  1. Performance Optimization
    - Adds indexes to unindexed foreign key columns for the remaining tables
  
  2. Tables Covered
    - twilio_call_logs (merchant_id)
    - twilio_email_logs (merchant_id)
    - twilio_sms_logs (merchant_id)
    - ugc_orders (creator_id, merchant_id)
    - unified_sales (customer_id)
    - upsell_purchases (user_id)
    - user_subscriptions (user_id)
    - vapi_assistants (merchant_id)
    - vapi_call_logs (assistant_id, merchant_id)
    - website_orders (merchant_id)
    - weekly_creative_winners (creative_id)
    - white_label_licenses (partner_id)
    - winback_campaigns (merchant_id)
    - winback_conversions (customer_id)
    - winback_outreach (campaign_id, customer_id)
    - winback_triggers (campaign_id, customer_id)
*/

DO $$
BEGIN
  -- Twilio
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_call_logs' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_twilio_call_logs_merchant_id ON twilio_call_logs(merchant_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_email_logs' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_twilio_email_logs_merchant_id ON twilio_email_logs(merchant_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'twilio_sms_logs' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_twilio_sms_logs_merchant_id ON twilio_sms_logs(merchant_id);
  END IF;
  
  -- UGC
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ugc_orders' AND column_name = 'creator_id') THEN
    CREATE INDEX IF NOT EXISTS idx_ugc_orders_creator_id ON ugc_orders(creator_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ugc_orders' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_ugc_orders_merchant_id ON ugc_orders(merchant_id);
  END IF;
  
  -- Unified sales
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'unified_sales' AND column_name = 'customer_id') THEN
    CREATE INDEX IF NOT EXISTS idx_unified_sales_customer_id ON unified_sales(customer_id);
  END IF;
  
  -- Upsells
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'upsell_purchases' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_upsell_purchases_user_id ON upsell_purchases(user_id);
  END IF;
  
  -- User subscriptions
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_subscriptions' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
  END IF;
  
  -- VAPI
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vapi_assistants' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_vapi_assistants_merchant_id ON vapi_assistants(merchant_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vapi_call_logs' AND column_name = 'assistant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_vapi_call_logs_assistant_id ON vapi_call_logs(assistant_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vapi_call_logs' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_vapi_call_logs_merchant_id ON vapi_call_logs(merchant_id);
  END IF;
  
  -- Websites
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'website_orders' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_website_orders_merchant_id ON website_orders(merchant_id);
  END IF;
  
  -- Weekly winners
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'weekly_creative_winners' AND column_name = 'creative_id') THEN
    CREATE INDEX IF NOT EXISTS idx_weekly_creative_winners_creative_id ON weekly_creative_winners(creative_id);
  END IF;
  
  -- White label
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'white_label_licenses' AND column_name = 'partner_id') THEN
    CREATE INDEX IF NOT EXISTS idx_white_label_licenses_partner_id ON white_label_licenses(partner_id);
  END IF;
  
  -- Winback campaigns
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'winback_campaigns' AND column_name = 'merchant_id') THEN
    CREATE INDEX IF NOT EXISTS idx_winback_campaigns_merchant_id ON winback_campaigns(merchant_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'winback_conversions' AND column_name = 'customer_id') THEN
    CREATE INDEX IF NOT EXISTS idx_winback_conversions_customer_id ON winback_conversions(customer_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'winback_outreach' AND column_name = 'campaign_id') THEN
    CREATE INDEX IF NOT EXISTS idx_winback_outreach_campaign_id ON winback_outreach(campaign_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'winback_outreach' AND column_name = 'customer_id') THEN
    CREATE INDEX IF NOT EXISTS idx_winback_outreach_customer_id ON winback_outreach(customer_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'winback_triggers' AND column_name = 'campaign_id') THEN
    CREATE INDEX IF NOT EXISTS idx_winback_triggers_campaign_id ON winback_triggers(campaign_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'winback_triggers' AND column_name = 'customer_id') THEN
    CREATE INDEX IF NOT EXISTS idx_winback_triggers_customer_id ON winback_triggers(customer_id);
  END IF;
END $$;