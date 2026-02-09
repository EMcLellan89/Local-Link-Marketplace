-- Seed Test Data for Weekly Winners Feed
-- Run this to test the system immediately

-- 1. Create sample creatives
INSERT INTO ad_creatives (business_key, vertical_key, creative_key, headline, primary_text, cta, landing_path, is_approved, is_active)
VALUES
  -- Winner #1 - Best performer
  ('storylab_kids', 'kids', 'kids_winner_jan_1',
   'Create a Magical Personalized Storybook For Your Child',
   'Watch their eyes light up as they become the hero of their own adventure story. Every child deserves to see themselves as the star. Personalized with their name, appearance, and favorite things. Makes the perfect gift!',
   'Create My Book', '/storylab/kids/checkout', true, true),

  -- Winner #2 - Strong performer
  ('storylab_kids', 'kids', 'kids_winner_jan_2',
   'Your Child Is The Hero In This Beautiful Story',
   'Imagine the joy when your child opens a book and sees themselves on every page. Custom illustrations, their name throughout the story, and adventures they''ll treasure forever. Parents love it, kids love it even more.',
   'Get Started', '/storylab/kids/checkout', true, true),

  -- Winner #3 - Good performer
  ('storylab_kids', 'kids', 'kids_winner_jan_3',
   'Bedtime Stories Just Got Personal',
   'Transform bedtime into an adventure with a story where your child is the main character. Personalized storybooks that make reading magical. Ships in 3 days.',
   'Make Their Book', '/storylab/kids/checkout', true, true),

  -- Newer creatives (testing)
  ('storylab_kids', 'kids', 'kids_test_jan_1',
   'The Perfect Gift For Any Occasion',
   'Birthdays, holidays, or just because - a personalized storybook is a gift they''ll never forget. Custom-made for your child in minutes.',
   'Order Now', '/storylab/kids/checkout', true, true),

  ('storylab_kids', 'kids', 'kids_test_jan_2',
   'Make Reading Fun Again',
   'Kids who see themselves in stories read 3x more. Create a personalized adventure that makes your child excited to read.',
   'Start Creating', '/storylab/kids/checkout', true, true);

-- 2. Generate realistic event data for the past 7 days
DO $$
DECLARE
  creative_1 uuid;
  creative_2 uuid;
  creative_3 uuid;
  creative_4 uuid;
  creative_5 uuid;
  day_offset int;
BEGIN
  -- Get creative IDs
  SELECT id INTO creative_1 FROM ad_creatives WHERE creative_key = 'kids_winner_jan_1';
  SELECT id INTO creative_2 FROM ad_creatives WHERE creative_key = 'kids_winner_jan_2';
  SELECT id INTO creative_3 FROM ad_creatives WHERE creative_key = 'kids_winner_jan_3';
  SELECT id INTO creative_4 FROM ad_creatives WHERE creative_key = 'kids_test_jan_1';
  SELECT id INTO creative_5 FROM ad_creatives WHERE creative_key = 'kids_test_jan_2';

  -- Generate events for past 7 days
  FOR day_offset IN 0..6 LOOP

    -- Creative 1: BEST PERFORMER (10+ purchases)
    -- 500 impressions/day, 3% CTR, 10% CVR
    INSERT INTO creative_events (business_key, vertical_key, creative_id, event_type, created_at, revenue_cents)
    SELECT
      'storylab_kids',
      'kids',
      creative_1,
      'impression',
      NOW() - (day_offset || ' days')::interval + (random() * interval '1 day'),
      0
    FROM generate_series(1, 500);

    INSERT INTO creative_events (business_key, vertical_key, creative_id, event_type, created_at, revenue_cents)
    SELECT
      'storylab_kids',
      'kids',
      creative_1,
      'click',
      NOW() - (day_offset || ' days')::interval + (random() * interval '1 day'),
      0
    FROM generate_series(1, 15); -- 3% CTR

    INSERT INTO creative_events (business_key, vertical_key, creative_id, event_type, created_at, revenue_cents)
    SELECT
      'storylab_kids',
      'kids',
      creative_1,
      'checkout_started',
      NOW() - (day_offset || ' days')::interval + (random() * interval '1 day'),
      0
    FROM generate_series(1, 5);

    INSERT INTO creative_events (business_key, vertical_key, creative_id, event_type, created_at, revenue_cents)
    SELECT
      'storylab_kids',
      'kids',
      creative_1,
      'purchase',
      NOW() - (day_offset || ' days')::interval + (random() * interval '1 day'),
      2997 -- $29.97
    FROM generate_series(1, 2); -- ~10% CVR, 14 purchases/week

    -- Creative 2: STRONG PERFORMER (5-9 purchases)
    -- 400 impressions/day, 2.5% CTR, 8% CVR
    INSERT INTO creative_events (business_key, vertical_key, creative_id, event_type, created_at, revenue_cents)
    SELECT 'storylab_kids', 'kids', creative_2, 'impression',
           NOW() - (day_offset || ' days')::interval + (random() * interval '1 day'), 0
    FROM generate_series(1, 400);

    INSERT INTO creative_events (business_key, vertical_key, creative_id, event_type, created_at, revenue_cents)
    SELECT 'storylab_kids', 'kids', creative_2, 'click',
           NOW() - (day_offset || ' days')::interval + (random() * interval '1 day'), 0
    FROM generate_series(1, 10);

    INSERT INTO creative_events (business_key, vertical_key, creative_id, event_type, created_at, revenue_cents)
    SELECT 'storylab_kids', 'kids', creative_2, 'purchase',
           NOW() - (day_offset || ' days')::interval + (random() * interval '1 day'), 2997
    FROM generate_series(1, 1); -- 7 purchases/week

    -- Creative 3: PROMISING (2-4 purchases)
    -- 300 impressions/day, 2% CTR, 5% CVR
    INSERT INTO creative_events (business_key, vertical_key, creative_id, event_type, created_at, revenue_cents)
    SELECT 'storylab_kids', 'kids', creative_3, 'impression',
           NOW() - (day_offset || ' days')::interval + (random() * interval '1 day'), 0
    FROM generate_series(1, 300);

    INSERT INTO creative_events (business_key, vertical_key, creative_id, event_type, created_at, revenue_cents)
    SELECT 'storylab_kids', 'kids', creative_3, 'click',
           NOW() - (day_offset || ' days')::interval + (random() * interval '1 day'), 0
    FROM generate_series(1, 6);

    IF day_offset IN (0, 3, 5) THEN -- 3 purchases total over week
      INSERT INTO creative_events (business_key, vertical_key, creative_id, event_type, created_at, revenue_cents)
      VALUES ('storylab_kids', 'kids', creative_3, 'purchase',
              NOW() - (day_offset || ' days')::interval + (random() * interval '1 day'), 2997);
    END IF;

    -- Creative 4: LOW VOLUME (testing)
    -- 200 impressions/day, 1.5% CTR, 3% CVR
    INSERT INTO creative_events (business_key, vertical_key, creative_id, event_type, created_at, revenue_cents)
    SELECT 'storylab_kids', 'kids', creative_4, 'impression',
           NOW() - (day_offset || ' days')::interval + (random() * interval '1 day'), 0
    FROM generate_series(1, 200);

    INSERT INTO creative_events (business_key, vertical_key, creative_id, event_type, created_at, revenue_cents)
    SELECT 'storylab_kids', 'kids', creative_4, 'click',
           NOW() - (day_offset || ' days')::interval + (random() * interval '1 day'), 0
    FROM generate_series(1, 3);

    IF day_offset = 2 THEN -- 1 purchase
      INSERT INTO creative_events (business_key, vertical_key, creative_id, event_type, created_at, revenue_cents)
      VALUES ('storylab_kids', 'kids', creative_4, 'purchase',
              NOW() - (day_offset || ' days')::interval, 2997);
    END IF;

    -- Creative 5: NEW (very low data)
    -- 150 impressions/day, 1% CTR, no purchases yet
    INSERT INTO creative_events (business_key, vertical_key, creative_id, event_type, created_at, revenue_cents)
    SELECT 'storylab_kids', 'kids', creative_5, 'impression',
           NOW() - (day_offset || ' days')::interval + (random() * interval '1 day'), 0
    FROM generate_series(1, 150);

    INSERT INTO creative_events (business_key, vertical_key, creative_id, event_type, created_at, revenue_cents)
    SELECT 'storylab_kids', 'kids', creative_5, 'click',
           NOW() - (day_offset || ' days')::interval + (random() * interval '1 day'), 0
    FROM generate_series(1, 2);

  END LOOP;
END $$;

-- 3. Update creative lifetime stats
SELECT update_creative_performance();

-- 4. Calculate weekly winners
SELECT calculate_weekly_winners('storylab_kids', 'kids');

-- 5. Verify results
SELECT
  rank,
  creative_key,
  headline,
  impressions,
  clicks,
  purchases,
  (revenue_cents / 100.0)::numeric(10,2) as revenue_dollars,
  (ctr * 100)::numeric(5,2) as ctr_percent,
  (cvr * 100)::numeric(5,2) as cvr_percent,
  (recommended_budget_daily_cents / 100.0)::numeric(10,2) as recommended_daily_budget,
  targeting_notes
FROM weekly_creative_winners
WHERE business_key = 'storylab_kids'
  AND vertical_key = 'kids'
ORDER BY rank;

-- Expected results:
-- Rank 1: kids_winner_jan_1 (~14 purchases, $75/day recommended)
-- Rank 2: kids_winner_jan_2 (~7 purchases, $50/day recommended)
-- Rank 3: kids_winner_jan_3 (~3 purchases, $40/day recommended)
-- Rank 4: kids_test_jan_1 (~1 purchase, $20/day recommended)
-- (kids_test_jan_2 won't qualify - 0 purchases)

-- Success! Now visit:
-- /partner/winners - See the feed
-- /admin/creatives - Manage creatives
