/*
  # Enable RLS on Public Tables (Corrected)
  
  1. Security Enhancement
    - Enable RLS on 4 tables based on actual schema
  
  2. Tables Updated
    - financial_plans: Public read, admin write
    - plan_pricing: Public read, admin write
    - audit_log: Admin only
    - client_vault_artifacts: Admin and merchant access (uses merchant_id not user_id)
*/

-- financial_plans
ALTER TABLE financial_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Financial plans are publicly readable"
  ON financial_plans
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage financial plans"
  ON financial_plans
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

-- plan_pricing
ALTER TABLE plan_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plan pricing is publicly readable"
  ON plan_pricing
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage plan pricing"
  ON plan_pricing
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

-- audit_log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view audit log"
  ON audit_log
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'::user_role
  ));

CREATE POLICY "System can insert audit log"
  ON audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- client_vault_artifacts
ALTER TABLE client_vault_artifacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage vault artifacts"
  ON client_vault_artifacts
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

CREATE POLICY "Merchants can view own vault artifacts"
  ON client_vault_artifacts
  FOR SELECT
  TO authenticated
  USING (merchant_id IN (
    SELECT merchants.id FROM merchants
    WHERE merchants.user_id = (select auth.uid())
  ));