/*
  # Fix Security Definer Views

  ## Security Issues Fixed
  Removes SECURITY DEFINER property from 3 views to prevent privilege escalation:
  1. merchant_course_catalog - Changed to SECURITY INVOKER
  2. v_org_access - Changed to SECURITY INVOKER
  3. partner_leaderboard_view - Changed to SECURITY INVOKER

  ## Impact
  Views will now run with the privileges of the user executing the query,
  not the privileges of the view owner. This is more secure and follows
  the principle of least privilege.
*/

-- Fix merchant_course_catalog view
DROP VIEW IF EXISTS merchant_course_catalog CASCADE;
CREATE VIEW merchant_course_catalog
WITH (security_invoker = true)
AS
SELECT 
  c.id AS course_id,
  c.slug AS course_slug,
  c.title AS course_title,
  c.subtitle,
  c.description,
  c.image_url,
  c.target_audience,
  c.is_published,
  cp.price_usd,
  cp.compare_at_price_usd,
  cp.is_free,
  cp.stripe_price_id,
  cp.stripe_product_id,
  cw.total_duration_minutes,
  cw.includes_workbook,
  cw.includes_templates,
  cw.certification_available,
  mp.id AS product_id,
  mp.slug AS product_slug,
  mp.name AS product_name,
  (SELECT count(*) FROM course_modules WHERE course_modules.course_id = c.id) AS module_count,
  (SELECT count(*) FROM course_lessons cl JOIN course_modules cm ON cl.module_id = cm.id WHERE cm.course_id = c.id) AS lesson_count
FROM courses c
LEFT JOIN course_pricing cp ON cp.course_id = c.id
LEFT JOIN course_webinar_content cw ON cw.course_id = c.id
LEFT JOIN product_course_map pcm ON pcm.course_slug = c.slug
LEFT JOIN marketplace_products mp ON mp.slug = pcm.product_slug
WHERE c.target_audience = ANY (ARRAY['merchant'::text, 'both'::text])
ORDER BY cp.price_usd DESC, c.title;

-- Fix v_org_access view
DROP VIEW IF EXISTS v_org_access CASCADE;
CREATE VIEW v_org_access
WITH (security_invoker = true)
AS
SELECT 
  o.id AS org_id,
  o.name AS org_name,
  o.type AS org_type,
  s.status AS subscription_status,
  p.name AS base_plan_name,
  p.price_monthly AS base_price_monthly,
  ofe.effective_features,
  ofe.updated_at AS features_updated_at
FROM organizations o
LEFT JOIN subscriptions s ON s.org_id = o.id
LEFT JOIN plans p ON p.id = s.plan_id
LEFT JOIN org_features ofe ON ofe.org_id = o.id;

-- Fix partner_leaderboard_view
DROP VIEW IF EXISTS partner_leaderboard_view CASCADE;
CREATE VIEW partner_leaderboard_view
WITH (security_invoker = true)
AS
SELECT 
  p.id,
  p.system_id,
  p.company_name,
  p.primary_contact,
  ps.current_streak,
  ps.longest_streak,
  ps.total_active_days,
  COALESCE(sum(pal.points_earned), 0) AS total_points,
  COALESCE(sum(CASE WHEN pal.created_at >= (now() - '7 days'::interval) THEN pal.points_earned ELSE 0 END), 0) AS points_last_7_days,
  COALESCE(sum(CASE WHEN pal.created_at >= (now() - '30 days'::interval) THEN pal.points_earned ELSE 0 END), 0) AS points_last_30_days,
  count(DISTINCT CASE WHEN pal.activity_type = 'merchant_signed' THEN pal.id ELSE NULL END) AS total_merchants_signed,
  count(DISTINCT CASE WHEN pal.activity_type = 'sale_made' THEN pal.id ELSE NULL END) AS total_sales,
  pce.status AS challenge_status,
  pce.days_completed AS challenge_days_completed,
  rank() OVER (ORDER BY COALESCE(sum(pal.points_earned), 0) DESC) AS overall_rank,
  rank() OVER (ORDER BY COALESCE(sum(CASE WHEN pal.created_at >= (now() - '30 days'::interval) THEN pal.points_earned ELSE 0 END), 0) DESC) AS monthly_rank
FROM partners p
LEFT JOIN partner_streaks ps ON ps.partner_id = p.id
LEFT JOIN partner_activity_log pal ON pal.partner_id = p.id
LEFT JOIN partner_challenge_enrollments pce ON pce.partner_id = p.id AND pce.status = 'active'
WHERE p.status = 'Active'::partner_status
GROUP BY p.id, p.system_id, p.company_name, p.primary_contact, ps.current_streak, ps.longest_streak, ps.total_active_days, pce.status, pce.days_completed;