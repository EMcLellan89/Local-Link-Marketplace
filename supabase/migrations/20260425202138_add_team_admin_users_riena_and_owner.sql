/*
  # Add Admin & CRM Login Accounts for Team

  ## Summary
  Creates internal team member records for two admin users (you and Riena) so
  they can log in to the Internal CRM and Admin dashboard.

  ## What This Does
  1. Inserts two rows into `internal_team_members` with role = 'admin' and full CRM access
  2. The emails are placeholder — update them to match the real Supabase Auth accounts
  3. Both users get full admin permissions across all CRM modules

  ## How Login Works
  - Navigate to /internal/login
  - Sign in with your Supabase Auth email + password
  - The system matches your email to internal_team_members and grants access

  ## Next Steps After This Migration
  - Create Supabase Auth accounts for each email via the Supabase Dashboard:
    Authentication > Users > Invite User (or Add User)
  - Or use password reset flow: users receive a magic link to set their password

  ## Security
  - RLS is already enabled on internal_team_members
  - Only authenticated users whose email matches an active row can access the CRM
*/

-- Add the owner/primary admin
INSERT INTO internal_team_members (
  email,
  full_name,
  role,
  is_active,
  permissions
)
VALUES (
  'owner@local-link.com',
  'Owner (Admin)',
  'admin',
  true,
  '{
    "crm": true,
    "sales": true,
    "customers": true,
    "partners": true,
    "accounting": true,
    "marketing": true,
    "support": true,
    "analytics": true,
    "reports": true,
    "settings": true
  }'::jsonb
)
ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  is_active = true,
  permissions = EXCLUDED.permissions,
  full_name = EXCLUDED.full_name;

-- Add Riena
INSERT INTO internal_team_members (
  email,
  full_name,
  role,
  is_active,
  permissions
)
VALUES (
  'riena@local-link.com',
  'Riena (Admin)',
  'admin',
  true,
  '{
    "crm": true,
    "sales": true,
    "customers": true,
    "partners": true,
    "accounting": true,
    "marketing": true,
    "support": true,
    "analytics": true,
    "reports": true,
    "settings": true
  }'::jsonb
)
ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  is_active = true,
  permissions = EXCLUDED.permissions,
  full_name = EXCLUDED.full_name;
