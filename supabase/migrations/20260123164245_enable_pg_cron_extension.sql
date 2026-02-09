/*
  # Enable pg_cron Extension

  This migration enables the pg_cron extension for scheduled job execution.

  pg_cron allows you to run periodic jobs directly in PostgreSQL using cron syntax.

  Example usage:
  - Daily cleanup tasks
  - Hourly data aggregations
  - Weekly report generation
  - Monthly billing cycles
  - Automated reminders and notifications

  Basic cron job examples:
  1. Run every minute:
     SELECT cron.schedule('job-name', '* * * * *', 'SELECT my_function()');
  
  2. Run daily at 3am:
     SELECT cron.schedule('daily-cleanup', '0 3 * * *', 'DELETE FROM logs WHERE created_at < NOW() - INTERVAL ''30 days''');
  
  3. Run every hour:
     SELECT cron.schedule('hourly-sync', '0 * * * *', 'SELECT sync_data()');
  
  4. Run weekly on Sunday at midnight:
     SELECT cron.schedule('weekly-report', '0 0 * * 0', 'SELECT generate_weekly_report()');

  View scheduled jobs:
  SELECT * FROM cron.job;

  Unschedule a job:
  SELECT cron.unschedule('job-name');
*/

-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Grant usage to authenticated users (optional, for viewing jobs)
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA cron TO postgres;