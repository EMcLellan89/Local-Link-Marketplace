/*
  # Fix Auth RLS Performance Issues - Batch 1: Direct auth.uid() Calls
  
  1. Performance Optimization
    - Wraps direct auth.uid() calls in SELECT statements
    - Prevents re-evaluation of auth functions for each row
    - Improves query performance significantly
  
  2. Policies Fixed
    - creator_agreement_signatures: sigs_insert
    - partner_playbook_completions: Partners can record completions
    - partner_playbook_progress: Partners can update own progress
    - partner_streak_freezes: Partners can use streak freezes
*/

-- Fix creator_agreement_signatures
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'creator_agreement_signatures' AND policyname = 'sigs_insert') THEN
    DROP POLICY IF EXISTS "sigs_insert" ON creator_agreement_signatures;
    CREATE POLICY "sigs_insert"
      ON creator_agreement_signatures
      FOR INSERT
      TO authenticated
      WITH CHECK (creator_id = (SELECT auth.uid()));
  END IF;
END $$;

-- Fix partner_playbook_completions
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'partner_playbook_completions' AND policyname = 'Partners can record completions') THEN
    DROP POLICY IF EXISTS "Partners can record completions" ON partner_playbook_completions;
    CREATE POLICY "Partners can record completions"
      ON partner_playbook_completions
      FOR INSERT
      TO authenticated
      WITH CHECK ((SELECT auth.uid()) = user_id);
  END IF;
END $$;

-- Fix partner_playbook_progress
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'partner_playbook_progress' AND policyname = 'Partners can update own progress') THEN
    DROP POLICY IF EXISTS "Partners can update own progress" ON partner_playbook_progress;
    CREATE POLICY "Partners can update own progress"
      ON partner_playbook_progress
      FOR UPDATE
      TO authenticated
      USING ((SELECT auth.uid()) = user_id)
      WITH CHECK ((SELECT auth.uid()) = user_id);
  END IF;
END $$;

-- Fix partner_streak_freezes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'partner_streak_freezes' AND policyname = 'Partners can use streak freezes') THEN
    DROP POLICY IF EXISTS "Partners can use streak freezes" ON partner_streak_freezes;
    CREATE POLICY "Partners can use streak freezes"
      ON partner_streak_freezes
      FOR INSERT
      TO authenticated
      WITH CHECK ((SELECT auth.uid()) = partner_id);
  END IF;
END $$;