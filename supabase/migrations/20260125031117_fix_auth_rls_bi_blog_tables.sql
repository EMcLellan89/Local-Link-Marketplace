/*
  # Optimize Auth RLS Performance - BI and Blog Tables

  1. Performance Optimization
    - Wrap auth.uid() in SELECT subquery for BI and blog admin tables

  2. Security
    - Maintains existing security model
    - Improves query performance
*/

-- bi_competitor_tracking
DROP POLICY IF EXISTS "Merchants manage their competitor tracking" ON bi_competitor_tracking;
CREATE POLICY "Merchants manage their competitor tracking"
  ON bi_competitor_tracking
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- bi_metrics
DROP POLICY IF EXISTS "Merchants view their BI metrics" ON bi_metrics;
CREATE POLICY "Merchants view their BI metrics"
  ON bi_metrics
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- bi_predictions
DROP POLICY IF EXISTS "Merchants view their BI predictions" ON bi_predictions;
CREATE POLICY "Merchants view their BI predictions"
  ON bi_predictions
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- bi_reports
DROP POLICY IF EXISTS "Merchants manage their BI reports" ON bi_reports;
CREATE POLICY "Merchants manage their BI reports"
  ON bi_reports
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- blog_categories (admin only)
DROP POLICY IF EXISTS "Admin can manage blog categories" ON blog_categories;
CREATE POLICY "Admin can manage blog categories"
  ON blog_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (SELECT auth.uid()) 
        AND profiles.role = 'admin'
    )
  );

-- blog_post_tags (admin only)
DROP POLICY IF EXISTS "Admin can manage blog tags" ON blog_post_tags;
CREATE POLICY "Admin can manage blog tags"
  ON blog_post_tags
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (SELECT auth.uid()) 
        AND profiles.role = 'admin'
    )
  );
