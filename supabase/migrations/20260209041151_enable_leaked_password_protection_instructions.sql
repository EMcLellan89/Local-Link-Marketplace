/*
  # Enable Leaked Password Protection

  1. Security Enhancement
    - Prevents users from using passwords leaked in data breaches
    - Checks passwords against HaveIBeenPwned database
    - Critical for protecting user accounts

  2. Configuration Required
    This feature must be enabled through the Supabase Dashboard:
    - Navigate to: Authentication → Providers → Email
    - Enable "Leaked Password Protection"
    - This checks new passwords and password changes against known breaches

  3. Alternative: PostgreSQL Extension
    The pgtle.enable_password_check setting can be enabled, but requires
    superuser access which is not available in standard Supabase projects.

  4. Best Practices
    - Enable this feature in production environments
    - Enforce minimum password requirements (8+ characters, complexity)
    - Consider implementing rate limiting on auth endpoints
    - Monitor failed authentication attempts

  Note: This migration serves as documentation. The actual feature must be
  enabled through the Supabase Dashboard or project configuration.
*/

-- This is a documentation-only migration
-- No SQL commands to execute as the feature is configured via Supabase Dashboard

-- Verify current password encryption method (should be scram-sha-256)
DO $$
BEGIN
  RAISE NOTICE 'Current password encryption: %', current_setting('password_encryption');
  RAISE NOTICE 'To enable leaked password protection:';
  RAISE NOTICE '1. Go to Supabase Dashboard → Authentication → Providers → Email';
  RAISE NOTICE '2. Enable "Leaked Password Protection"';
  RAISE NOTICE '3. Consider enabling "Reauth" for sensitive operations';
END $$;
