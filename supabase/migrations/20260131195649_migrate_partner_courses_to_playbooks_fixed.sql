/*
  # Migrate Partner Courses to Playbooks (Fixed)

  1. Migration Steps
    - Copy all partner courses to partner_playbooks
    - Copy modules to partner_playbook_modules
    - Copy lessons to partner_playbook_lessons
    - Keep original data for backward compatibility
    
  2. Categorization
    - Core systems
    - Sales skills
    - Content creation
    - Industry-specific
    - Certifications
*/

-- Migrate partner courses to playbooks
INSERT INTO partner_playbooks (
  id,
  slug,
  title,
  subtitle,
  description,
  thumbnail_url,
  category,
  difficulty_level,
  estimated_duration_minutes,
  is_published,
  display_order,
  created_at,
  updated_at
)
SELECT 
  id,
  slug,
  title,
  subtitle,
  description,
  thumbnail_url,
  CASE 
    WHEN slug IN ('partner-accelerator', 'selling-recurring-revenue', 'marketplace-deal-selling-partner', 'local-service-side-hustle-partner') 
      THEN 'core-systems'
    WHEN slug IN ('local-customers-autopilot-partner', 'selling-services-no-cold-calling-partner', 'bundle-services-partner', 'sell-crm-trades-partner')
      THEN 'sales-skills'
    WHEN slug IN ('ugc-from-home-partner', 'canva-money-partner', 'ai-marketing-automation-partner', 'ai-marketing-small-business-partner', 'ai-review-reputation-partner')
      THEN 'content-digital'
    WHEN slug IN ('marketing-for-trades-partner', 'pet-businesses-partner', 'care-coordination-partner')
      THEN 'industry-specific'
    WHEN slug IN ('ugc-creator-certification', 'local-link-certified-associate', 'certified-business-coach')
      THEN 'certifications'
    ELSE 'general'
  END as category,
  CASE 
    WHEN slug LIKE '%certification%' OR slug LIKE '%certified%' THEN 'advanced'
    WHEN slug LIKE '%accelerator%' THEN 'intermediate'
    ELSE 'beginner'
  END as difficulty_level,
  120 as estimated_duration_minutes,
  is_published,
  0 as display_order,
  created_at,
  updated_at
FROM academy_courses
WHERE target_audience = 'partner'
ON CONFLICT (id) DO NOTHING;

-- Migrate modules
INSERT INTO partner_playbook_modules (
  id,
  playbook_id,
  title,
  description,
  display_order,
  created_at,
  updated_at
)
SELECT 
  m.id,
  m.course_id as playbook_id,
  m.title,
  m.description,
  m.display_order,
  m.created_at,
  m.updated_at
FROM academy_modules m
JOIN academy_courses c ON c.id = m.course_id
WHERE c.target_audience = 'partner'
ON CONFLICT (id) DO NOTHING;

-- Migrate lessons
INSERT INTO partner_playbook_lessons (
  id,
  module_id,
  title,
  content,
  video_url,
  video_duration_seconds,
  display_order,
  lesson_type,
  created_at,
  updated_at
)
SELECT 
  l.id,
  l.module_id,
  l.title,
  COALESCE(l.content_markdown, l.article_content) as content,
  l.video_url,
  l.video_duration_seconds,
  l.display_order,
  COALESCE(l.content_type::text, 'video') as lesson_type,
  l.created_at,
  l.updated_at
FROM academy_lessons l
JOIN academy_modules m ON m.id = l.module_id
JOIN academy_courses c ON c.id = m.course_id
WHERE c.target_audience = 'partner'
ON CONFLICT (id) DO NOTHING;
