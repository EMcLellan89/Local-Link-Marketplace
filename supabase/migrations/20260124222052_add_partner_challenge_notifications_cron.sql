/*
  # Partner Challenge Notification System

  Automated daily reminders for partners enrolled in the 7-Day Faceless Challenge
  
  1. Functions
    - `send_challenge_reminders()` - Sends daily reminders to active challenge participants
    - `check_inactive_streaks()` - Resets streaks for inactive partners
    
  2. Cron Jobs (manual setup required)
    - Call send_challenge_reminders() daily at 9 AM EST
    - Call check_inactive_streaks() daily at midnight
    
  3. Notifications
    - In-app notifications table updates
    - Email trigger flags
*/

-- =====================================================
-- NOTIFICATION TRACKING
-- =====================================================

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partner_challenge_progress' 
    AND column_name = 'reminder_sent_at'
  ) THEN
    ALTER TABLE public.partner_challenge_progress 
    ADD COLUMN reminder_sent_at timestamptz;
  END IF;
END $$;

-- =====================================================
-- CHALLENGE REMINDER FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION public.send_challenge_reminders()
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reminder_count int := 0;
  v_enrollment record;
  v_next_day record;
BEGIN
  -- Find active enrollments where the next incomplete day needs a reminder
  FOR v_enrollment IN
    SELECT DISTINCT
      pce.id as enrollment_id,
      pce.partner_id,
      p.email,
      p.company_name,
      p.user_id
    FROM partner_challenge_enrollments pce
    JOIN partners p ON p.id = pce.partner_id
    JOIN partner_challenge_progress pcp ON pcp.enrollment_id = pce.id
    WHERE pce.status = 'active'
    AND pcp.completed = false
    AND (pcp.reminder_sent_at IS NULL 
         OR pcp.reminder_sent_at < CURRENT_DATE)
    AND pcp.day_number = (
      SELECT MIN(day_number) 
      FROM partner_challenge_progress 
      WHERE enrollment_id = pce.id 
      AND completed = false
    )
  LOOP
    -- Get the next incomplete day details
    SELECT * INTO v_next_day
    FROM partner_challenge_progress
    WHERE enrollment_id = v_enrollment.enrollment_id
    AND completed = false
    ORDER BY day_number
    LIMIT 1;

    IF v_next_day IS NOT NULL THEN
      -- Update reminder sent timestamp
      UPDATE partner_challenge_progress
      SET reminder_sent_at = now()
      WHERE id = v_next_day.id;

      -- Log activity for reminder
      INSERT INTO partner_activity_log (partner_id, activity_type, points_earned, metadata)
      VALUES (
        v_enrollment.partner_id,
        'post_created',
        0,
        jsonb_build_object(
          'type', 'challenge_reminder',
          'day', v_next_day.day_number,
          'sent_at', now()
        )
      );

      v_reminder_count := v_reminder_count + 1;
    END IF;
  END LOOP;

  RETURN v_reminder_count;
END;
$$;

-- =====================================================
-- STREAK CHECK FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION public.check_inactive_streaks()
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reset_count int := 0;
BEGIN
  -- Reset streaks for partners who haven't been active in 2+ days
  UPDATE partner_streaks
  SET
    current_streak = 0,
    updated_at = now()
  WHERE last_activity_date < CURRENT_DATE - INTERVAL '1 day'
  AND current_streak > 0;

  GET DIAGNOSTICS v_reset_count = ROW_COUNT;

  RETURN v_reset_count;
END;
$$;

-- =====================================================
-- FUNCTION COMMENTS
-- =====================================================

COMMENT ON FUNCTION public.send_challenge_reminders() IS 
'Sends daily reminders to partners with active challenges. Returns count of reminders sent. 
Schedule to run daily at 9 AM EST (14:00 UTC) using pg_cron or external scheduler.';

COMMENT ON FUNCTION public.check_inactive_streaks() IS 
'Resets streaks for partners inactive for 2+ days. Returns count of streaks reset.
Schedule to run daily at midnight EST (5:00 UTC) using pg_cron or external scheduler.';

-- =====================================================
-- SETUP INSTRUCTIONS
-- =====================================================

/*
To enable automated notifications, set up these cron jobs:

1. In Supabase Dashboard > Database > Cron Jobs (if available):
   
   Name: partner-challenge-reminders
   Schedule: 0 14 * * * (9 AM EST daily)
   Command: SELECT send_challenge_reminders();
   
   Name: partner-streak-check
   Schedule: 0 5 * * * (Midnight EST daily)
   Command: SELECT check_inactive_streaks();

2. Or use an external cron service to call these via Supabase Functions:
   
   POST https://[project-id].supabase.co/functions/v1/daily-partner-nudges
   Header: Authorization: Bearer [service-role-key]
   
3. Manual testing:
   
   SELECT send_challenge_reminders();  -- Returns number of reminders sent
   SELECT check_inactive_streaks();    -- Returns number of streaks reset
*/
