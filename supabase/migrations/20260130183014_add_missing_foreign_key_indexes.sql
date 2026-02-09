/*
  # Add Missing Foreign Key Indexes

  1. Performance Improvements
    - Add index on academy_quiz_attempts.course_id
    - Add index on academy_quizzes.course_id
    - Add index on badge_audit_log.badge_id
    - Add index on milestone_badge_audit_log.badge_id

  2. Impact
    - Improves query performance for foreign key lookups
    - Speeds up JOIN operations
    - Reduces database load
*/

-- Add missing foreign key indexes
CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_course_id 
  ON public.academy_quiz_attempts(course_id);

CREATE INDEX IF NOT EXISTS idx_academy_quizzes_course_id 
  ON public.academy_quizzes(course_id);

CREATE INDEX IF NOT EXISTS idx_badge_audit_log_badge_id 
  ON public.badge_audit_log(badge_id);

CREATE INDEX IF NOT EXISTS idx_milestone_badge_audit_log_badge_id 
  ON public.milestone_badge_audit_log(badge_id);
