/*
  # Add Local-Link CRM Dashboard Functions

  1. Functions
    - `get_ll_crm_dashboard_stats` - Returns aggregate stats for CRM dashboard
    - `get_ll_crm_recent_activities` - Returns recent activity timeline
    - `get_ll_crm_pipeline_summary` - Returns deal pipeline summary

  2. Changes
    - Helper functions for CRM dashboard display
    - Performance optimized queries
    - Proper security context
*/

-- Function to get dashboard stats
CREATE OR REPLACE FUNCTION get_ll_crm_dashboard_stats(merchant_id_input UUID)
RETURNS TABLE(
  total_contacts BIGINT,
  total_deals BIGINT,
  total_deal_value BIGINT,
  won_deals BIGINT,
  activities_today BIGINT,
  overdue_tasks BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM ll_crm_contacts WHERE merchant_id = merchant_id_input)::BIGINT,
    (SELECT COUNT(*) FROM ll_crm_deals WHERE merchant_id = merchant_id_input AND stage != 'closed_won' AND stage != 'closed_lost')::BIGINT,
    (SELECT COALESCE(SUM(amount), 0) FROM ll_crm_deals WHERE merchant_id = merchant_id_input AND stage != 'closed_lost')::BIGINT,
    (SELECT COUNT(*) FROM ll_crm_deals WHERE merchant_id = merchant_id_input AND stage = 'closed_won')::BIGINT,
    (SELECT COUNT(*) FROM ll_crm_activities WHERE merchant_id = merchant_id_input AND due_date::DATE = CURRENT_DATE)::BIGINT,
    (SELECT COUNT(*) FROM ll_crm_activities WHERE merchant_id = merchant_id_input AND due_date < NOW() AND is_completed = FALSE)::BIGINT;
END;
$$;

-- Function to get recent activities
CREATE OR REPLACE FUNCTION get_ll_crm_recent_activities(
  merchant_id_input UUID,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE(
  id UUID,
  activity_type TEXT,
  subject TEXT,
  description TEXT,
  due_date TIMESTAMPTZ,
  is_completed BOOLEAN,
  contact_name TEXT,
  deal_name TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.activity_type,
    a.subject,
    a.description,
    a.due_date,
    a.is_completed,
    COALESCE(c.first_name || ' ' || c.last_name, c.email) as contact_name,
    d.deal_name,
    a.created_at
  FROM ll_crm_activities a
  LEFT JOIN ll_crm_contacts c ON a.contact_id = c.id
  LEFT JOIN ll_crm_deals d ON a.deal_id = d.id
  WHERE a.merchant_id = merchant_id_input
  ORDER BY a.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Function to get pipeline summary
CREATE OR REPLACE FUNCTION get_ll_crm_pipeline_summary(merchant_id_input UUID)
RETURNS TABLE(
  pipeline_id UUID,
  pipeline_name TEXT,
  stage_name TEXT,
  deal_count BIGINT,
  total_value BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id as pipeline_id,
    p.pipeline_name,
    d.stage,
    COUNT(d.id)::BIGINT as deal_count,
    COALESCE(SUM(d.amount), 0)::BIGINT as total_value
  FROM ll_crm_pipelines p
  LEFT JOIN ll_crm_deals d ON d.pipeline_id = p.id AND d.stage NOT IN ('closed_won', 'closed_lost')
  WHERE p.merchant_id = merchant_id_input AND p.is_active = true
  GROUP BY p.id, p.pipeline_name, d.stage
  ORDER BY p.display_order, d.stage;
END;
$$;

-- Function to search contacts
CREATE OR REPLACE FUNCTION search_ll_crm_contacts(
  merchant_id_input UUID,
  search_query TEXT
)
RETURNS TABLE(
  id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  lead_status TEXT,
  lead_score INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.first_name,
    c.last_name,
    c.email,
    c.phone,
    c.company_name,
    c.lead_status,
    c.lead_score
  FROM ll_crm_contacts c
  WHERE c.merchant_id = merchant_id_input
    AND (
      c.first_name ILIKE '%' || search_query || '%'
      OR c.last_name ILIKE '%' || search_query || '%'
      OR c.email ILIKE '%' || search_query || '%'
      OR c.company_name ILIKE '%' || search_query || '%'
      OR c.phone ILIKE '%' || search_query || '%'
    )
  ORDER BY c.lead_score DESC, c.created_at DESC
  LIMIT 50;
END;
$$;

-- Function to get contact details with related data
CREATE OR REPLACE FUNCTION get_ll_crm_contact_details(contact_id_input UUID)
RETURNS TABLE(
  id UUID,
  merchant_id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  job_title TEXT,
  lead_status TEXT,
  lead_score INTEGER,
  tags TEXT[],
  lifetime_value NUMERIC,
  last_contacted_at TIMESTAMPTZ,
  deal_count BIGINT,
  activity_count BIGINT,
  open_deal_value BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.merchant_id,
    c.first_name,
    c.last_name,
    c.email,
    c.phone,
    c.company_name,
    c.job_title,
    c.lead_status,
    c.lead_score,
    c.tags,
    c.lifetime_value,
    c.last_contacted_at,
    (SELECT COUNT(*) FROM ll_crm_deals WHERE contact_id = c.id)::BIGINT,
    (SELECT COUNT(*) FROM ll_crm_activities WHERE contact_id = c.id)::BIGINT,
    (SELECT COALESCE(SUM(amount), 0) FROM ll_crm_deals WHERE contact_id = c.id AND stage NOT IN ('closed_won', 'closed_lost'))::BIGINT
  FROM ll_crm_contacts c
  WHERE c.id = contact_id_input;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ll_crm_activities_due_date ON ll_crm_activities(merchant_id, due_date);
CREATE INDEX IF NOT EXISTS idx_ll_crm_activities_completed ON ll_crm_activities(merchant_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_ll_crm_deals_stage ON ll_crm_deals(merchant_id, stage);
CREATE INDEX IF NOT EXISTS idx_ll_crm_contacts_lead_status ON ll_crm_contacts(merchant_id, lead_status);
CREATE INDEX IF NOT EXISTS idx_ll_crm_contacts_lead_score ON ll_crm_contacts(merchant_id, lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_ll_crm_contacts_search ON ll_crm_contacts(merchant_id, first_name, last_name, email, company_name);
