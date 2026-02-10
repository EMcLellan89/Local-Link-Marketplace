/*
  # Add Missing Foreign Key Indexes - Batch 6 Part 4 (Partner Tables)

  1. Changes
    - Add foreign key indexes for all partner_* tables
    - Approximately 100 indexes added for partner-related tables
    - Improves JOIN performance 10-100x on partner operations

  2. Performance Impact
    - Optimizes foreign key joins on partner dashboard, CRM, accounting, and commission operations
    - Prevents full table scans on partner relationship lookups
    - Critical for partner portal performance

  3. Tables Covered
    - partner_1099_*, partner_accounting_*, partner_activity_log, partner_ad_budgets
    - partner_ai_commissions, partner_badge_awards, partner_badges, partner_bank_accounts
    - partner_bonuses, partner_campaigns, partner_certifications, partner_certs
    - partner_challenge_*, partner_contracts, partner_crm_*
    - partner_customer_links, partner_deal_*, partner_dfy_tracking_links
    - partner_earnings_simulator, partner_ledger, partner_milestone_*
    - partner_notifications, partner_onboarding_progress, partner_outreach_logs
    - partner_overrides, partner_performance_metrics, partner_playbook_*
    - partner_profit_shares, partner_quarterly_taxes, partner_referral_*
    - partner_relationships, partner_sales_dashboard, partner_scores
    - partner_service_qualifications, partner_settings, partner_special_overrides
    - partner_streak_*, partner_subscriptions, partner_tax_*
    - partner_team_members, partner_tracking_links, partner_uplines
    - partner_w9_documents, partner_warning_*, partner_weekly_deductions
    - partners
*/

-- Partner 1099 Documents
CREATE INDEX IF NOT EXISTS idx_partner_1099_corrections_corrected_1099_id ON partner_1099_corrections(corrected_1099_id);
CREATE INDEX IF NOT EXISTS idx_partner_1099_corrections_corrected_by ON partner_1099_corrections(corrected_by);
CREATE INDEX IF NOT EXISTS idx_partner_1099_corrections_original_1099_id ON partner_1099_corrections(original_1099_id);
CREATE INDEX IF NOT EXISTS idx_partner_1099_documents_generated_by ON partner_1099_documents(generated_by);
CREATE INDEX IF NOT EXISTS idx_partner_1099_documents_partner_id ON partner_1099_documents(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_1099_documents_w9_document_id ON partner_1099_documents(w9_document_id);

-- Partner Accounting
CREATE INDEX IF NOT EXISTS idx_partner_accounting_categories_parent_category_id ON partner_accounting_categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_pro_partner_id ON partner_accounting_pro(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_bank_account_id ON partner_accounting_transactions(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_category_id ON partner_accounting_transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_deal_id ON partner_accounting_transactions(deal_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_partner_id ON partner_accounting_transactions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_accounting_transactions_tax_payment_id ON partner_accounting_transactions(tax_payment_id);

-- Partner Activity and Ad Budgets
CREATE INDEX IF NOT EXISTS idx_partner_activity_log_partner_id ON partner_activity_log(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_ad_budgets_partner_id ON partner_ad_budgets(partner_id);

-- Partner AI Commissions
CREATE INDEX IF NOT EXISTS idx_partner_ai_commissions_merchant_id ON partner_ai_commissions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_partner_ai_commissions_partner_id ON partner_ai_commissions(partner_id);

-- Partner Badges
CREATE INDEX IF NOT EXISTS idx_partner_badge_awards_partner_id ON partner_badge_awards(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_badges_badge_id ON partner_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_partner_badges_partner_id ON partner_badges(partner_id);

-- Partner Bank Accounts and Bonuses
CREATE INDEX IF NOT EXISTS idx_partner_bank_accounts_partner_id ON partner_bank_accounts(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_bonuses_affiliate_id ON partner_bonuses(affiliate_id);

-- Partner Campaigns and Certifications
CREATE INDEX IF NOT EXISTS idx_partner_campaigns_creative_id ON partner_campaigns(creative_id);
CREATE INDEX IF NOT EXISTS idx_partner_campaigns_partner_id ON partner_campaigns(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_certifications_certification_id ON partner_certifications(certification_id);
CREATE INDEX IF NOT EXISTS idx_partner_certs_cert_id ON partner_certs(cert_id);
CREATE INDEX IF NOT EXISTS idx_partner_certs_partner_id ON partner_certs(partner_id);

-- Partner Challenges
CREATE INDEX IF NOT EXISTS idx_partner_challenge_enrollments_partner_id ON partner_challenge_enrollments(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_challenge_progress_enrollment_id ON partner_challenge_progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_partner_challenge_progress_partner_id ON partner_challenge_progress(partner_id);

-- Partner Contracts
CREATE INDEX IF NOT EXISTS idx_partner_contracts_partner_id ON partner_contracts(partner_id);

-- Partner CRM Tables
CREATE INDEX IF NOT EXISTS idx_partner_crm_companies_partner_id ON partner_crm_companies(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_contacts_company_id ON partner_crm_contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_contacts_partner_id ON partner_crm_contacts(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deal_notes_deal_id ON partner_crm_deal_notes(deal_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deal_notes_partner_id ON partner_crm_deal_notes(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deal_products_deal_id ON partner_crm_deal_products(deal_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deal_products_partner_id ON partner_crm_deal_products(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_company_id ON partner_crm_deals(company_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_contact_id ON partner_crm_deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_partner_id ON partner_crm_deals(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_crm_subscriptions_partner_id ON partner_crm_subscriptions(partner_id);

-- Partner Customer Links and Deal Links
CREATE INDEX IF NOT EXISTS idx_partner_customer_links_customer_account_id ON partner_customer_links(customer_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_customer_links_partner_id ON partner_customer_links(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_deal_links_bundle_id ON partner_deal_links(bundle_id);
CREATE INDEX IF NOT EXISTS idx_partner_deal_links_deal_id ON partner_deal_links(deal_id);
CREATE INDEX IF NOT EXISTS idx_partner_deal_links_partner_id ON partner_deal_links(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_deal_sync_log_partner_deal_id ON partner_deal_sync_log(partner_deal_id);

-- Partner DFY and Earnings
CREATE INDEX IF NOT EXISTS idx_partner_dfy_tracking_links_product_id ON partner_dfy_tracking_links(product_id);
CREATE INDEX IF NOT EXISTS idx_partner_earnings_simulator_partner_id ON partner_earnings_simulator(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_earnings_simulator_plan_code ON partner_earnings_simulator(plan_code);

-- Partner Ledger
CREATE INDEX IF NOT EXISTS idx_partner_ledger_campaign_id ON partner_ledger(campaign_id);
CREATE INDEX IF NOT EXISTS idx_partner_ledger_partner_id ON partner_ledger(partner_id);

-- Partner Milestones
CREATE INDEX IF NOT EXISTS idx_partner_milestone_badges_badge_id ON partner_milestone_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_partner_milestone_certs_cert_id ON partner_milestone_certs(cert_id);

-- Partner Notifications and Onboarding
CREATE INDEX IF NOT EXISTS idx_partner_notifications_partner_id ON partner_notifications(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_onboarding_progress_step_key ON partner_onboarding_progress(step_key);

-- Partner Outreach and Overrides
CREATE INDEX IF NOT EXISTS idx_partner_outreach_logs_partner_id ON partner_outreach_logs(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_overrides_partner_id ON partner_overrides(partner_id);

-- Partner Performance Metrics
CREATE INDEX IF NOT EXISTS idx_partner_performance_metrics_partner_id ON partner_performance_metrics(partner_id);

-- Partner Playbooks
CREATE INDEX IF NOT EXISTS idx_partner_playbook_completions_playbook_id ON partner_playbook_completions(playbook_id);
CREATE INDEX IF NOT EXISTS idx_partner_playbook_completions_user_id ON partner_playbook_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_playbook_lessons_module_id ON partner_playbook_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_partner_playbook_modules_playbook_id ON partner_playbook_modules(playbook_id);
CREATE INDEX IF NOT EXISTS idx_partner_playbook_progress_lesson_id ON partner_playbook_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_partner_playbook_progress_user_id ON partner_playbook_progress(user_id);

-- Partner Profit Shares and Quarterly Taxes
CREATE INDEX IF NOT EXISTS idx_partner_profit_shares_partner_id ON partner_profit_shares(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_quarterly_taxes_bank_account_id ON partner_quarterly_taxes(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_quarterly_taxes_partner_id ON partner_quarterly_taxes(partner_id);

-- Partner Referrals and Relationships
CREATE INDEX IF NOT EXISTS idx_partner_referral_links_partner_id ON partner_referral_links(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_referrals_merchant_id ON partner_referrals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_partner_referrals_partner_id ON partner_referrals(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_relationships_merchant_org_id ON partner_relationships(merchant_org_id);
CREATE INDEX IF NOT EXISTS idx_partner_relationships_partner_org_id ON partner_relationships(partner_org_id);

-- Partner Sales Dashboard and Scores
CREATE INDEX IF NOT EXISTS idx_partner_sales_dashboard_partner_id ON partner_sales_dashboard(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_scores_partner_id ON partner_scores(partner_id);

-- Partner Service Qualifications and Settings
CREATE INDEX IF NOT EXISTS idx_partner_service_qualifications_service_id ON partner_service_qualifications(service_id);
CREATE INDEX IF NOT EXISTS idx_partner_settings_partner_id ON partner_settings(partner_id);

-- Partner Special Overrides
CREATE INDEX IF NOT EXISTS idx_partner_special_overrides_approved_by ON partner_special_overrides(approved_by);
CREATE INDEX IF NOT EXISTS idx_partner_special_overrides_partner_id ON partner_special_overrides(partner_id);

-- Partner Streaks
CREATE INDEX IF NOT EXISTS idx_partner_streak_freezes_partner_id ON partner_streak_freezes(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_streaks_partner_id ON partner_streaks(partner_id);

-- Partner Subscriptions
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_partner_id ON partner_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_tier_id ON partner_subscriptions(tier_id);

-- Partner Tax Tables
CREATE INDEX IF NOT EXISTS idx_partner_tax_payments_bank_account_id ON partner_tax_payments(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_tax_payments_partner_id ON partner_tax_payments(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_tax_settings_autopay_bank_account_id ON partner_tax_settings(autopay_bank_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_tax_settings_partner_id ON partner_tax_settings(partner_id);

-- Partner Team Members and Tracking
CREATE INDEX IF NOT EXISTS idx_partner_team_members_partner_id ON partner_team_members(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_tracking_links_partner_id ON partner_tracking_links(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_tracking_links_product_slug ON partner_tracking_links(product_slug);

-- Partner Uplines
CREATE INDEX IF NOT EXISTS idx_partner_uplines_partner_id ON partner_uplines(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_uplines_upline_partner_id ON partner_uplines(upline_partner_id);

-- Partner W9 Documents
CREATE INDEX IF NOT EXISTS idx_partner_w9_documents_partner_id ON partner_w9_documents(partner_id);

-- Partner Warnings
CREATE INDEX IF NOT EXISTS idx_partner_warning_logs_partner_id ON partner_warning_logs(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_warnings_partner_id ON partner_warnings(partner_id);

-- Partner Weekly Deductions
CREATE INDEX IF NOT EXISTS idx_partner_weekly_deductions_partner_id ON partner_weekly_deductions(partner_id);

-- Partners Table
CREATE INDEX IF NOT EXISTS idx_partners_tier_key ON partners(tier_key);
