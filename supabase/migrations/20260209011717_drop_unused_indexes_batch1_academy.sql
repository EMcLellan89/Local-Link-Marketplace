/*
  # Drop Unused Indexes - Batch 1: Academy Tables
  
  This migration drops indexes that have never been scanned according to pg_stat_user_indexes.
  These indexes consume storage and slow down writes without providing any query benefit.
  
  ## Indexes Dropped
  - Academy course and enrollment indexes with 0 scans
  
  ## Impact
  - Reduces storage usage
  - Improves write performance
  - No impact on read performance (indexes were never used)
*/

-- academy_certifications
DROP INDEX IF EXISTS idx_academy_certifications_user_course;
DROP INDEX IF EXISTS idx_academy_certifications_user_id;

-- academy_courses
DROP INDEX IF EXISTS idx_academy_courses_instructor_id;
DROP INDEX IF EXISTS idx_academy_courses_target_audience;

-- academy_enrollments
DROP INDEX IF EXISTS idx_academy_enrollments_course_user;
DROP INDEX IF EXISTS idx_academy_enrollments_user_id;

-- academy_lesson_assets
DROP INDEX IF EXISTS idx_academy_lesson_assets_lesson_id;

-- academy_lessons
DROP INDEX IF EXISTS idx_academy_lessons_module_id;
DROP INDEX IF EXISTS idx_academy_lessons_order_idx;

-- academy_modules
DROP INDEX IF EXISTS idx_academy_modules_course_id;
DROP INDEX IF EXISTS idx_academy_modules_order_idx;

-- academy_progress
DROP INDEX IF EXISTS idx_academy_progress_user_id;
DROP INDEX IF EXISTS idx_academy_progress_user_lesson;

-- academy_quiz_attempts
DROP INDEX IF EXISTS idx_academy_quiz_attempts_quiz_user;
DROP INDEX IF EXISTS idx_academy_quiz_attempts_user_id;

-- academy_quizzes
DROP INDEX IF EXISTS idx_academy_quizzes_lesson_id;
