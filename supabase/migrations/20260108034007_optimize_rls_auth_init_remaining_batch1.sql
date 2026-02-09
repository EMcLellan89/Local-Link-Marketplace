/*
  # Optimize RLS Auth Initialization - Remaining Batch 1

  Fixes Auth RLS Initialization Plan issues for:
  - expenses
  - gift_card_templates
  - in_app_nudges
  - invoice_items
  - invoice_payments
  - invoices
  - lesson_progress
  - loyalty_contract_uploads
  - marketplace_affiliate_commissions
*/

-- expenses
DROP POLICY IF EXISTS "Merchants can update own expenses" ON public.expenses;
CREATE POLICY "Merchants can update own expenses"
  ON public.expenses
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

-- gift_card_templates
DROP POLICY IF EXISTS "gift_card_templates_update_merchant" ON public.gift_card_templates;
CREATE POLICY "gift_card_templates_update_merchant"
  ON public.gift_card_templates
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = gift_card_templates.merchant_id
    )
  )
  WITH CHECK (
    (select auth.uid()) IN (
      SELECT merchants.user_id
      FROM merchants
      WHERE merchants.id = gift_card_templates.merchant_id
    )
  );

-- in_app_nudges
DROP POLICY IF EXISTS "Users can update their own nudges" ON public.in_app_nudges;
CREATE POLICY "Users can update their own nudges"
  ON public.in_app_nudges
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- invoice_items
DROP POLICY IF EXISTS "Merchants can update own invoice items" ON public.invoice_items;
CREATE POLICY "Merchants can update own invoice items"
  ON public.invoice_items
  FOR UPDATE
  TO authenticated
  USING (
    invoice_id IN (
      SELECT invoices.id
      FROM invoices
      WHERE invoices.merchant_id IN (
        SELECT merchants.id
        FROM merchants
        WHERE merchants.user_id = (select auth.uid())
      )
    )
  )
  WITH CHECK (
    invoice_id IN (
      SELECT invoices.id
      FROM invoices
      WHERE invoices.merchant_id IN (
        SELECT merchants.id
        FROM merchants
        WHERE merchants.user_id = (select auth.uid())
      )
    )
  );

-- invoice_payments
DROP POLICY IF EXISTS "Merchants can update own payments" ON public.invoice_payments;
CREATE POLICY "Merchants can update own payments"
  ON public.invoice_payments
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

-- invoices
DROP POLICY IF EXISTS "Merchants can update own invoices" ON public.invoices;
CREATE POLICY "Merchants can update own invoices"
  ON public.invoices
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

-- lesson_progress
DROP POLICY IF EXISTS "Users can update their own progress" ON public.lesson_progress;
CREATE POLICY "Users can update their own progress"
  ON public.lesson_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- loyalty_contract_uploads
DROP POLICY IF EXISTS "Merchants can update own contract uploads" ON public.loyalty_contract_uploads;
CREATE POLICY "Merchants can update own contract uploads"
  ON public.loyalty_contract_uploads
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

-- marketplace_affiliate_commissions
DROP POLICY IF EXISTS "Admins can update marketplace commissions" ON public.marketplace_affiliate_commissions;
CREATE POLICY "Admins can update marketplace commissions"
  ON public.marketplace_affiliate_commissions
  FOR UPDATE
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
