/*
  # Optimize Auth RLS Policies - Batch 3: Actual Policies

  1. Performance Improvements
    - Wrap unwrapped auth.uid() calls in (SELECT auth.uid())
    - Prevent re-evaluation of auth functions per row
    - Improve query planner efficiency

  2. Tables Optimized (17 policies)
    - deal_bundles
    - dfy_ad_vault
    - ll_books_expenses
    - merchant_crm_preferences
    - org_members
    - organizations
    - partner_playbooks
    - partner_relationships
    - seasonal_campaigns
    - vendors
    - white_label_licenses

  3. Pattern Applied
    - Replace auth.uid() with (SELECT auth.uid()) in USING and WITH CHECK clauses
*/

-- deal_bundles
DROP POLICY IF EXISTS "Admin full access to deal_bundles" ON deal_bundles;
CREATE POLICY "Admin full access to deal_bundles" ON deal_bundles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

-- dfy_ad_vault
DROP POLICY IF EXISTS "Admins can manage ad vault content" ON dfy_ad_vault;
CREATE POLICY "Admins can manage ad vault content" ON dfy_ad_vault
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

DROP POLICY IF EXISTS "Partners can view ad vault content" ON dfy_ad_vault;
CREATE POLICY "Partners can view ad vault content" ON dfy_ad_vault
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = ANY (ARRAY['partner'::user_role, 'admin'::user_role])
        )
    );

-- ll_books_expenses
DROP POLICY IF EXISTS "Merchants can manage own expenses" ON ll_books_expenses;
CREATE POLICY "Merchants can manage own expenses" ON ll_books_expenses
    FOR ALL
    USING (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

-- merchant_crm_preferences
DROP POLICY IF EXISTS "Merchants can insert own CRM preferences" ON merchant_crm_preferences;
CREATE POLICY "Merchants can insert own CRM preferences" ON merchant_crm_preferences
    FOR INSERT
    WITH CHECK (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Merchants can view own CRM preferences" ON merchant_crm_preferences;
CREATE POLICY "Merchants can view own CRM preferences" ON merchant_crm_preferences
    FOR SELECT
    USING (
        merchant_id IN (
            SELECT merchants.id
            FROM merchants
            WHERE merchants.user_id = (SELECT auth.uid())
        )
    );

-- org_members
DROP POLICY IF EXISTS "org_members_admin" ON org_members;
CREATE POLICY "org_members_admin" ON org_members
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM admin_users
            WHERE admin_users.id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "org_members_select" ON org_members;
CREATE POLICY "org_members_select" ON org_members
    FOR SELECT
    USING (
        profile_id = (SELECT auth.uid())
        OR EXISTS (
            SELECT 1
            FROM org_members om
            WHERE om.org_id = org_members.org_id
                AND om.profile_id = (SELECT auth.uid())
        )
        OR EXISTS (
            SELECT 1
            FROM admin_users
            WHERE admin_users.id = (SELECT auth.uid())
        )
    );

-- organizations
DROP POLICY IF EXISTS "organizations_admin" ON organizations;
CREATE POLICY "organizations_admin" ON organizations
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM admin_users
            WHERE admin_users.id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "organizations_select" ON organizations;
CREATE POLICY "organizations_select" ON organizations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM org_members
            WHERE org_members.org_id = organizations.id
                AND org_members.profile_id = (SELECT auth.uid())
        )
        OR EXISTS (
            SELECT 1
            FROM admin_users
            WHERE admin_users.id = (SELECT auth.uid())
        )
    );

-- partner_playbooks
DROP POLICY IF EXISTS "Admins can manage playbooks" ON partner_playbooks;
CREATE POLICY "Admins can manage playbooks" ON partner_playbooks
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

-- partner_relationships
DROP POLICY IF EXISTS "partner_relationships_admin" ON partner_relationships;
CREATE POLICY "partner_relationships_admin" ON partner_relationships
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM admin_users
            WHERE admin_users.id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "partner_relationships_select" ON partner_relationships;
CREATE POLICY "partner_relationships_select" ON partner_relationships
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM org_members
            WHERE (
                org_members.org_id = partner_relationships.partner_org_id
                OR org_members.org_id = partner_relationships.merchant_org_id
            )
            AND org_members.profile_id = (SELECT auth.uid())
        )
        OR EXISTS (
            SELECT 1
            FROM admin_users
            WHERE admin_users.id = (SELECT auth.uid())
        )
    );

-- seasonal_campaigns
DROP POLICY IF EXISTS "Admin full access to seasonal_campaigns" ON seasonal_campaigns;
CREATE POLICY "Admin full access to seasonal_campaigns" ON seasonal_campaigns
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

-- vendors
DROP POLICY IF EXISTS "Admin full access to vendors" ON vendors;
CREATE POLICY "Admin full access to vendors" ON vendors
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

-- white_label_licenses
DROP POLICY IF EXISTS "Admins can manage all licenses" ON white_label_licenses;
CREATE POLICY "Admins can manage all licenses" ON white_label_licenses
    FOR ALL
    USING (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = (SELECT auth.uid())
                AND profiles.role = 'admin'::user_role
        )
    );

DROP POLICY IF EXISTS "Partners can view own licenses" ON white_label_licenses;
CREATE POLICY "Partners can view own licenses" ON white_label_licenses
    FOR SELECT
    USING (
        partner_id IN (
            SELECT partners.id
            FROM partners
            WHERE partners.user_id = (SELECT auth.uid())
        )
    );