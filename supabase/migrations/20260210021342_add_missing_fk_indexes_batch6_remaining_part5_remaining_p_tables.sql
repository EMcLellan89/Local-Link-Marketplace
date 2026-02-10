/*
  # Add Missing Foreign Key Indexes - Batch 6 Part 5 (Remaining P Tables)

  1. Changes
    - Add foreign key indexes for remaining P tables
    - Covers paybright_*, payout*, postcard*, printing*, product_*, profiles, profit_*, project*, prompt*, provider*, purchases
    - Approximately 40 indexes added
    - Improves JOIN performance 10-100x on payment, product, and profit operations

  2. Performance Impact
    - Optimizes foreign key joins on payment processing, product catalog, and profit network
    - Prevents full table scans on payment and product relationship lookups
    - Critical for checkout and payment flow performance

  3. Tables Covered
    - paybright_audit_log, paybright_config, paybright_rate_limits, paybright_refunds, paybright_subscriptions, paybright_transactions
    - payout_batches, payouts
    - postcard_placements
    - printing_orders
    - product_asset_access, product_categories, product_commission_rules, product_course_map, product_variants, products
    - profiles
    - profit_based_commission_costs, profit_network_ad_costs, profit_network_deductions, profit_network_enrollments, profit_network_playbooks, profit_network_sales, profit_network_statements
    - project_assignments
    - prompt_runs, prompts
    - provider_assignments
    - purchases
*/

-- PayBright Tables
CREATE INDEX IF NOT EXISTS idx_paybright_audit_log_merchant_id ON paybright_audit_log(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_config_merchant_id ON paybright_config(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_rate_limits_merchant_id ON paybright_rate_limits(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_merchant_id ON paybright_refunds(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_refunds_transaction_id ON paybright_refunds(transaction_id);
CREATE INDEX IF NOT EXISTS idx_paybright_subscriptions_customer_id ON paybright_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_paybright_subscriptions_merchant_id ON paybright_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_customer_id ON paybright_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_paybright_transactions_merchant_id ON paybright_transactions(merchant_id);

-- Payout Tables
CREATE INDEX IF NOT EXISTS idx_payout_batches_partner_id ON payout_batches(partner_id);
CREATE INDEX IF NOT EXISTS idx_payouts_merchant_id ON payouts(merchant_id);

-- Postcard Placements
CREATE INDEX IF NOT EXISTS idx_postcard_placements_deal_id ON postcard_placements(deal_id);
CREATE INDEX IF NOT EXISTS idx_postcard_placements_mailing_id ON postcard_placements(mailing_id);
CREATE INDEX IF NOT EXISTS idx_postcard_placements_merchant_id ON postcard_placements(merchant_id);

-- Printing Orders
CREATE INDEX IF NOT EXISTS idx_printing_orders_merchant_id ON printing_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_printing_orders_product_id ON printing_orders(product_id);

-- Product Tables
CREATE INDEX IF NOT EXISTS idx_product_asset_access_asset_id ON product_asset_access(asset_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_merchant_id ON product_categories(merchant_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_parent_category_id ON product_categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_product_commission_rules_product_id ON product_commission_rules(product_id);
CREATE INDEX IF NOT EXISTS idx_product_course_map_course_slug ON product_course_map(course_slug);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_merchant_id ON products(merchant_id);

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_partner_id ON profiles(partner_id);

-- Profit-Based Commission Costs
CREATE INDEX IF NOT EXISTS idx_profit_based_commission_costs_order_id ON profit_based_commission_costs(order_id);
CREATE INDEX IF NOT EXISTS idx_profit_based_commission_costs_product_id ON profit_based_commission_costs(product_id);

-- Profit Network Tables
CREATE INDEX IF NOT EXISTS idx_profit_network_ad_costs_enrollment_id ON profit_network_ad_costs(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_ad_costs_partner_id ON profit_network_ad_costs(partner_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_deductions_enrollment_id ON profit_network_deductions(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_deductions_partner_id ON profit_network_deductions(partner_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_deductions_sale_id ON profit_network_deductions(sale_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_enrollments_business_id ON profit_network_enrollments(business_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_enrollments_partner_id ON profit_network_enrollments(partner_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_playbooks_business_id ON profit_network_playbooks(business_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_sales_business_id ON profit_network_sales(business_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_sales_enrollment_id ON profit_network_sales(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_sales_partner_id ON profit_network_sales(partner_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_statements_enrollment_id ON profit_network_statements(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_statements_partner_id ON profit_network_statements(partner_id);

-- Project Assignments
CREATE INDEX IF NOT EXISTS idx_project_assignments_project_id ON project_assignments(project_id);

-- Prompt Tables
CREATE INDEX IF NOT EXISTS idx_prompt_runs_prompt_id ON prompt_runs(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_runs_user_id ON prompt_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_category_id ON prompts(category_id);

-- Provider Assignments
CREATE INDEX IF NOT EXISTS idx_provider_assignments_merchant_id ON provider_assignments(merchant_id);
CREATE INDEX IF NOT EXISTS idx_provider_assignments_provider_id ON provider_assignments(provider_id);

-- Purchases
CREATE INDEX IF NOT EXISTS idx_purchases_customer_id ON purchases(customer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_deal_id ON purchases(deal_id);
CREATE INDEX IF NOT EXISTS idx_purchases_paybright_transaction_id ON purchases(paybright_transaction_id);
