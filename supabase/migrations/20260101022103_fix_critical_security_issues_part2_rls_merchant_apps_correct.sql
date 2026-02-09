/*
  # Fix Critical Security Issues - Part 2: Optimize RLS Policies (Merchant Applications)
  
  1. Updates merchant application RLS policies to use (select auth.uid()) pattern
     for better performance at scale by evaluating auth.uid() once per query
*/

-- Drop and recreate merchant_applications policies
DROP POLICY IF EXISTS "Users can insert own applications" ON merchant_applications;
DROP POLICY IF EXISTS "Users can update own pending applications" ON merchant_applications;
DROP POLICY IF EXISTS "Users can view own applications" ON merchant_applications;

CREATE POLICY "Users can insert own applications" 
  ON merchant_applications FOR INSERT 
  TO authenticated 
  WITH CHECK (
    email = (
      SELECT users.email 
      FROM auth.users 
      WHERE users.id = (select auth.uid())
    )::text
  );

CREATE POLICY "Users can update own pending applications" 
  ON merchant_applications FOR UPDATE 
  TO authenticated 
  USING (
    email = (
      SELECT users.email 
      FROM auth.users 
      WHERE users.id = (select auth.uid())
    )::text 
    AND status = 'pending'
  )
  WITH CHECK (
    email = (
      SELECT users.email 
      FROM auth.users 
      WHERE users.id = (select auth.uid())
    )::text 
    AND status = 'pending'
  );

CREATE POLICY "Users can view own applications" 
  ON merchant_applications FOR SELECT 
  TO authenticated 
  USING (
    email = (
      SELECT users.email 
      FROM auth.users 
      WHERE users.id = (select auth.uid())
    )::text
  );

-- Drop and recreate merchant_application_equipment policies
DROP POLICY IF EXISTS "Users can insert own equipment selections" ON merchant_application_equipment;
DROP POLICY IF EXISTS "Users can view own equipment selections" ON merchant_application_equipment;

CREATE POLICY "Users can insert own equipment selections" 
  ON merchant_application_equipment FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchant_applications 
      WHERE merchant_applications.id = application_id 
      AND merchant_applications.email = (
        SELECT users.email 
        FROM auth.users 
        WHERE users.id = (select auth.uid())
      )::text
    )
  );

CREATE POLICY "Users can view own equipment selections" 
  ON merchant_application_equipment FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM merchant_applications 
      WHERE merchant_applications.id = application_id 
      AND merchant_applications.email = (
        SELECT users.email 
        FROM auth.users 
        WHERE users.id = (select auth.uid())
      )::text
    )
  );
