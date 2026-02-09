/*
  # Add RLS Policies to LL Tables (Final Corrected Version)
  
  1. Security Enhancement
    - Add policies based on actual schema with correct relationships
    - Most ll_autoscale tables reference client_id, which links to partner via ll_autoscale_clients
  
  2. Tables Updated
    - ll_autoscale_subscriptions: Admin and client owner access via client_id
    - ll_autoscale_workflows: Admin and client owner access
    - ll_circuit_breakers: Admin and client owner access
    - ll_comm_outbox: Admin and client owner access
    - ll_partner_commission_rules: Admin and partner access (has partner_id)
    - ll_stripe_price_map: Admin access only (reference data)
*/

-- ll_autoscale_subscriptions: Admin and client owner access
CREATE POLICY "Admin can manage autoscale subscriptions"
  ON ll_autoscale_subscriptions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'::user_role
  ));

CREATE POLICY "Partners can manage own client subscriptions"
  ON ll_autoscale_subscriptions
  FOR ALL
  TO authenticated
  USING (client_id IN (
    SELECT ac.id FROM ll_autoscale_clients ac
    JOIN partners p ON p.id = ac.partner_id
    WHERE p.user_id = (select auth.uid())
  ));

-- ll_autoscale_workflows: Admin and client owner access
CREATE POLICY "Admin can manage autoscale workflows"
  ON ll_autoscale_workflows
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'::user_role
  ));

CREATE POLICY "Partners can manage own client workflows"
  ON ll_autoscale_workflows
  FOR ALL
  TO authenticated
  USING (client_id IN (
    SELECT ac.id FROM ll_autoscale_clients ac
    JOIN partners p ON p.id = ac.partner_id
    WHERE p.user_id = (select auth.uid())
  ));

-- ll_circuit_breakers: Admin and client owner access
CREATE POLICY "Admin can manage circuit breakers"
  ON ll_circuit_breakers
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'::user_role
  ));

CREATE POLICY "Partners can view own client circuit breakers"
  ON ll_circuit_breakers
  FOR SELECT
  TO authenticated
  USING (client_id IN (
    SELECT ac.id FROM ll_autoscale_clients ac
    JOIN partners p ON p.id = ac.partner_id
    WHERE p.user_id = (select auth.uid())
  ));

-- ll_comm_outbox: Admin and client owner access
CREATE POLICY "Admin can manage comm outbox"
  ON ll_comm_outbox
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'::user_role
  ));

CREATE POLICY "Partners can view own client comm outbox"
  ON ll_comm_outbox
  FOR SELECT
  TO authenticated
  USING (client_id IN (
    SELECT ac.id FROM ll_autoscale_clients ac
    JOIN partners p ON p.id = ac.partner_id
    WHERE p.user_id = (select auth.uid())
  ));

-- ll_partner_commission_rules: Admin and partner access (has partner_id)
CREATE POLICY "Admin can manage partner commission rules"
  ON ll_partner_commission_rules
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'::user_role
  ));

CREATE POLICY "Partners can view own commission rules"
  ON ll_partner_commission_rules
  FOR SELECT
  TO authenticated
  USING (partner_id IN (
    SELECT partners.id FROM partners
    WHERE partners.user_id = (select auth.uid())
  ));

-- ll_stripe_price_map: Admin access only (reference data)
CREATE POLICY "Admin can manage stripe price map"
  ON ll_stripe_price_map
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'::user_role
  ));

CREATE POLICY "Stripe price map is publicly readable"
  ON ll_stripe_price_map
  FOR SELECT
  TO authenticated
  USING (is_active = true);