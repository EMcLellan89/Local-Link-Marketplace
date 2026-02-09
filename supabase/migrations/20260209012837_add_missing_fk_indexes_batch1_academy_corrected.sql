/*
  # Add Missing Foreign Key Indexes - Batch 1: Academy Tables (Corrected)
  
  1. Performance Improvement
    - Add indexes for all unindexed foreign key columns in academy tables
    - Based on actual schema validation
  
  2. Tables Updated
    - academy_certifications: course_id, user_id
    - academy_enrollments: course_id, user_id
    - academy_progress: course_id, lesson_id, user_id (NO enrollment_id in schema)
    - academy_quiz_attempts: course_id, module_id, user_id (NO enrollment_id in schema)
*/

-- Academy tables
CREATE INDEX IF NOT EXISTS idx_academy_certifications_course_id ON academy_certifications(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_certifications_user_id ON academy_certifications(user_id);

CREATE INDEX IF NOT EXISTS idx_academy_enrollments_course_id ON academy_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_enrollments_user_id ON academy_enrollments(user_id);

CREATE INDEX IF NOT EXISTS idx_academy_progress_course_id ON academy_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_progress_lesson_id ON academy_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_academy_progress_user_id ON academy_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_course_id ON academy_quiz_attempts(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_module_id ON academy_quiz_attempts(module_id);
CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_user_id ON academy_quiz_attempts(user_id);