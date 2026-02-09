/*
  # Seed StoryLab Pricing Products (Fixed Types)

  1. Add business_key column if missing
  2. Products Created
    - Kids: Starter, Pro, Agency subscriptions + DFY + Addons + Print
    - Teen: Pro, Agency subscriptions + DFY + Addons + Print
    - Adult: Pro, Agency subscriptions + DFY + Addons + Print
    
  3. All products use valid types
    - subscription: recurring products
    - service: DFY, addons, print (one-time purchases)
    - bundle: package deals
    
  4. 25% commission (2500 bp) on all products
*/

-- Add business_key column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'marketplace_affiliate_products' AND column_name = 'business_key'
  ) THEN
    ALTER TABLE public.marketplace_affiliate_products 
    ADD COLUMN business_key text NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS marketplace_affiliate_products_business_key_idx 
  ON public.marketplace_affiliate_products(business_key);

-- ============ KIDS PRODUCTS ============

INSERT INTO public.marketplace_affiliate_products (
  sku,
  name,
  description,
  type,
  price_cents,
  commission_rate_bp,
  recurring,
  stripe_price_id,
  category,
  active,
  business_key,
  metadata
) VALUES
-- Kids Subscriptions
(
  'sl_kids_starter_monthly',
  'StoryLab Kids Starter',
  'Create up to 3 personalized children''s books per month. Perfect for parents who want bedtime stories featuring their kids as the heroes.',
  'subscription',
  1900,
  2500,
  true,
  'price_kids_starter_monthly',
  'Subscriptions',
  true,
  'storylab_kids',
  '{"vertical_key": "kids", "page_limit": 12, "books_per_month": 3}'::jsonb
),
(
  'sl_kids_pro_monthly',
  'StoryLab Kids Pro',
  'Unlimited personalized children''s books with premium illustrations. Includes print ordering and commercial rights for teachers.',
  'subscription',
  4900,
  2500,
  true,
  'price_kids_pro_monthly',
  'Subscriptions',
  true,
  'storylab_kids',
  '{"vertical_key": "kids", "page_limit": 24, "books_per_month": -1}'::jsonb
),
(
  'sl_kids_agency_monthly',
  'StoryLab Kids Agency',
  'For educators and agencies. Create unlimited books, white-label option, and client management dashboard.',
  'subscription',
  9700,
  2500,
  true,
  'price_kids_agency_monthly',
  'Subscriptions',
  true,
  'storylab_kids',
  '{"vertical_key": "kids", "page_limit": 48, "books_per_month": -1}'::jsonb
),

-- Kids Services (DFY, Addons, Print)
(
  'sl_kids_dfy',
  'StoryLab Kids Done-For-You Book',
  'We create a complete custom children''s book for you. Professional writing, illustration, and layout. Delivered in 7 days.',
  'service',
  49700,
  2500,
  false,
  'price_kids_dfy',
  'Done-For-You Services',
  true,
  'storylab_kids',
  '{"vertical_key": "kids", "delivery_days": 7, "revisions": 2, "page_count": 24}'::jsonb
),
(
  'sl_kids_addon_extra_pages',
  'Extra Pages (10 pages)',
  'Add 10 additional pages to any book project.',
  'service',
  900,
  2500,
  false,
  'price_kids_addon_pages',
  'Add-ons',
  true,
  'storylab_kids',
  '{"vertical_key": "kids", "page_count": 10}'::jsonb
),
(
  'sl_kids_addon_extra_characters',
  'Additional Character Pack',
  'Add up to 3 more custom characters to your story.',
  'service',
  1500,
  2500,
  false,
  'price_kids_addon_characters',
  'Add-ons',
  true,
  'storylab_kids',
  '{"vertical_key": "kids", "character_count": 3}'::jsonb
),
(
  'sl_kids_addon_cover_upgrade',
  'Premium Cover Upgrade',
  'Hardcover-style design with foil effects and embossing simulation.',
  'service',
  1200,
  2500,
  false,
  'price_kids_addon_cover',
  'Add-ons',
  true,
  'storylab_kids',
  '{"vertical_key": "kids"}'::jsonb
),
(
  'sl_kids_print_base',
  'Printed Book (8x10, Softcover)',
  'Professional print of your children''s book. High-quality paper, vibrant colors.',
  'service',
  2499,
  2500,
  false,
  'price_kids_print_base',
  'Print Services',
  true,
  'storylab_kids',
  '{"vertical_key": "kids", "size": "8x10", "binding": "softcover", "pages": 24}'::jsonb
),

-- ============ TEEN PRODUCTS ============

(
  'sl_teen_pro_monthly',
  'StoryLab Teen Pro',
  'Unlimited YA stories and novels. Perfect for teen writers and creative writing students. PG-13 content filters.',
  'subscription',
  3900,
  2500,
  true,
  'price_teen_pro_monthly',
  'Subscriptions',
  true,
  'storylab_teen',
  '{"vertical_key": "teen", "page_limit": 100, "books_per_month": -1, "content_rating": "PG-13"}'::jsonb
),
(
  'sl_teen_agency_monthly',
  'StoryLab Teen Agency',
  'For writing coaches and educators. Manage multiple student accounts, track progress, and provide feedback.',
  'subscription',
  7900,
  2500,
  true,
  'price_teen_agency_monthly',
  'Subscriptions',
  true,
  'storylab_teen',
  '{"vertical_key": "teen", "page_limit": 300, "books_per_month": -1}'::jsonb
),
(
  'sl_teen_dfy',
  'StoryLab Teen Done-For-You Novel',
  'Professional YA novel ghostwriting service. We write your complete story based on your outline. 30-50k words.',
  'service',
  69700,
  2500,
  false,
  'price_teen_dfy',
  'Done-For-You Services',
  true,
  'storylab_teen',
  '{"vertical_key": "teen", "word_count": 40000, "delivery_days": 21, "revisions": 3}'::jsonb
),
(
  'sl_teen_addon_cover_design',
  'YA Book Cover Design',
  'Professional YA book cover design with mockups.',
  'service',
  3900,
  2500,
  false,
  'price_teen_addon_cover',
  'Add-ons',
  true,
  'storylab_teen',
  '{"vertical_key": "teen"}'::jsonb
),
(
  'sl_teen_print_base',
  'Printed Novel (6x9, Paperback)',
  'Professional paperback printing of your YA novel.',
  'service',
  2999,
  2500,
  false,
  'price_teen_print_base',
  'Print Services',
  true,
  'storylab_teen',
  '{"vertical_key": "teen", "size": "6x9", "binding": "paperback", "pages": 300}'::jsonb
),

-- ============ ADULT PRODUCTS ============

(
  'sl_adult_pro_monthly',
  'StoryLab Adult Pro',
  'Unlimited books for business, marketing, and fiction. Create lead magnets, course materials, or novels.',
  'subscription',
  4900,
  2500,
  true,
  'price_adult_pro_monthly',
  'Subscriptions',
  true,
  'storylab_adult',
  '{"vertical_key": "adult", "page_limit": 200, "books_per_month": -1}'::jsonb
),
(
  'sl_adult_agency_monthly',
  'StoryLab Adult Agency',
  'For agencies, coaches, and consultants. Create client deliverables, white-label option, and team collaboration.',
  'subscription',
  9700,
  2500,
  true,
  'price_adult_agency_monthly',
  'Subscriptions',
  true,
  'storylab_adult',
  '{"vertical_key": "adult", "page_limit": 500, "books_per_month": -1}'::jsonb
),
(
  'sl_adult_dfy_business',
  'Done-For-You Business Book',
  'Professional ghostwriting for your business book, course, or lead magnet. 50-100 pages, fully edited.',
  'service',
  99700,
  2500,
  false,
  'price_adult_dfy_business',
  'Done-For-You Services',
  true,
  'storylab_adult',
  '{"vertical_key": "adult", "page_count": 75, "delivery_days": 14, "revisions": 3}'::jsonb
),
(
  'sl_adult_dfy_novel',
  'Done-For-You Fiction Novel',
  'Complete novel ghostwriting service. 60-100k words. Professional editing and cover design included.',
  'service',
  297000,
  2500,
  false,
  'price_adult_dfy_novel',
  'Done-For-You Services',
  true,
  'storylab_adult',
  '{"vertical_key": "adult", "word_count": 80000, "delivery_days": 45, "revisions": 3}'::jsonb
),
(
  'sl_adult_addon_professional_edit',
  'Professional Editing Service',
  'Developmental and line editing for your manuscript.',
  'service',
  4900,
  2500,
  false,
  'price_adult_addon_edit',
  'Add-ons',
  true,
  'storylab_adult',
  '{"vertical_key": "adult", "word_limit": 50000, "turnaround_days": 7}'::jsonb
),
(
  'sl_adult_addon_marketing_pack',
  'Book Marketing Pack',
  'Complete marketing package: landing page, email sequence, social media content, and ad copy.',
  'service',
  3900,
  2500,
  false,
  'price_adult_addon_marketing',
  'Add-ons',
  true,
  'storylab_adult',
  '{"vertical_key": "adult"}'::jsonb
),
(
  'sl_adult_print_base',
  'Printed Book (6x9, Paperback)',
  'Professional paperback printing of your book.',
  'service',
  3499,
  2500,
  false,
  'price_adult_print_base',
  'Print Services',
  true,
  'storylab_adult',
  '{"vertical_key": "adult", "size": "6x9", "binding": "paperback", "pages": 250}'::jsonb
)

ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  type = EXCLUDED.type,
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  recurring = EXCLUDED.recurring,
  category = EXCLUDED.category,
  business_key = EXCLUDED.business_key,
  metadata = EXCLUDED.metadata;
