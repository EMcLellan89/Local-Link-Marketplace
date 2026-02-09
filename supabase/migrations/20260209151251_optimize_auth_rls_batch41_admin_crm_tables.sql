/*
  # Optimize Auth RLS Performance - Admin CRM Tables

  1. Performance Optimization
    - Wrap auth.uid() in (SELECT auth.uid()) to reduce function calls from N to 1 per query
    - Apply to admin policies in: admin_crm_goals, admin_crm_companies, admin_crm_contacts, admin_crm_activities
  
  2. Impact
    - Reduces auth overhead for admin operations
    - Improves query performance for internal CRM
    - Maintains same security guarantees
*/

-- Admin CRM Goals
DROP POLICY IF EXISTS "Admins can manage goals" ON admin_crm_goals;

CREATE POLICY "Admins can manage goals"
ON admin_crm_goals FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = (SELECT auth.uid()) 
  AND role = 'admin'::user_role
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = (SELECT auth.uid()) 
  AND role = 'admin'::user_role
));

-- Admin CRM Companies
DROP POLICY IF EXISTS "Admins can manage companies" ON admin_crm_companies;

CREATE POLICY "Admins can manage companies"
ON admin_crm_companies FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = (SELECT auth.uid()) 
  AND role = 'admin'::user_role
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = (SELECT auth.uid()) 
  AND role = 'admin'::user_role
));

-- Admin CRM Contacts
DROP POLICY IF EXISTS "Admins can manage contacts" ON admin_crm_contacts;

CREATE POLICY "Admins can manage contacts"
ON admin_crm_contacts FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = (SELECT auth.uid()) 
  AND role = 'admin'::user_role
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = (SELECT auth.uid()) 
  AND role = 'admin'::user_role
));

-- Admin CRM Activities
DROP POLICY IF EXISTS "Admins can manage activities" ON admin_crm_activities;

CREATE POLICY "Admins can manage activities"
ON admin_crm_activities FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = (SELECT auth.uid()) 
  AND role = 'admin'::user_role
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = (SELECT auth.uid()) 
  AND role = 'admin'::user_role
));