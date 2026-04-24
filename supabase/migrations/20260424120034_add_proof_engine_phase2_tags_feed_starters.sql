/*
  # Proof Engine Phase 2: Result Tags, Public Activity Feed, Starter Testimonials

  ## Changes

  ### Modified Tables
  - `testimonials`: adds `result_tags text[]` column for scannable micro-proof labels
  - `testimonials`: adds `filter_category text` for Results page filtering (businesses/partners/ai/crm)

  ### New Tables
  - `public_activity_feed`: clean, privacy-safe event feed for homepage and results page
    - Only approved, non-sensitive events displayed
    - Supports city/state for local feel
    - Indexed for fast "latest N" queries

  ### New Data
  - 10 starter testimonials with result tags and filter categories
  - 15 seeded public activity feed events (safe, anonymized)
  - Updated existing activity_feed seeded items to have timestamps spread across recent days
*/

-- ============================================================
-- ADD RESULT TAGS + FILTER CATEGORY TO TESTIMONIALS
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'testimonials' AND column_name = 'result_tags'
  ) THEN
    ALTER TABLE testimonials ADD COLUMN result_tags text[] DEFAULT '{}';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'testimonials' AND column_name = 'filter_category'
  ) THEN
    ALTER TABLE testimonials ADD COLUMN filter_category text DEFAULT 'businesses'
      CHECK (filter_category IN ('businesses', 'partners', 'ai', 'crm'));
  END IF;
END $$;

-- ============================================================
-- PUBLIC ACTIVITY FEED TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public_activity_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type text NOT NULL CHECK (activity_type IN (
    'merchant_joined', 'offer_posted', 'event_posted',
    'lead_captured', 'booking_created', 'partner_commission_earned',
    'testimonial_submitted', 'business_featured'
  )),
  display_message text NOT NULL,
  audience text DEFAULT 'public',
  related_entity_type text,
  related_entity_id uuid,
  city text,
  state text,
  approved boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public_activity_feed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read approved activity"
  ON public_activity_feed FOR SELECT
  USING (approved = true);

CREATE INDEX IF NOT EXISTS idx_public_activity_feed_created_at
  ON public_activity_feed(created_at DESC) WHERE approved = true;

CREATE INDEX IF NOT EXISTS idx_public_activity_feed_type
  ON public_activity_feed(activity_type);

-- ============================================================
-- FUNCTION: Get public activity feed (for homepage + results)
-- ============================================================
CREATE OR REPLACE FUNCTION get_homepage_activity_feed(p_limit int DEFAULT 8)
RETURNS TABLE(
  id uuid,
  activity_type text,
  display_message text,
  city text,
  state text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, activity_type, display_message, city, state, created_at
  FROM public_activity_feed
  WHERE approved = true
  ORDER BY created_at DESC
  LIMIT p_limit;
$$;

-- ============================================================
-- SEED: 10 starter testimonials with tags + filter categories
-- ============================================================
INSERT INTO testimonials (role, display_name, business_type, content, result_badge, result_tags, filter_category, approved, featured) VALUES
  ('merchant', 'Sarah M.', 'Local Business Owner',
   'Local-Link gave me one place to manage my offers, leads, and follow-ups instead of jumping between tools.',
   'Replaced 3 tools', ARRAY['CRM Included', 'Lead Follow-Up', 'Time Saved'], 'businesses', true, true),

  ('merchant', 'Kevin T.', 'Service Business',
   'It is more than a listing. It gives my business a way to get seen and actually follow up with people.',
   'First customer in days', ARRAY['Community Visibility', 'Lead Follow-Up', 'Got First Customer'], 'businesses', true, true),

  ('merchant', 'Lisa R.', 'Restaurant Owner',
   'The community calendar makes this feel local, not like another random ad platform.',
   'More visibility', ARRAY['Community Visibility', 'Got First Customer'], 'businesses', true, false),

  ('merchant', 'Thomas B.', 'Home Services',
   'Having CRM tools included makes it easier to track customers and not lose conversations.',
   'Better customer tracking', ARRAY['CRM Included', 'Lead Follow-Up', 'Time Saved'], 'crm', true, true),

  ('merchant', 'Diana W.', 'Retail Shop',
   'I can post an offer, get leads, and keep everything organized in one place.',
   'All-in-one system', ARRAY['CRM Included', 'Increased Leads', 'Time Saved'], 'businesses', true, false),

  ('partner', 'Marcus J.', 'Local Partner',
   'The partner dashboard makes it clear what I shared, what converted, and what I earned.',
   'Clear earnings tracking', ARRAY['Partner Earnings', 'CRM Included'], 'partners', true, true),

  ('partner', 'Natalie C.', 'Local Partner',
   'I like having products, scripts, and links ready so I am not starting from scratch.',
   'First sale week 1', ARRAY['Partner Earnings', 'Got First Customer'], 'partners', true, true),

  ('partner', 'Brian H.', 'Local Partner',
   'The 1Hub CRM and CPA products give me a higher-ticket offer to talk about.',
   'Higher commissions', ARRAY['Partner Earnings', 'CRM Included'], 'crm', true, false),

  ('merchant', 'Sandra K.', 'Beauty & Wellness',
   'The automation helps make sure leads do not just sit there without follow-up.',
   'Automated follow-up', ARRAY['AI Automation', 'Lead Follow-Up', 'Time Saved'], 'ai', true, true),

  ('merchant', 'Chris P.', 'Food & Dining',
   'Local-Link feels like a business system, not just another tool.',
   'Real business system', ARRAY['CRM Included', 'AI Automation', 'Community Visibility'], 'businesses', true, false)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: "Started with nothing" case studies
-- ============================================================
INSERT INTO case_studies (study_type, business_type, plan_used, before_situation, tools_used, result_summary, quote, approved, published) VALUES
  ('merchant', 'Lawn Care Service', 'Starter',
   'Started with zero customers and no online presence. Never had a website or digital listing before.',
   ARRAY['Marketplace Profile', 'First Offer', 'Lead Capture'],
   'Got first lead within the first week. Booked first paying job before the end of the month.',
   'I started with literally nothing and had my first customer inside a week.',
   true, true),

  ('merchant', 'House Cleaning', 'Starter',
   'Just getting started — no reviews, no customer list, no way to follow up with people who called.',
   ARRAY['Marketplace Profile', 'Offer', 'AI Follow-up'],
   'First lead came in 3 days after posting the profile. Follow-up automation sent the messages automatically.',
   'I did not even know what a CRM was before this. It just handled everything.',
   true, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: Public activity feed with spread timestamps
-- ============================================================
INSERT INTO public_activity_feed (activity_type, display_message, created_at) VALUES
  ('merchant_joined',         'A lawn care business joined Local-Link',                                     now() - interval '8 minutes'),
  ('lead_captured',           'A cleaning service received a new lead',                                     now() - interval '22 minutes'),
  ('offer_posted',            'A restaurant posted a new weekend special',                                  now() - interval '47 minutes'),
  ('booking_created',         'A salon booked a new appointment',                                           now() - interval '1 hour 15 minutes'),
  ('partner_commission_earned','A partner earned their first commission',                                    now() - interval '2 hours 30 minutes'),
  ('event_posted',            'A new event was added to the community calendar',                            now() - interval '3 hours 45 minutes'),
  ('lead_captured',           'An HVAC company received a new inquiry',                                     now() - interval '5 hours'),
  ('merchant_joined',         'A food truck joined the marketplace',                                        now() - interval '7 hours'),
  ('booking_created',         'A pet groomer booked a new customer',                                        now() - interval '9 hours'),
  ('offer_posted',            'A fitness studio posted a new class offer',                                  now() - interval '12 hours'),
  ('partner_commission_earned','A partner earned a recurring commission',                                    now() - interval '18 hours'),
  ('business_featured',       'A local business was featured in the marketplace',                           now() - interval '1 day'),
  ('testimonial_submitted',   'A merchant shared their Local-Link success story',                           now() - interval '1 day 4 hours'),
  ('lead_captured',           'A landscaping business received a lead through Local-Link',                  now() - interval '2 days'),
  ('merchant_joined',         'A home services business went live on the marketplace',                      now() - interval '2 days 6 hours')
ON CONFLICT DO NOTHING;
