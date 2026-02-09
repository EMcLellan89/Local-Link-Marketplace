/*
  # Drop Duplicate Constraint on Enrollments Table

  1. Issue
    - Table `enrollments` has two identical UNIQUE constraints:
      * enrollments_user_course_unique
      * enrollments_user_id_course_id_key
    - Both enforce UNIQUE (user_id, course_id)
    - Each constraint creates its own backing index

  2. Changes
    - Drop enrollments_user_course_unique constraint
    - Keep enrollments_user_id_course_id_key (follows PostgreSQL naming convention)
    
  3. Rationale
    - Duplicate constraints waste storage and maintenance overhead
    - Dropping the constraint automatically drops its backing index
*/

ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_user_course_unique;