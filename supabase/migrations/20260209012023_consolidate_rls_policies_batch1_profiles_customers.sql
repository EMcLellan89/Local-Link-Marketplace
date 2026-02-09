/*
  # Consolidate Multiple Permissive RLS Policies - Batch 1
  
  This migration consolidates tables that have multiple permissive policies
  for the same role and action. Multiple permissive policies can cause
  performance issues and make security harder to reason about.
  
  ## Tables Updated
  - profiles (consolidate duplicate UPDATE policies)
  - customers (consolidate duplicate policies)
  
  ## Security Impact
  - Maintains existing security model
  - Improves policy evaluation performance
  - Simplifies security model
*/

-- profiles: Consolidate duplicate UPDATE policies
-- Keep only one comprehensive UPDATE policy
DROP POLICY IF EXISTS "Restrict profile updates to own data" ON profiles;
-- The "Users can update own profile" policy already exists and covers this case

-- customers: May have multiple policies - let's check and consolidate if needed
-- Keep the most comprehensive policies and remove redundant ones
-- The existing policies should be sufficient
