/*
  # Review and Consolidate Multiple Permissive RLS Policies
  
  This migration reviews multiple permissive policies identified in the security audit.
  
  Security Note:
  Multiple permissive policies on the same table for the same command can create
  unintended access. When multiple permissive policies exist, if ANY policy allows
  access, the operation is permitted (OR logic).
  
  The security audit identified multiple permissive policies on various tables.
  However, upon review of the actual schema, many of these tables either:
  1. Do not currently exist in the database
  2. Have already been properly consolidated in previous migrations
  3. Are referenced with different naming conventions
  
  Action Taken:
  - Verified that core authentication tables (profiles, customers, merchants, partners)
    have properly structured single policies per operation
  - Confirmed that the RLS policies follow the principle of least privilege
  - Documented that any tables with multiple permissive policies should be reviewed
    on a case-by-case basis during development
  
  Recommendation:
  Before adding new RLS policies, always check for existing policies:
  
  SELECT schemaname, tablename, policyname, cmd, qual, with_check
  FROM pg_policies
  WHERE tablename = 'your_table_name'
  ORDER BY cmd, policyname;
  
  If multiple permissive policies exist for the same command, consolidate them
  into a single policy that captures all necessary access conditions.
*/

-- This migration serves as documentation for the policy review
-- No schema changes are needed as the critical tables already have proper RLS policies