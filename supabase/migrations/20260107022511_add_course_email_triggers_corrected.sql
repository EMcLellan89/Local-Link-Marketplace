/*
  # Add Course Email Automation Triggers (Corrected)

  Uses correct table names:
  - enrollments (not course_enrollments)
  - user_entitlements (not entitlements)

  1. Trigger on course enrollment
  2. Trigger on lesson completion
  3. Trigger on exam pass
  4. Inactive user detection function
*/

-- Function: Schedule Selling Recurring Revenue email sequence
CREATE OR REPLACE FUNCTION public.schedule_srr_sequence()
RETURNS trigger AS $$
DECLARE
  v_course_slug text;
  v_has_toolkit boolean;
  v_user_email text;
BEGIN
  -- Only process Selling Recurring Revenue course
  SELECT slug INTO v_course_slug FROM courses WHERE id = NEW.course_id;
  
  IF v_course_slug != 'selling-recurring-revenue' THEN
    RETURN NEW;
  END IF;
  
  -- Get user email
  SELECT email INTO v_user_email FROM auth.users WHERE id = NEW.user_id;
  
  -- Check if user has toolkit entitlement
  SELECT EXISTS(
    SELECT 1 FROM user_entitlements 
    WHERE user_id = NEW.user_id 
    AND course_id = NEW.course_id
    AND entitlement LIKE '%toolkit%'
  ) INTO v_has_toolkit;
  
  IF v_has_toolkit THEN
    -- BUNDLE BUYER SEQUENCE
    PERFORM schedule_email(NEW.user_id, 'SRR_BUNDLE_ACCESS', jsonb_build_object('email', v_user_email, 'course_slug', 'selling-recurring-revenue'), '0 seconds'::interval);
    PERFORM schedule_email(NEW.user_id, 'SRR_BUNDLE_CALCULATOR', jsonb_build_object('email', v_user_email), '1 day'::interval);
    PERFORM schedule_email(NEW.user_id, 'SRR_BUNDLE_PROPOSAL', jsonb_build_object('email', v_user_email), '3 days'::interval);
    PERFORM schedule_email(NEW.user_id, 'SRR_BUNDLE_RETENTION', jsonb_build_object('email', v_user_email), '5 days'::interval);
    PERFORM schedule_email(NEW.user_id, 'SRR_BUNDLE_EXAM', jsonb_build_object('email', v_user_email), '7 days'::interval);
    
    PERFORM create_nudge(NEW.user_id, 'srr_start_module_1', 'Start here: Module 1 (15 min)', 'Begin your journey to recurring revenue with the foundations.', 'Start Module 1', '/learn/selling-recurring-revenue', 100);
    
  ELSE
    -- COURSE-ONLY BUYER SEQUENCE
    PERFORM schedule_email(NEW.user_id, 'SRR_PURCHASED_ACCESS', jsonb_build_object('email', v_user_email, 'course_slug', 'selling-recurring-revenue'), '0 seconds'::interval);
    PERFORM schedule_email(NEW.user_id, 'SRR_TOOLKIT_UPSELL', jsonb_build_object('email', v_user_email, 'upsell_url', '/one-click-upsell/selling-recurring-revenue-pro-toolkit'), '2 hours'::interval);
    PERFORM schedule_email(NEW.user_id, 'SRR_FIRST_OFFER', jsonb_build_object('email', v_user_email), '2 days'::interval);
    PERFORM schedule_email(NEW.user_id, 'SRR_OBJECTIONS', jsonb_build_object('email', v_user_email), '4 days'::interval);
    PERFORM schedule_email(NEW.user_id, 'SRR_FINISH_EXAM', jsonb_build_object('email', v_user_email), '7 days'::interval);
    
    PERFORM create_nudge(NEW.user_id, 'srr_start_module_1', 'Start here: Module 1 (15 min)', 'Begin your journey to recurring revenue with the foundations.', 'Start Module 1', '/learn/selling-recurring-revenue', 100);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_schedule_srr_sequence ON enrollments;
CREATE TRIGGER trigger_schedule_srr_sequence
  AFTER INSERT ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION schedule_srr_sequence();

-- Function: Handle lesson completion nudges
CREATE OR REPLACE FUNCTION public.handle_lesson_completion_nudge()
RETURNS trigger AS $$
DECLARE
  v_course_slug text;
  v_module_index int;
  v_lesson_index int;
  v_completed_count int;
  v_total_lessons int;
BEGIN
  IF NEW.completed = false THEN
    RETURN NEW;
  END IF;
  
  SELECT c.slug INTO v_course_slug
  FROM course_lessons cl
  JOIN courses c ON c.id = cl.module_id
  WHERE cl.id = NEW.lesson_id;
  
  IF v_course_slug != 'selling-recurring-revenue' THEN
    RETURN NEW;
  END IF;
  
  SELECT cm.module_index, cl.lesson_index
  INTO v_module_index, v_lesson_index
  FROM course_lessons cl
  JOIN course_modules cm ON cm.id = cl.module_id
  WHERE cl.id = NEW.lesson_id;
  
  IF v_module_index = 1 AND v_lesson_index = 5 THEN
    PERFORM create_nudge(NEW.user_id, 'srr_build_tier_ladder', 'Build your tier ladder now', 'You have learned the foundations. Now create your pricing structure.', 'Start Module 2', '/learn/selling-recurring-revenue/lesson/build-your-three-tier-ladder', 90);
  END IF;
  
  SELECT COUNT(*) INTO v_completed_count FROM lesson_progress WHERE user_id = NEW.user_id AND course_id = NEW.course_id AND completed = true;
  SELECT COUNT(*) INTO v_total_lessons FROM course_lessons cl JOIN course_modules cm ON cm.id = cl.module_id WHERE cm.course_id = NEW.course_id;
  
  IF v_completed_count::float / NULLIF(v_total_lessons, 0) >= 0.8 THEN
    PERFORM create_nudge(NEW.user_id, 'srr_take_exam', 'Take the exam, get certified', 'You are almost done! Take the certification exam and start earning.', 'Take Exam', '/learn/selling-recurring-revenue/exam', 95);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_lesson_completion_nudge ON lesson_progress;
CREATE TRIGGER trigger_lesson_completion_nudge
  AFTER INSERT OR UPDATE ON lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION handle_lesson_completion_nudge();

-- Function: Handle exam pass
CREATE OR REPLACE FUNCTION public.handle_srr_exam_pass()
RETURNS trigger AS $$
DECLARE
  v_course_slug text;
  v_user_email text;
  v_has_toolkit boolean;
BEGIN
  IF NEW.passed = false THEN
    RETURN NEW;
  END IF;
  
  SELECT slug INTO v_course_slug FROM courses WHERE id = NEW.course_id;
  
  IF v_course_slug != 'selling-recurring-revenue' THEN
    RETURN NEW;
  END IF;
  
  SELECT email INTO v_user_email FROM auth.users WHERE id = NEW.user_id;
  
  SELECT EXISTS(
    SELECT 1 FROM user_entitlements 
    WHERE user_id = NEW.user_id 
    AND course_id = NEW.course_id
    AND entitlement LIKE '%toolkit%'
  ) INTO v_has_toolkit;
  
  IF v_has_toolkit THEN
    PERFORM schedule_email(NEW.user_id, 'SRR_BUNDLE_PARTNER', jsonb_build_object('email', v_user_email), '1 day'::interval);
    PERFORM create_nudge(NEW.user_id, 'srr_partner_preapproved', 'You are pre-approved for partner program', 'Start earning commissions by activating Partner CRM.', 'Activate Partner CRM', '/partner/crm/upgrade', 100);
  ELSE
    PERFORM schedule_email(NEW.user_id, 'SRR_CERTIFIED_CRM', jsonb_build_object('email', v_user_email), '1 day'::interval);
    PERFORM create_nudge(NEW.user_id, 'srr_certified_earn', 'Certified to earn commissions', 'Activate Partner CRM to start earning 30% on referrals.', 'Learn More', '/partner/crm/upgrade', 100);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_srr_exam_pass ON course_exam_attempts;
CREATE TRIGGER trigger_srr_exam_pass
  AFTER INSERT ON course_exam_attempts
  FOR EACH ROW
  EXECUTE FUNCTION handle_srr_exam_pass();

-- Function: Detect inactive course enrollments (call via cron or edge function)
CREATE OR REPLACE FUNCTION public.detect_inactive_srr_enrollments()
RETURNS void AS $$
DECLARE
  v_enrollment record;
  v_user_email text;
BEGIN
  FOR v_enrollment IN
    SELECT e.user_id, e.course_id, e.enrolled_at
    FROM enrollments e
    JOIN courses c ON c.id = e.course_id
    WHERE c.slug = 'selling-recurring-revenue'
    AND e.status = 'active'
    AND e.enrolled_at < now() - interval '48 hours'
    AND NOT EXISTS (SELECT 1 FROM lesson_progress lp WHERE lp.user_id = e.user_id AND lp.course_id = e.course_id)
    AND NOT EXISTS (SELECT 1 FROM email_queue eq WHERE eq.user_id = e.user_id AND eq.template_key = 'SRR_INACTIVE_START' AND eq.status IN ('queued', 'sent'))
  LOOP
    SELECT email INTO v_user_email FROM auth.users WHERE id = v_enrollment.user_id;
    PERFORM schedule_email(v_enrollment.user_id, 'SRR_INACTIVE_START', jsonb_build_object('email', v_user_email), '0 seconds'::interval);
    PERFORM create_nudge(v_enrollment.user_id, 'srr_quick_win', 'Quick win: do lesson 1 today', 'Get started with just 15 minutes. Complete the first lesson now.', 'Start Lesson 1', '/learn/selling-recurring-revenue/lesson/why-recurring-beats-one-time', 100);
  END LOOP;
  
  FOR v_enrollment IN
    SELECT DISTINCT lp.user_id, lp.course_id
    FROM lesson_progress lp
    JOIN course_lessons cl ON cl.id = lp.lesson_id
    JOIN course_modules cm ON cm.id = cl.module_id
    JOIN courses c ON c.id = cm.course_id
    WHERE c.slug = 'selling-recurring-revenue'
    AND lp.completed = false
    AND lp.created_at < now() - interval '5 days'
    AND NOT EXISTS (SELECT 1 FROM lesson_progress lp2 WHERE lp2.user_id = lp.user_id AND lp2.course_id = lp.course_id AND lp2.completed_at > now() - interval '5 days')
    AND NOT EXISTS (SELECT 1 FROM email_queue eq WHERE eq.user_id = lp.user_id AND eq.template_key = 'SRR_INACTIVE_MODULE' AND eq.created_at > now() - interval '5 days')
  LOOP
    SELECT email INTO v_user_email FROM auth.users WHERE id = v_enrollment.user_id;
    PERFORM schedule_email(v_enrollment.user_id, 'SRR_INACTIVE_MODULE', jsonb_build_object('email', v_user_email), '0 seconds'::interval);
    PERFORM create_nudge(v_enrollment.user_id, 'srr_momentum', 'Do not lose momentum', 'You are making progress. Continue where you left off.', 'Resume Course', '/learn/selling-recurring-revenue', 95);
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;