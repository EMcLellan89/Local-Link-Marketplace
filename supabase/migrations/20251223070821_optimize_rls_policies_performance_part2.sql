/*
  # Optimize RLS Policies Performance - Part 2
  
  1. Performance Optimization Continued
    - CRM tables (leads, activities, tasks)
    - Marketing and campaign tables
    - Customer interaction tables (reviews, favorites, notifications)
    - All remaining tables with auth function calls
  
  2. Impact
    - Significant performance improvement on queries returning multiple rows
    - Reduces database load by avoiding repeated auth function calls
*/

-- Drop and recreate policies for crm_leads
DROP POLICY IF EXISTS "Merchants can create leads" ON crm_leads;
DROP POLICY IF EXISTS "Merchants can delete their leads" ON crm_leads;
DROP POLICY IF EXISTS "Merchants can update their leads" ON crm_leads;
DROP POLICY IF EXISTS "Merchants can view their leads" ON crm_leads;

CREATE POLICY "Merchants can create leads"
  ON crm_leads FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = crm_leads.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can delete their leads"
  ON crm_leads FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = crm_leads.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update their leads"
  ON crm_leads FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = crm_leads.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view their leads"
  ON crm_leads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = crm_leads.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for crm_activities
DROP POLICY IF EXISTS "Merchants can create activities" ON crm_activities;
DROP POLICY IF EXISTS "Merchants can delete activities" ON crm_activities;
DROP POLICY IF EXISTS "Merchants can update activities" ON crm_activities;
DROP POLICY IF EXISTS "Merchants can view lead activities" ON crm_activities;

CREATE POLICY "Merchants can create activities"
  ON crm_activities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = crm_activities.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can delete activities"
  ON crm_activities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = crm_activities.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update activities"
  ON crm_activities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = crm_activities.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view lead activities"
  ON crm_activities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = crm_activities.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for crm_tasks
DROP POLICY IF EXISTS "Merchants can create tasks" ON crm_tasks;
DROP POLICY IF EXISTS "Merchants can delete tasks" ON crm_tasks;
DROP POLICY IF EXISTS "Merchants can update tasks" ON crm_tasks;
DROP POLICY IF EXISTS "Merchants can view tasks" ON crm_tasks;

CREATE POLICY "Merchants can create tasks"
  ON crm_tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = crm_tasks.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can delete tasks"
  ON crm_tasks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = crm_tasks.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update tasks"
  ON crm_tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = crm_tasks.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view tasks"
  ON crm_tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = crm_tasks.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for customer_segments
DROP POLICY IF EXISTS "Merchants can create segments" ON customer_segments;
DROP POLICY IF EXISTS "Merchants can delete their own segments" ON customer_segments;
DROP POLICY IF EXISTS "Merchants can update their own segments" ON customer_segments;
DROP POLICY IF EXISTS "Merchants can view their own segments" ON customer_segments;

CREATE POLICY "Merchants can create segments"
  ON customer_segments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = customer_segments.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can delete their own segments"
  ON customer_segments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = customer_segments.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update their own segments"
  ON customer_segments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = customer_segments.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view their own segments"
  ON customer_segments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = customer_segments.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for crm_subscriptions
DROP POLICY IF EXISTS "Merchants can update their subscription" ON crm_subscriptions;
DROP POLICY IF EXISTS "Merchants can view their subscription" ON crm_subscriptions;

CREATE POLICY "Merchants can update their subscription"
  ON crm_subscriptions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = crm_subscriptions.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view their subscription"
  ON crm_subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = crm_subscriptions.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for marketing_campaigns
DROP POLICY IF EXISTS "Merchants can create campaigns" ON marketing_campaigns;
DROP POLICY IF EXISTS "Merchants can delete their own campaigns" ON marketing_campaigns;
DROP POLICY IF EXISTS "Merchants can update their own campaigns" ON marketing_campaigns;
DROP POLICY IF EXISTS "Merchants can view their own campaigns" ON marketing_campaigns;

CREATE POLICY "Merchants can create campaigns"
  ON marketing_campaigns FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = marketing_campaigns.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can delete their own campaigns"
  ON marketing_campaigns FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = marketing_campaigns.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update their own campaigns"
  ON marketing_campaigns FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = marketing_campaigns.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view their own campaigns"
  ON marketing_campaigns FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = marketing_campaigns.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for campaign_recipients
DROP POLICY IF EXISTS "Customers can view campaigns sent to them" ON campaign_recipients;
DROP POLICY IF EXISTS "Merchants can view recipients of their campaigns" ON campaign_recipients;

CREATE POLICY "Customers can view campaigns sent to them"
  ON campaign_recipients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = campaign_recipients.customer_id
      AND customers.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view recipients of their campaigns"
  ON campaign_recipients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM marketing_campaigns mc
      JOIN merchants m ON m.id = mc.merchant_id
      WHERE mc.id = campaign_recipients.campaign_id
      AND m.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for email_templates
DROP POLICY IF EXISTS "Merchants can create templates" ON email_templates;
DROP POLICY IF EXISTS "Merchants can delete their own templates" ON email_templates;
DROP POLICY IF EXISTS "Merchants can update their own templates" ON email_templates;
DROP POLICY IF EXISTS "Merchants can view their own templates" ON email_templates;

CREATE POLICY "Merchants can create templates"
  ON email_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = email_templates.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can delete their own templates"
  ON email_templates FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = email_templates.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update their own templates"
  ON email_templates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = email_templates.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view their own templates"
  ON email_templates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = email_templates.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for deal_performance_stats
DROP POLICY IF EXISTS "Merchants can view their deal performance" ON deal_performance_stats;
CREATE POLICY "Merchants can view their deal performance"
  ON deal_performance_stats FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deals d
      JOIN merchants m ON m.id = d.merchant_id
      WHERE d.id = deal_performance_stats.deal_id
      AND m.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for deal_impressions
DROP POLICY IF EXISTS "Merchants can view their deal impressions" ON deal_impressions;
CREATE POLICY "Merchants can view their deal impressions"
  ON deal_impressions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deals d
      JOIN merchants m ON m.id = d.merchant_id
      WHERE d.id = deal_impressions.deal_id
      AND m.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for deal_clicks
DROP POLICY IF EXISTS "Merchants can view their deal clicks" ON deal_clicks;
CREATE POLICY "Merchants can view their deal clicks"
  ON deal_clicks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deals d
      JOIN merchants m ON m.id = d.merchant_id
      WHERE d.id = deal_clicks.deal_id
      AND m.user_id = (select auth.uid())
    )
  );

-- Drop and recreate policies for merchant_ad_costs
DROP POLICY IF EXISTS "Merchants can insert their ad costs" ON merchant_ad_costs;
DROP POLICY IF EXISTS "Merchants can update their ad costs" ON merchant_ad_costs;
DROP POLICY IF EXISTS "Merchants can view their ad costs" ON merchant_ad_costs;

CREATE POLICY "Merchants can insert their ad costs"
  ON merchant_ad_costs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_ad_costs.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can update their ad costs"
  ON merchant_ad_costs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_ad_costs.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Merchants can view their ad costs"
  ON merchant_ad_costs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_ad_costs.merchant_id
      AND merchants.user_id = (select auth.uid())
    )
  );
