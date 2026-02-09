/*
  # Drop Unused Indexes - Batch 14: Sponsorship, Storylab, and Stripe Tables
  
  This migration continues dropping unused indexes.
  
  ## Indexes Dropped
  - Sponsorship and support indexes
  - Storylab business indexes
  - Stripe webhook indexes
  
  ## Impact
  - Reduces storage usage
  - Improves write performance
*/

-- sponsorships
DROP INDEX IF EXISTS idx_sponsorships_merchant_id;
DROP INDEX IF EXISTS idx_sponsorships_partner_id;

-- storylab_orders
DROP INDEX IF EXISTS idx_storylab_orders_partner_id;

-- storylab_statements
DROP INDEX IF EXISTS idx_storylab_statements_partner_id;

-- stripe_webhook_events
DROP INDEX IF EXISTS idx_stripe_webhook_events_event_type;

-- subscription_tiers
DROP INDEX IF EXISTS idx_subscription_tiers_merchant_id;

-- subscriptions
DROP INDEX IF EXISTS idx_subscriptions_customer_id;
DROP INDEX IF EXISTS idx_subscriptions_tier_id;

-- support_tickets
DROP INDEX IF EXISTS idx_support_tickets_assigned_to;
DROP INDEX IF EXISTS idx_support_tickets_customer_id;
DROP INDEX IF EXISTS idx_support_tickets_merchant_id;

-- survey_questions
DROP INDEX IF EXISTS idx_survey_questions_survey_id;

-- survey_responses
DROP INDEX IF EXISTS idx_survey_responses_customer_id;
DROP INDEX IF EXISTS idx_survey_responses_survey_id;

-- surveys
DROP INDEX IF EXISTS idx_surveys_merchant_id;

-- swipe_file_templates
DROP INDEX IF EXISTS idx_swipe_file_templates_category;

-- team_members
DROP INDEX IF EXISTS idx_team_members_manager_id;
DROP INDEX IF EXISTS idx_team_members_user_id;

-- team_milestones
DROP INDEX IF EXISTS idx_team_milestones_assigned_to;

-- team_projects
DROP INDEX IF EXISTS idx_team_projects_assigned_to;

-- territories
DROP INDEX IF EXISTS idx_territories_partner_id;

-- transaction_history
DROP INDEX IF EXISTS idx_transaction_history_merchant_id;
DROP INDEX IF EXISTS idx_transaction_history_partner_id;
