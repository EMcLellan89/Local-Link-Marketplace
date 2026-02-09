/*
  # Optimize RLS Policies - Part 3 (Step by Step)

  Testing each policy individually to identify which table is causing the issue.
*/

-- certifications - Admins can manage
DROP POLICY IF EXISTS "Admins can manage certifications" ON certifications;
CREATE POLICY "Admins can manage certifications"
  ON certifications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid()) AND profiles.role = 'admin'
    )
  );

-- certifications - Partners can view own
DROP POLICY IF EXISTS "Partners can view own certification" ON certifications;
CREATE POLICY "Partners can view own certification"
  ON certifications FOR SELECT
  TO authenticated
  USING (
    partner_id IN (
      SELECT p.id FROM partners p WHERE p.user_id = (select auth.uid())
    )
  );
