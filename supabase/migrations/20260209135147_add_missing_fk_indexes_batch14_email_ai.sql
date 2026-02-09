/*
  # Add Missing Foreign Key Indexes - Batch 14: Email Queue & AI

  1. Changes
    - Add indexes for email_queue (user_id)
    - Add indexes for partner_assets (partner_id)
    - Add indexes for product_commission_rules (product_id)
    - Add indexes for partner_agreements (partner_id)
    - Add indexes for partner_onboarding_progress (step_key)
    - Add indexes for sms_queue (user_id)
    - Add indexes for ai_assistant_conversations (user_id)
    - Add indexes for ai_package_items (bot_addon_id)
    
  2. Rationale
    - Email and SMS queues need fast user lookups
    - AI conversation tracking needs user filtering
    - Partner asset management needs partner queries
    
  3. Performance Impact
    - Faster email/SMS queue processing
    - Better AI conversation history queries
    - Improved partner resource management
*/

-- Email Queue
CREATE INDEX IF NOT EXISTS idx_email_queue_user_id ON email_queue(user_id);

-- Partner Assets
CREATE INDEX IF NOT EXISTS idx_partner_assets_partner_id ON partner_assets(partner_id);

-- Product Commission Rules
CREATE INDEX IF NOT EXISTS idx_product_commission_rules_product_id ON product_commission_rules(product_id);

-- Partner Agreements
CREATE INDEX IF NOT EXISTS idx_partner_agreements_partner_id ON partner_agreements(partner_id);

-- Partner Onboarding Progress
CREATE INDEX IF NOT EXISTS idx_partner_onboarding_progress_step_key ON partner_onboarding_progress(step_key);

-- SMS Queue
CREATE INDEX IF NOT EXISTS idx_sms_queue_user_id ON sms_queue(user_id);

-- AI Assistant Conversations
CREATE INDEX IF NOT EXISTS idx_ai_assistant_conversations_user_id ON ai_assistant_conversations(user_id);

-- AI Package Items
CREATE INDEX IF NOT EXISTS idx_ai_package_items_bot_addon_id ON ai_package_items(bot_addon_id);
