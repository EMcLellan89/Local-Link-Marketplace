/*
  # Leaked Password Protection Documentation

  1. Issue
    - Leaked password protection is currently DISABLED
    - Users can sign up with passwords exposed in data breaches
    - Recommended: Enable HaveIBeenPwned.org password checking

  2. Solution
    - This setting CANNOT be changed via SQL migrations
    - Must be configured through Supabase Dashboard or Auth configuration
    
  3. How to Enable
    
    Option A: Via Supabase Dashboard
    ────────────────────────────────────
    1. Go to Authentication > Settings
    2. Scroll to "Password Requirements" section
    3. Find "Leaked Password Protection"
    4. Enable the toggle: "Check against HaveIBeenPwned"
    5. Save changes
    
    Option B: Via Supabase CLI/Config (if available)
    ────────────────────────────────────────────────
    Update your supabase/config.toml:
    
    [auth.security]
    password_required_characters = "abcdefghijklmnopqrstuvwxyz"
    minimum_password_length = 8
    enable_leaked_password_protection = true
    
    Then run: supabase db push
    
    Option C: Via Auth API Settings
    ────────────────────────────────
    If using Auth API directly, update settings:
    
    {
      "security": {
        "enable_leaked_password_protection": true
      }
    }
    
  4. How It Works
    - Checks passwords against HaveIBeenPwned database
    - Uses k-anonymity (only sends first 5 chars of hash)
    - Prevents users from using compromised passwords
    - No performance impact on sign-up/sign-in
    - Completely privacy-preserving
    
  5. Benefits
    - Prevents account takeover attacks
    - Reduces credential stuffing risks
    - Improves overall platform security
    - Industry best practice
    - Free service (HaveIBeenPwned is free for good-faith use)
    
  6. User Experience
    - Users with leaked passwords will be prompted to choose different one
    - Clear error message: "This password has been found in a data breach"
    - Does not affect existing users until they change password
    - Can be combined with other password requirements
    
  7. Recommended Configuration
    - Enable leaked password protection: YES
    - Minimum password length: 8-12 characters
    - Require mixed case: Optional (but recommended)
    - Require special characters: Optional (but recommended)

  Note: This is a DOCUMENTATION-ONLY migration as the setting
  must be changed through Supabase Auth configuration, not SQL.
  
  IMPORTANT: Enable this setting in production ASAP to improve
  security posture and protect users from compromised credentials.
*/

-- This migration serves as documentation only
-- No SQL changes required
SELECT 1 AS leaked_password_protection_documentation;