/*
  # Leaked Password Protection Configuration
  
  1. Issue
    - Leaked password protection via HaveIBeenPwned is currently disabled
    - This feature prevents users from using passwords that have been exposed in data breaches
  
  2. Recommended Action
    - Enable leaked password protection in Supabase Auth settings
    - This cannot be automated via SQL migrations
    - Must be done via Supabase Dashboard or CLI
  
  3. How to Fix
    
    Via Dashboard:
    1. Go to Authentication > Providers > Email
    2. Find "Leaked Password Protection" section
    3. Toggle ON to enable
    4. Save changes
    
    Via CLI:
    supabase projects api-keys --project-ref YOUR_PROJECT_REF --create-key hibp
    
    Or update auth config:
    supabase projects update-auth-config \
      --project-ref YOUR_PROJECT_REF \
      --enable-password-breach-check true
  
  4. Impact
    - Improves account security significantly
    - Prevents use of compromised passwords
    - Minimal performance impact
    - Users with leaked passwords will be prompted to change them
  
  5. Priority
    - Medium-High: Recommended for production systems
    - Especially important for applications handling sensitive data
  
  6. User Experience
    - During signup: Password is checked against breach database
    - During login: Existing leaked passwords may trigger warning
    - Clear messaging guides users to choose secure passwords
*/

-- This is a documentation-only migration
-- Leaked password protection must be enabled via Dashboard or CLI
SELECT 'Leaked Password Protection documentation added' AS status;