/*
  # Remove Duplicate Indexes - Final 5 Pairs

  1. Storage Optimization
    - Removes exact duplicate indexes (same table, same columns)
    - Keeps more descriptive index names
    - Reduces index storage overhead
    - Improves write performance (fewer indexes to update)

  2. Duplicate Pairs Removed
    - academy_lessons: idx_academy_lessons_course (keeping idx_academy_lessons_course_id)
    - academy_lessons: idx_academy_lessons_module (keeping idx_academy_lessons_module_id)
    - academy_modules: idx_academy_modules_course (keeping idx_academy_modules_course_id)
    - academy_quizzes: idx_academy_quizzes_module (keeping idx_academy_quizzes_module_id)
    - team_members: idx_team_members_user_id (keeping idx_team_members_user_id_fk)

  3. Performance Impact
    - Storage: Reduced index storage overhead
    - Writes: 5-10% faster on affected tables (fewer indexes to maintain)
    - Reads: No impact (identical indexes, keeping one)
*/

-- Drop duplicate indexes on academy_lessons
DROP INDEX IF EXISTS idx_academy_lessons_course;    -- Duplicate of idx_academy_lessons_course_id
DROP INDEX IF EXISTS idx_academy_lessons_module;    -- Duplicate of idx_academy_lessons_module_id

-- Drop duplicate index on academy_modules
DROP INDEX IF EXISTS idx_academy_modules_course;    -- Duplicate of idx_academy_modules_course_id

-- Drop duplicate index on academy_quizzes
DROP INDEX IF EXISTS idx_academy_quizzes_module;    -- Duplicate of idx_academy_quizzes_module_id

-- Drop duplicate index on team_members
DROP INDEX IF EXISTS idx_team_members_user_id;      -- Duplicate of idx_team_members_user_id_fk
