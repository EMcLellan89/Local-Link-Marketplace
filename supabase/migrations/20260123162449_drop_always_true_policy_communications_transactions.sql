/*
  # Drop Always-True RLS Policy

  This migration drops the RLS policy on communications_transactions that has an
  always-true WITH CHECK clause, which bypasses security.

  Issue:
  - Policy "System can insert transactions" has WITH CHECK = true
  - This allows any authenticated user to insert transactions without checks

  Fix:
  - Simply drop this insecure policy
  - The "Admins can insert communications transactions" policy already provides secure access
*/

-- Drop the policy with always-true WITH CHECK
DROP POLICY IF EXISTS "System can insert transactions" ON communications_transactions;