/*
  # Auth DB Connection Strategy Documentation
  
  ## Current Issue:
  Auth server uses a fixed connection strategy with 10 connections.
  Supabase recommends using a percentage-based strategy instead.
  
  ## Recommended Fix:
  This is a Supabase dashboard configuration change, not a SQL migration.
  
  ### Steps to Apply (Manual):
  1. Go to Supabase Dashboard → Project Settings → Database
  2. Locate "Auth Server Connection Pool" settings
  3. Change from "Fixed (10 connections)" to "Percentage-based"
  4. Recommended percentage: 10-20% of max connections
  5. Click Save
  
  ## Why This Matters:
  - Fixed connections can cause contention under high load
  - Percentage-based scaling adapts to database capacity
  - Better resource utilization across all services
  - Reduces risk of connection exhaustion
  
  ## Impact:
  - No downtime required
  - Immediate effect after save
  - Auth performance may improve under load
  
  ## Rollback:
  Can be reverted by changing back to fixed strategy in dashboard.
  
  ## Note:
  This migration serves as documentation only. 
  The actual change must be made through the Supabase dashboard.
*/

-- This migration contains no executable SQL
-- It exists purely for documentation purposes
SELECT 'Auth DB Connection Strategy change must be applied via Supabase Dashboard' AS documentation;