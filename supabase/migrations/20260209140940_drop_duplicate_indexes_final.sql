/*
  # Drop Duplicate Indexes

  This migration drops duplicate indexes identified in the security audit.
  
  ## Indexes Dropped:
  - idx_course_lessons_module (duplicate of idx_course_lessons_module_id)
  - idx_course_modules_course (duplicate of idx_course_modules_course_id)
*/

-- Drop duplicate indexes
DROP INDEX IF EXISTS idx_course_lessons_module;
DROP INDEX IF EXISTS idx_course_modules_course;
