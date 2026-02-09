# StoryLab Implementation Guide for Vite + Supabase

## Current Status

✅ **Done:**
- Core database tables (`story_projects`, `story_books`, `story_pages`, `story_assets`)
- Success/Cancel checkout pages for Kids/Teen/Adult
- Profit Network integration (25% commission)
- Marketplace products seeded
- Partner statements system

❌ **Missing (from Next.js code):**
- Bot templates & AI generation system
- Story job queue & worker
- React UI for book creation/editing
- Supabase Edge Functions for AI operations
- Safety validators

---

## Architecture: Next.js vs This Project

| Component | Next.js (Pasted Code) | This Project (Vite + Supabase) |
|-----------|----------------------|--------------------------------|
| **Frontend** | Next.js Pages Router | React + Vite + React Router |
| **Backend API** | `/pages/api/*` routes | Supabase Edge Functions |
| **Auth** | `@supabase/auth-helpers-nextjs` | `AuthContext` (already set up) |
| **Database** | Supabase (same) | Supabase (same) |
| **Cron Jobs** | Vercel cron | pg_cron extension |
| **File Storage** | Supabase Storage | Supabase Storage |

---

## Implementation Steps

### Step 1: Add Bot & Job Queue Tables

Create migration: `supabase/migrations/[timestamp]_add_storylab_bot_system.sql`

```sql
-- Bot templates for AI generation
CREATE TABLE IF NOT EXISTS public.bot_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_key text NOT NULL,
  vertical_key text NOT NULL DEFAULT 'kids',
  template_key text NOT NULL,
  name text NOT NULL,
  description text NULL,
  model text NOT NULL DEFAULT 'gpt-4o-mini',
  system_prompt text NOT NULL,
  user_prompt text NOT NULL,
  json_schema jsonb NOT NULL DEFAULT '{}'::jsonb,
  safety_rules jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (business_key, vertical_key, template_key)
);

-- Story generation job queue
CREATE TABLE IF NOT EXISTS public.story_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  business_key text NOT NULL,
  vertical_key text NOT NULL,
  book_id uuid NOT NULL REFERENCES public.story_books(id) ON DELETE CASCADE,
  job_type text NOT NULL CHECK (job_type IN ('outline','pages','illustrations','pdf','marketing_pack')),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','succeeded','failed')),
  attempts int NOT NULL DEFAULT 0,
  input jsonb NOT NULL DEFAULT '{}'::jsonb,
  output jsonb NULL,
  error text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS story_jobs_status_idx ON public.story_jobs(status, created_at);
CREATE INDEX IF NOT EXISTS story_jobs_book_idx ON public.story_jobs(book_id);
CREATE INDEX IF NOT EXISTS bot_templates_business_idx ON public.bot_templates(business_key, vertical_key);

-- RLS
ALTER TABLE public.bot_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active templates"
  ON public.bot_templates FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can view own jobs"
  ON public.story_jobs FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "System can manage jobs"
  ON public.story_jobs FOR ALL
  USING (true)
  WITH CHECK (true);

-- Seed Kids templates
INSERT INTO public.bot_templates
(business_key, vertical_key, template_key, name, description, model, system_prompt, user_prompt, json_schema, safety_rules)
VALUES
(
  'storylab_kids', 'kids', 'kids_story_writer_v1',
  'Kids Story Writer v1',
  'Generates outline + page-by-page story for kids with safe illustration prompts.',
  'gpt-4o-mini',
  'You write children''s books. STRICT RULES: No scary content, no violence, no weapons, no self-harm, no mature themes, no copyrighted characters or worlds. Keep it warm, funny, and kind. Output ONLY JSON.',
  'Create a children''s story from this brief:\n\n{{BRIEF}}\n\nReturn JSON with:\n{ "title": "...", "blurb":"...", "pages":[ { "page_num":1, "text":"...", "illustration_prompt":"..." }, ... ] }\nPages must be 24 pages max.',
  '{"type":"object","properties":{"title":{"type":"string"},"blurb":{"type":"string"},"pages":{"type":"array"}}}',
  '{"kids_safe":true,"ip_guard":true,"no_scary":true}'
),
(
  'storylab_kids', 'kids', 'kids_marketing_pack_v1',
  'Kids Marketing Pack v1',
  'Creates ad copy, landing copy, DMs, email, SMS, social posts for the generated book.',
  'gpt-4o-mini',
  'You are a marketing assistant. Be compliant. No deceptive claims. No copyrighted references. Output ONLY JSON.',
  'Based on this book:\nTitle: {{TITLE}}\nBlurb: {{BLURB}}\n\nGenerate JSON:\n{ "ads":[...], "landing_copy":"...", "dm_scripts":[...], "email_sequence":[...], "sms_sequence":[...], "social_posts":[...] }',
  '{"type":"object"}',
  '{"compliant_ads":true}'
)
ON CONFLICT (business_key, vertical_key, template_key)
DO UPDATE SET
  system_prompt = EXCLUDED.system_prompt,
  user_prompt = EXCLUDED.user_prompt,
  is_active = true;
```

### Step 2: Create Safety Validators (Frontend)

Create `/src/lib/storylab/safety.ts`:

```typescript
const BLOCKLIST = [
  'blood', 'gore', 'murder', 'kill', 'suicide', 'self-harm', 'weapon', 'gun', 'knife', 'abuse',
  'sex', 'nude', 'porn', 'explicit', 'rape', 'drugs', 'cocaine', 'meth', 'terror', 'horror', 'nightmare'
];

const IP_BLOCKLIST = [
  'mickey', 'minnie', 'elsa', 'spiderman', 'batman', 'pikachu', 'harry potter', 'hogwarts', 'star wars'
];

export function validateKidsText(text: string): { safe: boolean; violations: string[] } {
  const t = (text || '').toLowerCase();
  const violations: string[] = [];

  for (const word of BLOCKLIST) {
    if (t.includes(word)) violations.push(`kids_safety:${word}`);
  }

  for (const word of IP_BLOCKLIST) {
    if (t.includes(word)) violations.push(`ip_violation:${word}`);
  }

  return { safe: violations.length === 0, violations };
}

export function sanitizeImagePrompt(prompt: string): string {
  let p = (prompt || '').toLowerCase();

  for (const word of BLOCKLIST) {
    if (p.includes(word)) {
      throw new Error(`Unsafe image prompt: ${word}`);
    }
  }

  for (const word of IP_BLOCKLIST) {
    if (p.includes(word)) {
      throw new Error(`IP violation in prompt: ${word}`);
    }
  }

  // Force safe phrasing
  if (!p.includes('friendly')) {
    return `${prompt}. Friendly, cozy, non-scary, child-safe.`;
  }

  return prompt;
}
```

### Step 3: Create Supabase Edge Function for Book Creation

Create `/supabase/functions/storylab-create-book/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'not_authenticated' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const {
      project_title,
      book_title,
      age_range = '3-5',
      tone = 'warm and funny',
      style_token = 'watercolor_childrens_book',
      brief,
      pages = 24,
      vertical = 'kids'
    } = await req.json();

    const business_key = `storylab_${vertical}`;
    const vertical_key = vertical;

    // Create project
    const { data: project, error: pErr } = await supabaseClient
      .from('story_projects')
      .insert({
        profile_id: user.id,
        business_key,
        vertical_key,
        title: project_title || book_title || 'My Story',
        status: 'draft',
        meta: { brief, pages }
      })
      .select()
      .single();

    if (pErr) throw pErr;

    // Create book
    const { data: book, error: bErr } = await supabaseClient
      .from('story_books')
      .insert({
        project_id: project.id,
        profile_id: user.id,
        business_key,
        vertical_key,
        title: book_title || project.title,
        age_range,
        tone,
        style_token,
        status: 'draft',
        settings: { pages, brief }
      })
      .select()
      .single();

    if (bErr) throw bErr;

    // Enqueue story generation job
    await supabaseClient.from('story_jobs').insert({
      profile_id: user.id,
      business_key,
      vertical_key,
      book_id: book.id,
      job_type: 'pages',
      status: 'queued',
      input: { brief, pages }
    });

    return new Response(
      JSON.stringify({ project, book }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'create_book_failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### Step 4: Create React UI for Book Creation

Create `/src/pages/storylab/kids/CreateBook.tsx`:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { BookOpen, Sparkles } from 'lucide-react';

export default function CreateKidsBook() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    if (!title || !brief) {
      alert('Please enter a title and brief');
      return;
    }

    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('storylab-create-book', {
        body: {
          project_title: title,
          book_title: title,
          age_range: '3-5',
          tone: 'warm, funny, bedtime',
          style_token: 'watercolor_childrens_book',
          brief,
          pages: 24,
          vertical: 'kids'
        }
      });

      if (error) throw error;

      // Navigate to book dashboard
      navigate(`/app/storylab/kids/books/${data.book.id}`);

    } catch (error: any) {
      alert(error.message || 'Failed to create book');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Create a Kids Book</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A Cozy Adventure"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Story Brief
            </label>
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={6}
              placeholder="A gentle bedtime story about a bunny who learns about kindness and friendship..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-2">
              Describe your story idea. Our AI will create a 24-page book with illustrations.
            </p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <strong>What happens next:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>AI generates 24 pages of story text</li>
                  <li>Creates safe, child-friendly illustration prompts</li>
                  <li>Generates images for each page</li>
                  <li>Compiles everything into a downloadable PDF</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={creating || !title || !brief}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {creating ? 'Creating Book...' : 'Create & Auto-Generate'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Next Steps

### Immediate (Tonight):
1. ✅ Run the migration to add bot_templates & story_jobs tables
2. ✅ Deploy `storylab-create-book` edge function
3. ✅ Create the React UI page
4. ✅ Add routes in App.tsx

### Tomorrow:
5. Create story-worker edge function (processes jobs)
6. Set up pg_cron to run worker every 2 minutes
7. Add OpenAI API key to environment variables
8. Create book dashboard page to show generation progress

### This Week:
9. Add illustration generation (OpenAI DALL-E)
10. Add PDF export functionality
11. Add marketing pack generator
12. Duplicate for Teen & Adult verticals

---

## Key Differences from Next.js Code

| Feature | Next.js | This Project |
|---------|---------|--------------|
| API Routes | `pages/api/` | Supabase Edge Functions |
| Auth | `requireUser()` helper | `supabase.auth.getUser()` |
| Database | Direct Supabase calls | Same |
| Cron | Vercel cron | pg_cron extension |
| OpenAI | Server-side only | Edge Function |

---

## Cost Estimate

- **OpenAI**: ~$0.50-$1.00 per book (text + 24 images)
- **Supabase**: Included in free tier for storage
- **Edge Functions**: Free up to 500K requests/month

**Revenue**: $19-$497 per book created → Excellent margins!

---

## Questions?

The infrastructure is ready. You need to decide:
1. Do you want to build this now?
2. Should I create the worker edge function next?
3. Do you want to start with kids only or all 3 verticals?
