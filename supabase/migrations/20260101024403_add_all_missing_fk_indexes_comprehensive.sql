/*
  # Add All Missing Foreign Key Indexes - Comprehensive
  
  1. Identifies all foreign keys without covering indexes
  2. Creates indexes for all of them automatically
  3. Critical for JOIN performance across the entire database
*/

-- Create indexes for all foreign key columns that don't have them
DO $$
DECLARE
  fk_record RECORD;
  index_name TEXT;
  index_exists BOOLEAN;
BEGIN
  FOR fk_record IN
    SELECT DISTINCT
      tc.table_name,
      kcu.column_name,
      tc.constraint_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
    ORDER BY tc.table_name, kcu.column_name
  LOOP
    -- Generate index name
    index_name := 'idx_' || fk_record.table_name || '_' || fk_record.column_name;
    
    -- Check if index already exists on this column
    SELECT EXISTS (
      SELECT 1
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND tablename = fk_record.table_name
        AND indexdef LIKE '%' || fk_record.column_name || '%'
    ) INTO index_exists;
    
    -- Create index if it doesn't exist
    IF NOT index_exists THEN
      EXECUTE format(
        'CREATE INDEX IF NOT EXISTS %I ON %I(%I)',
        index_name,
        fk_record.table_name,
        fk_record.column_name
      );
      RAISE NOTICE 'Created index: % on %.%', index_name, fk_record.table_name, fk_record.column_name;
    END IF;
  END LOOP;
END $$;
