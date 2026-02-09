/*
  # Drop Unused Indexes - Batch 14: Partner Playbook, Profit, and Referral Tables

  1. Changes
    - Drop unused indexes from partner_playbook_* tables
    - Drop unused indexes from partner_profit_* and partner_referral_* tables
    - Drop unused indexes from partner_sales and partner_service tables
    
  2. Rationale
    - These indexes have idx_scan = 0, never used by queries
    - Reduces index maintenance overhead
*/

-- Partner playbooks
DROP INDEX IF EXISTS idx_partner_playbook_completions_playbook_id;
DROP INDEX IF EXISTS idx_partner_playbook_completions_user_id;
DROP INDEX IF EXISTS idx_partner_playbook_modules_playbook_id;
DROP INDEX IF EXISTS idx_partner_playbook_progress_lesson_id;
DROP INDEX IF EXISTS idx_partner_playbook_progress_user_id;

-- Partner profit and quarterly
DROP INDEX IF EXISTS idx_partner_profit_shares_partner;
DROP INDEX IF EXISTS idx_partner_profit_shares_partner_id;
DROP INDEX IF EXISTS idx_partner_quarterly_taxes_bank_account_id;
DROP INDEX IF EXISTS idx_partner_quarterly_taxes_partner_id;

-- Partner referrals and relationships
DROP INDEX IF EXISTS idx_partner_referrals_merchant_id;
DROP INDEX IF EXISTS idx_partner_referrals_partner_id;
DROP INDEX IF EXISTS idx_partner_relationships_merchant_org_id;
DROP INDEX IF EXISTS idx_partner_relationships_partner_org_id;

-- Partner sales dashboard
DROP INDEX IF EXISTS idx_partner_dashboard_partner;
DROP INDEX IF EXISTS idx_partner_dashboard_week;
DROP INDEX IF EXISTS idx_partner_sales_dashboard_partner_id;

-- Partner service and settings
DROP INDEX IF EXISTS idx_partner_service_qualifications_service_id;
DROP INDEX IF EXISTS idx_partner_settings_partner_id;

-- Partner special overrides and streaks
DROP INDEX IF EXISTS idx_partner_special_overrides_approved_by;
DROP INDEX IF EXISTS idx_partner_streak_freezes_partner_id;
DROP INDEX IF EXISTS idx_partner_streaks_partner_id;

-- Partner subscriptions and tax
DROP INDEX IF EXISTS idx_partner_subscriptions_partner_id;
DROP INDEX IF EXISTS idx_partner_subscriptions_tier_id;
DROP INDEX IF EXISTS idx_partner_tax_payments_bank_account_id;
DROP INDEX IF EXISTS idx_partner_tax_payments_partner_id;
DROP INDEX IF EXISTS idx_partner_tax_settings_autopay_bank_account_id;

-- Partner team and tracking
DROP INDEX IF EXISTS idx_partner_team_members_partner_id;
DROP INDEX IF EXISTS idx_partner_team_members_user_id;
DROP INDEX IF EXISTS idx_partner_tracking_links_product_slug;

-- Partner uplines, warnings, and weekly
DROP INDEX IF EXISTS idx_partner_uplines_upline_partner_id;
DROP INDEX IF EXISTS idx_partner_warning_logs_partner_id;
DROP INDEX IF EXISTS idx_partner_weekly_deductions_partner;
DROP INDEX IF EXISTS idx_partner_weekly_deductions_partner_id;
DROP INDEX IF EXISTS idx_partner_weekly_deductions_week;

-- Partners main table
DROP INDEX IF EXISTS idx_partners_tier_key;
DROP INDEX IF EXISTS idx_partners_user_id;
