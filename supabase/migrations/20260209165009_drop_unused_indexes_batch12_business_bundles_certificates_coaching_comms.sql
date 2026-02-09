/*
  # Drop Unused Indexes - Batch 12: More specialized unused indexes
  
  ## Additional Unused Indexes:
  - More timestamp indexes
  - More status indexes
  - More relationship indexes that are never scanned
*/

-- Additional timestamp indexes
DROP INDEX IF EXISTS idx_partner_contracts_signed_at;
DROP INDEX IF EXISTS idx_partner_progress_updated_at;
DROP INDEX IF EXISTS idx_partner_territories_created_at;
DROP INDEX IF EXISTS idx_purchases_purchased_at;
DROP INDEX IF EXISTS idx_referrals_referred_at;
DROP INDEX IF EXISTS idx_reviews_reviewed_at;
DROP INDEX IF EXISTS idx_subscriptions_created_at;
DROP INDEX IF EXISTS idx_support_tickets_updated_at;

-- Additional status indexes
DROP INDEX IF EXISTS idx_affiliate_commissions_paid;
DROP INDEX IF EXISTS idx_dfy_orders_paid;
DROP INDEX IF EXISTS idx_expansion_requests_approved;
DROP INDEX IF EXISTS idx_invoices_paid;
DROP INDEX IF EXISTS idx_marketplace_affiliate_commissions_paid;
DROP INDEX IF EXISTS idx_partner_contracts_active;
DROP INDEX IF EXISTS idx_referrals_converted;

-- Additional relationship indexes
DROP INDEX IF EXISTS idx_bundle_products_product_id;
DROP INDEX IF EXISTS idx_campaign_creatives_creative_id;
DROP INDEX IF EXISTS idx_coaching_sessions_session_type;
DROP INDEX IF EXISTS idx_customer_preferences_preference_type;
DROP INDEX IF EXISTS idx_deal_templates_template_type;
DROP INDEX IF EXISTS idx_dfy_campaign_content_content_id;
DROP INDEX IF EXISTS idx_email_templates_template_type;
DROP INDEX IF EXISTS idx_loyalty_rewards_reward_type;
DROP INDEX IF EXISTS idx_marketplace_products_product_type;
DROP INDEX IF EXISTS idx_partner_swipe_assets_asset_type;
DROP INDEX IF EXISTS idx_printing_products_product_type;
DROP INDEX IF EXISTS idx_products_product_type;
DROP INDEX IF EXISTS idx_website_templates_template_type;

-- Additional merchant/user relationship indexes
DROP INDEX IF EXISTS idx_blog_posts_merchant_id;
DROP INDEX IF EXISTS idx_coaching_sessions_client_id;
DROP INDEX IF EXISTS idx_customer_rewards_balance_merchant_id;
DROP INDEX IF EXISTS idx_email_campaigns_created_by;
DROP INDEX IF EXISTS idx_events_created_by;
DROP INDEX IF EXISTS idx_invoices_customer_id;
DROP INDEX IF EXISTS idx_sms_campaigns_created_by;
DROP INDEX IF EXISTS idx_support_tickets_assigned_to;

-- More unused indexes
DROP INDEX IF EXISTS idx_academy_lessons_lesson_type;
DROP INDEX IF EXISTS idx_academy_modules_module_type;
DROP INDEX IF EXISTS idx_admin_actions_action_type;
DROP INDEX IF EXISTS idx_ai_bot_executions_status;
DROP INDEX IF EXISTS idx_ai_job_queue_priority;
DROP INDEX IF EXISTS idx_audit_log_action;
DROP INDEX IF EXISTS idx_budget_buster_transactions_category;
DROP INDEX IF EXISTS idx_cart_items_created_at;
DROP INDEX IF EXISTS idx_communications_transactions_transaction_type;