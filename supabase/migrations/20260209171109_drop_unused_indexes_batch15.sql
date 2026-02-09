/*
  # Drop Unused Indexes - Batch 15
*/

DROP INDEX IF EXISTS idx_story_assets_book_id;
DROP INDEX IF EXISTS idx_bot_runs_profile_id;
DROP INDEX IF EXISTS idx_story_jobs_book_id;
DROP INDEX IF EXISTS idx_story_jobs_profile_id;
DROP INDEX IF EXISTS idx_story_audit_logs_book_id;
DROP INDEX IF EXISTS idx_story_audit_logs_profile_id;
DROP INDEX IF EXISTS idx_creative_events_partner_id;
DROP INDEX IF EXISTS idx_creative_events_profile_id;
DROP INDEX IF EXISTS idx_creative_tests_partner_id;
DROP INDEX IF EXISTS idx_creative_tests_winner_creative_id;
DROP INDEX IF EXISTS idx_weekly_creative_winners_creative_id;
DROP INDEX IF EXISTS idx_partner_campaigns_creative_id;
DROP INDEX IF EXISTS idx_partner_campaigns_partner_id;
DROP INDEX IF EXISTS idx_partner_ledger_campaign_id;
DROP INDEX IF EXISTS idx_partner_ledger_partner_id;
DROP INDEX IF EXISTS idx_sales_events_attributed_partner_id;
DROP INDEX IF EXISTS idx_referral_attribution_attributed_partner_id;
DROP INDEX IF EXISTS idx_external_sales_events_partner_id;
DROP INDEX IF EXISTS idx_external_sale_commissions_partner_id;
DROP INDEX IF EXISTS idx_external_sale_commissions_external_sales_event_id;
