/*
  # Drop Unused Indexes - Batch 15: QR, Postcards, BI, Final Cleanup
  
  ## Additional Unused Indexes:
  - QR codes
  - Postcards
  - Partner misc
  - BI analytics
  - Final cleanup
*/

-- QR codes
DROP INDEX IF EXISTS idx_qr_codes_code;
DROP INDEX IF EXISTS idx_qr_codes_qr_type;
DROP INDEX IF EXISTS idx_qr_codes_scanned_count;

-- Postcards
DROP INDEX IF EXISTS idx_postcard_orders_order_date;
DROP INDEX IF EXISTS idx_postcard_orders_status;

-- Partner system
DROP INDEX IF EXISTS idx_partner_swipe_assets_category;
DROP INDEX IF EXISTS idx_partner_tax_documents_created_at;
DROP INDEX IF EXISTS idx_partner_tax_documents_tax_year;
DROP INDEX IF EXISTS idx_partner_tax_payments_created_at;
DROP INDEX IF EXISTS idx_partner_tax_payments_payment_date;
DROP INDEX IF EXISTS idx_partner_territories_status;
DROP INDEX IF EXISTS idx_partner_tiers_tier_name;
DROP INDEX IF EXISTS idx_partner_training_progress_completed_at;
DROP INDEX IF EXISTS idx_partner_training_progress_lesson_id;
DROP INDEX IF EXISTS idx_partners_partner_type;
DROP INDEX IF EXISTS idx_partners_status;

-- BI Analytics
DROP INDEX IF EXISTS idx_bi_dashboards_created_at;
DROP INDEX IF EXISTS idx_bi_dashboards_merchant_id;
DROP INDEX IF EXISTS idx_bi_reports_created_at;
DROP INDEX IF EXISTS idx_bi_reports_merchant_id;
DROP INDEX IF EXISTS idx_bi_reports_report_type;

-- Printing
DROP INDEX IF EXISTS idx_printing_orders_order_date;
DROP INDEX IF EXISTS idx_printing_orders_status;

-- Referral short links
DROP INDEX IF EXISTS idx_referral_short_links_clicks;
DROP INDEX IF EXISTS idx_referral_short_links_short_code;

-- Referral tracking
DROP INDEX IF EXISTS idx_referral_tracking_referral_id;
DROP INDEX IF EXISTS idx_referral_tracking_tracking_type;

-- Reputation monitoring
DROP INDEX IF EXISTS idx_reputation_monitoring_platform;
DROP INDEX IF EXISTS idx_reputation_monitoring_sentiment;

-- Rewards
DROP INDEX IF EXISTS idx_rewards_ledger_transaction_type;
DROP INDEX IF EXISTS idx_rewards_redemptions_redemption_type;

-- Shopping cart
DROP INDEX IF EXISTS idx_shopping_cart_items_created_at;

-- Social media
DROP INDEX IF EXISTS idx_social_media_posts_platform;
DROP INDEX IF EXISTS idx_social_media_posts_post_type;
DROP INDEX IF EXISTS idx_social_media_posts_status;

-- Sponsorship
DROP INDEX IF EXISTS idx_sponsorship_deals_deal_type;
DROP INDEX IF EXISTS idx_sponsorship_deals_status;

-- Final cleanup
DROP INDEX IF EXISTS idx_video_analytics_merchant_id;
DROP INDEX IF EXISTS idx_webhook_events_created_at;
DROP INDEX IF EXISTS idx_webhook_events_event_type;
DROP INDEX IF EXISTS idx_webhook_events_status;