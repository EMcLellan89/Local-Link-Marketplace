/*
  # Add Missing Foreign Key Indexes

  1. Performance Improvements
    - Adds indexes to unindexed foreign key columns
    - Improves JOIN performance across multiple tables
    - Reduces query execution time for relationship lookups
    
  2. Tables Updated
    - ai_tool_calls: index on tool_id (if table exists)
    - commission_payout_batches: index on created_by (if table exists)
    - creative_events: index on profile_id (if table exists)
    - creator_applications: index on profile_id, approved_by, rejected_by (if table exists)
    - event_attendance: index on event_id, profile_id (if table exists)
    - event_registrations: index on event_id, profile_id (if table exists)
    - events: index on created_by, approved_by (if table exists)
    - partner_commission_overrides: index on partner_id, override_set_id (if table exists)
    - partner_custom_commission_sets: index on partner_id (if table exists)
    - partner_media: index on partner_id (if table exists)
    - partner_social_links: index on partner_id (if table exists)
    - profiles: index on user_id (if table exists)
    - reviews: index on partner_id, profile_id (if table exists)
    
  3. Notes
    - Uses DO blocks to check table existence before creating indexes
    - All indexes use IF NOT EXISTS to ensure idempotency
    - Foreign key indexes are critical for JOIN performance
*/

-- ai_tool_calls
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_tool_calls') THEN
    CREATE INDEX IF NOT EXISTS idx_ai_tool_calls_tool_id ON ai_tool_calls(tool_id);
  END IF;
END $$;

-- commission_payout_batches
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'commission_payout_batches') THEN
    CREATE INDEX IF NOT EXISTS idx_commission_payout_batches_created_by ON commission_payout_batches(created_by);
  END IF;
END $$;

-- creative_events
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'creative_events') THEN
    CREATE INDEX IF NOT EXISTS idx_creative_events_profile_id ON creative_events(profile_id);
  END IF;
END $$;

-- creator_applications
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'creator_applications') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'creator_applications' AND column_name = 'profile_id') THEN
      CREATE INDEX IF NOT EXISTS idx_creator_applications_profile_id ON creator_applications(profile_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'creator_applications' AND column_name = 'approved_by') THEN
      CREATE INDEX IF NOT EXISTS idx_creator_applications_approved_by ON creator_applications(approved_by);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'creator_applications' AND column_name = 'rejected_by') THEN
      CREATE INDEX IF NOT EXISTS idx_creator_applications_rejected_by ON creator_applications(rejected_by);
    END IF;
  END IF;
END $$;

-- event_attendance
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'event_attendance') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'event_attendance' AND column_name = 'event_id') THEN
      CREATE INDEX IF NOT EXISTS idx_event_attendance_event_id ON event_attendance(event_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'event_attendance' AND column_name = 'profile_id') THEN
      CREATE INDEX IF NOT EXISTS idx_event_attendance_profile_id ON event_attendance(profile_id);
    END IF;
  END IF;
END $$;

-- event_registrations
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'event_registrations') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'event_registrations' AND column_name = 'event_id') THEN
      CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'event_registrations' AND column_name = 'profile_id') THEN
      CREATE INDEX IF NOT EXISTS idx_event_registrations_profile_id ON event_registrations(profile_id);
    END IF;
  END IF;
END $$;

-- events
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'events') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'created_by') THEN
      CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'approved_by') THEN
      CREATE INDEX IF NOT EXISTS idx_events_approved_by ON events(approved_by);
    END IF;
  END IF;
END $$;

-- partner_commission_overrides
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'partner_commission_overrides') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partner_commission_overrides' AND column_name = 'partner_id') THEN
      CREATE INDEX IF NOT EXISTS idx_partner_commission_overrides_partner_id ON partner_commission_overrides(partner_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partner_commission_overrides' AND column_name = 'override_set_id') THEN
      CREATE INDEX IF NOT EXISTS idx_partner_commission_overrides_override_set_id ON partner_commission_overrides(override_set_id);
    END IF;
  END IF;
END $$;

-- partner_custom_commission_sets
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'partner_custom_commission_sets') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partner_custom_commission_sets' AND column_name = 'partner_id') THEN
      CREATE INDEX IF NOT EXISTS idx_partner_custom_commission_sets_partner_id ON partner_custom_commission_sets(partner_id);
    END IF;
  END IF;
END $$;

-- partner_media
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'partner_media') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partner_media' AND column_name = 'partner_id') THEN
      CREATE INDEX IF NOT EXISTS idx_partner_media_partner_id ON partner_media(partner_id);
    END IF;
  END IF;
END $$;

-- partner_social_links
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'partner_social_links') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partner_social_links' AND column_name = 'partner_id') THEN
      CREATE INDEX IF NOT EXISTS idx_partner_social_links_partner_id ON partner_social_links(partner_id);
    END IF;
  END IF;
END $$;

-- profiles
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'user_id') THEN
      CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
    END IF;
  END IF;
END $$;

-- reviews
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'reviews') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reviews' AND column_name = 'partner_id') THEN
      CREATE INDEX IF NOT EXISTS idx_reviews_partner_id ON reviews(partner_id);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reviews' AND column_name = 'profile_id') THEN
      CREATE INDEX IF NOT EXISTS idx_reviews_profile_id ON reviews(profile_id);
    END IF;
  END IF;
END $$;
