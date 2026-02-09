/*
  # Fix Milestone System Schema

  1. Changes to partner_outreach_logs
    - Add `channel` column (email, text, dm, call)
    - Add `outcome` column (sent, replied, booked, no_response)
    - Make `notes` column nullable (optional field)

  2. Changes to partner_certifications
    - Add `earned_at` column (timestamp when cert was earned)
    - Add `score` column (exam score percentage)
    - Keep existing columns for backward compatibility
*/

-- Add missing columns to partner_outreach_logs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_outreach_logs' AND column_name = 'channel'
  ) THEN
    ALTER TABLE public.partner_outreach_logs 
    ADD COLUMN channel text NOT NULL DEFAULT 'email';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_outreach_logs' AND column_name = 'outcome'
  ) THEN
    ALTER TABLE public.partner_outreach_logs 
    ADD COLUMN outcome text NOT NULL DEFAULT 'sent';
  END IF;
END $$;

-- Make notes nullable
ALTER TABLE public.partner_outreach_logs 
ALTER COLUMN notes DROP NOT NULL;

-- Add missing columns to partner_certifications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_certifications' AND column_name = 'earned_at'
  ) THEN
    ALTER TABLE public.partner_certifications 
    ADD COLUMN earned_at timestamptz;
    
    -- Backfill with granted_at value
    UPDATE public.partner_certifications 
    SET earned_at = granted_at 
    WHERE earned_at IS NULL;
    
    -- Make NOT NULL after backfill
    ALTER TABLE public.partner_certifications 
    ALTER COLUMN earned_at SET NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_certifications' AND column_name = 'score'
  ) THEN
    ALTER TABLE public.partner_certifications 
    ADD COLUMN score integer;
  END IF;
END $$;
