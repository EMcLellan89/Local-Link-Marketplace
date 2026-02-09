/*
  # Create StoryLab Core System

  1. New Tables
    - `story_projects`: User story projects (kids/teen/adult)
    - `story_books`: Individual books within projects
    - `story_pages`: Pages with text + illustration prompts
    - `story_assets`: Images, PDFs, covers stored in Supabase Storage
    
  2. Business Rules
    - Projects are private to users (RLS enforced)
    - Books track generation status and settings
    - Pages are ordered and linked to illustration assets
    - Assets reference storage bucket paths
    
  3. Safety
    - All tables have RLS enabled
    - Users can only access their own content
    - vertical_key tracks content type (kids/teen/adult)
*/

-- ============ STORYLAB CORE ============
CREATE TABLE IF NOT EXISTS public.story_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  business_key text NOT NULL DEFAULT 'storylab_kids',
  vertical_key text NOT NULL DEFAULT 'kids' CHECK (vertical_key IN ('kids','teen','adult')),
  title text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','generating','ready','archived')),
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.story_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.story_projects(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL,
  business_key text NOT NULL DEFAULT 'storylab_kids',
  vertical_key text NOT NULL DEFAULT 'kids' CHECK (vertical_key IN ('kids','teen','adult')),
  title text NOT NULL,
  age_range text NULL,
  tone text NULL,
  style_token text NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','writing','illustrating','layout','ready','failed')),
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.story_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES public.story_books(id) ON DELETE CASCADE,
  page_num int NOT NULL,
  text_content text NOT NULL DEFAULT '',
  illustration_prompt text NULL,
  illustration_asset_id uuid NULL,
  layout jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (book_id, page_num)
);

CREATE TABLE IF NOT EXISTS public.story_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NULL REFERENCES public.story_books(id) ON DELETE CASCADE,
  asset_type text NOT NULL CHECK (asset_type IN ('image','pdf','cover','thumb','other')),
  storage_bucket text NOT NULL DEFAULT 'storylab',
  storage_path text NOT NULL,
  mime_type text NULL,
  width int NULL,
  height int NULL,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS story_projects_profile_idx ON public.story_projects(profile_id);
CREATE INDEX IF NOT EXISTS story_projects_business_idx ON public.story_projects(business_key);
CREATE INDEX IF NOT EXISTS story_books_project_idx ON public.story_books(project_id);
CREATE INDEX IF NOT EXISTS story_books_profile_idx ON public.story_books(profile_id);
CREATE INDEX IF NOT EXISTS story_pages_book_idx ON public.story_pages(book_id);
CREATE INDEX IF NOT EXISTS story_assets_book_idx ON public.story_assets(book_id);

-- Updated_at trigger helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_story_projects_updated_at ON public.story_projects;
CREATE TRIGGER trg_story_projects_updated_at 
  BEFORE UPDATE ON public.story_projects 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_story_books_updated_at ON public.story_books;
CREATE TRIGGER trg_story_books_updated_at 
  BEFORE UPDATE ON public.story_books 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_story_pages_updated_at ON public.story_pages;
CREATE TRIGGER trg_story_pages_updated_at 
  BEFORE UPDATE ON public.story_pages 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ RLS POLICIES ============
ALTER TABLE public.story_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_assets ENABLE ROW LEVEL SECURITY;

-- Projects: users can only access their own
DROP POLICY IF EXISTS story_projects_own ON public.story_projects;
CREATE POLICY story_projects_own ON public.story_projects
  FOR ALL 
  USING (profile_id = auth.uid()) 
  WITH CHECK (profile_id = auth.uid());

-- Books: users can only access their own
DROP POLICY IF EXISTS story_books_own ON public.story_books;
CREATE POLICY story_books_own ON public.story_books
  FOR ALL 
  USING (profile_id = auth.uid()) 
  WITH CHECK (profile_id = auth.uid());

-- Pages: access through book ownership
DROP POLICY IF EXISTS story_pages_own ON public.story_pages;
CREATE POLICY story_pages_own ON public.story_pages
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.story_books b
      WHERE b.id = story_pages.book_id 
      AND b.profile_id = auth.uid()
    )
  ) 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.story_books b
      WHERE b.id = story_pages.book_id 
      AND b.profile_id = auth.uid()
    )
  );

-- Assets: access through book ownership (null book_id allowed for system assets)
DROP POLICY IF EXISTS story_assets_own ON public.story_assets;
CREATE POLICY story_assets_own ON public.story_assets
  FOR SELECT 
  USING (
    book_id IS NULL OR EXISTS (
      SELECT 1 FROM public.story_books b
      WHERE b.id = story_assets.book_id 
      AND b.profile_id = auth.uid()
    )
  );

-- Comments for documentation
COMMENT ON TABLE public.story_projects IS 'User story projects across all verticals (kids/teen/adult)';
COMMENT ON TABLE public.story_books IS 'Individual books with generation settings and status tracking';
COMMENT ON TABLE public.story_pages IS 'Pages within books, ordered sequentially with text and illustration prompts';
COMMENT ON TABLE public.story_assets IS 'Generated assets (images, PDFs, covers) stored in Supabase Storage';
