/*
  # Create Partner Playbooks System (Separate from Courses)

  1. New Tables
    - `partner_playbooks` - Main playbook catalog (separate from academy_courses)
    - `partner_playbook_modules` - Modules within playbooks
    - `partner_playbook_lessons` - Individual lessons within modules
    - `partner_playbook_progress` - Track partner progress through lessons
    - `partner_playbook_completions` - Track completed playbooks with certificates
    
  2. Key Differences from Courses
    - Playbooks are EXECUTION-FOCUSED (not education)
    - All playbooks are FREE for partners
    - Action-oriented content (scripts, systems, selling)
    - No pricing, no tiers, no checkout
    
  3. Security
    - Enable RLS on all tables
    - Partners can view all playbooks (free access)
    - Partners can track their own progress
    - Admin can manage playbooks
*/

-- Create partner_playbooks table
CREATE TABLE IF NOT EXISTS partner_playbooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text,
  description text,
  thumbnail_url text,
  category text NOT NULL DEFAULT 'general',
  difficulty_level text DEFAULT 'beginner',
  estimated_duration_minutes integer DEFAULT 60,
  is_published boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partner_playbooks_slug ON partner_playbooks(slug);
CREATE INDEX IF NOT EXISTS idx_partner_playbooks_category ON partner_playbooks(category);
CREATE INDEX IF NOT EXISTS idx_partner_playbooks_published ON partner_playbooks(is_published);

-- Create partner_playbook_modules table
CREATE TABLE IF NOT EXISTS partner_playbook_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playbook_id uuid NOT NULL REFERENCES partner_playbooks(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partner_playbook_modules_playbook_id ON partner_playbook_modules(playbook_id);
CREATE INDEX IF NOT EXISTS idx_partner_playbook_modules_order ON partner_playbook_modules(playbook_id, display_order);

-- Create partner_playbook_lessons table
CREATE TABLE IF NOT EXISTS partner_playbook_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES partner_playbook_modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  video_url text,
  video_duration_seconds integer,
  display_order integer NOT NULL DEFAULT 0,
  lesson_type text DEFAULT 'video',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partner_playbook_lessons_module_id ON partner_playbook_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_partner_playbook_lessons_order ON partner_playbook_lessons(module_id, display_order);

-- Create partner_playbook_progress table
CREATE TABLE IF NOT EXISTS partner_playbook_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES partner_playbook_lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_partner_playbook_progress_user_id ON partner_playbook_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_playbook_progress_lesson_id ON partner_playbook_progress(lesson_id);

-- Create partner_playbook_completions table
CREATE TABLE IF NOT EXISTS partner_playbook_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  playbook_id uuid NOT NULL REFERENCES partner_playbooks(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  certificate_url text,
  UNIQUE(user_id, playbook_id)
);

CREATE INDEX IF NOT EXISTS idx_partner_playbook_completions_user_id ON partner_playbook_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_playbook_completions_playbook_id ON partner_playbook_completions(playbook_id);

-- Enable RLS
ALTER TABLE partner_playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_playbook_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_playbook_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_playbook_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_playbook_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Playbooks (all partners can view)
CREATE POLICY "Partners can view published playbooks"
  ON partner_playbooks FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Admins can manage playbooks"
  ON partner_playbooks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies: Modules (all partners can view)
CREATE POLICY "Partners can view playbook modules"
  ON partner_playbook_modules FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partner_playbooks
      WHERE partner_playbooks.id = partner_playbook_modules.playbook_id
      AND partner_playbooks.is_published = true
    )
  );

CREATE POLICY "Admins can manage modules"
  ON partner_playbook_modules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies: Lessons (all partners can view)
CREATE POLICY "Partners can view playbook lessons"
  ON partner_playbook_lessons FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partner_playbook_modules m
      JOIN partner_playbooks p ON p.id = m.playbook_id
      WHERE m.id = partner_playbook_lessons.module_id
      AND p.is_published = true
    )
  );

CREATE POLICY "Admins can manage lessons"
  ON partner_playbook_lessons FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies: Progress (partners own their progress)
CREATE POLICY "Partners can view own progress"
  ON partner_playbook_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Partners can update own progress"
  ON partner_playbook_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Partners can modify own progress"
  ON partner_playbook_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies: Completions (partners own their completions)
CREATE POLICY "Partners can view own completions"
  ON partner_playbook_completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Partners can record completions"
  ON partner_playbook_completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all completions"
  ON partner_playbook_completions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
