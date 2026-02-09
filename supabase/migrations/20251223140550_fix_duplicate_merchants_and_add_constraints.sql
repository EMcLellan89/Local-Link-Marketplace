/*
  # Fix Duplicate Merchant Records and Add Constraints
  
  1. Data Cleanup
    - Remove duplicate merchant records keeping only the oldest one per user
    - Remove duplicate customer records keeping only the oldest one per user
  
  2. Schema Changes
    - Add unique constraint on merchants.user_id
    - Add unique constraint on customers.user_id
    - These prevent multiple merchant/customer records per user
  
  3. Impact
    - Fixes "multiple rows returned" errors
    - Ensures data integrity going forward
    - Each user can have only one merchant profile and one customer profile
*/

-- Step 1: Remove duplicate merchant records, keeping only the oldest one per user_id
DELETE FROM merchants
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id
  FROM merchants
  ORDER BY user_id, created_at ASC
);

-- Step 2: Remove duplicate customer records, keeping only the oldest one per user_id
DELETE FROM customers
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id
  FROM customers
  ORDER BY user_id, created_at ASC
);

-- Step 3: Add unique constraint to merchants table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'merchants_user_id_key'
  ) THEN
    ALTER TABLE merchants ADD CONSTRAINT merchants_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Step 4: Add unique constraint to customers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'customers_user_id_key'
  ) THEN
    ALTER TABLE customers ADD CONSTRAINT customers_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Step 5: Verify no duplicates remain
DO $$
DECLARE
  duplicate_merchants INTEGER;
  duplicate_customers INTEGER;
BEGIN
  SELECT COUNT(*) INTO duplicate_merchants
  FROM (
    SELECT user_id, COUNT(*) as count
    FROM merchants
    GROUP BY user_id
    HAVING COUNT(*) > 1
  ) duplicates;

  SELECT COUNT(*) INTO duplicate_customers
  FROM (
    SELECT user_id, COUNT(*) as count
    FROM customers
    GROUP BY user_id
    HAVING COUNT(*) > 1
  ) duplicates;

  IF duplicate_merchants > 0 THEN
    RAISE EXCEPTION 'Still have % duplicate merchant records', duplicate_merchants;
  END IF;

  IF duplicate_customers > 0 THEN
    RAISE EXCEPTION 'Still have % duplicate customer records', duplicate_customers;
  END IF;
END $$;
