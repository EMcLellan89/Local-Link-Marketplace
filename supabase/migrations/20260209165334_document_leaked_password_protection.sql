/*
  # Leaked Password Protection Documentation
  
  ## Current Status:
  Leaked password protection is currently DISABLED.
  This feature integrates with HaveIBeenPwned.org to prevent users from using
  passwords that have been exposed in data breaches.
  
  ## What is Leaked Password Protection:
  - Checks user passwords against HaveIBeenPwned database
  - Prevents signup/password change with compromised passwords
  - Uses k-Anonymity model (sends only password hash prefix)
  - No actual passwords are sent to third-party service
  - Privacy-preserving implementation
  
  ## How to Enable (Manual Steps):
  
  ### Option 1: Supabase Dashboard
  1. Go to Supabase Dashboard → Authentication → Policies
  2. Locate "Password Protection" section
  3. Toggle "Prevent leaked passwords" to ON
  4. Click Save
  
  ### Option 2: Supabase CLI
  Run this command:
  ```bash
  supabase auth update --hibp-enabled=true
  ```
  
  ## Benefits:
  ✓ Prevents account takeovers from credential stuffing
  ✓ Improves overall platform security
  ✓ Protects users from known compromised passwords
  ✓ Industry best practice
  ✓ No performance impact on authentication
  
  ## Considerations:
  - Requires external API call to HaveIBeenPwned.org
  - Minimal latency added to signup/password change
  - Users with leaked passwords must choose new ones
  - May increase password reset requests initially
  
  ## User Experience:
  When enabled, users attempting to use leaked passwords will see:
  "This password has been found in a data breach. Please choose a different password."
  
  ## Technical Details:
  - Uses HaveIBeenPwned Passwords API v3
  - Implements k-Anonymity (sends only first 5 chars of SHA-1 hash)
  - Preserves user privacy
  - No user data sent to third party
  
  ## Rollback:
  Can be disabled at any time through dashboard or CLI.
  
  ## Recommendation:
  **ENABLE THIS FEATURE** - It's a security best practice with minimal downside.
  
  ## Note:
  This is a Supabase configuration change, not a database migration.
  The actual change must be made through Supabase Dashboard or CLI.
*/

-- This migration serves as documentation only
SELECT 'Leaked Password Protection should be enabled via Supabase Dashboard or CLI' AS documentation;