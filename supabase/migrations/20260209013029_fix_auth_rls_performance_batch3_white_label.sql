/*
  # Fix Auth RLS Performance - Batch 3: White label settings
  
  1. Performance Improvement
    - Wrap auth.uid() calls in white_label_settings policies
  
  2. Policies Updated
    - white_label_settings: Admin full access
    - white_label_settings: Partners can manage own
*/

-- white_label_settings - Admin access
DROP POLICY IF EXISTS "Admin full access to white label settings" ON white_label_settings;
CREATE POLICY "Admin full access to white label settings"
  ON white_label_settings
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'::user_role
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'::user_role
  ));

-- white_label_settings - Partners own access
DROP POLICY IF EXISTS "Partners can manage own white label settings" ON white_label_settings;
CREATE POLICY "Partners can manage own white label settings"
  ON white_label_settings
  FOR ALL
  TO authenticated
  USING (
    org_id = (select auth.uid())
    AND has_enterprise_tier((select auth.uid()))
  )
  WITH CHECK (
    org_id = (select auth.uid())
    AND has_enterprise_tier((select auth.uid()))
  );