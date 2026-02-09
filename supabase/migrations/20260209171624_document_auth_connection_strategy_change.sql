/*
  # Auth DB Connection Strategy - Manual Configuration Required

  1. Issue
    - Current: Fixed connection count (15 connections)
    - Recommended: Percentage-based connection pooling
    - Impact: Better resource utilization and scalability

  2. Manual Steps Required
    - Navigate to Supabase Dashboard → Settings → Database
    - Change connection pooling strategy from "Fixed" to "Percentage"
    - Set percentage to 10-20% of max_connections
    - Monitor connection usage after change

  3. Benefits
    - Automatic scaling with database size
    - Better handling of traffic spikes
    - Reduced risk of connection exhaustion

  4. References
    - https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pool
    - Max connections = max_connections * pool_percentage / 100

  Note: This is a configuration-only change requiring dashboard access.
*/

-- This migration serves as documentation only
-- No SQL changes required
SELECT 1;
