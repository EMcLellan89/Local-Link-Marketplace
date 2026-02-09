/*
  # Optimize RLS Auth Initialization - Remaining Batch 2

  Fixes Auth RLS Initialization Plan issues for:
  - marketplace_affiliate_payouts
  - marketplace_affiliate_products
  - marketplace_affiliates
  - merchant_applications
  - merchant_comprehensive_stats
  - merchants
  - onboarding_progress
  - partner_onboarding_progress
  - paybright_config
  - product_categories
  - product_variants
  - products
  - profiles
  - referral_programs
*/

-- marketplace_affiliate_payouts
DROP POLICY IF EXISTS "Admins can manage marketplace payouts" ON public.marketplace_affiliate_payouts;
CREATE POLICY "Admins can manage marketplace payouts"
  ON public.marketplace_affiliate_payouts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'::user_role
    )
  );

-- marketplace_affiliate_products
DROP POLICY IF EXISTS "Admins can manage marketplace products" ON public.marketplace_affiliate_products;
CREATE POLICY "Admins can manage marketplace products"
  ON public.marketplace_affiliate_products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'::user_role
    )
  );

-- marketplace_affiliates (admin policy)
DROP POLICY IF EXISTS "Admins can manage marketplace affiliates" ON public.marketplace_affiliates;
CREATE POLICY "Admins can manage marketplace affiliates"
  ON public.marketplace_affiliates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'admin'::user_role
    )
  );

-- marketplace_affiliates (self update)
DROP POLICY IF EXISTS "Marketplace affiliates can update own profile" ON public.marketplace_affiliates;
CREATE POLICY "Marketplace affiliates can update own profile"
  ON public.marketplace_affiliates
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- merchant_applications
DROP POLICY IF EXISTS "Users can update own pending applications" ON public.merchant_applications;
CREATE POLICY "Users can update own pending applications"
  ON public.merchant_applications
  FOR UPDATE
  TO authenticated
  USING (
    email = (
      SELECT users.email::text
      FROM auth.users
      WHERE users.id = (select auth.uid())
    ) AND status = 'pending'::text
  )
  WITH CHECK (
    email = (
      SELECT users.email::text
      FROM auth.users
      WHERE users.id = (select auth.uid())
    ) AND status = 'pending'::text
  );

-- merchant_comprehensive_stats
DROP POLICY IF EXISTS "System can update merchant comprehensive stats" ON public.merchant_comprehensive_stats;
CREATE POLICY "System can update merchant comprehensive stats"
  ON public.merchant_comprehensive_stats
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- merchants
DROP POLICY IF EXISTS "Merchants can update own profile" ON public.merchants;
CREATE POLICY "Merchants can update own profile"
  ON public.merchants
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- onboarding_progress
DROP POLICY IF EXISTS "onboarding_update_own" ON public.onboarding_progress;
CREATE POLICY "onboarding_update_own"
  ON public.onboarding_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- partner_onboarding_progress
DROP POLICY IF EXISTS "Partners can update own progress" ON public.partner_onboarding_progress;
CREATE POLICY "Partners can update own progress"
  ON public.partner_onboarding_progress
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT partners.user_id
      FROM partners
      WHERE partners.id = partner_onboarding_progress.partner_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT partners.user_id
      FROM partners
      WHERE partners.id = partner_onboarding_progress.partner_id
    )
  );

-- paybright_config
DROP POLICY IF EXISTS "Merchants can update own PayBright config" ON public.paybright_config;
CREATE POLICY "Merchants can update own PayBright config"
  ON public.paybright_config
  FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );

-- product_categories
DROP POLICY IF EXISTS "Merchants manage their categories" ON public.product_categories;
CREATE POLICY "Merchants manage their categories"
  ON public.product_categories
  FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = product_categories.merchant_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = product_categories.merchant_id
    )
  );

-- product_variants
DROP POLICY IF EXISTS "Merchants manage their product variants" ON public.product_variants;
CREATE POLICY "Merchants manage their product variants"
  ON public.product_variants
  FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT m.user_id
      FROM merchants m
      JOIN products p ON m.id = p.merchant_id
      WHERE p.id = product_variants.product_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT m.user_id
      FROM merchants m
      JOIN products p ON m.id = p.merchant_id
      WHERE p.id = product_variants.product_id
    )
  );

-- products
DROP POLICY IF EXISTS "Merchants manage their products" ON public.products;
CREATE POLICY "Merchants manage their products"
  ON public.products
  FOR ALL
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = products.merchant_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = products.merchant_id
    )
  );

-- profiles
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- referral_programs
DROP POLICY IF EXISTS "Merchants manage their referral programs" ON public.referral_programs;
CREATE POLICY "Merchants manage their referral programs"
  ON public.referral_programs
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT merchants.id
      FROM merchants
      WHERE merchants.user_id = (select auth.uid())
    )
  );
