/*
  # Leaked Password Protection - Manual Configuration Required

  1. Issue
    - HaveIBeenPwned password breach detection is currently disabled
    - Users may use compromised passwords
    - Recommended: Enable breach detection for enhanced security

  2. What is HaveIBeenPwned?
    - Service that checks passwords against known data breaches
    - Uses k-anonymity to protect password privacy
    - Industry standard for password breach detection
    - Free API for checking leaked credentials

  3. Manual Steps to Enable
    - Navigate to Supabase Dashboard → Authentication → Settings
    - Locate "Password Requirements" section
    - Enable "Check for breached passwords" option
    - Configure rejection behavior:
      * Hard block: Prevent signup/login with breached passwords
      * Soft warning: Allow but warn users
    - Save configuration

  4. Benefits
    - Prevents use of compromised credentials
    - Reduces account takeover risk
    - Industry best practice compliance
    - No impact on legitimate users

  5. Privacy Considerations
    - Uses k-anonymity protocol
    - Only first 5 characters of hash are sent
    - Password never leaves your system in plaintext
    - HIBP cannot reverse-engineer passwords

  6. User Impact
    - Users with breached passwords will need to choose new ones
    - Minimal friction for users with strong, unique passwords
    - Consider communication plan before enabling

  7. References
    - https://haveibeenpwned.com/API/v3
    - https://supabase.com/docs/guides/auth/passwords
    - https://en.wikipedia.org/wiki/K-anonymity

  Note: This is a configuration-only change requiring Supabase Dashboard access.
  Recommended to enable for production environments.
*/

-- This migration serves as documentation only
-- Configuration must be changed in Supabase Dashboard
SELECT 1;
