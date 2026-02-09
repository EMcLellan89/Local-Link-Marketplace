/*
  # Add Faceless Growth Engine™ (DFY Product)

  1. New DFY Product
    - Faceless Growth Engine™
    - $697 setup + $127/mo recurring

  2. Stripe Product Mapping
  3. Add-ons
  4. Partner Ad Vault
*/

DO $$
DECLARE
  v_product_id uuid;
BEGIN
  -- 1) Insert or update product
  INSERT INTO public.dfy_products
  (slug, name, category, short_value_prop, long_description, outcomes, includes, faq, setup_sla_hours, setup_price_cents, monthly_price_cents, is_active, sort_order)
  VALUES
  (
    'faceless-growth-engine',
    'Faceless Growth Engine™ (DFY)',
    'visibility',
    'A complete faceless content + mini-funnel system built for you every month.',
    'Faceless Growth Engine™ is a done-for-you visibility system designed for local businesses that want consistent content without being on camera. We build a 30-day faceless content pack, captions + hooks, a bio link / mini-funnel page, and simple follow-up prompts that drive leads to booking. Then we keep it running monthly with fresh content and optimizations.',
    '[
      "Post consistently without showing your face",
      "Turn attention into leads with a mini-funnel",
      "Save time: we build the content + system",
      "Stay top-of-mind locally with a weekly cadence"
    ]'::jsonb,
    '[
      "DFY 30-post faceless content pack (Canva-ready)",
      "Caption + hook library (local-business optimized)",
      "CTA + offer positioning",
      "Bio link / mini-funnel page setup",
      "Posting cadence plan + approval workflow option",
      "Support + monthly refresh"
    ]'::jsonb,
    '[
      {"q":"Do I have to record videos?","a":"No. This is designed for faceless formats (graphics, B-roll, voiceover scripts optional)."},
      {"q":"Can you match my brand?","a":"Yes. We collect your brand style + services during intake and build around it."},
      {"q":"How fast does it go live?","a":"Typically 3-5 business days after intake is submitted."},
      {"q":"Do you run ads?","a":"Ads are optional. This system works with organic posting and can be paired with paid ads as an add-on."}
    ]'::jsonb,
    120,
    69700,
    12700,
    true,
    50
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    short_value_prop = EXCLUDED.short_value_prop,
    long_description = EXCLUDED.long_description,
    outcomes = EXCLUDED.outcomes,
    includes = EXCLUDED.includes,
    faq = EXCLUDED.faq,
    setup_sla_hours = EXCLUDED.setup_sla_hours,
    setup_price_cents = EXCLUDED.setup_price_cents,
    monthly_price_cents = EXCLUDED.monthly_price_cents,
    is_active = EXCLUDED.is_active,
    sort_order = EXCLUDED.sort_order
  RETURNING id INTO v_product_id;

  IF v_product_id IS NULL THEN
    SELECT id INTO v_product_id FROM public.dfy_products WHERE slug = 'faceless-growth-engine';
  END IF;

  -- 2) Stripe mapping
  INSERT INTO public.dfy_product_stripe
  (product_id, stripe_product_id, stripe_price_setup_id, stripe_price_monthly_id, currency)
  VALUES
  (v_product_id, 'prod_REPLACE_FACELESS', 'price_REPLACE_FACELESS_SETUP', 'price_REPLACE_FACELESS_MO', 'usd')
  ON CONFLICT (product_id) DO UPDATE SET
    stripe_product_id = EXCLUDED.stripe_product_id,
    stripe_price_setup_id = EXCLUDED.stripe_price_setup_id,
    stripe_price_monthly_id = EXCLUDED.stripe_price_monthly_id;

  -- 3) Add-ons (delete and re-insert to handle updates)
  DELETE FROM public.dfy_addons WHERE product_id = v_product_id;
  
  INSERT INTO public.dfy_addons
  (product_id, code, name, description, price_cents, is_recurring, stripe_price_id, is_active)
  VALUES
  (v_product_id, 'EXTRA_POSTS', 'Extra 30 Posts / Month', 'Adds a second 30-post pack each month.', 4700, true, 'price_REPLACE_EXTRA_POSTS', true),
  (v_product_id, 'VIDEO_SCRIPTS', '10 Short-Form Video Scripts / Month', 'Adds 10 faceless voiceover/B-roll scripts each month.', 3900, true, 'price_REPLACE_VIDEO_SCRIPTS', true),
  (v_product_id, 'AD_CREATIVE_PACK', 'Paid Ad Creative Pack', 'DFY ad creative pack with angles and image prompts.', 29700, false, 'price_REPLACE_AD_PACK', true);

END $$;

-- 4) Partner Ad Vault
INSERT INTO public.dfy_ad_vault
(product_slug, channel, headline, primary_text, cta, notes)
VALUES
('faceless-growth-engine', 'facebook', 'Post daily without showing your face', 'Want consistent content but hate being on camera? Faceless Growth Engine builds your next 30 days of posts + captions + hooks AND sets up a simple mini-funnel. Tap Learn More to start.', 'Learn More', 'Use with Canva carousels or phone mockups.'),
('faceless-growth-engine', 'facebook', 'A DFY content system for local businesses', 'Most local businesses lose attention because they post randomly. This is a done-for-you faceless content system: we build your monthly content pack + a mini-funnel page. Tap Learn More to start.', 'Learn More', 'Great for trades, cleaning, med spa, restaurants.'),
('faceless-growth-engine', 'instagram', 'Faceless content + leads', 'No time to post? We build your faceless content for the month + captions + hooks + a mini-funnel to capture leads. Tap Learn More to get it installed.', 'Learn More', 'Pair with B-roll + text overlays.')
ON CONFLICT DO NOTHING;
