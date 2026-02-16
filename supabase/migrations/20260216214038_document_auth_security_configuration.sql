/*
  # Auth Security Configuration Documentation
  
  This migration documents required Auth configuration changes identified in the security audit.
  
  ## 1. Leaked Password Protection (CRITICAL)
  
  Status: Currently DISABLED
  Risk: Users can register with passwords that have been exposed in data breaches
  
  Action Required (Manual Configuration in Supabase Dashboard):
  1. Navigate to Authentication > Policies in Supabase Dashboard
  2. Enable "Password breach detection"
  3. This uses the HaveIBeenPwned API to check passwords against known data breaches
  
  Why This Matters:
  - Prevents users from using compromised passwords
  - Reduces account takeover risk
  - Improves overall platform security
  
  ## 2. Auth DB Connection Strategy
  
  Current: percentage-based connection strategy
  Recommendation: Review and optimize based on load patterns
  
  The percentage-based strategy means:
  - Supabase GoTrue (Auth service) uses a percentage of available DB connections
  - This prevents Auth operations from consuming all connections
  - Default is typically 10% of total connections
  
  Optimization Checklist:
  - Monitor connection pool usage in Supabase Dashboard
  - Adjust percentage if Auth operations are timing out
  - Ensure sufficient connections for both Auth and application queries
  - Consider upgrading database plan if connection limits are reached
  
  ## 3. Additional Auth Security Best Practices
  
  Implemented via Database:
  - Row Level Security (RLS) enabled on all tables
  - Auth policies use auth.uid() for user identification
  - Restrictive policies enforce least privilege access
  
  Recommended Dashboard Settings:
  - Enable Multi-Factor Authentication (MFA) support
  - Set appropriate session timeout values
  - Configure email verification requirements
  - Enable rate limiting on auth endpoints
  - Review and restrict allowed redirect URLs
  
  ## 4. Monitoring and Maintenance
  
  Regular Security Audits Should Include:
  - Review failed login attempts
  - Monitor for unusual authentication patterns
  - Verify RLS policies are functioning correctly
  - Check for abandoned sessions
  - Review API usage for auth endpoints
  
  ## Configuration Summary
  
  Database-Level (Completed):
  ✅ RLS enabled on all tables
  ✅ Auth-based policies implemented
  ✅ Unused indexes removed for performance
  ✅ Multiple permissive policies reviewed
  
  Dashboard-Level (Manual Action Required):
  ⚠️ Enable password breach detection
  ⚠️ Review connection pool strategy
  ⚠️ Configure MFA settings
  ⚠️ Set session timeout values
  ⚠️ Review rate limiting configuration
*/

-- This migration serves as documentation
-- The Auth configuration changes must be made in the Supabase Dashboard
-- as they are not controllable via SQL migrations