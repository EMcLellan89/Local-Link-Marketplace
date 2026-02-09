/*
  # Add Missing Foreign Key Indexes - Batch 8 Part 2
  
  1. Tables Covered
    - Partner tables (second half: partner_crm_*, partner_customer_links, partner_deal_*, partner_dfy_tracking_links, partner_earnings_simulator, partner_ledger, partner_milestone_*, partner_notifications, partner_onboarding_*, partner_outreach_logs, partner_overrides, partner_playbook_*, partner_profit_shares, partner_quarterly_taxes, partner_referral_*, partner_relationships, partner_sales_dashboard, partner_service_qualifications, partner_settings, partner_special_overrides, partner_streak_*, partner_subscriptions, partner_tax_*, partner_team_members, partner_tracking_links, partner_uplines, partner_warning_logs, partner_weekly_deductions, partners)
    
  2. Performance Impact
    - Adds indexes on foreign key columns to prevent N+1 queries
    - Improves JOIN performance for partner CRM, tracking, and commission calculations
    - Critical for partner relationship management and earnings tracking
    
  3. Security
    - No security changes, only performance optimization
*/

-- Partner CRM tables
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

-- Partner customer and deal links
CREATE INDEX IF NOT EXISTS idx_partner_customer_links_customer_account_id ON partner_customer_links(customer_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_customer_links_partner_id ON partner_customer_links(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_deal_links_bundle_id ON partner_deal_links(bundle_id);
CREATE INDEX IF NOT EXISTS idx_partner_deal_links_deal_id ON partner_deal_links(deal_id);
CREATE INDEX IF NOT EXISTS idx_partner_deal_links_partner_id ON partner_deal_links(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_deal_sync_log_partner_deal_id ON partner_deal_sync_log(partner_deal_id);

-- Partner tracking and earnings
CREATE INDEX IF NOT EXISTS idx_partner_dfy_tracking_links_product_id ON partner_dfy_tracking_links(product_id);
CREATE INDEX IF NOT EXISTS idx_partner_earnings_simulator_partner_id ON partner_earnings_simulator(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_earnings_simulator_plan_code ON partner_earnings_simulator(plan_code);
CREATE INDEX IF NOT EXISTS idx_partner_ledger_campaign_id ON partner_ledger(campaign_id);
CREATE INDEX IF NOT EXISTS idx_partner_ledger_partner_id ON partner_ledger(partner_id);

-- Partner milestones and notifications
CREATE INDEX IF NOT EXISTS idx_partner_milestone_badges_badge_id ON partner_milestone_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_partner_milestone_certs_cert_id ON partner_milestone_certs(cert_id);
CREATE INDEX IF NOT EXISTS idx_partner_notifications_partner_id ON partner_notifications(partner_id);

-- Partner onboarding
CREATE INDEX IF NOT EXISTS idx_partner_onboarding_progress_step_key ON partner_onboarding_progress(step_key);
CREATE INDEX IF NOT EXISTS idx_partner_outreach_logs_partner_id ON partner_outreach_logs(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_overrides_partner_id ON partner_overrides(partner_id);

-- Partner playbooks
CREATE INDEX IF NOT EXISTS idx_partner_playbook_completions_playbook_id ON partner_playbook_completions(playbook_id);
CREATE INDEX IF NOT EXISTS idx_partner_playbook_completions_user_id ON partner_playbook_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_playbook_lessons_module_id ON partner_playbook_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_partner_playbook_modules_playbook_id ON partner_playbook_modules(playbook_id);
CREATE INDEX IF NOT EXISTS idx_partner_playbook_progress_lesson_id ON partner_playbook_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_partner_playbook_progress_user_id ON partner_playbook_progress(user_id);

-- Partner profit shares and taxes
CREATE INDEX IF NOT EXISTS idx_partner_profit_shares_partner_id ON partner_profit_shares(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_quarterly_taxes_bank_account_id ON partner_quarterly_taxes(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_quarterly_taxes_partner_id ON partner_quarterly_taxes(partner_id);

-- Partner referrals and relationships
CREATE INDEX IF NOT EXISTS idx_partner_referral_links_partner_id ON partner_referral_links(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_referrals_merchant_id ON partner_referrals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_partner_referrals_partner_id ON partner_referrals(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_relationships_merchant_org_id ON partner_relationships(merchant_org_id);
CREATE INDEX IF NOT EXISTS idx_partner_relationships_partner_org_id ON partner_relationships(partner_org_id);

-- Partner sales and service qualifications
CREATE INDEX IF NOT EXISTS idx_partner_sales_dashboard_partner_id ON partner_sales_dashboard(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_service_qualifications_service_id ON partner_service_qualifications(service_id);

-- Partner settings and overrides
CREATE INDEX IF NOT EXISTS idx_partner_settings_partner_id ON partner_settings(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_special_overrides_approved_by ON partner_special_overrides(approved_by);
CREATE INDEX IF NOT EXISTS idx_partner_special_overrides_partner_id ON partner_special_overrides(partner_id);

-- Partner streaks
CREATE INDEX IF NOT EXISTS idx_partner_streak_freezes_partner_id ON partner_streak_freezes(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_streaks_partner_id ON partner_streaks(partner_id);

-- Partner subscriptions and taxes
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_partner_id ON partner_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_tier_id ON partner_subscriptions(tier_id);
CREATE INDEX IF NOT EXISTS idx_partner_tax_payments_bank_account_id ON partner_tax_payments(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_tax_payments_partner_id ON partner_tax_payments(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_tax_settings_autopay_bank_account_id ON partner_tax_settings(autopay_bank_account_id);
CREATE INDEX IF NOT EXISTS idx_partner_tax_settings_partner_id ON partner_tax_settings(partner_id);

-- Partner team and tracking
CREATE INDEX IF NOT EXISTS idx_partner_team_members_partner_id ON partner_team_members(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_tracking_links_partner_id ON partner_tracking_links(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_tracking_links_product_slug ON partner_tracking_links(product_slug);

-- Partner uplines and warnings
CREATE INDEX IF NOT EXISTS idx_partner_uplines_partner_id ON partner_uplines(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_uplines_upline_partner_id ON partner_uplines(upline_partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_warning_logs_partner_id ON partner_warning_logs(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_weekly_deductions_partner_id ON partner_weekly_deductions(partner_id);

-- Partners main table
CREATE INDEX IF NOT EXISTS idx_partners_tier_key ON partners(tier_key);
