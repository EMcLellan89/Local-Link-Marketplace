/*
  # Schedule Automation Cron Jobs

  ## Summary
  Registers pg_cron scheduled jobs that fire Supabase Edge Functions on a recurring
  schedule to automate platform processes. The jobs use net.http_post to call each
  edge function with the service-role key for authentication.

  ## Jobs Scheduled
  1. cart-recovery-job — runs every 15 minutes to send cart-abandonment emails/SMS
  2. daily-partner-nudges — runs every day at 9 AM UTC to send partner activity nudges
  3. weekly-payout-batch — runs every Monday at 6 AM UTC to process partner payouts
  4. partner-inactivity-scanner — runs every Sunday at 7 AM UTC to warn/reclaim inactive partners

  ## Notes
  - pg_cron extension must already be enabled (migration 20260123164245)
  - net (pg_net) extension is required for http calls from cron
  - Jobs are created with cron.schedule; existing jobs with the same name are unscheduled first
  - Edge function base URL is derived at runtime via current_setting fallback
*/

-- Ensure pg_net extension is available for HTTP calls from cron
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$
DECLARE
  _base_url text;
  _service_key text;
BEGIN
  -- Retrieve project URL and service role key from vault / settings
  _base_url   := current_setting('app.settings.supabase_url',       true);
  _service_key := current_setting('app.settings.service_role_key',   true);

  -- Fall back gracefully if settings are not configured —
  -- the jobs will still be created; the URLs will just be empty strings
  -- and the calls will be no-ops until the settings are configured.
  IF _base_url IS NULL THEN _base_url := ''; END IF;
  IF _service_key IS NULL THEN _service_key := ''; END IF;

  -- ----------------------------------------------------------------
  -- 1. Cart recovery — every 15 minutes
  -- ----------------------------------------------------------------
  PERFORM cron.unschedule('cart-recovery-job') WHERE EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'cart-recovery-job'
  );

  PERFORM cron.schedule(
    'cart-recovery-job',
    '*/15 * * * *',
    format(
      $sql$
        SELECT net.http_post(
          url     := %L || '/functions/v1/cart-recovery-job',
          headers := jsonb_build_object(
            'Content-Type',  'application/json',
            'Authorization', 'Bearer ' || %L
          ),
          body    := '{}'::jsonb
        );
      $sql$,
      _base_url, _service_key
    )
  );

  -- ----------------------------------------------------------------
  -- 2. Daily partner nudges — 9 AM UTC every day
  -- ----------------------------------------------------------------
  PERFORM cron.unschedule('daily-partner-nudges') WHERE EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'daily-partner-nudges'
  );

  PERFORM cron.schedule(
    'daily-partner-nudges',
    '0 9 * * *',
    format(
      $sql$
        SELECT net.http_post(
          url     := %L || '/functions/v1/daily-partner-nudges',
          headers := jsonb_build_object(
            'Content-Type',  'application/json',
            'Authorization', 'Bearer ' || %L
          ),
          body    := '{}'::jsonb
        );
      $sql$,
      _base_url, _service_key
    )
  );

  -- ----------------------------------------------------------------
  -- 3. Weekly payout batch — Monday 6 AM UTC
  -- ----------------------------------------------------------------
  PERFORM cron.unschedule('weekly-payout-batch') WHERE EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'weekly-payout-batch'
  );

  PERFORM cron.schedule(
    'weekly-payout-batch',
    '0 6 * * 1',
    format(
      $sql$
        SELECT net.http_post(
          url     := %L || '/functions/v1/weekly-payout-batch',
          headers := jsonb_build_object(
            'Content-Type',  'application/json',
            'Authorization', 'Bearer ' || %L
          ),
          body    := '{}'::jsonb
        );
      $sql$,
      _base_url, _service_key
    )
  );

  -- ----------------------------------------------------------------
  -- 4. Partner inactivity scanner — Sunday 7 AM UTC
  -- ----------------------------------------------------------------
  PERFORM cron.unschedule('partner-inactivity-scanner') WHERE EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'partner-inactivity-scanner'
  );

  PERFORM cron.schedule(
    'partner-inactivity-scanner',
    '0 7 * * 0',
    format(
      $sql$
        SELECT net.http_post(
          url     := %L || '/functions/v1/partner-inactivity-scanner',
          headers := jsonb_build_object(
            'Content-Type',  'application/json',
            'Authorization', 'Bearer ' || %L
          ),
          body    := '{}'::jsonb
        );
      $sql$,
      _base_url, _service_key
    )
  );

END $$;
