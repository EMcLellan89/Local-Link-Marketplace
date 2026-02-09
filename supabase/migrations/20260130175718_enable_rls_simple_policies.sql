/*
  # Enable RLS on Tables Missing Row-Level Security - Simplified

  1. Security Fix
    - Enables RLS on 9 tables that are currently unprotected
    - Uses simple policies based on auth.uid() matching profile IDs

  2. Tables Fixed
    - feature_flags (read by all)
    - org_features (org members only)
    - org_members (own membership + same org members)
    - organizations (org members only)
    - partner_relationships (org-based)
    - partner_tiers (read-only reference)
    - plans (read-only reference)
    - subscription_items (org members only)
    - subscriptions (org members only)

  3. Security
    - Admins have full access to all tables
    - Users can only access their org data
*/

-- Enable RLS on all tables
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- feature_flags: Read-only for all authenticated users
CREATE POLICY "feature_flags_select" ON public.feature_flags
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "feature_flags_admin" ON public.feature_flags
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- org_features: Org members can read their org's features
CREATE POLICY "org_features_select" ON public.org_features
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = org_features.org_id
      AND org_members.profile_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "org_features_admin" ON public.org_features
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- org_members: Can read own membership or same org members
CREATE POLICY "org_members_select" ON public.org_members
  FOR SELECT TO authenticated
  USING (
    profile_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM org_members om
      WHERE om.org_id = org_members.org_id
      AND om.profile_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "org_members_admin" ON public.org_members
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- organizations: Org members can read their org
CREATE POLICY "organizations_select" ON public.organizations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = organizations.id
      AND org_members.profile_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "organizations_admin" ON public.organizations
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- partner_relationships: Org members can read their relationships
CREATE POLICY "partner_relationships_select" ON public.partner_relationships
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE (org_members.org_id = partner_relationships.partner_org_id 
         OR org_members.org_id = partner_relationships.merchant_org_id)
      AND org_members.profile_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "partner_relationships_admin" ON public.partner_relationships
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- partner_tiers: Read-only reference table for all authenticated
CREATE POLICY "partner_tiers_select" ON public.partner_tiers
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "partner_tiers_admin" ON public.partner_tiers
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- plans: Read-only reference table for all authenticated
CREATE POLICY "plans_select" ON public.plans
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "plans_admin" ON public.plans
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- subscription_items: Org members can read their subscription items
CREATE POLICY "subscription_items_select" ON public.subscription_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = subscription_items.org_id
      AND org_members.profile_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "subscription_items_admin" ON public.subscription_items
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));

-- subscriptions: Org members can read their org's subscriptions
CREATE POLICY "subscriptions_select" ON public.subscriptions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = subscriptions.org_id
      AND org_members.profile_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "subscriptions_admin" ON public.subscriptions
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()));
