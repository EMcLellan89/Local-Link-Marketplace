/*
  # Update internal_team_members emails for owner and Riena

  Updates the placeholder emails to real email addresses:
  - owner@local-link.com → apptpipeline@gmail.com (Owner/Admin)
  - riena@local-link.com → Riena@mypipelinesolution.com (Riena/Admin)

  These emails must match the Supabase Auth accounts that will be created
  via the Supabase Dashboard (Authentication → Users → Invite User).
*/

UPDATE internal_team_members
SET email = 'apptpipeline@gmail.com'
WHERE email = 'owner@local-link.com';

UPDATE internal_team_members
SET email = 'riena@mypipelinesolution.com'
WHERE email = 'riena@local-link.com';

-- Also handle case where they may not exist yet — upsert both with correct emails
INSERT INTO internal_team_members (email, full_name, role, is_active, permissions)
VALUES (
  'apptpipeline@gmail.com',
  'Owner (Admin)',
  'admin',
  true,
  '{"crm": true, "sales": true, "customers": true, "partners": true, "accounting": true, "marketing": true, "support": true, "analytics": true, "reports": true, "settings": true}'::jsonb
)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  permissions = EXCLUDED.permissions;

INSERT INTO internal_team_members (email, full_name, role, is_active, permissions)
VALUES (
  'riena@mypipelinesolution.com',
  'Riena (Admin)',
  'admin',
  true,
  '{"crm": true, "sales": true, "customers": true, "partners": true, "accounting": true, "marketing": true, "support": true, "analytics": true, "reports": true, "settings": true}'::jsonb
)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  permissions = EXCLUDED.permissions;
