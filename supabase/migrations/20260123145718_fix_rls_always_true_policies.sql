/*
  # Fix RLS Policies with Always True Conditions
  
  1. Security
    - Fix policies that bypass RLS by being always true
    - Add proper ownership checks
  
  2. Tables Updated
    - team_member_commissions
    - team_member_goals
*/

-- team_member_commissions
DROP POLICY IF EXISTS "Owners can manage commissions" ON team_member_commissions;

CREATE POLICY "Admins can manage commissions" ON team_member_commissions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Owners can manage own team commissions" ON team_member_commissions
  FOR ALL TO authenticated
  USING (
    team_member_id IN (
      SELECT tm.id FROM team_members tm
      WHERE tm.id IN (
        SELECT tm2.id FROM team_members tm2
        WHERE tm2.manager_id IN (
          SELECT id FROM team_members 
          WHERE user_id = (SELECT auth.uid())
        )
      )
      OR tm.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    team_member_id IN (
      SELECT tm.id FROM team_members tm
      WHERE tm.id IN (
        SELECT tm2.id FROM team_members tm2
        WHERE tm2.manager_id IN (
          SELECT id FROM team_members 
          WHERE user_id = (SELECT auth.uid())
        )
      )
      OR tm.user_id = (SELECT auth.uid())
    )
  );

-- team_member_goals
DROP POLICY IF EXISTS "Owners can manage goals" ON team_member_goals;

CREATE POLICY "Admins can manage goals" ON team_member_goals
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = (SELECT auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Managers can manage team goals" ON team_member_goals
  FOR ALL TO authenticated
  USING (
    team_member_id IN (
      SELECT tm.id FROM team_members tm
      WHERE tm.manager_id IN (
        SELECT id FROM team_members 
        WHERE user_id = (SELECT auth.uid())
      )
      OR tm.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    team_member_id IN (
      SELECT tm.id FROM team_members tm
      WHERE tm.manager_id IN (
        SELECT id FROM team_members 
        WHERE user_id = (SELECT auth.uid())
      )
      OR tm.user_id = (SELECT auth.uid())
    )
  );
