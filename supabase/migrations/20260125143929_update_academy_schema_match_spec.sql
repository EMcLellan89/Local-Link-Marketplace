/*
  # Update Academy Schema to Match Specification

  1. Schema Updates
    - Rename/add columns to match exact spec
    - Update enums if needed
    - Ensure all fields match the pasted schema

  2. Key Changes
    - Use `audience` instead of `target_audience`
    - Use `content_markdown` instead of `transcript`
    - Use `sort_order` instead of `display_order`
    - Add `is_free` column (always true)
    - Add `auth_user_id` for consistency

  3. NO breaking changes to existing data
*/

-- Ensure academy_audience enum has all needed values
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'academy_audience') THEN
    CREATE TYPE academy_audience AS ENUM ('customer','merchant','partner','team','admin','public');
  END IF;
END $$;

-- Update academy_courses table
DO $$ BEGIN
  -- Add is_free if not exists (locked to true per spec)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_courses' AND column_name = 'is_free') THEN
    ALTER TABLE academy_courses ADD COLUMN is_free boolean NOT NULL DEFAULT true;
  END IF;

  -- Add audience column if target_audience exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_courses' AND column_name = 'target_audience') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_courses' AND column_name = 'audience') THEN
    ALTER TABLE academy_courses ADD COLUMN audience academy_audience;
    UPDATE academy_courses SET audience = target_audience::text::academy_audience WHERE audience IS NULL;
    ALTER TABLE academy_courses ALTER COLUMN audience SET NOT NULL;
    ALTER TABLE academy_courses ALTER COLUMN audience SET DEFAULT 'merchant';
  END IF;

  -- Add sort_order if display_order exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_courses' AND column_name = 'display_order')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_courses' AND column_name = 'sort_order') THEN
    ALTER TABLE academy_courses ADD COLUMN sort_order integer;
    UPDATE academy_courses SET sort_order = display_order WHERE sort_order IS NULL;
    ALTER TABLE academy_courses ALTER COLUMN sort_order SET NOT NULL;
    ALTER TABLE academy_courses ALTER COLUMN sort_order SET DEFAULT 100;
  END IF;

  -- Rename estimated_hours to est_minutes if needed
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_courses' AND column_name = 'estimated_hours')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_courses' AND column_name = 'est_minutes') THEN
    ALTER TABLE academy_courses RENAME COLUMN estimated_hours TO est_minutes;
  END IF;
END $$;

-- Update academy_modules table
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_modules' AND column_name = 'display_order')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_modules' AND column_name = 'sort_order') THEN
    ALTER TABLE academy_modules ADD COLUMN sort_order integer;
    UPDATE academy_modules SET sort_order = display_order WHERE sort_order IS NULL;
    ALTER TABLE academy_modules ALTER COLUMN sort_order SET NOT NULL;
    ALTER TABLE academy_modules ALTER COLUMN sort_order SET DEFAULT 100;
  END IF;
END $$;

-- Update academy_lessons table
DO $$ BEGIN
  -- Add content_markdown if transcript exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_lessons' AND column_name = 'transcript')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_lessons' AND column_name = 'content_markdown') THEN
    ALTER TABLE academy_lessons ADD COLUMN content_markdown text;
    UPDATE academy_lessons SET content_markdown = transcript WHERE content_markdown IS NULL;
    ALTER TABLE academy_lessons ALTER COLUMN content_markdown SET NOT NULL;
    ALTER TABLE academy_lessons ALTER COLUMN content_markdown SET DEFAULT '';
  END IF;

  -- Add summary if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_lessons' AND column_name = 'summary') THEN
    ALTER TABLE academy_lessons ADD COLUMN summary text;
  END IF;

  -- Add sort_order if display_order exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_lessons' AND column_name = 'display_order')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_lessons' AND column_name = 'sort_order') THEN
    ALTER TABLE academy_lessons ADD COLUMN sort_order integer;
    UPDATE academy_lessons SET sort_order = display_order WHERE sort_order IS NULL;
    ALTER TABLE academy_lessons ALTER COLUMN sort_order SET NOT NULL;
    ALTER TABLE academy_lessons ALTER COLUMN sort_order SET DEFAULT 100;
  END IF;

  -- Rename video_duration_seconds to est_minutes if needed
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_lessons' AND column_name = 'video_duration_seconds')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_lessons' AND column_name = 'est_minutes') THEN
    ALTER TABLE academy_lessons ADD COLUMN est_minutes integer;
    UPDATE academy_lessons SET est_minutes = ROUND(video_duration_seconds::numeric / 60) WHERE est_minutes IS NULL AND video_duration_seconds IS NOT NULL;
    UPDATE academy_lessons SET est_minutes = 10 WHERE est_minutes IS NULL;
    ALTER TABLE academy_lessons ALTER COLUMN est_minutes SET NOT NULL;
    ALTER TABLE academy_lessons ALTER COLUMN est_minutes SET DEFAULT 10;
  END IF;
END $$;

-- Update academy_lesson_assets table
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_lesson_assets' AND column_name = 'display_order')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_lesson_assets' AND column_name = 'sort_order') THEN
    ALTER TABLE academy_lesson_assets ADD COLUMN sort_order integer;
    UPDATE academy_lesson_assets SET sort_order = display_order WHERE sort_order IS NULL;
    ALTER TABLE academy_lesson_assets ALTER COLUMN sort_order SET NOT NULL;
    ALTER TABLE academy_lesson_assets ALTER COLUMN sort_order SET DEFAULT 100;
  END IF;

  -- Rename file_url to url if needed
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_lesson_assets' AND column_name = 'file_url')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_lesson_assets' AND column_name = 'url') THEN
    ALTER TABLE academy_lesson_assets RENAME COLUMN file_url TO url;
  END IF;

  -- Add notes if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_lesson_assets' AND column_name = 'notes') THEN
    ALTER TABLE academy_lesson_assets ADD COLUMN notes text;
  END IF;
END $$;

-- Update academy_enrollments table - add started_at, rename columns
DO $$ BEGIN
  -- Rename auth_user_id if needed for consistency
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_enrollments' AND column_name = 'started_at') THEN
    ALTER TABLE academy_enrollments ADD COLUMN started_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Update academy_progress table - rename columns
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_progress' AND column_name = 'seconds_watched') 
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_progress' AND column_name = 'watched_duration_seconds') THEN
    ALTER TABLE academy_progress RENAME COLUMN watched_duration_seconds TO seconds_watched;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academy_progress' AND column_name = 'notes') THEN
    ALTER TABLE academy_progress ADD COLUMN notes text;
  END IF;
END $$;

-- Add comment explaining is_free lock
COMMENT ON COLUMN academy_courses.is_free IS 'LOCKED: All Academy courses are FREE. No pricing, but can gate access based on role/tier.';