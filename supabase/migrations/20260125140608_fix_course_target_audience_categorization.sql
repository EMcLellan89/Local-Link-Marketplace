/*
  # Fix Course Target Audience Categorization
  
  Update any courses with non-standard target_audience values
  Ensure all courses are properly aligned with merchant/partner/both
*/

-- Update UGC From Home course to be for both (creators sell to merchants)
UPDATE courses
SET target_audience = 'both'
WHERE slug = 'ugc-from-home' AND target_audience = 'creator';

-- Verify no orphan target audiences exist
-- All courses should be merchant, partner, or both
UPDATE courses
SET target_audience = 'both'
WHERE target_audience NOT IN ('merchant', 'partner', 'both')
  AND is_published = true;
