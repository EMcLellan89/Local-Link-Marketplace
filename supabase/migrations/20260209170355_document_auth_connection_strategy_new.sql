/*
  # Auth DB Connection Strategy Configuration
  
  1. Issue
    - Supabase recommends configuring auth.max_pool_size as percentage of database connections
    - Current setting uses fixed connection count which may not scale optimally
  
  2. Recommended Action
    - Change auth server configuration to use percentage-based pool sizing
    - This cannot be automated via SQL migrations
    - Must be done via Supabase Dashboard or CLI
  
  3. How to Fix
    
    Via Dashboard:
    1. Go to Project Settings > Database
    2. Navigate to Connection pooling settings
    3. Set Auth pool size to: percentage mode (recommended: 10-20%)
    
    Via CLI:
    supabase projects update-auth-config \
      --project-ref YOUR_PROJECT_REF \
      --auth-pool-mode percentage \
      --auth-pool-size 15
  
  4. Impact
    - Improves connection pool scaling
    - Better resource utilization under varying load
    - No security impact, purely operational
  
  5. Priority
    - Low: System works fine with current settings
    - Recommended for production optimization
*/

-- This is a documentation-only migration
-- No SQL changes required
SELECT 'Auth DB Connection Strategy documentation added' AS status;