/*
  # Clean Duplicate UGC Modules

  Removes old modules 7 and 8 from UGC course (they're from old seeding)
  The new seeding created 6 modules as intended.
*/

-- Remove old modules 7 and 8 from UGC From Home
DELETE FROM public.course_lessons
WHERE module_id IN (
  SELECT id FROM public.course_modules
  WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home')
  AND module_index > 6
);

DELETE FROM public.course_modules
WHERE course_id = (SELECT id FROM courses WHERE slug = 'ugc-from-home')
AND module_index > 6;
