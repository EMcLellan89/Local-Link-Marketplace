/*
  # Drop Unused Indexes - Part 10: Invoicing, AI, and UGC Systems
  
  1. Removes unused indexes from invoicing, AI, and UGC tables
  2. Tables affected:
     - invoices, invoice_items, invoice_payments, expenses
     - merchant_applications, merchant_application_equipment
     - prompts, partner_referrals, partner_ai_commissions
     - credit_ledger, prompt_runs, onboarding_progress
     - ugc_creators, ugc_orders, ugc_assets, ugc_payouts
*/

-- Drop unused indexes on invoices
DROP INDEX IF EXISTS idx_invoices_customer_id;
DROP INDEX IF EXISTS idx_invoices_invoice_date;

-- Drop unused indexes on invoice_items
DROP INDEX IF EXISTS idx_invoice_items_invoice_id;

-- Drop unused indexes on invoice_payments
DROP INDEX IF EXISTS idx_invoice_payments_invoice_id;
DROP INDEX IF EXISTS idx_invoice_payments_merchant_id;

-- Drop unused indexes on expenses
DROP INDEX IF EXISTS idx_expenses_merchant_id;
DROP INDEX IF EXISTS idx_expenses_expense_date;

-- Drop unused indexes on merchant_applications
DROP INDEX IF EXISTS idx_merchant_applications_email;
DROP INDEX IF EXISTS idx_merchant_applications_status;
DROP INDEX IF EXISTS idx_merchant_applications_application_number;
DROP INDEX IF EXISTS idx_merchant_applications_is_high_risk;
DROP INDEX IF EXISTS idx_merchant_applications_background_check;
DROP INDEX IF EXISTS idx_merchant_applications_three_d_secure;

-- Drop unused indexes on merchant_application_equipment
DROP INDEX IF EXISTS idx_merchant_application_equipment_application_id;

-- Drop unused indexes on prompts
DROP INDEX IF EXISTS idx_prompts_category_id;
DROP INDEX IF EXISTS idx_prompts_intent;

-- Drop unused indexes on partner_referrals
DROP INDEX IF EXISTS idx_partner_referrals_partner_id;
DROP INDEX IF EXISTS idx_partner_referrals_merchant_id;

-- Drop unused indexes on partner_ai_commissions
DROP INDEX IF EXISTS idx_partner_ai_commissions_partner_id;
DROP INDEX IF EXISTS idx_partner_ai_commissions_status;
DROP INDEX IF EXISTS idx_partner_ai_commissions_merchant_id;

-- Drop unused indexes on credit_ledger
DROP INDEX IF EXISTS idx_credit_ledger_user_id;

-- Drop unused indexes on prompt_runs
DROP INDEX IF EXISTS idx_prompt_runs_user_id;
DROP INDEX IF EXISTS idx_prompt_runs_prompt_id;

-- Drop unused indexes on onboarding_progress
DROP INDEX IF EXISTS idx_onboarding_progress_user_id;

-- Drop unused indexes on ugc_creators
DROP INDEX IF EXISTS idx_ugc_creators_status;
DROP INDEX IF EXISTS idx_ugc_creators_user_id;

-- Drop unused indexes on ugc_orders
DROP INDEX IF EXISTS idx_ugc_orders_creator;
DROP INDEX IF EXISTS idx_ugc_orders_status;
DROP INDEX IF EXISTS idx_ugc_orders_package_id;

-- Drop unused indexes on ugc_assets
DROP INDEX IF EXISTS idx_ugc_assets_order;

-- Drop unused indexes on ugc_payouts
DROP INDEX IF EXISTS idx_ugc_payouts_creator;
DROP INDEX IF EXISTS idx_ugc_payouts_order_id;
