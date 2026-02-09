/*
  # Consolidate Duplicate Policies - Batch 3: Budget Buster Users

  1. Changes
    - Consolidate duplicate SELECT policies on budget_buster_users
    - Consolidate duplicate UPDATE policies on budget_buster_users
    
  2. Rationale
    - Two SELECT policies with identical logic (profile_id check)
    - Two UPDATE policies with identical logic
    - Keep the more comprehensive policy in each case
*/

-- budget_buster_users: Remove duplicate SELECT policy
DROP POLICY IF EXISTS "Users can view own budget data" ON budget_buster_users;

-- budget_buster_users: Remove duplicate UPDATE policy (keep the one with with_check)
DROP POLICY IF EXISTS "Users can update own account" ON budget_buster_users;
