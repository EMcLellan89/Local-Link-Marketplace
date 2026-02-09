/*
  # Drop Final Batch of Unused Indexes

  1. Purpose
    - Remove remaining unused indexes
    - Final cleanup to improve write performance

  2. Impact
    - Reduces index maintenance overhead
    - Frees up storage space
    - Improves INSERT/UPDATE performance
*/

-- Drop unused text search indexes (if not actually used)
DROP INDEX IF EXISTS idx_deals_title_search;
DROP INDEX IF EXISTS idx_merchants_name_search;
DROP INDEX IF EXISTS idx_products_name_search;

-- Drop unused email/slug search indexes (covered by unique constraints)
DROP INDEX IF EXISTS idx_profiles_email;
DROP INDEX IF EXISTS idx_customers_email;
DROP INDEX IF EXISTS idx_partners_email;

-- Drop unused boolean indexes (low cardinality, not selective)
DROP INDEX IF EXISTS idx_deals_loyalty_eligible;
DROP INDEX IF EXISTS idx_deals_postcard_featured;
DROP INDEX IF EXISTS idx_merchants_is_active;
DROP INDEX IF EXISTS idx_partners_is_active;

-- Drop unused JSONB indexes (if not queried)
DROP INDEX IF EXISTS idx_accounting_transactions_metadata;
DROP INDEX IF EXISTS idx_accounting_transactions_attachments;

-- Drop unused updated_at indexes (RLS doesn't typically filter on these)
DROP INDEX IF EXISTS idx_profiles_updated_at;
DROP INDEX IF EXISTS idx_crm_contacts_updated_at;
DROP INDEX IF EXISTS idx_crm_deals_updated_at;

-- Drop redundant stripe/payment indexes
DROP INDEX IF EXISTS idx_purchases_stripe_payment_id;
DROP INDEX IF EXISTS idx_orders_stripe_payment_intent;
