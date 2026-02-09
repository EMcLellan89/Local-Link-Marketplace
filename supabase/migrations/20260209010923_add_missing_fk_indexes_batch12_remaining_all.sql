/*
  # Add Missing Foreign Key Indexes - Batch 12 (Final)
  
  1. Tables Covered
    - Academy tables (academy_lesson_assets, academy_progress)
    - Accounting tables (accounting_bills, accounting_chart_of_accounts, accounting_employee_payroll, accounting_employees, accounting_inventory_transactions, accounting_invoices, accounting_journal_entries, accounting_journal_entry_lines)
    - AI tables (ai_bot_subscriptions, ai_package_items)
    - Marketing tables (marketing_campaigns, marketing_email_campaigns)
    - Milestone tables (milestone_badge_audit_log)
    - Product tables (product_asset_access, product_categories, product_course_map, products)
    - Profit network tables (profit_network_deductions)
    - Prompt tables (prompt_runs, prompts)
    - Recurring commission tables
    - Redemptions table
    - Reputation tables (reputation_responses, reputation_reviews)
    - Reward redemptions table
    - Rule suggestions table
    - Sales events table
    - Service bookings table
    - Social UGC tables
    - Story tables (story_audit_logs, story_jobs)
    - Subscription CRM mapping table
    - Swipe file favorites table
    - Territories table
    - Ticket messages table
    - Unified tables (unified_customers, unified_sales)
    - Upsell purchases table
    - Website orders table
    - White label licenses table
    - Winback tables (winback_conversions, winback_outreach)
    
  2. Performance Impact
    - Completes the foreign key index coverage
    - Ensures all foreign key constraints have covering indexes
    - Critical for comprehensive query performance optimization
    
  3. Security
    - No security changes, only performance optimization
*/

-- Academy tables
CREATE INDEX IF NOT EXISTS idx_academy_lesson_assets_lesson_id ON academy_lesson_assets(lesson_id);
CREATE INDEX IF NOT EXISTS idx_academy_progress_lesson_id ON academy_progress(lesson_id);

-- Accounting tables
CREATE INDEX IF NOT EXISTS idx_accounting_bills_journal_entry_id ON accounting_bills(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_chart_of_accounts_parent_account_id ON accounting_chart_of_accounts(parent_account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_employee_payroll_employee_id ON accounting_employee_payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_accounting_employees_team_member_id ON accounting_employees(team_member_id);
CREATE INDEX IF NOT EXISTS idx_accounting_inventory_transactions_inventory_id ON accounting_inventory_transactions(inventory_id);
CREATE INDEX IF NOT EXISTS idx_accounting_invoices_journal_entry_id ON accounting_invoices(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entries_fiscal_period_id ON accounting_journal_entries(fiscal_period_id);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entry_lines_account_id ON accounting_journal_entry_lines(account_id);
CREATE INDEX IF NOT EXISTS idx_accounting_journal_entry_lines_journal_entry_id ON accounting_journal_entry_lines(journal_entry_id);

-- AI tables
CREATE INDEX IF NOT EXISTS idx_ai_bot_subscriptions_bot_product_id ON ai_bot_subscriptions(bot_product_id);
CREATE INDEX IF NOT EXISTS idx_ai_package_items_bot_addon_id ON ai_package_items(bot_addon_id);

-- Marketing tables
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_segment_id ON marketing_campaigns(segment_id);
CREATE INDEX IF NOT EXISTS idx_marketing_email_campaigns_business_unit_id ON marketing_email_campaigns(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_marketing_email_campaigns_created_by ON marketing_email_campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_marketing_email_campaigns_segment_id ON marketing_email_campaigns(segment_id);

-- Milestone tables
CREATE INDEX IF NOT EXISTS idx_milestone_badge_audit_log_badge_id ON milestone_badge_audit_log(badge_id);

-- Product tables
CREATE INDEX IF NOT EXISTS idx_product_asset_access_asset_id ON product_asset_access(asset_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_parent_category_id ON product_categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_product_course_map_course_slug ON product_course_map(course_slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Profit network tables
CREATE INDEX IF NOT EXISTS idx_profit_network_deductions_sale_id ON profit_network_deductions(sale_id);

-- Prompt tables
CREATE INDEX IF NOT EXISTS idx_prompt_runs_prompt_id ON prompt_runs(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompts_category_id ON prompts(category_id);

-- Recurring commission tables
CREATE INDEX IF NOT EXISTS idx_recurring_commission_schedule_order_id ON recurring_commission_schedule(order_id);

-- Redemptions table
CREATE INDEX IF NOT EXISTS idx_redemptions_purchase_id ON redemptions(purchase_id);

-- Reputation tables
CREATE INDEX IF NOT EXISTS idx_reputation_responses_posted_by ON reputation_responses(posted_by);
CREATE INDEX IF NOT EXISTS idx_reputation_reviews_platform_id ON reputation_reviews(platform_id);

-- Reward redemptions table
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_merchant_org_id ON reward_redemptions(merchant_org_id);

-- Rule suggestions table
CREATE INDEX IF NOT EXISTS idx_rule_suggestions_suggested_coa_id ON rule_suggestions(suggested_coa_id);

-- Sales events table
CREATE INDEX IF NOT EXISTS idx_sales_events_attributed_partner_id ON sales_events(attributed_partner_id);

-- Service bookings table
CREATE INDEX IF NOT EXISTS idx_service_bookings_service_id ON service_bookings(service_id);

-- Social UGC tables
CREATE INDEX IF NOT EXISTS idx_social_ugc_subscriptions_package_id ON social_ugc_subscriptions(package_id);

-- Story tables
CREATE INDEX IF NOT EXISTS idx_story_audit_logs_profile_id ON story_audit_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_story_jobs_profile_id ON story_jobs(profile_id);

-- Subscription CRM mapping table
CREATE INDEX IF NOT EXISTS idx_subscription_crm_mapping_crm_tier_id ON subscription_crm_mapping(crm_tier_id);

-- Swipe file favorites table
CREATE INDEX IF NOT EXISTS idx_swipe_file_favorites_template_id ON swipe_file_favorites(template_id);

-- Territories table
CREATE INDEX IF NOT EXISTS idx_territories_assigned_partner_id ON territories(assigned_partner_id);
CREATE INDEX IF NOT EXISTS idx_territories_parent_territory_id ON territories(parent_territory_id);

-- Ticket messages table
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);

-- Unified tables
CREATE INDEX IF NOT EXISTS idx_unified_customers_primary_business_unit_id ON unified_customers(primary_business_unit_id);
CREATE INDEX IF NOT EXISTS idx_unified_sales_business_unit_id ON unified_sales(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_unified_sales_invoice_id ON unified_sales(invoice_id);

-- Upsell purchases table
CREATE INDEX IF NOT EXISTS idx_upsell_purchases_upsell_offer_id ON upsell_purchases(upsell_offer_id);

-- Website orders table
CREATE INDEX IF NOT EXISTS idx_website_orders_template_id ON website_orders(template_id);

-- White label licenses table
CREATE INDEX IF NOT EXISTS idx_white_label_licenses_vertical_product_id ON white_label_licenses(vertical_product_id);

-- Winback tables
CREATE INDEX IF NOT EXISTS idx_winback_conversions_outreach_id ON winback_conversions(outreach_id);
CREATE INDEX IF NOT EXISTS idx_winback_outreach_trigger_id ON winback_outreach(trigger_id);
