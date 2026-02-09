/*
  # Auth DB Connection Strategy Documentation

  1. Issue
    - Auth service is configured with fixed 10 connections to the database
    - This doesn't scale well with increased load
    - Recommended: Use percentage-based allocation instead

  2. Solution
    - This setting CANNOT be changed via SQL migrations
    - Must be configured through Supabase Dashboard or CLI
    
  3. How to Fix
    
    Option A: Via Supabase Dashboard
    ────────────────────────────────────
    1. Go to Project Settings > Database
    2. Locate "Connection Pooling" settings
    3. Under "Auth" connection pool:
       - Change from "Fixed: 10" to "Percentage"
       - Set to 5-10% of max connections (recommended)
    4. Save changes
    
    Option B: Via Supabase CLI (if available)
    ────────────────────────────────────────
    Update your supabase/config.toml:
    
    [auth.connection_pool]
    mode = "percentage"
    percentage = 5  # 5% of max connections
    
    Then run: supabase db push
    
  4. Recommended Configuration
    - For production: 5-10% of max connections
    - Ensures Auth service scales with database capacity
    - Prevents Auth from consuming fixed resources during low usage
    
  5. Why Percentage-Based Is Better
    - Scales automatically with database size
    - More efficient resource utilization
    - Better handles traffic spikes
    - Reduces idle connection overhead

  Note: This is a DOCUMENTATION-ONLY migration as the setting
  must be changed through Supabase configuration, not SQL.
*/

-- This migration serves as documentation only
-- No SQL changes required
SELECT 1 AS documentation_migration;