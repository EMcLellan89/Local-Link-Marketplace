/*
  # Fix Playbooks Public Access

  1. Changes
    - Add public SELECT policy for published playbooks
    - Allow anonymous users to view published playbooks, modules, and lessons
    - This enables bypass mode to work and allows public browsing
    
  2. Security
    - Only published playbooks are visible
    - Anonymous users can only SELECT (read-only)
    - Partners still need auth for progress tracking
*/

-- Allow anonymous users to view published playbooks
CREATE POLICY "Anyone can view published playbooks"
  ON partner_playbooks FOR SELECT
  TO anon
  USING (is_published = true);

-- Allow anonymous users to view modules of published playbooks
CREATE POLICY "Anyone can view published playbook modules"
  ON partner_playbook_modules FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM partner_playbooks
      WHERE partner_playbooks.id = partner_playbook_modules.playbook_id
      AND partner_playbooks.is_published = true
    )
  );

-- Allow anonymous users to view lessons of published playbooks
CREATE POLICY "Anyone can view published playbook lessons"
  ON partner_playbook_lessons FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM partner_playbook_modules m
      JOIN partner_playbooks p ON p.id = m.playbook_id
      WHERE m.id = partner_playbook_lessons.module_id
      AND p.is_published = true
    )
  );
