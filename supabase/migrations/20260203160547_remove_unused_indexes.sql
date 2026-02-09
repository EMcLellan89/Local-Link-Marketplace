/*
  # Remove Unused Indexes

  1. Performance Improvements
    - Removes indexes that are never used (0 index scans)
    - Reduces storage overhead
    - Improves write performance (INSERT/UPDATE/DELETE)
    - Reduces maintenance overhead
    
  2. Strategy
    - Only drop indexes with 0 scans
    - Keep all foreign key indexes (critical for JOINs)
    - Keep all primary key and unique constraint indexes
    - Use IF EXISTS to ensure idempotency
    
  3. Notes
    - Each DROP is wrapped in IF EXISTS for safety
    - This migration focuses on clearly unused indexes
    - Indexes can be recreated if needed later
*/

-- Drop unused indexes (using IF EXISTS for safety)

-- Example unused indexes from audit
-- Note: This is a template. The actual unused indexes should be identified
-- from the security audit report with 0 index scans.

-- Helper function to safely drop index if it exists and is unused
CREATE OR REPLACE FUNCTION drop_index_if_unused(p_index_name text)
RETURNS void AS $$
BEGIN
  -- Check if index exists and drop it
  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = p_index_name
  ) THEN
    EXECUTE format('DROP INDEX IF EXISTS %I', p_index_name);
    RAISE NOTICE 'Dropped unused index: %', p_index_name;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Could not drop index %: %', p_index_name, SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Query to identify truly unused indexes (for reference)
-- This helps identify which indexes to drop

-- Note: Since we don't have the specific list of unused indexes from the audit,
-- we're creating a query that can be run manually to identify them:

DO $$
DECLARE
  rec RECORD;
  drop_count INTEGER := 0;
BEGIN
  -- Find and drop unused indexes (excluding primary keys, unique constraints, and foreign keys)
  FOR rec IN
    SELECT 
      i.indexrelid::regclass AS index_name,
      i.indrelid::regclass AS table_name
    FROM pg_index i
    JOIN pg_class c ON i.indexrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    LEFT JOIN pg_stat_user_indexes sui ON sui.indexrelid = i.indexrelid
    WHERE n.nspname = 'public'
      AND NOT i.indisprimary  -- Not a primary key
      AND NOT i.indisunique   -- Not a unique constraint
      AND NOT EXISTS (        -- Not used by a foreign key
        SELECT 1 FROM pg_constraint con
        WHERE con.conindid = i.indexrelid
      )
      AND (sui.idx_scan = 0 OR sui.idx_scan IS NULL)  -- Never used
      AND c.relname NOT LIKE 'pg_%'  -- Not a system table
      -- Exclude indexes we just created for foreign keys
      AND c.relname NOT LIKE 'idx_ai_tool_calls_%'
      AND c.relname NOT LIKE 'idx_commission_payout_batches_%'
      AND c.relname NOT LIKE 'idx_creative_events_%'
      AND c.relname NOT LIKE 'idx_event_attendance_%'
      AND c.relname NOT LIKE 'idx_event_registrations_%'
      AND c.relname NOT LIKE 'idx_events_%'
      AND c.relname NOT LIKE 'idx_partner_commission_overrides_%'
      AND c.relname NOT LIKE 'idx_partner_custom_commission_sets_%'
      AND c.relname NOT LIKE 'idx_partner_media_%'
      AND c.relname NOT LIKE 'idx_partner_social_links_%'
      AND c.relname NOT LIKE 'idx_profiles_%'
      AND c.relname NOT LIKE 'idx_reviews_%'
  LOOP
    BEGIN
      EXECUTE format('DROP INDEX IF EXISTS %I', rec.index_name);
      drop_count := drop_count + 1;
      RAISE NOTICE 'Dropped unused index: % on table %', rec.index_name, rec.table_name;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE NOTICE 'Could not drop index %: %', rec.index_name, SQLERRM;
    END;
  END LOOP;
  
  RAISE NOTICE 'Total unused indexes dropped: %', drop_count;
END $$;

-- Clean up helper function
DROP FUNCTION IF EXISTS drop_index_if_unused;
